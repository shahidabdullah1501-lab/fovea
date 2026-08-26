import { Badge } from '../types';

export const BADGES: Badge[] = [
  {
    id: 'first',
    name: 'First Session',
    emoji: '🏆',
    test: (_p, s) => s.length >= 1
  },
  {
    id: 'streak7',
    name: '7-Day Streak',
    emoji: '🔥',
    test: (p, _s) => (p.streak || 0) >= 7
  },
  {
    id: 'wpm500',
    name: '500 WPM',
    emoji: '⚡',
    test: (_p, s) => s.some(x => x.type === 'read' && (x.wpm || 0) >= 500 && (x.comprehension || 0) >= 70)
  },
  {
    id: 'words10k',
    name: '10,000 Words',
    emoji: '📚',
    test: (_p, s) => s.filter(x => x.type === 'read').reduce((a, x) => a + (x.wordCount || 0), 0) >= 10000
  },
  {
    id: 'acc95',
    name: '95% Accuracy',
    emoji: '🎯',
    test: (_p, s) => s.some(x => (x.accuracy ?? x.comprehension ?? 0) >= 95)
  },
  {
    id: 'sessions30',
    name: '30 Sessions',
    emoji: '🧠',
    test: (_p, s) => s.length >= 30
  }
];
