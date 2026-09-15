import { useEffect, useState, useMemo } from 'react';
import {
  AlertCircle,
  BookOpen,
  Check,
  GraduationCap,
  Layers3,
  Loader2,
  Save,
  X,
  Plus,
  Sparkles,
} from 'lucide-react';
import { apiPut } from '../../../api/api.js';

const EMPTY_FORM = {
  subject: '',
  abbreviation: '',
  class_ids: [],
  max_marks: 100,
  pass_marks: 33,
  staff_id: '',
};

function getClassId(item) {
  return item?.id ?? item?.class_id ?? item?.classId ?? '';
}

function getClassName(item) {
  return item?.class_name ?? item?.name ?? item?.className ?? 'Class';
}

function getInitialForm(subject, classes) {
  if (!subject) {
    return {
      ...EMPTY_FORM,
      class_ids: classes.length ? [String(getClassId(classes[0]))] : [],
    };
  }

  return {
    ...EMPTY_FORM,
    subject: subject.subject || '',
    abbreviation: subject.abbreviation || '',
    max_marks: subject.max_marks ?? 100,
    pass_marks: subject.pass_marks ?? 33,
    staff_id: subject.staff_id !== null && subject.staff_id !== undefined ? String(subject.staff_id) : '',
    class_ids: Array.isArray(subject.classes)
      ? subject.classes.map((item) => String(getClassId(item)))
      : subject.class_id
        ? [String(subject.class_id)]
        : [],
  };
}

function SubjectFormModal({ subject, classes, staff, onClose, onSaved, onError, onRefresh }) {
  const initialValues = useMemo(() => getInitialForm(subject, classes), [subject, classes]);
  const [formData, setFormData] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const [isSaving, setIsSaving] = useState(false);

  // Dirty checking: Check if current form data differs from initial values
  const isDirty = useMemo(() => {
    return (
      formData.subject !== initialValues.subject ||
      formData.abbreviation !== initialValues.abbreviation ||
      Number(formData.max_marks) !== Number(initialValues.max_marks) ||
      Number(formData.pass_marks) !== Number(initialValues.pass_marks) ||
      String(formData.staff_id) !== String(initialValues.staff_id) ||
      formData.class_ids.length !== initialValues.class_ids.length ||
      !formData.class_ids.every((id) => initialValues.class_ids.includes(id))
    );
  }, [formData, initialValues]);

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

  function toggleClassSelection(classId) {
    const stringId = String(classId);
    setFormData((current) => {
      const exists = current.class_ids.includes(stringId);
      const updatedClassIds = exists
        ? current.class_ids.filter((id) => id !== stringId)
        : [...current.class_ids, stringId];
      return { ...current, class_ids: updatedClassIds };
    });
    setErrors((current) => ({ ...current, class_ids: '', submit: '' }));
  }

  function handleSelectAllClasses() {
    const allIds = classes.map((item) => String(getClassId(item)));
    setFormData((current) => ({ ...current, class_ids: allIds }));
    setErrors((current) => ({ ...current, class_ids: '', submit: '' }));
  }

  function handleClearAllClasses() {
    setFormData((current) => ({ ...current, class_ids: [] }));
    setErrors((current) => ({ ...current, class_ids: '', submit: '' }));
  }

  function validate() {
    const nextErrors = {};
    if (!String(formData.subject).trim()) nextErrors.subject = 'Subject name is required.';
    if (!String(formData.abbreviation).trim()) nextErrors.abbreviation = 'Abbreviation is required.';
    if (!formData.class_ids.length) nextErrors.class_ids = 'Select at least one class.';
    if (Number(formData.max_marks) < 1) nextErrors.max_marks = 'Max marks must be greater than zero.';
    if (Number(formData.pass_marks) < 0 || Number(formData.pass_marks) > Number(formData.max_marks)) {
      nextErrors.pass_marks = 'Pass marks must be between zero and max marks.';
    }
    return nextErrors;
  }

  async function handleSubmit(event) {
    event.preventDefault();
    const nextErrors = validate();
    setErrors(nextErrors);

    if (Object.keys(nextErrors).length) return;

    setIsSaving(true);

    const payload = {
      subject: String(formData.subject).trim(),
      abbreviation: String(formData.abbreviation).trim(),
      max_marks: Number(formData.max_marks),
      pass_marks: Number(formData.pass_marks),
      staff_id: formData.staff_id ? Number(formData.staff_id) : null,
      class_ids: Array.from(new Set(formData.class_ids.map((value) => Number(value)))),
    };

    try {
      const response = await apiPut(`/api/update_subject/${subject.id}`, payload);
      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        const message =
          data.error ||
          (response.status === 409
            ? 'This subject can no longer be edited because marks have been entered.'
            : 'Unable to save subject.');
        setErrors({ submit: message });
        onError(message);
        if (response.status === 409 || data.editable === false) await onRefresh();
        return;
      }

      onSaved('Subject updated successfully.');
    } catch {
      const message = 'Unable to save subject. Please try again.';
      setErrors({ submit: message });
      onError(message);
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-3 backdrop-blur-md animate-in fade-in duration-200">
      <button type="button" className="absolute inset-0 cursor-default" onClick={onClose} aria-label="Close dialog" />

      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="subject-modal-title"
        className="relative z-10 w-full max-w-4xl max-h-[92vh] overflow-hidden rounded-[2rem] border border-white/15 bg-[#111115] text-zinc-100 shadow-[0_25px_100px_rgba(0,0,0,0.9)] flex flex-col"
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/10 bg-gradient-to-r from-indigo-950/80 via-purple-950/40 to-zinc-950 px-6 py-5">
          <div className="flex items-center gap-4">
            <span className="flex h-12 w-12 items-center justify-center rounded-2xl border border-indigo-400/40 bg-gradient-to-br from-indigo-500/20 to-purple-500/20 text-indigo-300 shadow-inner">
              <BookOpen className="h-6 w-6" />
            </span>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-bold uppercase tracking-[0.25em] text-indigo-400">Exam Setup</span>
                <span className="inline-flex items-center gap-1 rounded-full bg-indigo-500/10 px-2 py-0.5 text-[10px] font-semibold text-indigo-300 border border-indigo-500/20">
                  <Sparkles className="h-3 w-3" /> Live Editor
                </span>
              </div>
              <h2 id="subject-modal-title" className="mt-1 text-2xl font-bold tracking-tight text-white">
                Edit Subject Record
              </h2>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full p-2 text-zinc-400 transition hover:bg-white/10 hover:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            aria-label="Close modal"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto">
          <div className="grid gap-6 px-6 py-6 sm:grid-cols-2">
            
            {/* Section 1: Subject Details */}
            <div className="sm:col-span-2">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.22em] text-indigo-400/90 pb-2 border-b border-white/5">
                <Layers3 className="h-4 w-4 text-indigo-400" />
                Core Properties
              </div>
            </div>

            <div className="sm:col-span-1">
              <label htmlFor="subject-subject" className="mb-2 block text-[11px] font-bold uppercase tracking-[0.2em] text-zinc-400">
                Subject Name <span className="text-rose-400">*</span>
              </label>
              <input
                id="subject-subject"
                name="subject"
                type="text"
                value={formData.subject}
                onChange={updateField}
                placeholder="e.g. Advanced Mathematics"
                className="w-full rounded-2xl border border-white/10 bg-zinc-900/80 px-4 py-3 text-sm text-zinc-100 outline-none transition focus:border-indigo-500 focus:bg-zinc-900 focus:ring-4 focus:ring-indigo-500/15"
              />
              {errors.subject && <p className="mt-1.5 text-xs text-rose-400">{errors.subject}</p>}
            </div>

            <div className="sm:col-span-1">
              <label htmlFor="subject-abbreviation" className="mb-2 block text-[11px] font-bold uppercase tracking-[0.2em] text-zinc-400">
                Abbreviation <span className="text-rose-400">*</span>
              </label>
              <input
                id="subject-abbreviation"
                name="abbreviation"
                type="text"
                value={formData.abbreviation}
                onChange={updateField}
                placeholder="e.g. ADV-MATH"
                className="w-full rounded-2xl border border-white/10 bg-zinc-900/80 px-4 py-3 text-sm text-zinc-100 outline-none transition focus:border-indigo-500 focus:bg-zinc-900 focus:ring-4 focus:ring-indigo-500/15"
              />
              {errors.abbreviation && <p className="mt-1.5 text-xs text-rose-400">{errors.abbreviation}</p>}
            </div>

            <div className="sm:col-span-1">
              <label htmlFor="subject-max_marks" className="mb-2 block text-[11px] font-bold uppercase tracking-[0.2em] text-zinc-400">
                Max Marks
              </label>
              <input
                id="subject-max_marks"
                name="max_marks"
                type="number"
                min="1"
                value={formData.max_marks}
                onChange={updateField}
                className="w-full rounded-2xl border border-white/10 bg-zinc-900/80 px-4 py-3 text-sm text-zinc-100 outline-none transition focus:border-indigo-500 focus:bg-zinc-900 focus:ring-4 focus:ring-indigo-500/15"
              />
              {errors.max_marks && <p className="mt-1.5 text-xs text-rose-400">{errors.max_marks}</p>}
            </div>

            <div className="sm:col-span-1">
              <label htmlFor="subject-pass_marks" className="mb-2 block text-[11px] font-bold uppercase tracking-[0.2em] text-zinc-400">
                Pass Marks
              </label>
              <input
                id="subject-pass_marks"
                name="pass_marks"
                type="number"
                min="0"
                value={formData.pass_marks}
                onChange={updateField}
                className="w-full rounded-2xl border border-white/10 bg-zinc-900/80 px-4 py-3 text-sm text-zinc-100 outline-none transition focus:border-indigo-500 focus:bg-zinc-900 focus:ring-4 focus:ring-indigo-500/15"
              />
              {errors.pass_marks && <p className="mt-1.5 text-xs text-rose-400">{errors.pass_marks}</p>}
            </div>

            {/* Section 2: Class Assignments */}
            <div className="sm:col-span-2 pt-2">
              <div className="flex items-center justify-between gap-4 pb-2 border-b border-white/5">
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.22em] text-indigo-400/90">
                  <GraduationCap className="h-4 w-4 text-indigo-400" />
                  Assigned Classes <span className="text-rose-400">*</span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleSelectAllClasses}
                    className="text-[10px] font-semibold uppercase tracking-wider text-indigo-300 hover:text-indigo-200 transition bg-indigo-500/10 px-2.5 py-1 rounded-lg border border-indigo-500/20"
                  >
                    Select All
                  </button>
                  <button
                    type="button"
                    onClick={handleClearAllClasses}
                    className="text-[10px] font-semibold uppercase tracking-wider text-zinc-400 hover:text-zinc-200 transition bg-white/5 px-2.5 py-1 rounded-lg border border-white/10"
                  >
                    Clear
                  </button>
                  <span className="rounded-full border border-indigo-400/30 bg-indigo-500/20 px-3 py-0.5 text-[10px] font-bold text-indigo-200 ml-1">
                    {formData.class_ids.length} Selected
                  </span>
                </div>
              </div>

              {/* Interactive Tag Grid for Class Assignment */}
              <div className="mt-3 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2.5 max-h-48 overflow-y-auto p-1">
                {classes.map((item) => {
                  const classIdStr = String(getClassId(item));
                  const isSelected = formData.class_ids.includes(classIdStr);
                  const className = getClassName(item);

                  return (
                    <button
                      key={classIdStr}
                      type="button"
                      onClick={() => toggleClassSelection(classIdStr)}
                      className={`flex items-center justify-between p-3 rounded-xl border text-left transition-all ${
                        isSelected
                          ? 'border-indigo-500/50 bg-gradient-to-r from-indigo-500/20 to-purple-500/15 text-white shadow-sm ring-1 ring-indigo-500/30'
                          : 'border-white/10 bg-zinc-900/50 text-zinc-400 hover:border-white/20 hover:bg-zinc-900 hover:text-zinc-200'
                      }`}
                    >
                      <span className="text-xs font-semibold truncate pr-2">{className}</span>
                      <span
                        className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border transition-all ${
                          isSelected
                            ? 'border-indigo-400 bg-indigo-500 text-white'
                            : 'border-zinc-700 bg-zinc-800 text-transparent'
                        }`}
                      >
                        <Check className="h-3 w-3 stroke-[3]" />
                      </span>
                    </button>
                  );
                })}
              </div>
              {errors.class_ids && <p className="mt-2 text-xs text-rose-400">{errors.class_ids}</p>}
            </div>

            {/* Section 3: Staff Assignment & Info */}
            <div className="sm:col-span-1 pt-2">
              <label htmlFor="subject-staff" className="mb-2 block text-[11px] font-bold uppercase tracking-[0.2em] text-zinc-400">
                Assigned Staff Member
              </label>
              <select
                id="subject-staff"
                name="staff_id"
                value={formData.staff_id}
                onChange={updateField}
                className="w-full rounded-2xl border border-white/10 bg-zinc-900/80 px-4 py-3 text-sm text-zinc-100 outline-none transition focus:border-indigo-500 focus:bg-zinc-900 focus:ring-4 focus:ring-indigo-500/15"
              >
                <option value="">Unassigned</option>
                {staff.map((item) => {
                  const staffId = item.id ?? item.staff_id ?? item.user_id;
                  const staffName = item.name || item.full_name || item.username || 'Staff member';
                  return (
                    <option key={staffId} value={staffId}>
                      {staffName}
                    </option>
                  );
                })}
              </select>
            </div>

            <div className="sm:col-span-1 pt-2">
              <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-4 h-full flex items-center gap-3.5">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-emerald-500/30 bg-emerald-500/10 text-emerald-300">
                  <Check className="h-5 w-5" />
                </span>
                <div>
                  <div className="text-[10px] font-bold uppercase tracking-[0.2em] text-emerald-400/80">Status Indicator</div>
                  <div className="mt-0.5 text-sm font-medium text-emerald-200">
                    {isDirty ? 'Changes pending save...' : 'Record up to date'}
                  </div>
                </div>
              </div>
            </div>

          </div>

          {errors.submit && (
            <div className="mx-6 mb-4 flex items-center gap-2.5 rounded-2xl border border-rose-500/30 bg-rose-500/10 px-4 py-3 text-sm text-rose-300">
              <AlertCircle className="h-4 w-4 shrink-0" />
              <span>{errors.submit}</span>
            </div>
          )}

          {/* Footer Actions */}
          <div className="flex items-center justify-between border-t border-white/10 bg-zinc-950/80 px-6 py-4">
            <div className="text-xs text-zinc-400">
              {!isDirty && <span className="italic">Modify any field to enable saving</span>}
            </div>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={onClose}
                className="rounded-2xl border border-white/10 px-5 py-2.5 text-sm font-semibold text-zinc-300 transition hover:bg-white/5 hover:text-white"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSaving || !isDirty}
                className="inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-indigo-500 via-purple-500 to-violet-600 px-6 py-2.5 text-sm font-semibold text-white shadow-lg shadow-indigo-950/50 transition hover:opacity-95 hover:shadow-indigo-500/25 disabled:cursor-not-allowed disabled:opacity-40 disabled:shadow-none"
              >
                {isSaving ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" /> Saving...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4" /> Save Changes
                  </>
                )}
              </button>
            </div>
          </div> 
        </form>
      </div>
    </div>
  );
}

export default SubjectFormModal;