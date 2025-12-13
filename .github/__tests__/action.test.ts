import { beforeAll, describe, expect, test } from "bun:test";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

describe("GitHub Action Configuration", () => {
  const actionPath = resolve(__dirname, "../../action.yml");
  let actionContent = "";

  beforeAll(() => {
    actionContent = readFileSync(actionPath, "utf-8");
  });

  test("action.yml should exist and have content", () => {
    expect(actionContent.length).toBeGreaterThan(0);
  });

  test("should have required metadata", () => {
    expect(actionContent).toContain("name:");
    expect(actionContent).toContain("description:");
    expect(actionContent).toContain("author:");
  });

  test("should have correct branding", () => {
    expect(actionContent).toContain("branding:");
    expect(actionContent).toContain("icon:");
    expect(actionContent).toContain("color:");
  });

  test("should define github_user_name input as required", () => {
    expect(actionContent).toContain("github_user_name:");
    expect(actionContent).toMatch(/github_user_name:[\s\S]*?required:\s*true/);
  });

  test("should have optional inputs with defaults", () => {
    // outputs should have default
    expect(actionContent).toContain("outputs:");
    expect(actionContent).toMatch(/outputs:[\s\S]*?default:\s*['"]dist\/snake\.svg['"]/);

    // theme should have default
    expect(actionContent).toContain("theme:");
    expect(actionContent).toMatch(/theme:[\s\S]*?default:\s*['"]github-dark['"]/);
  });

  test("should define composite action with Bun setup", () => {
    expect(actionContent).toContain("using: 'composite'");
    expect(actionContent).toContain("oven-sh/setup-bun@v2");
  });

  test("should have step to install dependencies", () => {
    expect(actionContent).toContain("bun install --frozen-lockfile");
  });

  test("should reference correct action_path", () => {
    // Using concatenation to avoid lint error for template-like string
    expect(actionContent).toContain("$" + "{{ github.action_path }}");
  });
});
