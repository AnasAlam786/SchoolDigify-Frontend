import { useEffect, useState } from 'react';
import { apiGet } from '../../../../api/api';
import { DrawerLoader, SetupFeeSessionUI } from './components/DrawerStatus';
import FeeDrawerFooter from './components/FeeDrawerFooter';
import FeeDrawerHeader from './components/FeeDrawerHeader';
import FeeDrawerMiddle from './components/FeeDrawerMiddle';

const emptyStudent = { monthlyFees: [], otherFees: [], selectedFees: [] };

export default function FeeDrawer({ feeDrawerStudent, onClose, onSetupFeeSession, setTransactionModalOpen }) {
    const [students, setStudents] = useState([]);
    const [feeDrawerLoading, setFeeDrawerLoading] = useState(false);
    const [currentStudentIndex, setCurrentStudentIndex] = useState(0);

    const [feeStructure, setFeeStructure] = useState(null);
    const [isFeeSessionSetupRequired, setFeeSessionSetupRequired] = useState(false);

    const [noFeeSelectedError, setNoFeeSelectedError] = useState(null);
    

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


    const currentStudentData = students[currentStudentIndex] || students[0] || emptyStudent;


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
                                students={students}
                                setStudents={setStudents}
                                currentStudentIndex={currentStudentIndex}
                                setNoFeeSelectedError={setNoFeeSelectedError}

                                onViewTransactions={() => {
                                    const studentSessionId = feeDrawerStudent.studentSessionId || feeDrawerStudent.student_session_id || feeDrawerStudent.id;
                                    const studentPhone = feeDrawerStudent.studentPhone || feeDrawerStudent.phone;
                                    setTransactionModalOpen(studentSessionId, studentPhone);
                                }}
                            />
                        </>
                    )}
                </div>

            </div>
        </aside>


    </>;
}
