import { describe, it, expect } from "vitest";
import { mulberry32 } from "../rng";
import { SCALES } from "../notes";
import { generateTune, generateTunes } from "../generator";
import {
  REEL_SIMPLE, REEL_DOTTED_ALL,
  JIG_6_8, MARCH_2_4_SIMPLE, MARCH_4_4, STRATHSPEY,
  ALL_TUNE_TYPES,
} from "../tuneTypes";

describe("generateTune", () => {
  it("produces a string containing required ABC headers", () => {
    const rng = mulberry32(42);
    const { abc } = generateTune(REEL_SIMPLE, SCALES[0], 1, rng);
    expect(abc).toContain("X: 1");
    expect(abc).toContain("T: A-Major");
    expect(abc).toContain("R: Reel");
    expect(abc).toContain("M: 2/2");
    expect(abc).toContain("K: HP");
    expect(abc).toContain("L: 1/8");
    expect(abc).toContain("Q: 1/2=110");
  });

  it("is deterministic for the same seed", () => {
    const a = generateTune(REEL_SIMPLE, SCALES[1], 1, mulberry32(99));
    const b = generateTune(REEL_SIMPLE, SCALES[1], 1, mulberry32(99));
    expect(a.abc).toBe(b.abc);
  });

  it("produces different output for different seeds", () => {
    const a = generateTune(REEL_SIMPLE, SCALES[0], 1, mulberry32(1));
    const b = generateTune(REEL_SIMPLE, SCALES[0], 1, mulberry32(2));
    expect(a.abc).not.toBe(b.abc);
  });

  it("only uses notes from the scale's note pool", () => {
    const scale = SCALES[0]; // A-Major — excludes G and g
    const { abc } = generateTune(REEL_SIMPLE, scale, 1, mulberry32(7));
    // Strip ABC headers and control characters, isolate note tokens
    const body = abc.split("\n").slice(8).join("");
    // G and g must not appear as bare note tokens (not inside grace notes for now)
    const noteTokens = body.match(/[A-Ga-g][^A-Ga-g]*/g) ?? [];
    for (const token of noteTokens) {
      expect(token[0]).not.toBe("G");
      expect(token[0]).not.toBe("g");
    }
  });

  it("uses repeat markers when repeatParts=true", () => {
    const { abc } = generateTune(JIG_6_8, SCALES[2], 1, mulberry32(5));
    expect(abc).toContain("|:");
    expect(abc).toContain(":|");
  });

  it("uses section markers when repeatParts=false", () => {
    const { abc } = generateTune(REEL_SIMPLE, SCALES[0], 1, mulberry32(5));
    expect(abc).toContain("[|");
    expect(abc).toContain("|]");
  });

  it("generates structurally valid output for all tune types", () => {
    const rng = mulberry32(123);
    for (const tuneType of ALL_TUNE_TYPES) {
      const { abc } = generateTune(tuneType, SCALES[1], 1, rng);
      expect(abc).toContain("X: 1");
      expect(abc).toContain("K: HP");
      expect(abc.length).toBeGreaterThan(50);
    }
  });
});

describe("generateTunes", () => {
  it("generates the requested count", () => {
    const tunes = generateTunes(MARCH_2_4_SIMPLE, SCALES[0], 5, mulberry32(0));
    expect(tunes).toHaveLength(5);
  });

  it("assigns sequential tune numbers starting from startNumber", () => {
    const tunes = generateTunes(MARCH_4_4, SCALES[15], 3, mulberry32(0), 10);
    expect(tunes.map((t) => t.tuneNumber)).toEqual([10, 11, 12]);
  });

  it("all tunes in a batch are different", () => {
    const tunes = generateTunes(STRATHSPEY, SCALES[2], 5, mulberry32(77));
    const abcSet = new Set(tunes.map((t) => t.abc));
    expect(abcSet.size).toBe(5);
  });

  it("dotted-all reel produces output using expected note-length suffixes", () => {
    const { abc } = generateTune(REEL_DOTTED_ALL, SCALES[1], 1, mulberry32(8));
    // DottedAll forms include ">" and "<" suffixes
    expect(abc).toMatch(/[A-Ga-g][><]/);
  });
});
