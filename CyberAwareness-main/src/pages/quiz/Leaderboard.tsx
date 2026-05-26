/** @deprecated Not routed — see `CyberAwarenessCommandCenter.jsx`. */
import { QuizCard, QuizShell } from './QuizShell';

const leaders = [
  ['01', 'Nisha', '4,920 XP'],
  ['02', 'Rahul', '4,510 XP'],
  ['03', 'Aditi', '4,180 XP'],
  ['04', 'Kabir', '3,950 XP'],
  ['05', 'Meera', '3,720 XP'],
];

export default function Leaderboard() {
  return (
    <QuizShell>
      <QuizCard className="mx-auto max-w-2xl transition-colors duration-300">
        <h1 className="mb-5 text-2xl font-bold text-gray-900 dark:text-white">Leaderboard</h1>
        <div className="space-y-3">
          {leaders.map(([rank, name, score]) => (
            <div key={rank} className="flex items-center justify-between rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-950/60 p-4 transition-colors duration-300">
              <div className="flex items-center gap-3">
                <span className="text-cyan-600 dark:text-cyan-300">{rank}</span>
                <strong className="text-gray-900 dark:text-white">{name}</strong>
              </div>
              <span className="text-sm text-gray-600 dark:text-gray-300">{score}</span>
            </div>
          ))}
        </div>
      </QuizCard>
    </QuizShell>
  );
}
