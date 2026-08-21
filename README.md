# Ático Hilsol — DeeQ Studio production source

Next.js 16.3 static production build for the private penthouse in Velapi Golf, Los Alcázares.

## Production architecture

- Next.js App Router + TypeScript
- Fully static export (`output: 'export'`)
- Vercel Hobby friendly: no database, serverless API, cron, checkout, Supabase or transactional e-mail dependency
- Booking inquiry assembled locally and opened in WhatsApp or the visitor's own mail app
- Authentic local WebP property photography
- Editorial responsive gallery + keyboard-accessible lightbox
- CSS view-timeline motion where supported, with reduced-motion fallback
- Interactive 3D photo composition built exclusively from real property images
- Static SEO metadata, VacationRental structured data, `public/sitemap.xml` and `public/robots.txt`
- Privacy and practical conditions pages

## Visual direction

The palette is derived from the property itself: warm limestone/cream, deep landscape green and a mustard-ochre accent sampled from the dining chairs. Green is reserved mainly for landscape/night sections; ochre carries the warmer interior chapters and inquiry section.

The layout intentionally avoids repeating the same label/value-list component. Chapters alternate between full-bleed photography, editorial copy, spatial 3D composition, horizontal room storytelling, asymmetrical gallery layouts and landscape overlays.

## Local development

```bash
npm install
npm run dev
```

Production check:

```bash
npm run typecheck
npm run build
```

The static output is generated in `out/`.

## Vercel

This source can replace the content of the existing Appartement Hilde repository while keeping its `.git` folder and existing Vercel connection.

Optional environment variable:

```text
NEXT_PUBLIC_SITE_URL=https://appartement-hilde.vercel.app
```

Change the canonical domain in `public/robots.txt` and `public/sitemap.xml` when a final custom domain is connected.

## Contact and rates

Contact details, occupancy, fees and season prices live in `lib/site.ts`.

No secrets are stored in the repository.
