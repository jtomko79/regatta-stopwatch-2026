# Regatta Stopwatch

Štartovací countdown, stopky a vyhodnotenie jachtárskych pretekov (Low Point System so škrtmi).
Čistá statická web appka — žiadny build, žiadny backend. Dáta sú uložené v prehliadači daného zariadenia.

## Nasadenie na Vercel

**Varianta A — cez GitHub (odporúčané, každá zmena sa nasadí sama)**
1. Na github.com vytvor nový repozitár (napr. `regatta-stopwatch`) a nahraj doň obsah tohto priečinka
   (Add file → Upload files → vyber všetky súbory naraz).
2. Na vercel.com → **Add New… → Project** → vyber repozitár → **Import**.
3. Framework Preset: **Other**, Build Command a Output Directory nechaj prázdne → **Deploy**.
4. Dostaneš adresu typu `https://regatta-stopwatch.vercel.app`.

**Varianta B — cez príkazový riadok**
```
cd regatta-stopwatch
npx vercel          # prvé nasadenie (prihlásenie + otázky, všetko potvrď Enterom)
npx vercel --prod   # produkčná adresa
```

## Na telefóne
- Otvor adresu a pridaj si ju na plochu (iPhone Safari: Zdieľať → Pridať na plochu; Android Chrome: Inštalovať aplikáciu).
- Po prvom otvorení funguje aj offline.
- Na iPhone vypni tichý režim, inak nebude počuť hlas ani pípanie.

## Súbory
- `index.html` — celá aplikácia
- `sw.js` — offline režim (service worker)
- `manifest.webmanifest`, `*.png`, `favicon.svg` — inštalácia na plochu a ikony
- `vercel.json` — hlavičky pre Vercel

Pri úprave appky zvýš v `sw.js` číslo `CACHE = 'regatta-v1'` → `v2`, aby si telefóny stiahli novú verziu.
