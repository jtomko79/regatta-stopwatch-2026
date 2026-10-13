# Regatta Stopwatch

Slovak mobile race timer with local regatta records and server-backed live countdown.

- `/index.html`: organizer app; existing `RegattaStopwatchV2` browser data is preserved.
- `/live.html#<room-id>`: dedicated crew display, with no organizer menus.
- Live rooms use D1. The organizer's random write capability remains in the organizer browser and is excluded from exported JSON.
- Sharing access is still controlled by Sites. No PIN is required for crew takeover. One device holds the crew recorder role at a time; organizers can revoke it.
- The countdown uses a shared absolute start deadline and server-clock calibration. State refreshes every second; the display runs locally between refreshes.
- Captured finish events retain their original capture time, are queued on the recording device until acknowledged, and are idempotent by ID. The first crew finish is assigned to its chosen boat.
- All elapsed times count in time rankings; points and discards remain separate.

Validation: `node checks/live-api-verify.mjs` exercises real D1 concurrency and access control via Miniflare; existing checks under `checks/` validate timer, scoring, logos and exports. Browser QA must use the Sites-supported browser workflow.

## Nasadenie na Vercel (statická verzia)

`vercel.json` nasadzuje priečinok `public/` ako statický web bez build kroku. Funguje celá časomiera
(odpočet, posádky, dojazdy, výsledky, export). **Živé zdieľanie** (`/api/live/*`) na Verceli zatiaľ
nefunguje – pôvodný backend beží na Cloudflare Workers + D1 s prihlásením cez ChatGPT
(`app/api/live`, `lib/live-api.ts`, `lib/live-state.mjs`); na Vercel by sa musel preportovať
na serverless funkcie s vlastnou databázou.
