import React, { useState } from 'react';
import { UserProfile, GoalType, DifficultyType } from '../types';
import { Disclaimer } from './Disclaimer';

interface OnboardingProps {
  onDone: (data: { goal: GoalType; dailyTime: number; difficulty: DifficultyType }) => void;
}

const GOAL_OPTIONS: { key: GoalType; label: string }[] = [
  { key: 'faster', label: 'Read Faster (WPM Boost)' },
  { key: 'comprehension', label: 'Improve Comprehension' },
  { key: 'attention', label: 'Sharpen Rapid Visual Fixations' },
  { key: 'focus', label: 'Enhance Peripheral Awareness & Focus' },
];

export const Onboarding: React.FC<OnboardingProps> = ({ onDone }) => {
  const [step, setStep] = useState(0);
  const [data, setData] = useState<{ goal: GoalType; dailyTime: number; difficulty: DifficultyType }>({
    goal: 'faster',
    dailyTime: 10,
    difficulty: 'medium',
  });

  const steps = ['goal', 'time', 'difficulty'];

  function handleNext() {
    if (step < steps.length - 1) setStep(step + 1);
    else onDone(data);
  }

  return (
    <div className="max-w-md mx-auto px-4 pt-12 pb-8 flex flex-col items-center">
      <div className="text-center mb-6">
        <div className="font-serif italic text-4xl text-brass mb-1">Fovea</div>
        <div className="text-text-soft text-sm">
          Three quick questions to personalize your training baseline.
        </div>
      </div>

      <div className="card w-full">
        {step === 0 && (
          <div>
            <h3 className="text-base font-semibold mb-4 text-text">What is your primary focus goal?</h3>
            {GOAL_OPTIONS.map(g => (
              <button
                key={g.key}
                className={`option-dark ${data.goal === g.key ? 'selected' : ''}`}
                onClick={() => setData({ ...data, goal: g.key })}
              >
                {g.label}
              </button>
            ))}
          </div>
        )}

        {step === 1 && (
          <div>
            <h3 className="text-base font-semibold mb-4 text-text">How much daily time can you commit?</h3>
            {[5, 10, 15, 20].map(m => (
              <button
                key={m}
                className={`option-dark ${data.dailyTime === m ? 'selected' : ''}`}
                onClick={() => setData({ ...data, dailyTime: m })}
              >
                {m} minutes per day
              </button>
            ))}
          </div>
        )}

        {step === 2 && (
          <div>
            <h3 className="text-base font-semibold mb-4 text-text">Preferred starting difficulty?</h3>
            {[
              { k: 'easy', l: 'Easy — gentle pace' },
              { k: 'medium', l: 'Medium — balanced progress' },
              { k: 'hard', l: 'Hard — intense challenge' },
            ].map(o => (
              <button
                key={o.k}
                className={`option-dark ${data.difficulty === o.k ? 'selected' : ''}`}
                onClick={() => setData({ ...data, difficulty: o.k as DifficultyType })}
              >
                {o.l}
              </button>
            ))}
          </div>
        )}

        <button className="btn btn-primary btn-block mt-4" onClick={handleNext}>
          {step < steps.length - 1 ? 'Continue' : 'Start Baseline Assessment'}
        </button>
      </div>

      <Disclaimer className="mt-6" />
    </div>
  );
};
