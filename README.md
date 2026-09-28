# 2004.exe

A fictional early-2000s music desktop built with Next.js App Router.

## Run
npm install
npm run dev

## Listener counter
The app uses Upstash Redis automatically when `UPSTASH_REDIS_REST_URL` and `UPSTASH_REDIS_REST_TOKEN` are present. Without them it uses an in-memory development fallback.

## YouTube
Tracks with a verified videoId load the official upload previously identified. Unverified tracks intentionally show a notice instead of substituting another upload.