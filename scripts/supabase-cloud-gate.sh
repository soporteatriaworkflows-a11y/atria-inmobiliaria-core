#!/usr/bin/env bash
#
# supabase-cloud-gate.sh
# -----------------------------------------------------------------------------
# Safe re-run helper for the Supabase Cloud Activation Gate.
#
# WHY THIS EXISTS
#   The previous gate was halted because the Supabase CLI printed sensitive API
#   keys to the console during a parse failure (see
#   docs/48_SUPABASE_CLOUD_ACTIVATION_GATE.md). This script re-runs the gate
#   WITHOUT ever printing secrets.
#
# HARD SECURITY RULES ENFORCED HERE
#   * NEVER runs `supabase projects api-keys` (that was the leak vector). It is
#     not present in this file and must not be added.
#   * NEVER echoes the DB connection string, passwords, API keys or JWTs.
#   * Only emits labels + aggregate counts / PASS-FAIL lines.
#   * Any command output that could contain a secret is captured, redacted, and
#     discarded — never streamed raw to the console.
#   * No Cloud/remote operation runs unless you pass --confirm-cloud.
#   * Applying the Cloud migration requires the additional --apply-migration flag.
#   * Uses only the DB connection string (a backend admin credential) for read
#     aggregates. It never uses, reads, or prints a service_role API key, and it
#     never touches the frontend.
#
# USAGE
#   scripts/supabase-cloud-gate.sh                 # local-only: preflight + migration audit
#   scripts/supabase-cloud-gate.sh --confirm-cloud # + linked migration list + aggregate smoke
#   scripts/supabase-cloud-gate.sh --confirm-cloud --apply-migration  # + db push
#
# The DB connection string must be provided via the SUPABASE_DB_URL environment
# variable, or an SUPABASE_DB_URL= line in .env.local (git-ignored). It is read
# silently and never printed. Get it from the Supabase dashboard:
#   Project Settings -> Database -> Connection string (URI). Prefer the pooler
#   / a least-privileged role where possible.
# -----------------------------------------------------------------------------

set -euo pipefail

# --- flags -------------------------------------------------------------------
CONFIRM_CLOUD=0
APPLY_MIGRATION=0
for arg in "$@"; do
  case "$arg" in
    --confirm-cloud)   CONFIRM_CLOUD=1 ;;
    --apply-migration) APPLY_MIGRATION=1 ;;
    -h|--help)
      sed -n '2,45p' "$0" | sed 's/^# \{0,1\}//'
      exit 0 ;;
    *)
      echo "Unknown argument: $arg (use --help)" >&2
      exit 2 ;;
  esac
done

# --- constants ---------------------------------------------------------------
EXPECTED_REF="bzoqbjcktoyngvszcwhl"
EXPECTED_BRANCH="feature/auth-rbac-crud-foundation"
MIGRATION_ID="202606270001"
MIGRATION_FILE="supabase/migrations/202606270001_owner_scope_rls.sql"
ARTIFACT_DIR="artifacts/supabase-cloud-activation"
LOG_FILE="${ARTIFACT_DIR}/gate-run-$(date +%Y%m%d-%H%M%S).log"
SUPABASE="pnpm exec supabase"

FAILED=0

# --- output helpers (never receive secrets) ----------------------------------
say()     { printf '%s\n' "$*"; }
section() { printf '\n=== %s ===\n' "$*"; }
pass()    { printf '  [PASS] %s\n' "$*"; }
warn() { printf '  [WARN] %s\n' "$*"; }
fail() { printf '  [FAIL] %s\n' "$*"; FAILED=1; }

# Redact anything secret-shaped before any text reaches the console/log.
redact() {
  sed -E \
    -e 's#(postgres(ql)?://)[^[:space:]]*#\1<REDACTED_DB_URL>#g' \
    -e 's#eyJ[A-Za-z0-9_-]{10,}#<REDACTED_JWT>#g' \
    -e 's#sb_(secret|publishable)_[A-Za-z0-9_-]+#sb_\1_<REDACTED>#g' \
    -e 's#(password|secret|api[_-]?key)[=: ]+[^[:space:]]+#\1=<REDACTED>#gI'
}

mkdir -p "$ARTIFACT_DIR"
: > "$LOG_FILE"
# Mirror all console output into a git-ignored, redacted log.
exec > >(redact | tee -a "$LOG_FILE") 2> >(redact | tee -a "$LOG_FILE" >&2)

say "Supabase Cloud Activation Gate — safe re-run"
say "Timestamp: $(date -u +%Y-%m-%dT%H:%M:%SZ)"
say "Mode: local-audit$([ "$CONFIRM_CLOUD" = 1 ] && echo ' + cloud-read')$([ "$APPLY_MIGRATION" = 1 ] && echo ' + apply-migration')"

# =============================================================================
# PHASE 0 — Preflight (local only, always runs)
# =============================================================================
section "Phase 0 — Preflight (local)"

if $SUPABASE --version >/dev/null 2>&1; then
  pass "Supabase CLI reachable via pnpm exec ($($SUPABASE --version 2>/dev/null | head -1))"
else
  fail "Supabase CLI not reachable via 'pnpm exec supabase'"
fi

CUR_BRANCH="$(git rev-parse --abbrev-ref HEAD 2>/dev/null || echo unknown)"
if [ "$CUR_BRANCH" = "$EXPECTED_BRANCH" ]; then
  pass "On expected branch: $CUR_BRANCH"
else
  fail "Unexpected branch: $CUR_BRANCH (expected $EXPECTED_BRANCH)"
fi

# No secret VALUES in tracked files (defense-in-depth; matches shapes, not prose).
# Deliberately narrow: real JWTs (header.payload), sb_secret_ keys, and postgres
# URIs that embed credentials. Keyword mentions in docs must NOT trip this.
if git ls-files -z | xargs -0 -r grep -lIE \
     'eyJ[A-Za-z0-9_-]{15,}\.[A-Za-z0-9_-]{15,}|sb_secret_[A-Za-z0-9]{10,}|postgres(ql)?://[^[:space:]:/]+:[^[:space:]@]+@' \
     2>/dev/null | grep -vE '\.example$|secret-scan\.test\.|supabase-cloud-gate\.sh$' > /tmp/gate_secrets.tmp; then
  fail "Possible secret-shaped content in tracked files:"
  redact < /tmp/gate_secrets.tmp
else
  pass "No secret-shaped content found in tracked files"
fi
rm -f /tmp/gate_secrets.tmp

# Project link status (does NOT print the ref's keys).
REF_FILE="supabase/.temp/project-ref"
if [ -f "$REF_FILE" ]; then
  LINKED_REF="$(tr -d '[:space:]' < "$REF_FILE")"
  if [ "$LINKED_REF" = "$EXPECTED_REF" ]; then
    pass "Project linked to expected ref"
  else
    fail "Linked ref does not match expected ($EXPECTED_REF)"
  fi
else
  warn "Project not linked on this machine (no $REF_FILE)."
  warn "Run:  $SUPABASE link --project-ref $EXPECTED_REF   (needs a Supabase access token; do not paste it here)"
fi

# =============================================================================
# PHASE 1 — RLS migration audit (local only, always runs)
# =============================================================================
section "Phase 1 — RLS migration audit ($MIGRATION_ID)"

if [ ! -f "$MIGRATION_FILE" ]; then
  fail "Migration file missing: $MIGRATION_FILE"
else
  pass "Migration file present"
  # Destructive / dangerous patterns must NOT appear.
  declare -a BAD=('DROP TABLE' 'DROP SCHEMA' 'TRUNCATE' 'DELETE FROM' 'DISABLE ROW LEVEL SECURITY')
  for pat in "${BAD[@]}"; do
    if grep -iq "$pat" "$MIGRATION_FILE"; then
      fail "Migration contains forbidden pattern: $pat"
    else
      pass "No '$pat'"
    fi
  done
  # Secret material must NOT be embedded in the migration.
  if grep -iqE 'service_role|password|sb_secret_|api[_-]?key' "$MIGRATION_FILE"; then
    fail "Migration references secret-shaped keyword"
  else
    pass "No secret-shaped keywords"
  fi
  # Expected idempotent replacement of RLS (informational).
  if grep -iq 'DROP POLICY IF EXISTS' "$MIGRATION_FILE"; then
    pass "Uses 'DROP POLICY IF EXISTS' (expected for RLS replacement)"
  fi
fi

# =============================================================================
# PHASE 2 — Cloud read checks (requires --confirm-cloud)
# =============================================================================
if [ "$CONFIRM_CLOUD" = 1 ]; then
  section "Phase 2 — Cloud read checks (linked)"

  # 2a. Migration list — prints version rows only, never secrets.
  if $SUPABASE migration list --linked > /tmp/gate_miglist.tmp 2>&1; then
    if grep -q "$MIGRATION_ID" /tmp/gate_miglist.tmp; then
      pass "Migration $MIGRATION_ID visible in linked migration list"
      # Heuristic: flag if it still looks pending (present locally, blank remote col).
      say "  (review applied/pending columns below)"
      redact < /tmp/gate_miglist.tmp | sed 's/^/    /'
    else
      warn "Migration $MIGRATION_ID not found in list output"
    fi
  else
    fail "supabase migration list --linked failed (output redacted below)"
    # Common causes: project paused/reactivating, or not linked on this machine.
    if grep -qiE 'paus|not.*active|could not connect|timeout|refused|link' /tmp/gate_miglist.tmp; then
      warn "Hint: the Cloud project may be PAUSED/reactivating, or not linked here."
      warn "  - Unpause it in the dashboard and wait until it reports active, then retry."
      warn "  - If unlinked: $SUPABASE link --project-ref $EXPECTED_REF (needs an access token; do not paste it here)."
    fi
    redact < /tmp/gate_miglist.tmp | sed 's/^/    /'
  fi
  rm -f /tmp/gate_miglist.tmp

  # 2b. Aggregate smoke via DB URL (never printed). Counts only.
  # Load SUPABASE_DB_URL from env or .env.local silently.
  if [ -z "${SUPABASE_DB_URL:-}" ] && [ -f .env.local ]; then
    SUPABASE_DB_URL="$(grep -E '^SUPABASE_DB_URL=' .env.local | tail -1 | cut -d= -f2- | sed -E 's/^"(.*)"$/\1/')"
  fi

  if [ -z "${SUPABASE_DB_URL:-}" ]; then
    warn "SUPABASE_DB_URL not set — skipping aggregate smoke."
    warn "Provide it via env var or an SUPABASE_DB_URL= line in .env.local (git-ignored). It will not be printed."
  elif ! command -v psql >/dev/null 2>&1; then
    warn "psql not found on PATH — skipping aggregate smoke (install PostgreSQL client)."
  else
    # run_count LABEL SQL EXPECT_OP EXPECT_VAL
    run_count() {
      local label="$1" sql="$2" op="${3:-}" expect="${4:-}"
      local out err
      err="$(mktemp)"
      if out="$(psql "$SUPABASE_DB_URL" -tAc "$sql" 2>"$err")"; then
        out="$(printf '%s' "$out" | tr -d '[:space:]')"
        case "$op" in
          ge) if [ "${out:-0}" -ge "$expect" ] 2>/dev/null; then pass "$label = $out (>= $expect)"; else fail "$label = $out (expected >= $expect)"; fi ;;
          eq) if [ "${out:-x}" = "$expect" ]; then pass "$label = $out"; else fail "$label = $out (expected $expect)"; fi ;;
          *)  say "  [INFO] $label = $out" ;;
        esac
      else
        fail "$label query failed (redacted error below)"
        redact < "$err" | sed 's/^/      /'
      fi
      rm -f "$err"
    }

    # Presence / lockout aggregates (no personal rows selected).
    run_count "organization_count" "select count(*) from public.organizations;" info
    run_count "admin_memberships (platform_admin/estate_admin)" \
      "select count(*) from public.memberships where role in ('platform_admin','estate_admin');" ge 1
    run_count "fixture_admin_ready" \
      "select count(*) from public.memberships m join public.profiles p on p.id=m.profile_id where m.role='platform_admin';" info

    # Migration-applied verification via catalog metadata (no data rows).
    run_count "rls_functions_present" \
      "select count(*) from pg_proc where pronamespace='public'::regnamespace and proname in ('is_org_admin','is_owner_readonly','can_access_property','can_view_profile','can_view_membership');" ge 5
    run_count "owner_scope_policies_present" \
      "select count(*) from pg_policies where schemaname='public' and policyname in ('scoped properties are visible','scoped expenses are visible','scoped rent collections are visible','scoped change requests are visible','scoped memberships are visible');" ge 5
  fi
else
  section "Phase 2 — Cloud read checks"
  say "  (skipped — pass --confirm-cloud to run linked checks)"
fi

# =============================================================================
# PHASE 3 — Apply migration (requires --confirm-cloud AND --apply-migration)
# =============================================================================
if [ "$APPLY_MIGRATION" = 1 ]; then
  if [ "$CONFIRM_CLOUD" != 1 ]; then
    fail "--apply-migration requires --confirm-cloud as well. Refusing."
  else
    section "Phase 3 — Apply migration to Cloud (db push)"
    warn "This writes DDL to the linked Cloud database. Ensure a backup/rollback plan exists."
    if $SUPABASE db push --linked > /tmp/gate_push.tmp 2>&1; then
      pass "supabase db push --linked completed"
      redact < /tmp/gate_push.tmp | sed 's/^/    /'
    else
      fail "supabase db push --linked failed (redacted output below)"
      redact < /tmp/gate_push.tmp | sed 's/^/    /'
    fi
    rm -f /tmp/gate_push.tmp
  fi
else
  section "Phase 3 — Apply migration"
  say "  (skipped — pass --confirm-cloud --apply-migration to db push)"
fi

# =============================================================================
# Summary
# =============================================================================
section "Summary"
if [ "$FAILED" = 0 ]; then
  say "  RESULT: PASS (no failures in the phases that ran)"
else
  say "  RESULT: FAIL (see [FAIL] lines above)"
fi
say "  Redacted log written to: $LOG_FILE"
say ""
say "  Reminder: this script never rotates or prints API keys. Key rotation is a"
say "  manual dashboard action. Do not paste any key into the repo or this shell."

exit "$FAILED"
