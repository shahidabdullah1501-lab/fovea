import React, { useState, useEffect } from 'react';
import { TrainingSession } from '../types';
import { shuffle, todayStr, adaptiveNote } from '../utils/helpers';
import { StatCard } from './StatCard';
import { X } from 'lucide-react';

interface SchulteTableProps {
  onSessionComplete: (session: TrainingSession) => void;
  onExit: () => void;
}

export const SchulteTable: React.FC<SchulteTableProps> = ({ onSessionComplete, onExit }) => {
  const [phase, setPhase] = useState<'intro' | 'running' | 'result'>('intro');
  const [size, setSize] = useState<number>(5);
  const [grid, setGrid] = useState<number[]>([]);
  const [expected, setExpected] = useState(1);
  const [errors, setErrors] = useState(0);
  const [errCell, setErrCell] = useState<number | null>(null);
  const [startedAt, setStartedAt] = useState<number | null>(null);
  const [elapsed, setElapsed] = useState(0);

  useEffect(() => {
    if (phase !== 'running' || !startedAt) return;
    const iv = setInterval(() => setElapsed(Date.now() - startedAt), 100);
    return () => clearInterval(iv);
  }, [phase, startedAt]);

  function start() {
    setGrid(shuffle(Array.from({ length: size * size }, (_, i) => i + 1)));
    setExpected(1);
    setErrors(0);
    setStartedAt(null);
    setElapsed(0);
    setPhase('running');
  }

  function tap(num: number) {
    if (!startedAt) setStartedAt(Date.now());

    if (num === expected) {
      if (expected === size * size) {
        const finalElapsed = startedAt ? Date.now() - startedAt : elapsed;
        setElapsed(finalElapsed);
        const accuracy = Math.round((100 * (size * size)) / (size * size + errors));

        onSessionComplete({
          id: 's' + Date.now(),
          type: 'schulte',
          date: todayStr(),
          accuracy,
          timeMs: finalElapsed,
          size,
          errors,
        });
        setPhase('result');
        return;
      }
      setExpected(e => e + 1);
    } else {
      setErrors(e => e + 1);
      setErrCell(num);
      setTimeout(() => setErrCell(null), 250);
    }
  }

  if (phase === 'intro') {
    return (
      <div className="max-w-md mx-auto px-4 py-8 flex flex-col items-center text-center gap-4">
        <h2 className="text-2xl font-semibold text-text">Schulte Table</h2>
        <p className="text-text-soft text-sm leading-relaxed">
          Keep your gaze on the center point. Tap numbers 1 through {size * size} in ascending order using peripheral vision.
        </p>

        <div className="flex gap-2 my-2">
          {[4, 5, 6].map(n => (
            <button
              key={n}
              className={`btn btn-sm ${size === n ? 'btn-primary' : 'btn-ghost'}`}
              onClick={() => setSize(n)}
            >
              {n} × {n}
            </button>
          ))}
        </div>

        <button className="btn btn-primary btn-block mt-2" onClick={start}>
          Start Matrix Drill
        </button>
        <button className="btn btn-ghost btn-block" onClick={onExit}>
          Back to Hub
        </button>
      </div>
    );
  }

  if (phase === 'running') {
    return (
      <div className="max-w-xl mx-auto px-4 py-6">
        <div className="flex items-center justify-between mb-4">
          <div className="pill">Find Number: {expected}</div>
          <div className="pill font-mono">{(elapsed / 1000).toFixed(1)}s</div>
          <button className="btn btn-icon btn-ghost" onClick={onExit}>
            <X className="w-4 h-4" />
          </button>
        </div>

        <div
          className="grid gap-2 w-full aspect-square"
          style={{ gridTemplateColumns: `repeat(${size}, 1fr)` }}
        >
          {grid.map((n, i) => (
            <button
              key={i}
              onClick={() => tap(n)}
              className={`schulte-cell ${n < expected ? 'done' : ''} ${
                errCell === n ? 'animate-bounce border-danger' : ''
              }`}
            >
              {n}
            </button>
          ))}
        </div>
      </div>
    );
  }

  if (phase === 'result') {
    const accuracy = Math.round((100 * (size * size)) / (size * size + errors));
    const note = adaptiveNote(accuracy, null);

    return (
      <div className="max-w-md mx-auto px-4 py-6">
        <div className="card flex flex-col items-center text-center gap-4">
          <div className="grid grid-cols-2 gap-3 w-full">
            <StatCard label="Time" value={`${(elapsed / 1000).toFixed(1)}s`} />
            <StatCard label="Errors" value={errors} />
          </div>

          <div className="pill accent text-xs">{note.text}</div>

          <button className="btn btn-primary btn-block mt-2" onClick={onExit}>
            Done &amp; Return
          </button>
        </div>
      </div>
    );
  }

  return null;
};
