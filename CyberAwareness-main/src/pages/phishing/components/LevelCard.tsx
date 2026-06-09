import { useTranslation } from "react-i18next";
import type { Level } from "../data";

export default function LevelCard({ level, index, active = false }: { level: Level; index: number; active?: boolean }) {
  const { t } = useTranslation();
  const Icon = level.Icon;
  return (
    <div className={`ph-level-card ${active ? "active" : ""}`}>
      <Icon size={24} />
      <div>
        <strong>{t(`phishing.levels.${index}.title`, level.title)}</strong>
        <span>{t(`phishing.levels.${index}.description`, level.description)}</span>
      </div>
    </div>
  );
}
