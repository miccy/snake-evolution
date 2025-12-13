import { describe, expect, test } from "bun:test";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

describe("GitHub Workflows", () => {
  describe("CI Workflow", () => {
    const ciPath = resolve(__dirname, "../workflows/ci.yml");
    let ciContent: string;

    test("ci.yml should exist", () => {
      expect(() => readFileSync(ciPath, "utf-8")).not.toThrow();
      ciContent = readFileSync(ciPath, "utf-8");
    });

    test("should have correct permissions", () => {
      ciContent = readFileSync(ciPath, "utf-8");
      expect(ciContent).toContain("permissions:");
      expect(ciContent).toContain("contents: read");
    });

    test("should trigger on push and pull_request", () => {
      ciContent = readFileSync(ciPath, "utf-8");
      expect(ciContent).toContain("on:");
      expect(ciContent).toContain("push:");
      expect(ciContent).toContain("pull_request:");
    });

    test("should target main and dev branches", () => {
      ciContent = readFileSync(ciPath, "utf-8");
      expect(ciContent).toContain("branches: [main, dev]");
    });

    test("should have quality and build jobs", () => {
      ciContent = readFileSync(ciPath, "utf-8");
      expect(ciContent).toContain("quality:");
      expect(ciContent).toContain("build:");
    });

    test("quality job should run lint, format, type-check, and test", () => {
      ciContent = readFileSync(ciPath, "utf-8");
      expect(ciContent).toContain("bun run lint");
      expect(ciContent).toContain("bun run format:check");
      expect(ciContent).toContain("bun run type-check");
      expect(ciContent).toContain("bun test");
    });

    test("build job should depend on quality", () => {
      ciContent = readFileSync(ciPath, "utf-8");
      expect(ciContent).toMatch(/build:[\s\S]*?needs:\s*quality/);
    });

    test("should use Bun cache for dependencies", () => {
      ciContent = readFileSync(ciPath, "utf-8");
      expect(ciContent).toContain("uses: actions/cache@v4");
      expect(ciContent).toContain("~/.bun/install/cache");
    });
  });

  describe("Publish CLI Workflow", () => {
    const publishPath = resolve(__dirname, "../workflows/publish-cli.yml");
    let publishContent: string;

    test("publish-cli.yml should exist", () => {
      expect(() => readFileSync(publishPath, "utf-8")).not.toThrow();
      publishContent = readFileSync(publishPath, "utf-8");
    });

    test("should trigger on release published", () => {
      publishContent = readFileSync(publishPath, "utf-8");
      expect(publishContent).toContain("on:");
      expect(publishContent).toContain("release:");
      expect(publishContent).toContain("types: [published]");
    });

    test("should have correct permissions for publishing", () => {
      publishContent = readFileSync(publishPath, "utf-8");
      expect(publishContent).toContain("permissions:");
      expect(publishContent).toContain("contents: read");
      expect(publishContent).toContain("id-token: write");
    });

    test("should setup both Bun and Node.js", () => {
      publishContent = readFileSync(publishPath, "utf-8");
      expect(publishContent).toContain("uses: oven-sh/setup-bun@v2");
      expect(publishContent).toContain("uses: actions/setup-node@v4");
    });

    test("should configure npm registry", () => {
      publishContent = readFileSync(publishPath, "utf-8");
      expect(publishContent).toContain("registry-url: 'https://registry.npmjs.org'");
    });

    test("should verify NPM_TOKEN exists", () => {
      publishContent = readFileSync(publishPath, "utf-8");
      expect(publishContent).toContain("Verify NPM_TOKEN exists");
      expect(publishContent).toContain("NPM_TOKEN");
    });

    test("should build CLI before publishing", () => {
      publishContent = readFileSync(publishPath, "utf-8");
      expect(publishContent).toContain("cd packages/cli");
      expect(publishContent).toContain("bun run build");
    });

    test("should publish with provenance", () => {
      publishContent = readFileSync(publishPath, "utf-8");
      expect(publishContent).toContain("npm publish --provenance --access public");
    });

    test("should use NODE_AUTH_TOKEN from secrets", () => {
      publishContent = readFileSync(publishPath, "utf-8");
      expect(publishContent).toContain("NODE_AUTH_TOKEN: ${{ secrets.NPM_TOKEN }}");
    });
  });
});