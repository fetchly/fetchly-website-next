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

The site integrates `@fetchly/live-sessions` via the `<SessionTracker>` component in `src/app/layout.tsx`. It requires the live-sessions server to be running (see `../live-sessions/`).

### Setup

1. Start the live-sessions server:
   ```bash
   cd ../live-sessions
   npm run build && npm start
   ```
2. Create a site in the dashboard at http://localhost:3800/admin/ (or via API):
   ```bash
   curl -X POST http://localhost:3800/api/sites \
     -H "Authorization: Bearer <your-admin-api-key>" \
     -H "Content-Type: application/json" \
     -d '{"name":"Fetchly","domain":"localhost"}'
   ```
3. Add the site ID to `.env.local`:
   ```
   NEXT_PUBLIC_TRACKER_URL=http://localhost:3800
   NEXT_PUBLIC_TRACKER_SITE_ID=<site-id-from-step-2>
   ```
4. Restart the Next.js dev server. Sessions will appear in the dashboard.

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
