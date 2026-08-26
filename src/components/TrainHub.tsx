import React from 'react';
import { TrainingSession, SessionType } from '../types';
import { SaccadeTrainer } from './SaccadeTrainer';
import { SchulteTable } from './SchulteTable';
import { Eye, Grid } from 'lucide-react';

interface TrainHubProps {
  sub: SessionType | null;
  onPick: {
    go: (s: SessionType) => void;
    onComplete: (session: TrainingSession) => void;
  };
  onExit: () => void;
}

export const TrainHub: React.FC<TrainHubProps> = ({ sub, onPick, onExit }) => {
  if (sub === 'saccade') {
    return <SaccadeTrainer onSessionComplete={onPick.onComplete} onExit={onExit} />;
  }
  if (sub === 'schulte') {
    return <SchulteTable onSessionComplete={onPick.onComplete} onExit={onExit} />;
  }

  return (
    <div className="max-w-xl mx-auto px-4 py-6">
      <h2 className="text-2xl font-semibold text-text">Cognitive Focus Drills</h2>
      <p className="text-text-soft text-sm mt-1 mb-6">
        Targeted exercises designed to widen your perceptual span and accelerate visual motor responses.
      </p>

      <button
        onClick={() => onPick.go('saccade')}
        className="card w-full text-left p-5 mb-3 border border-line hover:border-text-soft transition-colors cursor-pointer block"
      >
        <div className="flex items-center gap-3 mb-2">
          <Eye className="w-5 h-5 text-brass" />
          <div className="font-bold text-text text-base">Saccade Sprint</div>
        </div>
        <p className="text-text-soft text-xs leading-relaxed">
          Shift focus rapidly between flashing character targets — 15 precision rounds measuring reaction time.
        </p>
      </button>

      <button
        onClick={() => onPick.go('schulte')}
        className="card w-full text-left p-5 border border-line hover:border-text-soft transition-colors cursor-pointer block"
      >
        <div className="flex items-center gap-3 mb-2">
          <Grid className="w-5 h-5 text-phosphor" />
          <div className="font-bold text-text text-base">Schulte Table</div>
        </div>
        <p className="text-text-soft text-xs leading-relaxed">
          Locate numbers sequentially on a randomized grid using peripheral vision while keeping central gaze fixed.
        </p>
      </button>
    </div>
  );
};
