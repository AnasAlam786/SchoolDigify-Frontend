import { useEffect, useMemo, useState } from 'react';
import { AlertCircle, CalendarDays, Check, GraduationCap, Loader2, Save, X } from 'lucide-react';
import { apiPut } from '../../../api/api.js';

const EMPTY_FORM = {
  exam_name: '',
  exam_code: '',
  weightage: '',
  display_order: '',
  term: '',
  class_ids: []
};

function getClassId(item) {
  return item?.id ?? item?.class_id ?? item?.classId ?? '';
}

function getInitialForm(exam, classes) {
  if (!exam) return {
    ...EMPTY_FORM,
    class_ids: classes.length ? [String(getClassId(classes[0]))] : []
  };
  return {
    exam_name: exam.exam_name || '',
    exam_code: exam.exam_code || '',
    weightage: exam.weightage ?? '',
    display_order: exam.display_order ?? '',
    term: exam.term ?? '',
    class_ids: (exam.classes || []).map((item) => String(getClassId(item)))
  };
}

function ExamFormModal({ exam, classes, onClose, onSaved, onError, onRefresh }) {
  const initialValues = useMemo(() => getInitialForm(exam, classes), [exam, classes]);
  const [formData, setFormData] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const [isSaving, setIsSaving] = useState(false);
  const isDirty = JSON.stringify(formData) !== JSON.stringify(initialValues);

  useEffect(() => {
    const handleKeyDown = (event) => event.key === 'Escape' && onClose();
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  function updateField(event) {
    const { name, value } = event.target;
    setFormData((current) => ({ ...current, [name]: value }));
    setErrors((current) => ({ ...current, [name]: '', submit: '' }));
  }

  function toggleClass(classId) {
    const id = String(classId);
    setFormData((current) => ({
      ...current,
      class_ids: current.class_ids.includes(id)
        ? current.class_ids.filter((value) => value !== id)
        : [...current.class_ids, id]
    }));
    setErrors((current) => ({ ...current, class_ids: '', submit: '' }));
  }

  function validate() {
    const next = {};
    if (!formData.exam_name.trim()) next.exam_name = 'Exam name is required.';
    if (!formData.exam_code.trim()) next.exam_code = 'Exam code is required.';
    if (formData.weightage === '' || Number.isNaN(Number(formData.weightage))) next.weightage = 'Weightage must be numeric.';
    if (formData.display_order === '' || !Number.isInteger(Number(formData.display_order))) next.display_order = 'Display order must be an integer.';
    if (formData.term === '' || !Number.isInteger(Number(formData.term))) next.term = 'Term must be an integer.';
    if (!formData.class_ids.length) next.class_ids = 'Select at least one class.';
    return next;
  }

  async function handleSubmit(event) {
    event.preventDefault();
    const nextErrors = validate();
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) return;
    setIsSaving(true);
    try {
      const response = await apiPut(`/api/update_exam/${exam.id}`, {
        exam_name: formData.exam_name.trim(),
        exam_code: formData.exam_code.trim(),
        weightage: Number(formData.weightage),
        display_order: Number(formData.display_order),
        term: Number(formData.term),
        class_ids: formData.class_ids.map(Number)
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) {
        const message = data.error || 'Unable to save exam.';
        setErrors({ submit: message });
        onError(message);
        if (response.status === 409 || data.editable === false) await onRefresh();
        return;
      }
      onSaved('Exam updated successfully.');
    } catch {
      const message = 'Unable to save exam. Please try again.';
      setErrors({ submit: message });
      onError(message);
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-3 backdrop-blur-md">
      <button type="button" className="absolute inset-0 cursor-default" onClick={onClose} aria-label="Close dialog" />
      <div role="dialog" aria-modal="true" aria-labelledby="exam-modal-title" className="relative z-10 flex max-h-[92vh] w-full max-w-3xl flex-col overflow-hidden rounded-[2rem] border border-white/15 bg-[#111115] text-zinc-100 shadow-2xl">
        <div className="flex items-center justify-between border-b border-white/10 bg-gradient-to-r from-emerald-950/70 via-zinc-950 to-zinc-950 px-6 py-5">
          <div className="flex items-center gap-4">
            <span className="flex h-11 w-11 items-center justify-center rounded-2xl border border-emerald-400/30 bg-emerald-500/10 text-emerald-300">
              <CalendarDays className="h-5 w-5" />
            </span>
            <div>
              <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-emerald-400">Exam Setup</p>
              <h2 id="exam-modal-title" className="mt-1 text-2xl font-bold text-white">Edit Exam Record</h2>
            </div>
          </div>
          <button type="button" onClick={onClose} className="rounded-full p-2 text-zinc-400 hover:bg-white/10 hover:text-white" aria-label="Close modal">
            <X className="h-5 w-5" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto">
          <div className="grid gap-5 px-6 py-6 sm:grid-cols-2">
            <Field label="Exam Name" name="exam_name" value={formData.exam_name} onChange={updateField} error={errors.exam_name} placeholder="e.g. Half Yearly Examination" />
            <Field label="Exam Code" name="exam_code" value={formData.exam_code} onChange={updateField} error={errors.exam_code} placeholder="e.g. HY-2026" />
            <Field label="Weightage" name="weightage" type="number" min="0" value={formData.weightage} onChange={updateField} error={errors.weightage} />
            <Field label="Display Order" name="display_order" type="number" min="0" value={formData.display_order} onChange={updateField} error={errors.display_order} />
            <Field label="Term" name="term" type="number" min="1" value={formData.term} onChange={updateField} error={errors.term} />
            <div className="sm:col-span-2">
              <div className="mb-2 flex items-center justify-between border-b border-white/5 pb-2">
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.18em] text-emerald-400">
                  <GraduationCap className="h-4 w-4" /> Assigned Classes <span className="text-rose-400">*</span>
                </div>
                <span className="rounded-full bg-emerald-500/15 px-3 py-1 text-[10px] font-bold text-emerald-200">
                  {formData.class_ids.length} Selected
                </span>
              </div>
              <div className="grid max-h-48 grid-cols-2 gap-2 overflow-y-auto p-1 sm:grid-cols-3">
                {classes.map((item) => {
                  const id = String(getClassId(item));
                  const selected = formData.class_ids.includes(id);
                  return (
                    <button
                      key={id}
                      type="button"
                      onClick={() => toggleClass(id)}
                      className={`flex items-center justify-between rounded-xl border p-3 text-left ${selected ? 'border-emerald-500/50 bg-emerald-500/15 text-white' : 'border-white/10 bg-zinc-900/50 text-zinc-400 hover:border-white/20'}`}
                    >
                      <span className="truncate pr-2 text-xs font-semibold">{item.class_name || item.name || 'Class'}</span>
                      <span className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border ${selected ? 'border-emerald-400 bg-emerald-500 text-white' : 'border-zinc-700 text-transparent'}`}>
                        <Check className="h-3 w-3" />
                      </span>
                    </button>
                  );
                })}
              </div>
              {errors.class_ids && <p className="mt-2 text-xs text-rose-400">{errors.class_ids}</p>}
            </div>
          </div>
          {errors.submit && (
            <div className="mx-6 mb-4 flex items-center gap-2 rounded-2xl border border-rose-500/30 bg-rose-500/10 px-4 py-3 text-sm text-rose-300">
              <AlertCircle className="h-4 w-4" />
              {errors.submit}
            </div>
          )}
          <div className="flex justify-end gap-3 border-t border-white/10 bg-zinc-950/80 px-6 py-4">
            <button type="button" onClick={onClose} className="rounded-2xl border border-white/10 px-5 py-2.5 text-sm font-semibold text-zinc-300 hover:bg-white/5">
              Cancel
            </button>
            <button type="submit" disabled={isSaving || !isDirty} className="inline-flex items-center gap-2 rounded-2xl bg-emerald-600 px-6 py-2.5 text-sm font-semibold text-white hover:bg-emerald-500 disabled:cursor-not-allowed disabled:opacity-40">
              {isSaving ? <><Loader2 className="h-4 w-4 animate-spin" /> Saving...</> : <><Save className="h-4 w-4" /> Save Changes</>}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function Field({ label, name, value, onChange, error, ...props }) {
  return (
    <div>
      <label htmlFor={`exam-${name}`} className="mb-2 block text-[11px] font-bold uppercase tracking-[0.18em] text-zinc-400">
        {label} <span className="text-rose-400">*</span>
      </label>
      <input
        id={`exam-${name}`}
        name={name}
        value={value}
        onChange={onChange}
        className="w-full rounded-2xl border border-white/10 bg-zinc-900/80 px-4 py-3 text-sm text-zinc-100 outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/15"
        {...props}
      />
      {error && <p className="mt-1.5 text-xs text-rose-400">{error}</p>}
    </div>
  );
}

export default ExamFormModal;