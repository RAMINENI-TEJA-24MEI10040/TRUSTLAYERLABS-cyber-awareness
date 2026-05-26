export default function ProgressBar({ value, label }: { value: number; label?: string }) {
  const width = Math.max(0, Math.min(100, value));
  return (
    <div className="ph-progress-wrap">
      {label && <div className="ph-progress-label"><span>{label}</span><span>{Math.round(width)}%</span></div>}
      <div className="ph-progress"><div style={{ width: `${width}%` }} /></div>
    </div>
  );
}
