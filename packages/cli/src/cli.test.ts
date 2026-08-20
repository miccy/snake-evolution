import { describe, expect, test } from "bun:test";
import { spawn } from "bun";

describe("CLI Integration", () => {
  const cliPath = "src/index.ts";

  test("generate --help shows all options", async () => {
    const proc = spawn(["bun", "run", cliPath, "generate", "--help"], {
      cwd: import.meta.dir + "/..",
      stdout: "pipe",
      stderr: "pipe",
    });

    const output = await new Response(proc.stdout).text();
    await proc.exited;

    expect(output).toContain("--theme");
    expect(output).toContain("--frame-delay");
    expect(output).toContain("--max-length");
    expect(output).toContain("--grow-every");
    expect(output).toContain('default: "60"'); // Check default frame delay
  });

  test("themes command lists available themes", async () => {
    const proc = spawn(["bun", "run", cliPath, "themes"], {
      cwd: import.meta.dir + "/..",
      stdout: "pipe",
      stderr: "pipe",
    });

    const output = await new Response(proc.stdout).text();
    await proc.exited;

    expect(output).toContain("github-light");
    expect(output).toContain("github-dark");
    expect(output).toContain("ocean");
    expect(output).toContain("sunset");
    expect(output).toContain("neon-gamer");
    expect(output).toContain("cypherpunk");
  });
});
