import assert from "node:assert/strict";
import { chromium, expect as playwrightExpect } from "@playwright/test";
const expect = playwrightExpect.configure({ timeout: 20000 });

// All external traffic is intercepted. Records and identities are QA fixtures.
const base = "http://localhost:3000";
const org = "20000000-0000-4000-8000-000000000001";
const uid = "10000000-0000-4000-8000-000000000001";
let checks = 0;
let stage = "startup";
const browser = await chromium.launch({ channel: "msedge", headless: true });
async function setup(role = "platform_admin") {
  const context = await browser.newContext();
  const user = {
    id: uid,
    email: role + "@atria.test",
    aud: "authenticated",
    role: "authenticated",
    app_metadata: {},
    user_metadata: {},
  };
  const exp = Math.floor(Date.now() / 1000) + 3600;
  const enc = (value) =>
    Buffer.from(JSON.stringify(value)).toString("base64url");
  const session = {
    access_token: [
      enc({ alg: "HS256", typ: "JWT" }),
      enc({ sub: uid, aud: "authenticated", role: "authenticated", exp }),
      "qa-fixture",
    ].join("."),
    refresh_token: "qa-fixture",
    expires_in: 3600,
    expires_at: exp,
    token_type: "bearer",
    user,
  };
  const state = {
    properties: [],
    rent_collections: [],
    expenses: [],
    change_requests: [],
    posts: [],
    reads: [],
    failRead: false,
    failWrite: false,
    failAfterWrite: false,
    delay: 0,
    pageErrors: 0,
  };
  await context.route("**/*", async (route) => {
    const req = route.request();
    const url = new URL(req.url());
    if (url.origin === base) return route.continue();
    if (url.pathname.endsWith("/auth/v1/token"))
      return route.fulfill({ json: session });
    if (url.pathname.endsWith("/auth/v1/user"))
      return route.fulfill({ json: user });
    if (url.pathname.endsWith("/rest/v1/memberships"))
      return route.fulfill({ json: [{ organization_id: org, role }] });
    const table = url.pathname.split("/").at(-1);
    if (
      ![
        "properties",
        "rent_collections",
        "expenses",
        "change_requests",
      ].includes(table)
    )
      return route.abort();
    if (req.method() === "GET") {
      assert.equal(url.searchParams.get("organization_id"), "eq." + org);
      state.reads.push({
        table,
        requestedBy: url.searchParams.get("requested_by"),
      });
      if (state.delay)
        await new Promise((resolve) => setTimeout(resolve, state.delay));
      if (state.failRead)
        return route.fulfill({
          status: 503,
          json: { message: "QA read failure" },
        });
      const id = url.searchParams.get("id")?.slice(3);
      if (id)
        return route.fulfill({
          json: state[table].find((row) => row.id === id) ?? null,
        });
      let rows = state[table];
      if (url.searchParams.has("requested_by"))
        rows = rows.filter((row) => row.requested_by === uid);
      const offset = Number(url.searchParams.get("offset") ?? 0);
      const limit = Number(url.searchParams.get("limit") ?? 1000);
      return route.fulfill({ json: rows.slice(offset, offset + limit) });
    }
    assert.equal(req.method(), "POST");
    const body = req.postDataJSON();
    state.posts.push({ table, body });
    assert.equal(body.organization_id, org);
    if (state.failWrite)
      return route.fulfill({
        status: 403,
        json: { code: "42501", message: "QA denied" },
      });
    if (state.delay)
      await new Promise((resolve) => setTimeout(resolve, state.delay));
    const row = {
      ...body,
      id: "qa-" + state.posts.length,
      created_at: "2026-09-01T12:00:00Z",
    };
    if (body.property_id)
      row.properties = state.properties.find((p) => p.id === body.property_id);
    state[table].unshift(row);
    if (state.failAfterWrite) state.failRead = true;
    return route.fulfill({ status: 201, json: { id: row.id } });
  });
  const page = await context.newPage();
  page.on("pageerror", () => state.pageErrors++);
  await page.goto(base + "/login");
  const submit = page.getByRole("button", { name: "Ingresar", exact: true });
  await expect(async () => {
    await page.locator("#email").fill(user.email);
    await page.locator("#password").fill("qa-fixture");
    await expect(submit).toBeEnabled({ timeout: 1000 });
  }).toPass({ timeout: 15000 });
  await submit.click();
  await page.waitForURL("**/dashboard/**");
  return { page, context, state };
}
async function visit(page, path) {
  await page.goto(base + path);
  await expect(
    page.getByText("Verificando sesión segura...", { exact: true }),
  ).toBeHidden();
}
async function properties() {
  const { page, context, state } = await setup();
  stage = "properties empty, real list, no demo";
  state.delay = 400;
  await visit(page, "/propiedades");
  await expect(
    page.getByText("Cargando registros...", { exact: true }),
  ).toBeVisible();
  await expect(
    page.getByText("No hay propiedades registradas en esta organización."),
  ).toBeVisible();
  await expect(
    page.getByText("CRUD base de propiedades", { exact: true }),
  ).toHaveCount(0);
  checks++;
  stage = "properties create, double submit, reload persistence";
  await page
    .getByLabel("Nombre de propiedad", { exact: true })
    .fill("QA propiedad");
  await page.getByLabel("Código de propiedad", { exact: true }).fill("QA-P0");
  await page.locator("form").evaluate((form) => {
    form.requestSubmit();
    form.requestSubmit();
  });
  await expect(
    page.getByText("Propiedad guardada correctamente."),
  ).toBeVisible();
  await expect(page.getByText("QA propiedad", { exact: true })).toBeVisible();
  assert.equal(state.posts.length, 1);
  await page.reload();
  await expect(page.getByText("QA propiedad", { exact: true })).toBeVisible();
  checks++;
  stage = "properties RLS error retains form";
  state.failWrite = true;
  await page
    .getByLabel("Nombre de propiedad", { exact: true })
    .fill("QA conservar");
  await page.getByLabel("Código de propiedad", { exact: true }).fill("QA-P1");
  await page
    .getByRole("button", { name: "Crear propiedad", exact: true })
    .click();
  await expect(
    page.getByRole("alert").filter({ hasText: "permiso" }),
  ).toBeVisible();
  await expect(
    page.getByLabel("Nombre de propiedad", { exact: true }),
  ).toHaveValue("QA conservar");
  await expect(page.getByText("Propiedad guardada correctamente.")).toHaveCount(
    0,
  );
  checks++;
  stage = "properties read error and retry";
  state.failRead = true;
  await page
    .getByRole("button", { name: "Actualizar listado", exact: true })
    .click();
  await expect(
    page.getByRole("button", { name: "Reintentar consulta" }),
  ).toBeVisible();
  await expect(
    page.getByText("No hay propiedades registradas en esta organización."),
  ).toHaveCount(0);
  state.failRead = false;
  await page.getByRole("button", { name: "Reintentar consulta" }).click();
  await expect(page.getByText("QA propiedad", { exact: true })).toBeVisible();
  checks++;
  stage = "properties confirmed insert followed by failed refresh";
  state.failWrite = false;
  state.failAfterWrite = true;
  await page
    .getByRole("button", { name: "Crear propiedad", exact: true })
    .click();
  await expect(
    page.getByText("Propiedad guardada correctamente."),
  ).toBeVisible();
  await expect(
    page.getByRole("button", { name: "Reintentar consulta" }),
  ).toBeVisible();
  assert.ok(state.reads.every((read) => read.table === "properties"));
  assert.equal(state.pageErrors, 0);
  checks++;
  await context.close();
  stage = "accountant properties read-only";
  const accountant = await setup("accountant");
  await visit(accountant.page, "/propiedades");
  await expect(
    accountant.page.getByText("Tu acceso permite consultar propiedades."),
  ).toBeVisible();
  await expect(
    accountant.page.getByRole("button", { name: "Crear propiedad" }),
  ).toHaveCount(0);
  assert.equal(accountant.state.posts.length, 0);
  await accountant.context.close();
  checks++;
}

async function finance() {
  const { page, context, state } = await setup("accountant");
  stage = "income requires property and hides demo metrics";
  await visit(page, "/recaudos");
  await expect(
    page.getByText("No hay ingresos registrados en esta organización."),
  ).toBeVisible();
  await expect(page.getByText("Total cobrado", { exact: true })).toHaveCount(0);
  await expect(
    page.getByText(
      "No hay propiedades disponibles. Solicita a administración crear una propiedad.",
    ),
  ).toBeVisible();
  await page.getByLabel("Monto en COP", { exact: true }).fill("10000");
  await expect(
    page.getByRole("button", { name: "Registrar ingreso", exact: true }),
  ).toBeDisabled();
  state.properties.push({
    id: "qa-property",
    code: "QA-P0",
    display_name: "QA propiedad",
    status: "active",
  });
  await page
    .getByRole("button", { name: "Actualizar propiedades", exact: true })
    .click();
  await page
    .getByLabel("Propiedad del ingreso", { exact: true })
    .selectOption("qa-property");
  await page.getByLabel("Periodo", { exact: true }).fill("2026-09");
  for (const amount of ["0", "-1", "1.5", "1e3"]) {
    await page.getByLabel("Monto en COP", { exact: true }).fill(amount);
    await expect(
      page.getByRole("button", { name: "Registrar ingreso", exact: true }),
    ).toBeDisabled();
  }
  assert.equal(state.posts.length, 0);
  checks++;
  stage = "income persists draft, scoped property, reload";
  await page.getByLabel("Monto en COP", { exact: true }).fill("10000");
  await page
    .getByRole("button", { name: "Registrar ingreso", exact: true })
    .click();
  await expect(page.getByText("Ingreso guardado como borrador.")).toBeVisible();
  assert.equal(state.posts[0].body.status, "draft");
  assert.equal(state.posts[0].body.property_id, "qa-property");
  assert.equal(state.posts[0].body.amount_cop, 10000);
  await page.reload();
  await expect(page.getByText("Borrador", { exact: true })).toBeVisible();
  checks++;
  stage = "income permission error preserves amount";
  state.failWrite = true;
  await page
    .getByLabel("Propiedad del ingreso", { exact: true })
    .selectOption("qa-property");
  await page.getByLabel("Monto en COP", { exact: true }).fill("20000");
  await page
    .getByRole("button", { name: "Registrar ingreso", exact: true })
    .click();
  await expect(
    page.getByRole("alert").filter({ hasText: "permiso" }),
  ).toBeVisible();
  await expect(page.getByLabel("Monto en COP", { exact: true })).toHaveValue(
    "20000",
  );
  checks++;
  stage = "expense global validation and persistence";
  state.failWrite = false;
  await visit(page, "/gastos");
  await expect(
    page.getByText("No hay gastos registrados en esta organización."),
  ).toBeVisible();
  await expect(page.getByText("Total gastos", { exact: true })).toHaveCount(0);
  await page.getByLabel("Monto en COP", { exact: true }).fill("10000");
  await expect(
    page.getByRole("button", { name: "Registrar gasto", exact: true }),
  ).toBeDisabled();
  await page
    .getByLabel("Descripción del gasto", { exact: true })
    .fill("QA gasto global");
  await page
    .getByRole("button", { name: "Registrar gasto", exact: true })
    .click();
  await expect(page.getByText("Gasto guardado como borrador.")).toBeVisible();
  await expect(
    page.getByText("QA gasto global", { exact: true }),
  ).toBeVisible();
  assert.equal(state.posts.at(-1).body.property_id, null);
  assert.equal(state.posts.at(-1).body.category, "global");
  checks++;
  stage = "expense associated with property";
  await page
    .getByLabel("Alcance del gasto", { exact: true })
    .selectOption("property");
  await page
    .getByLabel("Descripción del gasto", { exact: true })
    .fill("QA gasto propiedad");
  await page.getByLabel("Monto en COP", { exact: true }).fill("20000");
  await expect(
    page.getByRole("button", { name: "Registrar gasto", exact: true }),
  ).toBeDisabled();
  await page
    .getByLabel("Propiedad del gasto", { exact: true })
    .selectOption("qa-property");
  await page
    .getByRole("button", { name: "Registrar gasto", exact: true })
    .click();
  await expect(
    page.getByText("QA gasto propiedad", { exact: true }),
  ).toBeVisible();
  assert.equal(state.posts.at(-1).body.property_id, "qa-property");
  assert.equal(state.posts.at(-1).body.category, "property");
  assert.equal(state.posts.at(-1).body.status, "draft");
  await page.reload();
  await expect(
    page.getByText("QA gasto global", { exact: true }),
  ).toBeVisible();
  await expect(
    page.getByText("QA gasto propiedad", { exact: true }),
  ).toBeVisible();
  assert.ok(
    state.reads.every((read) =>
      ["properties", "rent_collections", "expenses"].includes(read.table),
    ),
  );
  assert.equal(state.pageErrors, 0);
  checks++;
  await context.close();
}

try {
  if (!process.argv[2] || process.argv[2] === "properties") await properties();
  if (!process.argv[2] || process.argv[2] === "finance") await finance();
  console.log("LIVE P0 browser fixtures: " + checks + " scenarios PASS");
} catch (error) {
  console.error("LIVE P0 failed at: " + stage);
  throw error;
} finally {
  await browser.close();
}
