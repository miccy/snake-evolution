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
      expect(content).toMatch(/uses: miccy\/snake-evolution@v\d+/);
    });

    test("should document CLI usage", () => {
      content = readFileSync(readmePath, "utf-8");
      expect(content).toMatch(/##?\s*.*CLI/i);
      expect(content).toContain("npx @snake-evolution/cli");
    });

    test("should mention PvP mode as coming soon", () => {
      content = readFileSync(readmePath, "utf-8");
      // Matches both "PvP mode coming soon" and "Coming Soon: PvP Mode"
      expect(content).toMatch(/(?:pvp.*coming|coming.*pvp)/i);
    });

    test("should have license information", () => {
      content = readFileSync(readmePath, "utf-8");
      expect(content).toMatch(/##?\s*.*License/i);
      expect(content).toContain("MIT");
    });

    test("should have badges", () => {
      content = readFileSync(readmePath, "utf-8");
      // Support both markdown badges ![](url) and HTML <img> badges
      expect(content).toMatch(/img\.shields\.io/);
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

    test("should be English only", () => {
      content = readFileSync(contributingPath, "utf-8");
      expect(content).not.toContain("Čeština"); // cspell:disable-line
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
      expect(content).toMatch(/feat[:(]/i);
      expect(content).toMatch(/fix[:(]/i);
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

        // Should have h1 (markdown # or HTML <h1>)
        expect(content).toMatch(/^#\s+|<h1[^>]*>/m);

        // Should have at least one h2 (markdown ## or HTML <h2>)
        expect(content).toMatch(/^##\s+|<h2[^>]*>/m);
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

  describe("CHANGELOG.md", () => {
    const changelogPath = resolve(__dirname, "../../CHANGELOG.md");

    test("release dates should use valid YYYY-MM-DD format and be chronological", () => {
      const content = readFileSync(changelogPath, "utf-8");
      const entries = [...content.matchAll(/^## \[(?<version>[^\]]+)] - (?<date>\d{4}-\d{2}-\d{2})/gm)];

      expect(entries.length).toBeGreaterThan(0);

      const parsed = entries.map(({ groups }) => {
        if (!groups?.date) {
          throw new Error("Missing release date in changelog entry");
        }

        const [year, month, day] = groups.date.split("-").map(Number);
        const date = new Date(Date.UTC(year, month - 1, day));
        const iso = date.toISOString().slice(0, 10);

        expect(iso).toBe(groups.date);
        expect(month).toBeGreaterThanOrEqual(1);
        expect(month).toBeLessThanOrEqual(12);
        expect(day).toBeGreaterThanOrEqual(1);
        expect(day).toBeLessThanOrEqual(31);

        return { version: groups.version, date: iso };
      });

      for (let i = 1; i < parsed.length; i += 1) {
        const prev = parsed[i - 1].date;
        const current = parsed[i].date;
        expect(prev >= current).toBe(true);
      }
    });
  });
});
