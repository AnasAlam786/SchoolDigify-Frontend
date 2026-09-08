import boyImage from '../../../assets/no-student-boy-image.png';
import girlImage from '../../../assets/no-student-girl-image.png';
import { memo } from 'react';
import usePermission from "../../../hooks/usePermission";
import { CreditCard, Receipt, Award, ShieldCheck, ChevronRight, Phone } from "lucide-react";

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

  return student?.GENDER?.toLowerCase() === 'female' ? girlImage : boyImage;
}

function getStatusStyles(status) {
  switch (status) {
    case 'Paid':
      return {
        badge: 'border-emerald-500/20 bg-emerald-500/10 text-emerald-300 ring-emerald-500/20',
        dot: 'bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)]',
        text: 'text-emerald-300',
      };
    case 'Partially Paid':
      return {
        badge: 'border-amber-500/20 bg-amber-500/10 text-amber-300 ring-amber-500/20',
        dot: 'bg-amber-400 shadow-[0_0_8px_rgba(251,191,36,0.8)]',
        text: 'text-amber-300',
      };
    case 'Due':
      return {
        badge: 'border-rose-500/20 bg-rose-500/10 text-rose-300 ring-rose-500/20',
        dot: 'bg-rose-400 shadow-[0_0_8px_rgba(244,63,94,0.8)]',
        text: 'text-rose-300',
      };
    default:
      return {
        badge: 'border-slate-500/20 bg-slate-500/10 text-slate-300 ring-slate-500/20',
        dot: 'bg-slate-400',
        text: 'text-slate-300',
      };
  }
}

function getContainerGradient(percentage) {
  // Completely Paid (100%): Deep Emerald Green
  if (percentage >= 100) {
    return 'border-emerald-500/30 bg-gradient-to-br from-emerald-950/40 via-[#111111] to-emerald-900/20';
  }
  
  // High Paid (75% - 99%): Emerald-Amber hybrid
  if (percentage >= 75) {
    return 'border-emerald-500/20 bg-gradient-to-br from-emerald-950/30 via-[#111111] to-amber-950/20';
  }

  // Mid Paid / Half Due (40% - 74%): Warm Amber
  if (percentage >= 40) {
    return 'border-amber-500/30 bg-gradient-to-br from-amber-950/40 via-[#111111] to-rose-950/20';
  }

  // Mostly Unpaid / High Due (1% - 39%): Dark Rose Red
  if (percentage > 0) {
    return 'border-rose-500/40 bg-gradient-to-br from-rose-950/50 via-[#111111] to-rose-900/20';
  }

  // Fully Unpaid / Highest Due (0%): Deep Solid Red
  return 'border-rose-600/50 bg-gradient-to-br from-rose-950/70 via-[#111111] to-rose-900/40';
}

function StudentFeeCard({ student, onViewDetails, onPayFees, onViewTransactions }) {
  const { hasPermission, PERMISSIONS } = usePermission();

  const isRTE = student?.isRTE;
  const statusStyles = getStatusStyles(student?.feeStatus || 'Due');

  const totalSettledAmount = student?.totalSettledAmount || 0;
  const totalDueAmount = student?.dueAmount || 0;
  const totalPayableAmount = student?.totalPayable || 0;

  const dueMonths = student?.dueMonths || 0;
  const upcomingAmount = student?.upcomingAmount || 0;

  const exactTotal = totalSettledAmount + totalDueAmount + upcomingAmount;
  const safeTotal = exactTotal > 0 ? exactTotal : 1;

  const settledProgress = (totalSettledAmount / safeTotal) * 100;
  const dueProgress = (totalDueAmount / safeTotal) * 100;
  const upcomingProgress = (upcomingAmount / safeTotal) * 100;

  const completionPercentage = Math.min(
    100,
    Math.max(0, Math.round((totalSettledAmount / Math.max(totalPayableAmount, 1)) * 100))
  );

  const handlePayFees = () => typeof onPayFees === 'function' && onPayFees(student);
  const handleViewTransactions = () => typeof onViewTransactions === 'function' && onViewTransactions(student);
  const handleViewDetails = () => typeof onViewDetails === 'function' && onViewDetails(student);

  return (
    <article className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-white/10 bg-[#121212] shadow-xl transition-all duration-300 hover:-translate-y-1 hover:border-white/20 hover:shadow-2xl">
      
      {/* Top Header Section */}
      <div className="relative border-b border-white/[0.08] bg-gradient-to-b from-white/[0.05] via-white/[0.02] to-transparent p-4 sm:p-5">
        
        {/* Main Info Row */}
        <div className="flex items-start gap-4">
          
          {/* Avatar Block */}
          <div className="relative shrink-0">
            <div className="relative overflow-hidden rounded-xl border border-white/10 bg-neutral-900 shadow-md">
              <img
                src={getStudentImage(student)}
                loading="lazy"
                alt={student?.STUDENTS_NAME || 'Student'}
                className="h-20 w-16 object-cover transition-transform duration-300 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
            </div>
            
            {/* SR Badge */}
            <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-md border border-white/10 bg-neutral-900/90 px-1.5 py-0.5 text-[10px] font-mono font-bold text-gray-300 shadow-lg backdrop-blur-md">
              <span className="text-indigo-400">#</span>{student?.SR || '—'}
            </div>
          </div>

          {/* Details Content */}
          <div className="min-w-0 flex-1">
            
            {/* Header Top Row: Name + Status */}
            <div className="flex items-center justify-between gap-2">
              <h3
                onClick={handleViewDetails}
                className="group/title inline-flex min-w-0 max-w-full items-center gap-1 cursor-pointer font-semibold text-white transition-colors hover:text-indigo-300"
              >
                <span className="truncate text-base sm:text-lg tracking-tight">
                  {student?.STUDENTS_NAME || 'Student Name'}
                </span>
                <ChevronRight className="h-4 w-4 shrink-0 text-gray-500 transition-transform duration-200 group-hover/title:translate-x-0.5 group-hover/title:text-indigo-400" />
              </h3>

              {/* Status Badge */}
              {isRTE ? (
                <span className="inline-flex shrink-0 items-center gap-1.5 rounded-full border border-amber-500/20 bg-amber-500/10 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-amber-300 ring-1 ring-amber-500/20 backdrop-blur-md">
                  <span className="h-1.5 w-1.5 rounded-full bg-amber-400 animate-pulse shadow-[0_0_8px_rgba(251,191,36,0.8)]" />
                  RTE
                </span>
              ) : (
                <span className={`inline-flex shrink-0 items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider ring-1 backdrop-blur-md ${statusStyles.badge}`}>
                  <span className={`h-1.5 w-1.5 rounded-full animate-pulse ${statusStyles.dot}`} />
                  {student?.feeStatus || 'Due'}
                </span>
              )}
            </div>

            {/* Parent Info */}
            <p className="mt-0.5 truncate text-xs text-gray-400">
              <span className="text-gray-500 font-medium">C/O: </span>
              <span className="text-gray-300 font-medium">{student?.FATHERS_NAME || 'Not available'}</span>
            </p>

            {/* Tags Grid (Class, Roll, Phone) */}
            <div className="mt-3 flex flex-wrap items-center gap-1.5">
              
              {/* Class Tag */}
              <div className="inline-flex max-w-[140px] items-center gap-1 rounded-md border border-white/5 bg-white/[0.04] px-2 py-0.5 text-xs">
                <span className="text-[10px] uppercase font-bold text-gray-500">Cls</span>
                <span className="truncate font-semibold text-gray-200">{student?.CLASS || '—'}</span>
              </div>

              {/* Roll Tag */}
              <div className="inline-flex items-center gap-1 rounded-md border border-white/5 bg-white/[0.04] px-2 py-0.5 text-xs font-mono">
                <span className="text-[10px] uppercase font-bold text-gray-500">Roll</span>
                <span className="font-medium text-gray-200">{student?.ROLL || '—'}</span>
              </div>

              {/* Phone Button */}
              {student?.PHONE && (
                <a
                  href={`tel:${student.PHONE}`}
                  className="inline-flex items-center gap-1 rounded-md border border-indigo-500/20 bg-indigo-500/10 px-2 py-0.5 text-xs text-indigo-300 transition-all hover:bg-indigo-500/20 hover:text-indigo-200 active:scale-95"
                  title={`Call ${student.PHONE}`}
                >
                  <Phone className="h-3 w-3 text-indigo-400" />
                  <span className="font-mono text-[11px] font-medium">{student.PHONE}</span>
                </a>
              )}
            </div>

          </div>
        </div>
      </div>

      {/* Main Body */}
      <div className="flex flex-1 flex-col">
        {isRTE ? (
          <div className="relative flex flex-1 flex-col items-center justify-center overflow-hidden border border-amber-500/20 bg-gradient-to-br from-amber-500/[0.08] via-[#151515] to-[#111111] p-6 text-center shadow-inner">
            <div className="pointer-events-none absolute -right-8 -top-8 h-28 w-28 rounded-full bg-amber-500/10 blur-2xl" />
            <div className="pointer-events-none absolute -bottom-8 -left-8 h-28 w-28 rounded-full bg-amber-500/5 blur-2xl" />

            <div className="relative z-10 flex flex-col items-center max-w-[280px]">
              <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-2xl border border-amber-400/30 bg-amber-500/10 text-amber-400 shadow-md ring-1 ring-amber-400/20">
                <Award className="h-6 w-6" />
              </div>

              <h4 className="flex items-center gap-1.5 text-base font-semibold tracking-wide text-amber-200">
                <ShieldCheck className="h-4 w-4 text-amber-400" />
                Right to Education Act
              </h4>

              <p className="mt-2 text-xs leading-relaxed text-gray-300">
                This student is enrolled under the RTE quota. All standard tuition and recurring fee components are fully exempted.
              </p>

              <div className="mt-4 inline-flex items-center gap-2 rounded-lg border border-amber-500/20 bg-amber-950/40 px-3 py-1.5 text-xs font-medium text-amber-300">
                <span className="h-1.5 w-1.5 rounded-full bg-amber-400" />
                <span>Fee Exemption Active</span>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex flex-1 flex-col justify-between px-4 py-4">
            
            {/* Dynamic Gradient Container for Outstanding & Progress */}
            <div className={`mb-4 rounded-xl border p-3 transition-colors duration-500 ${getContainerGradient(completionPercentage)}`}>
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
                  <span className="font-medium text-gray-200">{completionPercentage}%</span>
                </div>

                <div className="h-2.5 flex overflow-hidden rounded-full bg-neutral-900/80 ring-1 ring-white/10">
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
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex items-center gap-2 pt-3 px-4 py-4">
          <button
            type="button"
            onClick={handlePayFees}
            className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-green-400 px-3 py-2.5 text-sm font-semibold text-neutral-950 transition-colors hover:bg-green-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-green-400/50"
          >
            <CreditCard className="h-4 w-4" />
            {hasPermission(PERMISSIONS.PAY_FEES) ? "Pay fees" : "View fees"}
          </button>

          {hasPermission(PERMISSIONS.PAY_FEES) && (
            <button
              type="button"
              onClick={handleViewTransactions}
              aria-label="View transactions"
              className="flex items-center justify-center rounded-xl bg-yellow-400 p-2.5 text-neutral-900 transition-colors hover:bg-yellow-300"
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