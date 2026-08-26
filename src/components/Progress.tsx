import React from 'react';
import { UserProfile, TrainingSession } from '../types';
import { BADGES } from '../data/badges';
import { StatCard } from './StatCard';
import { LineChart } from './LineChart';

interface ProgressProps {
  profile: UserProfile;
  sessions: TrainingSession[];
}

export const Progress: React.FC<ProgressProps> = ({ profile, sessions }) => {
  const reads = sessions.filter(s => s.type === 'read' && s.comprehension != null);
  const bestWpm = reads.length ? Math.max(...reads.map(s => s.wpm || 0)) : null;
  const bestComp = reads.length ? Math.max(...reads.map(s => s.comprehension || 0)) : null;

  return (
    <div className="max-w-xl mx-auto px-4 py-6">
      <h2 className="text-2xl font-semibold text-text">Performance Analytics</h2>
      <p className="text-text-soft text-sm mt-1 mb-6">
        {sessions.length} total cognitive sessions logged
      </p>

      <div className="card mb-3">
        <div className="text-[10.5px] font-bold tracking-widest uppercase text-text-faint mb-2">
          Reading Speed Trend (WPM)
        </div>
        <LineChart points={reads.map(s => ({ value: s.wpm || 0 }))} color="#C68A3D" />
      </div>

      <div className="card mb-3">
        <div className="text-[10.5px] font-bold tracking-widest uppercase text-text-faint mb-2">
          Comprehension Trend (%)
        </div>
        <LineChart points={reads.map(s => ({ value: s.comprehension || 0 }))} color="#4FBFC4" />
      </div>

      <div className="grid grid-cols-2 gap-3 mb-3">
        <StatCard label="Peak Speed" value={bestWpm ? `${bestWpm} WPM` : '—'} />
        <StatCard label="Peak Comprehension" value={bestComp ? `${bestComp}%` : '—'} />
      </div>

      <div className="card">
        <div className="text-[10.5px] font-bold tracking-widest uppercase text-text-faint mb-3">
          Achievements &amp; Badges
        </div>
        <div className="grid grid-cols-3 gap-2.5">
          {BADGES.map(b => {
            const earned = b.test(profile, sessions);
            return (
              <div
                key={b.id}
                className={`flex flex-col items-center gap-1.5 p-3 rounded-xl bg-panel-2 text-center transition-opacity ${
                  earned ? 'opacity-100 border border-brass/30' : 'opacity-30 grayscale'
                }`}
              >
                <div className="text-2xl">{b.emoji}</div>
                <div className="text-[10.5px] font-semibold text-text-soft">{b.name}</div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
