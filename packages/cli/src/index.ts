// Snake Evolution CLI
// Generate GitHub contribution snake animations

import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { simulateSnake } from "@snake-evolution/engine";
import { fetchContributions } from "@snake-evolution/github";
import { getTheme, renderAnimatedSVG, renderStaticSVG } from "@snake-evolution/renderer";
import { Command } from "commander";

import data from "../package.json";

const pkg = { version: data.version };

const program = new Command();

program
  .name("snake")
  .description("Generate GitHub contribution snake animations")
  .version(pkg.version);

program
  .command("generate")
  .description("Generate a snake animation from GitHub contributions")
  .requiredOption("-u, --username <username>", "GitHub username")
  .option("-o, --output <path>", "Output file path", "snake.svg")
  .option(
    "-t, --theme <theme>",
    "Theme name (github-light, github-dark, ocean, sunset, neon-gamer, cypherpunk, glass)",
    "github-dark",
  )
  .option("-f, --format <format>", "Output format (svg, gif)", "svg")
  .option("-y, --year <year>", "Year to generate for", String(new Date().getFullYear()))
  .option("--token <token>", "GitHub personal access token for higher rate limits")
  .option("--animated", "Generate animated SVG (default: true)", true)
  .option("--static", "Generate static SVG (single frame)")
  .option("--frame-delay <ms>", "Delay between frames in ms", "150")
  .option("--max-length <n>", "Maximum snake length (0 = auto)", "0")
  .option("--grow-every <n>", "Grow 1 segment every N contributions (0 = auto)", "0")
  .action(async (options) => {
    console.log(`🐍 Snake Evolution Generator`);
    console.log(`   Username: ${options.username}`);
    console.log(`   Theme: ${options.theme}`);
    console.log(`   Format: ${options.format}`);
    console.log(`   Year: ${options.year}`);
    console.log("");

    try {
      // Block glass theme for SVG (too heavy, freezes PC)
      if (options.theme === "glass" && options.format !== "gif") {
        console.error("❌ Error: Glass theme requires GIF output format.");
        console.error("   Glass uses blur/transparency effects that are too heavy for SVG.");
        console.error("   GIF support coming in v1.1. For now, try: --theme cypherpunk");
        process.exit(1);
      }

      // Fetch contributions
      console.log("📊 Fetching GitHub contributions...");
      const grid = await fetchContributions(
        options.username,
        options.token,
        Number.parseInt(options.year, 10),
      );
      console.log(`   Found ${grid.totalContributions} contributions`);

      // Get theme
      const palette = getTheme(options.theme);
      console.log(`🎨 Using theme: ${palette.name}`);

      // Simulate snake (use defaults for dynamic calculation unless overridden)
      console.log("🎮 Simulating snake...");
      const simOptions: Record<string, unknown> = { frameMode: "every" };
      if (options.maxLength !== "0") simOptions.maxLength = Number.parseInt(options.maxLength, 10);
      if (options.growEvery !== "0") simOptions.growEvery = Number.parseInt(options.growEvery, 10);

      const frames = simulateSnake(grid, simOptions);
      const maxSnakeLen = Math.max(...frames.map((f) => f.snake.segments.length));
      console.log(`   Generated ${frames.length} frames (max snake length: ${maxSnakeLen})`);

      // Render
      let output: string;
      const renderOptions = {
        palette,
        frameDelay: Number.parseInt(options.frameDelay, 10),
      };

      if (options.format === "gif") {
        console.log("🎬 GIF generation not yet implemented, falling back to animated SVG");
        output = renderAnimatedSVG(frames, renderOptions);
      } else if (options.static) {
        console.log("🖼️  Rendering static SVG...");
        const lastFrame = frames[frames.length - 1];
        if (lastFrame) {
          output = renderStaticSVG(lastFrame.grid, lastFrame.snake, renderOptions);
        } else {
          throw new Error("No frames generated");
        }
      } else {
        console.log("🎬 Rendering animated SVG...");
        output = renderAnimatedSVG(frames, {
          ...renderOptions,
          loop: true,
        });
      }

      // Write output
      const outputPath = resolve(process.cwd(), options.output);
      mkdirSync(dirname(outputPath), { recursive: true });
      writeFileSync(outputPath, output);
      console.log("");
      console.log(`✅ Saved to: ${outputPath}`);
      console.log(`   File size: ${(output.length / 1024).toFixed(1)} KB`);
    } catch (error) {
      console.error("❌ Error:", error instanceof Error ? error.message : error);
      process.exit(1);
    }
  });

program
  .command("themes")
  .description("List available themes")
  .action(() => {
    console.log("Available themes:");
    console.log("  github-light  - GitHub's default light theme");
    console.log("  github-dark   - GitHub's dark mode");
    console.log("  ocean         - Cool blue ocean tones");
    console.log("  sunset        - Warm sunset vibes");
    console.log("  neon-gamer    - Vibrant neon purple/green");
    console.log("  cypherpunk    - Blue/magenta cyberpunk vibes");
    console.log("  glass         - Liquid glass effect (requires GIF output)");
  });

program.parse();
