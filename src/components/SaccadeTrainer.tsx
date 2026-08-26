import React, { useState, useEffect, useRef } from 'react';
import { TrainingSession } from '../types';
import { todayStr, adaptiveNote } from '../utils/helpers';
import { StatCard } from './StatCard';
import { X } from 'lucide-react';

interface SaccadeTrainerProps {
  onSessionComplete: (session: TrainingSession) => void;
  onExit: () => void;
}

const SACCADE_CHARS = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'.split('');

export const SaccadeTrainer: React.FC<SaccadeTrainerProps> = ({ onSessionComplete, onExit }) => {
  const [phase, setPhase] = useState<'intro' | 'running' | 'result'>('intro');
  const [trial, setTrial] = useState(0);
  const totalTrials = 15;
  const duration = 950; // ms target remains visible

  const [pos, setPos] = useState({ x: 50, y: 50 });
  const [char, setChar] = useState('A');
  const [results, setResults] = useState<{ hit: boolean; rt: number | null }[]>([]);

  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const shownAtRef = useRef<number>(0);

  useEffect(() => {
    if (phase !== 'running') return;
    if (trial >= totalTrials) {
      finish();
      return;
    }

    setPos({ x: 12 + Math.random() * 76, y: 14 + Math.random() * 72 });
    setChar(SACCADE_CHARS[Math.floor(Math.random() * SACCADE_CHARS.length)]);
    shownAtRef.current = performance.now();

    timeoutRef.current = setTimeout(() => recordResult(false, null), duration);
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [phase, trial]);

  function recordResult(hit: boolean, rt: number | null) {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setResults(r => [...r, { hit, rt }]);
    setTrial(t => t + 1);
  }

  function tapTarget() {
    recordResult(true, performance.now() - shownAtRef.current);
  }

  function finish() {
    setPhase('result');
    const hits = results.filter(r => r.hit);
    const session: TrainingSession = {
      id: 's' + Date.now(),
      type: 'saccade',
      date: todayStr(),
      accuracy: Math.round((hits.length / totalTrials) * 100),
      reactionTime: hits.length
        ? Math.round(hits.reduce((a, r) => a + (r.rt || 0), 0) / hits.length)
        : null,
      trials: totalTrials,
    };
    onSessionComplete(session);
  }

  if (phase === 'intro') {
    return (
      <div className="max-w-md mx-auto px-4 py-8 flex flex-col items-center text-center gap-4">
        <h2 className="text-2xl font-semibold text-text">Saccade Sprint</h2>
        <p className="text-text-soft text-sm leading-relaxed">
          A target character will flash at random positions across the screen. Tap it as fast as you can to train rapid ocular fixations — {totalTrials} rounds.
        </p>
        <button
          className="btn btn-primary btn-block mt-2"
          onClick={() => {
            setTrial(0);
            setResults([]);
            setPhase('running');
          }}
        >
          Start Sprint
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
        <div className="flex items-center justify-between mb-3">
          <div className="pill">
            Round {Math.min(trial + 1, totalTrials)} / {totalTrials}
          </div>
          <button className="btn btn-icon btn-ghost" onClick={onExit}>
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="relative w-full aspect-[4/3] bg-graphite border border-line rounded-2xl overflow-hidden touch-none">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2.5 h-2.5 rounded-full bg-phosphor/40" />

          {trial < totalTrials && (
            <button
              onClick={tapTarget}
              style={{ left: `${pos.x}%`, top: `${pos.y}%` }}
              className="absolute -translate-x-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-brass text-brass-ink font-mono font-bold text-lg flex items-center justify-center border-none shadow-lg cursor-pointer transition-transform active:scale-95"
            >
              {char}
            </button>
          )}
        </div>
      </div>
    );
  }

  if (phase === 'result') {
    const hits = results.filter(r => r.hit);
    const accuracy = Math.round((hits.length / totalTrials) * 100);
    const avgRt = hits.length
      ? Math.round(hits.reduce((a, r) => a + (r.rt || 0), 0) / hits.length)
      : null;
    const note = adaptiveNote(accuracy, null);

    return (
      <div className="max-w-md mx-auto px-4 py-6">
        <div className="card flex flex-col items-center text-center gap-4">
          <div className="grid grid-cols-2 gap-3 w-full">
            <StatCard label="Accuracy" value={`${accuracy}%`} />
            <StatCard label="Avg Reaction" value={avgRt ? `${avgRt} ms` : '—'} />
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
