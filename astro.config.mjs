// @ts-check
import { defineConfig } from "astro/config";
import mdx from "@astrojs/mdx";
import tailwindcss from "@tailwindcss/vite";
import restart from "vite-plugin-restart";

import react from "@astrojs/react";

// When deploying to GitHub Pages, `site` is your org Pages URL and `base` is
// the repo name. For a CogappLabs repo these default to the values below.
// Override per-deck by editing both, or unset `base` for a custom domain / root.
export default defineConfig({
  site: "https://cogapplabs.github.io",
  base: "/cogapp-slides-template",
  trailingSlash: "ignore",
  // Sätteri, Astro 7's Markdown processor, applies GFM itself, so tables and
  // strikethrough need no remark plugin.
  integrations: [mdx(), react()],
  vite: {
    plugins: [
      tailwindcss(),
      restart({
        restart: [
          "src/content/order.ts",
          "src/content/slides/**/*.mdx",
        ],
      }),
    ],
  },
  markdown: {
    shikiConfig: {
      theme: "github-dark",
      wrap: false,
    },
  },
});