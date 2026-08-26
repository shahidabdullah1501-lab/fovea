export type GoalType = 'faster' | 'comprehension' | 'attention' | 'focus';
export type DifficultyType = 'easy' | 'medium' | 'hard';
export type SessionType = 'read' | 'saccade' | 'schulte';
export type ViewType = 'home' | 'read' | 'train' | 'progress' | 'profile' | 'onboarding';

export interface Question {
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface Passage {
  id: string;
  title: string;
  category: string;
  level: string;
  text: string;
  questions: Question[];
}

export interface TrainingSession {
  id: string;
  type: SessionType;
  date: string;
  wpm?: number;
  chunkSize?: number;
  wordCount?: number;
  comprehension?: number | null;
  effectiveWpm?: number | null;
  isBaseline?: boolean;
  passage?: string;
  adaptiveNote?: string;
  adaptiveDir?: 'up' | 'down' | 'same';
  accuracy?: number;
  reactionTime?: number | null;
  trials?: number;
  timeMs?: number;
  size?: number;
  errors?: number;
}

export interface UserProfile {
  onboarded: boolean;
  goal: GoalType;
  dailyTime: number;
  difficulty: DifficultyType;
  xp: number;
  streak: number;
  lastSessionDate: string | null;
  baseline: {
    wpm: number;
    comprehension: number;
  } | null;
  suggestedWpm: number | null;
}

export interface Badge {
  id: string;
  name: string;
  emoji: string;
  test: (profile: UserProfile, sessions: TrainingSession[]) => boolean;
}

export interface AdaptiveFeedback {
  dir: 'up' | 'down' | 'same';
  text: string;
}

export interface Recommendation {
  type: SessionType;
  reason: string;
}
