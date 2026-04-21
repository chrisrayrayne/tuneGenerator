// Embellishment types and profiles — implementation stubbed pending drill data.
// The generator calls applyEmbellishments but receives a no-op profile until
// real profiles are wired in.

export type AccentLevel =
  | "very-strong"
  | "strong"
  | "medium-strong"
  | "medium"
  | "medium-weak"
  | "weak"
  | "very-weak";

export type BeatAccent = {
  beatIndex: number;
  level: AccentLevel;
};

export type Embellishment = {
  name: string;
  abc: string;                        // grace-note prefix string, e.g. "{GdG}"
  validOnNotes: string[] | "any";
};

export type PoolEntry = {
  embellishment: Embellishment;
  // Weight per accent level — absent key means weight 0 on that level
  weightByLevel: Partial<Record<AccentLevel, number>>;
};

export type TransitionEmbellishment = {
  embellishment: Embellishment;
  from: string;        // melody note being left
  to: string;          // melody note being approached
  probability: number;
};

export type EmbellishmentProfile = {
  beatAccents: BeatAccent[];
  density: number;
  pool: PoolEntry[];
  transitions: TransitionEmbellishment[];
};

export const EMPTY_PROFILE: EmbellishmentProfile = {
  beatAccents: [],
  density: 0,
  pool: [],
  transitions: [],
};
