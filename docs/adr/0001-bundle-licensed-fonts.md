# Bundle brand fonts in the repo

The Cogapp look depends on Civil (ABC Dinamo) and Untitled Serif (Klim). We
commit the woff2 files into the repo so a deck looks on-brand the moment it's
created, rather than shipping fallback fonts and asking each author to source
the files. Cogapp holds redistribution rights for both faces, so the repo can
be public.

## Consequences

- If those redistribution rights ever lapse or change, the fonts must be pulled
  from `public/fonts/` (and from git history) and `@font-face` switched to a
  fallback.
- Holding redistribution rights is not the same as granting forkers a font
  licence. Anyone reusing the fonts outside a Cogapp context is responsible for
  their own licensing.
