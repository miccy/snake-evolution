import { beforeAll, describe, expect, test } from "bun:test";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { parse as parseYAML } from "yaml";

describe("GitHub Workflows", () => {
  describe("CI Workflow", () => {
    const ciPath = resolve(__dirname, "../workflows/ci.yml");
    let ciContent = "";

    beforeAll(() => {
      ciContent = readFileSync(ciPath, "utf-8");
    });

    test("ci.yml should exist", () => {
      expect(ciContent.length).toBeGreaterThan(0);
    });

    test("should have correct permissions", () => {
      expect(ciContent).toContain("permissions:");
      expect(ciContent).toContain("contents: read");
    });

    test("should trigger on push and pull_request", () => {
      expect(ciContent).toContain("on:");
      expect(ciContent).toContain("push:");
      expect(ciContent).toContain("pull_request:");
    });

    test("should target main and dev branches", () => {
      expect(ciContent).toContain("branches: [main, dev]");
    });

    test("should have quality and build jobs", () => {
      expect(ciContent).toContain("quality:");
      expect(ciContent).toContain("build:");
    });

    test("quality job should run lint, format, type-check, and test", () => {
      expect(ciContent).toContain("bun run lint");
      expect(ciContent).toContain("bun run format:check");
      expect(ciContent).toContain("bun run type-check");
      expect(ciContent).toContain("bun test");
    });

    test("build job should depend on quality", () => {
      expect(ciContent).toMatch(/build:[\s\S]*?needs:\s*quality/);
    });

    test("should use Bun cache for dependencies", () => {
      expect(ciContent).toContain("uses: actions/cache@v4");
      expect(ciContent).toContain("~/.bun/install/cache");
    });
  });

  describe("Publish CLI Workflow", () => {
    const publishPath = resolve(__dirname, "../workflows/publish-cli.yml");
    let publishContent = "";
    let publishConfig: Record<string, unknown> = {};

    beforeAll(() => {
      publishContent = readFileSync(publishPath, "utf-8");
      publishConfig = parseYAML(publishContent) as Record<string, unknown>;
    });

    test("publish-cli.yml should exist", () => {
      expect(publishContent.length).toBeGreaterThan(0);
    });

    test("should trigger on release published", () => {
      const on = publishConfig.on as Record<string, unknown>;
      expect(on).toBeDefined();
      expect(on.release).toBeDefined();
      const release = on.release as { types: string[] };
      expect(release.types).toContain("published");
    });

    test("should have correct permissions for publishing", () => {
      // Permissions are defined at the job level
      const jobs = publishConfig.jobs as Record<string, unknown>;
      expect(jobs).toBeDefined();
      const publishJob = jobs.publish as Record<string, unknown>;
      expect(publishJob).toBeDefined();
      const permissions = publishJob.permissions as Record<string, string>;
      expect(permissions).toBeDefined();
      expect(permissions.contents).toBe("read");
      expect(permissions["id-token"]).toBe("write");
    });

    test("should setup both Bun and Node.js", () => {
      expect(publishContent).toContain("uses: oven-sh/setup-bun@v2");
      expect(publishContent).toContain("uses: actions/setup-node@v4");
    });

    test("should configure npm registry", () => {
      expect(publishContent).toContain("registry-url: 'https://registry.npmjs.org'");
    });

    test("should verify NPM_TOKEN exists", () => {
      expect(publishContent).toContain("Verify NPM_TOKEN exists");
      expect(publishContent).toContain("NPM_TOKEN");
    });

    test("should build CLI before publishing", () => {
      // Uses working-directory instead of cd
      expect(publishContent).toContain("working-directory: packages/cli");
      expect(publishContent).toContain("bun run build");
    });

    test("should publish with provenance", () => {
      expect(publishContent).toContain("npm publish --provenance --access public");
    });

    test("should use NODE_AUTH_TOKEN from secrets", () => {
      expect(publishContent).toContain("NODE_AUTH_TOKEN: ${{ secrets.NPM_TOKEN }}");
    });
  });
});
