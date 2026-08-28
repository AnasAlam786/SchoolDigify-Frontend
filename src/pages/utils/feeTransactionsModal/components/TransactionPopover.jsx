
function TransactionPopover({ months, onClose }) {

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

export default TransactionPopover