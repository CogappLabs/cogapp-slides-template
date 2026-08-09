// Deck-level settings: the title page, the browser tab, the index.
// Edit this rather than the markup in `src/pages/index.astro`.
export const deck = {
  title: "Deck title",
  subtitle: "Subtitle · Context line",
  /** Shown beside the logo on the title slide. */
  credit: "Presenter · Date",
  /** Appended to each page's <title>, after the slide name. */
  suffix: "Cogapp",
} as const;
