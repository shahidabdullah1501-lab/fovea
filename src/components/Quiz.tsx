import React, { useState } from 'react';
import { Question } from '../types';

interface QuizProps {
  questions: Question[];
  onDone: (scorePct: number) => void;
}

export const Quiz: React.FC<QuizProps> = ({ questions, onDone }) => {
  const [i, setI] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [correctCount, setCorrectCount] = useState(0);

  const q = questions[i];

  function handlePick(oi: number) {
    if (selected !== null) return;
    setSelected(oi);
    if (oi === q.correctIndex) {
      setCorrectCount(c => c + 1);
    }
  }

  function handleNext() {
    if (i < questions.length - 1) {
      setI(i + 1);
      setSelected(null);
    } else {
      const finalCount = selected === q.correctIndex ? correctCount : correctCount;
      onDone(Math.round((finalCount / questions.length) * 100));
    }
  }

  return (
    <div className="max-w-xl mx-auto px-4 py-6">
      <div className="text-text-soft text-xs mb-2">
        Question {i + 1} of {questions.length}
      </div>

      <div className="quiz-card">
        <h3 className="text-lg font-semibold mb-4 leading-snug">{q.question}</h3>

        <div className="space-y-2">
          {q.options.map((opt, oi) => {
            let cls = 'quiz-option';
            if (selected !== null) {
              if (oi === q.correctIndex) cls += ' correct';
              else if (oi === selected) cls += ' incorrect';
            } else if (oi === selected) {
              cls += ' selected';
            }

            return (
              <button
                key={oi}
                className={cls}
                disabled={selected !== null}
                onClick={() => handlePick(oi)}
              >
                {opt}
              </button>
            );
          })}
        </div>

        {selected !== null && q.explanation && (
          <div className="mt-3 text-xs text-[#5B5346] leading-relaxed">
            {q.explanation}
          </div>
        )}

        {selected !== null && (
          <button className="btn btn-primary btn-block mt-4" onClick={handleNext}>
            {i < questions.length - 1 ? 'Next Question' : 'See Results'}
          </button>
        )}
      </div>
    </div>
  );
};
