import React from 'react';

interface ProgressBarProps {
  pct: number;
  heightClass?: string;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({ pct, heightClass = 'h-1.5' }) => {
  const clamped = Math.min(100, Math.max(0, pct));
  return (
    <div className={`w-full bg-line rounded-full overflow-hidden ${heightClass}`}>
      <div
        className="h-full bg-brass rounded-full transition-all duration-150 ease-linear"
        style={{ width: `${clamped}%` }}
      />
    </div>
  );
};
