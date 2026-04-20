# Rewrite Plan: tuneGenerator → React Frontend

## Summary

Rewrite the batch Java CLI generator as a **purely client-side React app**. No backend needed — all generation logic is pure computation. The result is a single-page app that lets users configure and generate bagpipe tunes, view the ABC notation inline, and copy it to the clipboard.

---

## Current Architecture

| Aspect        | Current                               |
|---------------|---------------------------------------|
| Language      | Java                                  |
| UI            | None (CLI batch run)                  |
| Output        | Files written to `D:/generatedTunes/` |
| Configuration | Hard-coded in `Production.java`       |
| Tune types    | 29 subclasses via inheritance         |
| Scales/modes  | 18 defined, ~10–15 active             |
| Total output  | ~700+ files per batch run             |

---

## Target Architecture: Pure React SPA

All Java logic is deterministic computation — no database, no filesystem requirements, no auth. The full stack can be:

```
Browser
└── React SPA (Vite + TypeScript)
    ├── UI Layer         (tune config, preview, controls)
    ├── Domain Layer     (TypeScript port of TuneBase hierarchy)
    └── Output Layer     (ABC text generation + file download)
```

**No backend.** Runs entirely offline once loaded.

---

## Technology Choices

| Concern            | Choice                          | Reason                                                  |
|--------------------|---------------------------------|---------------------------------------------------------|
| Framework          | React 19 + Vite                 | Fast dev, easy deploy                                   |
| Language           | TypeScript                      | Type-safe music data models                             |
| Styling            | Tailwind CSS                    | Rapid UI without heavy setup                            |
| ABC rendering      | `abcjs` npm package             | Browser-native ABC notation renderer and audio playback |
| Copy to clipboard  | `navigator.clipboard`           | Native browser API, no dependencies                     |
| State              | React `useState` / `useReducer` | Scope is simple enough                                  |
| Testing            | Vitest                          | Co-located with Vite                                    |

---

## Domain Model (TypeScript Port)

### Notes & Scales

```ts
// src/domain/notes.ts
export const TONES = ["G", "A", "B", "c", "d", "e", "f", "g", "a"] as const;

export type Scale = {
  name: string;
  key: string;           // ABC K: field value
  intervals: number[];   // 9 values: 0=skip, 1=once, 2=three times
};

export const SCALES: Scale[] = [
  { name: "A Major",  key: "Amix", intervals: [2,2,0,2,2,2,0,2,2] },
  { name: "D Major",  key: "D",    intervals: [2,2,2,0,2,2,0,2,2] },
  // ... all 18 scales
];
```

### Tune Type (replaces subclass hierarchy)

Replace inheritance with **data + functions**. Each tune type becomes a config object:

```ts
// src/domain/tuneTypes.ts
export type RhythmForm = string[];        // e.g. ["2", "", ""]
export type FormSet = {
  forms: RhythmForm[];
  occurrences: number[];                 // cumulative weights 0–100
};

export type TuneType = {
  id: string;
  name: string;                          // "Reel", "Jig", "March 2/4", ...
  rhythm: string;                        // ABC R: field
  timeSignature: string;                 // ABC M: field
  noteLength: string;                    // ABC L: field
  tempo: string;                         // ABC Q: field
  notesPerMeasure: number;
  repeatParts: boolean;
  formSets: FormSet[];                   // one entry per "style variant"
  embellishmentProfile: EmbellishmentProfile;
};
```

This replaces all 40 subclasses with a plain data array (~200 lines total).

### Embellishments

Bagpipe embellishments are ornamental grace-note patterns inserted before melody notes. They are **computed automatically** based on the tune type — the user never selects them.

**Placement is driven by accentuation.** Each time signature defines which beat positions are strong, medium, or weak. Embellishments are only placed on non-weak positions, with probability scaled to accent strength. This matches how real pipers ornament a tune.

#### Accentuation map (positions are beat indices within the measure)

Accent levels: **VS** = Very Strong · **S** = Strong · **MS** = Medium-Strong · **M** = Medium · **MW** = Medium-Weak · **W** = Weak · **VW** = Very Weak

| Tune type     | Unit   | Beat 1 | Beat 2 | Beat 3 | Beat 4 |
|---------------|--------|--------|--------|--------|--------|
| March 2/4     | ♩      | S      | M      | —      | —      |
| March 3/4     | ♩      | S      | W      | M      | —      |
| March 4/4     | ♩      | S      | W      | MS     | W      |
| March 6/8     | ♩.     | S      | MS     | —      | —      |
| Reel (2/2)    | ♩      | S      | M      | —      | —      |
| Hornpipe (2/4)| ♩      | S      | M      | —      | —      |
| Strathspey    | ♩      | VS     | VW     | M      | VW     |
| Jig 6/8       | ♩.     | S      | MS     | —      | —      |
| Jig 9/8       | ♩.     | S      | M      | MS     | —      |
| Jig 12/8      | ♩.     | S      | M      | MS     | MW     |

#### TypeScript model

```ts
// src/domain/embellishments.ts

export type AccentLevel =
  | "very-strong" | "strong" | "medium-strong"
  | "medium" | "medium-weak" | "weak" | "very-weak";

export type BeatAccent = {
  beatIndex: number;     // 0-based beat position within the measure
  level: AccentLevel;
};

export type Embellishment = {
  name: string;
  abc: string;                          // e.g. "{GdG}"
  validOnNotes: string[] | "any";
};

// Each pool entry carries per-accent-level weights.
// A weight of 0 (or absent key) means this embellishment will never
// be selected on that accent level — e.g. a Doubling gets 0 on "weak".
export type PoolEntry = {
  embellishment: Embellishment;
  weightByLevel: Partial<Record<AccentLevel, number>>;
};

export type EmbellishmentProfile = {
  beatAccents: BeatAccent[];      // full accent map for this time signature
  density: number;                // overall chance (0–1) that any eligible beat gets ornamented
  pool: PoolEntry[];              // accent-driven embellishments
  transitions: TransitionEmbellishment[];  // melodic-interval-driven embellishments
};
```

**How selection works at runtime:**
1. For a given beat, look up its `AccentLevel`.
2. Roll against `density` — if failed, no embellishment on this beat.
3. Build a weighted pool from entries where `weightByLevel[level] > 0`.
4. Draw one embellishment using weighted random from that filtered pool.
5. Apply no-consecutive-duplicate and `validOnNotes` guards (see rules below).

**Example weights** (illustrative — tuned per tune type):

| Embellishment    | VS  | S   | MS  | M   | MW  | W/VW |
|------------------|-----|-----|-----|-----|-----|------|
| Single gracenote | 20  | 20  | 20  | 20  | 10  | 0    |
| Doubling         | 40  | 35  | 15  | 5   | 0   | 0    |
| Throw on D       | 30  | 30  | 20  | 10  | 0   | 0    |
| Grip             | 25  | 20  | 15  | 10  | 0   | 0    |
| Taorluath        | 40  | 25  | 10  | 0   | 0   | 0    |
| Birl             | 30  | 25  | 10  | 5   | 0   | 0    |
| Bubbly note      | 35  | 20  | 5   | 0   | 0   | 0    |

#### Embellishment catalogue

Two categories: **accent-driven** (placed based on beat strength) and **transition-driven** (triggered by specific melodic intervals).

**Accent-driven:**

| Embellishment    | ABC notation    | Typical tune types              |
|------------------|-----------------|---------------------------------|
| Single gracenote | `{g}`           | all                             |
| Doubling         | `{gG}` / `{dG}` | Reels, Hornpipes                |
| Throw on D       | `{Gdc}`         | Reels, Jigs, Marches            |
| Grip             | `{GdG}`         | Jigs, slow Marches              |
| Taorluath        | `{GdGeG}`       | Marches 4/4, 6/8, Strathspeys   |
| Birl             | `{GAGA}`        | Reels, Hornpipes                |
| Bubbly note      | `{GdGcG}`       | slow Marches, Strathspeys       |

**Transition-driven:**

Transition embellishments fire based on the melodic interval between the current note and the next, regardless of beat position. They are checked **before** accent-driven selection.

| Embellishment | Triggers on          | Notes                                      |
|---------------|----------------------|--------------------------------------------|
| Tachum        | c→G, c→A, c→B, B→G, B→A | Downward movement from C or B; ABC notation to be confirmed during implementation |

```ts
// Transition embellishments are defined separately from the accent pool
export type TransitionEmbellishment = {
  embellishment: Embellishment;
  from: string;        // melody note being left
  to: string;          // melody note being approached
  probability: number; // chance this fires when the transition is detected
};
```

The `EmbellishmentProfile` includes a `transitions` array alongside the accent pool.

#### Placement rules (applied in `applyEmbellishments`)

The algorithm processes each note in the measure with full lookahead to the next note:

1. **Transition check first** — if `(currentNote, nextNote)` matches a `TransitionEmbellishment` entry, roll its `probability`. If it fires, use that embellishment and skip accent-driven selection for this beat.
2. **Mandatory embellishment on repeated notes** — if `currentNote === nextNote`, an embellishment **must** be placed (bagpipe notes cannot be re-attacked without one). Skip density roll; go straight to pool selection.
3. **Accent-driven selection** — look up `AccentLevel` for this beat position, roll against `density`. If failed, no embellishment (but note: there is always a small non-zero floor chance, ~5%, so even weak beats very occasionally get ornamented).
4. Filter the accent pool to entries where `weightByLevel[level] > 0`.
5. **No consecutive duplicates** — exclude the last-used embellishment from the filtered pool.
6. Respect `validOnNotes` — re-roll once if drawn embellishment doesn't fit; skip if still invalid.

The `EmbellishmentProfile` is defined per `TuneType` alongside its rhythm forms.

### Generator

```ts
// src/domain/generator.ts
export function buildNotePool(scale: Scale): string[]
export function generateMeasure(pool: string[], formSet: FormSet, rng: RNG): string
export function applyEmbellishments(notes: string[], profile: EmbellishmentProfile, rng: RNG): string[]
export function generateTune(tuneType: TuneType, scale: Scale, rng: RNG): string  // → full ABC text
```

---

## UI Structure

```
App
├── ConfigPanel
│   ├── ModeToggle            ("Specific" | "Random")
│   │
│   ├── [Specific mode]
│   │   ├── TuneTypeSelector  (dropdown or list: Reel, Jig, March 2/4, ...)
│   │   └── ScaleSelector     (dropdown or list: A Major, D Major, ...)
│   │
│   ├── [Random mode]
│   │   └── (no selection needed — type and scale picked randomly per tune)
│   │
│   ├── CountInput            (how many tunes to generate, e.g. 1–50)
│   └── GenerateButton
└── PreviewPanel
    ├── TuneList              (generated tunes, scrollable)
    └── TuneCard
        ├── ABCRenderer       (abcjs rendered notation + play button)
        ├── ABCTextView       (raw ABC text, monospace)
        └── CopyButton        (copies ABC text to clipboard)
```

---

## Feature Map: Old → New

| Old behaviour                               | New behaviour                                                        |
|---------------------------------------------|----------------------------------------------------------------------|
| Batch generates ~700 files                  | User picks specific type + scale + count, or goes fully random       |
| Writes files to `D:/generatedTunes/`        | Tunes displayed inline; ABC text copied to clipboard                 |
| No embellishments                           | Auto-computed per tune type (doublings, grips, taorluaths, etc.)     |
| No playback                                 | ABC rendered visually + audio playback via `abcjs`                   |
| Fixed 2 reps per mode                       | User-configurable count (1–50)                                       |
| Hard-coded seed (time-based)                | Optional seed input for reproducible results                         |
| All mode variants enabled by toggle in code | Specific mode: choose one; Random mode: picked automatically         |
| Doric/Phrygic/Lydic modes commented out     | Exposed as selectable options in Specific mode                       |

---

## Implementation Phases

### Phase 1 — Core Domain (no UI)
1. Port `TONES`, `SCALES`, `TuneType` definitions to TypeScript
2. Port `buildNotePool` algorithm
3. Port `generateTune` (measure + phrase + full tune)
4. Define `EmbellishmentProfile` per tune type (accent positions + pool) and implement `applyEmbellishments`
5. Unit-test generator output (notes, rhythm forms, embellishment placement on correct beat positions)

### Phase 2 — Basic UI
1. Vite + React + Tailwind scaffold
2. `ConfigPanel` with Specific / Random mode toggle, selectors, and count input
3. Trigger generation, display raw ABC text in scrollable `TuneCard` list
4. Copy-to-clipboard button per tune

### Phase 3 — ABC Preview & Playback
1. Integrate `abcjs` for notation rendering
2. Add per-tune audio playback controls
3. `TuneCard` layout with notation, ABC text, and copy button

### Phase 4 — Polish
1. Seed input for reproducible generation
2. "Favourite" / pin tunes
3. URL-shareable generation config (query params)
4. Responsive layout

---

## File Layout (proposed)

```
tuneGenerator-react/
├── src/
│   ├── domain/
│   │   ├── notes.ts           (TONES, SCALES, buildNotePool)
│   │   ├── tuneTypes.ts       (TuneType definitions, all 29 types)
│   │   ├── generator.ts       (generateMeasure, generateTune)
│   │   └── rng.ts             (seedable RNG wrapper)
│   ├── components/
│   │   ├── ConfigPanel.tsx
│   │   ├── TuneTypeSelector.tsx
│   │   ├── ScaleSelector.tsx
│   │   ├── TuneCard.tsx
│   │   └── ABCRenderer.tsx    (wraps abcjs)
│   ├── hooks/
│   │   └── useGenerator.ts    (generation state + logic)
│   ├── App.tsx
│   └── main.tsx
├── index.html
├── vite.config.ts
├── tsconfig.json
└── package.json
```

---

## Key Technical Notes

- **`abcjs`** renders ABC notation to SVG in-browser and supports MIDI-like synth playback. Install: `npm i abcjs`.
- **`navigator.clipboard.writeText()`** handles copy-to-clipboard with no extra dependencies; show a brief "Copied!" confirmation in the button.
- **Seedable RNG**: Replace `Math.random()` with a deterministic PRNG (e.g. `mulberry32`) so users can reproduce a specific tune by entering its seed.
- **ABC Key field**: Bagpipe tunes use `K: HP` (Highland Pipes) or `K: HG` — keep this; `abcjs` has native bagpipe support.
- **Performance**: Generating 700 tunes is ~milliseconds of computation. No worker thread needed.

---

## Out of Scope

- No file download or batch export (copy to clipboard is the output mechanism)
- No user accounts or cloud storage
- No MIDI file export (ABC text is the canonical output)
- No tune editor (this is a generator, not a DAW)
