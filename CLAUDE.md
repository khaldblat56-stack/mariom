# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

A bilingual (Arabic/English) marketing site for a digital marketing consultant (Mariam Wajeh, mariamw.com). Next.js 16 App Router, React 19, Tailwind CSS v4, TypeScript (`strict: false`). Arabic is the default locale and RTL.

## Commands

- `npm run dev` — dev server on `0.0.0.0:3000`
- `npm run build` / `npm run start` — production build / serve
- `npm run lint` — **this is only `tsc --noEmit`**; there is no ESLint or Prettier config
- `npm run analyze` — build with `@next/bundle-analyzer`
- `npm run clean` — remove `.next`

There is no test suite.

## Architecture

### Routing and locales
- `src/app/page.tsx` redirects `/` → `/ar`. Real routes live under `src/app/[locale]/`: home (`page.tsx`), `about/`, `results/`, `articles/[slug]/`. All are statically generated for `ar` and `en`; unknown locales/slugs `notFound()`.
- `src/app/[locale]/layout.tsx` owns home-page SEO (inline `seo` object: title, keywords, hreflang, OpenGraph/Twitter) and the site-wide JSON-LD graph (Person, ProfessionalService, WebSite). It loads the local ExpoArabic font for `ar` only and wraps every page in `SiteShell`.
- Inner pages build metadata with `buildPageMetadata()` and JSON-LD with `JsonLd`/`buildBreadcrumbSchema()` from `src/lib/seo.ts`, reading copy server-side via `getBundledTranslation(locale)`. `src/app/sitemap.ts` and `robots.ts` generate `/sitemap.xml` and `/robots.txt`; add new routes to the sitemap's `PAGES`.
- The root `src/app/layout.tsx` hardcodes `<html lang="ar" dir="rtl">` and injects the Snapchat pixel; the client corrects `lang`/`dir` via `syncDocumentLocale`, and `SiteShell` sets `dir`/`lang` on the `.site` wrapper (CSS relies on `.site[dir="ltr"]`).

### i18n (custom, not next-intl)
- Translations live in `public/ar.json` and `public/en.json`, **bundled via static import** in `src/lib/i18n/config.ts`. Both files must keep the same key structure.
- `I18nProvider` creates one synchronous i18next instance per locale layout, so pages are fully translated in the server HTML (important for SEO — don't reintroduce a "ready" gate). `useI18nControls()` exposes `locale`, `isTranslating`, `toggleLocale`; toggling keeps the current path (`getLocalizedPath`) and hash.
- Lists are read with `t(key, { returnObjects: true }) as unknown as T[]`. Language-neutral data (numbers, image paths, bar widths, slugs, icons) lives in `src/lib/site-content.ts`, matched **by index** to the translation arrays (e.g. `HERO_RESULT_CARDS[i]` ↔ `hero.cards[i]`, `ARTICLES[i]` ↔ `articles.items[i]`). Reordering one side without the other breaks content.
- `src/contexts/LanguageContext.tsx` is legacy and unused — use `useI18nControls` instead.

### Page composition
- `SiteShell` renders on every page: `Navbar` → page content → `ContactSection` (`#contact`) → `SiteFooter` → `BookingForm` modal → floating `WhatsAppButton`.
- Home sections are imported statically (not `next/dynamic`) so `/ar#faq`-style links can find their targets on arrival.
- Use `SiteLink` for internal links: `"/about"` is locale-prefixed; `"#section"` smooth-scrolls if that id exists on the current page (e.g. `#contact` on every page), otherwise navigates to the home page section. Nav items live in `NAV_ITEMS`; the navbar highlights the home section crossing mid-viewport.

### Cross-component patterns
- **Booking modal**: `BookingForm` listens for a `window` event (`booking-form:open`); open it with `openBookingForm()` from `src/lib/booking.ts`. Don't lift this into React state/context.
- **Smooth scroll**: `SmoothScrollProvider` lazy-loads Lenis + GSAP ScrollTrigger on desktop only (`innerWidth >= 768`); mobile uses native scrolling. Use `useSmoothScroll().scrollTo` / `setScrollLocked` rather than `window.scrollTo` or toggling body overflow directly. `Lightbox` (native `<dialog>`) locks scroll this way.

### Contact API
`src/app/api/contact/route.ts` (Node runtime) validates the booking form and sends email via a **hand-rolled SMTP client** over `node:net`/`node:tls` (EHLO → STARTTLS → AUTH LOGIN) — no nodemailer. If SMTP env vars are missing it still returns `ok: true` with `email.configured: false`. Every response carries a `debugId` that matches server log lines; non-production error responses include extra `debug` info.

Env vars (see `.env.example`): `SMTP_HOST`, `SMTP_PORT` (falls back to the misspelled `MTP_PORT` used in `.env.example`, then 587), `SMTP_USER`, `SMTP_PASSWORD`, `RECIPIENT_EMAIL` (or `CONTACT_TO_EMAIL`), `CONTACT_FROM_EMAIL`. `GEMINI_API_KEY`/`APP_URL` are leftovers from the AI Studio scaffold and unused by the code.

### Styling
- The site design lives in `src/site.css` (plain CSS classes such as `.nav`, `.rc`, `.cta-sec`, tokens `--teal`, `--yellow`, `--ink`… on `:root`), imported from `src/index.css` and wrapped in `@layer components` so Tailwind utilities still win (the booking modal is styled with Tailwind utilities).
- Write direction-safe CSS: logical properties (`inset-inline-*`, `border-inline-*`, `text-align: start`); numbers are forced LTR and aligned per `.site[dir]`.
- Fonts come from the locale layout (ExpoArabic for `ar`, 400/700 only); don't set `font-family` in component CSS. Tailwind theme tokens (`brand-*`) are in `src/index.css` `@theme`; there is no `tailwind.config`.

### Assets
All site images are WebP under `public/images/` (`results/`, `brands/`, `logo.webp`, `og-cover.webp` 1200×630 for social cards). Keep new images WebP. `public/icon.svg` is only the favicon. Old unused assets remain in `public/hero.webp` and `public/icon's/`.
