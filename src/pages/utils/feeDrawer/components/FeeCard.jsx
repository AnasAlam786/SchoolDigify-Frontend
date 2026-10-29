import { Settings2 } from 'lucide-react';

export default function FeeCard({ fee, isSelected, selectedAmount, isPartialSelection, onToggle, onConfigurePayment, readOnly = false }) {

  const statusUpper = (fee.status || '').toUpperCase();
  const isPaid = statusUpper === 'PAID';
  const isUnavailable = isPaid || statusUpper === 'OVERPAID';

  const title = fee.period_name || fee.name || fee.fee_type || fee.month || 'Fee';

  // Executive Palette & Style Mapping
  const styles = {
    PAID: {
      container: 'border-emerald-500/20 bg-emerald-950/20 hover:border-emerald-500/30',
      iconBox: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
      badge: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
      amount: 'text-emerald-400',
      label: 'Paid'
    },
    DUE: {
      container: isSelected
        ? 'border-blue-500 bg-slate-900/90 ring-1 ring-blue-500/50 shadow-xl shadow-blue-500/10'
        : 'border-red-500/50 bg-red-950/20 hover:border-red-500/60 hover:bg-red-950/40',
      iconBox: isSelected
        ? 'bg-blue-500/20 text-blue-400 border-blue-400/30'
        : 'bg-red-500/10 text-red-400 border-red-500/20',
      badge: isSelected
        ? 'bg-blue-500/15 text-blue-300 border-blue-400/30'
        : 'bg-red-500/10 text-red-400 border-red-500/20',
      amount: isSelected ? 'text-blue-300' : 'text-red-400',
      label: 'Due'
    },
    PARTIAL: {
      container: isSelected
        ? 'border-amber-400 bg-amber-950/30 ring-1 ring-amber-400/50 shadow-xl shadow-amber-500/10'
        : 'border-amber-500/40 bg-amber-950/20 hover:border-amber-400/60 hover:bg-amber-950/30',
      iconBox: 'bg-amber-500/10 text-amber-300 border-amber-500/30',
      badge: 'bg-amber-500/10 text-amber-300 border-amber-500/30',
      amount: 'text-amber-300',
      label: 'Partial'
    },
    OVERPAID: {
      container: 'border-rose-500/40 bg-rose-950/20',
      iconBox: 'bg-rose-500/10 text-rose-300 border-rose-500/30',
      badge: 'bg-rose-500/10 text-rose-300 border-rose-500/30',
      amount: 'text-rose-300',
      label: 'Overpaid'
    },
    UPCOMING: {
      container: isSelected
        ? 'border-blue-500 bg-slate-900/90 ring-1 ring-blue-500/50 shadow-xl shadow-blue-500/10'
        : 'border-dashed border-slate-700 bg-slate-800/30 hover:bg-slate-800/40',

      iconBox: isSelected
        ? 'bg-blue-500/20 text-blue-400 border-blue-400/30'
        : 'bg-slate-700/40 text-slate-400 border-slate-600/50',

      badge: isSelected
        ? 'bg-blue-500/15 text-blue-300 border-blue-400/30'
        : 'bg-slate-700/40 text-slate-400 border-slate-600/50',

      amount: isSelected
        ? 'text-blue-300'
        : 'text-slate-300',

      label: 'Upcoming'
    }
  };

  const currentStyle = isPartialSelection ? styles.PARTIAL : (styles[statusUpper] || styles.UPCOMING);
  const obligatoryAmount = fee.obligatory_amount ?? fee.amount;
  const displayedAmount = selectedAmount ?? (
    isPaid
      ? fee.paid_amount ?? obligatoryAmount
      : statusUpper === 'PARTIAL' || statusUpper === 'OVERPAID'
        ? fee.remaining_amount ?? obligatoryAmount
        : obligatoryAmount
  );
  const amountLabel = selectedAmount !== undefined
    ? 'Pay now'
    : isPaid
      ? 'Paid Amount'
      : statusUpper === 'PARTIAL'
        ? 'Remaining Amount'
        : statusUpper === 'OVERPAID'
          ? 'Overpaid'
          : statusUpper === 'DUE'
            ? 'Due Amount'
            : 'Upcoming Amount';

  return (

    <div
      className={`group relative flex flex-col justify-between w-full overflow-hidden rounded-2xl border  transition-all duration-200 backdrop-blur-md ${currentStyle.container
        } ${readOnly || isUnavailable
          ? 'cursor-not-allowed opacity-85'
          : 'cursor-pointer active:scale-[0.985]'
        }`}
      onClick={() => !readOnly && !isUnavailable && onToggle?.(fee)}
      role={readOnly ? undefined : "button"}
      tabIndex={readOnly || isUnavailable ? -1 : 0}
      aria-disabled={readOnly || isUnavailable}
      onKeyDown={(e) => {
        if (!readOnly && !isUnavailable && (e.key === 'Enter' || e.key === ' ')) {
          e.preventDefault();
          onToggle?.(fee);
        }
      }}
    >
      {/* TOP HEADER ROW: Icon + Title on left, Badge on right */}
      <div className={`flex items-center justify-between gap-2.5 p-3`}>
        <div className="flex items-center gap-2.5 min-w-0 flex-1">
          <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-xl border transition-transform group-hover:scale-105 ${currentStyle.iconBox}`}>
            {isPaid ? (
              <i className="fas fa-check text-xs" />
            ) : isSelected ? (
              <i className="fas fa-check text-xs" />
            ) : (
              <i className="far fa-calendar-alt text-xs" />
            )}
          </div>

          <h3 className="truncate text-sm font-bold tracking-tight text-white min-w-0" title={title}>
            {title}
          </h3>
        </div>

        {/* Status Badge */}
        <div className="flex shrink-0 items-center gap-1.5">
          <span className={`inline-flex items-center rounded-md border px-2 py-0.5 text-[9px] font-bold tracking-wider uppercase ${currentStyle.badge}`}>
            {isSelected && !isUnavailable ? 'Selected' : currentStyle.label}
          </span>
          {isSelected && !readOnly && onConfigurePayment && (
            <button
              type="button"
              onClick={(event) => {
                event.stopPropagation();
                onConfigurePayment(fee);
              }}
              aria-label={`Set payment amount for ${title}`}
              title="Set payment amount"
              className="flex h-7 w-7 items-center justify-center rounded-md border border-amber-400/30 bg-amber-400/10 text-amber-300 hover:bg-amber-400/20"
            >
              <Settings2 className="h-3.5 w-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* DATA GRID: Clean Metric Columns */}
      <div className="p-3 mb-2 border-t border-white/[0.06] flex items-end justify-between gap-2">
        <div className="flex flex-col gap-0.5 min-w-0">
          <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
            {isPaid ? 'Paid On' : 'Due Date'}
          </span>
          <span className="text-xs font-semibold text-slate-200 truncate">
            {isPaid ? (fee.paid_date || 'N/A') : fee.dueDate}
          </span>
        </div>

        <div className="text-right shrink-0">
          <span className="block text-[10px] font-semibold uppercase tracking-wider text-slate-400">
            {amountLabel}
          </span>
          <span className={`text-base font-extrabold tracking-tight ${currentStyle.amount}`}>
            ₹{statusUpper === 'OVERPAID' ? Math.abs(Number(displayedAmount)) : displayedAmount}
          </span>
        </div>
      </div>

      {isPaid && fee.transaction_no && (
        <div className="bg-emerald-950/40 border border-emerald-500/15 py-1.5 flex items-center justify-center gap-1.5 text-[11px] font-mono text-emerald-300/90">
          <i className="fas fa-receipt text-[10px] text-emerald-400/80 shrink-0" />
          <span className="font-semibold truncate select-all">
            #{fee.transaction_no}
          </span>
        </div>
      )}
    </div>
  );
}