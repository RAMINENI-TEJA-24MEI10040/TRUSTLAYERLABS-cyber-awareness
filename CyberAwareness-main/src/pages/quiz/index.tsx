import { useLocation } from "react-router-dom";
import CyberAwarenessCommandCenter from "./CyberAwarenessCommandCenter";

const PATH_TO_VIEW: Record<string, string> = {
  "/quiz": "home",
  "/quiz/play": "quiz",
  "/quiz/challenge": "challenge",
  "/quiz/case-study": "casestudy",
  "/quiz/leaderboard": "leaderboard",
};

export default function QuizPage() {
  const { pathname } = useLocation();
  const initialView = PATH_TO_VIEW[pathname] ?? "home";

  return <CyberAwarenessCommandCenter key={pathname} initialView={initialView} />;
}
