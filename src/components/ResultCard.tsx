import React from 'react';
import { TrainingSession } from '../types';
import { StatCard } from './StatCard';

interface ResultCardProps {
  session: TrainingSession;
  onDone: () => void;
}

export const ResultCard: React.FC<ResultCardProps> = ({ session, onDone }) => {
  return (
    <div className="card flex flex-col items-center text-center gap-4 max-w-md mx-auto my-6">
      {session.isBaseline && <div className="pill warm">Your Baseline Session</div>}

      <div className="grid grid-cols-2 gap-3 w-full mt-2">
        <StatCard label="Speed" value={session.wpm ? `${session.wpm} WPM` : '—'} />
        <StatCard
          label="Comprehension"
          value={session.comprehension != null ? `${session.comprehension}%` : '—'}
        />
      </div>

      {session.effectiveWpm != null && (
        <div className="w-full">
          <StatCard label="Effective WPM" value={session.effectiveWpm} />
        </div>
      )}

      {session.adaptiveNote && (
        <div className="pill accent text-xs px-3 py-1.5">{session.adaptiveNote}</div>
      )}

      <button className="btn btn-primary btn-block mt-2" onClick={onDone}>
        Done &amp; Return
      </button>
    </div>
  );
};
