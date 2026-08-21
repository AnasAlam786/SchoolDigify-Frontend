import { formatCurrency } from './feeDrawer.utils';

export default function FeeCard({ fee, isSelected, isOtherFee = false, onToggle }) {
  let statusClass = '';
  let statusIcon = '';
  let cursorClass = 'cursor-pointer';
  let dueTextClass = 'text-gray-300';
  let dateText = `Due: ${fee.dueDate}`;

  if (fee.status === 'paid') {
    statusClass = 'paid border border-green-500/30 bg-green-600/30';
    statusIcon = '<i class="fas fa-check-circle text-green-400"></i>';
    cursorClass = 'cursor-not-allowed';
    dueTextClass = 'text-gray-400';
    dateText = `Paid on: ${fee.paid_date}`;
  } else if (fee.status === 'due') {
    statusClass = isSelected ? 'border border-blue-500/50 bg-blue-500/20' : 'border border-red-500/30 bg-red-500/10';
  } else if (fee.status === 'upcoming') {
    statusClass = isSelected ? 'border border-amber-500/50 bg-amber-500/15' : 'border border-gray-700 bg-gray-800';
    dueTextClass = 'text-gray-400';
    dateText = `Upcoming: ${fee.dueDate}`;
  }

  const shortLabel = fee.month ? fee.month.slice(0, 3) : (fee.name || fee.period_name || 'Fee').slice(0, 3);

  return (
    <div
      className={`fee-card rounded-2xl p-3 transition-all ${statusClass} ${cursorClass} ${isOtherFee ? 'p-4' : 'p-3'}`}
      onClick={() => fee.status !== 'paid' && onToggle(fee)}
      role="button"
      tabIndex={0}
      onKeyDown={(event) => {
        if ((event.key === 'Enter' || event.key === ' ') && fee.status !== 'paid') {
          event.preventDefault();
          onToggle(fee);
        }
      }}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-2">
          <div className={`flex h-8 w-8 items-center justify-center rounded-xl ${isSelected ? 'bg-blue-500/20 text-blue-300' : 'bg-gray-700/70 text-gray-300'}`}>
            {statusIcon || <span className="text-[10px] font-bold uppercase">{shortLabel}</span>}
          </div>
          <div>
            <div className="text-sm font-semibold text-white">{fee.period_name || fee.name || fee.month}</div>
            <div className={`text-xs ${dueTextClass}`}>{dateText}</div>
          </div>
        </div>
        <div className={`text-sm font-bold ${isSelected ? 'text-blue-200' : fee.status === 'due' ? 'text-red-300' : 'text-white'}`}>
          {formatCurrency(fee.amount)}
        </div>
      </div>
    </div>
  );
}
