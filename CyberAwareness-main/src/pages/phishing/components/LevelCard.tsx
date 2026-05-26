import type { Level } from "../data";

export default function LevelCard({ level, active = false }: { level: Level; active?: boolean }) {
  const Icon = level.Icon;
  return (
    <div className={`ph-level-card ${active ? "active" : ""}`}>
      <Icon size={24} />
      <div>
        <strong>{level.title}</strong>
        <span>{level.description}</span>
      </div>
    </div>
  );
}
