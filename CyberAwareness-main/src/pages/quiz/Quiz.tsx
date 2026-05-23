import { useState } from 'react';
import { QuizCard, QuizShell } from './QuizShell';

const question = {
  text: 'Which of the following is a sign of a phishing email?',
  options: [
    { key: 'A', text: 'Personalized greeting with your full name', correct: false },
    { key: 'B', text: "Sent from your company's verified domain", correct: false },
    { key: 'C', text: 'Urgent language plus a mismatched sender URL', correct: true },
    { key: 'D', text: 'Contains a calendar invite with correct details', correct: false },
  ],
};

export default function Quiz() {
  const [selected, setSelected] = useState<string | null>(null);
  const selectedOption = question.options.find((option) => option.key === selected);

  return (
    <QuizShell>
      <QuizCard className="mx-auto max-w-3xl transition-colors duration-300">
        <p className="mb-3 text-xs font-semibold uppercase tracking-[0.25em] text-cyan-600 dark:text-cyan-300">Daily question</p>
        <h1 className="mb-6 text-2xl font-bold text-gray-900 dark:text-white">{question.text}</h1>
        <div className="space-y-3">
          {question.options.map((option) => {
            const answered = selected !== null;
            const stateClass = answered
              ? option.correct
                ? 'border-emerald-400/50 bg-emerald-400/10 text-emerald-700 dark:text-emerald-200'
                : selected === option.key
                  ? 'border-red-400/50 bg-red-400/10 text-red-700 dark:text-red-200'
                  : 'border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-950/60 text-gray-700 dark:text-gray-300'
              : 'border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-950/60 text-gray-700 dark:text-gray-300 hover:border-cyan-400/40 dark:hover:border-cyan-500/40';

            return (
              <button
                key={option.key}
                className={`flex w-full items-center gap-3 rounded-lg border p-4 text-left text-sm transition ${stateClass}`}
                disabled={answered}
                onClick={() => setSelected(option.key)}
              >
                <span className="grid h-7 w-7 place-items-center rounded bg-gray-200 text-gray-900 dark:bg-gray-700 dark:text-white font-bold">{option.key}</span>
                {option.text}
              </button>
            );
          })}
        </div>
        {selectedOption && (
          <p className={`mt-5 text-sm ${selectedOption.correct ? 'text-emerald-700 dark:text-emerald-300' : 'text-red-700 dark:text-red-300'} transition-colors duration-300`}>
            {selectedOption.correct ? 'Correct. Urgency plus mismatched URLs is a classic phishing signal.' : 'Not quite. Look for urgency plus mismatched sender URLs.'}
          </p>
        )}
      </QuizCard>
    </QuizShell>
  );
}
