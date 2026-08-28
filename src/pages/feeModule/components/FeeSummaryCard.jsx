export default function FeeSummaryCard({ label, value, context, tone = 'sky' }) {
  const toneClasses = {
    sky: {
      badge: 'bg-[#2A2A2A] text-gray-200 border-[#3A3A3A]',
      value: 'text-gray-100',
    },
    emerald: {
      badge: 'bg-emerald-500/10 text-emerald-200 border-emerald-500/20',
      value: 'text-emerald-300',
    },
    amber: {
      badge: 'bg-amber-500/10 text-amber-200 border-amber-500/20',
      value: 'text-amber-300',
    },
    rose: {
      badge: 'bg-rose-500/10 text-rose-200 border-rose-500/20',
      value: 'text-rose-300',
    },
  };

  const selectedTone = toneClasses[tone] || toneClasses.sky;

  return (
    <div className="rounded-2xl border border-[#2A2A2A] bg-[#1A1A1A] p-4 shadow-[0_12px_25px_-20px_rgba(0,0,0,0.8)]">
      <div className="flex items-center justify-between gap-3">
        <p className="text-[11px] uppercase tracking-[0.18em] text-gray-400">{label}</p>
        <span className={`inline-flex rounded-full border px-2 py-1 text-[10px] font-medium uppercase tracking-[0.12em] ${selectedTone.badge}`}>
          Active
        </span>
      </div>
      <p className={`mt-4 text-2xl font-bold ${selectedTone.value}`}>{value}</p>
      <p className="mt-2 text-sm text-gray-400">{context}</p>
    </div>
  );
}
