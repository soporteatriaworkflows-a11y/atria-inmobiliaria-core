import { chromium } from "@playwright/test";
import { writeFileSync } from "node:fs";
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

const browser = await chromium.launch();
const checks = [];
for (const viewport of viewports) {
  const context = await browser.newContext({ viewport });
  for (const route of routes) {
    const page = await context.newPage();
    await page.goto(`${baseUrl}${route}`, { waitUntil: "networkidle" });
    const metrics = await page.evaluate(() => {
      const navLinks = [...document.querySelectorAll("nav a")].map((link) => {
        const rect = link.getBoundingClientRect();
        return {
          text: link.textContent?.trim(),
          width: rect.width,
          height: rect.height,
        };
      });
      const buttons = [...document.querySelectorAll("button, a")].map(
        (node) => {
          const rect = node.getBoundingClientRect();
          return {
            text: node.textContent?.trim(),
            width: rect.width,
            height: rect.height,
          };
        },
      );
      return {
        bodyScrollWidth: document.body.scrollWidth,
        documentScrollWidth: document.documentElement.scrollWidth,
        viewportWidth: window.innerWidth,
        h1: document.querySelector("h1")?.textContent?.trim() ?? null,
        visibleTextLength: document.body.innerText.trim().length,
        navLinks,
        minNavHeight: Math.min(...navLinks.map((link) => link.height)),
        smallClickableCount: buttons.filter(
          (button) => button.width < 44 || button.height < 44,
        ).length,
        hasDemoBanner: document.body.innerText.includes(
          "Modo demo seguro: datos sanitizados",
        ),
        hasOwnerReadonlyText: document.body.innerText
          .toLowerCase()
          .includes("solo lectura"),
        hasSupabaseCloudText: document.body.innerText
          .toLowerCase()
          .includes("supabase cloud"),
      };
    });
    checks.push({ route, viewport: viewport.name, ...metrics });
    await page.close();
  }
  await context.close();
}
await browser.close();

const issues = checks.filter(
  (check) =>
    check.documentScrollWidth > check.viewportWidth + 1 ||
    check.minNavHeight < 44 ||
    check.visibleTextLength < 80 ||
    !check.hasDemoBanner ||
    (check.route === "/dashboard/propietario" && !check.hasOwnerReadonlyText),
);

writeFileSync(
  join(
    "artifacts",
    "visual-qa",
    "vercel-demo-2026-06-25",
    "layout-checks.json",
  ),
  JSON.stringify({ checks, issues }, null, 2),
);

console.log(JSON.stringify({ checked: checks.length, issues }, null, 2));
if (issues.length > 0) process.exitCode = 1;
