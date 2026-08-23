import { useEffect, useState } from 'react';
// import { formatCurrency } from './feeDrawer.utils';

function TransactionPopover({ months, isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <div className="absolute left-0 top-full z-[9999] mt-2 w-64 rounded-xl border border-indigo-600 bg-[#0f1a2c] shadow-2xl shadow-indigo-900/30 sm:w-72" style={{ animation: 'popoverFadeIn 0.2s ease-out' }}>
      <div className="p-4">
        <div className="mb-3 flex items-center justify-between">
          <h4 className="text-sm font-semibold text-indigo-200">Months Covered</h4>
          <button type="button" className="flex h-6 w-6 items-center justify-center rounded-full text-indigo-400 transition-colors hover:bg-indigo-800 hover:text-white focus:outline-none" onClick={onClose}>
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div className="max-h-48 space-y-1.5 overflow-y-auto pr-1 custom-scrollbar">
          {months.map((month) => (
            <div key={month} className="flex items-center gap-2 rounded-lg border border-indigo-700/50 bg-[#182438] px-2.5 py-2">
              <svg className="h-4 w-4 shrink-0 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
              </svg>
              <span className="text-sm text-indigo-200">{month}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function TransactionCard({ transaction, isDeleted, onSoftDelete, onRestore, onMessage, onPrint, openPopoverId, setOpenPopoverId }) {
  const [expanded, setExpanded] = useState(false);
  const isPopoverOpen = openPopoverId === `${transaction.id}-popover`;

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
                <span className="font-mono text-xs font-semibold text-slate-200">{transaction.id}</span>
              </span>
              <span className="text-slate-600">•</span>
              <span className="text-xs text-slate-400">{new Date(`${transaction.paymentDate}T00:00:00`).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}</span>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <div className="inline-flex items-center gap-1.5 rounded-lg border border-emerald-500/30 bg-gradient-to-r from-emerald-500/20 to-emerald-600/20 px-3 py-1.5">
                <span className="text-[10px] font-medium uppercase tracking-wide text-emerald-400">Total</span>
                <span className="text-sm font-bold text-emerald-300">{formatCurrency(transaction.totalPaid)}</span>
              </div>
              {transaction.discount > 0 && (
                <div className="inline-flex items-center gap-1.5 rounded-lg border border-amber-500/30 bg-amber-500/10 px-2.5 py-1">
                  <span className="text-xs text-amber-400">Discount</span>
                  <span className="text-xs font-semibold text-amber-300">{formatCurrency(transaction.discount)}</span>
                </div>
              )}
              <div className="inline-flex items-center gap-1.5 rounded-lg border border-slate-700/50 bg-[#1e293b] px-2.5 py-1">
                <svg className="h-3 w-3 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                </svg>
                <span className="text-xs text-slate-300">{transaction.paymentMode}</span>
              </div>
            </div>

            <div className="flex items-start gap-2">
              <svg className="mt-0.5 h-4 w-4 shrink-0 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
              </svg>
              <span className="text-xs leading-relaxed text-slate-400">{transaction.remark}</span>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            {!isDeleted ? (
              <>
                <button type="button" onClick={() => onMessage(transaction)} className="inline-flex items-center gap-1.5 rounded-lg border border-sky-500/30 bg-sky-600/20 px-3 py-2 text-xs font-medium text-sky-300 transition-all hover:bg-sky-600/30 focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-500">
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                  <span className="hidden sm:inline">Message</span>
                </button>
                <button type="button" onClick={() => onPrint(transaction)} className="inline-flex items-center gap-1.5 rounded-lg border border-violet-500/30 bg-violet-600/20 px-3 py-2 text-xs font-medium text-violet-300 transition-all hover:bg-violet-600/30 focus:outline-none focus-visible:ring-2 focus-visible:ring-violet-500">
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                  </svg>
                  <span className="hidden sm:inline">Print</span>
                </button>
                <button type="button" onClick={() => onSoftDelete(transaction.id)} className="inline-flex items-center gap-1.5 rounded-lg border border-rose-500/30 bg-rose-600/20 px-3 py-2 text-xs font-medium text-rose-300 transition-all hover:bg-rose-600/30 focus:outline-none focus-visible:ring-2 focus-visible:ring-rose-500">
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                  <span className="hidden sm:inline">Delete</span>
                </button>
              </>
            ) : (
              <button type="button" onClick={() => onRestore(transaction.id)} className="inline-flex items-center gap-1.5 rounded-lg border border-emerald-500/30 bg-emerald-600/20 px-3 py-2 text-xs font-medium text-emerald-300 transition-all hover:bg-emerald-600/30 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500">
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
                </svg>
                Restore
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
                    <span className="text-sm font-bold text-emerald-300">{formatCurrency(studentTotal)}</span>
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
                            <p className="text-xs text-indigo-400/70 underline decoration-dotted">{sibling.fees.monthly.months.length} month{ sibling.fees.monthly.months.length > 1 ? 's' : '' } • Click to view</p>
                          </div>
                        </div>
                      </button>
                      <div className="text-sm font-bold text-indigo-200">{formatCurrency(sibling.fees.monthly.total)}</div>
                      <TransactionPopover months={sibling.fees.monthly.months} isOpen={isSiblingPopoverOpen} onClose={() => setOpenPopoverId('')} />
                    </div>
                  )}

                  {sibling.fees.oneTime?.map((fee) => (
                    <div key={`${fee.name}-${fee.amount}`} className="flex items-center justify-between gap-3 rounded-lg border border-[#2d3748] bg-[#1e293b] p-2.5">
                      <div className="flex items-center gap-2">
                        <div className="h-1.5 w-1.5 rounded-full bg-slate-600" />
                        <span className="text-sm text-slate-300">{fee.name}</span>
                      </div>
                      <span className="text-sm font-semibold text-slate-200">{formatCurrency(fee.amount)}</span>
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

export default function TransactionModal({ transactions, onClose, onSoftDelete, onRestore, onMessage, onPrint }) {
  const [deletedExpanded, setDeletedExpanded] = useState(false);
  const [popoverId, setPopoverId] = useState('');

  console.log(transactions)



  const activeTransactions = transactions.filter((transaction) => !transaction.isDeleted);
  const deletedTransactions = transactions.filter((transaction) => transaction.isDeleted);

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/70 p-4" onClick={onClose}>
      <div className="max-h-[90vh] w-full max-w-6xl overflow-hidden rounded-2xl border border-slate-700/50 bg-[#1e293b]/95 shadow-2xl backdrop-blur-xl" onClick={(event) => event.stopPropagation()}>
        <header className="border-b border-slate-700/50 bg-gradient-to-r from-slate-800/50 to-slate-900/50 px-4 py-4 sm:px-6 lg:px-8 sm:py-5">
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0 flex-1">
              <h1 className="text-xl font-bold tracking-tight text-white sm:text-2xl lg:text-3xl">Fee Transactions</h1>
              <p className="mt-1 text-xs text-slate-400 sm:text-sm">View and manage all fee transactions</p>
            </div>
            <button type="button" onClick={onClose} aria-label="Close modal" className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-slate-600/50 bg-slate-800/80 text-slate-400 transition-all hover:bg-slate-700 hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 sm:h-9 sm:w-9">
              <svg className="h-4 w-4 sm:h-5 sm:w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </header>

        <main className="custom-scrollbar flex-1 overflow-y-auto px-4 py-4 sm:px-6 sm:py-6 lg:px-8">
          <section className="space-y-3 sm:space-y-4">
            {activeTransactions.length === 0 ? (
              <div className="py-12 text-center">
                <svg className="mx-auto mb-4 h-16 w-16 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                </svg>
                <p className="text-sm text-slate-400">No active transactions found</p>
              </div>
            ) : (
              activeTransactions.map((transaction) => (
                <TransactionCard
                  key={transaction.id}
                  transaction={transaction}
                  isDeleted={false}
                  onSoftDelete={onSoftDelete}
                  onRestore={onRestore}
                  onMessage={onMessage}
                  onPrint={onPrint}
                  openPopoverId={popoverId}
                  setOpenPopoverId={setPopoverId}
                />
              ))
            )}
          </section>

          <section className="mt-6 sm:mt-8">
            <button type="button" onClick={() => setDeletedExpanded((value) => !value)} aria-expanded={deletedExpanded} className="flex w-full items-center justify-between gap-3 rounded-xl border border-slate-700/50 bg-slate-800/60 px-4 py-3 transition-all hover:bg-slate-800/80 focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-500">
              <div className="flex items-center gap-3">
                <div className="flex h-7 w-7 items-center justify-center rounded-full border border-slate-600/50 bg-slate-700/50">
                  <span className="text-xs font-semibold text-slate-300">{deletedTransactions.length}</span>
                </div>
                <div className="text-left">
                  <p className="text-sm font-semibold text-slate-200">Deleted Transactions</p>
                  <p className="text-xs text-slate-500">Soft-deleted records kept for reference</p>
                </div>
              </div>
              <svg className={`h-5 w-5 text-slate-400 transition-transform ${deletedExpanded ? 'rotate-90' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
              </svg>
            </button>

            {deletedExpanded && (
              <div className="mt-3 space-y-3 sm:space-y-4">
                {deletedTransactions.map((transaction) => (
                  <TransactionCard
                    key={transaction.id}
                    transaction={transaction}
                    isDeleted={true}
                    onSoftDelete={onSoftDelete}
                    onRestore={onRestore}
                    onMessage={onMessage}
                    onPrint={onPrint}
                    openPopoverId={popoverId}
                    setOpenPopoverId={setPopoverId}
                  />
                ))}
              </div>
            )}
          </section>
        </main>

        <footer className="border-t border-slate-700/50 bg-slate-900/30 px-4 py-3 sm:px-6 sm:py-4 lg:px-8">
          <div className="flex flex-col items-center justify-between gap-3 sm:flex-row">
            <p className="text-center text-xs text-slate-500 sm:text-left">💡 <span className="font-medium text-slate-400">Tip:</span> Click on monthly fees to view detailed breakdown</p>
            <button type="button" className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-sky-600 to-sky-700 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-sky-900/30 transition-all hover:from-sky-500 hover:to-sky-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900 sm:w-auto">
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Export Summary
            </button>
          </div>
        </footer>
      </div>
    </div>
  );
}
