# Cogapp slides template

A seed template for building presentation decks at Cogapp. Authors copy it via
GitHub's "Use this template", then own and diverge the copy freely. The template
never pushes updates back to copies; the example slides are disposable scaffolding.

## Language

**Template**:
This repository. The thing you copy from. Holds the engine, theme, and example
slides. Not versioned or published as a package.
_Avoid_: framework, library, starter kit (it is not consumed as a dependency)

**Deck**:
A copy made from the template via "Use this template". Owned by its author and
free to diverge. One deck is one presentation.
_Avoid_: instance, project, site

**Slug**:
A slide's identifier: its filename minus `.mdx`. The single string that links
the order list, the file, and the URL (`/slide/<slug>`). Astro's content loader
exposes the same value as `slide.id`, so `id === slug` by construction; prefer
"slug" everywhere except where Astro's API forces `id`.
_Avoid_: id, name, key (when referring to slide identity)

**Order**:
The deck's slide sequence, declared explicitly as a list of slugs in
`src/content/order.ts`. The single source of truth for sequence. A slide file
that exists but is not listed is silently excluded from the deck; a slug listed
with no matching file is a build error.
_Avoid_: sequence, sort, index

**Base**:
The URL path prefix the deck is served under, set once as `base` in
`astro.config.mjs` (e.g. `/my-deck` for GitHub Pages at
`org.github.io/my-deck`). The single rename pivot: fonts, the home link, and
slide links all derive from it, so changing it is the only edit a rename needs.
_Avoid_: path prefix, root, mount point
