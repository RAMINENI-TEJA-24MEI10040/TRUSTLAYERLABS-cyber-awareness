import { Link } from 'react-router-dom';
import { QuizCard, QuizShell } from './QuizShell';

const modules = [
  { to: '/quiz/play', icon: '🧠', title: 'Cyber Awareness Quizzes', desc: 'Scenario-based questions covering phishing, social engineering, and digital hygiene.', color: 'text-cyan-300' },
  { to: '/quiz/challenge', icon: '🎭', title: 'Scam Simulator', desc: 'Classify suspicious messages under pressure and build decision confidence.', color: 'text-red-300' },
  { to: '/quiz/case-study', icon: '📋', title: 'Case Studies', desc: 'Analyze real-world incidents and learn response patterns.', color: 'text-purple-300' },
  { to: '/quiz/leaderboard', icon: '🏆', title: 'Leaderboard', desc: 'Track XP, rank, and training progress.', color: 'text-emerald-300' },
];

export default function QuizHome() {
  return (
    <QuizShell>
      <section className="mb-8 transition-colors duration-300">
        <p className="mb-3 text-xs font-semibold uppercase tracking-[0.3em] text-cyan-600 dark:text-cyan-300">CyberShield training</p>
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white">Quiz Arena</h1>
        <p className="mt-3 max-w-2xl text-gray-600 dark:text-gray-300">
          Complete challenges, detect scams, and master cybersecurity through hands-on simulations and case studies.
        </p>
      </section>

      <section className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {modules.map((module) => (
          <Link key={module.to} to={module.to}>
            <QuizCard className="h-full transition duration-300 hover:-translate-y-1 hover:border-cyan-400/40">
              <div className={`mb-4 text-3xl ${module.color}`}>{module.icon}</div>
              <h2 className="font-bold text-gray-900 dark:text-white">{module.title}</h2>
              <p className="mt-2 text-sm leading-relaxed text-gray-600 dark:text-gray-300">{module.desc}</p>
            </QuizCard>
          </Link>
        ))}
      </section>
    </QuizShell>
  );
}
