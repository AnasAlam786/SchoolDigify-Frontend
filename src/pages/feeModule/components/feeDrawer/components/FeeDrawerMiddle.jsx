import FeeCard from './FeeCard';


export default function FeeDrawerMiddle({ currentStudentData, currentStudentIndex, setStudents, noFeeSelectedError, setNoFeeSelectedError }) {

    const monthlyFees = currentStudentData?.monthlyFees || [];
    const otherFees = currentStudentData?.otherFees || [];
    const selectedFees = currentStudentData?.selectedFees || [];


    const onToggleFee = (fee) => {
        if (!currentStudentData) return;
        setNoFeeSelectedError(null);
        const alreadySelected = currentStudentData.selectedFees.some((selected) => selected.id === fee.id);
        const nextSelectedFees = alreadySelected
            ? currentStudentData.selectedFees.filter((selected) => selected.id !== fee.id)
            : [...currentStudentData.selectedFees, fee];

        setStudents((prev) =>
            prev.map((student, index) => {
                if (index !== currentStudentIndex) return student;
                return { ...student, selectedFees: nextSelectedFees };
            })
        );
    };

    return (
        <div className='mb-6 rounded-2xl border p-4 transition-colors border-transparent'>
            <div className="mb-4 flex items-center justify-between gap-3">
                <div>
                    <h3 className="text-sm uppercase tracking-[0.2em] text-slate-400">
                        <i className="fas fa-calendar-alt mr-2 text-blue-400"></i>Term Fees
                    </h3>
                </div>
                <span className="rounded-full border border-slate-600 bg-slate-900/60 px-2 py-1 text-[10px] font-medium text-slate-300">
                    {monthlyFees.filter((fee) => String(fee.status).toLowerCase() !== 'paid').length} pending
                </span>
            </div>

            <div className='grid grid-cols-1 sm:grid-cols-3 gap-3'>
                {monthlyFees.map((fee, index) => (
                    <FeeCard
                        key={fee.id}
                        fee={fee}
                        isSelected={
                            selectedFees.some((selected) => selected.id === fee.id || selected.fee_id === fee.fee_id)
                        }
                        onToggle={onToggleFee}
                    />
                ))}

                {noFeeSelectedError &&
                    <p role="alert" className="mt-4 text-sm text-red-200">
                        <i className="fas fa-circle-exclamation mr-2 text-red-400" />
                        {noFeeSelectedError}
                    </p>
                }

            </div>


            <div className="mb-3 mt-4 flex items-center justify-between gap-3">
                <div>
                    <h3 className="mt-4 text-sm uppercase tracking-[0.2em] text-slate-400">
                        <i className="fas fa-calendar-alt mr-2 text-blue-400"></i>Other Fees
                    </h3>
                </div>
                <span className="mt-4 rounded-full border border-slate-600 bg-slate-900/60 px-2 py-1 text-[10px] font-medium text-slate-300">
                    {otherFees.filter((fee) => String(fee.status).toLowerCase() !== 'paid').length} pending
                </span>
            </div>

            <div className='grid grid-cols-1 sm:grid-cols-2 gap-3'>
                {otherFees.map((fee, index) => (
                    <FeeCard
                        key={fee.id ?? fee.fee_id}
                        fee={fee}
                        isSelected={
                            selectedFees.some((selected) => selected.id === fee.id || selected.fee_id === fee.fee_id)
                        }
                        onToggle={onToggleFee}
                    />
                ))}

            </div>
        </div>
    );
}
