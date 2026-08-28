const timeRanges = [
  { value: 'today', label: 'Today' },
  { value: 'week', label: 'This Week' },
  { value: 'month', label: 'This Month' },
  { value: 'session', label: 'This Session' },
];

export default function FeeTimeRangeSelector({ value, onChange }) {
  return (
    <div className="inline-flex flex-wrap items-center gap-2 rounded-xl border border-[#2A2A2A] bg-[#111111] p-1.5">
      {timeRanges.map((range) => (
        <button
          key={range.value}
          type="button"
          onClick={() => onChange(range.value)}
          className={`rounded-lg px-3 py-2 text-sm font-medium transition-all ${
            value === range.value
              ? 'bg-[#2A2A2A] text-white border border-[#3A3A3A]'
              : 'text-gray-300 hover:bg-[#202020] hover:text-white'
          }`}
        >
          {range.label}
        </button>
      ))}
    </div>
  );
}
