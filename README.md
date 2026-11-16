# Tregonetha Lake

Replaces the WordPress site at tregonethalake.co.uk. Built on the Treeworks Cornwall
stack, with the simpler design Mel signed off in November 2026.

**Stack:** Sanity (page-builder CMS) · React Router 8 in framework/SSR mode · Tailwind v4 · Netlify.

Two packages, one deploy. The site is at the root; the Studio is a separate npm
package in `studio/`, compiled by the Sanity CLI and served as static files from
the same Netlify site at `/studio`. See [The Studio is its own package](#the-studio-is-its-own-package)
for why.

## Running it

```bash
npm install
npm --prefix studio install   # once — the Studio has its own dependencies
npm run dev                   # site at :5173, Studio at :5173/studio/
```

`npm run dev` starts both servers: React Router on :5173 and `sanity dev` on
:3333, with Vite proxying `/studio` onto :5173 so they share an origin. The proxy
mirrors what Netlify does in production, so the URLs behave the same in both:
`/studio` redirects to `/studio/`, and `/static/*` is rewritten to the Studio's
copy. Saving a Studio file reloads only the Studio — the site's watcher ignores
`studio/`.

Copy `.env.example` to `.env`; the Sanity project is `vwnj733e` / `production`.
The Studio reads its own `studio/.env`, but does not need one: the project and
dataset have literal fallbacks in `studio/sanity.config.ts`.

| Script                            | What it does                                                    |
| --------------------------------- | --------------------------------------------------------------- |
| `npm run dev`                     | Both dev servers, site and Studio, on one origin                |
| `npm run dev:site` / `dev:studio` | One of them on its own                                          |
| `npm run build`                   | Site, then the Studio into `build/client/studio`                |
| `npm run build:studio`            | Just the Studio (installs its dependencies first)               |
| `npm run preview`                 | Serve the production build locally, reading `.env`              |
| `npm run typecheck`               | Route typegen + `tsc`, both packages                            |
| `npm run check:forms`             | Fails if the contact form and `public/__forms.html` drift apart |

## How the page builder works

A `page` is a title, a slug and an **array of sections**. Every section type is allowed
on every page, so order and mix are an editor decision.

```
Sanity page.sections[]  →  SectionRenderer  →  one component per _type
```

Adding a section type is three things and no page edits:

1. a schema file in `studio/schemaTypes/sections/`
2. its `_type` added to `SECTION_TYPES` in `studio/schemaTypes/documents/page.ts`
3. a component registered in `app/components/SectionRenderer.tsx`

The registry is typed as a mapped union, so a key that does not match its component's
props is a compile error rather than a blank section in production.

Every section carries `appearance` (tone: cream / mist / lake, spacing, wavy edge, anchor id) —
that is how colour rhythm gets composed in Studio rather than in code.

## Design tokens

All in the `@theme` block at the top of `app/app.css`. Colours, type scale, radii and
section rhythm are defined once there; came from. Display face is Fraunces at 400, body is Figtree. Colours: lake `#0e4a43`,
teal `#0f6258`, mist `#dde9e3`, cream `#f8f5ea`, ember `#e8731f` (accents) and
ember-ink `#b84c0a` (buttons — white on it passes AA).

## The contact form (Netlify Forms)

Netlify discovers forms by parsing static HTML at deploy time, which an SSR app never
emits. So:

- `public/__forms.html` holds a hidden copy of every field, purely for the build-time parser
- the React form POSTs url-encoded data with a matching `form-name`
- `npm run check:forms` fails the build if the two ever disagree — otherwise a new field
  would be silently dropped from every submission with no error

Submissions land in **Netlify → Forms**, with spam filtering and a honeypot included.
Set up email notifications there. If you later want them inside Studio instead, a
`submission-created` webhook into a small function is the way.

## Sections added for Tregonetha

| Section | Use |
|---|---|
| `priceTable` | Camping by date band, bell tents by season, fishing tickets. Several tables per section; cells are free text. |
| `infoList` | Label / detail pairs: which areas are open when, opening times, parking, what is included. Rows or cards. |
| `menus` | Wildfire's food and drink menus, typed in, as a PDF, or both. |
| `events` | What's On. Lists upcoming **Event** documents; past events drop off the day after they end. |
| `embed` | A booking system or calendar in a sandboxed frame — CampSuite, Calendly (wedding viewings), Catch (fishing tickets). Only https addresses; script snippets are deliberately not accepted from the CMS. |

Internal links can also jump to a section: set **Jump to section** to a section's
Anchor ID, e.g. the header's *Book now* points at `/camping-glamping#book`.

The gallery section still supports an Instagram feed via Behold
(`VITE_BEHOLD_FEED_URL`), but defaults to images managed in Studio.

## Header and menu

Lake-green bar: logo and name, the main tabs, the *Book now* button, and a
hamburger that opens a full-page overlay listing **every** page.

Which links sit in the top bar is an editor decision: tick **Show in the top bar**
on a nav item in Studio. Everything appears in the overlay regardless. The six
main tabs fit across the bar from 1280px; below that they live in the overlay.

Breakpoints:

| Width        | Shows                                             |
| ------------ | ------------------------------------------------- |
| `< 640px`    | name · phone icon · hamburger                     |
| `640–1023px` | name · phone number · CTA · hamburger             |
| `1024–1279px` | name · phone number · CTA · hamburger |
| `≥ 1280px`   | name · bar links · CTA · hamburger |

The overlay is a **sibling** of `<header>`, not a child. The header uses
`backdrop-blur`, and `backdrop-filter` creates a containing block for
fixed-position descendants — nested inside, the overlay clipped itself to the
header's 80px instead of covering the viewport. Worth remembering before moving
it back.

## Motion

Scroll reveals are CSS transitions toggled by a `data-revealed` attribute that one
shared `IntersectionObserver` sets, then unobserves. No animation library.

Where a page-builder block holds an **array** — feature list items, service cards,
testimonials, stats, FAQ rows, gallery images, logos — each item reveals
individually rather than the block fading in as one. Those sections pass
`reveal={false}` to the section wrapper so the two do not nest and fight.

Stagger follows the layout, which is the part worth getting right:

- items that appear **side by side** (cards, stats, logos) stagger by index, capped
  so a long row does not trail
- items **stacked vertically** (alternating feature rows, compact lists) get no
  stagger — each is already reaching the fold at a different moment, and adding
  delay on top just makes them feel late

Everything is hidden only once a `js` class confirms JavaScript is running, so a
blocked bundle cannot leave the page invisible, and all of it is disabled under
`prefers-reduced-motion`.

The menu toggle morphs into its own close icon: the header sits above the overlay
in the stack (`z-50` vs `z-40`) and drops its background when open, so one button
serves both states. The overlay stays mounted and animates on `opacity` and
`visibility` rather than mounting and unmounting, which is what lets it animate
out as well as in; `visibility` is also what keeps it out of the tab order when
closed.

## Waves

The motif from the design. Each section hangs a wavy bottom edge, in its own
colour, over the top of the next one (`WaveEdge` in `app/components/ui/Section.tsx`),
so a section never needs to know what came before it; where two neighbours share
a colour the wave simply disappears. Turn it off per section with **Appearance →
Wavy bottom edge**. **Background pattern → Wavy lines** adds the faint flowing
lines from the homepage hero, and headings get a short ember squiggle.

The logo falls back to `public/logo-mark.svg` (the white Tregonetha Lake mark)
until one is uploaded in Site settings.

## Icons and structured data

### Icons come from one file

`public/favicon.svg` is the master — the Tregonetha mark in cream on a lake tile. Everything else
is generated from it:

```bash
npm run build:icons    # after editing public/favicon.svg
```

That writes `favicon.ico`, `apple-touch-icon.png` (iOS), and `icon-192/512.png`
(Android and the manifest) into `public/`. The output is **committed**, so a
deploy never runs this and `sharp` stays a devDependency Netlify never builds.

Two things in `scripts/build-icons.mjs` look odd and are deliberate. It raises
sharp's `density` per target size, because sharp rasterises an SVG at its natural
size before resizing — without it, the 512px icon is a blurry upscale of a 64px
bitmap. And it assembles the `.ico` container by hand (sharp cannot write ICO,
and the format is a 6-byte header plus one entry wrapping a PNG), then parses it
back and asserts the result, because a malformed icon renders as a blank tab
rather than an error.

The tile is opaque on purpose: a transparent icon vanishes against a light
browser tab, and iOS composites transparent touch icons onto black.

### What we emit, and where

| Schema | Where | Why there |
|---|---|---|
| `Campground` (a LocalBusiness) | Homepage only | Describes the organisation, not the page. Repeating it site-wide gives Google several copies of one entity to reconcile. |
| `BreadcrumbList` | Every page except home | Google swaps the raw URL in a result for a readable trail. Omitted on the homepage — a one-item trail describes nothing. |
| `FAQPage` | Any page with an FAQ section | Eligible for the expandable Q&A result. |

All of it is run through `stegaClean` first. Structured data is machine-read, and
stega markers are invisible characters that would corrupt it — see
[The stega trap](#the-stega-trap).

Absolute URLs are mandatory in both `sitemap.xml` and JSON-LD `item` values, and
a relative one is *ignored rather than rejected*. `app/siteUrl.server.ts` is the
single source of that origin, shared by the sitemap, robots and both schemas.

To check it all actually renders, with the dev server running:

```bash
npm run check:seo
```

It fetches the real pages, parses every JSON-LD block, and asserts the icons are
served as the formats they claim. It also fails on any `null` property: a GROQ
projection returns null for an unset field, `JSON.stringify` keeps null while
dropping `undefined`, and `"image": null` asserts the business *has* no image
rather than saying nothing.

### One address per page, and what search engines may index

| Concern | How it works |
|---|---|
| The site's own address | `siteUrl(request)` in `app/siteUrl.server.ts` reads `SITE_URL`, then Netlify's `URL`, then the request's own origin. Netlify's `URL` is the *primary* domain, so it changes from `tregonetha-lake.netlify.app` to the custom domain by itself once that domain is made primary. **There is nothing to configure**, before or after launch. |
| Canonical + `og:url` | Every page. Built by `seoContext()` from the address above plus the request path, with no trailing slash and no query string, and added by `buildMeta()`. |
| Trailing slashes | The root loader (`app/root.tsx`) answers `/tree-surgery/` with a 301 to `/tree-surgery`, keeping the query string. Without it both URLs returned the same page. |
| What may be indexed | `isIndexable(request)`. It looks at the **host the request arrived on**: `*.netlify.app` (the default address, deploy previews, branch deploys) and `localhost` are closed; anything else is open. Closed hosts get `Disallow: /` in `robots.txt` and a `noindex` meta tag, and their canonical points at themselves. |

Why the host and not Netlify's `CONTEXT` variable: `CONTEXT` is a build-time value
that is not reliably present when the server function runs, and
`tregonetha-lake.netlify.app` is itself a *production* deploy, so "is this
production?" would have called it indexable. Because the rule reads the host, it
also needs no change at launch: the moment the custom domain is attached and the
DNS is switched, requests arrive on an open host and the site becomes indexable.

`SITE_URL` is optional. Setting it makes the rule stricter — only that exact host
is indexable — and overrides the address used in canonicals, the sitemap and
structured data. `seo.noIndex` on a page in Studio still keeps that one page out
(and out of the sitemap) on any host.

`npm run check:seo` asserts all of this against a running site: a canonical and
`og:url` on the homepage and an inner page, `robots.txt` and the `noindex` tag
agreeing with each other, the trailing-slash 301, and the homepage `<loc>` ending
in `/` to match its canonical. Point it at production after a launch with
`node scripts/check-seo.mjs https://tregonethalake.co.uk`.

## Live preview (Presentation)

Open Studio → **Presentation**. The site renders in an iframe beside the content,
edits appear as you type, and clicking anything in the preview jumps to that field.

**There is no origin to configure.** The Studio does run on its own port in
development (:3333), but Vite proxies it onto the site's origin at `/studio`, and
in production Netlify serves it from the same host. Either way the preview target
is the origin the Studio is already on, so `previewUrl.origin` is left undefined
on purpose: Presentation then uses its own origin, which is correct in dev, on a
Netlify deploy preview, and in production, without anything being set.

This is also why the proxy exists rather than just opening :3333 directly. The
draft-mode cookie is same-origin; a Studio on a different origin cannot set it,
and Presentation would show published content with nothing editable.

The one exception is a standalone Studio at `*.sanity.studio`, which genuinely is a
different host. Only then set `SANITY_STUDIO_PREVIEW_ORIGIN` (and add that origin to
CORS). If you skip the standalone deploy, you never touch this.

### What it needs

One thing: a **Viewer** token, so the server can read drafts.
sanity.io/manage → the project → API → Tokens → Add token → Viewer. Then:

```
SANITY_VIEWER_TOKEN=<the token>
```

in `.env` locally and in Netlify's environment variables. Without it — or with a
token Sanity rejects — `/api/preview/enable` still redirects, so Presentation shows
published content rather than a blank pane, and a notice inside the preview iframe
says why. `/api/preview/status` reports the details.

### Why published reads are unauthenticated

Published content is fetched with a **tokenless** client (`publicClient`), and
only draft reads use the authenticated one. That split matters: with a single
token-carrying client, one revoked or mistyped token takes every page down with
`Unauthorized - Session not found`, rather than just breaking preview.

`loadContent()` also falls back to published content if Sanity rejects the token
mid-preview, and logs why. A stale token should degrade preview, never 500 the site.

Quick check on whether a token is good — open `/api/preview/status`. It reports
whether one is configured, whether Sanity accepts it, and a fingerprint of the
value (never the value itself) so you can tell a rejected token apart from a dev
server that has not been restarted since `.env` changed. Those two look identical
from the outside and are the usual cause of "Presentation stopped working".

### Draft mode is confined to the Studio iframe

There is no preview mode on the public site and no exit button. Drafts and stega exist
**only** inside Presentation's iframe:

- Presentation calls `/api/preview/enable` with a single-use secret it just wrote to the
  dataset; we validate it against the Content Lake — not the URL — and set an httpOnly,
  signed session cookie
- a loader only honours that cookie when `Sec-Fetch-Dest` says the request came from an
  iframe, so the same browser gets published content in a normal tab
- opening the site normally **clears** the cookie, which is what replaces an exit button

Two things are deliberately separate. The visual-editing runtime mounts whenever we are
inside the preview iframe, so Presentation's overlay and navigation connect even without
a token; drafts additionally need the cookie and a working token. A missing or expired
token therefore costs you draft content, not the whole Presentation connection.

Validation failures never grant drafts — but they do still redirect to the page, so
Presentation shows published content rather than a blank pane.

Set `PREVIEW_SESSION_SECRETT` in production to sign the cookie with something other than
the dev default.

### The stega trap

In preview, Sanity encodes invisible characters into every string so it can map text back
to a field. An 11-character `"alternating"` becomes ~750 characters. That means
`layout === 'alternating'` is **false** in preview, and `TONE[tone]` misses — so pages
silently render with default layouts, in preview only.

`app/lib/stega.ts` exports `opt()` for this. The rule:

- **clean** anything you compare, switch on, or use as an object key or HTML id
- **clean** anything going into `<head>` or JSON-LD — stega in a meta description shows
  up in Google's snippet
- **never** clean text you render, or click-to-edit stops working

Every existing section already does this. New ones should too.

## The Studio is its own package

`studio/` is a separate npm package with its own `package.json` and lockfile,
holding `sanity`, `@sanity/vision`, `@sanity/icons` and `styled-components`. The
site's package holds `@sanity/client`, `@sanity/react-loader`,
`@sanity/visual-editing` and `@portabletext/react`. Nothing crosses over.

It used to be a route in this app — `route('studio/*')` rendering `<Studio
config={config}/>`. Two reasons it is not any more:

- **Auto-updates.** Sanity ships Studio patches to a built bundle without a
  redeploy, and that is documented as unsupported for third-party build tools and
  embedded Studios. Compiled by the CLI, the Studio patches itself; bundled into
  the site's React build, it only moved when someone bumped the dependency.
- **Version coupling.** The embedded Studio shared the site's React and
  styled-components. Now each package pins what it needs.

The URL did not change. `npm run build` builds the site, then builds the Studio
into `build/client/studio` — inside the publish directory, so Netlify serves it
as static files from the same deploy.

### The routing rules, and why each exists

Three rules in `netlify.toml`, in this order:

| Rule                                        | Why                                                                                                                                                                                |
| ------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `/studio` → `/studio/` (301)                | The Studio lives at the trailing slash, in `sanity dev` too. This normalises the URL before the Studio's own router sees it.                                                       |
| `/studio/*` → `/studio/index.html` (200)    | The Studio routes client-side, so `/studio/structure` has no file on disk and would otherwise reach the SSR function and 404.                                                      |
| `/static/*` → `/studio/static/:splat` (200) | `sanity build` applies the base path to its script and stylesheet tags but leaves the favicon and web manifest `<link>`s at `/static/*`. Confirmed against the built `index.html`. |

All three depend on Netlify serving an existing file ahead of a non-forced
redirect — otherwise `/studio/` would 301 to itself forever and the bundles under
`/studio/static` would return `index.html`. That is the same precedence every
single-page-app rewrite relies on.

`sanity build` warns that no `appId` is configured, which means the Studio tracks
the latest auto-update channel rather than a version you pin. That is fine to
start with. To pin one, take the app id from
sanity.io/manage → the project → Studios and add it under `deployment` in
`studio/sanity.cli.ts`.

The base path is set **once**, as `project.basePath` in `studio/sanity.cli.ts`.
Do not also set `basePath` in `sanity.config.ts`: that one is the workspace base
path, Sanity joins the two, and the Studio ends up at `/studio/studio`.

### Publishing

```bash
npm run schema:deploy    # publishes the schema so Sanity tooling knows the types
npm run studio:deploy    # optional: a hosted Studio at tregonetha-lake.sanity.studio
```

Both need your own `sanity login`. The hosted copy is optional — the Netlify site
serves a Studio at `/studio` either way — but it gives the client somewhere to
edit before the frontend is live.

That copy is served from its host's root rather than `/studio`, so
`npm run studio:deploy` sets `SANITY_STUDIO_BASE_PATH=/` for that one command
(`studio/scripts/deploy-standalone.mjs`). Deliberately not set in any env file:
there it would silently break the Netlify build and every local `npm run build`.
It also needs `SANITY_STUDIO_PREVIEW_ORIGIN` set to the site's URL, and that
origin added to CORS, because it genuinely is a different host.

## Deploying

Netlify, building from this repo. `netlify.toml` is configured; the build command
is `npm run check:forms && npm run build`, and `build` chains the Studio after the
site (that order matters — `react-router build` clears `build/client`, which is
where the Studio lands).

Netlify installs the root package only, which is why `build:studio` runs its own
`npm ci` inside `studio/` first.

Set these environment variables in the Netlify UI:

```
VITE_SANITY_PROJECT_ID=vwnj733e
VITE_SANITY_DATASET=production
VITE_SANITY_API_VERSION=2026-08-01
VITE_SANITY_STUDIO_URL=/studio
SANITY_VIEWER_TOKEN=<Viewer token, for Presentation>
PREVIEW_SESSION_SECRETT=<long random string>
```

`PREVIEW_SESSION_SECRETT` is required: the server refuses to boot in production
without it rather than signing draft-access cookies with a secret published in
this repository.

The Studio's own project and dataset are not listed — they are literals in
`studio/sanity.config.ts` and `studio/sanity.cli.ts`, because `.env` is gitignored
and the build has no env file to read.

Then add the deploy URL as a CORS origin in the Sanity project settings.

## Content

Seeded from the live WordPress site and Mel's email of 16 November 2026 (2027
seasons and prices, Wildfire sections, CampSuite as the booking system). Existing
slugs are kept — `/fishing`, `/camping-glamping`, `/cornish-lakeside-weddings`,
`/sustainability`, `/contact-us`, `/things-to-do` — because they carry the
current search rankings. `/wildfire` is new.
