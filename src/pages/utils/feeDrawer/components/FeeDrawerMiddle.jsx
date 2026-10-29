import { useState } from 'react';
import FeeCard from './FeeCard';


export default function FeeDrawerMiddle({
    currentStudentData,
    currentStudentIndex,
    setStudents,
    noFeeSelectedError,
    setNoFeeSelectedError,
    readOnly = false,
}) {
    const [partialFee, setPartialFee] = useState(null);
    const [partialAmount, setPartialAmount] = useState('');
    const [partialAmountError, setPartialAmountError] = useState('');

    const monthlyFees = currentStudentData?.monthlyFees || [];
    const otherFees = currentStudentData?.otherFees || [];
    const selectedFees = currentStudentData?.selectedFees || [];


    const onToggleFee = (fee) => {
        if (!currentStudentData) return;
        setNoFeeSelectedError(null);
        const alreadySelected = currentStudentData.selectedFees.some((selected) => selected.id === fee.id);
        const nextSelectedFees = alreadySelected
            ? currentStudentData.selectedFees.filter((selected) => selected.id !== fee.id)
            : [...currentStudentData.selectedFees, {
                ...fee,
                payment_amount: Number(fee.remaining_amount ?? fee.amount),
            }];

        setStudents((prev) =>
            prev.map((student, index) => {
                if (index !== currentStudentIndex) return student;
                return { ...student, selectedFees: nextSelectedFees };
            })
        );
    };

    const openPartialAmount = (fee) => {
        const selectedFee = selectedFees.find((selected) => selected.fee_id === fee.fee_id);
        setPartialFee(fee);
        setPartialAmount(String(selectedFee?.payment_amount ?? fee.remaining_amount ?? fee.amount));
        setPartialAmountError('');
    };

    const savePartialAmount = () => {
        const amount = Number(partialAmount);
        const maxAmount = Number(partialFee?.remaining_amount ?? partialFee?.amount);
        if (!Number.isFinite(amount) || amount < 1 || amount > maxAmount) {
            setPartialAmountError(`Enter an amount between 1 and ${maxAmount}.`);
            return;
        }

        setStudents((prev) => prev.map((student, index) => {
            if (index !== currentStudentIndex) return student;
            return {
                ...student,
                selectedFees: student.selectedFees.map((selected) =>
                    selected.fee_id === partialFee.fee_id
                        ? { ...selected, payment_amount: amount }
                        : selected
                ),
            };
        }));
        setPartialFee(null);
    };

    const renderFeeCard = (fee) => {
        const selectedFee = selectedFees.find((selected) => selected.fee_id === fee.fee_id);
        const selectedAmount = selectedFee?.payment_amount;
        return (
            <FeeCard
                key={fee.id ?? fee.fee_id}
                fee={fee}
                isSelected={Boolean(selectedFee)}
                selectedAmount={selectedAmount}
                isPartialSelection={Boolean(selectedFee && selectedAmount < Number(fee.remaining_amount ?? fee.amount))}
                onToggle={readOnly ? undefined : onToggleFee}
                onConfigurePayment={readOnly ? undefined : openPartialAmount}
                readOnly={readOnly}
            />
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
                {monthlyFees.map(renderFeeCard)}

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
                {otherFees.map(renderFeeCard)}

            </div>

            {partialFee && (
                <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/70 p-4" role="presentation">
                    <section
                        role="dialog"
                        aria-modal="true"
                        aria-labelledby="partial-fee-title"
                        className="w-full max-w-sm rounded-xl border border-slate-700 bg-slate-900 p-5 shadow-2xl"
                    >
                        <h3 id="partial-fee-title" className="text-base font-semibold text-white">Set payment amount</h3>
                        <p className="mt-1 text-sm text-slate-400">
                            {partialFee.period_name || partialFee.name || partialFee.fee_type || 'Selected term'} · remaining ₹{Number(partialFee.remaining_amount ?? partialFee.amount)}
                        </p>
                        <label htmlFor="partial-fee-amount" className="mt-4 block text-sm text-slate-300">Amount to pay</label>
                        <input
                            id="partial-fee-amount"
                            type="number"
                            min="1"
                            max={partialFee.remaining_amount ?? partialFee.amount}
                            step="1"
                            value={partialAmount}
                            onChange={(event) => {
                                setPartialAmount(event.target.value);
                                setPartialAmountError('');
                            }}
                            className="mt-2 w-full rounded-lg border border-slate-600 bg-slate-800 px-3 py-2 text-white outline-none focus:border-amber-400"
                        />
                        {partialAmountError && <p role="alert" className="mt-2 text-sm text-red-300">{partialAmountError}</p>}
                        <div className="mt-5 flex justify-end gap-2">
                            <button type="button" onClick={() => setPartialFee(null)} className="rounded-lg border border-slate-600 px-4 py-2 text-sm text-slate-200 hover:bg-slate-800">Cancel</button>
                            <button type="button" onClick={savePartialAmount} className="rounded-lg bg-amber-400 px-4 py-2 text-sm font-semibold text-slate-950 hover:bg-amber-300">Done</button>
                        </div>
                    </section>
                </div>
            )}
        </div>
    );
}
