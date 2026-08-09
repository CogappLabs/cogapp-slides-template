import { defineCollection } from "astro:content";
import { z } from "astro/zod";
import { glob } from "astro/loaders";
import { surfaceNames } from "@/deck.config";

const slides = defineCollection({
  loader: glob({ pattern: "**/*.mdx", base: "./src/content/slides" }),
  schema: z.object({
    title: z.string(),
    bg: z.enum(surfaceNames).default("cream"),
    align: z.enum(["start", "center", "end"]).default("start"),
    /** Small uppercase label above the heading. `section` also names the slide
        in the index; `eyebrow` is label-only and wins when both are set. */
    section: z.string().optional(),
    eyebrow: z.string().optional(),
    notes: z.string().optional(),
    docs: z
      .union([
        z.string().url(),
        z.array(
          z.union([
            z.string().url(),
            z.object({ label: z.string(), href: z.string().url() }),
          ]),
        ),
      ])
      .optional(),
  }),
});

export const collections = { slides };
