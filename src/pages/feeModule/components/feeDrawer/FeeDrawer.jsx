import { useEffect, useState } from 'react';
import { apiGet, apiPost } from '../../../../api/api';
import { DrawerLoader, SetupFeeSessionUI } from './components/DrawerStatus';
import FeeDrawerFooter from './components/FeeDrawerFooter';
import FeeDrawerHeader from './components/FeeDrawerHeader';
import FeeDrawerMiddle from './components/FeeDrawerMiddle';
import { getGrandTotal, getSelectedFeeTotal } from './components/feeDrawer.utils';

const emptyStudent = { monthlyFees: [], otherFees: [], selectedFees: [] };

export default function FeeDrawer({ feeDrawerStudent, onClose, onSetupFeeSession, setTransactionModalOpen }) {
    const [students, setStudents] = useState([]);
    const [feeDrawerLoading, setFeeDrawerLoading] = useState(false);
    const [currentStudentIndex, setCurrentStudentIndex] = useState(0);

    const [discount, setDiscount] = useState(0);
    const [paymentMode, setPaymentMode] = useState('');
    const [paymentDate, setPaymentDate] = useState('');

    const [feeStructure, setFeeStructure] = useState(null);
    const [isFeeSessionSetupRequired, setFeeSessionSetupRequired] = useState(false);

    const [paymentModeError, setPaymentModeError] = useState(null);
    const [paymentDateError, setPaymentDateError] = useState(null);
    const [noFeeSelectedError, setNoFeeSelectedError] = useState(null);
    const [isFeesSubmitting, setFeesSubmitting] = useState(false);

    

    useEffect(() => {
        async function loadStudentFeeData() {
            if (!feeDrawerStudent) return;
            const studentSessionId = feeDrawerStudent.studentSessionId || feeDrawerStudent.student_session_id || feeDrawerStudent.id;
            const studentPhone = feeDrawerStudent.studentPhone || feeDrawerStudent.phone;

            setFeeDrawerLoading(true);
            setFeeSessionSetupRequired(false);
            setFeeStructure(null);

            try {
                if (!studentSessionId) { setStudents([]); return; }
                const queryParams = new URLSearchParams({ student_session_id: studentSessionId });
                if (studentPhone) queryParams.append('phone', studentPhone);
                const response = await apiGet(`/api/get_student_fee_data?${queryParams.toString()}`);
                const payload = await response.json();

                if (!response.ok && payload?.NO_FEE_SESSION_DATA) {
                    setFeeStructure(payload.fee_structure);
                    setFeeSessionSetupRequired(true);
                    setStudents([]);
                    return;
                }

                if (!response.ok) {
                    throw new Error(payload?.error || 'Failed to fetch student fee data');
                }

                const studentsFeeData = payload.students_fee_data || [];
                setStudents(studentsFeeData);
                setCurrentStudentIndex(0);

            } catch (error) {
                console.error('Failed to fetch fee data:', error);
            } finally {
                setFeeDrawerLoading(false);
            }
        }
        loadStudentFeeData();
    }, [feeDrawerStudent]);

    useEffect(() => {
        const date = new Date();
        setPaymentDate(`${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`);
    }, []);

    const currentStudentData = students[currentStudentIndex] || students[0] || emptyStudent;
    const currentStudentTotal = getSelectedFeeTotal(currentStudentData);
    const grandTotal = getGrandTotal(students);
    const finalAmount = Math.max(0, grandTotal - Number(discount || 0));



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

        try {
            setFeesSubmitting(true);
            const response = await apiPost('/api/pay_fee', { payment_mode: paymentMode, payment_date: paymentDate, discount: Number(discount || 0), total_amount: grandTotal, final_amount: finalAmount, new_fee_data: students, student_session_ids: students.filter((student) => student.selectedFees.length > 0).map((student) => student.student_session_id).filter(Boolean) });
            const result = await response.json();

            if (!response.ok) {
                if (result.fees_paid) {
                    showAlert("Fees Paid Successfully!")
                    onClose()
                }
                throw new Error(result?.message || 'Payment failed');
            }

            const studentsFeeData = result.students_fee_data || [];
            setStudents(studentsFeeData);
        } catch (error) { console.error(error.message || 'Payment failed'); }
        finally { setFeesSubmitting(false); }
    }

    const setup = () => {
        onClose();
        onSetupFeeSession({ feeStructure, studentSessionId: feeDrawerStudent?.studentSessionId || feeDrawerStudent?.id });
    };

    return <>

        <div className="fixed inset-0 z-40 transition-opacity">
            <div
                className="fixed inset-0 bg-black/50 backdrop-blur-sm cursor-pointer"
                onClick={onClose}
            ></div>
        </div>

        <aside className="fixed inset-0 z-50 flex justify-end transition-transform duration-300 translate-x-0">
            <div className="relative flex h-full w-full flex-col bg-gray-900 shadow-2xl md:w-[800px]">

                <div className="flex-shrink-0 border-b border-gray-800 bg-gray-900 p-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <h2 className="text-xl font-bold text-white">Pay Fee</h2>
                        </div>
                        <button type="button" onClick={onClose} className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-800 text-slate-300 hover:bg-slate-700">
                            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                            </svg>
                        </button>
                    </div>
                </div>

                <div className='flex-1 overflow-y-auto [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-thumb]:bg-slate-700'>

                    {feeDrawerLoading ? (
                        <DrawerLoader />

                    ) : isFeeSessionSetupRequired ? (
                        <SetupFeeSessionUI onSetup={setup} />

                    ) : (
                        <>
                            <FeeDrawerHeader
                                students={students}
                                currentStudentIndex={currentStudentIndex}
                                currentStudentData={currentStudentData}
                                setCurrentStudentIndex={setCurrentStudentIndex}
                            />

                            <FeeDrawerMiddle
                                currentStudentData={currentStudentData}
                                currentStudentIndex={currentStudentIndex}
                                setStudents={setStudents}
                                noFeeSelectedError={noFeeSelectedError}
                                setNoFeeSelectedError={setNoFeeSelectedError}
                            />

                            <FeeDrawerFooter
                                currentStudentTotal={currentStudentTotal}
                                grandTotal={grandTotal}
                                finalAmount={finalAmount}
                                discount={discount}
                                onDiscountChange={setDiscount}

                                paymentDate={paymentDate}
                                onPaymentDateChange={(value) => {
                                    setPaymentDate(value);
                                    setPaymentDateError(null);
                                }}
                                paymentDateError={paymentDateError}

                                paymentMode={paymentMode}
                                onPaymentModeChange={(value) => {
                                    setPaymentMode(value);
                                    setPaymentModeError(null);
                                }}
                                paymentModeError={paymentModeError}

                                onViewTransactions={() => {
                                    const studentSessionId = feeDrawerStudent.studentSessionId || feeDrawerStudent.student_session_id || feeDrawerStudent.id;
                                    const studentPhone = feeDrawerStudent.studentPhone || feeDrawerStudent.phone;
                                    setTransactionModalOpen(studentSessionId, studentPhone);
                                }}

                                onProcessPayment={handleProcessPayment}
                                isFeesSubmitting={isFeesSubmitting}
                            />
                        </>
                    )}
                </div>

            </div>
        </aside>


    </>;
}
