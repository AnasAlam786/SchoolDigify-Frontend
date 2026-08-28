export default function CollectionTrend({ data = [] }) {
  const width = 900;
  const height = 260;
  const padding = 28;
  const maxValue = Math.max(...data.map((item) => item.value), 1);

  const points = data.map((item, index) => {
    const x = padding + (index * (width - padding * 2)) / Math.max(data.length - 1, 1);
    const y = height - padding - (item.value / maxValue) * (height - padding * 2);
    return { ...item, x, y };
  });

  const linePath = points.map((point, index) => `${index === 0 ? 'M' : 'L'} ${point.x} ${point.y}`).join(' ');
  const areaPath = `${linePath} L ${points[points.length - 1]?.x || width - padding} ${height - padding} L ${points[0]?.x || padding} ${height - padding} Z`;

  return (
    <div className="overflow-hidden rounded-xl border border-[#2A2A2A] bg-[#111111] p-3 sm:p-4">
      <svg viewBox={`0 0 ${width} ${height}`} className="h-56 w-full" role="img" aria-label="Fee collection trend chart">
        {[0, 1, 2, 3].map((line) => (
          <line
            key={line}
            x1={padding}
            x2={width - padding}
            y1={padding + (line * (height - padding * 2)) / 3}
            y2={padding + (line * (height - padding * 2)) / 3}
            stroke="rgba(255,255,255,0.08)"
            strokeWidth="1"
          />
        ))}

        <path d={areaPath} fill="url(#feeCollectionArea)" opacity="0.85" />
        <path d={linePath} fill="none" stroke="#d4d4d4" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />

        {points.map((point) => (
          <g key={point.label}>
            <circle cx={point.x} cy={point.y} r="4.5" fill="#f5f5f5" stroke="#d4d4d4" strokeWidth="2" />
            <title>{`${point.label}: ${new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(point.value)}`}</title>
          </g>
        ))}

        <defs>
          <linearGradient id="feeCollectionArea" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor="#d4d4d4" stopOpacity="0.25" />
            <stop offset="100%" stopColor="#d4d4d4" stopOpacity="0.02" />
          </linearGradient>
        </defs>
      </svg>

      <div className="mt-2 grid grid-cols-2 gap-2 text-center text-[11px] text-gray-400 sm:grid-cols-7">
        {data.map((item) => (
          <div key={item.label} className="rounded-lg bg-[#1A1A1A] px-2 py-1.5">
            {item.label}
          </div>
        ))}
      </div>
    </div>
  );
}
