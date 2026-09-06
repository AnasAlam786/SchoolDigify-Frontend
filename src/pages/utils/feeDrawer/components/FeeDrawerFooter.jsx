import { useEffect, useState } from 'react';
import { apiPost } from '../../../../api/api';
import usePermission from "../../../../hooks/usePermission";


export default function FeeDrawerFooter({
  students,
  setStudents,
  currentStudentIndex,
  setNoFeeSelectedError,
  onViewTransactions,
}) {
  const { hasPermission, PERMISSIONS } = usePermission()

  const [isFeesSubmitting, setFeesSubmitting] = useState(false);

  const [discount, setDiscount] = useState(0);
  const [paymentMode, setPaymentMode] = useState('cash');
  const [paymentDate, setPaymentDate] = useState('');
  const [remark, setRemark] = useState('');

  const [paymentModeError, setPaymentModeError] = useState(null);
  const [paymentDateError, setPaymentDateError] = useState(null);



  useEffect(() => {
    const date = new Date();
    setPaymentDate(`${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`);
  }, []);


  const handlePaymentDateChange = (value) => {
    setPaymentDate(value);
    setPaymentDateError(null);
  };

  const handlePaymentModeChange = (value) => {
    setPaymentMode(value);
    setPaymentModeError(null);
  };

  function getSelectedFeeTotal(student) {
    return Array.isArray(student?.selectedFees)
      ? student.selectedFees.reduce((sum, fee) => sum + Number(fee.amount || 0), 0)
      : 0;
  }

  const currentStudentData = students[currentStudentIndex] || students[0];

  const currentStudentTotal = getSelectedFeeTotal(currentStudentData)

  const grandTotal = students.reduce(
    (sum, student) => sum + getSelectedFeeTotal(student), 0
  );

  const finalAmount = Math.max(0, grandTotal - Number(discount || 0));

  const modes = [
    ['cash', 'fa-money-bill', 'Cash', 'text-green-400'],
    ['upi', 'fa-mobile-alt', 'UPI', 'text-blue-400'],
    ['card', 'fa-credit-card', 'Card', 'text-purple-400'],
    ['netbanking', 'fa-university', 'Net Banking', 'text-yellow-400'],
  ];

  async function handleProcessPayment() {

    if (!students.some((student) => student.selectedFees.length > 0)) {
      setNoFeeSelectedError('Please select at least one fee before continuing.');
      return;
    }
    if (!paymentMode.trim()) {
      setPaymentModeError('Please select a payment mode.');
      return;
    }
    if (!paymentDate.trim()) {
      setPaymentDateError('Please select a payment date.');
      return;
    }

    const studentOrder = students.map(
      student => student.student_session_id
    );

    try {
      setFeesSubmitting(true);
      const response = await apiPost('/api/pay_fee', {
        payment_mode: paymentMode, payment_date: paymentDate,
        remark: remark.trim(),
        discount: Number(discount || 0),
        total_amount: grandTotal, final_amount: finalAmount,
        new_fee_data: students,
        student_session_ids: students.filter(
          (student) => student.selectedFees.length > 0)
          .map((student) => student.student_session_id)
          .filter(Boolean)
      });

      const result = await response.json();

      if (!response.ok) {
        if (result.fees_paid) {
          showAlert("Fees Paid Successfully!")
          onClose()
        }
        throw new Error(result?.message || 'Payment failed');
      }

      const studentsFeeData = result.students_fee_data || [];

      // Preserve the order that existed before payment
      const orderedStudents = studentOrder
        .map(id =>
          studentsFeeData.find(
            student => student.student_session_id === id
          )
        )
        .filter(Boolean);

      setStudents(orderedStudents);
      showAlert(200, "Fees paid successfully!")
    } catch (error) { console.error(error.message || 'Payment failed'); }
    finally { setFeesSubmitting(false); }
  }

  return (
    <footer className="border-t border-gray-700/50 bg-gray-900/95 p-4 backdrop-blur-sm sm:p-6">
      <div className="mb-4 space-y-3">
        <h3 className="font-semibold text-white">
          <i className="fas fa-file-invoice-dollar mr-2 text-blue-400" />
          Payment Summary
        </h3>

        <div className="flex justify-between text-sm">
          <span className="text-gray-300">Selected Fees (Current Student):</span>
          <span className="text-white">₹{currentStudentTotal}</span>
        </div>

        <div className="flex justify-between text-sm">
          <span className="text-gray-300">Total All Students:</span>
          <span className="text-white">₹{grandTotal}</span>
        </div>

        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-300">Discount:</span>
          <label className="flex items-center rounded-lg border border-gray-700/50 bg-gray-800/60 px-3 py-1.5">
            <span className="mr-1 text-gray-300">₹</span>
            <input type="number" min="0" max={grandTotal} value={discount}
              onChange={(event) => setDiscount(event.target.value)}
              className="w-20 bg-transparent text-right text-white outline-none" aria-label="Discount"
            />
          </label>
        </div>
        <div className="flex justify-between border-t border-gray-700/50 pt-4 text-lg font-bold"><span className="text-white">Final Payable:</span><span className="text-white">₹{finalAmount}</span></div>
      </div>
      {hasPermission(PERMISSIONS.PAY_FEES) && (

        <>

          {/* Payment Date Field */}
          <div className="mb-5 border-t border-gray-700/40 pt-5">
            <div className="mb-3 flex items-center justify-between">
              <label
                htmlFor="payment-date"
                className="flex items-center gap-2 text-sm font-medium text-gray-200"
              >
                <span className="flex h-7 w-7 items-center justify-center rounded-lg border border-blue-500/25 bg-blue-500/10 text-blue-400">
                  <i className="fas fa-calendar-day text-xs" />
                </span>

                Payment Date
                <span className="text-red-400">*</span>
              </label>

              {!paymentDateError && (
                <span className="text-[11px] text-gray-500">
                  Required
                </span>
              )}
            </div>

            <div
              className={`group relative overflow-hidden rounded-xl border transition-all duration-200 ${paymentDateError
                  ? "border-red-500/50 bg-red-950/10 focus-within:border-red-400 focus-within:ring-2 focus-within:ring-red-500/10"
                  : "border-gray-700/60 bg-gray-800/50 hover:border-gray-600/80 focus-within:border-blue-500/60 focus-within:bg-gray-800/70 focus-within:ring-2 focus-within:ring-blue-500/10"
                }`}
            >
              {/* Subtle accent */}
              <div
                className={`pointer-events-none absolute inset-y-0 left-0 w-0.5 transition-colors ${paymentDateError
                    ? "bg-red-500"
                    : "bg-blue-500/60 group-focus-within:bg-blue-400"
                  }`}
              />

              <div className="flex items-center">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center text-gray-500 transition-colors group-focus-within:text-blue-400">
                  <i className="fas fa-calendar-alt text-sm" />
                </div>

                <input
                  id="payment-date"
                  value={paymentDate}
                  onChange={(event) =>
                    handlePaymentDateChange(event.target.value)
                  }
                  type="date"
                  aria-invalid={Boolean(paymentDateError)}
                  aria-describedby={
                    paymentDateError ? "payment-date-error" : undefined
                  }
                  className="h-12 w-full bg-transparent pr-4 text-sm font-medium text-white outline-none [color-scheme:dark] placeholder:text-gray-600"
                />
              </div>
            </div>

            {paymentDateError ? (
              <p
                id="payment-date-error"
                role="alert"
                className="mt-2 flex items-center gap-2 text-xs text-red-300"
              >
                <i className="fas fa-circle-exclamation text-red-400" />
                {paymentDateError}
              </p>
            ) : (
              <p className="mt-2 flex items-center gap-2 text-xs text-gray-500">
                <i className="fas fa-info-circle text-gray-600" />
                Select the date on which the payment was received.
              </p>
            )}
          </div>

          {/* Payment Remark Field */}
          <div className="mb-4">
            <div className="mb-3 flex items-center justify-between">
              <label
                htmlFor="payment-remark"
                className="flex items-center gap-2 text-sm font-medium text-gray-200"
              >
                <span className="flex h-7 w-7 items-center justify-center rounded-lg border border-blue-500/25 bg-blue-500/10 text-blue-400">
                  <i className="fas fa-pen-to-square text-xs" />
                </span>

                Payment Remark
                <span className="font-normal text-gray-500">(optional)</span>
              </label>

              <span className="text-[11px] text-gray-500">
                {remark.length}/250
              </span>
            </div>

            <div className="group relative overflow-hidden rounded-xl border border-gray-700/60 bg-gray-800/50 transition-all duration-200 hover:border-gray-600/80 focus-within:border-blue-500/60 focus-within:bg-gray-800/70 focus-within:ring-2 focus-within:ring-blue-500/10">
              {/* Subtle accent */}
              <div className="pointer-events-none absolute inset-y-0 left-0 w-0.5 bg-blue-500/60 transition-colors group-focus-within:bg-blue-400" />

              <div className="flex items-center">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center text-gray-500 transition-colors group-focus-within:text-blue-400">
                  <i className="fas fa-comment-alt text-sm" />
                </div>

                <input
                  id="payment-remark"
                  type="text"
                  value={remark}
                  maxLength={250}
                  onChange={(event) => setRemark(event.target.value)}
                  placeholder="Add a note about this payment..."
                  aria-label="Payment remark"
                  className="h-12 w-full bg-transparent pr-4 text-sm font-medium text-white outline-none placeholder:text-gray-600"
                />
              </div>
            </div>

            <p className="mt-2 flex items-center gap-2 text-xs text-gray-500">
              <i className="fas fa-info-circle text-gray-600" />
              This note will appear with the payment transaction.
            </p>
          </div>

          <div className="mb-4">
            <h4 className="mb-3 text-sm font-medium text-gray-300">
              Payment Mode <span className="text-red-500">*</span>
            </h4>

            <div className={`grid grid-cols-2 gap-2 rounded-2xl border p-1 sm:grid-cols-4 
                ${paymentModeError ? 'border-red-500/50' : 'border-transparent'}`}
              role="radiogroup" aria-label="Payment mode">
              {modes.map(([value, icon, label, color]) => (
                <button key={value} type="button" role="radio" aria-checked={paymentMode === value} onClick={() => handlePaymentModeChange(value)} className={`rounded-xl border p-3 text-center transition-all ${paymentMode === value ? 'border-blue-500 bg-blue-500/20 ring-2 ring-blue-500/30' : 'border-gray-700/50 bg-gray-800/60'}`}>
                  <i className={`fas ${icon} mb-2 text-xl ${color}`} />
                  <div className="text-xs text-gray-300">{label}</div>
                </button>
              ))}
            </div>
            {paymentModeError &&
              <p role="alert" className="mt-2 text-xs text-red-300">
                <i className="fas fa-circle-exclamation mr-2 text-red-400" />
                {paymentModeError}
              </p>
            }
          </div>

          <div className="flex flex-col gap-3 border-t border-gray-700/50 pt-4 sm:flex-row">
            <button type="button" onClick={onViewTransactions} className="flex-1 rounded-xl border border-slate-600 bg-slate-800 px-4 py-3 text-sm font-semibold text-slate-200 hover:bg-slate-700">
              View Transactions
            </button>
            <button type="button"
              onClick={handleProcessPayment} disabled={grandTotal <= 0 || isFeesSubmitting}
              className="flex-1 rounded-xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white hover:bg-blue-500 disabled:pointer-events-none disabled:opacity-60">
              {isFeesSubmitting ?
                <>
                  <i className="fas fa-spinner mr-2 animate-spin" />
                  Processing Payment...
                </> :
                <>
                  Proceed to Payment <i className="fas fa-arrow-right ml-2" />
                </>
              }
            </button>
          </div>
        </>

      )}


    </footer>
  );
}
