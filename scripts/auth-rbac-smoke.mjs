import assert from "node:assert/strict";
import { chromium, expect } from "@playwright/test";

// Exercise the running live-mode UI with fixtures. Every external request is
// intercepted; this script never logs in to Cloud or writes business records.
const baseUrl = "http://localhost:3000";
const matrix = [
  ["/dashboard/admin", true, true, false, false],
  ["/dashboard/contador", true, true, true, false],
  ["/dashboard/propietario", true, true, true, true],
  ["/propiedades", true, true, true, false],
  ["/herederos", true, true, true, false],
  ["/recaudos", true, true, true, false],
  ["/gastos", true, true, true, false],
  ["/solicitudes", true, true, true, true],
  ["/liquidacion", true, true, true, false],
  ["/auditoria", true, true, true, false],
];
const roles = [
  ["platform_admin", "/dashboard/admin", "Soporte ATRIA"],
  ["estate_admin", "/dashboard/admin", "Administracion"],
  ["accountant", "/dashboard/contador", "Gestion contable"],
  ["owner_readonly", "/dashboard/propietario", "Propietario"],
];
const loadingText = "Verificando sesión segura...";
const deniedText = "No tienes permisos para esta vista.";
let activeCheck = "browser startup";
let browser;
let checks = 0;
let diagnosticPage;
let diagnosticState;

async function fixtureContext(role, index) {
  const context = await browser.newContext();
  const userId = `10000000-0000-4000-8000-${String(index + 1).padStart(12, "0")}`;
  const user = {
    id: userId,
    aud: "authenticated",
    role: "authenticated",
    email: `${role}@atria.test`,
    app_metadata: {},
    user_metadata: {},
    created_at: "2026-06-01T00:00:00Z",
  };
  const expiresAt = Math.floor(Date.now() / 1000) + 3600;
  const jwtPart = (value) =>
    Buffer.from(JSON.stringify(value)).toString("base64url");
  const session = {
    access_token: [
      jwtPart({ alg: "HS256", typ: "JWT" }),
      jwtPart({
        sub: userId,
        aud: "authenticated",
        role: "authenticated",
        exp: expiresAt,
      }),
      "fixture-only",
    ].join("."),
    refresh_token: "fixture-only",
    token_type: "bearer",
    expires_in: 3600,
    expires_at: expiresAt,
    user,
  };
  const state = {
    membershipCalls: 0,
    loginCalls: 0,
    unscopedQueries: 0,
    duplicateClients: 0,
    unexpectedRequests: 0,
    pageErrors: 0,
    holdMemberships: false,
    missingMembership: false,
    releases: [],
  };

  await context.route("**/*", async (route) => {
    const url = new URL(route.request().url());
    if (url.origin === baseUrl) return route.continue();
    if (url.pathname.endsWith("/auth/v1/token")) {
      state.loginCalls++;
      return route.fulfill({ json: session });
    }
    if (url.pathname.endsWith("/auth/v1/user")) {
      return route.fulfill({ json: user });
    }
    if (url.pathname.endsWith("/auth/v1/logout")) {
      return route.fulfill({ status: 204 });
    }
    if (url.pathname.endsWith("/rest/v1/memberships")) {
      state.membershipCalls++;
      if (url.searchParams.get("profile_id") !== `eq.${userId}`) {
        state.unscopedQueries++;
      }
      if (state.holdMemberships) {
        await new Promise((resolve) => state.releases.push(resolve));
      }
      return route.fulfill({
        json: state.missingMembership
          ? []
          : [
              {
                organization_id: "20000000-0000-4000-8000-000000000001",
                role,
              },
            ],
      });
    }
    if (
      url.pathname.includes("/rest/v1/") &&
      ["GET", "HEAD"].includes(route.request().method())
    ) {
      return route.fulfill({ json: [] });
    }
    state.unexpectedRequests++;
    return route.abort();
  });
  const page = await context.newPage();
  diagnosticPage = page;
  diagnosticState = state;
  page.on("pageerror", () => state.pageErrors++);
  page.on("console", (message) => {
    if (message.text().includes("Multiple GoTrueClient instances")) {
      state.duplicateClients++;
    }
  });
  return { context, page, state, user };
}

async function login(page, user, defaultRoute) {
  activeCheck = "fixture login: form";
  await page.goto(`${baseUrl}/login`, { waitUntil: "domcontentloaded" });
  activeCheck = "fixture login: submit button";
  const submit = page.getByRole("button", { name: "Ingresar", exact: true });
  // DOMContentLoaded can precede React hydration in the development server.
  // Retry filling until the controlled form actually enables submission.
  await expect(async () => {
    await page.locator("#email").fill(user.email);
    await page.locator("#password").fill("fixture-only");
    await expect(submit).toBeEnabled({ timeout: 1000 });
  }).toPass({ timeout: 15000 });
  activeCheck = "fixture login: redirect";
  // Login uses a full document navigation, including when a missing role sends
  // the user back to /login. Subscribe before clicking to cover that same URL.
  await Promise.all([
    page.waitForEvent("framenavigated", {
      predicate: (frame) =>
        frame === page.mainFrame() &&
        frame.url() === `${baseUrl}${defaultRoute}`,
    }),
    submit.click(),
  ]);
  await page.waitForLoadState("domcontentloaded");
  if (defaultRoute !== "/login") {
    await expect(page.locator(`nav a[href="${defaultRoute}"]`)).toBeVisible();
    await expect(page.getByText(loadingText, { exact: true })).toBeHidden();
  }
}

function releaseMemberships(state) {
  state.holdMemberships = false;
  state.releases.splice(0).forEach((resolve) => resolve());
}

function assertHealthy(state) {
  assert.equal(state.unscopedQueries, 0);
  assert.equal(state.duplicateClients, 0);
  assert.equal(state.unexpectedRequests, 0);
  assert.equal(state.pageErrors, 0);
}

try {
  browser = await chromium.launch({
    channel: process.env.AUTH_RBAC_BROWSER ?? "msedge",
    headless: true,
  });
  for (const [index, [role, defaultRoute, roleLabel]] of roles.entries()) {
    activeCheck = `${role}: login and membership`;
    const { context, page, state, user } = await fixtureContext(role, index);
    await login(page, user, defaultRoute);
    activeCheck = `${role}: session label`;
    await page.goto(`${baseUrl}/login`, { waitUntil: "domcontentloaded" });
    await expect(
      page.getByText("Sesión iniciada", { exact: true }),
    ).toBeVisible();
    await expect(page.getByText(`${user.email} · ${roleLabel}`)).toBeVisible();
    activeCheck = `${role}: bounded membership queries`;
    const queriesBeforeIdle = state.membershipCalls;
    await page.waitForTimeout(500);
    // Two page loads plus sign-in may read membership a few times, never a loop.
    assert.ok(state.membershipCalls <= 8);
    assert.ok(state.membershipCalls - queriesBeforeIdle <= 1);
    checks++;

    for (const [path, ...allowed] of matrix) {
      activeCheck = `${role}: ${path}`;
      const link = page.locator(`nav a[href="${path}"]`);
      if (allowed[index]) {
        await expect(link).toBeVisible();
        await link.click();
        await page.waitForURL(`${baseUrl}${path}`);
        await expect(page.getByText(loadingText, { exact: true })).toBeHidden();
        await expect(page.getByText(deniedText, { exact: true })).toBeHidden();
        assert.equal(new URL(page.url()).pathname, path);
      } else {
        await expect(link).toHaveCount(0);
        await page.goto(`${baseUrl}${path}`, { waitUntil: "domcontentloaded" });
        await page.waitForURL(`${baseUrl}${defaultRoute}`);
        await expect(
          page.locator(`nav a[href="${defaultRoute}"]`),
        ).toBeVisible();
      }
      checks++;
    }

    if (role === "platform_admin") {
      activeCheck = "platform_admin: slow membership does not redirect";
      state.holdMemberships = true;
      await page.goto(`${baseUrl}/propiedades`, {
        waitUntil: "domcontentloaded",
      });
      await expect(page.getByText(loadingText, { exact: true })).toBeVisible();
      assert.equal(new URL(page.url()).pathname, "/propiedades");
      await expect(page.getByText(deniedText, { exact: true })).toBeHidden();
      releaseMemberships(state);
      await expect(page.getByText(loadingText, { exact: true })).toBeHidden();
      await expect(page.getByText("CRUD base de propiedades")).toBeVisible();
      checks++;

      activeCheck = "logout ignores a late membership response";
      state.holdMemberships = true;
      await page.goto(`${baseUrl}/login`, { waitUntil: "domcontentloaded" });
      await expect(
        page.getByText("Sesión iniciada", { exact: true }),
      ).toBeVisible();
      await page.getByRole("button", { name: "Cerrar sesión" }).click();
      await expect(page.locator("#email")).toBeVisible();
      releaseMemberships(state);
      await page.waitForTimeout(250);
      await expect(page.locator('nav a[href="/dashboard/admin"]')).toHaveCount(
        0,
      );
      checks++;

      activeCheck = "missing membership stays blocked without a redirect loop";
      state.missingMembership = true;
      await login(page, user, "/login");
      await expect(
        page.getByText("Sin rol asignado", { exact: false }),
      ).toBeVisible();
      await page.goto(`${baseUrl}/propiedades`, {
        waitUntil: "domcontentloaded",
      });
      await page.waitForURL(`${baseUrl}/login`);
      await expect(page.locator('nav a[href="/propiedades"]')).toHaveCount(0);
      checks++;
    }

    assertHealthy(state);
    console.log(
      JSON.stringify({
        role,
        routesChecked: matrix.length,
        membershipCalls: state.membershipCalls,
        unscopedQueries: state.unscopedQueries,
        duplicateClients: state.duplicateClients,
        unexpectedRequests: state.unexpectedRequests,
        pageErrors: state.pageErrors,
      }),
    );
    await context.close();
  }
  activeCheck = "anonymous access";
  const { context, page, state } = await fixtureContext("anonymous", 4);
  for (const [path] of matrix) {
    await page.goto(`${baseUrl}${path}`, { waitUntil: "domcontentloaded" });
    await page.waitForURL(`${baseUrl}/login`);
    await expect(page.locator("#email")).toBeVisible();
    checks++;
  }
  assertHealthy(state);
  await context.close();
  console.log(JSON.stringify({ pass: true, checks, cloudRequestsSent: 0 }));
} catch (error) {
  // No request headers, session values, browser storage, or account data in logs.
  console.log(
    JSON.stringify({
      pass: false,
      check: activeCheck,
      errorType: error.name,
      interruptedNavigation: /interrupted.*navigation/i.test(error.message),
      contextDestroyed: /context.*destroyed/i.test(error.message),
      path: diagnosticPage ? new URL(diagnosticPage.url()).pathname : null,
      loginCalls: diagnosticState?.loginCalls,
      membershipCalls: diagnosticState?.membershipCalls,
      unscopedQueries: diagnosticState?.unscopedQueries,
      duplicateClients: diagnosticState?.duplicateClients,
      unexpectedRequests: diagnosticState?.unexpectedRequests,
      pageErrors: diagnosticState?.pageErrors,
      emailInputCount: await diagnosticPage?.locator("#email").count(),
      emailInputEnabled: await diagnosticPage
        ?.locator("#email")
        .isEnabled()
        .catch(() => false),
      loginButtonCount: await diagnosticPage
        ?.getByRole("button", { name: "Ingresar", exact: true })
        .count(),
      liveMode: await diagnosticPage
        ?.getByText("Producción activa", { exact: true })
        .count(),
      missingConfig: await diagnosticPage
        ?.getByText("Falta configurar la conexión segura del sistema.", {
          exact: true,
        })
        .count(),
    }),
  );
  process.exitCode = 1;
} finally {
  if (browser) await browser.close();
}
