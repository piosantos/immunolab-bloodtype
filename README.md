# ImmunoLab Pro

ImmunoLab Pro is an offline-first, browser-based hematology simulation for learning ABO/Rh blood typing and basic transfusion compatibility. It presents the learner with a virtual lab bench, reagent wells, timed reactions, a trauma-mode scoring loop, donor inventory, and crossmatch decisions.

This project is an educational simulator. It is not a clinical device, diagnostic tool, transfusion decision system, or substitute for institutional protocols or licensed medical supervision.

## What It Does

- Simulates Anti-A, Anti-B, and Anti-D blood typing reactions.
- Provides a sandbox mode for practicing any supported blood type.
- Provides a trauma mode with timed patient diagnosis, donor inventory, compatibility testing, scoring, lives, and audio feedback.
- Runs entirely in the browser with no backend, account system, analytics, or external API calls.
- Ships as a Vite-powered Progressive Web App configured for offline caching.

## Supported Blood Types

The simulator models the eight standard ABO/Rh combinations:

| Type | Antigens |
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

Sandbox Mode is the training workspace. Select a patient sample, add Anti-A, Anti-B, and Anti-D reagents, then interpret whether each well clumps or remains liquid.

### Trauma Mode

Trauma Mode turns the same lab workflow into a game loop:

1. Identify the patient's blood type.
2. Select a donor unit from the generated inventory.
3. Run a compatibility crossmatch.
4. Transfuse only if the match is safe.
5. Earn score from speed, streaks, and donor stewardship.

## Project Structure

```text
.
├── public/                 PWA icons
├── src/
│   ├── components/         React UI components
│   ├── hooks/              Simulation, timer, inventory, PWA, and audio hooks
│   ├── logic/              Pure domain logic for blood typing, compatibility, scoring, audio
│   ├── App.tsx             Top-level mode selection
│   ├── main.tsx            React entry point
│   └── index.css           Tailwind and global styles
├── docs/
│   ├── ARCHITECTURE.md     System design and data flow
│   └── DEVELOPMENT.md      Setup, scripts, validation, release notes
├── HELP.md                 In-app style field manual
├── vite.config.ts          Vite, React, Tailwind, and PWA config
└── package.json            Scripts and dependencies
```

## Tech Stack

- React 19
- TypeScript 5
- Vite 7
- Tailwind CSS 4
- Framer Motion
- Lucide React
- vite-plugin-pwa

## Requirements

- Node.js compatible with Vite 7
- npm

The repository includes `package-lock.json`; use `npm ci` for reproducible installs in CI or clean environments.

## Getting Started

```bash
npm ci
npm run dev
```

Vite prints the local development URL, typically `http://localhost:5173`.

## Available Scripts

```bash
npm run dev      # start the local Vite dev server
npm run build    # type-check and create a production build
npm run lint     # run ESLint
npm run preview  # preview the production build locally
```

## Validation Status

Before the initial GitHub commit, the following checks were run locally:

```bash
npm run lint
npm run build
```

Both are expected to pass before release work continues.

## Architecture Notes

The application keeps the medically relevant rules in small domain modules under `src/logic`, while React components and hooks handle rendering, state transitions, timers, inventory, and animation. See [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) for the full system map.

## Development Notes

See [docs/DEVELOPMENT.md](docs/DEVELOPMENT.md) for setup, code quality expectations, release checks, PWA notes, and recommended tests.

## Privacy

ImmunoLab Pro currently stores no user data, sends no API requests, and does not include analytics. All simulation state is in memory and resets when the page reloads.

## Safety Disclaimer

This software is for education and demonstration only. It intentionally simplifies real-world hematology and transfusion practice. Do not use it to make clinical, laboratory, emergency, or patient-care decisions.
