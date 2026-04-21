import { describe, it, expect } from "vitest";
import { TONES, SCALES, buildNotePool } from "../notes";

describe("TONES", () => {
  it("has 9 notes in correct order", () => {
    expect(TONES).toEqual(["G", "A", "B", "c", "d", "e", "f", "g", "a"]);
  });
});

describe("SCALES", () => {
  it("has 19 entries (ids 0–18)", () => {
    expect(SCALES).toHaveLength(19);
    expect(SCALES.map((s) => s.id)).toEqual([...Array(19).keys()]);
  });

  it("each scale has 9 interval values", () => {
    for (const scale of SCALES) {
      expect(scale.intervals).toHaveLength(9);
    }
  });

  it("each interval is 0, 1, or 2", () => {
    for (const scale of SCALES) {
      for (const v of scale.intervals) {
        expect([0, 1, 2]).toContain(v);
      }
    }
  });
});

describe("buildNotePool", () => {
  it("excludes notes with interval 0", () => {
    // A-Major: intervals[0] (G) = 0 → G excluded; intervals[7] (g) = 0 → g excluded
    const pool = buildNotePool(SCALES[0]); // A-Major
    expect(pool).not.toContain("G");
    expect(pool).not.toContain("g");
  });

  it("adds notes with interval 1 exactly once", () => {
    // A-Major: intervals[2] (B) = 1
    const pool = buildNotePool(SCALES[0]);
    expect(pool.filter((n) => n === "B")).toHaveLength(1);
  });

  it("adds notes with interval 2 exactly three times", () => {
    // A-Major: intervals[1] (A) = 2
    const pool = buildNotePool(SCALES[0]);
    expect(pool.filter((n) => n === "A")).toHaveLength(3);
  });

  it("returns a non-empty pool for every active scale", () => {
    for (const scale of SCALES) {
      const pool = buildNotePool(scale);
      expect(pool.length).toBeGreaterThan(0);
    }
  });

  it("only returns valid tone values", () => {
    const toneSet = new Set(TONES);
    for (const scale of SCALES) {
      for (const note of buildNotePool(scale)) {
        expect(toneSet.has(note)).toBe(true);
      }
    }
  });
});
