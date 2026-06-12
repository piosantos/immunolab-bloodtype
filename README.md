# ImmunoLab Pro

ImmunoLab Pro is an offline-first, browser-based educational simulation for learning simplified ABO/Rh blood typing and basic transfusion compatibility. It gives learners a virtual lab bench with reagent wells, timed reactions, a trauma challenge, donor inventory, crossmatch decisions, debrief summaries, scoring, and audio feedback.

This project is not a clinical device, diagnostic tool, transfusion decision system, or substitute for institutional protocols or licensed medical supervision. The biology model is a deterministic strict-state simulation of simplified ABO/Rh rules for education and demonstration only.

## Features

- Anti-A, Anti-B, and Anti-D reagent testing for the eight standard ABO/Rh combinations.
- Sandbox Mode for selecting a sample and practicing blood typing without pressure.
- Trauma Challenge for timed ABO/Rh diagnosis, donor inventory management, crossmatch testing, educational debriefs, and transfusion scoring.
- Shared in-app safety notice reinforcing that the app is educational only and not for clinical, lab, emergency, or patient-care decisions.
- Deterministic domain logic in `src/logic` with Vitest coverage for blood typing and all 64 simplified ABO/Rh compatibility combinations.
- External learning bridge to Flipbook Goldar AI for hematology theory review.
- Offline-capable Vite PWA with generated service worker support.
- Cloudflare Pages configuration through `wrangler.toml`.

## Supported Blood Types

| Type | Simulated Antigens |
| --- | --- |
| A+ | A, Rh |
| A- | A |
| B+ | B, Rh |
| B- | B |
| AB+ | A, B, Rh |
| AB- | A, B |
| O+ | Rh |
| O- | None |

## Main Flows

### Sandbox Mode

Select a patient sample, add Anti-A, Anti-B, and Anti-D reagents, then interpret whether each well clumps or remains liquid.

### Trauma Challenge

1. Identify the patient's blood type.
2. Select a donor unit from the generated inventory.
3. Run a compatibility crossmatch.
4. Submit only safe matches.
5. Review the debrief card explaining recipient antibodies, donor antigens, and any conflict antigen.
6. Earn score from speed, streaks, and donor stewardship.

## Tech Stack

- React 19
- TypeScript 5
- Vite 7
- Tailwind CSS 4
- Framer Motion
- Lucide React
- Vitest
- vite-plugin-pwa

## Project Structure

```text
.
├── public/                 PWA icons, Cloudflare headers, SPA redirects
├── src/
│   ├── components/         React UI components, including shared safety notice
│   ├── hooks/              Simulation, timer, inventory, PWA, and audio hooks
│   ├── logic/              Deterministic simulation and scoring logic
│   ├── App.tsx             Top-level mode selection
│   ├── main.tsx            React entry point
│   └── index.css           Tailwind and global styles
├── docs/
│   ├── ARCHITECTURE.md     System design and data flow
│   └── DEVELOPMENT.md      Setup, validation, and release guidance
├── HELP.md                 Field manual for learners
├── wrangler.toml           Cloudflare Pages output configuration
├── vite.config.ts          Vite, React, Tailwind, and PWA config
└── package.json            Scripts and dependencies
```

## Requirements

- Node.js compatible with Vite 7
- npm

The repository includes `package-lock.json`; use `npm ci` for reproducible installs.

## Getting Started

```bash
npm ci
npm run dev
```

Vite prints the local development URL, typically `http://localhost:5173`.

## Scripts

```bash
npm run dev      # start the local Vite dev server
npm run lint     # run ESLint
npm run test     # run Vitest unit tests
npm run build    # type-check and build production assets
npm run preview  # preview the production build locally
```

## Testing

The current unit test suite protects the deterministic biological domain logic:

- `src/logic/BloodLogicCore.test.ts` covers all 8 blood types against Anti-A, Anti-B, and Anti-D.
- `src/logic/CompatibilityCore.test.ts` covers the full 8x8 recipient/donor compatibility matrix, O- donation, AB+ receiving, incompatible antigen conflicts, and O- stewardship scoring.

Run:

```bash
npm run test
```

## Build

```bash
npm run build
```

The production output is written to `dist`.

## Cloudflare Pages Deployment

The project includes `wrangler.toml`:

```toml
name = "immuno-lab-pro"
pages_build_output_dir = "dist"
```

Build and deploy the generated `dist` directory with Wrangler:

```bash
npm run build
npx wrangler pages deploy dist --project-name immuno-lab-pro
```

The `public/_headers` and `public/_redirects` files are included in the Vite public directory so Cloudflare Pages can apply cache headers and SPA fallback routing.

## Privacy

ImmunoLab Pro currently stores no user data, sends no API requests, and does not include analytics. All simulation state is in memory and resets when the page reloads.

## Safety Disclaimer

This software is for education and demonstration only. It intentionally simplifies real-world hematology and transfusion practice. Do not use it to make clinical, laboratory, emergency, or patient-care decisions.
