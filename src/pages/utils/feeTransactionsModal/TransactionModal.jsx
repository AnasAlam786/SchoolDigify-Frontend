import { useEffect, useState } from 'react';
import { apiGet } from '../../../api/api';

import TransactionCard from './components/TransactionCard';
import TransactionModalSkeletonLoader from './components/ModalStatus';


export default function TransactionModal({ transactionModalStudent, onClose }) {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [deletedExpanded, setDeletedExpanded] = useState(false);


  useEffect(() => {
    async function loadTransactions() {
      const studentSessionId = transactionModalStudent?.studentSessionId;
      const phone = transactionModalStudent?.phone;

      if (!studentSessionId) {
        setTransactions([]);
        setError('Student session not found.');
        setLoading(false);
        return;
      }

      setLoading(true);
      setError('');

      try {
        const queryParams = new URLSearchParams({
          student_session_id: studentSessionId,
        });
        if (phone) queryParams.append('phone', phone);

        const response = await apiGet(`/api/get_fee_transactions?${queryParams.toString()}`);
        const payload = await response.json();

        console.log(payload)

        if (!response.ok) {
          throw new Error(payload?.error || payload?.message || 'Failed to fetch transactions.');
        }

        setTransactions(payload.transactions || payload.data || []);
      } catch (fetchError) {
        console.error('Failed to fetch fee transactions:', fetchError);
        setTransactions([]);
        setError(fetchError.message || 'Unable to load transactions.');
        showAlert(500, fetchError)
      } finally {
        setLoading(false);
      }
    }

    loadTransactions();
  }, [transactionModalStudent]);

  const activeTransactions = transactions.filter((transaction) => !transaction.is_deleted);
  const deletedTransactions = transactions.filter((transaction) => transaction.is_deleted);

  const handleExportSummary = () => {
    const headers = [
      'Transaction No', 'Payment Date', 'Student', 'Class', 'Roll No',
      'Fee Type', 'Fee Item', 'Amount', 'Paid Amount', 'Discount',
      'Payment Mode', 'Remark', 'Status'
    ];
    const rows = transactions.flatMap((transaction) => {
      const students = transaction.siblings?.length ? transaction.siblings : [{}];

      return students.flatMap((student) => {
        const monthly = student.fees?.monthly;
        const oneTimeFees = student.fees?.oneTime || [];
        const feeRows = [
          ...(monthly ? [{ type: 'Monthly', item: monthly.label, amount: monthly.total }] : []),
          ...oneTimeFees.map((fee) => ({ type: 'One-time', item: fee.name, amount: fee.amount }))
        ];

        return (feeRows.length ? feeRows : [{ type: '', item: '', amount: '' }]).map((fee) => [
          transaction.transaction_no,
          transaction.payment_date,
          student.studentName || '',
          student.className || '',
          student.rollNo || '',
          fee.type,
          fee.item,
          fee.amount,
          transaction.paid_amount ?? 0,
          transaction.discount ?? 0,
          transaction.payment_mode || '',
          transaction.remark || '',
          transaction.is_deleted ? 'Deleted' : 'Active'
        ]);
      });
    });
    const csv = [headers, ...rows]
      .map((row) => row.map((value) => `"${String(value).replaceAll('"', '""')}"`).join(','))
      .join('\r\n');
    const blobUrl = URL.createObjectURL(new Blob([csv], { type: 'text/csv;charset=utf-8;' }));
    const downloadLink = document.createElement('a');
    downloadLink.href = blobUrl;
    downloadLink.download = `fee-transactions-${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(downloadLink);
    downloadLink.click();
    downloadLink.remove();
    URL.revokeObjectURL(blobUrl);
  };

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/70 p-0 m-0" onClick={onClose}>
      <div className="flex max-h-[90vh] w-full max-w-6xl flex-col overflow-hidden rounded-2xl border border-slate-700/50 bg-[#1e293b]/95 shadow-2xl backdrop-blur-xl" onClick={(event) => event.stopPropagation()}>
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

        <main className="custom-scrollbar min-h-0 flex-1 overflow-y-auto px-4 py-4 sm:px-6 sm:py-6 lg:px-8">
          {loading && <TransactionModalSkeletonLoader />}

          {!loading && error && (
            <div className="py-12 text-center">
              <p className="text-sm text-rose-300">{error}</p>
            </div>
          )}

          {!loading && !error && <>
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
                  setTransactions={setTransactions}
                  isDeleted={false}
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
                    setTransactions={setTransactions}
                    isDeleted={true}
                  />
                ))}
              </div>
            )}
          </section>
          </>}
        </main>

        <footer className="border-t border-slate-700/50 bg-slate-900/30 px-4 py-3 sm:px-6 sm:py-4 lg:px-8">
          <div className="flex flex-col items-center justify-between gap-3 sm:flex-row">
            <p className="text-center text-xs text-slate-500 sm:text-left">💡 <span className="font-medium text-slate-400">Tip:</span> Click on monthly fees to view detailed breakdown</p>
            <button type="button" onClick={handleExportSummary} disabled={loading || transactions.length === 0} className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-sky-600 to-sky-700 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-sky-900/30 transition-all hover:from-sky-500 hover:to-sky-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900 disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto">
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
