# Development Guide

This guide covers local setup, validation, release checks, and recommended future tests for ImmunoLab Pro.

## Local Setup

```bash
npm ci
npm run dev
```

Use `npm ci` when starting from a clean checkout because the project includes `package-lock.json`.

## Scripts

```bash
npm run dev
npm run lint
npm run test
npm run build
npm run preview
```

## Tests

ImmunoLab Pro uses Vitest for core logic tests. The current suite covers:

- blood typing reactions across all eight ABO/Rh blood types with Anti-A, Anti-B, and Anti-D reagents
- the full 8x8 simplified ABO/Rh recipient/donor compatibility matrix
- crossmatch invariants, including O- donation, AB+ receiving, incompatible antigen conflicts, debrief detail payloads, and O- stewardship scoring

Recommended next targets:

- `TraumaEngine.calculateScore` scoring behavior
- React-level smoke coverage for debrief progression, paused timer behavior, and next-case score commitment

## Validation Checklist

Run these before committing release-bound changes:

```bash
npm run lint
npm run test
npm run build
```

For PWA changes, also run:

```bash
npm run preview
```

Then verify:

- the app loads from the preview server
- `manifest.webmanifest` references assets that exist
- service worker registration succeeds
- sandbox mode can run all three reagent reactions
- trauma mode can complete diagnosis, crossmatch, transfusion, and next-patient progression
- the debrief card appears after a submitted match and the timer does not continue counting down while it is open

## Code Quality Expectations

- Keep blood typing and compatibility rules in `src/logic`.
- Keep browser effects, timers, and React state in hooks or components.
- Avoid moving domain rules into JSX.
- Render compatibility explanations from `CrossmatchEngine.analyze` details instead of recalculating biology in React components.
- Prefer small pure functions for logic that can be unit tested.
- Keep comments focused on intent, constraints, or non-obvious browser behavior.
- Do not commit generated `dist`, local `node_modules`, `.DS_Store`, or environment files.

## Recommended Test Plan

Additional useful unit tests:

1. `TraumaEngine.calculateScore`
   - time decay
   - streak multiplier
   - minimum score floor

2. `useInventory`
   - generated inventory always contains at least one safe donor option
   - consuming an empty bag returns false
   - consuming an available bag decrements inventory once

Recommended browser smoke tests:

- menu renders
- sandbox sample selection enables reagent buttons
- trauma diagnosis advances to crossmatch only when correct
- incompatible donor can be discarded
- compatible donor can be submitted
- debrief card shows antibodies, antigens, conflict status, and next-case action
- game over appears after lives are exhausted

## PWA Notes

The app uses `vite-plugin-pwa` with auto-update registration. PWA assets live in `public`.

When changing PWA metadata:

- keep `index.html` icon links aligned with `public`
- keep `vite.config.ts` manifest icons aligned with `public`
- rebuild and inspect `dist/manifest.webmanifest`
- test offline behavior from a production preview, not from the dev server

## Release Procedure

1. Install clean dependencies with `npm ci`.
2. Run `npm run lint`.
3. Run `npm run build`.
4. Preview with `npm run preview`.
5. Smoke-test sandbox and Trauma Challenge flows.
6. Commit only source, config, docs, and lockfile changes.
7. Push to GitHub.

## Safety Language

Any public distribution should include the shared educational-only disclaimer from the README and `SafetyNotice` component. The app should not be marketed or presented as clinical decision support, laboratory decision support, emergency guidance, or patient-care tooling.
