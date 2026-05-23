import { useState } from 'react';
import { QuizCard, QuizShell } from './QuizShell';

const challenges = [
  {
    title: 'Phishing Detection',
    scenario: 'A message says your bank account will be locked in 20 minutes and asks you to verify through bit.ly/bank-safe.',
    options: ['Safe notification', 'Phishing attempt', 'System update'],
    answer: 'Phishing attempt',
  },
  {
    title: 'Password Strength',
    scenario: 'Which password is strongest for a new account?',
    options: ['Summer2026', 'Aditi@123', 'river-Quartz-91!vault'],
    answer: 'river-Quartz-91!vault',
  },
  {
    title: 'Social Engineering',
    scenario: 'A caller claiming to be IT asks for your OTP to close an urgent ticket.',
    options: ['Share OTP', 'Verify independently', 'Install remote app'],
    answer: 'Verify independently',
  },
];

export default function QuizChallenge() {
  const [index, setIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const challenge = challenges[index];

  const choose = (option: string) => {
    if (selected) return;
    setSelected(option);
    if (option === challenge.answer) setScore((current) => current + 100);
  };

  const next = () => {
    setIndex((current) => (current + 1) % challenges.length);
    setSelected(null);
  };

  return (
    <QuizShell>
      <div className="grid gap-5 lg:grid-cols-[1fr_280px] transition-colors duration-300">
        <QuizCard>
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.25em] text-purple-600 dark:text-purple-300">
            Challenge {index + 1}/{challenges.length}
          </p>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{challenge.title}</h1>
          <p className="mt-4 rounded-lg border border-cyan-400/20 bg-cyan-400/5 p-4 text-sm text-gray-700 dark:text-slate-300">{challenge.scenario}</p>
          <div className="mt-5 space-y-3">
            {challenge.options.map((option) => (
              <button
                key={option}
                className={`w-full rounded-lg border p-4 text-left text-sm transition-colors duration-300 ${
                  selected
                    ? option === challenge.answer
                      ? 'border-emerald-400/50 bg-emerald-400/10 text-emerald-800 dark:text-emerald-200'
                      : selected === option
                        ? 'border-red-400/50 bg-red-400/10 text-red-800 dark:text-red-200'
                        : 'border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-950/60 text-gray-700 dark:text-gray-300'
                    : 'border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-950/60 text-gray-700 dark:text-gray-300 hover:border-purple-400/40 dark:hover:border-purple-400/40'
                }`}
                disabled={Boolean(selected)}
                onClick={() => choose(option)}
              >
                {option}
              </button>
            ))}
          </div>
          {selected && (
            <button className="mt-5 rounded-lg bg-cyan-500 hover:bg-cyan-400 px-4 py-2 text-sm font-bold text-slate-950" onClick={next}>
              Next Challenge
            </button>
          )}
        </QuizCard>
        <QuizCard>
          <span className="text-xs uppercase tracking-widest text-slate-400">Score</span>
          <strong className="mt-2 block text-4xl text-cyan-300">{score}</strong>
          <p className="mt-4 text-sm text-slate-400">Correct decisions add 100 XP.</p>
        </QuizCard>
      </div>
    </QuizShell>
  );
}
