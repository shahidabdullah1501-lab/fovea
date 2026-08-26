import { UserProfile, TrainingSession, AdaptiveFeedback, Recommendation, SessionType } from '../types';

export function todayStr(): string {
  const d = new Date();
  return `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`;
}

export function daysBetween(a: string, b: string): number {
  return Math.round((new Date(b).getTime() - new Date(a).getTime()) / 86400000);
}

export function applyStreak(profile: UserProfile): UserProfile {
  const today = todayStr();
  if (!profile.lastSessionDate) {
    return { ...profile, streak: 1, lastSessionDate: today };
  }
  if (profile.lastSessionDate === today) return profile;

  const gap = daysBetween(profile.lastSessionDate.replace(/-/g, '/'), today.replace(/-/g, '/'));
  if (gap === 1) {
    return { ...profile, streak: (profile.streak || 0) + 1, lastSessionDate: today };
  }
  return { ...profile, streak: 1, lastSessionDate: today };
}

export function xpForSession(session: TrainingSession): number {
  const quality = session.comprehension ?? session.accuracy ?? 70;
  return Math.round(15 + quality * 0.25);
}

export function levelFromXP(xp: number): number {
  return Math.floor(xp / 120) + 1;
}

export function xpIntoLevel(xp: number): number {
  return xp % 120;
}

export function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export function tokenize(text: string, chunkSize: number): { words: string[]; chunks: string[] } {
  const words = text.trim().split(/\s+/).filter(Boolean);
  const chunks: string[] = [];
  for (let i = 0; i < words.length; i += chunkSize) {
    chunks.push(words.slice(i, i + chunkSize).join(' '));
  }
  return { words, chunks };
}

export function delayForChunk(chunk: string, wpm: number, chunkSize: number): number {
  const base = (60000 / wpm) * chunkSize;
  if (/[.!?]$/.test(chunk)) return base * 1.6;
  if (/[,;:]$/.test(chunk)) return base * 1.25;
  return base;
}

export function adaptiveNote(accuracy: number | null, comprehension: number | null): AdaptiveFeedback {
  const a = accuracy ?? 100;
  const c = comprehension ?? 100;
  if (a > 90 && c > 85) {
    return { dir: 'up', text: 'Strong control — stepping up slightly next time.' };
  }
  if (a < 70 || c < 70) {
    return { dir: 'down', text: 'Dialing back a notch to rebuild accuracy.' };
  }
  return { dir: 'same', text: 'Holding steady at this level.' };
}

export function recommendExercise(profile: UserProfile, sessions: TrainingSession[]): Recommendation {
  if (sessions.length === 0) {
    return { type: 'read', reason: 'Start with a baseline reading session.' };
  }

  const counts: Record<SessionType, number> = { read: 0, saccade: 0, schulte: 0 };
  sessions.forEach(s => {
    counts[s.type] = (counts[s.type] || 0) + 1;
  });

  const goalMap: Record<string, SessionType> = {
    faster: 'read',
    comprehension: 'read',
    attention: 'saccade',
    focus: 'schulte'
  };

  const preferred = goalMap[profile.goal] || 'read';
  const sortedByCount = (Object.entries(counts) as [SessionType, number][]).sort((a, b) => a[1] - b[1]);
  const least = sortedByCount[0][0];

  const type = counts[preferred] <= counts[least] + 1 ? preferred : least;
  const reason =
    type === 'read'
      ? 'Keep building reading speed and comprehension together.'
      : type === 'saccade'
      ? 'Sharpen quick visual targeting.'
      : 'Train visual search and peripheral awareness.';

  return { type, reason };
}
