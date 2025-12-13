import { describe, expect, test } from "bun:test";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

describe("VSCode Configuration", () => {
  describe("extensions.json", () => {
    const extPath = resolve(__dirname, "../extensions.json");
    let config: {
      recommendations: string[];
      unwantedRecommendations: string[];
    };

    test("should be valid JSON", () => {
      const content = readFileSync(extPath, "utf-8");
      expect(() => JSON.parse(content)).not.toThrow();
      config = JSON.parse(content);
    });

    test("should recommend Biome extension", () => {
      config = JSON.parse(readFileSync(extPath, "utf-8"));
      expect(config.recommendations).toContain("biomejs.biome");
    });

    test("should recommend Bun extension", () => {
      config = JSON.parse(readFileSync(extPath, "utf-8"));
      expect(config.recommendations).toContain("oven.bun-vscode");
    });

    test("should NOT recommend Prettier or ESLint", () => {
      config = JSON.parse(readFileSync(extPath, "utf-8"));
      expect(config.unwantedRecommendations).toContain("esbenp.prettier-vscode");
      expect(config.unwantedRecommendations).toContain("dbaeumer.vscode-eslint");
    });

    test("should recommend Git and GitHub extensions", () => {
      config = JSON.parse(readFileSync(extPath, "utf-8"));
      expect(config.recommendations).toContain("eamodio.gitlens");
      expect(config.recommendations).toContain("GitHub.vscode-pull-request-github");
      expect(config.recommendations).toContain("GitHub.vscode-github-actions");
    });

    test("should recommend markdown tools", () => {
      config = JSON.parse(readFileSync(extPath, "utf-8"));
      expect(config.recommendations).toContain("DavidAnson.vscode-markdownlint");
      expect(config.recommendations).toContain("yzhang.markdown-all-in-one");
    });
  });

  describe("launch.json", () => {
    const launchPath = resolve(__dirname, "../launch.json");
    let config: {
      version: string;
      configurations: Array<{ name: string; type: string }>;
      compounds?: Array<{ name: string; configurations: string[] }>;
    };

    test("should be valid JSON", () => {
      const content = readFileSync(launchPath, "utf-8");
      expect(() => JSON.parse(content)).not.toThrow();
      config = JSON.parse(content);
    });

    test("should have correct version", () => {
      config = JSON.parse(readFileSync(launchPath, "utf-8"));
      expect(config.version).toBe("0.2.0");
    });

    test("should have CLI debug configuration", () => {
      config = JSON.parse(readFileSync(launchPath, "utf-8"));
      const cliConfig = config.configurations.find((c) => c.name.includes("Debug CLI"));
      expect(cliConfig).toBeDefined();
      expect(cliConfig?.type).toBe("bun");
    });

    test("should have Web debug configuration", () => {
      config = JSON.parse(readFileSync(launchPath, "utf-8"));
      const webConfig = config.configurations.find((c) => c.name.includes("Web"));
      expect(webConfig).toBeDefined();
      expect(webConfig?.type).toBe("bun");
    });

    test("should have API debug configuration", () => {
      config = JSON.parse(readFileSync(launchPath, "utf-8"));
      const apiConfig = config.configurations.find((c) => c.name.includes("API"));
      expect(apiConfig).toBeDefined();
      expect(apiConfig?.type).toBe("bun");
    });

    test("should have test debug configuration", () => {
      config = JSON.parse(readFileSync(launchPath, "utf-8"));
      const testConfig = config.configurations.find((c) => c.name.includes("Test"));
      expect(testConfig).toBeDefined();
    });

    test("should have Full Stack compound configuration", () => {
      config = JSON.parse(readFileSync(launchPath, "utf-8"));
      expect(config.compounds).toBeDefined();
      const fullStack = config.compounds?.find((c) => c.name.includes("Full Stack"));
      expect(fullStack).toBeDefined();
      expect(fullStack?.configurations.length).toBeGreaterThanOrEqual(2);
    });
  });

  describe("settings.json", () => {
    const settingsPath = resolve(__dirname, "../settings.json");
    let config: Record<string, unknown>;

    test("should be valid JSON", () => {
      const content = readFileSync(settingsPath, "utf-8");
      expect(() => JSON.parse(content)).not.toThrow();
      config = JSON.parse(content);
    });

    test("should enable format on save", () => {
      config = JSON.parse(readFileSync(settingsPath, "utf-8"));
      expect(config["editor.formatOnSave"]).toBe(true);
    });

    test("should use Biome as default formatter", () => {
      config = JSON.parse(readFileSync(settingsPath, "utf-8"));
      expect(config["editor.defaultFormatter"]).toBe("biomejs.biome");
    });

    test("should configure Biome code actions on save", () => {
      config = JSON.parse(readFileSync(settingsPath, "utf-8"));
      const codeActions = config["editor.codeActionsOnSave"] as Record<string, string>;
      expect(codeActions["source.organizeImports.biome"]).toBe("explicit");
      expect(codeActions["source.fixAll.biome"]).toBe("explicit");
    });

    test("should disable ESLint and Prettier", () => {
      config = JSON.parse(readFileSync(settingsPath, "utf-8"));
      expect(config["eslint.enable"]).toBe(false);
      expect(config["prettier.enable"]).toBe(false);
    });

    test("should enforce Unix line endings", () => {
      config = JSON.parse(readFileSync(settingsPath, "utf-8"));
      expect(config["files.eol"]).toBe("\n");
    });

    test("should trim trailing whitespace", () => {
      config = JSON.parse(readFileSync(settingsPath, "utf-8"));
      expect(config["files.trimTrailingWhitespace"]).toBe(true);
      expect(config["files.insertFinalNewline"]).toBe(true);
    });

    test("should exclude build artifacts from search", () => {
      config = JSON.parse(readFileSync(settingsPath, "utf-8"));
      const searchExclude = config["search.exclude"] as Record<string, boolean>;
      expect(searchExclude["**/node_modules"]).toBe(true);
      expect(searchExclude["**/dist"]).toBe(true);
      expect(searchExclude["**/.turbo"]).toBe(true);
    });

    test("should disable telemetry", () => {
      config = JSON.parse(readFileSync(settingsPath, "utf-8"));
      expect(config["telemetry.telemetryLevel"]).toBe("off");
      expect(config["amazonQ.telemetry"]).toBe(false);
      expect(config["aws.telemetry"]).toBe(false);
    });
  });

  describe("tasks.json", () => {
    const tasksPath = resolve(__dirname, "../tasks.json");
    let config: {
      version: string;
      tasks: Array<{ label: string; type: string; command: string }>;
    };

    test("should be valid JSON", () => {
      const content = readFileSync(tasksPath, "utf-8");
      expect(() => JSON.parse(content)).not.toThrow();
      config = JSON.parse(content);
    });

    test("should have version 2.0.0", () => {
      config = JSON.parse(readFileSync(tasksPath, "utf-8"));
      expect(config.version).toBe("2.0.0");
    });

    test("should have development tasks", () => {
      config = JSON.parse(readFileSync(tasksPath, "utf-8"));
      const devTasks = config.tasks.filter((t) => t.label.includes("Dev"));
      expect(devTasks.length).toBeGreaterThanOrEqual(3); // All, Web, API
    });

    test("should have build tasks", () => {
      config = JSON.parse(readFileSync(tasksPath, "utf-8"));
      const buildTasks = config.tasks.filter((t) => t.label.includes("Build"));
      expect(buildTasks.length).toBeGreaterThanOrEqual(1);
    });

    test("should have quality check tasks", () => {
      config = JSON.parse(readFileSync(tasksPath, "utf-8"));
      const qualityTask = config.tasks.find((t) => t.label.includes("Quality Check"));
      expect(qualityTask).toBeDefined();
      expect(qualityTask?.command).toContain("bun run quality");
    });

    test("should have lint and format tasks", () => {
      config = JSON.parse(readFileSync(tasksPath, "utf-8"));
      const lintTask = config.tasks.find((t) => t.label.includes("Lint") && !t.label.includes("Fix"));
      const formatTask = config.tasks.find((t) => t.label.includes("Format"));
      expect(lintTask).toBeDefined();
      expect(formatTask).toBeDefined();
    });

    test("should have test tasks", () => {
      config = JSON.parse(readFileSync(tasksPath, "utf-8"));
      const testTasks = config.tasks.filter((t) => t.label.includes("Test"));
      expect(testTasks.length).toBeGreaterThanOrEqual(2); // Test and Test: Watch
    });

    test("should have snake generation tasks", () => {
      config = JSON.parse(readFileSync(tasksPath, "utf-8"));
      const snakeTasks = config.tasks.filter((t) => t.label.includes("Snake"));
      expect(snakeTasks.length).toBeGreaterThanOrEqual(2);
    });

    test("all tasks should use shell type", () => {
      config = JSON.parse(readFileSync(tasksPath, "utf-8"));
      config.tasks.forEach((task) => {
        expect(task.type).toBe("shell");
      });
    });
  });

  describe("snake-evolution.code-workspace", () => {
    const workspacePath = resolve(__dirname, "../snake-evolution.code-workspace");
    let config: {
      folders: Array<{ name: string; path: string }>;
      extensions?: { recommendations: string[] };
    };

    test("should be valid JSON", () => {
      const content = readFileSync(workspacePath, "utf-8");
      expect(() => JSON.parse(content)).not.toThrow();
      config = JSON.parse(content);
    });

    test("should have root folder", () => {
      config = JSON.parse(readFileSync(workspacePath, "utf-8"));
      const rootFolder = config.folders.find((f) => f.name.includes("root"));
      expect(rootFolder).toBeDefined();
      expect(rootFolder?.path).toBe("..");
    });

    test("should have all package folders", () => {
      config = JSON.parse(readFileSync(workspacePath, "utf-8"));
      const packageFolders = config.folders.filter((f) => f.name.includes("packages"));
      expect(packageFolders.length).toBeGreaterThanOrEqual(4); // cli, engine, renderer, github, types
    });

    test("should have app folders", () => {
      config = JSON.parse(readFileSync(workspacePath, "utf-8"));
      const appFolders = config.folders.filter((f) => f.name.includes("apps"));
      expect(appFolders.length).toBeGreaterThanOrEqual(2); // web, api
    });

    test("should recommend essential extensions", () => {
      config = JSON.parse(readFileSync(workspacePath, "utf-8"));
      expect(config.extensions).toBeDefined();
      expect(config.extensions?.recommendations).toContain("biomejs.biome");
      expect(config.extensions?.recommendations).toContain("oven.bun-vscode");
    });
  });
});