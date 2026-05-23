interface AwarenessCardProps {
  title: string;
  items: string[];
  color?: 'cyan' | 'red' | 'orange' | 'yellow' | 'green' | 'teal';
}

const colorMap = {
  cyan:   { border: '#22d3ee', bg: 'rgba(34,211,238,0.07)',  dot: '#22d3ee', title: '#67e8f9' },
  teal:   { border: '#2dd4bf', bg: 'rgba(45,212,191,0.07)',  dot: '#2dd4bf', title: '#5eead4' },
  green:  { border: '#4ade80', bg: 'rgba(74,222,128,0.07)',  dot: '#4ade80', title: '#86efac' },
  yellow: { border: '#eab308', bg: 'rgba(234,179,8,0.07)',   dot: '#eab308', title: '#fde047' },
  orange: { border: '#f97316', bg: 'rgba(249,115,22,0.07)',  dot: '#f97316', title: '#fdba74' },
  red:    { border: '#f87171', bg: 'rgba(248,113,113,0.07)', dot: '#f87171', title: '#fca5a5' },
};

export default function AwarenessCard({ title, items, color = 'cyan' }: AwarenessCardProps) {
  const c = colorMap[color];
  return (
    <div
      className="rounded-xl p-5 transition-all duration-300 hover:scale-[1.01]"
      style={{ background: c.bg, border: `1px solid ${c.border}25`, borderLeft: `3px solid ${c.border}` }}
    >
      <h3 className="font-semibold text-xs mb-3 tracking-widest uppercase" style={{ color: c.title }}>
        {title}
      </h3>
      <ul className="space-y-2.5">
        {items.map((item, i) => (
          <li key={i} className="flex items-start gap-2.5 text-sm leading-relaxed text-gray-700 dark:text-slate-300">
            <span className="mt-2 w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: c.dot }} />
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}
