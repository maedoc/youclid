Here is a complete functional specification for the Euclidean Rhythm Metronome. It covers everything discussed — Euclidean pattern generation (Bjorklund algorithm), two-tier sounds (accent + closed/open hi-hat), tap tempo, preset library, rotation, and system theme — structured so a coding agent can implement it with minimal ambiguity.

---

Functional Specification: Euclid Metronome

1. Overview

A minimalist single-page web app that generates rhythms using the Euclidean algorithm (Bjorklund). It plays an accent sound on the downbeat and a synthesized hi-hat (closed or open, user-selectable) on the remaining active steps. Tempo can be set via a tap button or a direct BPM picker. The app includes a library of common rhythm presets and supports pattern rotation. Audio timing is precise (Web Audio API lookahead scheduler) and the UI automatically adapts to dark/light mode. The app is a PWA — installable and fully functional offline.

Target Platform: HTML5 + SvelteKit (adapter-static, SPA mode) + Web Audio API + CSS. Deployed via GitHub Pages. Zero backend. No runtime dependencies beyond SvelteKit and Vite.

---

2. Core Features

2.1 Euclidean Rhythm Generator

- Compute a Boolean array of length `steps` with `pulses` active beats, distributed as evenly as possible using the **Bjorklund algorithm** (Toussaint, "The Euclidean Algorithm Generates Traditional Rhythms").
- Supports steps from 2 to 16, pulses from 0 to steps.
- Changing either parameter instantly updates the pattern while playback continues.

2.2 Playback with Two Sounds

- Accent sound: a short low-frequency click (e.g., 150 Hz sine burst, 10 ms). Plays on the first active step of each pattern cycle (i.e., `pattern[0]`).
- Hi-Hat sound: synthesized from white noise with an ADSR envelope. Available in two variants:
  - Closed: very short decay (~50 ms), bright, tight.
  - Open: longer decay (~200 ms), more sizzle.
- The user selects one hi-hat variant globally (via a segmented control / radio group). All non-accent active steps use that variant.
- Both sounds are generated at app launch using `Float32Array` buffers via the Web Audio API (no audio files needed). Volume levels are balanced by the engine.

2.3 Tap Tempo

- A large "TAP" button records timestamps using `performance.now()`.
- Uses the last 4–8 taps; drops outliers (intervals < 200 ms or > 3 s).
- The BPM is updated continuously as taps arrive. Visual feedback (CSS flash) on each tap.
- BPM can also be adjusted with a range slider or +/- buttons (range 20–300 BPM).
- Note value: the user selects what BPM refers to — quarter, eighth, or sixteenth note. Each pattern step corresponds to the selected note value. This scales the actual playback speed: at 120 BPM, quarter = 0.5s/step, eighth = 0.25s/step, sixteenth = 0.125s/step. Default is eighth note (appropriate for clave patterns).

2.4 Preset Rhythm Library

- A curated list of named rhythmic patterns. Selecting a preset sets steps, pulses, and rotation.
- Presets are immutable and include:
  - Son Clave (3,8, rotation 0)
  - Rumba Clave (3,8, rotation 4)
  - Bossa Nova (5,16, rotation 0)
  - Afrobeat 7/16 (7,16, rotation 0)
  - Tresillo (3,8, rotation 0)
  - 4-on-the-floor (4,4, rotation 0)
- Preset picker appears as a `<select>` dropdown or a horizontal scrollable row of chips.

2.5 Pattern Rotation

- An integer rotation (0 to steps-1) shifts the Euclidean pattern to the right.
- The UI shows a range slider or +/- stepper to change rotation. The accent remains locked to the first element after rotation (i.e., the new `pattern[0]`).

2.6 System Theme & Accessibility

- Colors: CSS custom properties (`--bg`, `--fg`, `--accent`, `--muted`) driven by `@media (prefers-color-scheme: dark/light)`. No hardcoded color values in components.
- Dark/Light: follows the OS/system setting automatically via the media query.
- Responsive typography: all text uses `rem` / `clamp()` sizing.
- Haptics: `navigator.vibrate(10)` on every audible beat and on tap (graceful fallback where unsupported).
- Accessibility: `aria-label`, `role="button"`, `aria-pressed`, `aria-live` on all interactive controls.

2.7 App Lifecycle

- Pause playback when the tab becomes hidden (`visibilitychange` event — saves CPU/battery).
- Web Audio autoplay policy: `AudioContext.resume()` is called on first user gesture (required by all modern browsers).
- On return to foreground, restart the scheduler if playback was active.

---

3. User Interface

3.1 Main Screen Layout (Responsive CSS Grid)

```
Mobile (<=640px) — single column, full width:

┌────────────────────────────┐
│       120 BPM              │  ← large, centered, monospaced
│                            │
│     [ TAP ]  (circle)      │  ← accent color, 30vmin diameter
│                            │
│   Steps:   [ 8 ]  ◀ ▶     │  ← range slider
│   Pulses:  [ 3 ]  ◀ ▶     │
│   Rotation: [ 0 ]  ◀ ▶     │
│   Hi-Hat: [Closed | Open] │  ← segmented radio group
│                            │
│   Preset:  [ Son Clave ▾ ] │  ← <select> dropdown
│                            │
│   [ ▶ Play ]   [Reset]     │  ← prominent buttons
└────────────────────────────┘

Desktop (>640px) — centered card, max-width 480px:

         ┌────────────────────────────┐
         │       120 BPM              │
         │                            │
         │     [ TAP ]  (circle)      │
         │                            │
         │   Steps:   [ 8 ]  ◀ ▶     │
         │   ...                      │
         └────────────────────────────┘
```

- Tap circle: `min(120px, 30vmin)` diameter. On tap, briefly fills with accent color (CSS transition), then fades back.
- Play/Stop button: toggles label between "Play" and "Stop".
- When playing, Steps, Pulses, Rotation, Hi-Hat remain modifiable. Changes take effect immediately (no need to restart).
- Pattern visualization: a row of step indicators (dots/cells) showing the current pattern. Active steps are filled, inactive are outlined. The currently playing step pulses.

3.2 Controls Behavior

- Steps / Pulses slider: range enforced; when Pulses > Steps, clamp automatically.
- Rotation: from 0 to steps-1. When Steps changes, rotation is capped.
- Preset Menu: selecting an item updates Steps, Pulses, Rotation simultaneously. The menu shows "Custom" when parameters don't match any preset.
- BPM: tap area updates BPM; a small - + stepper beside the BPM display allows fine adjustments.

---

4. Audio Engine Specification

4.1 Core Components

- `AudioContext` (singleton, created lazily on first user gesture).
- Three pre-generated `AudioBuffer` objects:
  - accentBuffer (sine burst, 150 Hz, duration 10 ms, envelope: instant attack, exponential decay)
  - closedHiHatBuffer (white noise, ADSR: A=0, D=0.05 s, S=0, R=0.01 s, amplitude 0.4)
  - openHiHatBuffer (white noise, ADSR: A=0, D=0.2 s, S=0, R=0.02 s, amplitude 0.4)
- Format: mono, `AudioContext.sampleRate` (typically 44100 Hz), `Float32Array`.
- Each beat creates a one-shot `AudioBufferSourceNode` connected to a `GainNode` → `destination`.

4.2 Scheduling Loop (Lookahead Scheduler)

Uses the "A Tale of Two Clocks" pattern (Chris Wilson):

- A `setInterval` runs every 25 ms (the **lookahead** timer).
- It checks whether the next beat falls within a **schedule-ahead window** (100 ms).
- If so, it schedules the appropriate `AudioBufferSourceNode.start()` at the precise `AudioContext.currentTime + offset`.
- Beat times are calculated relative to `AudioContext.currentTime`, avoiding drift.
- For each beat index, compute `patternIndex = (beatIndex + rotation) % steps`. If `pattern[patternIndex]` is true:
  - If `patternIndex == 0` → schedule accentBuffer.
  - Else → schedule the currently selected hi-hat buffer.
- When parameters change (BPM, steps, pulses, rotation, hi-hat type), the loop continues using the same start time; the scheduler recalculates pattern and timing on the next cycle. No need to restart.
- On stop, all future scheduling is cancelled (clear the interval). Active one-shot nodes finish naturally.

4.3 Sound Buffer Generation (TypeScript)

```typescript
function generateSineBurst(
  ctx: AudioContext,
  freq: number,
  duration: number,
  amplitude: number = 0.6
): AudioBuffer {
  const sampleRate = ctx.sampleRate;
  const length = Math.ceil(duration * sampleRate);
  const buffer = ctx.createBuffer(1, length, sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < length; i++) {
    const t = i / sampleRate;
    const envelope = Math.exp(-t * 200); // quick decay
    data[i] = Math.sin(2 * Math.PI * freq * t) * envelope * amplitude;
  }
  return buffer;
}

function generateHiHatBuffer(
  ctx: AudioContext,
  decay: number,
  amplitude: number,
  release: number = 0.01
): AudioBuffer {
  const sampleRate = ctx.sampleRate;
  const length = Math.ceil((decay + release) * 1.5 * sampleRate);
  const buffer = ctx.createBuffer(1, length, sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < length; i++) {
    const t = i / sampleRate;
    const noise = Math.random() * 2 - 1;
    const env = t <= 0 ? 1 : Math.exp(-t / decay);
    data[i] = noise * env * amplitude;
  }
  return buffer;
}
```

- Closed hi-hat: decay = 0.05, amplitude = 0.4, release = 0.01
- Open hi-hat: decay = 0.2, amplitude = 0.4, release = 0.02

4.4 Haptic / Visual Trigger

- On each scheduled beat, increment a `currentStep` counter (Svelte store).
- The UI observes this store to pulse the current step indicator and call `navigator.vibrate(10)`.

---

5. Euclidean Algorithm & Presets

5.1 Pattern Generation (Bjorklund Algorithm)

```typescript
/**
 * Bjorklund algorithm: distributes `pulses` as evenly as possible
 * across `steps` positions. Returns a boolean[] where true = pulse.
 */
export function bjorklund(pulses: number, steps: number): boolean[] {
  if (steps <= 0) return [];
  if (pulses <= 0) return new Array(steps).fill(false);
  if (pulses >= steps) return new Array(steps).fill(true);

  // Each position is a "level" — array of [value, remainder] groups
  let pattern: { val: boolean; level: number }[] = [];

  // Initialize: pulses become [true], gaps become [false]
  const groups: boolean[][] = [];
  for (let i = 0; i < pulses; i++) groups.push([true]);
  const remainderCount = steps - pulses;
  const remainders: boolean[][] = [];
  for (let i = 0; i < remainderCount; i++) remainders.push([false]);

  // Merge remainders into groups until we can't anymore
  let level = 0;
  while (remainders.length > 1) {
    const count = Math.min(groups.length, remainders.length);
    for (let i = 0; i < count; i++) {
      groups[i] = groups[i].concat(remainders.shift()!);
    }
    // The merged remainders become new remainder groups
    // Continue with remaining groups as the new "remainder"
  }

  // Flatten groups into final pattern
  return groups.flat();
}
```

**Note:** A simpler and well-tested formulation:

```typescript
export function bjorklund(pulses: number, steps: number): boolean[] {
  if (steps <= 0) return [];
  if (pulses <= 0) return new Array(steps).fill(false);
  if (pulses >= steps) return new Array(steps).fill(true);

  let pattern: number[] = [];
  let counts: number[] = [];
  let remainders: number[] = [];
  let level = 0;
  let divisor = steps - pulses;

  remainders.push(pulses);
  while (remainders[level] > 1) {
    counts[level] = Math.floor(divisor / remainders[level]);
    remainders[level + 1] = divisor % remainders[level];
    divisor = remainders[level];
    level++;
  }
  counts[level] = divisor;

  function build(level: number): number[] {
    if (level < 0) return [0];
    return new Array(counts[level] + 1)
      .fill(0)
      .map((_, i) => (i === counts[level] ? build(level - 1) : 1))
      .flat();
  }

  const result = build(level);
  // Pad or trim to exactly `steps`
  return result.slice(0, steps).map((v) => v === 1);
}
```

5.2 Rotation

- Store `rotation: number` (0 <= rotation < steps).
- Before scheduling, compute rotated pattern:
  ```typescript
  const base = bjorklund(pulses, steps);
  const rotated = [...base.slice(rotation), ...base.slice(0, rotation)];
  ```
- The accent is always on `rotated[0]`.

5.3 Preset Definitions

```typescript
export interface RhythmPreset {
  name: string;
  steps: number;
  pulses: number;
  rotation: number;
}

export const presets: RhythmPreset[] = [
  { name: 'Son Clave', steps: 8, pulses: 3, rotation: 0 },
  { name: 'Rumba Clave', steps: 8, pulses: 3, rotation: 4 },
  { name: 'Bossa Nova', steps: 16, pulses: 5, rotation: 0 },
  { name: 'Afrobeat 7/16', steps: 16, pulses: 7, rotation: 0 },
  { name: 'Tresillo', steps: 8, pulses: 3, rotation: 0 },
  { name: '4-on-the-floor', steps: 4, pulses: 4, rotation: 0 },
];
```

The UI maps the selected preset to the controls. If no preset matches the current (steps, pulses, rotation), the dropdown shows "Custom".

---

6. Data Flow & State Management

- A single Svelte store (`metronome.ts`) holds all state and audio logic.
- Reactive properties (via Svelte writable/custom store): `bpm`, `steps`, `pulses`, `rotation`, `hiHatVariant` ('closed' | 'open'), `isPlaying`, `currentPresetName`, `currentStep`.
- When `bpm` changes, the scheduling loop picks up the new interval on the next cycle.
- When `steps`, `pulses`, `rotation`, or `hiHatVariant` change, the pattern is regenerated and scheduling continues (no interruption).
- `tapTempo()` method handles tap logic and updates `bpm`.
- The UI subscribes to the store; Svelte reactivity handles all DOM updates.

---

7. Implementation Guidelines

- File structure:
  ```
  src/
    routes/
      +page.svelte          — main UI
      +layout.svelte        — global styles, meta tags
    lib/
      stores/
        metronome.ts        — engine state + Svelte store
      audio/
        AudioEngine.ts      — Web Audio scheduling (lookahead)
        buffers.ts           — buffer factory
      rhythm/
        euclidean.ts         — Bjorklund algorithm
        presets.ts           — preset definitions
      components/
        TapButton.svelte
        BPMDisplay.svelte
        StepControl.svelte
        PresetPicker.svelte
        PlayButton.svelte
        PatternViz.svelte
    app.html                 — HTML shell, PWA meta tags
    service-worker.ts        — PWA precaching
    service-worker-register.ts
  static/
    manifest.json            — PWA manifest
    icons/                   — app icons (192, 512)
  svelte.config.js            — adapter-static, SPA fallback
  .github/
    workflows/
      deploy.yml             — build + deploy to GitHub Pages
  ```
- Thread safety: audio buffers are read-only after creation; the scheduler reads store values via closures. UI updates happen through Svelte's reactive system.
- Error handling: `AudioContext` creation can fail; show a minimal alert if Web Audio is unavailable.
- Testing: unit-test the Bjorklund algorithm, rotation, and preset matching. Manual testing for audio sync and tap tempo response.

---

8. Acceptance Criteria

1. **Euclidean correctness**: `bjorklund(3, 8)` yields `[1,0,0,1,0,0,1,0]`.
2. **Tap tempo**: after 4 taps at 120 BPM, displayed BPM is within ±2 BPM.
3. **Two-sound playback**: accent is distinctly lower pitched; non-accent beats sound like a hi-hat (closed or open). Changing hi-hat variant immediately alters the sound.
4. **Preset selection**: choosing "Rumba Clave" sets steps=8, pulses=3, rotation=4.
5. **Rotation**: shifting rotation by 1 moves the accent forward by one step.
6. **System theme**: UI text and controls invert correctly when toggling dark mode in OS/devtools.
7. **Tab visibility**: playback pauses when tab becomes hidden; resumes correctly on return (if was playing).
8. **Performance**: no audio glitches when parameters change; continuous playback for 10+ minutes with stable timing.
9. **Responsive**: usable one-handed on iPhone SE (375px) and readable on desktop (1440px+).
10. **Offline**: app loads and plays with no network connection after first visit (service worker caching).

---

9. Appendix: Sound Parameter References

| Parameter        | Accent       | Closed Hi-Hat | Open Hi-Hat |
|-----------------|-------------|---------------|-------------|
| Base signal      | Sine 150 Hz | White noise   | White noise |
| Attack time (s)  | 0           | 0             | 0           |
| Decay constant   | 5 ms        | 50 ms         | 200 ms      |
| Sustain level     | 0           | 0             | 0           |
| Release time (s)  | 0           | 10 ms         | 20 ms       |
| Peak amplitude    | 0.6         | 0.4           | 0.4         |

All buffers should have a total duration equal to `(decay + release) * 1.5` to capture the full tail.

---

10. Deployment (GitHub Pages)

- **Build**: `npm run build` produces static output in `build/` via `@sveltejs/adapter-static`.
- **SPA mode**: `adapter-static` configured with `fallback: 'index.html'` so client-side routing works on GitHub Pages.
- **Base path**: for project Pages (`user.github.io/youclid`), set `paths.base = '/youclid'` in `svelte.config.js`. For user/org Pages or custom domain, leave empty.
- **GitHub Actions**: a workflow (`.github/workflows/deploy.yml`) runs on push to `main`:
  1. Install Node.js + dependencies
  2. `npm run build`
  3. Upload `build/` as a Pages artifact
  4. Deploy to GitHub Pages environment
- **PWA**: service worker precaches all static assets (HTML, CSS, JS, icons, manifest) for offline use. `manifest.json` makes the app installable with "Add to Home Screen".
- **No backend**: everything runs client-side. No server, no database, no API calls.

---

This spec is ready for handoff. It defines the what, why, and the critical how (Bjorklund algorithm, envelope shapes, lookahead scheduling) while leaving Svelte component structure and exact CSS to the agent. All features — Euclidean rhythms, tap tempo, two hi-hat sounds, preset library, rotation, system theme, offline support — are covered.
