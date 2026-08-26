import React, { useState } from 'react';
import { explainWord } from '../services/aiService';
import { HelpCircle, X, Loader2 } from 'lucide-react';

interface WordHelperModalProps {
  context: string;
}

export const WordHelperModal: React.FC<WordHelperModalProps> = ({ context }) => {
  const [open, setOpen] = useState(false);
  const [word, setWord] = useState('');
  const [answer, setAnswer] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  async function handleAsk() {
    if (!word.trim()) return;
    setLoading(true);
    setErr(null);
    setAnswer(null);
    try {
      const res = await explainWord(word.trim(), context.slice(0, 400));
      setAnswer(res);
    } catch (e) {
      setErr("Couldn't fetch an explanation right now.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="inline-flex items-center gap-1.5 text-xs text-phosphor hover:underline cursor-pointer bg-transparent border-none p-0 font-sans"
      >
        <HelpCircle className="w-3.5 h-3.5" />
        <span>Ask about a word in this passage</span>
      </button>

      {open && (
        <div
          className="fixed inset-0 bg-black/60 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4"
          onClick={() => setOpen(false)}
        >
          <div
            className="bg-panel border border-line rounded-t-2xl sm:rounded-2xl p-6 w-full max-w-md max-h-[82vh] overflow-y-auto"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-text">Explain a Word</h3>
              <button
                onClick={() => setOpen(false)}
                className="p-1 rounded-full text-text-faint hover:text-text hover:bg-panel-2"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <input
              type="text"
              placeholder="e.g. consolidation"
              value={word}
              onChange={e => setWord(e.target.value)}
              className="w-full rounded-xl border border-line bg-panel-2 px-4 py-2.5 text-sm text-text placeholder-text-faint outline-none focus:border-brass focus:ring-1 focus:ring-brass"
            />

            <button
              onClick={handleAsk}
              disabled={loading || !word.trim()}
              className="btn btn-primary btn-block mt-3"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Thinking…</span>
                </>
              ) : (
                'Explain Word'
              )}
            </button>

            {err && <div className="text-danger text-xs mt-3">{err}</div>}
            {answer && (
              <div className="card-2 mt-4 text-sm leading-relaxed text-text">
                {answer}
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};
