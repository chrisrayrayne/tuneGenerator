import { useState } from "react";
import { type GeneratedTune } from "../domain/generator";
import { ABCRenderer } from "./ABCRenderer";

type Props = {
  tune: GeneratedTune;
  pinned: boolean;
  onTogglePin: (tune: GeneratedTune) => void;
};

export function TuneCard({ tune, pinned, onTogglePin }: Props) {
  const [copied, setCopied] = useState(false);
  const [showRaw, setShowRaw] = useState(false);

  function handleCopy() {
    navigator.clipboard.writeText(tune.abc).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    });
  }

  return (
    <div
      className={`bg-[#161b27] border rounded-xl p-4 flex flex-col gap-3 transition-colors ${
        pinned ? "border-amber-500/50" : "border-slate-700"
      }`}
    >
      {/* Header row */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-2 min-w-0">
          {/* Pin button */}
          <button
            onClick={() => onTogglePin(tune)}
            title={pinned ? "Unpin" : "Pin"}
            className={`mt-0.5 shrink-0 transition-colors ${
              pinned ? "text-amber-400 hover:text-amber-300" : "text-slate-600 hover:text-amber-400"
            }`}
          >
            <svg className="w-4 h-4" fill={pinned ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
              />
            </svg>
          </button>

          <div className="min-w-0">
            <p className="text-sm font-semibold text-slate-100 truncate">
              {tune.tuneType.displayName}
            </p>
            <p className="text-xs text-slate-400">
              {tune.scale.name} · {tune.tuneType.timeSignature} · #{tune.tuneNumber}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => setShowRaw((v) => !v)}
            className="px-2.5 py-1.5 rounded-lg text-xs font-medium bg-slate-700 hover:bg-slate-600 text-slate-300 transition-colors"
          >
            {showRaw ? "Hide ABC" : "Show ABC"}
          </button>
          <button
            onClick={handleCopy}
            className={`px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors ${
              copied
                ? "bg-emerald-600 text-white"
                : "bg-slate-700 hover:bg-slate-600 text-slate-300"
            }`}
          >
            {copied ? "Copied!" : "Copy"}
          </button>
        </div>
      </div>

      {/* Notation + playback */}
      <ABCRenderer abc={tune.abc} />

      {/* Raw ABC text */}
      {showRaw && (
        <pre className="bg-slate-900 rounded-lg p-3 text-xs text-slate-400 font-mono overflow-x-auto leading-relaxed whitespace-pre-wrap break-all">
          {tune.abc}
        </pre>
      )}
    </div>
  );
}
