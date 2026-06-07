import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";

const slides = defineCollection({
  loader: glob({ pattern: "**/*.mdx", base: "./src/content/slides" }),
  schema: z.object({
    title: z.string(),
    bg: z
      .enum(["cream", "slate", "pink", "green", "purple", "blue", "white"])
      .default("cream"),
    align: z.enum(["start", "center", "end"]).default("start"),
    section: z.string().optional(),
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
