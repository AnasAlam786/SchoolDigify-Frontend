export default function FeeDrawerFooter({
  currentStudentTotal,
  grandTotal,
  finalAmount,
  discount,
  onDiscountChange,
  paymentDate,
  onPaymentDateChange,
  paymentDateError,
  paymentMode,
  onPaymentModeChange,
  paymentModeError,
  onViewTransactions,
  onProcessPayment,
  isFeesSubmitting,
}) {
  const modes = [
    ['cash', 'fa-money-bill', 'Cash', 'text-green-400'],
    ['upi', 'fa-mobile-alt', 'UPI', 'text-blue-400'],
    ['card', 'fa-credit-card', 'Card', 'text-purple-400'],
    ['netbanking', 'fa-university', 'Net Banking', 'text-yellow-400'],
  ];

  return (
    <footer className="border-t border-gray-700/50 bg-gray-900/95 p-4 backdrop-blur-sm sm:p-6">
      <div className="mb-4 space-y-3">
        <h3 className="font-semibold text-white"><i className="fas fa-file-invoice-dollar mr-2 text-blue-400" />Payment Summary</h3>
        <div className="flex justify-between text-sm"><span className="text-gray-300">Selected Fees (Current Student):</span><span className="text-white">₹{currentStudentTotal}</span></div>
        <div className="flex justify-between text-sm"><span className="text-gray-300">Total All Students:</span><span className="text-white">₹{grandTotal}</span></div>
        <div className="flex items-center justify-between text-sm"><span className="text-gray-300">Discount:</span><label className="flex items-center rounded-lg border border-gray-700/50 bg-gray-800/60 px-3 py-1.5"><span className="mr-1 text-gray-300">₹</span><input type="number" min="0" value={discount} onChange={(event) => onDiscountChange(event.target.value)} className="w-20 bg-transparent text-right text-white outline-none" aria-label="Discount" /></label></div>
        <div className="flex justify-between border-t border-gray-700/50 pt-4 text-lg font-bold"><span className="text-white">Final Payable:</span><span className="text-white">₹{finalAmount}</span></div>
      </div>

      <div className="mb-4 border-t border-gray-700/50 pt-4">
        <h4 className="mb-3 text-sm font-medium text-gray-300">Payment Date <span className="text-red-500">*</span></h4>
        <input value={paymentDate} onChange={(event) => onPaymentDateChange(event.target.value)} type="date" aria-invalid={Boolean(paymentDateError)} className={`w-full rounded-xl border bg-gray-800/60 px-4 py-3 text-sm text-white focus:border-blue-500 focus:outline-none ${paymentDateError ? 'border-red-500/60' : 'border-gray-700/50'}`} />
        {paymentDateError && <p role="alert" className="mt-2 text-xs text-red-300"><i className="fas fa-circle-exclamation mr-2 text-red-400" />{paymentDateError}</p>}
      </div>

      <div className="mb-4">
        <h4 className="mb-3 text-sm font-medium text-gray-300">Payment Mode <span className="text-red-500">*</span></h4>
        <div className={`grid grid-cols-2 gap-2 rounded-2xl border p-1 sm:grid-cols-4 ${paymentModeError ? 'border-red-500/50' : 'border-transparent'}`} role="radiogroup" aria-label="Payment mode">
          {modes.map(([value, icon, label, color]) => (
            <button key={value} type="button" role="radio" aria-checked={paymentMode === value} onClick={() => onPaymentModeChange(value)} className={`rounded-xl border p-3 text-center transition-all ${paymentMode === value ? 'border-blue-500 bg-blue-500/20 ring-2 ring-blue-500/30' : 'border-gray-700/50 bg-gray-800/60'}`}>
              <i className={`fas ${icon} mb-2 text-xl ${color}`} /><div className="text-xs text-gray-300">{label}</div>
            </button>
          ))}
        </div>
        {paymentModeError && <p role="alert" className="mt-2 text-xs text-red-300"><i className="fas fa-circle-exclamation mr-2 text-red-400" />{paymentModeError}</p>}
      </div>

      <div className="flex flex-col gap-3 border-t border-gray-700/50 pt-4 sm:flex-row">
        <button type="button" onClick={onViewTransactions} className="flex-1 rounded-xl border border-slate-600 bg-slate-800 px-4 py-3 text-sm font-semibold text-slate-200 hover:bg-slate-700">View Transactions</button>
        <button type="button" onClick={onProcessPayment} disabled={grandTotal <= 0 || isFeesSubmitting} className="flex-1 rounded-xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white hover:bg-blue-500 disabled:pointer-events-none disabled:opacity-60">
          {isFeesSubmitting ? <><i className="fas fa-spinner mr-2 animate-spin" />Processing Payment...</> : <>Proceed to Payment <i className="fas fa-arrow-right ml-2" /></>}
        </button>
      </div>
    </footer>
  );
}
