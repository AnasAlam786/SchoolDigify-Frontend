import boyImage from '../../../assets/no-student-boy-image.png';
import girlImage from '../../../assets/no-student-girl-image.png';
import { memo } from 'react';
import usePermission from "../../../hooks/usePermission";
import { CreditCard, Receipt, ChevronRight } from "lucide-react";


const currencyFormatter = new Intl.NumberFormat('en-IN', {
  style: 'currency',
  currency: 'INR',
  maximumFractionDigits: 0,
});

function formatCurrency(value) {
  return currencyFormatter.format(Number(value || 0));
}

function getStudentImage(student) {
  if (student?.IMAGE) {
    return student.IMAGE.startsWith('http')
      ? student.IMAGE
      : `https://lh3.googleusercontent.com/d/${student.IMAGE}=s50`;
  }

  if (student?.photo) {
    return student.photo.startsWith('http')
      ? student.photo
      : `https://lh3.googleusercontent.com/d/${student.photo}=s50`;
  }

  return student?.GENDER?.toLowerCase() === 'female' ? girlImage : boyImage;
}

function getStatusStyles(status) {
  switch (status) {
    case 'Paid':
      return {
        badge: 'border border-emerald-400/30 bg-emerald-500/10 text-emerald-200',
        dot: 'bg-emerald-400',
        text: 'text-emerald-300',
      };
    case 'Partially Paid':
      return {
        badge: 'border border-amber-400/30 bg-amber-500/10 text-amber-200',
        dot: 'bg-amber-400',
        text: 'text-amber-300',
      };
    case 'Due':
      return {
        badge: 'border border-rose-400/30 bg-rose-500/10 text-rose-200',
        dot: 'bg-rose-400',
        text: 'text-rose-300',
      };
    default:
      return {
        badge: 'border border-slate-500/30 bg-slate-600/10 text-slate-200',
        dot: 'bg-slate-400',
        text: 'text-slate-300',
      };
  }
}

function StudentFeeCard({ student, onViewDetails, onPayFees, onViewTransactions }) {
  const { hasPermission, PERMISSIONS } = usePermission()

  const statusStyles = getStatusStyles(student?.feeStatus || 'Due');

  const totalSettledAmount = student?.totalSettledAmount || 0

  const totalDueAmount = student?.dueAmount || 0
  const totalPayableAmount = student?.totalPayable || 0

  const dueMonths = student?.dueMonths || 0
  const totalMonths = student?.totalMonths || 0
  const totalPaidMonths = student?.paidMonths || 0

  const upcommingMonthsLength = student?.upcomingMonths || 0
  const upcomingAmount = student?.upcomingAmount || 0

  const paidOneTimeFee = student?.paidOneTimeFee || 0
  const paidTuitionFee = student?.paidTuitionFee || 0
  const totalOneTimeFee = student?.totalOneTimeFee || 0
  const totalTuitionFee = student?.totalTuitionFee || 0


  // Calculate exact percentages relative to the sum of Paid + Due + Upcoming (100% full width)
  const exactTotal = totalSettledAmount + totalDueAmount + upcomingAmount;
  const safeTotal = exactTotal > 0 ? exactTotal : 1;
  
  const settledProgress = (totalSettledAmount / safeTotal) * 100;
  const dueProgress = (totalDueAmount / safeTotal) * 100;
  const upcomingProgress = (upcomingAmount / safeTotal) * 100;

  const handlePayFees = () => {
    if (typeof onPayFees === 'function') {
      onPayFees(student);
    }
  };

  const handleViewTransactions = () => {
    if (typeof onViewTransactions === 'function') {
      onViewTransactions(student);
    }
  };

  const handleViewDetails = () => {
    if (typeof onViewDetails === 'function') {
      onViewDetails(student);
    }
  };

  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-2xl border border-[#2A2A2A] bg-[#1A1A1A] shadow-[0_12px_30px_-18px_rgba(0,0,0,0.8)] transition-all duration-200 hover:-translate-y-0.5 hover:border-[#3A3A3A]">
      <div className="border-b border-[#2A2A2A] bg-[#181818] px-4 py-4">
        <div className="flex items-start gap-3">
          <div className="relative shrink-0">
            <img
              src={getStudentImage(student)} loading="lazy"
              alt={student?.STUDENTS_NAME || 'Student'}
              className="h-16 w-16 rounded-2xl border border-slate-600 object-cover shadow-lg shadow-slate-900/50"
            />
            <div className="absolute -bottom-2 -right-2 rounded-full border border-[#3A3A3A] bg-[#111111] px-2 py-0.5 text-[10px] font-semibold tracking-[0.18em] text-gray-200">
              Roll: {student?.ROLL || '—'}
            </div>
          </div>

          <div className="min-w-0 flex-1">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0 flex-1">
                <h3
                  onClick={handleViewDetails}
                  className="group/title inline-flex items-center gap-1.5 truncate text-lg font-semibold text-white cursor-pointer transition-all duration-150 active:scale-[0.98] hover:text-indigo-400"
                >
                  <span className="truncate underline-offset-4 hover:underline">{student?.STUDENTS_NAME || 'Student Name'}</span>
                  <svg
                    className="h-4 w-4 shrink-0 text-indigo-400 transition-transform duration-200 group-hover/title:translate-x-0.5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </h3>
                <p className="truncate text-gray-400">C/O: {student?.FATHERS_NAME || 'Not available'}</p>
              </div>
              <span className={`inline-flex items-center gap-2 rounded-full px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] ${statusStyles.badge}`}>
                <span className={`h-1.5 w-1.5 rounded-full ${statusStyles.dot}`} />
                {student?.feeStatus || 'Due'}
              </span>
            </div>
            <div className="mt-1 flex items-center gap-2 text-xs text-neutral-400">
              <span>Class: {student?.CLASS || "—"}</span>
              <span className="h-3 w-px bg-white/15" />
              <span className="tabular-nums">SR: #{student?.SR || "—"}</span>
              {student?.isRTE && (
                <span className="ml-1 rounded border border-amber-400/30 px-1.5 py-0.5 text-[10px] font-semibold text-amber-300">
                  RTE
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-1 flex-col px-4 py-4">
        <div className="mb-4 rounded-xl border border-[#2A2A2A] bg-[#111111] p-3">
          <div className="flex items-end justify-between gap-3">
            <div>
              <p className="text-[11px] uppercase tracking-[0.18em] text-gray-400">Outstanding</p>
              <p className={`mt-1 text-2xl font-bold ${statusStyles.text}`}>
                {formatCurrency(totalDueAmount)}
              </p>
            </div>
            <div className="text-right">
              <p className="text-[11px] uppercase tracking-[0.18em] text-gray-400">Due months</p>
              <p className="mt-1 text-base font-semibold text-gray-200">{dueMonths}</p>
            </div>
          </div>

          <div className="mt-4">
            <div className="mb-2 flex items-center justify-between text-xs text-gray-400">
              <span>Payment Progress</span>
              <span>{Math.round((totalSettledAmount / Math.max(totalPayableAmount, 1)) * 100)}%</span>
            </div>
            
            {/* Exactly 3 segments making up 100% of the bar width: Paid -> Due -> Upcoming */}
            <div className="h-2.5 flex overflow-hidden rounded-full bg-[#2A2A2A]">
              <div
                className="h-full bg-emerald-400 transition-all duration-300 first:rounded-l-full"
                style={{ width: `${settledProgress}%` }}
                title={`Paid: ${formatCurrency(totalSettledAmount)}`}
              />
              <div
                className="h-full bg-rose-500 transition-all duration-300"
                style={{ width: `${dueProgress}%` }}
                title={`Current Due: ${formatCurrency(totalDueAmount)}`}
              />
              <div
                className="h-full bg-zinc-600 transition-all duration-300 last:rounded-r-full"
                style={{ width: `${upcomingProgress}%` }}
                title={`Upcoming: ${formatCurrency(upcomingAmount)}`}
              />
            </div>

            {/* Legend indicators */}
            <div className="mt-2.5 flex flex-wrap items-center justify-between gap-2 text-[10px] text-gray-400">
              <div className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-emerald-400" />
                <span>Paid ({formatCurrency(totalSettledAmount)})</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-rose-500" />
                <span>Due ({formatCurrency(totalDueAmount)})</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-zinc-600" />
                <span>Upcoming ({formatCurrency(upcomingAmount)})</span>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 text-sm">
          <div className="rounded-lg border border-[#2A2A2A] bg-[#191919] p-2.5">
            <p className="text-[10px] uppercase tracking-[0.16em] text-gray-400">Paid</p>
            <p className="mt-1 font-semibold text-emerald-300">{formatCurrency(totalSettledAmount)}</p>
          </div>
          <div className="rounded-lg border border-[#2A2A2A] bg-[#191919] p-2.5">
            <p className="text-[10px] uppercase tracking-[0.16em] text-gray-400">Total due</p>
            <p className="mt-1 font-semibold text-rose-300">{formatCurrency(totalDueAmount)}</p>
          </div>
          <div className="rounded-lg border border-[#2A2A2A] bg-[#191919] p-2.5">
            <p className="text-[10px] uppercase tracking-[0.16em] text-gray-400">Total fee</p>
            <p className="mt-1 font-semibold text-white">{formatCurrency(totalPayableAmount)}</p>
          </div>

          <div className="rounded-lg border border-[#2A2A2A] bg-[#191919] p-2.5">
            <p className="text-[10px] uppercase tracking-[0.16em] text-gray-400">Last payment</p>
            <p className="mt-1 font-medium text-white">{student?.lastPaymentDate || 'Not yet'}</p>
          </div>

        </div>

        <div className="flex items-center gap-2 pt-3">
          <button
            type="button"
            onClick={handlePayFees}
            className="flex flex-1 items-center justify-center gap-2 rounded-xl 
              bg-green-400 px-3 py-2.5 text-sm font-semibold text-neutral-950 
              transition-colors hover:bg-green-300 focus:outline-none focus-visible:ring-2 
              focus-visible:ring-green-400/50"
          >
            <CreditCard className="h-4 w-4" />
            {hasPermission(PERMISSIONS.PAY_FEES) ? "Pay fees" : "View fees"}
          </button>

          {hasPermission(PERMISSIONS.PAY_FEES) && (
            <button
              type="button"
              onClick={handleViewTransactions}
              aria-label="View transactions"
              className="flex items-center justify-center rounded-xl bg-yellow-400
  p-2.5 text-neutral-900 transition-colors hover:bg-yellow-300"
            >
              <Receipt className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>
    </article>
  );
}

export default memo(StudentFeeCard);