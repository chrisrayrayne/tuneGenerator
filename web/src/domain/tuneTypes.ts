// Each form is an array of ABC suffixes appended after each note token in the beat group.
// e.g. [">", "", "2"] means: note1+">" + note2+"" + note3+"2"
export type RhythmForm = readonly string[];

export type FormSet = {
  forms: readonly RhythmForm[];
  // Cumulative weight boundaries — length = forms.length + 1, starts with 0.
  // Built by makeFormSet(); matches the Java cumulative-list selection logic.
  cumulativeWeights: readonly number[];
};

export type TuneType = {
  id: string;
  name: string;         // ABC file name key (e.g. "Reel-Simple")
  displayName: string;  // human label (e.g. "Reel – Simple")
  rhythm: string;       // ABC R: field
  timeSignature: string;// ABC M: field
  noteLength: string;   // ABC L: field
  tempo: string;        // ABC Q: field
  beatsPerMeasure: number; // how many form-groups per bar (Java: getNumberOfForms)
  repeatParts: boolean;
  formSet: FormSet;
};

function makeFormSet(forms: RhythmForm[], occurrences: number[]): FormSet {
  const cumulativeWeights: number[] = [0];
  let sum = 0;
  for (const occ of occurrences) {
    sum += occ;
    cumulativeWeights.push(sum);
  }
  return { forms, cumulativeWeights };
}

// ─── Reels (2/2) ─────────────────────────────────────────────────────────────

const reelBase = {
  rhythm: "Reel",
  timeSignature: "2/2",
  noteLength: "1/8",
  tempo: "1/2=110",
  beatsPerMeasure: 2,
  repeatParts: false,
} as const;

export const REEL_SIMPLE: TuneType = {
  ...reelBase,
  id: "reel-simple",
  name: "Reel-Simple",
  displayName: "Reel – Simple",
  formSet: makeFormSet(
    [["2", "", ""], ["", "", "2"], ["", "", "", ""]],
    [10, 10, 10, 70],
  ),
};

export const REEL_DOTTED1: TuneType = {
  ...reelBase,
  id: "reel-dotted1",
  name: "Reel-Dotted1",
  displayName: "Reel – Dotted 1",
  formSet: makeFormSet(
    [["2", "2"], ["2", ">", ""], [">", "", "2"], [">", "", ">", ""]],
    [10, 10, 10, 70],
  ),
};

export const REEL_DOTTED2: TuneType = {
  ...reelBase,
  id: "reel-dotted2",
  name: "Reel-Dotted2",
  displayName: "Reel – Dotted 2",
  formSet: makeFormSet(
    [["2", "2"], ["2", "<", ""], ["<", "", "2"], ["<", "", "<", ""]],
    [10, 10, 10, 70],
  ),
};

export const REEL_DOTTED3: TuneType = {
  ...reelBase,
  id: "reel-dotted3",
  name: "Reel-Dotted3",
  displayName: "Reel – Dotted 3",
  formSet: makeFormSet(
    [["2", "2"], ["2", "<", ""], ["<", "", "2"], [">", "", "<", ""]],
    [10, 10, 10, 70],
  ),
};

export const REEL_DOTTED4: TuneType = {
  ...reelBase,
  id: "reel-dotted4",
  name: "Reel-Dotted4",
  displayName: "Reel – Dotted 4",
  formSet: makeFormSet(
    [["2", "2"], ["2", ">", ""], [">", "", "2"], [">", "", "<", ""]],
    [10, 10, 10, 70],
  ),
};

export const REEL_DOTTED5: TuneType = {
  ...reelBase,
  id: "reel-dotted5",
  name: "Reel-Dotted5",
  displayName: "Reel – Dotted 5",
  formSet: makeFormSet(
    [["2", "2"], ["2", "<", ""], ["<", "", "2"], ["<", "", ">", ""]],
    [10, 10, 10, 70],
  ),
};

export const REEL_DOTTED6: TuneType = {
  ...reelBase,
  id: "reel-dotted6",
  name: "Reel-Dotted6",
  displayName: "Reel – Dotted 6",
  formSet: makeFormSet(
    [["2", "2"], ["2", "<", ""], ["<", "", "2"], [">", "", "<", ""]],
    [10, 10, 10, 70],
  ),
};

export const REEL_DOTTED_ALL: TuneType = {
  ...reelBase,
  id: "reel-dotted-all",
  name: "Reel-DottedAll",
  displayName: "Reel – Dotted All",
  formSet: makeFormSet(
    [
      ["2", "2"],
      ["2", ">", ""], ["2", "<", ""],
      [">", "", "2"], ["<", "", "2"],
      ["<", "", "<", ""], ["<", "", ">", ""],
      [">", "", "<", ""], [">", "", ">", ""],
    ],
    [20, 10, 10, 10, 10, 50, 50, 50, 50],
  ),
};

// ─── Hornpipes (2/4) ──────────────────────────────────────────────────────────

const hornpipeBase = {
  rhythm: "Hornpipe",
  timeSignature: "2/4",
  noteLength: "1/8",
  tempo: "105",
  beatsPerMeasure: 2,
  repeatParts: true,
} as const;

export const HORNPIPE_SIMPLE: TuneType = {
  ...hornpipeBase,
  id: "hornpipe-simple",
  name: "Hornpipe-Simple",
  displayName: "Hornpipe – Simple",
  formSet: makeFormSet(
    [["2"], ["", "/", "/"], ["/", "/", ""], ["/", "/", "/", "/"]],
    [10, 20, 20, 50],
  ),
};

export const HORNPIPE_DOTTED1: TuneType = {
  ...hornpipeBase,
  id: "hornpipe-dotted1",
  name: "Hornpipe-Dotted1",
  displayName: "Hornpipe – Dotted 1",
  formSet: makeFormSet(
    [["2"], ["", ""], ["", "/>", "/"], ["/>", "/", ""], ["/>", "/", "/>", "/"]],
    [10, 10, 20, 20, 50],
  ),
};

export const HORNPIPE_DOTTED2: TuneType = {
  ...hornpipeBase,
  id: "hornpipe-dotted2",
  name: "Hornpipe-Dotted2",
  displayName: "Hornpipe – Dotted 2",
  formSet: makeFormSet(
    [["2"], ["", ""], ["", "/<", "/"], ["/<", "/", ""], ["/<", "/", "/<", "/"]],
    [10, 10, 20, 20, 50],
  ),
};

export const HORNPIPE_DOTTED3: TuneType = {
  ...hornpipeBase,
  id: "hornpipe-dotted3",
  name: "Hornpipe-Dotted3",
  displayName: "Hornpipe – Dotted 3",
  formSet: makeFormSet(
    [["2"], ["", ""], ["", "/<", "/"], ["/<", "/", ""], ["/>", "/", "/<", "/"]],
    [10, 10, 20, 20, 50],
  ),
};

export const HORNPIPE_DOTTED4: TuneType = {
  ...hornpipeBase,
  id: "hornpipe-dotted4",
  name: "Hornpipe-Dotted4",
  displayName: "Hornpipe – Dotted 4",
  formSet: makeFormSet(
    [["2"], ["", ""], ["", "/>", "/"], ["/>", "/", ""], ["/>", "/", "/<", "/"]],
    [10, 10, 20, 20, 50],
  ),
};

export const HORNPIPE_DOTTED5: TuneType = {
  ...hornpipeBase,
  id: "hornpipe-dotted5",
  name: "Hornpipe-Dotted5",
  displayName: "Hornpipe – Dotted 5",
  formSet: makeFormSet(
    [["2"], ["", ""], ["", "/<", "/"], ["/<", "/", ""], ["/<", "/", "/>", "/"]],
    [10, 10, 20, 20, 50],
  ),
};

export const HORNPIPE_DOTTED6: TuneType = {
  ...hornpipeBase,
  id: "hornpipe-dotted6",
  name: "Hornpipe-Dotted6",
  displayName: "Hornpipe – Dotted 6",
  formSet: makeFormSet(
    [["2"], ["", ""], ["", "/<", "/"], ["/<", "/", ""], ["/>", "/", "/>", "/"]],
    [10, 10, 20, 20, 50],
  ),
};

export const HORNPIPE_DOTTED_ALL: TuneType = {
  ...hornpipeBase,
  id: "hornpipe-dotted-all",
  name: "Hornpipe-DottedAll",
  displayName: "Hornpipe – Dotted All",
  formSet: makeFormSet(
    [
      ["2"], ["", ""],
      ["", "/>", "/"], ["", "/<", "/"],
      ["/<", "/", ""], ["/>", "/", ""],
      ["/>", "/", "/>", "/"], ["/>", "/", "/<", "/"],
      ["/<", "/", "/>", "/"], ["/<", "/", "/<", "/"],
    ],
    [10, 10, 20, 20, 20, 20, 50, 50, 50, 50],
  ),
};

// ─── Marches 2/4 ─────────────────────────────────────────────────────────────

const march24Base = {
  rhythm: "March",
  timeSignature: "2/4",
  noteLength: "1/4",
  tempo: "1/4=87",
  beatsPerMeasure: 2,
  repeatParts: true,
} as const;

const march24BaseFormSet = ([[""], ["/2", "/2"], ["/2>", "/2"], ["/2<", "/2"]] as RhythmForm[]);
const march24BaseOcc = [10, 30, 30, 30];

export const MARCH_2_4_SIMPLE: TuneType = {
  ...march24Base,
  id: "march-2-4-simple",
  name: "2_4-March-Simple",
  displayName: "March 2/4 – Simple",
  formSet: makeFormSet(march24BaseFormSet, march24BaseOcc),
};

export const MARCH_2_4_DOTTED1: TuneType = {
  ...march24Base,
  id: "march-2-4-dotted1",
  name: "2_4-March-Dotted1",
  displayName: "March 2/4 – Dotted 1",
  formSet: makeFormSet(
    [...march24BaseFormSet, ["/4>", "/4", "/4>", "/4"]],
    [10, 20, 30, 15, 25],
  ),
};

export const MARCH_2_4_DOTTED2: TuneType = {
  ...march24Base,
  id: "march-2-4-dotted2",
  name: "2_4-March-Dotted2",
  displayName: "March 2/4 – Dotted 2",
  formSet: makeFormSet(
    [[""], ["/", "/"], ["/>", "/"], ["/<", "/"], ["/4<", "/4", "/4<", "/4"]],
    [10, 20, 30, 15, 25],
  ),
};

export const MARCH_2_4_DOTTED3: TuneType = {
  ...march24Base,
  id: "march-2-4-dotted3",
  name: "2_4-March-Dotted3",
  displayName: "March 2/4 – Dotted 3",
  formSet: makeFormSet(
    [...march24BaseFormSet, ["/4>", "/4", "/4<", "/4"]],
    [10, 20, 30, 15, 25],
  ),
};

export const MARCH_2_4_DOTTED4: TuneType = {
  ...march24Base,
  id: "march-2-4-dotted4",
  name: "2_4-March-Dotted4",
  displayName: "March 2/4 – Dotted 4",
  formSet: makeFormSet(
    [...march24BaseFormSet, ["/4<", "/4", "/4>", "/4"]],
    [10, 20, 30, 15, 25],
  ),
};

export const MARCH_2_4_DOTTED_ALL: TuneType = {
  ...march24Base,
  id: "march-2-4-dotted-all",
  name: "2_4-March-DottedAll",
  displayName: "March 2/4 – Dotted All",
  formSet: makeFormSet(
    [
      [""], ["/2", "/2"], ["/2>", "/2"], ["/2<", "/2"],
      ["/4>", "/4", "/4>", "/4"], ["/4>", "/4", "/4<", "/4"],
      ["/4<", "/4", "/4>", "/4"], ["/4<", "/4", "/4<", "/4"],
    ],
    [10, 20, 20, 20, 50, 50, 50, 50],
  ),
};

// ─── March 3/4 ───────────────────────────────────────────────────────────────

export const MARCH_3_4: TuneType = {
  id: "march-3-4",
  name: "3_4-March",
  displayName: "March 3/4",
  rhythm: "March",
  timeSignature: "3/4",
  noteLength: "1/4",
  tempo: "1/4=110",
  beatsPerMeasure: 3,
  repeatParts: true,
  formSet: makeFormSet(
    [[""], ["/2", "/2"], ["/2>", "/2"], ["/2<", "/2"]],
    [10, 10, 50, 30],
  ),
};

// ─── March 4/4 ───────────────────────────────────────────────────────────────

export const MARCH_4_4: TuneType = {
  id: "march-4-4",
  name: "4_4-March",
  displayName: "March 4/4",
  rhythm: "March",
  timeSignature: "4/4",
  noteLength: "1/4",
  tempo: "1/4=110",
  beatsPerMeasure: 4,
  repeatParts: false,
  formSet: makeFormSet(
    [[""], ["/2", "/2"], ["/2>", "/2"], ["/2<", "/2"]],
    [25, 40, 25, 10],
  ),
};

// ─── Marches 6/8, 9/8, 12/8 ──────────────────────────────────────────────────

const compoundMarchFormSet = makeFormSet(
  [["3"], [">", "", ""], ["<", "", ""], ["2", ""], ["", "2"]],
  [10, 40, 20, 15, 15],
);

export const MARCH_6_8: TuneType = {
  id: "march-6-8",
  name: "6_8-March",
  displayName: "March 6/8",
  rhythm: "March",
  timeSignature: "6/8",
  noteLength: "1/8",
  tempo: "3/8=84",
  beatsPerMeasure: 2,
  repeatParts: true,
  formSet: compoundMarchFormSet,
};

export const MARCH_9_8: TuneType = {
  id: "march-9-8",
  name: "9_8-March",
  displayName: "March 9/8",
  rhythm: "March",
  timeSignature: "9/8",
  noteLength: "1/8",
  tempo: "3/8=84",
  beatsPerMeasure: 3,
  repeatParts: false,
  formSet: compoundMarchFormSet,
};

export const MARCH_12_8: TuneType = {
  id: "march-12-8",
  name: "12_8-March",
  displayName: "March 12/8",
  rhythm: "March",
  timeSignature: "12/8",
  noteLength: "1/8",
  tempo: "3/8=84",
  beatsPerMeasure: 4,
  repeatParts: true,
  formSet: compoundMarchFormSet,
};

// ─── Jigs ─────────────────────────────────────────────────────────────────────

const jigFormSet = makeFormSet(
  [["", "", ""], ["", "2"], ["2", ""]],
  [70, 15, 15],
);

export const JIG_6_8: TuneType = {
  id: "jig-6-8",
  name: "6_8-Jig",
  displayName: "Jig 6/8",
  rhythm: "Jig",
  timeSignature: "6/8",
  noteLength: "1/8",
  tempo: "105",
  beatsPerMeasure: 2,
  repeatParts: true,
  formSet: jigFormSet,
};

export const JIG_9_8: TuneType = {
  id: "jig-9-8",
  name: "9_8-Jig",
  displayName: "Jig 9/8",
  rhythm: "Jig",
  timeSignature: "9/8",
  noteLength: "1/8",
  tempo: "105",
  beatsPerMeasure: 3,
  repeatParts: true,
  formSet: jigFormSet,
};

export const JIG_12_8: TuneType = {
  id: "jig-12-8",
  name: "12_8-Jig",
  displayName: "Jig 12/8",
  rhythm: "Jig",
  timeSignature: "12/8",
  noteLength: "1/8",
  tempo: "105",
  beatsPerMeasure: 4,
  repeatParts: false,
  formSet: jigFormSet,
};

// ─── Waltz ────────────────────────────────────────────────────────────────────

export const WALTZ: TuneType = {
  id: "waltz",
  name: "Waltz",
  displayName: "Waltz",
  rhythm: "Waltz",
  timeSignature: "3/4",
  noteLength: "1/4",
  tempo: "1/4=110",
  beatsPerMeasure: 3,
  repeatParts: true,
  formSet: makeFormSet(
    [["/", "/"], [""]],
    [65, 35],
  ),
};

// ─── Strathspey ───────────────────────────────────────────────────────────────

export const STRATHSPEY: TuneType = {
  id: "strathspey",
  name: "Strathspey",
  displayName: "Strathspey",
  rhythm: "Strathspey",
  timeSignature: "4/4",
  noteLength: "1/4",
  tempo: "1/4=110",
  beatsPerMeasure: 4,
  repeatParts: false,
  formSet: makeFormSet(
    [[""], ["/2>", "/2"], ["/2<", "/2"], ["/4", "/4", "/2"]],
    [20, 35, 35, 10],
  ),
};

// ─── Master list ──────────────────────────────────────────────────────────────

export const ALL_TUNE_TYPES: readonly TuneType[] = [
  MARCH_2_4_SIMPLE, MARCH_2_4_DOTTED1, MARCH_2_4_DOTTED2,
  MARCH_2_4_DOTTED3, MARCH_2_4_DOTTED4, MARCH_2_4_DOTTED_ALL,
  MARCH_3_4, MARCH_4_4,
  MARCH_6_8, MARCH_9_8, MARCH_12_8,
  HORNPIPE_SIMPLE,
  HORNPIPE_DOTTED1, HORNPIPE_DOTTED2, HORNPIPE_DOTTED3,
  HORNPIPE_DOTTED4, HORNPIPE_DOTTED5, HORNPIPE_DOTTED6,
  HORNPIPE_DOTTED_ALL,
  WALTZ, STRATHSPEY,
  JIG_6_8, JIG_9_8, JIG_12_8,
  REEL_SIMPLE,
  REEL_DOTTED1, REEL_DOTTED2, REEL_DOTTED3,
  REEL_DOTTED4, REEL_DOTTED5, REEL_DOTTED6,
  REEL_DOTTED_ALL,
];
