import { useRef, useEffect, useState, useCallback } from "react";
import * as abcjs from "abcjs";

type Props = { abc: string };

export function ABCRenderer({ abc }: Props) {
  const notationRef = useRef<HTMLDivElement>(null);
  const tuneRef = useRef<abcjs.TuneObject | null>(null);
  const synthRef = useRef<abcjs.synth.MidiBuffer | null>(null);
  const [playing, setPlaying] = useState(false);
  const [loading, setLoading] = useState(false);
  const [audioSupported] = useState(() => abcjs.synth.supportsAudio());

  // Re-render notation whenever abc changes
  useEffect(() => {
    if (!notationRef.current) return;
    const tunes = abcjs.renderAbc(notationRef.current, abc, {
      responsive: "resize",
      add_classes: true,
      paddingtop: 10,
      paddingbottom: 10,
      paddingleft: 10,
      paddingright: 10,
    });
    tuneRef.current = tunes[0] ?? null;

    // Stop any in-progress playback for the previous tune
    synthRef.current?.stop();
    synthRef.current = null;
    setPlaying(false);
  }, [abc]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      synthRef.current?.stop();
    };
  }, []);

  const handlePlayStop = useCallback(async () => {
    if (playing) {
      synthRef.current?.stop();
      synthRef.current = null;
      setPlaying(false);
      return;
    }

    if (!tuneRef.current) return;
    setLoading(true);

    try {
      const audioContext = new AudioContext();
      await audioContext.resume();

      const synth = new abcjs.synth.CreateSynth();
      await synth.init({
        visualObj: tuneRef.current,
        audioContext,
        millisecondsPerMeasure: tuneRef.current.millisecondsPerMeasure(),
        onEnded: () => {
          setPlaying(false);
          synthRef.current = null;
        },
      });
      await synth.prime();
      synth.start();
      synthRef.current = synth;
      setPlaying(true);
    } catch (err) {
      console.error("Audio playback failed:", err);
      setPlaying(false);
    } finally {
      setLoading(false);
    }
  }, [playing]);

  return (
    <div className="flex flex-col gap-2">
      {/* Notation — white background so SVG ink is readable */}
      <div
        ref={notationRef}
        className="bg-white rounded-lg overflow-x-auto min-h-[80px]"
      />

      {audioSupported && (
        <button
          onClick={handlePlayStop}
          disabled={loading}
          className={`self-start flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
            playing
              ? "bg-red-700 hover:bg-red-600 text-white"
              : "bg-emerald-700 hover:bg-emerald-600 text-white"
          }`}
        >
          {loading ? (
            "Loading…"
          ) : playing ? (
            <>⏹ Stop</>
          ) : (
            <>▶ Play</>
          )}
        </button>
      )}
    </div>
  );
}
