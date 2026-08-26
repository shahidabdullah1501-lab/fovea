import React, { useState, useEffect, useMemo } from 'react';
import { UserProfile, TrainingSession, Question } from '../types';
import { PASSAGES } from '../data/passages';
import { tokenize, delayForChunk, adaptiveNote, todayStr } from '../utils/helpers';
import { generateQuiz } from '../services/aiService';
import { WordHelperModal } from './WordHelperModal';
import { Quiz } from './Quiz';
import { ResultCard } from './ResultCard';
import { ProgressBar } from './ProgressBar';
import { Play, Pause, X, Loader2 } from 'lucide-react';

interface RSVPReaderProps {
  profile: UserProfile;
  onSessionComplete: (session: TrainingSession) => void;
}

export const RSVPReader: React.FC<RSVPReaderProps> = ({ profile, onSessionComplete }) => {
  const [phase, setPhase] = useState<'setup' | 'playing' | 'quiz' | 'result'>('setup');
  const [source, setSource] = useState<'library' | 'paste'>('library');
  const [passageId, setPassageId] = useState(PASSAGES[0].id);
  const [pastedText, setPastedText] = useState('');
  const [wpm, setWpm] = useState(profile.suggestedWpm || (profile.baseline ? profile.baseline.wpm : 300));
  const [chunkSize, setChunkSize] = useState(1);
  const [idx, setIdx] = useState(0);
  const [playing, setPlaying] = useState(false);

  const [quiz, setQuiz] = useState<Question[] | null>(null);
  const [quizError, setQuizError] = useState<string | null>(null);
  const [quizLoading, setQuizLoading] = useState(false);
  const [result, setResult] = useState<TrainingSession | null>(null);

  const activePassage = source === 'library' ? PASSAGES.find(p => p.id === passageId) || PASSAGES[0] : null;
  const text = source === 'library' ? activePassage?.text || '' : pastedText;

  const { words, chunks } = useMemo(() => tokenize(text || '', chunkSize), [text, chunkSize]);

  useEffect(() => {
    if (phase !== 'playing' || !playing) return;
    if (idx >= chunks.length) {
      finishReading();
      return;
    }
    const t = setTimeout(() => setIdx(i => i + 1), delayForChunk(chunks[idx], wpm, chunkSize));
    return () => clearTimeout(t);
  }, [phase, playing, idx, chunks, wpm, chunkSize]);

  function startReading() {
    if (!text || !text.trim()) return;
    setIdx(0);
    setPlaying(true);
    setPhase('playing');
  }

  async function finishReading() {
    setPlaying(false);
    if (source === 'library' && activePassage) {
      setQuiz(activePassage.questions);
      setPhase('quiz');
    } else {
      setQuizLoading(true);
      setQuizError(null);
      setPhase('quiz');
      try {
        const generated = await generateQuiz(text);
        setQuiz(generated);
      } catch (e) {
        setQuizError("Couldn't generate questions for this custom text.");
      } finally {
        setQuizLoading(false);
      }
    }
  }

  function handleQuizDone(scorePct: number) {
    const isBaseline = !profile.baseline;
    const note = adaptiveNote(null, scorePct);
    const session: TrainingSession = {
      id: 's' + Date.now(),
      type: 'read',
      date: todayStr(),
      wpm,
      chunkSize,
      wordCount: words.length,
      comprehension: scorePct,
      effectiveWpm: Math.round(wpm * (scorePct / 100)),
      isBaseline,
      passage: source === 'library' ? activePassage?.title : 'Custom text',
      adaptiveNote: note.text,
      adaptiveDir: note.dir,
    };
    setResult(session);
    setPhase('result');
    onSessionComplete(session);
  }

  function skipQuiz() {
    const session: TrainingSession = {
      id: 's' + Date.now(),
      type: 'read',
      date: todayStr(),
      wpm,
      chunkSize,
      wordCount: words.length,
      comprehension: null,
      effectiveWpm: null,
      isBaseline: !profile.baseline,
      passage: 'Custom text',
    };
    setResult(session);
    setPhase('result');
    onSessionComplete(session);
  }

  if (phase === 'setup') {
    return (
      <div className="max-w-xl mx-auto px-4 py-6">
        <div className="text-text-faint text-[10.5px] font-bold tracking-widest uppercase mb-1">
          Speed Reading
        </div>
        <h2 className="text-2xl font-semibold text-text">RSVP Speed Trainer</h2>
        <p className="text-text-soft text-sm mt-1 mb-6">
          Words are flashed one chunk at a time so your eyes stay centered on a single focal point.
        </p>

        <div className="card flex flex-col gap-5">
          <div className="flex gap-2">
            <button
              className={`btn btn-sm ${source === 'library' ? 'btn-primary' : 'btn-ghost'}`}
              onClick={() => setSource('library')}
            >
              Library
            </button>
            <button
              className={`btn btn-sm ${source === 'paste' ? 'btn-primary' : 'btn-ghost'}`}
              onClick={() => setSource('paste')}
            >
              Paste Custom Text
            </button>
          </div>

          {source === 'library' ? (
            <div className="space-y-2">
              {PASSAGES.map(p => (
                <button
                  key={p.id}
                  className={`option-dark ${passageId === p.id ? 'selected' : ''}`}
                  onClick={() => setPassageId(p.id)}
                >
                  <div className="font-bold text-text">{p.title}</div>
                  <div className="text-xs text-text-faint mt-1">
                    {p.category} · {p.level} · ~{p.text.split(/\s+/).length} words
                  </div>
                </button>
              ))}
            </div>
          ) : (
            <div>
              <textarea
                rows={6}
                placeholder="Paste an article, report, or any passage here…"
                value={pastedText}
                onChange={e => setPastedText(e.target.value)}
                className="w-full rounded-xl border border-line bg-panel-2 p-3 text-sm text-text placeholder-text-faint resize-y"
              />
              <div className="text-xs text-text-faint mt-1.5">
                AI will generate a comprehension quiz for your pasted content.
              </div>
            </div>
          )}

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[10.5px] font-bold tracking-wider uppercase text-text-faint">
                Target Speed
              </span>
              <span className="pill accent">{wpm} WPM</span>
            </div>
            <input
              type="range"
              min="100"
              max="900"
              step="10"
              value={wpm}
              onChange={e => setWpm(+e.target.value)}
              className="w-full h-1 bg-line rounded-lg appearance-none cursor-pointer accent-brass"
            />
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[10.5px] font-bold tracking-wider uppercase text-text-faint">
                Words per Flash
              </span>
              <span className="pill accent">{chunkSize}</span>
            </div>
            <input
              type="range"
              min="1"
              max="4"
              step="1"
              value={chunkSize}
              onChange={e => setChunkSize(+e.target.value)}
              className="w-full h-1 bg-line rounded-lg appearance-none cursor-pointer accent-brass"
            />
          </div>

          {text && text.trim() && <WordHelperModal context={text} />}

          <button
            className="btn btn-primary btn-block mt-2"
            onClick={startReading}
            disabled={!text || !text.trim()}
          >
            Start Reading Session
          </button>
        </div>
      </div>
    );
  }

  if (phase === 'playing') {
    return (
      <div className="max-w-xl mx-auto px-4 py-6">
        <div className="flex items-center justify-between mb-4">
          <button
            className="btn btn-icon btn-ghost"
            onClick={() => {
              setPlaying(false);
              setPhase('setup');
            }}
          >
            <X className="w-4 h-4" />
          </button>
          <div className="pill accent">{wpm} WPM</div>
        </div>

        <div className="rsvp-frame">
          <div className="rsvp-aperture relative">
            <div className="absolute top-2.5 left-1/2 -translate-x-1/2 w-[1.5px] h-3 bg-ink/30" />
            <div
              className={`absolute top-3 right-3.5 w-2 h-2 rounded-full bg-signal ${
                playing ? 'animate-ping' : 'opacity-40'
              }`}
            />
            <div className="rsvp-word">{chunks[idx] || ''}</div>
          </div>
        </div>

        <div className="mt-4">
          <ProgressBar pct={(idx / chunks.length) * 100} />
        </div>

        <div className="flex items-center justify-between mt-4">
          <button
            className="btn btn-ghost btn-icon"
            onClick={() => setPlaying(p => !p)}
          >
            {playing ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
          </button>
          <div className="text-xs text-text-faint font-mono">
            {idx} / {chunks.length} chunks
          </div>
        </div>
      </div>
    );
  }

  if (phase === 'quiz') {
    if (quizLoading) {
      return (
        <div className="max-w-md mx-auto px-4 py-16 text-center flex flex-col items-center gap-4">
          <Loader2 className="w-8 h-8 text-brass animate-spin" />
          <div className="text-text-soft text-sm">Generating your AI comprehension quiz…</div>
        </div>
      );
    }
    if (quizError || !quiz) {
      return (
        <div className="max-w-md mx-auto px-4 py-16 text-center flex flex-col items-center gap-4">
          <div className="text-text-soft text-sm">{quizError || 'Unable to load quiz.'}</div>
          <button className="btn btn-ghost" onClick={skipQuiz}>
            Skip quiz &amp; log session speed
          </button>
        </div>
      );
    }
    return <Quiz questions={quiz} onDone={handleQuizDone} />;
  }

  if (phase === 'result' && result) {
    return (
      <div className="max-w-xl mx-auto px-4 py-6">
        <ResultCard session={result} onDone={() => setPhase('setup')} />
      </div>
    );
  }

  return null;
};
