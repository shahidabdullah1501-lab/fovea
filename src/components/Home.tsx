import React, { useMemo } from 'react';
import { UserProfile, TrainingSession, ViewType, SessionType } from '../types';
import { levelFromXP, xpIntoLevel, recommendExercise } from '../utils/helpers';
import { StatCard } from './StatCard';
import { ProgressBar } from './ProgressBar';
import { Flame } from 'lucide-react';

interface HomeProps {
  profile: UserProfile;
  sessions: TrainingSession[];
  onNavigate: (view: ViewType, sub?: SessionType) => void;
}

export const Home: React.FC<HomeProps> = ({ profile, sessions, onNavigate }) => {
  const last7 = useMemo(() => {
    const days: { key: string; done: boolean }[] = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const key = `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`;
      days.push({ key, done: sessions.some(s => s.date === key) });
    }
    return days;
  }, [sessions]);

  const readSessions = sessions.filter(s => s.type === 'read' && s.comprehension != null);
  const lastRead = readSessions[readSessions.length - 1];
  const rec = recommendExercise(profile, sessions);
  const xp = profile.xp || 0;

  return (
    <div className="max-w-xl mx-auto px-4 py-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <div className="text-[10.5px] font-bold tracking-widest uppercase text-text-faint">
            Fovea
          </div>
          <h2 className="text-2xl font-semibold text-text mt-0.5">Today's Dashboard</h2>
        </div>
        <div className="pill warm flex items-center gap-1">
          <Flame className="w-3.5 h-3.5 text-signal" />
          <span>{profile.streak || 0} Day Streak</span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 mt-4">
        <StatCard label="Reading Speed" value={lastRead?.wpm ? `${lastRead.wpm} WPM` : '—'} />
        <StatCard
          label="Comprehension"
          value={lastRead?.comprehension != null ? `${lastRead.comprehension}%` : '—'}
        />
      </div>

      <div className="card mt-3">
        <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-wider text-text-faint">
          <span>Level {levelFromXP(xp)}</span>
          <span>{xpIntoLevel(xp)} / 120 XP</span>
        </div>
        <div className="mt-2.5">
          <ProgressBar pct={(xpIntoLevel(xp) / 120) * 100} heightClass="h-2" />
        </div>
      </div>

      <div className="card mt-3">
        <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-wider text-text-faint mb-2.5">
          <span>This Week's Activity</span>
          <span>{last7.filter(d => d.done).length} / 7 Days</span>
        </div>
        <div className="grid grid-cols-7 gap-1.5">
          {last7.map(d => (
            <div
              key={d.key}
              className={`w-full aspect-square rounded-md transition-colors ${
                d.done ? 'bg-brass' : 'bg-panel-2'
              }`}
            />
          ))}
        </div>
      </div>

      <div className="card mt-3">
        <div className="text-[10.5px] font-bold tracking-widest uppercase text-text-faint">
          Recommended Exercise
        </div>
        <p className="text-text-soft text-xs mt-1 mb-4">{rec.reason}</p>
        <button
          className="btn btn-primary btn-block"
          onClick={() => onNavigate(rec.type === 'read' ? 'read' : 'train', rec.type)}
        >
          {rec.type === 'read'
            ? 'Start Speed Reading Session'
            : rec.type === 'saccade'
            ? 'Start Saccade Sprint'
            : 'Start Schulte Table'}
        </button>
      </div>
    </div>
  );
};
