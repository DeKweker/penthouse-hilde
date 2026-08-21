# Ático Hilsol — DeeQ Studio production source

Next.js 16.3 static production build for the private penthouse in Velapi Golf, Los Alcázares.

## Architecture

- Next.js App Router + TypeScript
- Fully static export (`output: 'export'`)
- No database, serverless API, cron, checkout, Supabase or transactional e-mail dependency
- No tracking or non-essential cookies
- Booking inquiry is assembled locally in the visitor's browser and opened in WhatsApp or the visitor's own mail app
- Local, optimized WebP property photography
- Responsive gallery + keyboard-accessible lightbox
- Static SEO metadata, VacationRental structured data, sitemap and robots
- Privacy and practical conditions pages

This makes the current version cheap and robust to host. A future Booking.com/Airbnb link, channel manager or real booking engine can be added later without rebuilding the visual site.

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

The static production output is generated in `out/`.

## Vercel

The repository can replace the existing Appartement Hilde repository. Vercel should detect Next.js automatically.

Optional environment variable:

```text
NEXT_PUBLIC_SITE_URL=https://appartement-hilde.vercel.app
```

Set this to the final custom domain once one is connected, then redeploy so canonical, Open Graph, sitemap and structured data use that domain.

## Contact / booking

Contact values live in `lib/site.ts`:

- e-mail
- WhatsApp number
- minimum stay
- maximum guests
- cleaning fee
- security deposit
- season prices

No secrets are stored in the repository.

## Photography

The gallery currently contains 17 distinct, authentic property images from the supplied production source. They are re-exported without EXIF metadata and optimized for the web. The Google Photos shared album can be used to add further images later; drop new originals into the image workflow and add their entries to `gallery` in `lib/site.ts`.
