/** @deprecated Not routed — see `CyberAwarenessCommandCenter.jsx`. */
import { useState } from 'react';
import { QuizCard, QuizShell } from './QuizShell';

const cases = [
  {
    title: 'Fake job offer scam',
    body: 'A candidate receives a premium-looking offer letter and is asked to pay a refundable equipment fee.',
    lesson: 'Verify recruiter identity, company domain, interview history, and never pay to receive a job.',
  },
  {
    title: 'UPI refund trap',
    body: 'A caller sends a QR code to receive money, but scanning opens a collect request that asks for UPI PIN.',
    lesson: 'Entering UPI PIN authorizes payment. Refunds do not require a PIN.',
  },
  {
    title: 'Account lock phishing',
    body: 'An email claims your account will close today unless you sign in through a shortened link.',
    lesson: 'Urgency, shortened links, and credential requests are high-risk signals.',
  },
];

export default function CaseStudy() {
  const [index, setIndex] = useState(0);
  const item = cases[index];

  return (
    <QuizShell>
      <QuizCard className="mx-auto max-w-3xl transition-colors duration-300">
        <p className="mb-3 text-xs font-semibold uppercase tracking-[0.25em] text-cyan-600 dark:text-cyan-300">
          Case {index + 1}/{cases.length}
        </p>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{item.title}</h1>
        <p className="mt-4 text-gray-600 dark:text-gray-300">{item.body}</p>
        <div className="mt-5 rounded-lg border border-emerald-400/20 bg-emerald-400/10 p-4 text-sm text-emerald-800 dark:text-emerald-200 dark:bg-emerald-500/10">
          {item.lesson}
        </div>
        <div className="mt-5 flex gap-3">
          {cases.map((caseItem, caseIndex) => (
            <button
              key={caseItem.title}
              className={`h-2 flex-1 rounded-full ${caseIndex === index ? 'bg-cyan-300' : 'bg-slate-700'}`}
              aria-label={`Open case ${caseIndex + 1}`}
              onClick={() => setIndex(caseIndex)}
            />
          ))}
        </div>
      </QuizCard>
    </QuizShell>
  );
}
