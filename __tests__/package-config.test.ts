import { beforeAll, describe, expect, test } from "bun:test";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

describe("Package Configuration", () => {
  describe("Root package.json", () => {
    const pkgPath = resolve(__dirname, "../package.json");
    let pkg: Record<string, unknown> = {};

    beforeAll(() => {
      pkg = JSON.parse(readFileSync(pkgPath, "utf-8"));
    });

    test("should be valid JSON", () => {
      expect(pkg).toBeDefined();
      expect(typeof pkg).toBe("object");
    });

    test("should have correct name", () => {
      expect(pkg.name).toBe("snake-evolution");
    });

    test("should be marked as private", () => {
      expect(pkg.private).toBe(true);
    });

    test("should specify Node.js >= 22", () => {
      expect(pkg.engines).toBeDefined();
      const engines = pkg.engines as Record<string, string>;
      expect(engines.node).toMatch(/>=\s*22/);
    });

    test("should specify Bun >= 1.3.0", () => {
      expect(pkg.engines).toBeDefined();
      const engines = pkg.engines as Record<string, string>;
      expect(engines.bun).toMatch(/>=\s*1\.3/);
    });

    test("should have correct scripts", () => {
      expect(pkg.scripts).toBeDefined();
      const scripts = pkg.scripts as Record<string, string>;

      expect(scripts.dev).toBeDefined();
      expect(scripts.build).toBeDefined();
      expect(scripts.test).toBeDefined();
      expect(scripts.lint).toBeDefined();
      expect(scripts.format).toBeDefined();
      expect(scripts["type-check"]).toBeDefined();
      expect(scripts.quality).toBeDefined();
    });

    test("quality script should run all checks", () => {
      expect(pkg.scripts).toBeDefined();
      const scripts = pkg.scripts as Record<string, string>;
      const qualityScript = scripts.quality;

      // Quality script should run check (which includes lint, format, type-check) and test
      expect(qualityScript).toContain("check");
      expect(qualityScript).toContain("test");
    });

    test("should use turbo for monorepo tasks", () => {
      expect(pkg.scripts).toBeDefined();
      const scripts = pkg.scripts as Record<string, string>;

      expect(scripts.dev).toContain("turbo");
      expect(scripts.build).toContain("turbo");
    });

    test("should have workspaces configured", () => {
      expect(pkg.workspaces).toBeDefined();
      const workspaces = pkg.workspaces as string[];

      expect(workspaces).toContain("apps/*");
      expect(workspaces).toContain("packages/*");
    });

    test("should have security resolutions", () => {
      expect(pkg.resolutions).toBeDefined();
      const resolutions = pkg.resolutions as Record<string, string>;

      expect(resolutions["cross-spawn"]).toBeDefined();
      expect(resolutions["http-cache-semantics"]).toBeDefined();
      expect(resolutions["semver-regex"]).toBeDefined();
      expect(resolutions["uuid"]).toBeDefined();
    });

    test("should use Biome for linting", () => {
      expect(pkg.devDependencies).toBeDefined();
      const devDeps = pkg.devDependencies as Record<string, string>;

      expect(devDeps["@biomejs/biome"]).toBeDefined();
    });
  });

  describe("CLI package.json", () => {
    const cliPkgPath = resolve(__dirname, "../packages/cli/package.json");
    let pkg: Record<string, unknown> = {};

    beforeAll(() => {
      pkg = JSON.parse(readFileSync(cliPkgPath, "utf-8"));
    });

    test("should be valid JSON", () => {
      expect(pkg).toBeDefined();
      expect(typeof pkg).toBe("object");
    });

    test("should have correct scope and name", () => {
      expect(pkg.name).toBe("@snake-evolution/cli");
    });

    test("should have valid semver version starting with 1.x", () => {
      expect(pkg.version).toBeDefined();
      expect(pkg.version).toMatch(/^1\.\d+\.\d+(-[\w.]+)?$/);
    });

    test("should NOT be private", () => {
      expect(pkg.private).not.toBe(true);
    });

    test("should have description", () => {
      expect(pkg.description).toBeDefined();
      expect((pkg.description as string).length).toBeGreaterThan(10);
    });

    test("should have MIT license", () => {
      expect(pkg.license).toBe("MIT");
    });

    test("should have repository info", () => {
      expect(pkg.repository).toBeDefined();
      const repo = pkg.repository as Record<string, string>;

      expect(repo.type).toBe("git");
      expect(repo.url).toContain("github.com/miccy/snake-evolution");
      expect(repo.directory).toBe("packages/cli");
    });

    test("should have bin entry", () => {
      expect(pkg.bin).toBeDefined();
      const bin = pkg.bin as Record<string, string>;

      expect(bin["snake-evolution"]).toBe("./dist/index.js");
    });

    test("should have keywords for npm discovery", () => {
      expect(pkg.keywords).toBeDefined();
      const keywords = pkg.keywords as string[];

      expect(keywords).toContain("github");
      expect(keywords).toContain("contributions");
      expect(keywords).toContain("snake");
      expect(keywords).toContain("cli");
    });

    test("should have main and files fields", () => {
      expect(pkg.main).toBe("./dist/index.js");
      expect(pkg.files).toBeDefined();
      expect(pkg.files).toContain("dist");
    });

    test("should have build and prepublishOnly scripts", () => {
      expect(pkg.scripts).toBeDefined();
      const scripts = pkg.scripts as Record<string, string>;

      expect(scripts.build).toBeDefined();
      expect(scripts.prepublishOnly).toContain("build");
    });

    test("should bundle dependencies", () => {
      expect(pkg.bundledDependencies).toBeDefined();
      const bundled = pkg.bundledDependencies as string[];

      expect(bundled).toContain("@snake-evolution/engine");
      expect(bundled).toContain("@snake-evolution/github");
      expect(bundled).toContain("@snake-evolution/renderer");
      expect(bundled).toContain("@snake-evolution/types");
    });

    test("should have publishConfig for public access", () => {
      expect(pkg.publishConfig).toBeDefined();
      const publishConfig = pkg.publishConfig as Record<string, string>;

      expect(publishConfig.access).toBe("public");
    });

    test("should depend on commander", () => {
      expect(pkg.dependencies).toBeDefined();
      const deps = pkg.dependencies as Record<string, string>;

      expect(deps.commander).toBeDefined();
    });

    test("should require Node.js >= 22", () => {
      expect(pkg.engines).toBeDefined();
      const engines = pkg.engines as Record<string, string>;

      expect(engines.node).toMatch(/>=\s*22/);
    });
  });
});
