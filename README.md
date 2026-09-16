# GreenQueue

A scroll-driven, hyperrealistic 3D web experience for GreenQueue — an AI
compute scheduler that runs flexible workloads when the electricity grid
is cleanest. Built with React, TypeScript, Vite, Three.js, and React
Three Fiber.

## What's in the scene

A photorealistic floating island (real PBR terrain, grass-to-rock vertex
coloring, no flat CSS/SVG shapes standing in for 3D) suspended in a
physically-based sky with real volumetric clouds, orbited by smaller
debris rocks representing individual workloads. The camera idles in a
slow continuous orbit and responds to scroll. An edge-only bracket-style
HUD stages job/grid telemetry at the right moments; a full operational
dashboard (grid trend chart, job queue, scheduler visualization, impact
metrics) lives below the cinematic scroll region, reading the exact same
data snapshot as everything above it.

## Local development

```bash
npm install
npm run dev
```

Runs entirely on typed mock data (`src/data/mockData.ts`) with zero
backend required — see `src/api/greenqueue.ts` for the demo-mode
fallback logic.

## Production build

```bash
npm run build
```

Type-checks with `tsc -b`, then builds to `dist/`. The Recharts-based
trend chart and the whole dashboard section are code-split into
separate lazy-loaded chunks, so the initial 3D experience isn't paying
for code it doesn't need yet.

## Connecting a real backend later

Set `VITE_API_BASE_URL` (see `.env.example`) to your backend's base URL.
`src/api/greenqueue.ts` will call `${VITE_API_BASE_URL}/snapshot` and
expects a JSON body matching the `GreenQueueSnapshot` type in
`src/types/greenqueue.ts`. If the variable is unset, or the backend is
unreachable, the app silently stays in demo mode — no broken screens.

---

## Deploying to Firebase Hosting — step by step

### 1. Install the Firebase CLI (one-time, if you don't have it)

```bash
npm install -g firebase-tools
```

### 2. Log in

```bash
firebase login
```

This opens a browser window to authenticate with your Google account.

### 3. Create a Firebase project (if you don't already have one)

Either via the [Firebase Console](https://console.firebase.google.com/)
(Add project → follow the prompts), or from the CLI:

```bash
firebase projects:create your-greenqueue-project-id
```

### 4. Point this project at your Firebase project

Open `.firebaserc` in this repo and replace `YOUR_FIREBASE_PROJECT_ID`
with your actual project ID:

```json
{
  "projects": {
    "default": "your-greenqueue-project-id"
  }
}
```

Or run this instead, which does the same thing interactively:

```bash
firebase use --add
```

### 5. Build the production bundle

```bash
npm run build
```

This is required before every deploy — Firebase Hosting serves the
static files in `dist/`, not your source code.

### 6. Deploy

```bash
firebase deploy --only hosting
```

When it finishes, the CLI prints your live URL — typically
`https://your-greenqueue-project-id.web.app`.

### 7. (Optional) Set up a custom domain

In the Firebase Console → Hosting → "Add custom domain," then follow
the DNS verification steps it gives you (usually adding a TXT record,
then an A/CNAME record once verified).

### Redeploying after changes

Every time you make changes:

```bash
npm run build
firebase deploy --only hosting
```

### Notes on `firebase.json`

Already configured in this repo:
- `"public": "dist"` — serves the Vite build output
- A catch-all rewrite (`**` → `/index.html`) — required for a single-page
  app so any URL (not just `/`) loads correctly on refresh
- Long-lived cache headers on hashed JS/CSS/font assets (Vite fingerprints
  these filenames on every build, so aggressive caching is safe)

If you ever add a real backend and want it served from the same Firebase
project, that's a separate step (Cloud Functions or Cloud Run + Hosting
rewrites) — not covered here since this app currently talks to an
external `VITE_API_BASE_URL`, not a Firebase-hosted API.

### GreenQueue Backend GitHub Repository
https://github.com/kashvi1708/greenqueue-backend

