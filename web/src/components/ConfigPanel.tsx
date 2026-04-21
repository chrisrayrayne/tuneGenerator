import { useState } from "react";
import { type GeneratorConfig, type GenerationMode } from "../hooks/useGenerator";
import { type TuneType } from "../domain/tuneTypes";
import { type Scale } from "../domain/notes";

type Props = {
  config: GeneratorConfig;
  allTuneTypes: readonly TuneType[];
  activeScales: Scale[];
  onChange: (patch: Partial<GeneratorConfig>) => void;
  onGenerate: () => void;
  onClose: () => void;
};

export function ConfigPanel({ config, allTuneTypes, activeScales, onChange, onGenerate, onClose }: Props) {
  const [copied, setCopied] = useState(false);

  function handleShare() {
    navigator.clipboard.writeText(window.location.href).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    });
  }

  return (
    <aside className="w-72 shrink-0 bg-[#161b27] border-r border-slate-700 p-5 flex flex-col gap-5 h-screen overflow-y-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-base font-semibold text-slate-100 tracking-wide">
          Bagpipe Generator
        </h1>
        {/* Close button — only visible on mobile */}
        <button
          onClick={onClose}
          className="md:hidden text-slate-400 hover:text-slate-200 p-1"
          aria-label="Close"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      {/* Mode toggle */}
      <div>
        <label className="block text-xs font-medium text-slate-400 uppercase tracking-wider mb-2">
          Mode
        </label>
        <div className="flex rounded-lg overflow-hidden border border-slate-600">
          {(["random", "specific"] as GenerationMode[]).map((m) => (
            <button
              key={m}
              onClick={() => onChange({ mode: m })}
              className={`flex-1 py-2 text-sm font-medium transition-colors ${
                config.mode === m
                  ? "bg-indigo-600 text-white"
                  : "bg-slate-800 text-slate-400 hover:text-slate-200"
              }`}
            >
              {m === "random" ? "Random" : "Specific"}
            </button>
          ))}
        </div>
      </div>

      {/* Specific selectors */}
      {config.mode === "specific" && (
        <>
          <div>
            <label className="block text-xs font-medium text-slate-400 uppercase tracking-wider mb-2">
              Tune type
            </label>
            <select
              value={config.tuneTypeId}
              onChange={(e) => onChange({ tuneTypeId: e.target.value })}
              className="w-full bg-slate-800 border border-slate-600 text-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              {allTuneTypes.map((t) => (
                <option key={t.id} value={t.id}>{t.displayName}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-400 uppercase tracking-wider mb-2">
              Scale
            </label>
            <select
              value={config.scaleId}
              onChange={(e) => onChange({ scaleId: Number(e.target.value) })}
              className="w-full bg-slate-800 border border-slate-600 text-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              {activeScales.map((s) => (
                <option key={s.id} value={s.id}>{s.name}</option>
              ))}
            </select>
          </div>
        </>
      )}

      {/* Count */}
      <div>
        <label className="block text-xs font-medium text-slate-400 uppercase tracking-wider mb-2">
          Number of tunes
          <span className="ml-2 text-slate-500 normal-case font-normal">1–50</span>
        </label>
        <input
          type="number"
          min={1}
          max={50}
          value={config.count}
          onChange={(e) =>
            onChange({ count: Math.max(1, Math.min(50, Number(e.target.value))) })
          }
          className="w-full bg-slate-800 border border-slate-600 text-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
      </div>

      {/* Seed */}
      <div>
        <label className="block text-xs font-medium text-slate-400 uppercase tracking-wider mb-2">
          Seed
          <span className="ml-2 text-slate-500 normal-case font-normal">optional</span>
        </label>
        <input
          type="text"
          placeholder="leave empty for random"
          value={config.seed}
          onChange={(e) => onChange({ seed: e.target.value })}
          className="w-full bg-slate-800 border border-slate-600 text-slate-200 rounded-lg px-3 py-2 text-sm placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
      </div>

      {/* Actions */}
      <div className="mt-auto flex flex-col gap-2">
        <button
          onClick={onGenerate}
          className="w-full bg-indigo-600 hover:bg-indigo-500 active:bg-indigo-700 text-white font-semibold py-3 rounded-lg transition-colors"
        >
          Generate
        </button>
        <button
          onClick={handleShare}
          className={`w-full py-2 rounded-lg text-sm font-medium transition-colors border ${
            copied
              ? "border-emerald-500 text-emerald-400"
              : "border-slate-600 text-slate-400 hover:text-slate-200 hover:border-slate-400"
          }`}
        >
          {copied ? "Link copied!" : "Share config"}
        </button>
      </div>
    </aside>
  );
}
