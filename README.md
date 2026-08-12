# DBACK Fitness x MuscleWiki

Cloudflare Worker workout interface that keeps the MuscleWiki credential server-side and proxies authenticated MuscleWiki images/videos to the DBACK Fitness UI.

## Required secret

Configure `MUSCLEWIKI_API_KEY` as a Cloudflare Worker secret. Do not commit the key to GitHub.

```sh
npx wrangler secret put MUSCLEWIKI_API_KEY
```

Then deploy:

```sh
npm install
npm run deploy
```

## Routes

- `/` workout UI
- `/health` confirms whether the secret is configured without revealing it
- `/api/day?day=Monday` loads MuscleWiki exercise records
- `/mw/media?url=...` streams authenticated MuscleWiki media to the browser

The media proxy only accepts `https://api.musclewiki.com` URLs and forwards byte-range requests for MP4 playback.
