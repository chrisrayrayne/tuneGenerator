import { useState, useCallback } from "react";
import { useGenerator } from "./hooks/useGenerator";
import { ConfigPanel } from "./components/ConfigPanel";
import { TuneCard } from "./components/TuneCard";
import { type GeneratedTune } from "./domain/generator";

export default function App() {
  const { config, updateConfig, tunes, generate, allTuneTypes, activeScales } = useGenerator();
  const [pinnedIds, setPinnedIds] = useState<Set<string>>(new Set());
  const [pinnedTunes, setPinnedTunes] = useState<GeneratedTune[]>([]);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const togglePin = useCallback((tune: GeneratedTune) => {
    setPinnedIds((prev) => {
      const next = new Set(prev);
      if (next.has(tune.id)) {
        next.delete(tune.id);
        setPinnedTunes((pts) => pts.filter((t) => t.id !== tune.id));
      } else {
        next.add(tune.id);
        setPinnedTunes((pts) => [...pts, tune]);
      }
      return next;
    });
  }, []);

  const allTunes = [
    ...pinnedTunes,
    ...tunes.filter((t) => !pinnedIds.has(t.id)),
  ];

  return (
    <div className="flex min-h-screen bg-[#0f1117]">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-20 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed md:static z-30 h-full transition-transform duration-200
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}`}
      >
        <ConfigPanel
          config={config}
          allTuneTypes={allTuneTypes}
          activeScales={activeScales}
          onChange={updateConfig}
          onGenerate={() => { generate(); setSidebarOpen(false); }}
          onClose={() => setSidebarOpen(false)}
        />
      </div>

      {/* Main content */}
      <main className="flex-1 flex flex-col min-w-0 md:ml-0">
        {/* Mobile top bar */}
        <div className="md:hidden flex items-center gap-3 px-4 py-3 border-b border-slate-700 bg-[#161b27]">
          <button
            onClick={() => setSidebarOpen(true)}
            className="text-slate-400 hover:text-slate-200 p-1"
            aria-label="Open settings"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <span className="text-sm font-semibold text-slate-200">Bagpipe Tune Generator</span>
        </div>

        <div className="flex-1 p-4 md:p-6 overflow-y-auto">
          {allTunes.length === 0 ? (
            <div className="h-full flex items-center justify-center text-slate-500 text-sm">
              Configure and click Generate to create tunes.
            </div>
          ) : (
            <div className="flex flex-col gap-4 max-w-3xl mx-auto">
              {pinnedTunes.length > 0 && (
                <p className="text-xs text-amber-500 font-medium">
                  ★ {pinnedTunes.length} pinned
                </p>
              )}
              {tunes.length > 0 && pinnedTunes.length === 0 && (
                <p className="text-xs text-slate-500">
                  {tunes.length} tune{tunes.length !== 1 ? "s" : ""} generated
                </p>
              )}
              {allTunes.map((tune) => (
                <TuneCard
                  key={tune.id}
                  tune={tune}
                  pinned={pinnedIds.has(tune.id)}
                  onTogglePin={togglePin}
                />
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
