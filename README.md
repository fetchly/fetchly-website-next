# Fetchly Website

Marketing website for [fetch.ly](https://www.fetch.ly), built with Next.js 16, React 19, and Tailwind CSS 4.

## Tech Stack

- **Framework:** Next.js 16 (Turbopack)
- **Styling:** Tailwind CSS 4
- **Animations:** GSAP, Lenis (smooth scroll)
- **Fonts:** Inter (via `next/font`)
- **Deployment:** Vercel

## Getting Started

### Prerequisites

The project depends on `@fetchly/live-sessions`, a private GitHub repository. You need SSH access configured to install it.

**Option A: Local development with symlink** (recommended for active development on both repos)

```bash
# Clone live-sessions next to this repo
cd ..
git clone git@github.com:fc-anjos/live-sessions.git

# Update package.json temporarily to use local version
# Change: "git+ssh://git@github.com/fc-anjos/live-sessions.git"
# To:     "file:../live-sessions"
```

**Option B: Install from GitHub** (requires SSH key with repo access)

```bash
# Ensure your SSH key is added to the GitHub repo as a deploy key
# or you have access via your GitHub account
npm install
```

### Setup

```bash
npm install
cp .env.example .env.local   # then fill in the values (see below)
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Scripts

| Script | Description |
|---|---|
| `npm run dev` | Start dev server with hot reload (uses webpack) |
| `npm run build` | Production build (uses Turbopack) |
| `npm run start` | Serve the production build locally |
| `npm run lint` | Run ESLint |

### Build Scripts

| File | Description |
|---|---|
| `scripts/vercel-install.sh` | Custom install script for Vercel (sets up SSH for private deps) |

## Vercel Deployment

### Private Dependency Setup

The `@fetchly/live-sessions` package is hosted in a private GitHub repository. Vercel needs SSH access to install it during builds.

#### 1. Deploy Key (already configured)

A deploy key is already registered on the `fc-anjos/live-sessions` GitHub repository. The private key is stored in:
- **AWS SSM:** `/${project_name}/github-deploy-key` (for EC2 deployment)
- **Terraform:** `live-sessions/terraform/production.tfvars` (gitignored)

#### 2. Vercel Environment Variable

Add the deploy key to Vercel as a base64-encoded environment variable:

| Variable | Value | Environments |
|----------|-------|--------------|
| `GIT_SSH_KEY` | Base64-encoded private key | Production, Preview, Development |

To encode the key:
```bash
cat <<'EOF' | base64
-----BEGIN OPENSSH PRIVATE KEY-----
... (key content from production.tfvars) ...
-----END OPENSSH PRIVATE KEY-----
EOF
```

#### 3. How It Works

The `vercel.json` configures a custom install command:
```json
{
  "installCommand": "bash scripts/vercel-install.sh"
}
```

The script (`scripts/vercel-install.sh`) decodes the SSH key and configures Git before running `npm install`:
```bash
echo "$GIT_SSH_KEY" | base64 -d > ~/.ssh/id_ed25519
chmod 600 ~/.ssh/id_ed25519
ssh-keyscan github.com >> ~/.ssh/known_hosts
npm install
```

### Other Environment Variables

Set these in Vercel for session tracking (optional):

| Variable | Description |
|----------|-------------|
| `NEXT_PUBLIC_TRACKER_URL` | Live-sessions server URL (e.g., `https://sessions.fetch.ly`) |
| `NEXT_PUBLIC_TRACKER_SITE_ID` | Site ID from live-sessions dashboard |

## Static Export (GitHub Pages)

For static hosting on GitHub Pages, set `NEXT_PUBLIC_BASE_PATH`:

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
