// @ts-check

import starlight from "@astrojs/starlight";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "astro/config";

// https://astro.build/config
export default defineConfig({
  site: "https://snake-evolution.dev",
  vite: {
    plugins: [tailwindcss()],
  },
  integrations: [
    starlight({
      title: "Snake Evolution",
      description: "Transform your GitHub contribution graph into an epic snake animation",
      logo: {
        light: "./src/assets/logo-light.svg",
        dark: "./src/assets/logo-dark.svg",
        replacesTitle: false,
      },
      social: [
        {
          icon: "github",
          label: "GitHub",
          href: "https://github.com/miccy/snake-evolution",
        },
      ],
      editLink: {
        baseUrl: "https://github.com/miccy/snake-evolution/edit/main/apps/web/",
      },
      sidebar: [
        {
          label: "Getting Started",
          items: [
            { label: "Introduction", slug: "guides/introduction" },
            { label: "Quick Start", slug: "guides/quick-start" },
            { label: "Installation", slug: "guides/installation" },
          ],
        },
        {
          label: "Guides",
          items: [
            { label: "GitHub Action", slug: "guides/github-action" },
            { label: "Customization", slug: "guides/customization" },
            { label: "Color Palettes", slug: "guides/palettes" },
          ],
        },
        {
          label: "Reference",
          autogenerate: { directory: "reference" },
        },
        {
          label: "Architecture",
          items: [
            { label: "Overview", slug: "architecture/overview" },
            { label: "Evolu Integration", slug: "architecture/evolu" },
            { label: "API Reference", slug: "architecture/api" },
          ],
        },
      ],
      customCss: ["./src/styles/custom.css"],
    }),
  ],
});
