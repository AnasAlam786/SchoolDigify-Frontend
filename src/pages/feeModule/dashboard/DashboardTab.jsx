import { useMemo, useState } from 'react';
import { ArrowUpRight, BarChart3, CalendarRange, CircleDollarSign, RefreshCw, School, TrendingUp, WalletCards } from 'lucide-react';
import CollectionTrend from './components/CollectionTrend';


function formatCurrency(value) {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(Number(value || 0));
}

function formatCompactCurrency(value) {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    notation: 'compact',
    maximumFractionDigits: 1,
  }).format(Number(value || 0));
}

function getSummaryCards(summary = {}) {
  return [
    {
      key: 'today',
      label: "Today's collection",
      value: formatCurrency(summary.today),
      detail: `${summary.today_count || 0} payments`,
      tone: 'sky',
      icon: WalletCards,
    },
    {
      key: 'this_week',
      label: 'This week',
      value: formatCurrency(summary.this_week),
      detail: 'Weekly trend',
      tone: 'emerald',
      icon: TrendingUp,
    },
    {
      key: 'this_month',
      label: 'This month',
      value: formatCurrency(summary.this_month),
      detail: 'Current month',
      tone: 'violet',
      icon: CalendarRange,
    },
    {
      key: 'total',
      label: 'Total collected',
      value: formatCurrency(summary.total),
      detail: 'All-time collection',
      tone: 'amber',
      icon: CircleDollarSign,
    },
  ];
}

export default function DashboardTab({ data, loading, error, onRetry, students = [] }) {
  const summaryCards = useMemo(() => getSummaryCards(data?.summary || {}), [data?.summary]);

  const classAnalysis = useMemo(() => {
    const rows = Array.isArray(data?.class_analysis) ? data.class_analysis : [];
    return [...rows].sort((a, b) => (b.collected || 0) - (a.collected || 0));
  }, [data?.class_analysis]);

  const classOutstanding = useMemo(() => {
    const rows = Array.isArray(data?.class_analysis) ? data.class_analysis : [];
    return [...rows].sort((a, b) => (b.outstanding || 0) - (a.outstanding || 0));
  }, [data?.class_analysis]);

  const totalOutstanding = useMemo(
    () => classAnalysis.reduce((sum, item) => sum + Number(item.outstanding || 0), 0),
    [classAnalysis]
  );

  const totalCollected = useMemo(
    () => classAnalysis.reduce((sum, item) => sum + Number(item.collected || 0), 0),
    [classAnalysis]
  );

  if (loading) {
    return (
      <div className="space-y-5">
        <div className="rounded-2xl border border-[#2A2A2A] bg-[#1A1A1A] p-5">
          <div className="h-5 w-40 animate-pulse rounded bg-white/5" />
          <div className="mt-4 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {[...Array(4)].map((_, index) => (
              <div key={index} className="h-28 animate-pulse rounded-2xl border border-[#2A2A2A] bg-white/5" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-2xl border border-[#2A2A2A] bg-[#1A1A1A] p-6 text-center">
        <p className="text-lg font-semibold text-white">Dashboard unavailable</p>
        <p className="mt-2 text-sm text-gray-400">{error}</p>
        <button
          type="button"
          onClick={onRetry}
          className="mt-5 inline-flex items-center gap-2 rounded-xl border border-[#3A3A3A] bg-[#111111] px-4 py-2 text-sm font-medium text-white transition hover:bg-[#1B1B1B]"
        >
          <RefreshCw size={15} />
          Retry
        </button>
      </div>
    );
  }

  if (!data) {
    return null;
  }

  return (
    <div className="space-y-6">
      <section className="rounded-2xl border border-[#2A2A2A] bg-[#1A1A1A] p-4 sm:p-5">
        <div className="mb-5 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-gray-400">Monetary overview</p>
            <h2 className="mt-2 text-2xl font-bold text-white">Fee dashboard overview</h2>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {summaryCards.map(({ key, label, value, detail, tone, icon: Icon }) => (
            <div
              key={key}
              className="rounded-2xl border border-[#2A2A2A] bg-[#111111] p-4 shadow-[0_18px_35px_-22px_rgba(0,0,0,0.9)]"
            >
              <div className="flex items-center justify-between gap-2">
                <p className="text-[11px] uppercase tracking-[0.18em] text-gray-400">{label}</p>
                <span className={[
                  'inline-flex h-9 w-9 items-center justify-center rounded-xl border',
                  tone === 'sky' && 'border-sky-400/30 bg-sky-500/10 text-sky-200',
                  tone === 'emerald' && 'border-emerald-400/30 bg-emerald-500/10 text-emerald-200',
                  tone === 'violet' && 'border-violet-400/30 bg-violet-500/10 text-violet-200',
                  tone === 'amber' && 'border-amber-400/30 bg-amber-500/10 text-amber-200',
                ].join(' ')}>
                  <Icon size={16} />
                </span>
              </div>
              <div className="mt-5 flex items-end justify-between gap-3">
                <p className="text-[28px] font-bold text-white">{value}</p>
                <span className="inline-flex items-center gap-1 rounded-full border border-[#3A3A3A] bg-[#1A1A1A] px-2 py-1 text-[10px] font-medium uppercase tracking-[0.12em] text-gray-300">
                  <ArrowUpRight size={12} />
                  {detail}
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="overflow-hidden rounded-2xl border border-[#2A2A2A] bg-[#1A1A1A] p-4 sm:p-5">
        <div className="mb-4 flex items-center justify-between gap-2">
          <div>
            <p className="text-[11px] uppercase tracking-[0.18em] text-gray-400">Collection trend</p>
            <h3 className="mt-1 text-lg font-semibold text-white">Daily fee collection</h3>
          </div>
        </div>

        <CollectionTrend data={data.daily_collections} />
      </section>

      <section className="grid gap-5 xl:grid-cols-2">
        <div className="rounded-2xl border border-[#2A2A2A] bg-[#1A1A1A] p-4 sm:p-5">
          <div className="mb-4 flex items-center justify-between gap-2">
            <div>
              <p className="text-[11px] uppercase tracking-[0.18em] text-gray-400">Performance by class</p>
              <h3 className="mt-1 text-lg font-semibold text-white">Top collection classes</h3>
            </div>
            <span className="inline-flex items-center gap-2 rounded-full border border-emerald-400/30 bg-emerald-500/10 px-2.5 py-1 text-xs font-medium text-emerald-200">
              <BarChart3 size={13} />
              {formatCompactCurrency(totalCollected)}
            </span>
          </div>

          <div className="space-y-3">
            {classAnalysis.slice(0, 5).map((item) => {
              const maxCollected = classAnalysis[0]?.collected || 1;
              const width = Math.max(12, (Number(item.collected || 0) / maxCollected) * 100);

              return (
                <div key={item.class_id || item.class_name} className="rounded-2xl border border-[#2A2A2A] bg-[#111111] p-3">
                  <div className="mb-2 flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2 text-sm font-medium text-gray-200">
                      <School size={14} className="text-gray-400" />
                      <span>{item.class_name}</span>
                    </div>
                    <span className="text-sm font-semibold text-emerald-300">{formatCurrency(item.collected)}</span>
                  </div>

                  <div className="h-2.5 overflow-hidden rounded-full bg-[#262626]">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-emerald-500 via-teal-400 to-emerald-300"
                      style={{ width: `${width}%` }}
                    />
                  </div>

                  <div className="mt-2 flex items-center justify-between text-xs text-gray-400">
                    <span>{item.collection_percentage || 0}% collection</span>
                    <span>{item.total_due ? formatCurrency(item.total_due) : '₹0'} due</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="rounded-2xl border border-[#2A2A2A] bg-[#1A1A1A] p-4 sm:p-5">
          <div className="mb-4 flex items-center justify-between gap-2">
            <div>
              <p className="text-[11px] uppercase tracking-[0.18em] text-gray-400">Receivables</p>
              <h3 className="mt-1 text-lg font-semibold text-white">Outstanding classes</h3>
            </div>
            <span className="inline-flex items-center gap-2 rounded-full border border-amber-400/30 bg-amber-500/10 px-2.5 py-1 text-xs font-medium text-amber-200">
              <WalletCards size={13} />
              {formatCompactCurrency(totalOutstanding)}
            </span>
          </div>

          <div className="space-y-3">
            {classOutstanding.slice(0, 5).map((item) => {
              const maxOutstanding = classOutstanding[0]?.outstanding || 1;
              const width = Math.max(12, (Number(item.outstanding || 0) / maxOutstanding) * 100);

              return (
                <div key={item.class_id || item.class_name} className="rounded-2xl border border-[#2A2A2A] bg-[#111111] p-3">
                  <div className="mb-2 flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2 text-sm font-medium text-gray-200">
                      <School size={14} className="text-gray-400" />
                      <span>{item.class_name}</span>
                    </div>
                    <span className="text-sm font-semibold text-amber-300">{formatCurrency(item.outstanding)}</span>
                  </div>

                  <div className="h-2.5 overflow-hidden rounded-full bg-[#262626]">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-amber-500 via-orange-500 to-orange-300"
                      style={{ width: `${width}%` }}
                    />
                  </div>

                  <div className="mt-2 flex items-center justify-between text-xs text-gray-400">
                    <span>{item.outstanding > 0 ? 'Pending' : 'Cleared'}</span>
                    <span>{item.collection_percentage || 0}% collected</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
}
