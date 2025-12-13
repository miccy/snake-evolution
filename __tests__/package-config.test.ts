import { describe, expect, test } from "bun:test";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

describe("Package Configuration", () => {
  describe("Root package.json", () => {
    const pkgPath = resolve(__dirname, "../package.json");
    let pkg: Record<string, unknown>;

    test("should be valid JSON", () => {
      const content = readFileSync(pkgPath, "utf-8");
      expect(() => JSON.parse(content)).not.toThrow();
      pkg = JSON.parse(content);
    });

    test("should have correct name", () => {
      pkg = JSON.parse(readFileSync(pkgPath, "utf-8"));
      expect(pkg.name).toBe("snake-evolution");
    });

    test("should be marked as private", () => {
      pkg = JSON.parse(readFileSync(pkgPath, "utf-8"));
      expect(pkg.private).toBe(true);
    });

    test("should specify Node.js >= 22", () => {
      pkg = JSON.parse(readFileSync(pkgPath, "utf-8"));
      const engines = pkg.engines as Record<string, string>;
      expect(engines.node).toMatch(/>=\s*22/);
    });

    test("should specify Bun >= 1.3.0", () => {
      pkg = JSON.parse(readFileSync(pkgPath, "utf-8"));
      const engines = pkg.engines as Record<string, string>;
      expect(engines.bun).toMatch(/>=\s*1\.3/);
    });

    test("should have correct scripts", () => {
      pkg = JSON.parse(readFileSync(pkgPath, "utf-8"));
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
      pkg = JSON.parse(readFileSync(pkgPath, "utf-8"));
      const scripts = pkg.scripts as Record<string, string>;
      const qualityScript = scripts.quality;
      
      expect(qualityScript).toContain("lint");
      expect(qualityScript).toContain("format");
      expect(qualityScript).toContain("type-check");
      expect(qualityScript).toContain("test");
    });

    test("should use turbo for monorepo tasks", () => {
      pkg = JSON.parse(readFileSync(pkgPath, "utf-8"));
      const scripts = pkg.scripts as Record<string, string>;
      
      expect(scripts.dev).toContain("turbo");
      expect(scripts.build).toContain("turbo");
    });

    test("should have workspaces configured", () => {
      pkg = JSON.parse(readFileSync(pkgPath, "utf-8"));
      const workspaces = pkg.workspaces as string[];
      
      expect(workspaces).toContain("apps/*");
      expect(workspaces).toContain("packages/*");
    });

    test("should have security resolutions", () => {
      pkg = JSON.parse(readFileSync(pkgPath, "utf-8"));
      const resolutions = pkg.resolutions as Record<string, string>;
      
      expect(resolutions["cross-spawn"]).toBeDefined();
      expect(resolutions["http-cache-semantics"]).toBeDefined();
      expect(resolutions["semver-regex"]).toBeDefined();
      expect(resolutions["uuid"]).toBeDefined();
    });

    test("should use Biome for linting", () => {
      pkg = JSON.parse(readFileSync(pkgPath, "utf-8"));
      const devDeps = pkg.devDependencies as Record<string, string>;
      
      expect(devDeps["@biomejs/biome"]).toBeDefined();
    });
  });

  describe("CLI package.json", () => {
    const cliPkgPath = resolve(__dirname, "../packages/cli/package.json");
    let pkg: Record<string, unknown>;

    test("should be valid JSON", () => {
      const content = readFileSync(cliPkgPath, "utf-8");
      expect(() => JSON.parse(content)).not.toThrow();
      pkg = JSON.parse(content);
    });

    test("should have correct scope and name", () => {
      pkg = JSON.parse(readFileSync(cliPkgPath, "utf-8"));
      expect(pkg.name).toBe("@snake-evolution/cli");
    });

    test("should be version 1.0.0", () => {
      pkg = JSON.parse(readFileSync(cliPkgPath, "utf-8"));
      expect(pkg.version).toBe("1.0.0");
    });

    test("should NOT be private", () => {
      pkg = JSON.parse(readFileSync(cliPkgPath, "utf-8"));
      expect(pkg.private).toBeUndefined();
    });

    test("should have description", () => {
      pkg = JSON.parse(readFileSync(cliPkgPath, "utf-8"));
      expect(pkg.description).toBeDefined();
      expect((pkg.description as string).length).toBeGreaterThan(10);
    });

    test("should have MIT license", () => {
      pkg = JSON.parse(readFileSync(cliPkgPath, "utf-8"));
      expect(pkg.license).toBe("MIT");
    });

    test("should have repository info", () => {
      pkg = JSON.parse(readFileSync(cliPkgPath, "utf-8"));
      const repo = pkg.repository as Record<string, string>;
      
      expect(repo.type).toBe("git");
      expect(repo.url).toContain("github.com/miccy/snake-evolution");
      expect(repo.directory).toBe("packages/cli");
    });

    test("should have bin entry", () => {
      pkg = JSON.parse(readFileSync(cliPkgPath, "utf-8"));
      const bin = pkg.bin as Record<string, string>;
      
      expect(bin["snake-evolution"]).toBe("./dist/index.js");
    });

    test("should have keywords for npm discovery", () => {
      pkg = JSON.parse(readFileSync(cliPkgPath, "utf-8"));
      const keywords = pkg.keywords as string[];
      
      expect(keywords).toContain("github");
      expect(keywords).toContain("contributions");
      expect(keywords).toContain("snake");
      expect(keywords).toContain("cli");
    });

    test("should have main and files fields", () => {
      pkg = JSON.parse(readFileSync(cliPkgPath, "utf-8"));
      
      expect(pkg.main).toBe("./dist/index.js");
      expect(pkg.files).toContain("dist");
    });

    test("should have build and prepublishOnly scripts", () => {
      pkg = JSON.parse(readFileSync(cliPkgPath, "utf-8"));
      const scripts = pkg.scripts as Record<string, string>;
      
      expect(scripts.build).toBeDefined();
      expect(scripts.prepublishOnly).toContain("build");
    });

    test("should bundle dependencies", () => {
      pkg = JSON.parse(readFileSync(cliPkgPath, "utf-8"));
      const bundled = pkg.bundledDependencies as string[];
      
      expect(bundled).toContain("@snake-evolution/engine");
      expect(bundled).toContain("@snake-evolution/github");
      expect(bundled).toContain("@snake-evolution/renderer");
      expect(bundled).toContain("@snake-evolution/types");
    });

    test("should have publishConfig for public access", () => {
      pkg = JSON.parse(readFileSync(cliPkgPath, "utf-8"));
      const publishConfig = pkg.publishConfig as Record<string, string>;
      
      expect(publishConfig.access).toBe("public");
    });

    test("should depend on commander", () => {
      pkg = JSON.parse(readFileSync(cliPkgPath, "utf-8"));
      const deps = pkg.dependencies as Record<string, string>;
      
      expect(deps.commander).toBeDefined();
    });

    test("should require Node.js >= 22", () => {
      pkg = JSON.parse(readFileSync(cliPkgPath, "utf-8"));
      const engines = pkg.engines as Record<string, string>;
      
      expect(engines.node).toMatch(/>=\s*22/);
    });
  });
});