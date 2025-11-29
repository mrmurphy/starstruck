# Starstruck PWA

Starstruck is a mobile-first, installable React PWA for creating and managing local-first astrology birth charts with a glassmorphic UI, canvas renderer, and JSON export/import.

## Development

```bash
npm install
npm run dev
```

### Environment variables

Create a `.env` file in the project root with your Mapbox token to enable city/state lookup:

```
VITE_MAPBOX_TOKEN=pk.your-mapbox-token
```

Without this token the location autocomplete will show an error.

### Scripts

- `npm run dev` – Vite dev server with PWA plugin
- `npm run build` – Type-check + production build (generates service worker)
- `npm run preview` – Preview production bundle
- `npm run lint` – ESLint
- `npm run test` – Vitest unit tests

### PWA Notes

- Uses `vite-plugin-pwa` with `generateSW` for offline caching and install prompts.
- Includes placeholder icon set in `public/icons/`, `manifest.webmanifest`, and `public/offline.html` fallback page.
