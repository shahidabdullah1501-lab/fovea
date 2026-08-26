import React, { useState } from 'react';
import { UserProfile, TrainingSession } from '../types';
import { StatCard } from './StatCard';
import { Disclaimer } from './Disclaimer';

interface ProfileViewProps {
  profile: UserProfile;
  sessions: TrainingSession[];
  onReset: () => void;
}

const GOAL_LABEL: Record<string, string> = {
  faster: 'Read faster (WPM Boost)',
  comprehension: 'Improve comprehension accuracy',
  attention: 'Sharpen rapid visual fixations',
  focus: 'Enhance peripheral awareness',
};

export const ProfileView: React.FC<ProfileViewProps> = ({ profile, sessions, onReset }) => {
  const [confirming, setConfirming] = useState(false);

  return (
    <div className="max-w-xl mx-auto px-4 py-6">
      <h2 className="text-2xl font-semibold text-text">Account &amp; Settings</h2>

      <div className="card mt-4 mb-3">
        <div className="grid grid-cols-2 gap-3">
          <StatCard label="Total Sessions" value={sessions.length} />
          <StatCard label="Longest Streak" value={`${profile.streak || 0} Days`} />
        </div>
      </div>

      <div className="card mb-3">
        <div className="text-[10.5px] font-bold tracking-widest uppercase text-text-faint mb-1">
          Active Goal
        </div>
        <div className="text-sm font-medium text-text">
          {GOAL_LABEL[profile.goal] || 'Not configured'}
        </div>
      </div>

      <div className="card mb-4">
        <div className="text-[10.5px] font-bold tracking-widest uppercase text-text-faint mb-1">
          Data Management
        </div>
        <p className="text-text-soft text-xs mb-3">
          Your training data and streaks are saved locally on your device.
        </p>

        {!confirming ? (
          <button className="btn btn-ghost btn-block" onClick={() => setConfirming(true)}>
            Reset All Local Data
          </button>
        ) : (
          <div className="space-y-2">
            <p className="text-xs text-danger font-medium">
              This will permanently erase all session records and badges. Are you sure?
            </p>
            <div className="flex gap-2">
              <button className="btn btn-ghost flex-1" onClick={() => setConfirming(false)}>
                Cancel
              </button>
              <button className="btn btn-danger flex-1" onClick={onReset}>
                Confirm Erase
              </button>
            </div>
          </div>
        )}
      </div>

      <Disclaimer />
    </div>
  );
};
