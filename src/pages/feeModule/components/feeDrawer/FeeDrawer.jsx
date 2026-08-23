import { useEffect, useState } from 'react';
import { apiPost, apiGet } from '../../../../api/api';
import TransactionModal from "../feeTransactionsModal/TransactionModal";
import DrawerLoader from './components/DrawerLoader';
import FeeCard from './components/FeeCard';

import {
    getGrandTotal, getSelectedFeeTotal, getStudentTotal,
} from './components/feeDrawer.utils';


export default function FeeDrawer({
    feeDrawerStudent, onClose,
}) {
    const [students, setStudents] = useState([]);
    const [feeDrawerLoading, setFeeDrawerLoading] = useState(false);

    const [currentStudent, setCurrentStudent] = useState(0);
    const [discount, setDiscount] = useState(0);
    const [paymentMode, setPaymentMode] = useState('');
    const [paymentDate, setPaymentDate] = useState('');

    const [isTransactionModalOpen, setTransactionModalOpen] = useState(false);
    const [transactions, setTransactions] = useState("");

    const [paymentModeError, setpaymentModeError] = useState(null);
    const [paymentDateError, setPaymentDateError] = useState(null);
    const [noFeeSelectedError, setNoFeeSelectedError] = useState(null);

    const [isFeesSubmitting, setFeesSubmitting] = useState(false);



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
                setCurrentStudent(0);
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
        const formatted =
            `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
        setPaymentDate(formatted);
    }, []);



    const currentStudentData = students[currentStudent] || students[0] || {
        monthlyFees: [],
        otherFees: [],
        selectedFees: [],
    };
    const currentStudentTotal = currentStudentData ? getSelectedFeeTotal(currentStudentData) : 0;
    const grandTotal = getGrandTotal(students);
    const finalAmount = Math.max(0, grandTotal - discount);


    const onToggleFee = (fee) => {
        if (!currentStudentData) return;
        setNoFeeSelectedError(null);
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

    const handlePaymentModeChange = (mode) => {
        setPaymentMode(mode);
        setpaymentModeError(null);
    };


    const handleOpenTransactionModal = () => {
        setTransactionModalOpen(true);
    };

    const handleProcessPayment = async () => {
        setTransactionModalOpen(false);
        const hasSelectedFees = students.some((student) => student.selectedFees.length > 0);

        if (!hasSelectedFees) {
            setNoFeeSelectedError('Please select at least one fee before continuing.');
            return;
        }

        if (!paymentMode.trim()) {
            setpaymentModeError('Please select a payment mode.');
            return;
        }

        if (!paymentDate.trim()) {
            setPaymentDateError('Please select a payment date.');
            return;
        }

        try {
            setFeesSubmitting(true)
            const grandTotal = getGrandTotal(students);
            const finalAmount = Math.max(0, grandTotal - Number(discount || 0));

            const payload = {
                payment_mode: paymentMode,
                payment_date: paymentDate,
                discount: Number(discount || 0),
                total_amount: grandTotal,
                final_amount: finalAmount,
                new_fee_data: students,    // contain selected fee will will tell which fees is being paid
                student_session_ids: students
                    .filter((student) => student.selectedFees.length > 0)
                    .map((student) => student.student_session_id)
                    .filter(Boolean),
            }

            const response = await apiPost('/api/pay_fee', payload);
            const result = await response.json();

            if (!response.ok) {
                throw new Error(result?.message || 'Payment failed');
            }

            const transactionNo = result.transaction_no;
            const studentsFeeDdata = result.students_fee_data

            setStudents(studentsFeeDdata);

            showAlert(200, `Payment processed successfully with TXN no: ${transactionNo}`);
        } catch (error) {
            console.log(error.message || 'Payment failed');
            showAlert(500, error.message || 'Payment failed. Please try again.');
        } finally {
            setFeesSubmitting(false)
        }
    };


    return (
        <>
            <div className="fixed inset-0 z-40 transition-opacity pointer-events-auto opacity-100">
                <div className="h-full w-full bg-black/50 backdrop-blur-sm" onClick={onClose} />
            </div>

            <aside className="fixed inset-0 z-50 flex justify-end transition-transform duration-300 translate-x-0">
                <div className="relative flex h-full w-full flex-col bg-gray-900 shadow-2xl md:w-[800px]">
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

                        <div className="custom-scrollbar flex flex-1 flex-col overflow-y-auto">
                            {feeDrawerLoading ? (
                                <div className="flex flex-1 items-center justify-center">
                                    <DrawerLoader />
                                </div>
                            ) : (
                                <>
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
                                                        <div className="text-3xl font-extrabold text-white leading-none tabular-nums">₹{getGrandTotal(students || { monthlyFees: [], otherFees: [] })}</div>
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
                                                        <span className="bg-blue-500/20 text-blue-300 px-2 py-1 rounded-lg text-sm">
                                                            Class: {currentStudentData?.class || '-'}
                                                        </span>
                                                        <span className="bg-purple-500/20 text-purple-300 px-2 py-1 rounded-lg text-sm">
                                                            Roll No: {currentStudentData?.rollNo || '-'}
                                                        </span>
                                                        <span className="bg-red-500/20 text-red-300 px-2 py-1 rounded-lg text-sm">
                                                            <i className="fas fa-clock mr-1"></i>
                                                            Due: ₹{getStudentTotal(currentStudentData || { monthlyFees: [], otherFees: [] })}
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

                                    <>
                                        <div className={`m-4 mb-6 rounded-2xl border p-4 transition-colors ${noFeeSelectedError ? 'border-red-500/50 bg-red-950/10' : 'border-transparent'}`}>
                                            <div className="mb-4 flex items-center justify-between gap-3">
                                                <div>
                                                    <h3 className="text-sm uppercase tracking-[0.2em] text-slate-400">
                                                        <i className="fas fa-calendar-alt mr-2 text-blue-400"></i>Monthly Fees
                                                    </h3>
                                                </div>
                                                <span className="rounded-full border border-slate-600 bg-slate-900/60 px-2 py-1 text-[10px] font-medium text-slate-300">{currentStudentData.monthlyFees.filter((fee) => fee.status !== 'paid').length} pending</span>
                                            </div>
                                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                                                {currentStudentData.monthlyFees.map((fee) => (
                                                    <FeeCard
                                                        key={fee.id}
                                                        fee={fee}
                                                        isSelected={currentStudentData.selectedFees.some((selected) => selected.id === fee.id)}
                                                        onToggle={onToggleFee}
                                                    />
                                                ))}
                                            </div>
                                            {noFeeSelectedError && (
                                                <div role="alert" aria-live="polite" className="mt-4 flex items-start gap-3 rounded-xl border border-red-400/30 bg-red-950/40 px-3 py-3 text-sm text-red-200">
                                                    <i className="fas fa-circle-exclamation mt-0.5 text-red-400" aria-hidden="true" />
                                                    <span>{noFeeSelectedError}</span>
                                                </div>
                                            )}
                                        </div>

                                        <div className="mb-6 rounded-2xl m-4">
                                            <div className="mb-4 flex items-center justify-between gap-3">
                                                <div>
                                                    <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Other fees</p>
                                                </div>
                                                <span className="rounded-full border border-slate-600 bg-slate-900/60 px-2 py-1 text-[10px] font-medium text-slate-300">{currentStudentData.otherFees.filter((fee) => fee.status !== 'paid').length} items</span>
                                            </div>
                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2" id="otherFeesGrid">
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
                                            <div className={`date-input-container rounded-xl border transition-colors ${paymentDateError ? 'border-red-500/70 bg-red-950/20' : 'border-transparent'}`}>
                                                <input
                                                    value={paymentDate}
                                                    onChange={(e) => {
                                                        setPaymentDate(e.target.value);
                                                        setPaymentDateError(null);
                                                    }}
                                                    type="date"
                                                    aria-invalid={Boolean(paymentDateError)}
                                                    aria-describedby={paymentDateError ? 'paymentDateError' : undefined}
                                                    className={`w-full rounded-xl border px-4 py-3 text-sm bg-gray-800/60
                                                    focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/30
                                                    text-white placeholder-gray-500 ${paymentDateError ? 'border-red-500/60 focus:border-red-400 focus:ring-red-500/20' : 'border-gray-700/50'}`}
                                                />
                                            </div>
                                            {paymentDateError && (
                                                <p id="paymentDateError" role="alert" className="mt-2 flex items-center gap-2 text-xs text-red-300">
                                                    <i className="fas fa-circle-exclamation text-red-400" aria-hidden="true" />
                                                    {paymentDateError}
                                                </p>
                                            )}
                                        </div>

                                        <div className="mb-4">
                                            <h4 className="text-sm font-medium mb-3 text-gray-300">
                                                Payment Mode <span className="text-red-500">*</span>
                                            </h4>
                                            <div className={`grid grid-cols-2 gap-2 rounded-2xl border p-1 sm:grid-cols-4 ${paymentModeError ? 'border-red-500/50 bg-red-950/10' : 'border-transparent'}`} role="radiogroup" aria-label="Payment mode">

                                                <div
                                                    onClick={() => handlePaymentModeChange("cash")}
                                                    role="radio"
                                                    aria-checked={paymentMode === "cash"}
                                                    className={`payment-mode border rounded-xl p-3 text-center cursor-pointer transition-all ${paymentMode === "cash"
                                                        ? "border-blue-500 bg-blue-500/20 ring-2 ring-blue-500/30"
                                                        : "border-gray-700/50 bg-gray-800/60"
                                                        }`}
                                                >
                                                    <i className="fas fa-money-bill text-xl mb-2 text-green-400"></i>
                                                    <div className="text-xs text-gray-300">Cash</div>
                                                </div>

                                                <div
                                                    onClick={() => handlePaymentModeChange("upi")}
                                                    role="radio"
                                                    aria-checked={paymentMode === "upi"}
                                                    className={`payment-mode border rounded-xl p-3 text-center cursor-pointer transition-all ${paymentMode === "upi"
                                                        ? "border-blue-500 bg-blue-500/20 ring-2 ring-blue-500/30"
                                                        : "border-gray-700/50 bg-gray-800/60"
                                                        }`}
                                                >
                                                    <i className="fas fa-mobile-alt text-xl mb-2 text-blue-400"></i>
                                                    <div className="text-xs text-gray-300">UPI</div>
                                                </div>

                                                <div
                                                    onClick={() => handlePaymentModeChange("card")}
                                                    role="radio"
                                                    aria-checked={paymentMode === "card"}
                                                    className={`payment-mode border rounded-xl p-3 text-center cursor-pointer transition-all ${paymentMode === "card"
                                                        ? "border-blue-500 bg-blue-500/20 ring-2 ring-blue-500/30"
                                                        : "border-gray-700/50 bg-gray-800/60"
                                                        }`}
                                                >
                                                    <i className="fas fa-credit-card text-xl mb-2 text-purple-400"></i>
                                                    <div className="text-xs text-gray-300">Card</div>
                                                </div>

                                                <div
                                                    onClick={() => handlePaymentModeChange("netbanking")}
                                                    role="radio"
                                                    aria-checked={paymentMode === "netbanking"}
                                                    className={`payment-mode border rounded-xl p-3 text-center cursor-pointer transition-all ${paymentMode === "netbanking"
                                                        ? "border-blue-500 bg-blue-500/20 ring-2 ring-blue-500/30"
                                                        : "border-gray-700/50 bg-gray-800/60"
                                                        }`}
                                                >
                                                    <i className="fas fa-university text-xl mb-2 text-yellow-400"></i>
                                                    <div className="text-xs text-gray-300">Net Banking</div>
                                                </div>

                                            </div>
                                            {paymentModeError && (
                                                <p id="paymentModeError" role="alert" className="mt-2 flex items-center gap-2 text-xs text-red-300">
                                                    <i className="fas fa-circle-exclamation text-red-400" aria-hidden="true" />
                                                    {paymentModeError}
                                                </p>
                                            )}
                                        </div>

                                    </div>

                                    <div className="mt-auto border-t border-gray-700/50 bg-gray-900/80 p-6 backdrop-blur-sm">

                                        <div className="flex flex-col gap-3 sm:flex-row">
                                            <button type="button" onClick={handleOpenTransactionModal} className="flex-1 rounded-xl border border-slate-600 bg-slate-800 px-4 py-3 text-sm font-semibold text-slate-200 transition hover:bg-slate-700">
                                                View Transactions
                                            </button>
                                            <button
                                                type="button"
                                                onClick={handleProcessPayment}
                                                disabled={grandTotal <= 0 || isFeesSubmitting}
                                                className="relative flex-1 inline-flex items-center justify-center overflow-hidden rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-600 bg-[length:200%_auto] px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-900/30 transition-all duration-300 hover:bg-[position:right_center] hover:shadow-blue-500/25 active:scale-[0.98] disabled:pointer-events-none disabled:opacity-60"
                                            >
                                                {/* Active glow effect during submission */}
                                                {isFeesSubmitting && (
                                                    <span className="absolute inset-0 bg-gradient-to-r from-blue-400/20 via-indigo-400/20 to-blue-400/20 animate-pulse" />
                                                )}

                                                <span className="relative z-10 flex items-center justify-center gap-2">
                                                    {isFeesSubmitting ? (
                                                        <>
                                                            {/* Animated Spinner Icon */}
                                                            <svg
                                                                className="h-4 w-4 animate-spin text-white"
                                                                xmlns="http://www.w3.org/2000/svg"
                                                                fill="none"
                                                                viewBox="0 0 24 24"
                                                            >
                                                                <circle
                                                                    className="opacity-25"
                                                                    cx="12"
                                                                    cy="12"
                                                                    r="10"
                                                                    stroke="currentColor"
                                                                    strokeWidth="4"
                                                                />
                                                                <path
                                                                    className="opacity-75"
                                                                    fill="currentColor"
                                                                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                                                />
                                                            </svg>
                                                            <span>Processing Payment...</span>
                                                        </>
                                                    ) : (
                                                        <>
                                                            <span>Proceed to Payment</span>
                                                            {/* Forward Arrow Icon */}
                                                            <svg
                                                                className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5"
                                                                fill="none"
                                                                stroke="currentColor"
                                                                viewBox="0 0 24 24"
                                                            >
                                                                <path
                                                                    strokeLinecap="round"
                                                                    strokeLinejoin="round"
                                                                    strokeWidth="2"
                                                                    d="M14 5l7 7m0 0l-7 7m7-7H3"
                                                                />
                                                            </svg>
                                                        </>
                                                    )}
                                                </span>
                                            </button>
                                        </div>
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </aside>


            {isTransactionModalOpen && (
                <TransactionModal
                    transactions={transactions}
                    onClose={() => setTransactionModalOpen(false)}
                />
            )}
        </>
    );
}
