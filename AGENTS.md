# Repository Guidelines

## Project Overview

Static, single-page wedding invitation for **Williams & Elizabeth · 21 de febrero de 2027** at La Estancia, Planes de Renderos, El Salvador. All copy is Spanish (`<html lang="es">`). Features: sticky nav, countdown, photo gallery + lightbox, day itinerary, audio player, Google Maps embed + Waze link, and a per-guest RSVP flow keyed by `?i=CODIGO` that reads/writes a Google Apps Script endpoint backed by Google Sheets.

No framework, no build step, no package manager. Four hand-written source files (`index.html`, `css/styles.css`, `css/flores.css`, `js/main.js`) plus local assets.

## Architecture & Data Flow

```
index.html (all markup, CSS links, single <script>)
  ├── css/styles.css  → design tokens (:root vars), layout, components
  ├── css/flores.css  → decorations only (::before/::after SVG backgrounds), must load AFTER styles.css
  └── js/main.js      → config block + all behavior, ES5, one global scope
```

`main.js` is a **classic global script**, loaded synchronously at the end of `<body>` (no `defer`, no modules). It runs top-to-bottom and immediately renders into containers that must already exist in HTML: `#grid`, `#tl`. Order inside the file is the execution order — do not reorder blocks without checking DOM dependencies.

Runtime data flow:

- **Content → DOM**: JS config arrays (`FOTOS`, `ITINERARIO`, `CANCIONES`) are mapped to HTML strings and injected with `innerHTML` into `#grid`, `#tl`, and the player. Content strings are author-controlled; there is no escaping layer, so never interpolate untrusted text.
- **Guest → backend**: `TOKEN` is read from `#i=CODE` (preferred, never leaves the browser) or the legacy `?i=CODE` and gates everything RSVP-related. If present, `cargarInvitacion()` does `GET SHEETS_URL?i=TOKEN&t=<now>`; `mostrarInvitacion(d)` unhides `#rsvp` + the nav link and sets the seat cap. Submit does `POST SHEETS_URL` with `mode:"no-cors"` (opaque response), then **refetches until the saved row appears** (`confirmarEstado(3)`, 700 ms apart) — success is inferred, never read from the POST response.
- **Privacy**: the page sets `noindex` and `no-referrer`, so invitation URLs (which carry the guest token) are not indexed and are not sent as `Referer` to Google Maps, fonts, or any third party. Keep both metas and never re-add `referrerpolicy` to the map iframe.
- **Palette**: `#pal button[data-p]` writes `data-palette` on `<html>` (+ `localStorage["paleta"]`); CSS re-declares the nine `--*` tokens per palette. `champan` = attribute removed. The picker is dev-only: it is hidden unless the URL contains `?palette=1`.
- **Guest name**: the guest name is authoritative from the backend (`d.nombre`); the form does not ask for it.
- **Attendance value**: parsed by prefix (`/^s[íi]/i` / `/^no/i`), so `Asistencia` may be the raw radio text (`"Sí, ahí estaré"`, `"No podré asistir"`) or the normalized `"Sí"`/`"No"`; anything else means "not answered".

Key modules (all inside `js/main.js`, each an IIFE after the config block): palette switcher, mobile menu, countdown, gallery renderer + `arte()` SVG fallback, lightbox, itinerary renderer, audio player (manual play only — no autoplay), personalized invitation, RSVP submit.

## Key Directories

| Path | Purpose |
|---|---|
| `index.html` | Only page. Sections `#inicio #viaje #itinerario #musica #rsvp #mapa`, plus lightbox `#lb` and palette widget `.pal` |
| `js/` | `main.js` — config block at lines 1–27, then behavior |
| `css/` | `styles.css` (tokens + all layout), `flores.css` (floral corner + garland decorations, removable by deleting its `<link>`) |
| `img/` | Decorative SVG corners/garlands (`esquina.svg`, `guirnalda.svg`), map-app icons (`google-maps.svg`, `waze.svg`), `favicon.svg`, and the 1200×630 social card `og-portada.jpg`. `esquina_.svg` and `guirnalda_.svg` are **unreferenced** alt renders |
| `fotos/` | `FT1.jpg`…`FT7.jpg` originals (source only) + shipped WebP derivatives `FTn-480.webp` / `FTn-960.webp` referenced from `FOTOS` |
| `musica/` | Two MP3s referenced from `CANCIONES` in `main.js` |

## Development Commands

No build, no install, no test runner. Serve the directory (needed only for consistent `fetch`/CORS-free local behavior):

```bash
python -m http.server 8000        # then open http://localhost:8000/
# or
npx serve .
```

Verify the RSVP path by appending a guest code: `http://localhost:8000/?i=YOURCODE`.

**Cache busting is manual:** asset URLs carry `?v=3` (`index.html:21-22,138`). Bump the number when shipping changes to CSS/JS, or browsers will serve stale files.

**Photo pipeline** (originals stay in `fotos/`, only WebP ships):

```bash
for i in 1 2 3 4 5 6 7; do for w in 480 960; do
  ffmpeg -y -i "fotos/FT$i.jpg" -vf "scale=$w:-2:flags=lanczos" \
    -c:v libwebp -quality 76 -compression_level 6 -preset picture "fotos/FT$i-$w.webp"
done; done
```

`srcset` is derived from the `-960.webp` suffix (`js/main.js:88-91`), so keep both widths for every photo, and choose `sizes` by span: `tall`/normal tiles vs the `wide` tile.

**Social card:** `img/og-portada.jpg` is a rendered 1200×630 card, not a photo. `og:image` must be an absolute URL (`https://worellana.github.io/boda/…`); update it if the host changes.

Deployment: commit to `main` and push (`origin = https://github.com/worellana/boda.git`). No host config in-repo; any static host works.

## Code Conventions & Common Patterns

**Formatting**
- Hand-formatted, compact CSS: multiple declarations per line, no whitespace after commas in `:root` token lists. Follow surrounding density instead of reformatting.
- JavaScript is deliberately **ES5**: `var`, `function`, IIFEs, `.then()` chains. No `let/const`, arrow functions, `class`, template literals, `import/export`, or optional chaining. Match this style; do not introduce modules or transpilation.

**Naming**
- Not BEM. Flat, lowercase, single-class selectors (`hero`, `wrap`, `lead`, `player`, `note`, `msg`) mixed with Spanish domain names (`reservado`, `para`, `pal`, `cambiar`, `mecer-a`).
- Very short element ids are load-bearing: `$("d")`, `$("h")`, `$("m")`, `$("s")`, `$("lb")`, `$("lbx")`, `$("lbi")`, `$("tl")`, `$("tt")`, `$("ta")`, `$("cur")`, `$("dur")`. Renaming any id requires a JS edit (and CSS where used).
- `$` is a local alias for `document.getElementById`; it is not jQuery.
- CSS custom properties are the single theme contract: `--bg --bg2 --ink --muted --accent --hero --hero-ink --btn-ink --line`. Never hardcode a color in a component; add/adjust a token or a `:root[data-palette="…"]` block instead.
- State classes are unprefixed and additive: `.on` (lightbox open, disc spinning), `.open` (mobile menu), `.main` (primary player button), `.tall`/`.wide` (gallery spans).

**Patterns**
- DOM wiring uses `onclick`/`ontimeupdate`/`onsubmit` property assignment inside IIFEs, not `addEventListener`, for single-handler elements; `addEventListener` is used where multiple listeners or capture/passive options are needed.
- UI state lives in the DOM (`hidden` attribute, `.on`/`.open` classes, `aria-expanded`, `aria-pressed`); the only persistence is `localStorage["paleta"]` wrapped in `try/catch`.
- Accessibility is part of the contract: `aria-expanded`/`aria-label` are toggled together with the menu, the lightbox traps Tab across `#lbx/#lbp/#lbn`, restores focus to the opener, and locks `body.style.overflow`.
- Motion respects `@media(prefers-reduced-motion:reduce)` in both stylesheets — every new animation needs a rule there.
- Decorative CSS lives only in `flores.css` and is layered on with pseudo-elements + `pointer-events:none`, so removing that file must leave a functional site.

**Paths**
- All local URLs are document-relative (no leading `/`, no `<base>`). JS asset paths (`fotos/…`, `musica/…`) resolve against `index.html`, **not** `js/`; CSS `url()` in `flores.css` is stylesheet-relative and uses `../img/…`. Moving `index.html` into a subfolder breaks every photo and song.
- Filenames are unaccented; one MP3 contains spaces (`musica/Mi Vida Sin Ti.mp3`) and is quoted raw in JS. Prefer `_` for new files (`Ojala_que_si.mp3`).
- Decorations are referenced only from `css/flores.css`; map icons only from `index.html`. Renaming an SVG means editing that one file, not both.

**Error handling**
- Invitation load failures are visible in `#para` ("No pudimos cargar tu invitación…"); an unknown code shows a distinct message. RSVP submit retries the confirmation read 3 times before reporting failure in `#msg`.
- Backend fields (`d.ok`, `d.nombre`, `d.asientos`, `d.personas`, `d.nota`) are trusted without validation.
- Do not add frameworks, polyfills, or abstractions; this is a hand-edited single page.

## Important Files

| File | Why it matters |
|---|---|
| `js/main.js:1-26` | **`/* ====== EDITA AQUÍ ====== */` config block** — `FECHA` (ISO with `-06:00` offset), `FOTOS` (`src/alt/cap/c/tall|wide/pos`), `ITINERARIO` (`[time, title, text]`), `CANCIONES` (`t/a/src`), `SHEETS_URL` |
| `js/main.js:199-234` | RSVP: token parsing, fetch, `estadoRsvp()`, `mostrarInvitacion()`, `confirmarEstado()`, submit |
| `js/main.js:134-154` | Audio player (`preload="none"`, manual play, no autoplay) |
| `index.html:7-22,138` | Meta/OG/favicon, stylesheet and script links with manual `?v=` cache busting |
| `css/styles.css:1-6` | Palette token definitions (default Champán) |
| `css/flores.css:3-8` | Documents that decorations are optional and load order is intentional |

**Editing recipes**
- Event date appears in three places: `FECHA`, the hero `.date`, and the footer/title copy. Update all.
- Venue copy is inconsistent: the map iframe title says "Finca Lutecia" while the address and lead say "La Estancia" (same coordinates). Fix the copy, not the coordinates, unless the venue actually changed.
- Adding a photo: export `fotos/<nombre>-960.webp` and `-480.webp` with the pipeline above, then add an entry to `FOTOS` (empty `src` falls back to generated SVG art via `arte()`; `pos` sets `object-position`; `c` is `tall`/`wide`/empty).
- Adding a song: add the file under `musica/` (quote paths containing spaces) and an entry to `CANCIONES`.
- Removing the palette picker: delete the `.pal` block in `index.html`, its IIFE in `main.js`, and the `.pal` CSS block. It is already hidden for guests; `?palette=1` reveals it for design review.
- Assets are referenced from three places: `FOTOS`/`CANCIONES` in JS, `url("../img/…")` in `flores.css`, and `<img src="img/…">`/iframe in HTML.

## Runtime/Tooling Preferences

- **Runtime: browser only.** No Node, no package manager, no dependency install, no transpile step. Opening `index.html` directly works; a static server is preferred.
- Target is modern mobile browsers: `clamp()`, `aspect-ratio`, `:has()`, `100dvh`, `env(safe-area-inset-*)`, and CSS custom properties are already used.
- External services at runtime: Google Fonts (`Great Vibes`, `Cormorant Garamond`), Google Maps embed + deep link, Waze deep link, Google Apps Script (`SHEETS_URL`) for RSVP. No analytics, no icon libraries.
- Keep `js/main.js` ES5-safe even though the CSS assumes modern browsers; older JS is a deliberate simplicity choice, not a build constraint.
- No linter/formatter config exists — match existing style manually. Do not add tooling without being asked.

## Testing & QA

There is **no automated test suite, linter, or CI**. Verify by exercising the real page in a browser; check the console for errors.

Minimum manual pass after any change:

1. Page loads; Google Fonts apply; decorations in `flores.css` render (corners on hero/sections, garlands around countdown and footer).
2. Countdown ticks and pads to two digits; nav links scroll with the correct sticky offset.
3. Palette picker is **hidden** on a normal visit; `?palette=1` shows it, each swatch re-themes the page and survives a reload (`localStorage`), including `noche`.
4. Gallery: 7 photos + 1 SVG fallback tile render; DevTools shows `-480.webp`/`-960.webp` selected via `srcset`; open lightbox, arrow keys, swipe, Esc, click-outside, and focus return all work.
5. Player: no MP3 request on load; play/pause, prev/next, seek, ended → next track work after clicking `#play`.
6. Mobile ≤720px: burger menu opens/closes (Escape and link click) with correct `aria-expanded`; ≤640px: 2-column gallery and bottom-positioned lightbox arrows.
7. RSVP with `?i=<valid>`: seat cap applied, form posts, confirmation card renders, "Cambiar mi respuesta" restores values. Invalid code shows the "código no válido" message; no token leaves `#rsvp` and its nav link hidden; an unreachable backend shows the connection message.
8. Map iframe and Waze/Google Maps links open the correct coordinates.
9. Social preview: `og:image` resolves to `img/og-portada.jpg` (1200×630) and the favicon loads.
10. Initial page weight stays under ~700 KB (Google Fonts included); only the 7 visible derivatives load, never the `fotos/*.jpg` originals.
