import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { apiGet, apiPost } from '../../../api/api';

// ==========================================
// UTILITY FUNCTIONS & INITIALIZATION
// ==========================================

const formatDate = (dateStr) => {
  if (!dateStr) return '';
  const date = new Date(dateStr);
  if (isNaN(date.getTime())) return dateStr;
  return date.toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
};

const initializeFormState = (feeSetupData) => {
  const initialState = {};
  if (!Array.isArray(feeSetupData)) return initialState;

  feeSetupData.forEach((classData) => {
    initialState[classData.class_id] = {};
    if (Array.isArray(classData.terms)) {
      classData.terms.forEach((term) => {
        initialState[classData.class_id][term.structure_id] = {
          amount: term.amount !== null && term.amount !== undefined ? String(term.amount) : '',
          due_date: term.due_date || '',
        };
      });
    }
  });

  return initialState;
};

// ==========================================
// SUB-COMPONENTS
// ==========================================

const TermCard = React.memo(({ term, formData, onChange, errors }) => {
  const { structure_id, period_name, fee_type, is_due_date_mandatory, amount: previousAmount } = term;
  const currentData = formData[structure_id] || { amount: '', due_date: '' };

  const amountError = errors[`${structure_id}_amount`];
  const dueDateError = errors[`${structure_id}_due_date`];

  const handleAmountChange = (e) => {
    const val = e.target.value;
    if (val === '' || /^\d*\.?\d*$/.test(val)) {
      onChange(structure_id, 'amount', val);
    }
  };

  const handleDueDateChange = (e) => {
    onChange(structure_id, 'due_date', e.target.value);
  };

  const hasAmountChanged =
    previousAmount !== null &&
    previousAmount !== undefined &&
    currentData.amount !== String(previousAmount);

  return (
    <div className="group relative rounded-xl border border-slate-700/60 bg-[#1E293B]/70 p-4 transition-all duration-200 hover:border-slate-600/80 hover:bg-[#1E293B] hover:shadow-lg hover:shadow-indigo-950/20">
      {/* Card Header */}
      <div className="mb-3.5 flex items-center justify-between border-b border-slate-700/50 pb-2.5">
        <div className="flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-indigo-400/80 group-hover:bg-indigo-400 group-hover:shadow-[0_0_8px_rgba(99,102,241,0.6)] transition-all"></span>
          <span className="text-sm font-semibold tracking-wide text-slate-100">{period_name}</span>
        </div>
        <span className="rounded-md border border-indigo-500/20 bg-indigo-500/10 px-2.5 py-0.5 text-xs font-medium text-indigo-300">
          {fee_type}
        </span>
      </div>

      {/* Inputs */}
      <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2">
        {/* Amount Input */}
        <div>
          <label className="mb-1.5 block text-xs font-medium text-slate-300">Amount</label>
          <div className="relative flex items-center">
            <span className="pointer-events-none absolute left-3 text-sm font-semibold text-slate-400">
              ₹
            </span>
            <input
              type="text"
              inputMode="decimal"
              value={currentData.amount}
              onChange={handleAmountChange}
              placeholder="0.00"
              className={`h-10 w-full rounded-lg border bg-[#0F172A]/80 pl-8 pr-3 text-sm font-semibold text-white placeholder-slate-500 outline-none transition-all duration-150 focus:bg-[#0F172A] ${
                amountError
                  ? 'border-rose-500/80 focus:border-rose-500 focus:ring-2 focus:ring-rose-500/20'
                  : 'border-slate-700 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20'
              }`}
            />
          </div>

          {/* Previous Year Reference */}
          {amountError ? (
            <p className="mt-1 text-[11px] font-medium text-rose-400">{amountError}</p>
          ) : (
            <div className="mt-1.5 flex items-center gap-1.5 text-[11px]">
              <span className="text-slate-400 font-normal">Prev Session:</span>
              <span
                className={`font-semibold ${
                  hasAmountChanged
                    ? 'rounded bg-amber-500/10 px-1 py-0.2 text-amber-300 border border-amber-500/20'
                    : 'text-slate-300'
                }`}
              >
                {previousAmount !== null && previousAmount !== undefined
                  ? `₹${previousAmount}`
                  : 'Not set'}
              </span>
            </div>
          )}
        </div>

        {/* Due Date Input */}
        <div>
          <label className="mb-1.5 block text-xs font-medium text-slate-300">
            Due date {is_due_date_mandatory && <span className="text-rose-400">*</span>}
          </label>
          <input
            type="date"
            value={currentData.due_date}
            onChange={handleDueDateChange}
            className={`h-10 w-full rounded-lg border bg-[#0F172A]/80 px-3 text-sm font-medium text-white outline-none transition-all duration-150 focus:bg-[#0F172A] [color-scheme:dark] ${
              dueDateError
                ? 'border-rose-500/80 focus:border-rose-500 focus:ring-2 focus:ring-rose-500/20'
                : 'border-slate-700 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20'
            }`}
          />
          {dueDateError ? (
            <p className="mt-1 text-[11px] font-medium text-rose-400">{dueDateError}</p>
          ) : (
            currentData.due_date && (
              <p className="mt-1.5 text-[11px] text-slate-400">
                Due: <span className="font-medium text-slate-300">{formatDate(currentData.due_date)}</span>
              </p>
            )
          )}
        </div>
      </div>
    </div>
  );
});

// Class Section with Clip-Path Corner Guard and Zero-Gap Sticky Header
const ClassSection = React.memo(({ classData, formData, onFieldChange, errors }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [bulkAmount, setBulkAmount] = useState('');

  const handleTermChange = useCallback(
    (structureId, field, value) => {
      onFieldChange(classData.class_id, structureId, field, value);
    },
    [classData.class_id, onFieldChange]
  );

  const handleApplyBulkAmount = () => {
    if (!bulkAmount || isNaN(Number(bulkAmount)) || Number(bulkAmount) < 0) return;
    classData.terms?.forEach((term) => {
      onFieldChange(classData.class_id, term.structure_id, 'amount', bulkAmount);
    });
  };

  return (
    <section
      className="relative mb-4 rounded-2xl border border-slate-800/90 bg-[#111827]/70 shadow-md transition-all duration-200"
      style={{ clipPath: 'inset(0 round 1rem)' }}
    >
      {/* Sticky Header - Solid background with square top edge clipped by parent clipPath */}
      <div className="sticky top-0 z-20 rounded-none border-b border-slate-700/60 bg-[#18212E] px-4 py-3.5 shadow-md shadow-black/30">
        <div className="flex flex-wrap items-center justify-between gap-3">
          {/* Class Title & Expand/Collapse Toggle */}
          <button
            type="button"
            onClick={() => setIsCollapsed((prev) => !prev)}
            className="group flex items-center gap-3 text-left focus:outline-none"
          >
            <div className="flex h-7 w-7 items-center justify-center rounded-lg border border-slate-700/80 bg-slate-800/80 text-slate-400 transition-all duration-200 group-hover:border-indigo-500/50 group-hover:bg-indigo-500/10 group-hover:text-indigo-300">
              <svg
                className={`h-4 w-4 transform transition-transform duration-200 ${
                  isCollapsed ? '-rotate-90' : 'rotate-0'
                }`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
              </svg>
            </div>
            <div className="flex items-center gap-2.5">
              <h3 className="text-sm font-bold tracking-tight text-white transition-colors group-hover:text-indigo-300">
                {classData.class_name}
              </h3>
              <span className="rounded-full bg-indigo-500/15 border border-indigo-500/30 px-2.5 py-0.5 text-[11px] font-semibold text-indigo-300">
                {classData.terms?.length || 0} Terms
              </span>
            </div>
          </button>

          {/* Quick Fill Action Bar */}
          <div className="flex items-center gap-1.5 rounded-xl border border-slate-700/70 bg-[#0F172A] p-1 shadow-inner">
            <div className="relative flex items-center">
              <span className="pointer-events-none absolute left-2.5 text-xs font-bold text-slate-400">
                ₹
              </span>
              <input
                type="text"
                inputMode="decimal"
                placeholder="Set all term fees"
                value={bulkAmount}
                onChange={(e) => {
                  const val = e.target.value;
                  if (val === '' || /^\d*\.?\d*$/.test(val)) setBulkAmount(val);
                }}
                className="h-7 w-28 rounded-lg bg-transparent pl-6 pr-2 text-xs font-semibold text-white placeholder-slate-500 focus:outline-none"
              />
            </div>

            <button
              type="button"
              onClick={handleApplyBulkAmount}
              className="flex h-7 items-center gap-1.5 rounded-lg bg-indigo-600 px-3 text-xs font-semibold text-white shadow-sm transition-all hover:bg-indigo-500 active:scale-95 disabled:opacity-50"
            >
              <span>Apply to All</span>
              <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Terms Grid / List Container */}
      {!isCollapsed && (
        <div className="p-4 space-y-3 bg-[#0F172A]/30">
          {classData.terms?.map((term) => (
            <TermCard
              key={term.structure_id}
              term={term}
              formData={formData[classData.class_id] || {}}
              onChange={handleTermChange}
              errors={errors}
            />
          ))}
        </div>
      )}
    </section>
  );
});

const ConfirmationDialog = ({ onConfirm, onCancel }) => (
  <div className="absolute inset-0 z-50 flex items-center justify-center bg-slate-950/75 p-4 backdrop-blur-sm animate-in fade-in duration-150">
    <div className="w-full max-w-md rounded-2xl border border-slate-700/80 bg-[#1E293B] p-6 shadow-2xl shadow-black/50">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
          <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </div>
        <div>
          <h4 className="text-base font-bold text-white">Discard unsaved changes?</h4>
          <p className="text-xs text-slate-400">This action cannot be undone.</p>
        </div>
      </div>
      <p className="mt-3 text-sm text-slate-300 leading-relaxed">
        You have unsaved changes in your fee configuration. If you exit now, these edits will be permanently lost.
      </p>
      <div className="mt-6 flex justify-end gap-3">
        <button
          type="button"
          onClick={onCancel}
          className="h-10 rounded-xl border border-slate-700 bg-slate-800/80 px-4 text-xs font-semibold text-slate-200 hover:bg-slate-700 transition-all"
        >
          Keep Editing
        </button>
        <button
          type="button"
          onClick={onConfirm}
          className="h-10 rounded-xl bg-gradient-to-r from-rose-600 to-red-600 px-4 text-xs font-semibold text-white shadow-md shadow-rose-950/40 hover:from-rose-500 hover:to-red-500 transition-all"
        >
          Discard Changes
        </button>
      </div>
    </div>
  </div>
);

const LoadingSkeleton = () => (
  <div className="animate-pulse space-y-6 p-4">
    {[1, 2].map((idx) => (
      <div key={idx} className="space-y-3">
        <div className="h-12 w-full rounded-2xl bg-slate-800/80 border border-slate-700/50" />
        <div className="space-y-3 pl-1">
          <div className="h-28 w-full rounded-xl border border-slate-800 bg-[#1E293B]/40" />
          <div className="h-28 w-full rounded-xl border border-slate-800 bg-[#1E293B]/40" />
        </div>
      </div>
    ))}
  </div>
);

const EmptyState = () => (
  <div className="flex flex-col items-center justify-center py-16 text-center">
    <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 shadow-inner">
      <svg className="h-7 w-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
      </svg>
    </div>
    <h4 className="mt-4 text-base font-bold text-slate-200">No fee structures found</h4>
    <p className="mt-1 text-xs text-slate-400 max-w-xs leading-relaxed">
      There are no classes or terms currently available to setup for this academic session.
    </p>
  </div>
);

// ==========================================
// MAIN COMPONENT
// ==========================================

export default function FeeSessionSetupModal({ onClose, onSetupComplete }) {
  const [feeSetupData, setFeeSetupData] = useState([]);
  const [formData, setFormData] = useState({});
  const [initialDataHash, setInitialDataHash] = useState('');
  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState(null);

  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [showConfirmClose, setShowConfirmClose] = useState(false);

  useEffect(() => {
    let isMounted = true;

    async function loadFeeStructure() {
      setIsLoading(true);
      setApiError(null);

      try {
        const response = await apiGet(`/api/get_fee_session_setup_data`);
        const payload = await response.json();

        if (!response.ok) {
          throw new Error(payload?.error || 'Failed to fetch fee setup data');
        }

        if (isMounted) {
          const rawSetupData = payload.fee_setup_data || [];
          const initialForm = initializeFormState(rawSetupData);

          setFeeSetupData(rawSetupData);
          setFormData(initialForm);
          setInitialDataHash(JSON.stringify(initialForm));
        }
      } catch (err) {
        if (isMounted) {
          console.error('Failed to fetch fee setup data:', err);
          setApiError(err.message || 'Unable to load fee data');
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    loadFeeStructure();

    return () => {
      isMounted = false;
    };
  }, []);

  const isDirty = useMemo(() => {
    return JSON.stringify(formData) !== initialDataHash;
  }, [formData, initialDataHash]);

  const handleFieldChange = useCallback((classId, structureId, field, value) => {
    setFormData((prev) => ({
      ...prev,
      [classId]: {
        ...prev[classId],
        [structureId]: {
          ...prev[classId]?.[structureId],
          [field]: value,
        },
      },
    }));

    setErrors((prevErrors) => {
      const errorKey = `${structureId}_${field}`;
      if (prevErrors[errorKey]) {
        const copy = { ...prevErrors };
        delete copy[errorKey];
        return copy;
      }
      return prevErrors;
    });
  }, []);

  const handleDismissAttempt = useCallback(() => {
    if (isSaving) return;
    if (isDirty) {
      setShowConfirmClose(true);
    } else {
      onClose?.();
    }
  }, [isDirty, isSaving, onClose]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        if (showConfirmClose) {
          setShowConfirmClose(false);
        } else {
          handleDismissAttempt();
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [showConfirmClose, handleDismissAttempt]);

  const validateForm = () => {
    const newErrors = {};
    let isValid = true;

    feeSetupData.forEach((classItem) => {
      classItem.terms?.forEach((term) => {
        const fieldState = formData[classItem.class_id]?.[term.structure_id] || {};
        const rawAmount = fieldState.amount;
        const rawDueDate = fieldState.due_date;

        if (rawAmount !== '' && rawAmount !== undefined) {
          const numVal = Number(rawAmount);
          if (isNaN(numVal) || numVal < 0) {
            newErrors[`${term.structure_id}_amount`] = 'Amount must be non-negative';
            isValid = false;
          }
        }

        if (term.is_due_date_mandatory) {
          if (!rawDueDate || rawDueDate.trim() === '') {
            newErrors[`${term.structure_id}_due_date`] = `Due date required for ${term.period_name}`;
            isValid = false;
          }
        }
      });
    });

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSaving || isLoading) return;

    if (!validateForm()) {
      return;
    }

    setIsSaving(true);
    setApiError(null);

    const payload = {
      classes: feeSetupData.map((classItem) => ({
        class_id: classItem.class_id,
        terms: classItem.terms.map((term) => {
          const termData = formData[classItem.class_id]?.[term.structure_id] || {};
          return {
            structure_id: term.structure_id,
            amount: termData.amount !== '' ? Number(termData.amount) : null,
            due_date: termData.due_date || null,
          };
        }),
      })),
    };

    try {
      const response = await apiPost('/api/save_fee_session_setup', payload);
      const resPayload = await response.json();

      if (!response.ok) {
        throw new Error(resPayload?.error || 'Failed to save fee setup data.');
      }
      if (onSetupComplete) {
        onSetupComplete(payload); // Pass updated data back if needed
      }
      showAlert(200, "Fee setup completed successfully. You can now start collecting fees.");
      onClose?.();
    } catch (err) {
      console.error('Failed to save fee setup:', err);
      setApiError(err.message || 'Server error occurred while saving.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-0 sm:p-4 backdrop-blur-md transition-opacity duration-200"
      role="dialog"
      aria-modal="true"
      aria-labelledby="fee-setup-modal-title"
    >
      {showConfirmClose && (
        <ConfirmationDialog
          onConfirm={() => {
            setShowConfirmClose(false);
            onClose?.();
          }}
          onCancel={() => setShowConfirmClose(false)}
        />
      )}

      {/* Main Container - #18212E background theme */}
      <div
        className="relative flex h-full w-full max-w-2xl flex-col overflow-hidden bg-[#18212E] text-slate-100 shadow-2xl shadow-black/80 sm:h-[88vh] sm:max-h-[780px] sm:rounded-2xl sm:border sm:border-slate-700/60"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="sticky top-0 z-30 flex items-center justify-between border-b border-slate-700/60 bg-[#18212E]/95 p-4 backdrop-blur-md ">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 shadow-inner">
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 id="fee-setup-modal-title" className="text-lg font-bold text-white tracking-tight">
                  Configure Session Fees
                </h2>
                <span className="rounded-full bg-indigo-500/10 border border-indigo-500/20 px-2.5 py-0.5 text-xs font-semibold text-indigo-300">
                  2026–27
                </span>
              </div>
              <p className="mt-0.5 text-xs text-slate-400">
                Set class fee amounts and due dates for this academic session.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={handleDismissAttempt}
            disabled={isSaving}
            aria-label="Close modal"
            className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-800/60 text-slate-400 border border-slate-700/50 transition-all hover:bg-slate-700/80 hover:text-white disabled:opacity-50"
          >
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {apiError && (
          <div className="border-b border-rose-500/30 bg-rose-950/50 px-6 py-3 text-xs font-medium text-rose-200 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <svg className="h-4 w-4 text-rose-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>{apiError}</span>
            </div>
            <button
              type="button"
              onClick={() => setApiError(null)}
              className="text-rose-400 hover:text-rose-200"
            >
              ✕
            </button>
          </div>
        )}

        {/* Scrollable Container - Zero top/bottom padding prevents header peeking */}
        <div className="custom-scrollbar flex-1 overflow-y-auto px-4">
          {isLoading ? (
            <LoadingSkeleton />
          ) : !feeSetupData || feeSetupData.length === 0 ? (
            <EmptyState />
          ) : (
            feeSetupData.map((classData) => (
              <ClassSection
                key={classData.class_id}
                classData={classData}
                formData={formData}
                onFieldChange={handleFieldChange}
                errors={errors}
              />
            ))
          )}
        </div>

        {/* Modal Footer */}
        <div className="sticky bottom-0 z-30 flex items-center justify-between border-t border-slate-700/60 bg-[#18212E]/95 px-6 py-4 backdrop-blur-md">
          <div className="hidden sm:flex items-center gap-2">
            {isDirty && !isSaving && (
              <span className="flex items-center gap-1.5 rounded-full bg-amber-500/10 px-2.5 py-1 text-xs font-semibold text-amber-400 border border-amber-500/20">
                <span className="h-1.5 w-1.5 rounded-full bg-amber-400 animate-pulse"></span>
                Unsaved changes
              </span>
            )}
          </div>
          <div className="flex w-full items-center justify-end gap-3 sm:w-auto">
            <button
              type="button"
              onClick={handleDismissAttempt}
              disabled={isSaving}
              className="h-10 flex-1 sm:flex-initial min-w-[90px] rounded-xl border border-slate-700 bg-slate-800/60 px-4 text-xs font-semibold text-slate-300 transition-all hover:bg-slate-700/80 hover:text-white disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSubmit}
              disabled={isSaving || isLoading}
              className="h-10 flex-1 sm:flex-initial min-w-[140px] rounded-xl bg-gradient-to-r from-indigo-500 to-indigo-600 px-5 text-xs font-semibold text-white shadow-lg shadow-indigo-950/50 transition-all hover:from-indigo-400 hover:to-indigo-500 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {isSaving ? (
                <>
                  <svg className="h-3.5 w-3.5 animate-spin text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  <span>Saving...</span>
                </>
              ) : (
                <span>Save Fee Setup</span>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}