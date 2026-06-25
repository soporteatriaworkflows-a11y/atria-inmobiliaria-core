import { chromium } from "@playwright/test";
import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const baseUrl = "https://atria-inmobiliaria-core.vercel.app";
const routes = [
  "/",
  "/login",
  "/dashboard/admin",
  "/dashboard/contador",
  "/dashboard/propietario",
  "/propiedades",
  "/herederos",
  "/recaudos",
  "/gastos",
  "/liquidacion",
  "/solicitudes",
  "/auditoria",
];

const viewports = [
  { name: "desktop", width: 1440, height: 1000 },
  { name: "tablet", width: 834, height: 1112 },
  { name: "mobile", width: 390, height: 844 },
];

const outDir = join("artifacts", "visual-qa", "vercel-demo-2026-06-25");
mkdirSync(outDir, { recursive: true });

const browser = await chromium.launch();
const results = [];

for (const viewport of viewports) {
  const context = await browser.newContext({ viewport });
  for (const route of routes) {
    const page = await context.newPage();
    const consoleMessages = [];
    const failedRequests = [];

    page.on("console", (message) => {
      if (["error", "warning"].includes(message.type())) {
        consoleMessages.push(`${message.type()}: ${message.text()}`);
      }
    });

    page.on("requestfailed", (request) => {
      failedRequests.push(
        `${request.method()} ${request.url()} ${request.failure()?.errorText ?? "failed"}`,
      );
    });

    const url = `${baseUrl}${route}`;
    const response = await page.goto(url, {
      waitUntil: "networkidle",
      timeout: 45_000,
    });
    const status = response?.status() ?? 0;
    const demoVisible = await page
      .getByText("Modo demo seguro: datos sanitizados")
      .isVisible()
      .catch(() => false);
    const title = await page
      .locator("h1")
      .first()
      .textContent()
      .catch(() => null);
    const navLinks = await page
      .locator("nav a")
      .count()
      .catch(() => 0);
    const screenshot = join(
      outDir,
      `${viewport.name}-${route === "/" ? "home" : route.slice(1).replaceAll("/", "-")}.png`,
    );
    await page.screenshot({ path: screenshot, fullPage: true });

    results.push({
      route,
      viewport: viewport.name,
      status,
      ok: status >= 200 && status < 400,
      demoVisible,
      title,
      navLinks,
      consoleMessages,
      failedRequests,
      screenshot,
    });

    await page.close();
  }
  await context.close();
}

await browser.close();

writeFileSync(
  join(outDir, "results.json"),
  JSON.stringify({ baseUrl, routes, viewports, results }, null, 2),
);

const failures = results.filter(
  (result) =>
    !result.ok ||
    !result.demoVisible ||
    result.consoleMessages.length > 0 ||
    result.failedRequests.length > 0,
);

console.log(
  JSON.stringify({ outDir, checked: results.length, failures }, null, 2),
);

if (failures.length > 0) {
  process.exitCode = 1;
}
