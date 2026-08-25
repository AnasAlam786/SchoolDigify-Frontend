import { useState } from 'react';

const getInitialFields = (feeStructure) => {
  if (Array.isArray(feeStructure)) return feeStructure;

  return Object.entries(feeStructure || {}).map(([name, amount]) => ({
    name,
    amount: typeof amount === 'object' ? amount.amount || 0 : amount || 0,
  }));
};

export default function FeeSessionSetupModal({
  feeStructure,
  studentSessionId,
  onClose,
  onSubmit,
}) {
  const [fields, setFields] = useState(() => getInitialFields(feeStructure));
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const updateField = (index, key, value) => {
    setFields((current) => current.map((field, fieldIndex) => (
      fieldIndex === index ? { ...field, [key]: value } : field
    )));
  };

  const addField = () => setFields((current) => [...current, { name: '', amount: 0 }]);
  const removeField = (index) => setFields((current) => current.filter((_, fieldIndex) => fieldIndex !== index));

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    const validFields = fields.filter((field) => field.name.trim());

    if (!validFields.length) {
      setError('Add at least one fee item.');
      return;
    }

    try {
      setIsSubmitting(true);
      await onSubmit({
        student_session_id: studentSessionId,
        fee_structure: validFields.map((field) => ({
          name: field.name.trim(),
          amount: Number(field.amount) || 0,
        })),
      });
    } catch (submitError) {
      setError(submitError.message || 'Unable to save fee data.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm" role="dialog" aria-modal="true" aria-labelledby="setup-fee-title">
      <form onSubmit={handleSubmit} className="flex max-h-[90vh] w-full max-w-xl flex-col overflow-hidden rounded-2xl border border-slate-700 bg-slate-900 shadow-2xl">
        <div className="flex items-start justify-between border-b border-slate-700 px-5 py-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-sky-400">Fee session setup</p>
            <h2 id="setup-fee-title" className="mt-1 text-xl font-bold text-white">Configure fee data</h2>
            <p className="mt-1 text-sm text-slate-400">Review the fee structure before creating this student session.</p>
          </div>
          <button type="button" onClick={onClose} aria-label="Close" className="flex h-8 w-8 items-center justify-center rounded-lg text-xl text-slate-400 hover:bg-slate-800 hover:text-white">&times;</button>
        </div>

        <div className="custom-scrollbar space-y-3 overflow-y-auto p-5">
          {fields.map((field, index) => (
            <div key={`${field.name}-${index}`} className="grid grid-cols-[1fr_7rem_auto] items-end gap-2 rounded-xl border border-slate-700 bg-slate-800/60 p-3">
              <label className="text-xs font-medium text-slate-300">Fee name
                <input value={field.name} onChange={(event) => updateField(index, 'name', event.target.value)} className="mt-1 w-full rounded-lg border border-slate-600 bg-slate-900 px-3 py-2 text-sm text-white outline-none focus:border-sky-500" placeholder="Monthly tuition" />
              </label>
              <label className="text-xs font-medium text-slate-300">Amount
                <input type="number" min="0" value={field.amount} onChange={(event) => updateField(index, 'amount', event.target.value)} className="mt-1 w-full rounded-lg border border-slate-600 bg-slate-900 px-3 py-2 text-sm text-white outline-none focus:border-sky-500" />
              </label>
              <button type="button" onClick={() => removeField(index)} aria-label={`Remove ${field.name || 'fee'}`} className="mb-1 h-9 w-9 rounded-lg text-slate-400 hover:bg-red-500/10 hover:text-red-300">&times;</button>
            </div>
          ))}
          <button type="button" onClick={addField} className="w-full rounded-xl border border-dashed border-slate-600 px-3 py-2 text-sm font-semibold text-sky-300 hover:border-sky-500 hover:bg-sky-500/5">+ Add fee item</button>
          {error && <p role="alert" className="rounded-lg border border-red-500/30 bg-red-950/30 px-3 py-2 text-sm text-red-200">{error}</p>}
        </div>

        <div className="flex flex-col-reverse gap-2 border-t border-slate-700 p-5 sm:flex-row sm:justify-end">
          <button type="button" onClick={onClose} className="rounded-xl border border-slate-600 px-4 py-2.5 text-sm font-semibold text-slate-300 hover:bg-slate-800">Cancel</button>
          <button type="submit" disabled={isSubmitting} className="rounded-xl bg-sky-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-sky-500 disabled:cursor-not-allowed disabled:opacity-60">{isSubmitting ? 'Saving...' : 'Save fee data'}</button>
        </div>
      </form>
    </div>
  );
}
