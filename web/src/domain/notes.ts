export const TONES = ["G", "A", "B", "c", "d", "e", "f", "g", "a"] as const;
export type Tone = (typeof TONES)[number];

export type Scale = {
  id: number;
  name: string;
  // Per-note interval weight: 0 = exclude, 1 = include once, 2 = include 3×
  intervals: readonly number[];
};

export const SCALES: readonly Scale[] = [
  { id: 0,  name: "A-Major",     intervals: [0, 2, 1, 2, 1, 2, 1, 0, 2] },
  { id: 1,  name: "D-Major",     intervals: [1, 2, 1, 1, 2, 1, 2, 1, 2] },
  { id: 2,  name: "G-Major",     intervals: [2, 1, 2, 0, 2, 1, 1, 2, 1] },
  { id: 3,  name: "B-Doric",     intervals: [0, 1, 2, 1, 2, 1, 2, 0, 1] },
  { id: 4,  name: "E-Doric",     intervals: [2, 1, 2, 1, 1, 2, 1, 2, 1] },
  { id: 5,  name: "F-Doric",     intervals: [0, 2, 1, 2, 0, 1, 2, 0, 2] },
  { id: 6,  name: "B-Phrygic",   intervals: [1, 1, 2, 0, 2, 1, 2, 1, 1] },
  { id: 7,  name: "E-Phrygic",   intervals: [2, 1, 2, 0, 1, 2, 0, 2, 1] },
  { id: 8,  name: "F-Phrygic",   intervals: [1, 2, 1, 2, 1, 1, 2, 1, 2] },
  { id: 9,  name: "A-Lydic",     intervals: [0, 2, 1, 2, 0, 2, 1, 0, 2] },
  { id: 10, name: "D-Lydic",     intervals: [0, 2, 1, 1, 2, 1, 2, 0, 2] },
  { id: 11, name: "G-Lydic",     intervals: [2, 1, 2, 1, 2, 1, 1, 2, 1] },
  { id: 12, name: "A-Mixolydic", intervals: [1, 2, 1, 2, 1, 2, 1, 1, 2] },
  { id: 13, name: "D-Mixolydic", intervals: [1, 2, 1, 0, 2, 1, 2, 1, 2] },
  { id: 14, name: "G-Mixolydic", intervals: [1, 2, 1, 0, 2, 1, 0, 2, 2] },
  { id: 15, name: "B-Minor",     intervals: [1, 1, 2, 1, 2, 1, 2, 1, 1] },
  { id: 16, name: "E-Minor",     intervals: [2, 1, 2, 0, 1, 2, 1, 2, 1] },
  { id: 17, name: "F-Minor",     intervals: [0, 2, 1, 2, 1, 1, 2, 0, 2] },
  { id: 18, name: "C-Lokric",    intervals: [2, 1, 1, 2, 1, 2, 1, 2, 1] },
];

// Scales active by default (matching original Java — others are available but off)
export const DEFAULT_ACTIVE_SCALE_IDS = new Set([0, 1, 2, 15, 16, 17, 18]);

export function buildNotePool(scale: Scale): Tone[] {
  const pool: Tone[] = [];
  for (let i = 0; i < TONES.length; i++) {
    const w = scale.intervals[i];
    const count = w === 2 ? 3 : w === 1 ? 1 : 0;
    for (let j = 0; j < count; j++) pool.push(TONES[i]);
  }
  return pool;
}
