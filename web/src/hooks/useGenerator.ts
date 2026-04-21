import { useState, useCallback } from "react";
import { fromTimestamp, mulberry32, pickRandom } from "../domain/rng";
import { SCALES, DEFAULT_ACTIVE_SCALE_IDS } from "../domain/notes";
import { ALL_TUNE_TYPES, type TuneType } from "../domain/tuneTypes";
import { generateTune, type GeneratedTune } from "../domain/generator";

export type GenerationMode = "specific" | "random";

export type GeneratorConfig = {
  mode: GenerationMode;
  tuneTypeId: string;
  scaleId: number;
  count: number;
  seed: string;
};

const ACTIVE_SCALES = SCALES.filter((s) => DEFAULT_ACTIVE_SCALE_IDS.has(s.id));

function readUrlConfig(): Partial<GeneratorConfig> {
  const p = new URLSearchParams(window.location.search);
  const patch: Partial<GeneratorConfig> = {};
  const mode = p.get("mode");
  if (mode === "specific" || mode === "random") patch.mode = mode;
  const type = p.get("type");
  if (type && ALL_TUNE_TYPES.some((t) => t.id === type)) patch.tuneTypeId = type;
  const scale = p.get("scale");
  if (scale !== null && !isNaN(Number(scale))) patch.scaleId = Number(scale);
  const count = p.get("count");
  if (count !== null && !isNaN(Number(count))) patch.count = Math.max(1, Math.min(50, Number(count)));
  const seed = p.get("seed");
  if (seed !== null) patch.seed = seed;
  return patch;
}

function writeUrlConfig(config: GeneratorConfig) {
  const p = new URLSearchParams();
  p.set("mode", config.mode);
  if (config.mode === "specific") {
    p.set("type", config.tuneTypeId);
    p.set("scale", String(config.scaleId));
  }
  p.set("count", String(config.count));
  if (config.seed) p.set("seed", config.seed);
  history.replaceState(null, "", "?" + p.toString());
}

const DEFAULT_CONFIG: GeneratorConfig = {
  mode: "random",
  tuneTypeId: ALL_TUNE_TYPES[0].id,
  scaleId: 0,
  count: 5,
  seed: "",
};

export function useGenerator() {
  const [config, setConfig] = useState<GeneratorConfig>(() => ({
    ...DEFAULT_CONFIG,
    ...readUrlConfig(),
  }));
  const [tunes, setTunes] = useState<GeneratedTune[]>([]);

  const updateConfig = useCallback(
    (patch: Partial<GeneratorConfig>) =>
      setConfig((prev) => ({ ...prev, ...patch })),
    [],
  );

  const generate = useCallback(() => {
    const seedNum = config.seed.trim() ? parseInt(config.seed, 10) : Date.now();
    const rng = isNaN(seedNum) ? fromTimestamp() : mulberry32(seedNum);

    const fixedType: TuneType | null =
      config.mode === "specific"
        ? (ALL_TUNE_TYPES.find((t) => t.id === config.tuneTypeId) ?? ALL_TUNE_TYPES[0])
        : null;

    const results: GeneratedTune[] = [];
    for (let i = 0; i < config.count; i++) {
      const type = fixedType ?? pickRandom(ALL_TUNE_TYPES, rng);
      const scale =
        config.mode === "specific"
          ? (SCALES.find((s) => s.id === config.scaleId) ?? SCALES[0])
          : pickRandom(ACTIVE_SCALES, rng);
      results.push(generateTune(type, scale, i + 1, rng));
    }

    writeUrlConfig(config);
    setTunes(results);
  }, [config]);

  return {
    config,
    updateConfig,
    tunes,
    generate,
    allTuneTypes: ALL_TUNE_TYPES,
    activeScales: ACTIVE_SCALES,
  };
}
