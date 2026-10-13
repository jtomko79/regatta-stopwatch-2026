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

## Nasadenie na Vercel

`vercel.json` nasadzuje priečinok `public/` ako statický web bez build kroku a priečinok `api/` ako
serverless funkcie (živé zdieľanie).

### Živé zdieľanie (`/api/live/*`)

Backend pre živý odpočet a prevzatie časomerania vedúcou posádkou beží vo Vercel funkciách
(`api/live/*.js` → `lib/live-server/*.mjs` → `lib/live-state.mjs`) a ukladá stav do Redisu cez REST.

Nastavenie (raz, vo Verceli): **Storage → Create Database → Upstash Redis** (alebo Marketplace → Upstash)
a pripojiť k projektu. Vercel doplní premenné `KV_REST_API_URL` / `KV_REST_API_TOKEN`
(podporované sú aj `UPSTASH_REDIS_REST_URL` / `UPSTASH_REDIS_REST_TOKEN`). Po redeployi je živé
zdieľanie funkčné; bez databázy aplikácia pri otvorení „Živý odpočet / posádky“ zobrazí, že chýba.

Miestnosti (rooms) sa mažú 30 dní po poslednej zmene. Organizátorský kľúč zostáva len v prehliadači
organizátora; posádky nepotrebujú žiadne prihlásenie.

Test backendu bez Vercelu: `node checks/live-vercel-verify.mjs` (beží proti in-memory náhrade Redisu).
