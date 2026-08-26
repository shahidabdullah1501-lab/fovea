import React, { useState, useEffect } from 'react';
import { UserProfile, TrainingSession, ViewType, SessionType, GoalType, DifficultyType } from './types';
import { loadJSON, saveJSON } from './utils/storage';
import { xpForSession, applyStreak } from './utils/helpers';
import { Sidebar } from './components/Sidebar';
import { BottomNav } from './components/BottomNav';
import { Onboarding } from './components/Onboarding';
import { Home } from './components/Home';
import { RSVPReader } from './components/RSVPReader';
import { TrainHub } from './components/TrainHub';
import { Progress } from './components/Progress';
import { ProfileView } from './components/ProfileView';

export const App: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [sessions, setSessions] = useState<TrainingSession[]>([]);
  const [view, setView] = useState<ViewType>('home');
  const [trainSub, setTrainSub] = useState<SessionType | null>(null);

  useEffect(() => {
    (async () => {
      const [p, s] = await Promise.all([
        loadJSON<UserProfile | null>('profile', null),
        loadJSON<TrainingSession[]>('sessions', []),
      ]);
      setProfile(p);
      setSessions(s || []);
      setView(p && p.onboarded ? 'home' : 'onboarding');
      setLoading(false);
    })();
  }, []);

  async function finishOnboarding(data: { goal: GoalType; dailyTime: number; difficulty: DifficultyType }) {
    const p: UserProfile = {
      ...data,
      onboarded: true,
      xp: 0,
      streak: 0,
      lastSessionDate: null,
      baseline: null,
      suggestedWpm: null,
    };
    setProfile(p);
    await saveJSON('profile', p);
    setView('read');
  }

  async function recordSession(session: TrainingSession) {
    const newSessions = [...sessions, session];
    setSessions(newSessions);
    await saveJSON('sessions', newSessions);

    if (!profile) return;
    let p = { ...profile };

    if (session.type === 'read') {
      if (!p.baseline) {
        p.baseline = { wpm: session.wpm || 300, comprehension: session.comprehension || 70 };
      }
      let sw = session.wpm || 300;
      if (session.adaptiveDir === 'up') sw = Math.min(900, sw + 20);
      else if (session.adaptiveDir === 'down') sw = Math.max(100, sw - 30);
      p.suggestedWpm = sw;
    }

    p.xp = (p.xp || 0) + xpForSession(session);
    p = applyStreak(p);
    setProfile(p);
    await saveJSON('profile', p);
  }

  async function resetAll() {
    setSessions([]);
    await saveJSON('sessions', []);
    if (!profile) return;
    const p: UserProfile = {
      ...profile,
      xp: 0,
      streak: 0,
      lastSessionDate: null,
      baseline: null,
      suggestedWpm: null,
    };
    setProfile(p);
    await saveJSON('profile', p);
    setView('home');
  }

  function handleNavigate(v: ViewType, sub?: SessionType) {
    setView(v);
    setTrainSub(sub || null);
  }

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <div className="w-8 h-8 rounded-full border-2 border-line border-t-brass animate-spin" />
      </div>
    );
  }

  if (view === 'onboarding' || !profile?.onboarded) {
    return <Onboarding onDone={finishOnboarding} />;
  }

  return (
    <div className="min-h-screen bg-graphite text-text pb-24 lg:pb-8 lg:pl-[216px]">
      <Sidebar currentView={view} onNavigate={v => handleNavigate(v)} />

      <main className="max-w-4xl mx-auto">
        {view === 'home' && (
          <Home
            profile={profile}
            sessions={sessions}
            onNavigate={(v, sub) => handleNavigate(v, sub)}
          />
        )}
        {view === 'read' && (
          <RSVPReader profile={profile} onSessionComplete={recordSession} />
        )}
        {view === 'train' && (
          <TrainHub
            sub={trainSub}
            onPick={{
              go: s => setTrainSub(s),
              onComplete: recordSession,
            }}
            onExit={() => setTrainSub(null)}
          />
        )}
        {view === 'progress' && (
          <Progress profile={profile} sessions={sessions} />
        )}
        {view === 'profile' && (
          <ProfileView profile={profile} sessions={sessions} onReset={resetAll} />
        )}
      </main>

      <BottomNav currentView={view} onNavigate={v => handleNavigate(v)} />
    </div>
  );
};
export default App;
