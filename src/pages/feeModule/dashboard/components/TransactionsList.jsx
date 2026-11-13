import { useState } from 'react';
import { useInfiniteQuery } from '@tanstack/react-query';
import {
  Banknote,
  CalendarDays,
  ChevronDown,
  ChevronRight,
  CircleAlert,
  CreditCard,
  FileText,
  LoaderCircle,
  MessageCircle,
  Printer,
  ReceiptText,
  RefreshCw,
  UsersRound,
} from 'lucide-react';
import { apiGet } from '../../../../api/api';
import useTheme from '../../../../components/useTheme.js';
import TransactionModal from '../../../utils/feeTransactionsModal/TransactionModal';
import { sendSmsMessage, sendWhatsAppMessage } from '../../../utils/sendWhatsAppMessage';
import { transactionWhatsappMessage } from '../../../utils/watsappMessages';

const PAGE_SIZE = 10;

const getLocalDate = () => {
  const date = new Date();
  date.setMinutes(date.getMinutes() - date.getTimezoneOffset());
  return date.toISOString().slice(0, 10);
};

const formatCurrency = (value) => new Intl.NumberFormat('en-IN', {
  style: 'currency',
  currency: 'INR',
  minimumFractionDigits: 0,
  maximumFractionDigits: 2,
}).format(Number(value || 0));

const formatDate = (value) => {
  if (!value) return 'Date unavailable';
  const date = new Date(`${value}T00:00:00`);
  if (Number.isNaN(date.getTime())) return value;
  return new Intl.DateTimeFormat('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(date);
};

const escapeHtml = (value) => String(value ?? '')
  .replaceAll('&', '&amp;')
  .replaceAll('<', '&lt;')
  .replaceAll('>', '&gt;')
  .replaceAll('"', '&quot;')
  .replaceAll("'", '&#039;');

function getMessageTransaction(transaction) {
  return {
    ...transaction,
    siblings: (transaction.students || []).map((student) => {
      const monthlyFees = (student.fees || []).filter(
        (fee) => String(fee.fee_type || '').toLowerCase().includes('monthly')
      );
      const otherFees = (student.fees || []).filter(
        (fee) => !String(fee.fee_type || '').toLowerCase().includes('monthly')
      );

      return {
        studentName: student.student_name || 'Student',
        className: student.class_name || '—',
        rollNo: student.roll || '—',
        fees: {
          monthly: monthlyFees.length ? {
            label: monthlyFees.map((fee) => fee.fee_type || 'Monthly fee').join(', '),
            months: monthlyFees.map((fee) => fee.period_name || 'Fee'),
            total: monthlyFees.reduce((sum, fee) => sum + Number(fee.paid_amount || 0), 0),
          } : null,
          oneTime: otherFees.map((fee) => ({
            name: fee.period_name || fee.fee_type || 'Fee',
            amount: Number(fee.paid_amount || 0),
          })),
        },
      };
    }),
  };
}

function printTransaction(transaction) {
  const students = (transaction.students || []).map((student) => {
    const feeRows = (student.fees || []).map((fee) => `
      <tr>
        <td>${escapeHtml(fee.fee_type || 'Fee')}</td>
        <td>${escapeHtml(fee.period_name || '—')}</td>
        <td class="amount">${escapeHtml(formatCurrency(fee.paid_amount))}</td>
      </tr>
    `).join('');

    return `
      <section class="student">
        <div class="student-heading">
          <strong>${escapeHtml(student.student_name || 'Student')}</strong>
          <span>${escapeHtml(student.class_name || '—')} · Roll ${escapeHtml(student.roll || '—')}</span>
        </div>
        <table>
          <thead><tr><th>Fee</th><th>Period</th><th class="amount">Paid</th></tr></thead>
          <tbody>${feeRows || '<tr><td colspan="3">No fee details</td></tr>'}</tbody>
        </table>
      </section>
    `;
  }).join('');

  const printWindow = window.open('', '_blank');
  if (!printWindow) {
    window.showAlert?.(400, 'Allow pop-ups to print this receipt.');
    return;
  }

  printWindow.onload = () => {
    printWindow.focus();
    printWindow.print();
  };
  printWindow.document.write(`<!doctype html>
    <html><head><title>Fee receipt ${escapeHtml(transaction.transaction_no || '')}</title>
      <style>
        *{box-sizing:border-box}body{font:14px Arial,sans-serif;color:#172033;margin:32px}
        h1{font-size:22px;margin:0 0 6px}.muted{color:#64748b}.meta{display:grid;grid-template-columns:1fr 1fr;gap:12px;padding:16px;margin:20px 0;background:#f8fafc;border:1px solid #e2e8f0;border-radius:10px}
        .student{margin:18px 0;break-inside:avoid}.student-heading{display:flex;justify-content:space-between;gap:12px;padding:10px 12px;background:#f1f5f9;border:1px solid #e2e8f0}.student-heading span{color:#64748b}
        table{width:100%;border-collapse:collapse}th,td{text-align:left;padding:9px 12px;border:1px solid #e2e8f0}.amount{text-align:right}
        .total{margin:20px 0 0 auto;width:260px;display:flex;justify-content:space-between;font-size:17px;font-weight:bold}
        @media print{body{margin:0}}
      </style>
    </head><body>
      <h1>Fee payment receipt</h1><div class="muted">Receipt ${escapeHtml(transaction.transaction_no || '—')}</div>
      <div class="meta">
        <div><span class="muted">Payment date</span><br><strong>${escapeHtml(formatDate(transaction.payment_date))}</strong></div>
        <div><span class="muted">Payment mode</span><br><strong>${escapeHtml(transaction.payment_mode || '—')}</strong></div>
        <div><span class="muted">Students</span><br><strong>${(transaction.students || []).length}</strong></div>
        <div><span class="muted">Discount</span><br><strong>${escapeHtml(formatCurrency(transaction.discount))}</strong></div>
      </div>
      ${students}
      <div class="total">
        <span>Amount paid</span>
        <span>${escapeHtml(formatCurrency(transaction.paid_amount))}</span>
      </div>
      ${transaction.remark ? `<p class="muted">Note: ${escapeHtml(transaction.remark)}</p>` : ''}
    </body></html>`);
  printWindow.document.close();
}

function ActionButton({ label, icon: Icon, onClick, disabled, tone, isDark }) {
  const tones = {
    blue: isDark
      ? 'border-sky-400/20 bg-sky-400/10 text-sky-200 hover:bg-sky-400/15'
      : 'border-sky-200 bg-sky-50 text-sky-700 hover:bg-sky-100',
    green: isDark
      ? 'border-emerald-400/20 bg-emerald-400/10 text-emerald-200 hover:bg-emerald-400/15'
      : 'border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-100',
    neutral: isDark
      ? 'border-white/10 bg-white/[0.04] text-slate-200 hover:bg-white/[0.08]'
      : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50',
  };

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={label}
      title={label}
      className={`inline-flex h-9 items-center justify-center gap-2 rounded-xl border px-3 text-xs font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 disabled:cursor-not-allowed disabled:opacity-40 ${tones[tone]}`}
    >
      <Icon size={15} />
      <span className="hidden sm:inline">{label}</span>
    </button>
  );
}

function TransactionCard({ transaction, isDark, onOpenTransaction }) {
  const [expanded, setExpanded] = useState(false);
  const students = Array.isArray(transaction.students) ? transaction.students : [];
  const firstStudent = students[0];
  const actionTransaction = getMessageTransaction(transaction);
  const phone = transaction.phone || firstStudent?.phone;
  const studentSessionId = firstStudent?.student_session_id;
  const feeCount = students.reduce((total, student) => total + (student.fees || []).length, 0);

  const sendMessage = (channel) => {
    try {
      const message = transactionWhatsappMessage(actionTransaction);
      if (channel === 'whatsapp') {
        sendWhatsAppMessage(phone, message);
      } else {
        sendSmsMessage(phone, message);
      }
    } catch (error) {
      window.showAlert?.(400, error.message || 'Unable to open the messaging app.');
    }
  };

  const cardColors = isDark
    ? 'border-[#2A2A2A] bg-[#111111] shadow-black/20 hover:border-[#3A3A3A]'
    : 'border-slate-200 bg-white shadow-slate-200/60 hover:border-slate-300';
  const secondaryText = isDark ? 'text-slate-400' : 'text-slate-500';

  return (
    <article className={`overflow-hidden rounded-2xl border shadow-lg transition-colors ${cardColors}`}>
      <div className="p-4 sm:p-5">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <span className={`inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 font-mono text-xs font-semibold ${isDark ? 'bg-sky-400/10 text-sky-200' : 'bg-sky-50 text-sky-700'}`}>
                <ReceiptText size={13} />
                {transaction.transaction_no || `Transaction ${transaction.id}`}
              </span>
              <span className={`inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-medium ${isDark ? 'bg-white/[0.05] text-slate-300' : 'bg-slate-100 text-slate-600'}`}>
                <CalendarDays size={13} />
                {formatDate(transaction.payment_date)}
              </span>
              {transaction.payment_mode && (
                <span className={`inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-medium capitalize ${isDark ? 'bg-white/[0.05] text-slate-300' : 'bg-slate-100 text-slate-600'}`}>
                  <CreditCard size={13} />
                  {transaction.payment_mode}
                </span>
              )}
            </div>

            <div className="mt-4 flex flex-wrap items-center gap-x-3 gap-y-1">
              <div className="flex min-w-0 items-center gap-2">
                <UsersRound size={15} className={secondaryText} />
                <p className={`truncate text-sm font-semibold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                  {students.slice(0, 2).map((student) => student.student_name || 'Student').join(', ') || 'Student details unavailable'}
                  {students.length > 2 ? ` +${students.length - 2} more` : ''}
                </p>
              </div>
              <span className={`text-xs ${secondaryText}`}>
                {students.length} student{students.length === 1 ? '' : 's'} · {feeCount} fee item{feeCount === 1 ? '' : 's'}
              </span>
            </div>
            {transaction.remark && (
              <p className={`mt-2 flex items-start gap-1.5 text-xs ${secondaryText}`}>
                <FileText size={13} className="mt-0.5 shrink-0" />
                <span className="line-clamp-2">{transaction.remark}</span>
              </p>
            )}
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3 lg:justify-end">
            <div className="min-w-28 lg:text-right">
              <p className={`text-[10px] font-semibold uppercase tracking-[0.16em] ${secondaryText}`}>Amount paid</p>
              <p className={`mt-1 text-xl font-bold tabular-nums ${isDark ? 'text-emerald-300' : 'text-emerald-700'}`}>
                {formatCurrency(transaction.paid_amount)}
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-1.5">
              <ActionButton
                label="WhatsApp"
                icon={MessageCircle}
                onClick={() => sendMessage('whatsapp')}
                disabled={!phone}
                tone="green"
                isDark={isDark}
              />
              <ActionButton
                label="SMS"
                icon={MessageCircle}
                onClick={() => sendMessage('sms')}
                disabled={!phone}
                tone="blue"
                isDark={isDark}
              />
              <ActionButton
                label="Print"
                icon={Printer}
                onClick={() => printTransaction(transaction)}
                tone="neutral"
                isDark={isDark}
              />
              <ActionButton
                label="Open"
                icon={ReceiptText}
                onClick={() => onOpenTransaction({
                  studentSessionId,
                  phone,
                })}
                disabled={!studentSessionId}
                tone="neutral"
                isDark={isDark}
              />
            </div>
          </div>
        </div>
      </div>

      <button
        type="button"
        onClick={() => setExpanded((value) => !value)}
        aria-expanded={expanded}
        className={`flex w-full items-center justify-between border-t px-4 py-3 text-left transition-colors sm:px-5 ${isDark ? 'border-[#2A2A2A] bg-[#111111] text-slate-300 hover:bg-[#181818]' : 'border-slate-100 bg-slate-50/80 text-slate-700 hover:bg-slate-100'}`}
      >
        <span className="flex items-center gap-2 text-xs font-semibold">
          <ChevronDown size={15} className={`transition-transform ${expanded ? 'rotate-180' : ''}`} />
          Transaction details
          <span className={`rounded-full px-2 py-0.5 text-[10px] ${isDark ? 'bg-[#1A1A1A] text-slate-300' : 'bg-white text-slate-600'}`}>
            {feeCount}
          </span>
        </span>
        <span className={`text-[11px] ${secondaryText}`}>{expanded ? 'Hide details' : 'View breakdown'}</span>
      </button>

      {expanded && (
        <div className={`space-y-3 border-t p-4 sm:p-5 ${isDark ? 'border-[#2A2A2A] bg-[#111111]' : 'border-slate-100 bg-slate-50/60'}`}>
          {students.map((student) => (
            <section
              key={student.student_session_id}
              className={`overflow-hidden rounded-xl border ${isDark ? 'border-[#2A2A2A] bg-[#1A1A1A]' : 'border-slate-200 bg-white'}`}
            >
              <div className={`flex flex-wrap items-center justify-between gap-2 border-b px-3.5 py-3 ${isDark ? 'border-[#2A2A2A]' : 'border-slate-100'}`}>
                <div>
                  <p className={`text-sm font-semibold ${isDark ? 'text-slate-100' : 'text-slate-900'}`}>
                    {student.student_name || 'Student'}
                  </p>
                  <p className={`mt-0.5 text-xs ${secondaryText}`}>
                    {[student.class_name, student.roll ? `Roll ${student.roll}` : null, student.father_name].filter(Boolean).join(' · ') || 'Student details'}
                  </p>
                </div>
                <span className={`text-sm font-semibold tabular-nums ${isDark ? 'text-slate-200' : 'text-slate-700'}`}>
                  {formatCurrency(student.total_allocated_amount)}
                </span>
              </div>
              <div className={`divide-y ${isDark ? 'divide-[#2A2A2A]' : 'divide-slate-200/70'}`}>
                {(student.fees || []).map((fee) => (
                  <div
                    key={fee.fee_data_id}
                    className="flex flex-wrap items-center justify-between gap-2 px-3.5 py-2.5"
                  >
                    <div className="min-w-0">
                      <p className={`truncate text-xs font-medium ${isDark ? 'text-slate-200' : 'text-slate-700'}`}>
                        {fee.period_name || fee.fee_type || 'Fee'}
                      </p>
                      <p className={`mt-0.5 text-[11px] capitalize ${secondaryText}`}>
                        {[fee.fee_type, fee.payment_status].filter(Boolean).join(' · ') || 'Fee payment'}
                        {Number(fee.late_fee || 0) > 0 ? ` · Late fee ${formatCurrency(fee.late_fee)}` : ''}
                      </p>
                    </div>
                    <span className={`text-xs font-semibold tabular-nums ${isDark ? 'text-slate-200' : 'text-slate-700'}`}>
                      {formatCurrency(fee.paid_amount)}
                    </span>
                  </div>
                ))}
              </div>
            </section>
          ))}
          <div className={`flex flex-wrap justify-between gap-2 border-t pt-3 text-xs ${isDark ? 'border-[#2A2A2A] text-slate-400' : 'border-slate-200 text-slate-500'}`}>
            <span>{transaction.payment_mode || 'Payment'} · {formatDate(transaction.payment_date)}</span>
            {Number(transaction.discount || 0) > 0 && (
              <span>Discount: {formatCurrency(transaction.discount)}</span>
            )}
            <span className={`font-semibold ${isDark ? 'text-slate-200' : 'text-slate-800'}`}>
              Total allocated {formatCurrency(transaction.total_allocated_amount)}
            </span>
          </div>
        </div>
      )}
    </article>
  );
}

export default function TransactionsList() {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const [selectedDate, setSelectedDate] = useState(getLocalDate);
  const [transactionModalStudent, setTransactionModalStudent] = useState(null);

  const transactionsQuery = useInfiniteQuery({
    queryKey: ['fee-dashboard', 'transactions', selectedDate],
    queryFn: async ({ pageParam, signal }) => {
      const query = new URLSearchParams({
        offset: String(pageParam),
        limit: String(PAGE_SIZE),
        start_date: selectedDate,
        end_date: selectedDate,
      });
      const response = await apiGet(
        `/api/fee-dashboard/transactions-data?${query.toString()}`,
        { signal }
      );
      const payload = await response.json();
      if (!response.ok) {
        throw new Error(payload?.error || 'Unable to load transactions.');
      }

      const page = Array.isArray(payload.transactions_data) ? payload.transactions_data : [];
      return {
        transactions: page,
        hasMore: Boolean(payload.has_more),
        totalCount: Number(payload.total_count ?? page.length),
      };
    },
    initialPageParam: 0,
    getNextPageParam: (lastPage, pages) => (
      lastPage.hasMore
        ? pages.reduce((offset, page) => offset + page.transactions.length, 0)
        : undefined
    ),
  });

  const transactions = transactionsQuery.data?.pages.flatMap((page) => page.transactions) || [];
  const totalCount = transactionsQuery.data?.pages[0]?.totalCount || 0;
  const loading = transactionsQuery.isLoading;
  const error = transactionsQuery.isError && !transactionsQuery.data
    ? transactionsQuery.error?.message
    : '';
  const loadMoreError = transactionsQuery.isFetchNextPageError
    ? transactionsQuery.error?.message
    : '';
  const loadingMore = transactionsQuery.isFetchingNextPage;
  const hasMore = transactionsQuery.hasNextPage;

  const panelColors = isDark
    ? 'border-[#2A2A2A] bg-[#1A1A1A] text-white'
    : 'border-slate-200 bg-white text-slate-900';
  const mutedText = isDark ? 'text-slate-400' : 'text-slate-500';

  return (
    <>
      <section className={`overflow-hidden rounded-2xl border shadow-xl ${panelColors}`}>
        <header className={`flex flex-col gap-4 border-b px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-5 ${isDark ? 'border-[#2A2A2A] bg-[#1A1A1A]' : 'border-slate-100 bg-gradient-to-r from-slate-50 to-white'}`}>
          <div>
            <p className={`text-[10px] font-semibold uppercase tracking-[0.2em] ${mutedText}`}>Recent activity</p>
            <h2 className="mt-1 text-lg font-bold tracking-tight">Fee transactions</h2>
            <p className={`mt-1 text-xs ${mutedText}`}>Latest payments, with a clear breakdown for every student.</p>
          </div>
          <div className="flex flex-wrap items-end gap-3">
          <label className="flex flex-col gap-1">
            <span className={`text-[10px] font-semibold uppercase tracking-[0.14em] ${mutedText}`}>Transaction date</span>
            <span className="relative">
              <CalendarDays size={15} className={`pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 ${mutedText}`} />
              <input
                type="date"
                value={selectedDate}
                disabled={loadingMore}
                onChange={(event) => {
                  if (event.target.value) setSelectedDate(event.target.value);
                }}
                className={`h-10 rounded-xl border pl-9 pr-3 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500 ${isDark ? 'border-[#3A3A3A] bg-[#111111] text-gray-200 [color-scheme:dark]' : 'border-slate-200 bg-white text-slate-700'}`}
              />
            </span>
          </label>
          <div className={`inline-flex h-10 items-center gap-2 rounded-xl border px-3 text-xs font-semibold ${isDark ? 'border-[#3A3A3A] bg-[#111111] text-slate-200' : 'border-slate-200 bg-white text-slate-600'}`}>
            <Banknote size={14} className={isDark ? 'text-emerald-300' : 'text-emerald-600'} />
            {loading ? 'Counting…' : `${totalCount} transaction${totalCount === 1 ? '' : 's'}`}
          </div>
          </div>
        </header>

        <div className="space-y-3 p-3 sm:p-4">
          {loading && (
            [...Array(3)].map((_, index) => (
              <div
                key={index}
                className={`h-36 animate-pulse rounded-2xl border ${isDark ? 'border-[#2A2A2A] bg-[#111111]' : 'border-slate-100 bg-slate-50'}`}
              />
            ))
          )}

          {!loading && error && (
            <div className={`rounded-2xl border px-5 py-10 text-center ${isDark ? 'border-rose-400/20 bg-rose-400/[0.04]' : 'border-rose-200 bg-rose-50'}`}>
              <CircleAlert className={`mx-auto h-8 w-8 ${isDark ? 'text-rose-300' : 'text-rose-600'}`} />
              <p className={`mt-3 text-sm font-semibold ${isDark ? 'text-white' : 'text-slate-900'}`}>Transactions couldn’t be loaded</p>
              <p className={`mt-1 text-xs ${mutedText}`}>{error}</p>
              <button
                type="button"
                onClick={() => transactionsQuery.refetch()}
                className={`mt-4 inline-flex items-center gap-2 rounded-xl border px-3.5 py-2 text-xs font-semibold ${isDark ? 'border-white/10 bg-white/5 text-white hover:bg-white/10' : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'}`}
              >
                <RefreshCw size={14} />
                Try again
              </button>
            </div>
          )}

          {!loading && !error && transactions.length === 0 && (
            <div className={`rounded-2xl border px-5 py-10 text-center ${isDark ? 'border-[#2A2A2A] bg-[#111111]' : 'border-slate-100 bg-slate-50/70'}`}>
              <ReceiptText className={`mx-auto h-8 w-8 ${mutedText}`} />
              <p className={`mt-3 text-sm font-semibold ${isDark ? 'text-white' : 'text-slate-900'}`}>No transactions yet</p>
              <p className={`mt-1 text-xs ${mutedText}`}>Fee payments will appear here as they are recorded.</p>
            </div>
          )}

          {!loading && !error && transactions.map((transaction) => (
            <TransactionCard
              key={transaction.id}
              transaction={transaction}
              isDark={isDark}
              onOpenTransaction={setTransactionModalStudent}
            />
          ))}

          {!loading && !error && hasMore && (
            <div className="flex flex-col items-center gap-2 pt-2">
              {loadMoreError && <p className={`text-xs ${isDark ? 'text-rose-300' : 'text-rose-600'}`}>{loadMoreError}</p>}
              <button
                type="button"
                onClick={() => transactionsQuery.fetchNextPage()}
                disabled={loadingMore}
                className={`inline-flex min-w-40 items-center justify-center gap-2 rounded-xl border px-4 py-2.5 text-xs font-semibold transition-colors disabled:cursor-wait disabled:opacity-60 ${isDark ? 'border-white/10 bg-white/[0.05] text-slate-200 hover:bg-white/[0.09]' : 'border-slate-200 bg-white text-slate-700 shadow-sm hover:bg-slate-50'}`}
              >
                {loadingMore
                  ? <LoaderCircle size={15} className="animate-spin" />
                  : <ChevronRight size={15} />}
                {loadingMore ? 'Loading…' : loadMoreError ? 'Retry loading more' : 'Load 10 more'}
              </button>
            </div>
          )}
        </div>
      </section>

      {transactionModalStudent && (
        <TransactionModal
          transactionModalStudent={transactionModalStudent}
          onClose={() => setTransactionModalStudent(null)}
        />
      )}
    </>
  );
}