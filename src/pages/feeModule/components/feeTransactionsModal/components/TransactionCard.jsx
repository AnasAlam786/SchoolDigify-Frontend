import { useState } from 'react';
import TransactionPopover from './TransactionPopover';
import { apiPost } from '../../../../../api/api';
import { Loader2, Trash2, RotateCcw } from "lucide-react";
import { sendWhatsAppMessage } from '../../../../utils/sendWhatsAppMessage';
import { transactionWhatsappMessage } from '../../../../utils/watsappMessages';
import { usePrintableTransaction } from './printableTransaction';

function TransactionCard({ transaction, setTransactions, isDeleted, openPopoverId, setOpenPopoverId }) {
  const getTransactionHTML = usePrintableTransaction();
  
  const [expanded, setExpanded] = useState(false);
  const isPopoverOpen = openPopoverId === `${transaction.id}-popover`;

  const [isRestoreButtonLoading, setRestoreButtonLoading] = useState(false);
  const [isSoftDeleteButtonLoading, setSoftDeleteButtonLoading] = useState(false);

  const handleSoftDelete = async (id) => {
    setSoftDeleteButtonLoading(true)
    try {
      const response = await apiPost(
        "/api/delete_fee_transaction",
        { transaction_id: id }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to delete transaction");
      }


      // Move transaction from active → deleted
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
      setSoftDeleteButtonLoading(false)
    }
  };

  const handleRestore = async (id) => {
    setRestoreButtonLoading(true)
    try {
      const response = await apiPost("/api/restore_fee_transaction", { transaction_id: id });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to restore transaction");
      }

      // Move transaction from deleted → active
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
      setRestoreButtonLoading(false)
    }
  };

  const handleWhatsappMessage = async (transaction) => {
    setMessageButtonLoading(true)
    try {
      const whatsappMessage = transactionWhatsappMessage(transaction)
      sendWhatsAppMessage(transaction.phone, whatsappMessage)

    } catch (error) {
      console.error("Error generating WhatsApp message:", error);
      showAlert(500, error);
    } finally {
      setMessageButtonLoading(false)
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

  return (
    <article className={`transaction-card overflow-hidden rounded-xl border shadow-lg ${isDeleted ? 'border-slate-700/40 bg-[#172033] opacity-80' : 'border-[#2d3748] bg-[#1a2436]'}`}>
      <div className="border-b border-[#2d3748]/60 p-4 sm:p-5">
        <div className="mb-4 flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div className="flex-1 space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-md border border-slate-700/50 bg-[#1e293b] px-2.5 py-1">
                <svg className="h-3.5 w-3.5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14" />
                </svg>
                <span className="font-mono text-xs font-semibold text-slate-200">{transaction.transaction_no}</span>
              </span>
              <span className="text-slate-600">•</span>
              <span className="text-xs text-slate-400">
                {new Date(`${transaction.payment_date}T00:00:00`).toLocaleDateString('en-IN',
                  {
                    day: '2-digit',
                    month: 'short',
                    year: 'numeric'
                  })}
              </span>
            </div>

            <div class="flex flex-wrap items-center gap-2">

              <div class="inline-flex items-center gap-1.5 rounded-lg border border-slate-600/40 bg-slate-800/60 px-3 py-1.5">
                <span class="text-xs font-medium uppercase tracking-wide text-slate-400">
                  Fee Amount
                </span>
                <span class="text-sm font-semibold text-slate-200">
                  ₹{transaction.paid_amount}
                </span>
              </div>
              {transaction.discount > 0 && (
                <div class="inline-flex items-center gap-1.5 rounded-lg border border-amber-500/30 bg-amber-500/10 px-3 py-1.5">
                  <span class="text-xs font-medium uppercase tracking-wide text-amber-400">
                    Discount
                  </span>
                  <span class="text-sm font-semibold text-amber-300">
                    ₹{transaction.discount}
                  </span>
                </div>
              )}
              <div class="inline-flex items-center gap-1.5 rounded-lg border border-emerald-500/30 bg-emerald-500/15 px-3 py-1.5">
                <span class="text-xs font-medium uppercase tracking-wide text-emerald-400">
                  Amount Paid
                </span>
                <span class="text-sm font-bold text-emerald-300">
                  ₹{((transaction.paid_amount ?? 0) - (transaction.discount ?? 0))}
                </span>
              </div>

              <div class="inline-flex items-center gap-1.5 rounded-lg border border-slate-700/50 bg-[#1e293b] px-2.5 py-1.5">
                <svg class="h-3.5 w-3.5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z">
                  </path>
                </svg>

                <span class="text-xs font-medium text-slate-300">
                  {transaction.payment_mode}
                </span>
              </div>

            </div>


            <div className="flex items-start gap-2">
              <svg className="mt-0.5 h-4 w-4 shrink-0 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
              </svg>
              <span className="text-xs leading-relaxed text-slate-400">{transaction.remark || "No remark"}</span>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            {!isDeleted ? (
              <>
                <button
                  type="button"
                  onClick={() => handleWhatsappMessage(transaction)}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-emerald-500/30 bg-emerald-600/20 px-3 py-2 text-xs font-medium text-emerald-300 transition-all hover:bg-emerald-600/30 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <i className="fab fa-whatsapp text-base" />
                  <span className="hidden sm:inline">"WhatsApp"</span>
                </button>

                <button type="button" onClick={() => handlePrint(transaction)} className="inline-flex items-center gap-1.5 rounded-lg border border-violet-500/30 bg-violet-600/20 px-3 py-2 text-xs font-medium text-violet-300 transition-all hover:bg-violet-600/30 focus:outline-none focus-visible:ring-2 focus-visible:ring-violet-500">
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                  </svg>
                  <span className="hidden sm:inline">Print</span>
                </button>
                <button
                  type="button"
                  disabled={isSoftDeleteButtonLoading}
                  onClick={() => handleSoftDelete(transaction.id)}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-rose-500/30 bg-rose-600/20 px-3 py-2 text-xs font-medium text-rose-300 hover:bg-rose-600/30 disabled:opacity-50"
                >
                  {isSoftDeleteButtonLoading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Trash2 className="h-4 w-4" />
                  )}
                  <span className="hidden sm:inline">
                    {isSoftDeleteButtonLoading ? "Deleting..." : "Delete"}
                  </span>
                </button>
              </>
            ) : (
              <button
                type="button"
                disabled={isRestoreButtonLoading}
                onClick={() => handleRestore(transaction.id)}
                className="inline-flex items-center gap-1.5 rounded-lg border border-emerald-500/30 bg-emerald-600/20 px-3 py-2 text-xs font-medium text-emerald-300 transition-all hover:bg-emerald-600/30 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isRestoreButtonLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <RotateCcw className="h-4 w-4" />
                )}
                <span className="hidden sm:inline">
                  {isRestoreButtonLoading ? "Restoring..." : "Restore"}
                </span>
              </button>
            )}
          </div>
        </div>

        <button type="button" onClick={() => setExpanded((value) => !value)} className="flex w-full items-center justify-between gap-2 rounded-lg bg-[#1e293b] px-3 py-2 transition-all hover:bg-[#243044] focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-500">
          <div className="flex items-center gap-2">
            <svg className={`h-4 w-4 text-slate-400 transition-transform ${expanded ? 'rotate-90' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
            </svg>
            <span className="text-sm font-medium text-slate-300">Sibling Details & Fee Breakdown</span>
            <span className="text-xs text-slate-500">({transaction.siblings.length} student{transaction.siblings.length > 1 ? 's' : ''})</span>
          </div>
          <span className="hidden text-xs text-slate-500 sm:inline">Click to {expanded ? 'collapse' : 'expand'}</span>
        </button>
      </div>

      {expanded && (
        <div className="space-y-4 p-4 sm:p-5">
          {transaction.siblings.map((sibling, index) => {
            const monthlyTotal = sibling.fees.monthly?.total || 0;
            const oneTimeTotal = sibling.fees.oneTime?.reduce((sum, fee) => sum + fee.amount, 0) || 0;
            const studentTotal = monthlyTotal + oneTimeTotal;
            const monthPopoverId = `${transaction.id}-${index}`;
            const isSiblingPopoverOpen = isPopoverOpen && openPopoverId === monthPopoverId;

            return (
              <div key={`${sibling.studentName}-${index}`} className="rounded-xl border border-[#2d3748] bg-[#151d2e] p-4">
                <div className="flex flex-col gap-2 border-b border-[#2d3748] pb-3 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <h3 className="text-base font-semibold text-white">{sibling.studentName}</h3>
                    <div className="mt-1 flex flex-wrap items-center gap-2">
                      <span className="inline-flex items-center gap-1 text-xs text-slate-400">
                        <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                        </svg>
                        {sibling.className}
                      </span>
                      <span className="text-slate-600">•</span>
                      <span className="inline-flex items-center gap-1 text-xs text-slate-400">
                        <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                        </svg>
                        Roll {sibling.rollNo}
                      </span>
                    </div>
                  </div>
                  <div className="inline-flex items-center gap-2 rounded-lg border border-emerald-500/30 bg-gradient-to-r from-emerald-500/20 to-emerald-600/20 px-3 py-1.5">
                    <span className="text-[10px] font-medium uppercase tracking-wide text-emerald-400">Total</span>
                    <span className="text-sm font-bold text-emerald-300">₹{studentTotal}</span>
                  </div>
                </div>

                <div className="mt-3 space-y-2">
                  {sibling.fees.monthly && (
                    <div className="relative flex items-center justify-between gap-3 rounded-lg border border-indigo-500/20 bg-indigo-500/10 p-2.5">
                      <button type="button" onClick={() => setOpenPopoverId(isSiblingPopoverOpen ? '' : monthPopoverId)} className="group flex flex-1 items-center gap-2 text-left focus:outline-none">
                        <div className="flex items-center gap-2">
                          <div className="flex h-7 w-7 items-center justify-center rounded-lg border border-indigo-500/30 bg-indigo-500/20 transition-colors group-hover:bg-indigo-500/30">
                            <svg className="h-4 w-4 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                          </div>
                          <div>
                            <p className="text-sm font-medium text-indigo-300 transition-colors group-hover:text-indigo-200">{sibling.fees.monthly.label}</p>
                            <p className="text-xs text-indigo-400/70 underline decoration-dotted">{sibling.fees.monthly.months.length} month{sibling.fees.monthly.months.length > 1 ? 's' : ''} • Click to view</p>
                          </div>
                        </div>
                      </button>
                      <div className="text-sm font-bold text-indigo-200">₹{sibling.fees.monthly.total}</div>
                      <TransactionPopover months={sibling.fees.monthly.months} isOpen={isSiblingPopoverOpen} onClose={() => setOpenPopoverId('')} />
                    </div>
                  )}

                  {sibling.fees.oneTime?.map((fee) => (
                    <div key={`${fee.name}-${fee.amount}`} className="flex items-center justify-between gap-3 rounded-lg border border-[#2d3748] bg-[#1e293b] p-2.5">
                      <div className="flex items-center gap-2">
                        <div className="h-1.5 w-1.5 rounded-full bg-slate-600" />
                        <span className="text-sm text-slate-300">{fee.name}</span>
                      </div>
                      <span className="text-sm font-semibold text-slate-200">₹{fee.amount}</span>
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

export default TransactionCard
