/**
 * @deprecated Not routed — quiz uses `CyberAwarenessCommandCenter.jsx` for all `/quiz/*` paths.
 */
import { QuizCard, QuizShell } from './QuizShell';

export default function Challenge() {
  return (
    <QuizShell>
      <QuizCard>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Legacy challenge module. Open <strong>/quiz/challenge</strong> for the live command center experience.
        </p>
      </QuizCard>
    </QuizShell>
  );
}
