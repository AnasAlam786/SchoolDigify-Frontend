import { useState } from 'react';
import TransactionPopover from './TransactionPopover';
import { apiPost } from '../../../../api/api';
import { Loader2, Trash2, RotateCcw, Printer, ChevronRight, Calendar, Hash, FileText, User, GraduationCap, Tag, CreditCard } from "lucide-react";
import { sendWhatsAppMessage } from '../../../utils/sendWhatsAppMessage';
import { transactionWhatsappMessage } from '../../../utils/watsappMessages';
import { usePrintableTransaction } from './printableTransaction';

function TransactionCard({ transaction, setTransactions, isDeleted }) {
  const getTransactionHTML = usePrintableTransaction();

  const [isRestoreButtonLoading, setRestoreButtonLoading] = useState(false);
  const [isSoftDeleteButtonLoading, setSoftDeleteButtonLoading] = useState(false);

  const [expanded, setExpanded] = useState(false);
  const [openPopover, setOpenPopover] = useState(null);

  const handleSoftDelete = async (id) => {
    setSoftDeleteButtonLoading(true);
    try {
      const response = await apiPost(
        "/api/delete_fee_transaction",
        { transaction_id: id }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to delete transaction");
      }

      setTransactions((prev) =>
        prev.map((transaction) =>
          transaction.id === id
            ? { ...transaction, is_deleted: true }
            : transaction
        )
      );

      showAlert(200, data.message);
    } catch (error) {
      console.error("Error deleting transaction:", error);
      showAlert(error.message);
    } finally {
      setSoftDeleteButtonLoading(false);
    }
  };

  const handleRestore = async (id) => {
    setRestoreButtonLoading(true);
    try {
      const response = await apiPost("/api/restore_fee_transaction", { transaction_id: id });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to restore transaction");
      }

      setTransactions((prev) =>
        prev.map((transaction) =>
          transaction.id === id
            ? { ...transaction, is_deleted: false }
            : transaction
        )
      );

      showAlert(200, data.message);
    } catch (error) {
      console.error("Error restoring transaction:", error);
      showAlert(error.message);
    } finally {
      setRestoreButtonLoading(false);
    }
  };

  const handleWhatsappMessage = async (transaction) => {
    try {
      const whatsappMessage = transactionWhatsappMessage(transaction);
      sendWhatsAppMessage(transaction.phone, whatsappMessage);
    } catch (error) {
      console.error("Error generating WhatsApp message:", error);
      showAlert(500, error);
    }
  };

  const handlePrint = (transaction) => {
    const html = getTransactionHTML(transaction);
    const printWindow = window.open("", "_blank");

    printWindow.document.open();
    printWindow.document.write(html);
    printWindow.document.close();

    printWindow.onload = () => {
      printWindow.focus();
      printWindow.print();
    };
  };

  const paidAmount = transaction.paid_amount ?? 0;
  const discountAmount = transaction.discount ?? 0;
  const totalAmount = paidAmount + discountAmount;

  return (
    <article 
      className={`group relative overflow-hidden rounded-xl sm:rounded-2xl border transition-all duration-300 ${
        isDeleted 
          ? 'border-slate-800/60 bg-slate-950/40 opacity-70' 
          : 'border-slate-800/80 bg-slate-900/90 shadow-lg shadow-slate-950/40 hover:border-slate-700/80'
      }`}
    >
      <div className="p-3.5 sm:p-5 space-y-3 sm:space-y-4">
        {/* Header Row: ID, Date, Actions */}
        <div className="flex flex-wrap items-center justify-between gap-2">
          {/* Metadata */}
          <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 min-w-0">
            <div className="inline-flex items-center gap-1 rounded-md border border-sky-500/20 bg-sky-500/10 px-2 py-1 text-[11px] sm:text-xs font-semibold text-sky-400">
              <Hash className="h-3 w-3 shrink-0" />
              <span className="font-mono truncate max-w-[110px] sm:max-w-none">{transaction.transaction_no}</span>
            </div>

            <div className="inline-flex items-center gap-1 rounded-md border border-slate-800 bg-slate-800/60 px-2 py-1 text-[11px] sm:text-xs font-medium text-slate-400">
              <Calendar className="h-3 w-3 shrink-0 text-slate-500" />
              <span className="truncate">
                {new Date(`${transaction.payment_date}T00:00:00`).toLocaleDateString('en-IN', {
                  day: '2-digit',
                  month: 'short',
                  year: 'numeric'
                })}
              </span>
            </div>

            {isDeleted && (
              <span className="inline-flex items-center rounded-md border border-rose-500/20 bg-rose-500/10 px-1.5 py-0.5 text-[9px] sm:text-[10px] font-bold uppercase tracking-wider text-rose-400">
                Deleted
              </span>
            )}
          </div>

          {/* Actions Bar */}
          <div className="flex items-center gap-1.5 shrink-0 ml-auto sm:ml-0">
            {!isDeleted ? (
              <>
                <button
                  type="button"
                  onClick={() => handleWhatsappMessage(transaction)}
                  aria-label="Send WhatsApp"
                  className="inline-flex items-center gap-1 rounded-lg border border-emerald-500/20 bg-emerald-500/10 px-2 py-1.5 sm:px-3 text-xs font-semibold text-emerald-400 hover:bg-emerald-500/20 transition-all active:scale-95"
                >
                  <i className="fab fa-whatsapp text-sm" />
                  <span className="hidden md:inline">WhatsApp</span>
                </button>

                <button 
                  type="button" 
                  onClick={() => handlePrint(transaction)} 
                  aria-label="Print Transaction"
                  className="inline-flex items-center gap-1 rounded-lg border border-slate-700/60 bg-slate-800/60 px-2 py-1.5 sm:px-3 text-xs font-semibold text-slate-300 hover:border-slate-600 hover:text-white transition-all active:scale-95"
                >
                  <Printer className="h-3.5 w-3.5 text-slate-400" />
                  <span className="hidden md:inline">Print</span>
                </button>

                <button
                  type="button"
                  disabled={isSoftDeleteButtonLoading}
                  onClick={() => handleSoftDelete(transaction.id)}
                  aria-label="Delete Transaction"
                  className="inline-flex items-center gap-1 rounded-lg border border-rose-500/20 bg-rose-500/10 px-2 py-1.5 sm:px-3 text-xs font-semibold text-rose-400 hover:bg-rose-500/20 disabled:opacity-50 transition-all active:scale-95"
                >
                  {isSoftDeleteButtonLoading ? (
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  ) : (
                    <Trash2 className="h-3.5 w-3.5" />
                  )}
                  <span className="hidden md:inline">
                    {isSoftDeleteButtonLoading ? "Deleting..." : "Delete"}
                  </span>
                </button>
              </>
            ) : (
              <button
                type="button"
                disabled={isRestoreButtonLoading}
                onClick={() => handleRestore(transaction.id)}
                className="inline-flex items-center gap-1 rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-1.5 text-xs font-semibold text-emerald-400 hover:bg-emerald-500/20 disabled:opacity-50 transition-all active:scale-95"
              >
                {isRestoreButtonLoading ? (
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                ) : (
                  <RotateCcw className="h-3.5 w-3.5" />
                )}
                <span>{isRestoreButtonLoading ? "Restoring..." : "Restore"}</span>
              </button>
            )}
          </div>
        </div>

        {/* Financial Stat Grid (Mobile Friendly) */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3 rounded-xl border border-slate-800/80 bg-slate-950/60 p-2.5 sm:p-3.5">
          {/* Total Fee */}
          <div className="rounded-lg border border-slate-800/60 bg-slate-900/60 p-2 sm:border-none sm:bg-transparent sm:p-0">
            <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">Total Fee</p>
            <p className="mt-0.5 text-xs sm:text-base font-bold text-slate-200 tabular-nums">
              ₹{totalAmount.toLocaleString('en-IN')}
            </p>
          </div>

          {/* Discount */}
          {discountAmount > 0 && (
            <div className="rounded-lg border border-amber-500/20 bg-amber-500/5 p-2 sm:border-none sm:bg-transparent sm:p-0 sm:border-l sm:border-slate-800/80 sm:pl-4">
              <p className="text-[10px] font-semibold uppercase tracking-wider text-amber-500/90">Discount</p>
              <p className="mt-0.5 text-xs sm:text-base font-bold text-amber-400 tabular-nums">
                -₹{discountAmount.toLocaleString('en-IN')}
              </p>
            </div>
          )}

          {/* Settled */}
          <div className={`rounded-lg border border-emerald-500/20 bg-emerald-500/5 p-2 sm:border-none sm:bg-transparent sm:p-0 sm:border-l sm:border-slate-800/80 sm:pl-4 ${discountAmount === 0 ? 'col-span-1' : ''}`}>
            <p className="text-[10px] font-semibold uppercase tracking-wider text-emerald-500/90">Settled</p>
            <p className="mt-0.5 text-xs sm:text-base font-extrabold text-emerald-400 tabular-nums">
              ₹{paidAmount.toLocaleString('en-IN')}
            </p>
          </div>

          {/* Payment Mode */}
          <div className={`rounded-lg border border-slate-800/60 bg-slate-900/60 p-2 sm:border-none sm:bg-transparent sm:p-0 sm:border-l sm:border-slate-800/80 sm:pl-4 flex flex-col justify-center ${discountAmount === 0 ? 'col-span-2 sm:col-span-1' : ''}`}>
            <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">Payment Mode</p>
            <div className="mt-0.5 inline-flex items-center gap-1 text-xs sm:text-sm font-semibold text-slate-300 capitalize">
              <CreditCard className="h-3 w-3 text-slate-400 shrink-0" />
              <span className="truncate">{transaction.payment_mode}</span>
            </div>
          </div>
        </div>

        {/* Remark */}
        {transaction.remark && (
          <div className="flex items-start gap-2 rounded-lg bg-slate-950/40 px-2.5 py-1.5 border border-slate-800/40 text-[11px] sm:text-xs text-slate-400">
            <FileText className="h-3.5 w-3.5 mt-0.5 shrink-0 text-slate-500" />
            <span className="leading-snug break-words">{transaction.remark}</span>
          </div>
        )}
      </div>

      {/* Accordion Toggle */}
      <button 
        type="button" 
        onClick={() => setExpanded((value) => !value)} 
        className="flex w-full items-center justify-between border-t border-slate-800/80 bg-slate-950/40 px-3.5 sm:px-5 py-2.5 transition-colors hover:bg-slate-800/40 focus:outline-none"
      >
        <div className="flex items-center gap-2 min-w-0">
          <ChevronRight className={`h-4 w-4 shrink-0 text-slate-400 transition-transform duration-200 ${expanded ? 'rotate-90 text-sky-400' : ''}`} />
          <span className="text-xs font-semibold text-slate-300 truncate">Fee Breakdown</span>
          <span className="rounded-full bg-slate-800/80 px-2 py-0.5 text-[10px] font-medium text-slate-400 border border-slate-700/50 shrink-0">
            {transaction.siblings.length}
          </span>
        </div>
        <span className="text-[10px] sm:text-[11px] font-medium text-slate-500 shrink-0 ml-2">
          {expanded ? 'Hide' : 'View'}
        </span>
      </button>

      {/* Expanded Details */}
      {expanded && (
        <div className="space-y-3 border-t border-slate-800/80 bg-slate-950/60 p-3 sm:p-5">
          {transaction.siblings.map((sibling, index) => {
            const popoverId = `${sibling.studentName}-${index}`;
            const monthlyTotal = sibling.fees.monthly?.total || 0;
            const oneTimeTotal = sibling.fees.oneTime?.reduce((sum, fee) => sum + fee.amount, 0) || 0;
            const studentTotal = monthlyTotal + oneTimeTotal;

            return (
              <div key={`${sibling.studentName}-${index}`} className="rounded-xl border border-slate-800/80 bg-slate-900/90 p-3 sm:p-4 space-y-2.5">
                {/* Student Info */}
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800/80 pb-2.5">
                  <div className="flex items-center gap-2 min-w-0">
                    <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-sky-500/10 border border-sky-500/20 text-sky-400">
                      <User className="h-3.5 w-3.5" />
                    </div>
                    <div className="min-w-0">
                      <h3 className="text-xs sm:text-sm font-semibold text-slate-100 truncate">{sibling.studentName}</h3>
                      <div className="flex flex-wrap items-center gap-1.5 text-[10px] sm:text-[11px] text-slate-400">
                        <span className="flex items-center gap-0.5">
                          <GraduationCap className="h-3 w-3 text-slate-500" />
                          {sibling.className}
                        </span>
                        <span className="text-slate-600">•</span>
                        <span className="flex items-center gap-0.5">
                          <Tag className="h-3 w-3 text-slate-500" />
                          Roll: {sibling.rollNo}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="inline-flex items-center gap-1 rounded-md border border-emerald-500/30 bg-emerald-500/10 px-2 py-0.5 text-emerald-400 ml-auto sm:ml-0">
                    <span className="text-[9px] font-bold uppercase tracking-wider">Subtotal:</span>
                    <span className="text-xs font-extrabold tabular-nums">₹{studentTotal.toLocaleString('en-IN')}</span>
                  </div>
                </div>

                {/* Items List */}
                <div className="space-y-1.5">
                  {sibling.fees.monthly && (
                    <div className="relative flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 rounded-lg border border-slate-800/80 bg-slate-950/40 p-2 transition-all hover:border-slate-700/80">
                      <button 
                        type="button" 
                        onPointerDown={(event) => event.stopPropagation()}
                        onClick={(event) => {
                          const anchorElement = event.currentTarget;
                          setOpenPopover((currentPopover) => (
                            currentPopover?.id === popoverId
                              ? null
                              : { id: popoverId, anchorElement }
                          ));
                        }} 
                        className="group flex items-center gap-2 text-left focus:outline-none min-w-0"
                      >
                        <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md border border-indigo-500/20 bg-indigo-500/10 text-indigo-400">
                          <Calendar className="h-3 w-3" />
                        </div>
                        <div className="min-w-0">
                          <p className="text-xs font-semibold text-slate-200 group-hover:text-indigo-300 transition-colors truncate">
                            {sibling.fees.monthly.label}
                          </p>
                          <p className="text-[10px] text-slate-500 underline decoration-dotted truncate">
                            {sibling.fees.monthly.months.length} month{sibling.fees.monthly.months.length > 1 ? 's' : ''} • Inspect
                          </p>
                        </div>
                      </button>

                      <div className="flex items-center justify-between sm:justify-end border-t sm:border-t-0 border-slate-800/60 pt-1 sm:pt-0">
                        <span className="text-[10px] text-slate-500 sm:hidden">Amount:</span>
                        <span className="text-xs font-bold text-slate-200 tabular-nums">
                          ₹{sibling.fees.monthly.total.toLocaleString('en-IN')}
                        </span>
                      </div>

                      {openPopover?.id === popoverId && (
                        <TransactionPopover
                          months={sibling.fees.monthly.months}
                          anchorElement={openPopover.anchorElement}
                          onClose={() => setOpenPopover(null)}
                        />
                      )}
                    </div>
                  )}

                  {sibling.fees.oneTime?.map((fee) => (
                    <div key={`${fee.name}-${fee.amount}`} className="flex items-center justify-between rounded-lg border border-slate-800/80 bg-slate-950/40 p-2">
                      <div className="flex items-center gap-2 min-w-0">
                        <div className="h-1.5 w-1.5 rounded-full bg-slate-500 shrink-0" />
                        <span className="text-xs font-medium text-slate-300 truncate">{fee.name}</span>
                      </div>
                      <span className="text-xs font-semibold text-slate-200 tabular-nums shrink-0 ml-2">
                        ₹{fee.amount.toLocaleString('en-IN')}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </article>
  );
}

export default TransactionCard;