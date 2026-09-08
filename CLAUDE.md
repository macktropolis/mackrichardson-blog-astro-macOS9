# CLAUDE.md

Guidance for working in this repository.

## Project

Mack Richardson's personal website (`mackrichardson.com`) — an Astro 5 **static** site
with a Mac OS 9 / "Mackintosh desktop" visual theme. Personal blog covering FileMaker,
web development, comics, sci-fi books, and retro toys. Internal package name `mack-os`.

## Commands

| Command           | Action                                                                    |
| :---------------- | :----------------------------------------------------------------------- |
| `npm run dev`     | Dev server at `localhost:4321`                                           |
| `npm run build`   | `astro check` → `astro build` → `pagefind --site dist` → copy Pagefind into `public/` |
| `npm run preview` | Preview the production build                                             |

There is no test suite, linter, or CI. `astro check` (TypeScript) runs as part of `build`.

## Stack

- **Astro 7**, static output, `sharpImageService` for images
- Integrations: `@astrojs/sitemap`, `@astrojs/rss`, `astro-icon`
- **Pagefind** search index is generated at build time and copied to `public/pagefind`,
  but no search UI is currently wired into any page/component
- Google Analytics (`src/components/GoogleAnalytics.astro`) and Disqus comment-count
  script (in `Layout.astro`) are active; the `Comments` component is commented out
- TypeScript is loose — `//@ts-ignore` is used liberally in page frontmatter

## Structure

- `src/pages/` — routes
  - `index.astro` — home, lists all posts
  - `blog/[...page].astro` — paginated post list; `blog/[slug].astro` — single post
    (contains a large `is:global` `<style>` block)
  - `category/[...category].astro`, `tags/[tag].astro`, `author/[...author].astro` — taxonomy pages
  - `about.astro`, `404.astro`, `rss.xml.js`
  - `holiday-cards/` — family holiday-card feature; `index.astro` iframes the static `holiday-cards.html`
- `src/content/blog/` — Markdown posts (single `blog` collection)
- `src/content.config.ts` — collection schema + `glob` loader (Content Layer API; see below)
- `src/layouts/Layout.astro` — the only layout; composes head, site header, media
  sidebar, `<slot />`, and four `:target`-toggled popups (`#popup1`–`#popup4`)
- `src/components/` — `.astro` components. Cards emulate OS 9 windows (title bars with
  close/expand/collapse control images). Several components are dormant/unused
  (`Snowfall`, `Christmas`, `RelatedPosts`, `Comments`, `Tags-Bak`, `FeatureImage`, `Link`).
- `src/js/utils.js` — `slugify()`, `formatDate()`, `formatBlogPosts()`
- `src/data/site.json` — site-wide metadata (name, description, socials, contact)

## Content model

Blog collection uses the **Content Layer API**: `defineCollection` with a
`glob({ pattern: "**/*.md", base: "./src/content/blog" })` loader. Consequently:

- Entry id has **no file extension** (`npm-business-card`, not `npm-business-card.md`).
  Use `post.id` — `post.slug` no longer exists.
- Render body content with `import { render } from "astro:content"` →
  `const { Content } = await render(post)`, not `post.render()`.

Blog post frontmatter (enforced by `src/content.config.ts`):

- `title` (string), `date` (date), `author` (enum — only `"Mack Richardson"`)
- `image: { src, alt, class? }` — `src` is `image()` (Content Layer helper). The hero
  file lives in `src/assets/blog/<post-slug>.<ext>` and the frontmatter path is
  relative (`../../assets/blog/<post-slug>.<ext>`), so `<Image>` optimizes it.
  Images used **inside** post bodies stay in `public/assets/images/blog/…` and are
  referenced with absolute `/assets/…` paths (raw `<img>`, unoptimized).
- `description` (string, **max 160 chars**)
- `draft` (bool, default false), `mackdaddy` (bool, default false)
- `category` (enum): `Coding`, `Comics`, `FileMaker`, `MackDaddy Fun & Games`,
  `Retro Gaming`, `Sci-Fi`, `Random Fun`, `Tech`, `Toys`
- `tags` (string array, optional)

`formatBlogPosts()` filters out drafts and future-dated posts and sorts by date
(descending) unless `sortByDate: false` is passed (which randomizes).

Note: `tags/[tag].astro` assumes every post has a `tags` array — a post without one
will break that page's `getStaticPaths`.

## Styling

Plain CSS, no framework. `style.css` (repo root) `@import`s six ITCSS-style layers from
`src/css/`, in order: `reset`, `fonts`, `variables`, `defaults`, `components`, `utils`.

- Colors are HSL-triplet CSS custom properties in `src/css/variables/index.css`, used as
  `hsl(var(--color-dark), 1)`.
- Fonts: Apple Garamond, Geneva (CDN), local `checkbox` / `advercase` webfonts,
  Mountains of Christmas.
- Layout uses experimental `display: grid-lanes` with an `@supports` fallback to CSS `columns`.
- Page-specific overrides live in per-page/per-component `<style>` blocks; `blog/[slug].astro`
  uses `is:global`.

## Conventions

- Match the existing import-grouping comment style in page frontmatter
  (`// library imports`, `// component imports`, etc.).
- Build URLs with `slugify()` from `src/js/utils.js`; taxonomy routes expect slugified params.
- Static assets are referenced from `/assets/...` (served from `public/`).
- Commit directly on `main`; recent history is small iterative UI/layout tweaks.
