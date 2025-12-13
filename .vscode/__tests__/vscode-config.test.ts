import { beforeAll, describe, expect, test } from "bun:test";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { type ParseError, parse as parseJsonc, printParseErrorCode } from "jsonc-parser";

/**
 * Parse JSONC file and throw descriptive error if parsing fails
 */
function parseJsoncFile(content: string, filePath: string): unknown {
  const errors: ParseError[] = [];
  const result = parseJsonc(content, errors, { allowTrailingComma: true });

  if (errors.length > 0) {
    const errorMessages = errors
      .map((e) => `  - ${printParseErrorCode(e.error)} at offset ${e.offset}`)
      .join("\n");
    throw new Error(`Failed to parse ${filePath}:\n${errorMessages}`);
  }

  return result;
}

describe("VSCode Configuration", () => {
  describe("extensions.json", () => {
    const extPath = resolve(__dirname, "../extensions.json");
    let config: {
      recommendations: string[];
      unwantedRecommendations: string[];
    };

    beforeAll(() => {
      config = parseJsoncFile(readFileSync(extPath, "utf-8"), extPath) as typeof config;
    });

    test("should be valid JSON", () => {
      expect(config).toBeDefined();
      expect(typeof config).toBe("object");
    });

    test("should recommend Biome extension", () => {
      expect(config.recommendations).toContain("biomejs.biome");
    });

    test("should recommend Bun extension", () => {
      expect(config.recommendations).toContain("oven.bun-vscode");
    });

    test("should NOT recommend Prettier or ESLint", () => {
      expect(config.unwantedRecommendations).toContain("esbenp.prettier-vscode");
      expect(config.unwantedRecommendations).toContain("dbaeumer.vscode-eslint");
    });

    test("should recommend Git and GitHub extensions", () => {
      expect(config.recommendations).toContain("eamodio.gitlens");
      expect(config.recommendations).toContain("GitHub.vscode-pull-request-github");
      expect(config.recommendations).toContain("GitHub.vscode-github-actions");
    });

    test("should recommend markdown tools", () => {
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

    beforeAll(() => {
      config = parseJsoncFile(readFileSync(launchPath, "utf-8"), launchPath) as typeof config;
    });

    test("should be valid JSON", () => {
      expect(config).toBeDefined();
      expect(typeof config).toBe("object");
    });

    test("should have correct version", () => {
      expect(config.version).toBe("0.2.0");
    });

    test("should have CLI debug configuration", () => {
      const cliConfig = config.configurations.find((c) => c.name.includes("Debug CLI"));
      expect(cliConfig).toBeDefined();
      expect(cliConfig?.type).toBe("bun");
    });

    test("should have Web debug configuration", () => {
      const webConfig = config.configurations.find((c) => c.name.includes("Web"));
      expect(webConfig).toBeDefined();
      expect(webConfig?.type).toBe("bun");
    });

    test("should have API debug configuration", () => {
      const apiConfig = config.configurations.find((c) => c.name.includes("API"));
      expect(apiConfig).toBeDefined();
      expect(apiConfig?.type).toBe("bun");
    });

    test("should have test debug configuration", () => {
      const testConfig = config.configurations.find((c) => c.name.includes("Test"));
      expect(testConfig).toBeDefined();
    });

    test("should have Full Stack compound configuration", () => {
      expect(config.compounds).toBeDefined();
      const fullStack = config.compounds?.find((c) => c.name.includes("Full Stack"));
      expect(fullStack).toBeDefined();
      expect(fullStack?.configurations.length).toBeGreaterThanOrEqual(2);
    });
  });

  describe("settings.json", () => {
    const settingsPath = resolve(__dirname, "../settings.json");
    let config: Record<string, unknown>;

    beforeAll(() => {
      config = parseJsoncFile(readFileSync(settingsPath, "utf-8"), settingsPath) as typeof config;
    });

    test("should be valid JSON", () => {
      expect(config).toBeDefined();
      expect(typeof config).toBe("object");
    });

    test("should enable format on save", () => {
      expect(config["editor.formatOnSave"]).toBe(true);
    });

    test("should use Biome as default formatter", () => {
      expect(config["editor.defaultFormatter"]).toBe("biomejs.biome");
    });

    test("should configure Biome code actions on save", () => {
      const codeActions = config["editor.codeActionsOnSave"] as Record<string, string>;
      expect(codeActions["source.organizeImports.biome"]).toBe("explicit");
      expect(codeActions["source.fixAll.biome"]).toBe("explicit");
    });

    test("should disable ESLint and Prettier", () => {
      expect(config["eslint.enable"]).toBe(false);
      expect(config["prettier.enable"]).toBe(false);
    });

    test("should enforce Unix line endings", () => {
      expect(config["files.eol"]).toBe("\n");
    });

    test("should trim trailing whitespace", () => {
      expect(config["files.trimTrailingWhitespace"]).toBe(true);
      expect(config["files.insertFinalNewline"]).toBe(true);
    });

    test("should exclude build artifacts from search", () => {
      const searchExclude = config["search.exclude"] as Record<string, boolean>;
      expect(searchExclude["**/node_modules"]).toBe(true);
      expect(searchExclude["**/dist"]).toBe(true);
      expect(searchExclude["**/.turbo"]).toBe(true);
    });

    test("should disable telemetry", () => {
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

    beforeAll(() => {
      config = parseJsoncFile(readFileSync(tasksPath, "utf-8"), tasksPath) as typeof config;
    });

    test("should be valid JSON", () => {
      expect(config).toBeDefined();
      expect(typeof config).toBe("object");
    });

    test("should have version 2.0.0", () => {
      expect(config.version).toBe("2.0.0");
    });

    test("should have development tasks", () => {
      const devTasks = config.tasks.filter((t) => t.label.includes("Dev"));
      expect(devTasks.length).toBeGreaterThanOrEqual(3); // All, Web, API
    });

    test("should have build tasks", () => {
      const buildTasks = config.tasks.filter((t) => t.label.includes("Build"));
      expect(buildTasks.length).toBeGreaterThanOrEqual(1);
    });

    test("should have quality check tasks", () => {
      const qualityTask = config.tasks.find((t) => t.label.includes("Quality Check"));
      expect(qualityTask).toBeDefined();
      expect(qualityTask?.command).toContain("bun run quality");
    });

    test("should have lint and format tasks", () => {
      const lintTask = config.tasks.find(
        (t) => t.label.includes("Lint") && !t.label.includes("Fix"),
      );
      const formatTask = config.tasks.find((t) => t.label.includes("Format"));
      expect(lintTask).toBeDefined();
      expect(formatTask).toBeDefined();
    });

    test("should have test tasks", () => {
      const testTasks = config.tasks.filter((t) => t.label.includes("Test"));
      expect(testTasks.length).toBeGreaterThanOrEqual(2); // Test and Test: Watch
    });

    test("should have snake generation tasks", () => {
      const snakeTasks = config.tasks.filter((t) => t.label.includes("Snake"));
      expect(snakeTasks.length).toBeGreaterThanOrEqual(2);
    });

    test("all tasks should use shell type", () => {
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

    beforeAll(() => {
      config = parseJsoncFile(readFileSync(workspacePath, "utf-8"), workspacePath) as typeof config;
    });

    test("should be valid JSON", () => {
      expect(config).toBeDefined();
      expect(typeof config).toBe("object");
    });

    test("should have root folder", () => {
      const rootFolder = config.folders.find((f) => f.name.includes("root"));
      expect(rootFolder).toBeDefined();
      expect(rootFolder?.path).toBe("..");
    });

    test("should have all package folders", () => {
      const packageFolders = config.folders.filter((f) => f.name.includes("packages"));
      expect(packageFolders.length).toBeGreaterThanOrEqual(4); // cli, engine, renderer, github, types
    });

    test("should have app folders", () => {
      const appFolders = config.folders.filter((f) => f.name.includes("apps"));
      expect(appFolders.length).toBeGreaterThanOrEqual(2); // web, api
    });

    test("should recommend essential extensions", () => {
      expect(config.extensions).toBeDefined();
      expect(config.extensions?.recommendations).toContain("biomejs.biome");
      expect(config.extensions?.recommendations).toContain("oven.bun-vscode");
    });
  });
});
