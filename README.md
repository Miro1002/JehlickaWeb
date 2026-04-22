# JehlickaWeb

A simple Node.js Express web application that zobrazuje najbližšiu nemocnicu v okolí pomocou OpenStreetMap.

## Funkcie

- Zobrazenie webového rozhrania na `/`
- Automatické získanie polohy používateľa cez prehliadač
- Vyhľadanie najbližšej nemocnice pomocou OpenStreetMap Overpass API
- Zobrazenie názvu, adresy a vzdialenosti
- Odkaz na otvorenie polohy v OpenStreetMap

## Požiadavky

- Node.js (v14 alebo novší)
- npm

## Inštalácia

1. Klonujte repozitár:
```bash
git clone <repository-url>
cd JehlickaWeb
```

2. Nainštalujte závislosti:
```bash
npm install
```

## Spustenie

Spustite aplikáciu:
```bash
npm start
```

Aplikácia bude dostupná na `http://localhost:3000` (alebo na porte nastavenom v premennej `PORT`).

## Cesty

- **GET `/`** - Webové rozhranie, ktoré nájde najbližšiu nemocnicu
- **GET `/health`** - Health check endpoint
- **GET `/api/nearest-hospital?lat=<lat>&lon=<lon>`** - API endpoint na vyhľadanie najbližšej nemocnice

## Konfigurácia

- `PORT` - port, na ktorom bude aplikácia bežať (predvolené: `3000`)
- `MAX_RADIUS_METERS` - maximálny polomer vyhľadávania nemocníc v metroch (predvolené: `5000`)

## Licencia

MIT
