# Fetchly Website

Marketing website for [fetch.ly](https://www.fetch.ly), built with Next.js 16, React 19, and Tailwind CSS 4. Statically exported for GitHub Pages deployment.

## Tech Stack

- **Framework:** Next.js 16 (static export)
- **Styling:** Tailwind CSS 4
- **Animations:** GSAP, Lenis (smooth scroll)
- **Fonts:** Inter (via `next/font`)

## Getting Started

```bash
npm install
cp .env.example .env.local   # then fill in the values (see below)
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Scripts

| Script | Description |
|---|---|
| `npm run dev` | Start dev server with hot reload |
| `npm run build` | Static export to `out/` |
| `npm run start` | Serve the production build locally |
| `npm run lint` | Run ESLint |

## Static Export

The site is configured with `output: "export"` for static hosting. Set `NEXT_PUBLIC_BASE_PATH` if deploying under a subpath (e.g., GitHub Pages).

```bash
NEXT_PUBLIC_BASE_PATH=/fetchly-website-next npm run build
```

## Session Tracking

The site integrates `@fetchly/live-sessions` via the `<LiveSessionsTracker>` component in `src/app/(site)/layout.tsx`. Two environment variables control it:

| Variable | Required | Description |
|---|---|---|
| `NEXT_PUBLIC_TRACKER_URL` | Yes* | Origin of the live-sessions server |
| `NEXT_PUBLIC_TRACKER_SITE_ID` | Yes* | Site ID from the live-sessions dashboard |

\* Both must be set together. If one is set without the other, or the URL is malformed, the Next.js server will refuse to start. Remove both to disable tracking entirely.

### Dev Setup

1. Start the live-sessions server:
   ```bash
   cd ../live-sessions
   cp .env.example .env        # set ADMIN_API_KEY, CORS_ORIGINS=http://localhost:3000
   npm run build && npm start
   ```
2. Create a site in the dashboard at http://localhost:3800/admin/ (or via API):
   ```bash
   curl -X POST http://localhost:3800/api/sites \
     -H "Authorization: Bearer <your-admin-api-key>" \
     -H "Content-Type: application/json" \
     -d '{"name":"Fetchly Dev","domain":"localhost"}'
   ```
3. Add the site ID to `.env.local`:
   ```
   NEXT_PUBLIC_TRACKER_URL=http://localhost:3800
   NEXT_PUBLIC_TRACKER_SITE_ID=<site-id-from-step-2>
   ```
4. Restart the Next.js dev server. Sessions will appear in the dashboard.

### Prod Setup

1. Deploy the live-sessions server (e.g. `sessions.fetch.ly`).
2. Set `CORS_ORIGINS` on the live-sessions server to the production website origin (e.g. `https://www.fetch.ly`).
3. Create a site via the live-sessions dashboard or API.
4. Set the env vars for the website deployment:
   ```
   NEXT_PUBLIC_TRACKER_URL=https://sessions.fetch.ly
   NEXT_PUBLIC_TRACKER_SITE_ID=<prod-site-id>
   ```

### CORS

The Next.js config automatically adds `Access-Control-Allow-Origin` headers for `/_next/static/*` and `/videos/*` so the live-sessions replay viewer can load fonts and video posters from the website origin. This only applies when `NEXT_PUBLIC_TRACKER_URL` is set.

## Project Structure

```
src/
  app/            # Next.js App Router pages
  components/
    layout/       # Navbar, Footer
    sections/     # Page sections (Hero, FAQ, etc.)
    ui/           # Reusable UI components
    effects/      # Visual effects (cursor, preloader, smooth scroll)
    providers/    # Context providers (theme, session tracker)
  styles/         # Global CSS
  lib/            # Utilities
```
