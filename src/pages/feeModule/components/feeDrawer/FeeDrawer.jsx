import { useEffect, useMemo, useRef, useState } from 'react';
import { apiPost, apiGet } from '../../../../api/api';
import {
    PAYMENT_STATUS,
    SAMPLE_STUDENTS,
    SAMPLE_TRANSACTIONS,
    STATUS_ICONS,
    STATUS_STYLES,
    formatCurrency,
    getGrandTotal,
    getSelectedFeeTotal,
    getStudentTotal,
    normalizeStudentData,
    createFeePayload,
} from './feeDrawer.utils';

const PAYMENT_MODES = ['Cash', 'UPI', 'Bank Transfer', 'Card'];

function ModalStatus({ message, type }) {
    if (!message) return null;

    return (
        <div className="px-4 pt-4 sm:px-6 lg:px-8">
            <div className={`rounded-lg px-4 py-2.5 text-sm flex items-center gap-2 ${STATUS_STYLES[type]}`}>
                <span>{STATUS_ICONS[type]}</span>
                <span>{message}</span>
            </div>
        </div>
    );
}

function TransactionPopover({ months, isOpen, onClose }) {
    if (!isOpen) return null;

    return (
        <div className="absolute left-0 top-full z-[9999] mt-2 w-64 rounded-xl border border-indigo-600 bg-[#0f1a2c] shadow-2xl shadow-indigo-900/30 sm:w-72" style={{ animation: 'popoverFadeIn 0.2s ease-out' }}>
            <div className="p-4">
                <div className="mb-3 flex items-center justify-between">
                    <h4 className="text-sm font-semibold text-indigo-200">Months Covered</h4>
                    <button
                        type="button"
                        className="flex h-6 w-6 items-center justify-center rounded-full text-indigo-400 transition-colors hover:bg-indigo-800 hover:text-white focus:outline-none"
                        onClick={onClose}
                    >
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
    const popoverId = `${transaction.id}-popover`;

    const isPopoverOpen = openPopoverId === popoverId;

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
                            <span className="text-xs text-slate-400">{new Date(transaction.paymentDate + 'T00:00:00').toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}</span>
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
                                                        <p className="text-xs text-indigo-400/70 underline decoration-dotted">{sibling.fees.monthly.months.length} month{sibling.fees.monthly.months.length > 1 ? 's' : ''} • Click to view</p>
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

function TransactionModal({ transactions, open, onClose, onSoftDelete, onRestore, onMessage, onPrint }) {
    const [deletedExpanded, setDeletedExpanded] = useState(false);
    const [popoverId, setPopoverId] = useState('');

    useEffect(() => {
        if (!open) {
            setDeletedExpanded(false);
            setPopoverId('');
        }
    }, [open]);

    if (!open) return null;

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

function FeeCard({ fee, isSelected, isOtherFee, onToggle }) {
    let statusClass = '';
    let statusIcon = '';
    let cursorClass = 'cursor-pointer';
    let dueTextClass = 'text-gray-300';
    let dateText = `Due: ${fee.dueDate}`;

    if (fee.status === 'paid') {
        statusClass = 'paid border border-green-500/30 bg-green-600/30';
        statusIcon = '<i className="fas fa-check-circle text-green-400"></i>';
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
                        {statusIcon || <span className="text-[10px] font-bold uppercase">{fee.month}</span>}
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

export default function FeeDrawer({
    feeDrawerStudent,
    onClose,
}) {
    const [students, setStudents] = useState([]);
    const [feeDrawerLoading, setFeeDrawerLoading] = useState(false);

    const [currentStudent, setCurrentStudent] = useState(0);
    const [discount, setDiscount] = useState(0);
    const [paymentMode, setPaymentMode] = useState('');
    const [paymentDate, setPaymentDate] = useState('');
    const [status, setStatus] = useState({ message: '', type: PAYMENT_STATUS.INFO });
    const [transactionModalOpen, setTransactionModalOpen] = useState(false);
    const [transactions, setTransactions] = useState(SAMPLE_TRANSACTIONS);
    const dateInputRef = useRef(null);


    useEffect(() => {
        const loadStudentFeeData = async () => {
            if (!feeDrawerStudent) return;

            const studentSessionId = feeDrawerStudent?.studentSessionId || feeDrawerStudent?.id;
            const studentPhone = feeDrawerStudent?.studentPhone || feeDrawerStudent?.phone;

            setFeeDrawerLoading(true);

            let studentFeeData = [];

            try {
                if (studentSessionId) {
                    const queryParams = new URLSearchParams({
                        student_session_id: studentSessionId,
                    });

                    if (studentPhone) {
                        queryParams.append("phone", studentPhone);
                    }

                    const response = await apiGet(`/api/get_student_fee_data?${queryParams.toString()}`);
                    const payload = await response.json();

                    console.log("Fetched student fee data:", payload);

                    if (response.ok) {
                        studentFeeData = payload?.students_fee_data || [];

                    }
                }

                setStudents(studentFeeData);
            } catch (error) {
                console.error("Failed to fetch fee data:", error);
                setStudents([]);
            } finally {
                setFeeDrawerLoading(false);
            }
        };

        loadStudentFeeData();
    }, [feeDrawerStudent]);

    useEffect(() => {
        const date = new Date();
        const formatted = `${String(date.getDate()).padStart(2, '0')}/${String(date.getMonth() + 1).padStart(2, '0')}/${date.getFullYear()}`;
        setPaymentDate(formatted);
    }, []);

    useEffect(() => {
        if (!students.length) return;
        setCurrentStudent((index) => Math.min(index, students.length - 1));
    }, [students.length]);

    useEffect(() => {
        if (!status.message) return;
        const timeout = setTimeout(() => {
            setStatus({ message: '', type: PAYMENT_STATUS.INFO });
        }, 4000);
        return () => clearTimeout(timeout);
    }, [status.message]);


    const allStudentSessionIds = useMemo(() => students.map((student) => student.student_session_id).filter(Boolean), [students]);

    const currentStudentData = students[currentStudent] || students[0] || null;
    const currentStudentTotal = currentStudentData ? getSelectedFeeTotal(currentStudentData) : 0;
    const grandTotal = getGrandTotal(students);
    const finalAmount = Math.max(0, grandTotal - discount);

    const showStatus = (message, type = PAYMENT_STATUS.INFO) => {
        setStatus({ message, type });
    };

    const onToggleFee = (fee) => {
        if (!currentStudentData) return;
        const alreadySelected = currentStudentData.selectedFees.some((selected) => selected.id === fee.id);
        const nextSelectedFees = alreadySelected
            ? currentStudentData.selectedFees.filter((selected) => selected.id !== fee.id)
            : [...currentStudentData.selectedFees, fee];

        setStudents((prev) =>
            prev.map((student, index) => {
                if (index !== currentStudent) return student;
                return { ...student, selectedFees: nextSelectedFees };
            })
        );
    };

    const renderFeeLists = () => {
        if (!currentStudentData) return null;

        return (
            <>
                <div className="mb-6 rounded-2xl m-4">
                    <div className="mb-4 flex items-center justify-between gap-3">
                        <div>
                            <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Monthly fees</p>
                        </div>
                        <span className="rounded-full border border-slate-600 bg-slate-900/60 px-2 py-1 text-[10px] font-medium text-slate-300">{currentStudentData.monthlyFees.filter((fee) => fee.status !== 'paid').length} pending</span>
                    </div>
                    <div className="grid gap-3" id="monthlyFeesGrid">
                        {currentStudentData.monthlyFees.map((fee) => (
                            <FeeCard
                                key={fee.id}
                                fee={fee}
                                isSelected={currentStudentData.selectedFees.some((selected) => selected.id === fee.id)}
                                onToggle={onToggleFee}
                            />
                        ))}
                    </div>
                </div>

                <div className="rounded-2xl border border-slate-700 bg-slate-800/30 p-4">
                    <div className="mb-4 flex items-center justify-between gap-3">
                        <div>
                            <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Other fees</p>
                        </div>
                        <span className="rounded-full border border-slate-600 bg-slate-900/60 px-2 py-1 text-[10px] font-medium text-slate-300">{currentStudentData.otherFees.filter((fee) => fee.status !== 'paid').length} items</span>
                    </div>
                    <div className="grid gap-3" id="otherFeesGrid">
                        {currentStudentData.otherFees.map((fee) => (
                            <FeeCard
                                key={fee.id}
                                fee={fee}
                                isSelected={currentStudentData.selectedFees.some((selected) => selected.id === fee.id)}
                                onToggle={onToggleFee}
                                isOtherFee
                            />
                        ))}
                    </div>
                </div>
            </>
        );
    };

    const handlePaymentModeChange = (mode) => {
        setPaymentMode(mode);
        const errorEl = document.getElementById('paymentModeError');
        if (errorEl) errorEl.classList.add('hidden');
    };

    const handlePaymentDateInput = (event) => {
        let value = event.target.value.replace(/\D/g, '').slice(0, 8);
        let day = value.slice(0, 2);
        let month = value.slice(2, 4);
        let year = value.slice(4, 8);

        if (Number(day) > 31) day = '31';
        if (Number(month) > 12) month = '12';

        let formatted = day;
        if (value.length > 2) formatted += '/' + month;
        if (value.length > 4) formatted += '/' + year;

        setPaymentDate(formatted);
        const errorEl = document.getElementById('paymentDateError');
        if (errorEl) errorEl.classList.add('hidden');
    };

    const handleDateInputFocus = () => {
        setTimeout(() => {
            if (!dateInputRef.current) return;
            const start = dateInputRef.current.selectionStart;
            if (start <= 2) {
                dateInputRef.current.setSelectionRange(0, 2);
            } else if (start <= 5) {
                dateInputRef.current.setSelectionRange(3, 5);
            } else {
                dateInputRef.current.setSelectionRange(6, 10);
            }
        }, 10);
    };

    const handleOpenTransactionModal = () => {
        if (!allStudentSessionIds.length) {
            showStatus('Student session IDs not available', PAYMENT_STATUS.ERROR);
            return;
        }
        setTransactionModalOpen(true);
    };

    const handleProcessPayment = async () => {
        const hasSelectedFees = students.some((student) => student.selectedFees.length > 0);
        if (!hasSelectedFees) {
            showStatus('Please select at least one fee before continuing.', PAYMENT_STATUS.ERROR);
            return;
        }

        if (!paymentMode.trim()) {
            showStatus('Please select a payment mode.', PAYMENT_STATUS.ERROR);
            return;
        }

        if (!paymentDate.trim()) {
            showStatus('Please select a payment date.', PAYMENT_STATUS.ERROR);
            return;
        }

        try {
            const payload = createFeePayload(students, discount, paymentMode, paymentDate);
            const response = await apiPost('/api/pay_fee', payload);
            const result = await response.json();

            if (!response.ok) {
                throw new Error(result?.message || 'Payment failed');
            }

            if (onPaymentSuccess) {
                onPaymentSuccess(result, payload);
            }

            showStatus('Payment processed successfully', PAYMENT_STATUS.SUCCESS);
            setTransactionModalOpen(false);

            setStudents((prev) =>
                prev.map((student) => ({
                    ...student,
                    selectedFees: [],
                    monthlyFees: student.monthlyFees.map((fee) => (student.selectedFees.some((selected) => selected.id === fee.id) ? { ...fee, status: 'paid', paid_date: paymentDate } : fee)),
                    otherFees: student.otherFees.map((fee) => (student.selectedFees.some((selected) => selected.id === fee.id) ? { ...fee, status: 'paid', paid_date: paymentDate } : fee)),
                }))
            );
        } catch (error) {
            showStatus(error.message || 'Payment failed. Please try again.', PAYMENT_STATUS.ERROR);
        }
    };

    const handleMessage = (transaction) => {
        showStatus(`Message interface opened for ${transaction.id}`, PAYMENT_STATUS.INFO);
    };

    const handlePrint = (transaction) => {
        showStatus(`Receipt for ${transaction.id} sent to printer`, PAYMENT_STATUS.SUCCESS);
    };

    const handleSoftDelete = (transactionId) => {
        setTransactions((prev) => prev.map((transaction) => (transaction.id === transactionId ? { ...transaction, isDeleted: true } : transaction)));
        showStatus(`Transaction ${transactionId} moved to deleted section`, PAYMENT_STATUS.SUCCESS);
    };

    const handleRestore = (transactionId) => {
        setTransactions((prev) => prev.map((transaction) => (transaction.id === transactionId ? { ...transaction, isDeleted: false } : transaction)));
        showStatus(`Transaction ${transactionId} restored successfully`, PAYMENT_STATUS.SUCCESS);
    };

    return (
        <>

            <div className="fixed inset-0 z-40 transition-opacity pointer-events-auto opacity-100">
                <div className="h-full w-full bg-black/50 backdrop-blur-sm" onClick={onClose} />
            </div>

            <aside className="fixed inset-0 z-50 flex justify-end transition-transform duration-300 translate-x-0">
                <div className="relative flex h-full w-full flex-col bg-gray-900 shadow-2xl md:w-[600px]">
                    <div className="flex-shrink-0 border-b border-gray-800 bg-gray-900 p-4">
                        <div className="mb-4 flex items-center justify-between">
                            <div>
                                <h2 className="text-xl font-bold text-white">Pay Fee</h2>
                            </div>
                            <button type="button" onClick={onClose} className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-800 text-slate-300 hover:bg-slate-700">
                                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        <div className="mb-2 flex bg-[linear-gradient(135deg,rgba(30,35,40,0.9)_0%,rgba(45,50,56,0.9)_100%)] rounded-[16px] p-[6px] shadow-[0_4px_12px_rgba(0,0,0,0.15)]">
                            {students.map((student, index) => (
                                <button
                                    key={student.id || student.name}
                                    type="button"
                                    onClick={() => setCurrentStudent(index)}
                                    className={`flex flex-1 items-center justify-center gap-2 rounded-xl border px-3 py-2 text-sm font-medium transition-all ${index === currentStudent ? 'border-sky-500/30 bg-sky-500/15 text-sky-300 shadow-sm' : 'border-transparent bg-transparent text-slate-400 hover:bg-slate-800 hover:text-slate-200'}`}
                                >
                                    <span className={`h-2.5 w-2.5 rounded-full ${['bg-blue-500', 'bg-green-500', 'bg-amber-500', 'bg-purple-500'][index % 4]}`} />
                                    <span className="truncate">{student.name}</span>
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="custom-scrollbar flex flex-1 flex-col overflow-y-auto">
                        <div className=" border-b border-slate-700/60 bg-slate-900/60 ">

                            <div className="bg-gradient-to-r from-red-900/25 to-red-800/10 border border-red-700/30 px-4 py-4 sm:px-6 sm:py-5 shadow-sm">

                                <div className="flex items-start justify-between gap-4">

                                    <div className="flex items-start gap-3 min-w-0">
                                        <div className="flex-shrink-0 bg-red-600/20 p-2">
                                            <i className="fas fa-exclamation-triangle text-red-400 text-lg"></i>
                                        </div>

                                        <div className="min-w-0 leading-tight">
                                            <h3 className="text-white text-lg font-bold">Grand Total Due</h3>
                                            <p className="text-gray-300 text-sm truncate max-w-[18rem] mt-0.5"></p>
                                        </div>
                                    </div>

                                    <div className="flex items-start gap-3">

                                        <div className="text-right">
                                            <div id="grandTotalDue" className="text-3xl font-extrabold text-white leading-none tabular-nums">₹{getStudentTotal(currentStudentData || { monthlyFees: [], otherFees: [] })}</div>
                                        </div>
                                    </div>
                                </div>

                                <div className="mt-3 pt-3 border-t border-red-700/20">
                                    <div className="flex items-center justify-between text-sm text-gray-300 w-full">

                                        <div className="inline-flex items-center gap-2">
                                            <i className="fas fa-users text-gray-400"></i>
                                            <span>Students:</span>
                                            <span className="text-white font-semibold">{students.length}</span>
                                        </div>

                                        <div className="inline-flex items-center gap-2">
                                            <i className="fas fa-calendar-times text-gray-400"></i>
                                            <span>Pending Months:</span>
                                            <span className="text-white font-semibold">{students.reduce((sum, student) => sum + (student.total_due_terms || 0), 0)}</span>
                                        </div>

                                    </div>
                                </div>

                            </div>


                            <div className="bg-gradient-to-r from-gray-800 to-gray-700 p-4 rounded-2xl mt-4 m-4">
                                <div className="flex justify-between items-start " id="studentInfoCard">
                                    <div>
                                        <h3 className="font-bold text-lg" id="studentName">{currentStudentData?.name || 'Student'}</h3>
                                        <div className="flex flex-wrap gap-2 mt-2">
                                            <span className="bg-blue-500/20 text-blue-300 px-2 py-1 rounded-lg text-sm" id="studentClass">
                                                Class: {currentStudentData?.class || '-'}
                                            </span>
                                            <span className="bg-purple-500/20 text-purple-300 px-2 py-1 rounded-lg text-sm" id="studentRoll">
                                                Roll No: {currentStudentData?.rollNo || '-'}
                                            </span>
                                            <span className="bg-red-500/20 text-red-300 px-2 py-1 rounded-lg text-sm" id="dueAmount">
                                                <i className="fas fa-clock mr-1"></i>
                                                Due: ₹{currentStudentTotal}
                                            </span>
                                            <button className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded-lg text-sm flex items-center gap-1 transition-colors">
                                                <i className="fab fa-whatsapp"></i>
                                                Send Message
                                            </button>
                                        </div>
                                    </div>

                                    <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-blue-500">
                                        <img src={currentStudentData?.image || 'https://static.vecteezy.com/system/resources/previews/036/594/092/large_2x/man-empty-avatar-photo-placeholder-for-social-networks-resumes-forums-and-dating-sites-male-and-female-no-photo-images-for-unfilled-user-profile-free-vector.jpg'} alt="Student Photo" className="w-full h-full object-cover" />
                                    </div>

                                </div>
                            </div>

                        </div>

                        {renderFeeLists()}

                        <div className="mt-auto p-4 border-t border-gray-700/50 bg-gray-900/80 backdrop-blur-sm ">

                            <div className="mb-4">
                                <h3 className="font-semibold text-white mb-4 flex items-center">
                                    <i className="fas fa-file-invoice-dollar mr-2 text-blue-400"></i>Payment Summary
                                </h3>
                                <div className="space-y-3 mb-4">
                                    <div className="flex justify-between items-center">
                                        <span className="text-gray-300">Selected Fees (Current Student):</span>
                                        <span className="font-medium text-white">₹{currentStudentTotal}</span>
                                    </div>

                                    <div className="flex justify-between items-center">
                                        <span className="text-gray-300">Total All Students:</span>
                                        <span className="font-medium text-white">₹{grandTotal}</span>
                                    </div>

                                    <div className="flex justify-between items-center">
                                        <span className="text-gray-300">Discount:</span>
                                        <div className="flex items-center bg-gray-800/60 border border-gray-700/50 rounded-lg px-3 py-1.5">
                                            <span className="mr-1 text-gray-300">₹</span>
                                            <input type="number" placeholder="0" min="0" value={discount} onChange={(e) => setDiscount(e.target.value)} className="w-20 bg-transparent text-right text-white placeholder-gray-500" />
                                        </div>
                                    </div>
                                </div>

                                <div className="border-t border-gray-700/50 pt-4 mt-4">
                                    <div className="flex justify-between items-center font-bold text-lg">
                                        <span className="text-white">Final Payable:</span>
                                        <span className="text-white">₹{finalAmount}</span>
                                    </div>
                                </div>
                            </div>


                            <div className="border-t border-gray-700/50 pt-4 mb-4">
                                <h4 className="text-sm font-medium mb-3 text-gray-300">
                                    Payment Date <span className="text-red-500">*</span>
                                </h4>
                                <div className="date-input-container">
                                    <input
                                        value={paymentDate}
                                        onChange={handlePaymentDateInput}
                                        onClick={handleDateInputFocus} type="text" maxlength="10" placeholder="DD/MM/YYYY"
                                        className="w-full px-4 py-3 text-sm bg-gray-800/60 border border-gray-700/50 rounded-xl
                                                focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/30
                                                text-white placeholder-gray-500"/>
                                </div>
                            </div>

                            <div className="hidden mb-3 text-red-400 text-xs bg-red-900/20 border border-red-500/20 px-3 py-2 rounded-lg">
                                Please enter a valid date.
                            </div>

                            <div className="mb-4">
                                <h4 className="text-sm font-medium mb-3 text-gray-300">
                                    Payment Mode <span className="text-red-500">*</span>
                                </h4>
                                <div className="grid grid-cols-4 gap-2">
                                    <div onClick={() => handlePaymentModeChange("cash")}
                                        className="payment-mode border border-gray-700/50 rounded-xl p-3 text-center cursor-pointer transition-all bg-gray-800/60" >
                                        <i className="fas fa-money-bill text-xl mb-2 text-green-400"></i>
                                        <div className="text-xs text-gray-300">Cash</div>
                                    </div>
                                    <div onClick={() => handlePaymentModeChange("upi")}
                                        className="payment-mode border border-gray-700/50 rounded-xl p-3 text-center cursor-pointer transition-all bg-gray-800/60">
                                        <i className="fas fa-mobile-alt text-xl mb-2 text-blue-400"></i>
                                        <div className="text-xs text-gray-300">UPI</div>
                                    </div>
                                    <div onClick={() => handlePaymentModeChange("card")}
                                        className="payment-mode border border-gray-700/50 rounded-xl p-3 text-center cursor-pointer transition-all bg-gray-800/60">
                                        <i className="fas fa-credit-card text-xl mb-2 text-purple-400"></i>
                                        <div className="text-xs text-gray-300">Card</div>
                                    </div>
                                    <div onClick={() => handlePaymentModeChange("netbanking")}
                                        className="payment-mode border border-gray-700/50 rounded-xl p-3 text-center cursor-pointer transition-all bg-gray-800/60">
                                        <i className="fas fa-university text-xl mb-2 text-yellow-400"></i>
                                        <div className="text-xs text-gray-300">Net Banking</div>
                                    </div>
                                </div>
                                <div id="paymentModeError" className="mt-2 hidden text-xs text-red-300">Please select a payment mode.</div>
                            </div>

                        </div>

                        <div className="mt-auto border-t border-gray-700/50 bg-gray-900/80 p-6 backdrop-blur-sm">

                            <div className="flex flex-col gap-3 sm:flex-row">
                                <button type="button" onClick={handleOpenTransactionModal} id="viewTransactionsButton" className="flex-1 rounded-xl border border-slate-600 bg-slate-800 px-4 py-3 text-sm font-semibold text-slate-200 transition hover:bg-slate-700">
                                    View Transactions
                                </button>
                                <button type="button" onClick={handleProcessPayment} id="proceedButton" disabled={grandTotal <= 0} className="flex-1 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-900/30 transition hover:from-blue-500 hover:to-indigo-500 disabled:cursor-not-allowed disabled:opacity-50">
                                    Proceed to Payment
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </aside>

            <ModalStatus message={status.message} type={status.type} />

            <TransactionModal
                transactions={transactions}
                open={transactionModalOpen}
                onClose={() => setTransactionModalOpen(false)}
                onSoftDelete={handleSoftDelete}
                onRestore={handleRestore}
                onMessage={handleMessage}
                onPrint={handlePrint}
            />
        </>
    );
}
