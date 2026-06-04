# Architecture

ImmunoLab Pro is a single-page React application. It is intentionally client-only: no backend, database, authentication, analytics, or network integrations were found in the source tree.

## Runtime Shape

```text
React app
  App
    MENU
    SANDBOX -> BloodTestingLab -> useBloodSim -> BloodEngine
    TRAUMA  -> GameWrapper
                TraumaHUD
                BloodTestingLab -> useBloodSim -> BloodEngine
                BloodFridge -> useInventory -> CrossmatchEngine
                CrossmatchBench -> useCrossmatchSim -> CrossmatchEngine
                useTraumaMode -> TraumaEngine
                useHeartMonitor -> SoundEngine
```

## Core Modules

### `src/logic/BloodLogicCore.ts`

Defines the canonical blood types, antigen profiles, runtime type guard, and reagent reaction logic.

The key rule is deterministic:

```text
sample antigens contain reagent target antigen -> clumping reaction
```

### `src/logic/CompatibilityCore.ts`

Defines recipient antibody profiles, donor antigen lookup, compatibility analysis, and donor stewardship scoring.

The result is a discriminated union:

- `safe: true` with `EXACT` or `COMPATIBLE`
- `safe: false` with `INCOMPATIBLE`

### `src/logic/TraumaEngine.ts`

Calculates score from elapsed time and current streak. It is pure and easy to unit test.

### `src/logic/SoundEngine.ts`

Owns Web Audio API setup and small synthesized sound effects. It is browser-only and safely returns early when no `window` or audio context constructor is available.

## React Components

### `App`

Top-level view switcher. It owns whether the user is on the menu, sandbox mode, or trauma mode.

### `BloodTestingLab`

Renders the three reagent wells, reagent buttons, sandbox sample selector, and trauma diagnosis keypad. It delegates reaction state to `useBloodSim`.

### `GameWrapper`

Coordinates trauma mode:

- patient generation
- diagnosis handling
- transition from diagnosis to crossmatch
- donor selection
- crossmatch execution
- transfusion scoring
- next-patient progression

This is the highest-coupled component in the app. If Trauma Mode grows, move more of this orchestration into a reducer or explicit state machine.

### `BloodFridge`

Displays donor inventory and lets the learner select available donor units.

### `CrossmatchBench`

Displays recipient, donor, compatibility testing, safe/unsafe result states, discard, and transfusion actions.

### `TraumaHUD`

Displays patient status, score, and time remaining.

## Hooks

### `useBloodSim`

Controls the blood typing state machine:

```text
IDLE -> DROPPING -> REACTING -> RESULT
```

It blocks duplicate reagent use, clears timers on reset/unmount, and can preserve the selected sample during trauma-mode slide resets.

### `useCrossmatchSim`

Controls crossmatch animation and compatibility result timing. It uses a `runId` guard so stale timers cannot publish results after reset.

### `useInventory`

Generates a small donor inventory for each patient. It guarantees at least two safe donor bags before adding random noise bags.

### `useTraumaMode`

Owns score, streak, lives, wave, active state, and countdown timer.

### `useHeartMonitor`

Schedules heartbeat audio while Trauma Mode is active and plays flatline audio when lives reach zero.

### `usePWAInstall`

Captures the browser `beforeinstallprompt` event and exposes a simple install action.

## Data Flow

Sandbox data flow:

```text
sample selection -> reagent drop -> BloodEngine.testReaction -> well result
```

Trauma data flow:

```text
random patient
  -> learner diagnoses type
  -> generated donor inventory
  -> learner selects donor
  -> CrossmatchEngine.analyze
  -> safe transfusion or discard
  -> TraumaEngine.calculateScore
  -> next patient
```

## Persistence

There is no application persistence. All state is in React memory. Reloading the page resets the session.

## PWA Behavior

The PWA configuration lives in `vite.config.ts`. Workbox caches generated JS, CSS, HTML, SVG, and related static assets so the app can run offline after installation or first load.

## Known Design Constraints

- The simulation is intentionally simplified and educational.
- Compatibility logic is deterministic and should be protected by unit tests.
- Trauma Mode currently relies on randomized patient and inventory generation.
- Audio depends on browser Web Audio support and user gesture policies.
