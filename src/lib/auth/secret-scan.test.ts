import { readdirSync, readFileSync, statSync } from "node:fs";
import { join, relative } from "node:path";
import { describe, expect, it } from "vitest";

const forbidden = [
  /service[_-]?role/i,
  /SUPABASE_SERVICE/i,
  /DATABASE_URL/i,
  /DB_PASSWORD/i,
  /postgres:\/\//i,
  /sb_secret/i,
];

function collectFiles(dir: string): string[] {
  return readdirSync(dir).flatMap((entry) => {
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) return collectFiles(full);
    return /\.(ts|tsx|js|jsx|mjs)$/.test(entry) ? [full] : [];
  });
}

describe("frontend secret guard", () => {
  it("does not include service role or database credentials in src", () => {
    const root = join(process.cwd(), "src");
    const offenders = collectFiles(root)
      .filter((file) => !file.endsWith("secret-scan.test.ts"))
      .flatMap((file) => {
        const content = readFileSync(file, "utf8");
        return forbidden
          .filter((pattern) => pattern.test(content))
          .map((pattern) => relative(process.cwd(), file) + " :: " + pattern);
      });

    expect(offenders).toEqual([]);
  });
});
