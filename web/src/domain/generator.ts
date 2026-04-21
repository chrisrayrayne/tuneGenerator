import { type RNG, pickRandom } from "./rng";
import { type Scale, type Tone, buildNotePool } from "./notes";
import { type TuneType, type RhythmForm } from "./tuneTypes";
import { type EmbellishmentProfile, EMPTY_PROFILE } from "./embellishments";

// ─── Form selection ──────────────────────────────────────────────────────────

// Replicates the Java cumulative-range selection exactly:
// roll in [0, total], find first bucket where cw[i] <= roll <= cw[i+1].
function pickForm(
  forms: readonly RhythmForm[],
  cumulativeWeights: readonly number[],
  rng: RNG,
): RhythmForm {
  const total = cumulativeWeights[cumulativeWeights.length - 1];
  const roll = Math.floor(rng() * (total + 1));
  for (let i = 0; i < forms.length; i++) {
    if (roll >= cumulativeWeights[i] && roll <= cumulativeWeights[i + 1]) {
      return forms[i];
    }
  }
  return forms[forms.length - 1];
}

// ─── Measure generation ──────────────────────────────────────────────────────

function generateMeasure(
  pool: Tone[],
  tuneType: TuneType,
  rng: RNG,
): string {
  const { forms, cumulativeWeights } = tuneType.formSet;
  let bar = "";
  for (let beat = 0; beat < tuneType.beatsPerMeasure; beat++) {
    const form = pickForm(forms, cumulativeWeights, rng);
    for (const suffix of form) {
      bar += pickRandom(pool, rng) + suffix;
    }
    bar += " ";
  }
  return bar;
}

// ─── Embellishment application (stub — no-op until profiles are filled) ──────

function applyEmbellishments(
  _abc: string,
  _profile: EmbellishmentProfile,
  _rng: RNG,
): string {
  return _abc;
}

// ─── Full tune generation ────────────────────────────────────────────────────

const BARS_PER_PHRASE = 2;

function generatePhrase(pool: Tone[], tuneType: TuneType, rng: RNG): string {
  let phrase = "";
  for (let bar = 0; bar < BARS_PER_PHRASE; bar++) {
    phrase += generateMeasure(pool, tuneType, rng);
    phrase += "| ";
  }
  return phrase;
}

export type GeneratedTune = {
  id: string;    // stable UI key — not part of the musical content
  tuneType: TuneType;
  scale: Scale;
  tuneNumber: number;
  abc: string;   // full ABC text including header
};

export function generateTune(
  tuneType: TuneType,
  scale: Scale,
  tuneNumber: number,
  rng: RNG,
  profile: EmbellishmentProfile = EMPTY_PROFILE,
): GeneratedTune {
  const pool = buildNotePool(scale);
  const phrases = Array.from({ length: 4 }, () => generatePhrase(pool, tuneType, rng));

  // Strip trailing "| " from the last bar of phrase[3] to match Java output
  phrases[3] = phrases[3].replace(/\| $/, "");

  const wrap = tuneType.repeatParts;
  const open  = wrap ? "|:" : "[|";
  const close = wrap ? ":|" : "|]";

  const body =
    `${open}${phrases[0]}${phrases[2]}\n${phrases[0]}${phrases[3]}${close}\n` +
    `${open}${phrases[1]}${phrases[2]}\n${phrases[1]}${phrases[3]}${close}`;

  const embellishedBody = applyEmbellishments(body, profile, rng);

  const header =
    `X: ${tuneNumber}\n` +
    `T: ${scale.name}\n` +
    `C: Christoph Schuetz\n` +
    `R: ${tuneType.rhythm}\n` +
    `M: ${tuneType.timeSignature}\n` +
    `K: HP\n` +
    `L: ${tuneType.noteLength}\n` +
    `Q: ${tuneType.tempo}`;

  return {
    id: `${tuneNumber}-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
    tuneType,
    scale,
    tuneNumber,
    abc: `${header}\n${embellishedBody}`,
  };
}

export function generateTunes(
  tuneType: TuneType,
  scale: Scale,
  count: number,
  rng: RNG,
  startNumber = 1,
  profile: EmbellishmentProfile = EMPTY_PROFILE,
): GeneratedTune[] {
  return Array.from({ length: count }, (_, i) =>
    generateTune(tuneType, scale, startNumber + i, rng, profile),
  );
}
