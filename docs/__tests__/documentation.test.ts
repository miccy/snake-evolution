import { describe, expect, test } from "bun:test";
import { readFileSync, statSync } from "node:fs";
import { resolve } from "node:path";

describe("Documentation Files", () => {
  describe("README.md", () => {
    const readmePath = resolve(__dirname, "../../README.md");
    let content: string;

    test("should exist and be non-empty", () => {
      expect(() => readFileSync(readmePath, "utf-8")).not.toThrow();
      content = readFileSync(readmePath, "utf-8");
      expect(content.length).toBeGreaterThan(100);
    });

    test("should have main heading", () => {
      content = readFileSync(readmePath, "utf-8");
      expect(content).toMatch(/#+\s*.*Snake Evolution/i);
    });

    test("should document Quick Start", () => {
      content = readFileSync(readmePath, "utf-8");
      expect(content).toMatch(/##?\s*.*Quick Start/i);
    });

    test("should list available themes", () => {
      content = readFileSync(readmePath, "utf-8");
      expect(content).toMatch(/##?\s*.*Theme/i);
      expect(content).toContain("github-dark");
      expect(content).toContain("github-light");
      expect(content).toContain("ocean");
      expect(content).toContain("sunset");
      expect(content).toContain("neon-gamer");
    });

    test("should document GitHub Action usage", () => {
      content = readFileSync(readmePath, "utf-8");
      expect(content).toMatch(/##?\s*.*GitHub Action/i);
      expect(content).toContain("uses: miccy/snake-evolution@main");
    });

    test("should document CLI usage", () => {
      content = readFileSync(readmePath, "utf-8");
      expect(content).toMatch(/##?\s*.*CLI/i);
      expect(content).toContain("npx @snake-evolution/cli");
    });

    test("should mention PvP mode as coming soon", () => {
      content = readFileSync(readmePath, "utf-8");
      expect(content).toMatch(/PvP.*coming soon/i);
    });

    test("should have license information", () => {
      content = readFileSync(readmePath, "utf-8");
      expect(content).toMatch(/##?\s*.*License/i);
      expect(content).toContain("MIT");
    });

    test("should have badges", () => {
      content = readFileSync(readmePath, "utf-8");
      expect(content).toMatch(/!\[.*\]\(https:\/\/img\.shields\.io/);
    });

    test("should credit Platane", () => {
      content = readFileSync(readmePath, "utf-8");
      expect(content).toMatch(/Platane/i);
    });
  });

  describe("CONTRIBUTING.md", () => {
    const contributingPath = resolve(__dirname, "../../.github/CONTRIBUTING.md");
    let content: string;

    test("should exist and be substantial", () => {
      expect(() => readFileSync(contributingPath, "utf-8")).not.toThrow();
      content = readFileSync(contributingPath, "utf-8");
      expect(content.length).toBeGreaterThan(500);
    });

    test("should be bilingual (English and Czech)", () => {
      content = readFileSync(contributingPath, "utf-8");
      expect(content).toContain("English");
      expect(content).toContain("Čeština");
    });

    test("should document prerequisites", () => {
      content = readFileSync(contributingPath, "utf-8");
      expect(content).toContain("Bun");
      expect(content).toContain("Git");
      expect(content).toContain("Node.js");
    });

    test("should explain how to fork and clone", () => {
      content = readFileSync(contributingPath, "utf-8");
      expect(content).toMatch(/fork/i);
      expect(content).toMatch(/git clone/i);
    });

    test("should document coding standards", () => {
      content = readFileSync(contributingPath, "utf-8");
      expect(content).toMatch(/coding standards/i);
      expect(content).toContain("TypeScript");
    });

    test("should explain commit conventions", () => {
      content = readFileSync(contributingPath, "utf-8");
      expect(content).toMatch(/conventional commits/i);
      expect(content).toContain("feat:");
      expect(content).toContain("fix:");
    });

    test("should reference Code of Conduct", () => {
      content = readFileSync(contributingPath, "utf-8");
      expect(content).toMatch(/code of conduct/i);
    });

    test("should provide contact information", () => {
      content = readFileSync(contributingPath, "utf-8");
      expect(content).toContain("support@miccy.dev");
    });
  });

  describe("RELEASE_SETUP.md", () => {
    const releasePath = resolve(__dirname, "../RELEASE_SETUP.md");
    let content: string;

    test("should exist", () => {
      expect(() => readFileSync(releasePath, "utf-8")).not.toThrow();
      content = readFileSync(releasePath, "utf-8");
    });

    test("should document release steps", () => {
      content = readFileSync(releasePath, "utf-8");
      expect(content).toMatch(/##?\s*Step/i);
      expect(content.match(/##?\s*Step/gi)?.length).toBeGreaterThanOrEqual(5);
    });

    test("should mention repository settings", () => {
      content = readFileSync(releasePath, "utf-8");
      expect(content).toMatch(/repository settings/i);
    });

    test("should document npm token setup", () => {
      content = readFileSync(releasePath, "utf-8");
      expect(content).toContain("NPM_TOKEN");
      expect(content).toMatch(/npm.*token/i);
    });

    test("should explain how to create releases", () => {
      content = readFileSync(releasePath, "utf-8");
      expect(content).toMatch(/git tag/i);
      expect(content).toMatch(/release/i);
    });

    test("should have verification section", () => {
      content = readFileSync(releasePath, "utf-8");
      expect(content).toMatch(/##?\s*Verification/i);
    });

    test("should provide checklist items", () => {
      content = readFileSync(releasePath, "utf-8");
      expect(content).toMatch(/\[[xX ]\]/); // Markdown checkboxes
    });
  });

  describe("ROADMAP.md", () => {
    const roadmapPath = resolve(__dirname, "../ROADMAP.md");
    let content: string;

    test("should exist", () => {
      expect(() => readFileSync(roadmapPath, "utf-8")).not.toThrow();
      content = readFileSync(roadmapPath, "utf-8");
    });

    test("should document Phase 1 as released", () => {
      content = readFileSync(roadmapPath, "utf-8");
      expect(content).toMatch(/Phase 1/i);
      expect(content).toMatch(/released|complete/i);
    });

    test("should mention future phases", () => {
      content = readFileSync(roadmapPath, "utf-8");
      expect(content).toMatch(/Phase 2|Phase 3/i);
    });

    test("should document PvP mode plans", () => {
      content = readFileSync(roadmapPath, "utf-8");
      expect(content).toMatch(/PvP/i);
      expect(content).toMatch(/battle/i);
    });

    test("should list email signature mode", () => {
      content = readFileSync(roadmapPath, "utf-8");
      expect(content).toMatch(/email signature/i);
    });

    test("should mention custom text mode", () => {
      content = readFileSync(roadmapPath, "utf-8");
      expect(content).toMatch(/custom text/i);
    });
  });

  describe("Documentation Quality", () => {
    test("all markdown files should have proper heading structure", () => {
      const docs = [
        "../../README.md",
        "../../.github/CONTRIBUTING.md",
        "../RELEASE_SETUP.md",
        "../ROADMAP.md",
      ];

      docs.forEach((docPath) => {
        const fullPath = resolve(__dirname, docPath);
        const content = readFileSync(fullPath, "utf-8");

        // Should start with h1
        expect(content).toMatch(/^#\s+/m);

        // Should have at least one h2
        expect(content).toMatch(/^##\s+/m);
      });
    });

    test("documentation files should not be too small", () => {
      const docs = [
        { path: "../../README.md", minSize: 2000 },
        { path: "../../.github/CONTRIBUTING.md", minSize: 3000 },
        { path: "../RELEASE_SETUP.md", minSize: 1000 },
        { path: "../ROADMAP.md", minSize: 1000 },
      ];

      docs.forEach(({ path, minSize }) => {
        const fullPath = resolve(__dirname, path);
        const stats = statSync(fullPath);
        expect(stats.size).toBeGreaterThanOrEqual(minSize);
      });
    });

    test("no documentation should contain placeholder TODO", () => {
      const docs = ["../../README.md", "../../.github/CONTRIBUTING.md", "../RELEASE_SETUP.md"];

      docs.forEach((docPath) => {
        const fullPath = resolve(__dirname, docPath);
        const content = readFileSync(fullPath, "utf-8");
        expect(content).not.toMatch(/TODO|FIXME|XXX/i);
      });
    });
  });
});
