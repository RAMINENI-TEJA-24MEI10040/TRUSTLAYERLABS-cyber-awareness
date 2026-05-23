import { type ReactNode } from 'react';
import { Link, useLocation } from 'react-router-dom';

const links = [
  { to: '/quiz', label: 'Module Home' },
  { to: '/quiz/play', label: 'Quizzes' },
  { to: '/quiz/challenge', label: 'Challenge' },
  { to: '/quiz/leaderboard', label: 'Leaderboard' },
  { to: '/quiz/case-study', label: 'Case Studies' },
];

export function QuizShell({ children }: { children: ReactNode }) {
  const location = useLocation();

  return (
    <div className="min-h-screen bg-white text-gray-900 dark:bg-gray-900 dark:text-white transition-colors duration-300">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8 flex flex-wrap gap-2">
          {links.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className={`rounded-lg border px-3 py-2 text-xs font-semibold uppercase tracking-wider transition ${
                location.pathname === link.to
                  ? 'border-cyan-400/50 bg-cyan-400/10 text-cyan-700 dark:text-cyan-300'
                  : 'border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-900/70 text-gray-700 dark:text-gray-300 hover:border-cyan-400/40 dark:hover:border-cyan-500/40 hover:text-cyan-500 transition-colors'
              }`}
            >
              {link.label}
            </Link>
          ))}
        </div>
        {children}
      </div>
    </div>
  );
}

export function QuizCard({ children, className = '' }: { children: ReactNode; className?: string }) {
  return (
    <article className={`rounded-xl border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-900/80 p-5 shadow-lg shadow-cyan-950/10 transition-colors duration-300 ${className}`}>
      {children}
    </article>
  );
}
