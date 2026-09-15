import { useCallback, useEffect, useMemo, useState } from 'react';
import { AlertCircle, CalendarDays, CheckCircle2, ChevronDown, Edit3, GraduationCap, LockKeyhole, RefreshCw, Search, SlidersHorizontal } from 'lucide-react';
import { apiGet } from '../../../api/api.js';
import { fetchClasses } from '../../utils/fetchClasses.js';
import ExamFormModal from './ExamFormModal.jsx';

function ExamRow({ exam, isOpen, onToggle, onEdit }) {
  const classes = exam.classes || [];
  const isEditable = exam.editable === true;
  return (
    <div className={`rounded-xl border transition-all ${isOpen ? 'border-emerald-500/30 bg-[#1a1a1e]' : 'border-white/5 bg-[#141414] hover:border-white/10 hover:bg-[#181818]'}`}>
      <div className="flex flex-wrap items-center justify-between gap-3 p-3.5 sm:px-4">
        <div className="flex min-w-0 flex-1 items-center gap-3">
          <button type="button" onClick={onToggle} className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border border-white/5 bg-zinc-900 text-zinc-400 hover:text-zinc-200" aria-label={isOpen ? 'Collapse classes' : 'Expand classes'}>
            <ChevronDown className={`h-4 w-4 transition-transform ${isOpen ? 'rotate-180 text-emerald-400' : ''}`} />
          </button>
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="truncate text-sm font-semibold text-white">{exam.exam_name || 'Unnamed exam'}</h3>
              {exam.exam_code && <span className="rounded bg-zinc-800 px-1.5 py-0.5 text-[10px] font-mono text-zinc-400">{exam.exam_code}</span>}
            </div>
            <p className="mt-0.5 text-xs text-zinc-400">Term {exam.term ?? '-'} · Weightage {exam.weightage ?? '-'} · {classes.length} {classes.length === 1 ? 'class' : 'classes'} assigned</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className={`inline-flex items-center gap-1 rounded-md px-2 py-1 text-[11px] font-medium ${isEditable ? 'bg-emerald-500/10 text-emerald-300' : 'bg-zinc-800/80 text-zinc-500'}`}>
            {isEditable ? <Edit3 className="h-3 w-3" /> : <LockKeyhole className="h-3 w-3" />}
            <span className="hidden sm:inline">{isEditable ? 'Editable' : 'Locked'}</span>
          </span>
          <button type="button" onClick={() => onEdit(exam)} disabled={!isEditable} className="inline-flex items-center gap-1.5 rounded-lg border border-white/10 bg-zinc-900 px-3 py-1.5 text-xs font-semibold text-zinc-200 hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-40">
            <Edit3 className="h-3.5 w-3.5" /> Edit
          </button>
        </div>
      </div>
      {isOpen && (
        <div className="border-t border-white/5 bg-zinc-950/40 p-4">
          <div className="flex items-center gap-2 text-xs font-semibold text-zinc-400">
            <GraduationCap className="h-4 w-4 text-emerald-400" /> Assigned Classes ({classes.length})
          </div>
          {classes.length ? (
            <div className="mt-2.5 flex flex-wrap gap-2">
              {classes.map((item) => (
                <span key={item.class_id} className="rounded-lg border border-emerald-500/20 bg-emerald-500/10 px-3 py-1.5 text-xs font-medium text-emerald-200">
                  {item.class_name || 'Unnamed Class'}
                </span>
              ))}
            </div>
          ) : (
            <p className="mt-2 text-xs italic text-zinc-500">No classes assigned to this exam.</p>
          )}
          {!isEditable && (
            <p className="mt-3 flex items-center gap-1.5 text-[11px] text-zinc-500">
              <LockKeyhole className="h-3 w-3" /> Editing is unavailable after marks have been entered.
            </p>
          )}
        </div>
      )}
    </div>
  );
}

function ExamSetup() {
  const [exams, setExams] = useState([]);
  const [classes, setClasses] = useState([]);
  const [search, setSearch] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState('');
  const [toast, setToast] = useState(null);
  const [activeExam, setActiveExam] = useState(null);
  const [expandedExamId, setExpandedExamId] = useState(null);

  const loadExams = useCallback(async () => {
    setIsLoading(true);
    setLoadError('');
    try {
      const response = await apiGet('/api/get_exam_data');
      const payload = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(payload.error || 'Unable to load exams.');
      setExams(Array.isArray(payload.exams) ? payload.exams : []);
    } catch (error) {
      setLoadError(error.message || 'Unable to load exams.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      loadExams();
      fetchClasses().then(setClasses);
    }, 0);
    return () => clearTimeout(timer);
  }, [loadExams]);

  useEffect(() => {
    if (!toast) return undefined;
    const timer = setTimeout(() => setToast(null), 3500);
    return () => clearTimeout(timer);
  }, [toast]);

  const filteredExams = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return exams;
    return exams.filter((exam) => [exam.exam_name, exam.exam_code, exam.term, ...(exam.classes || []).map((item) => item.class_name)].some((value) => String(value ?? '').toLowerCase().includes(query)));
  }, [exams, search]);

  function handleSaved(message) {
    setActiveExam(null);
    setToast({ type: 'success', message });
    loadExams();
  }

  return (
    <section className="mx-auto mt-8 max-w-5xl pb-10 text-zinc-100">
      <div className="mb-5 flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="mb-1 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-emerald-400">
            <CalendarDays className="h-3.5 w-3.5" /> Exam Setup
          </div>
          <h2 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">Exams</h2>
        </div>
      </div>
      
      <div className="mb-4 flex flex-wrap items-center gap-3 rounded-2xl border border-white/10 bg-[#181818] p-2.5">
        <div className="relative min-w-[200px] flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500" />
          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search exam or assigned class..."
            className="w-full rounded-xl border border-white/10 bg-zinc-900/80 py-2 pl-9 pr-4 text-xs text-zinc-100 outline-none placeholder:text-zinc-600 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
          />
        </div>
        <div className="flex items-center gap-1.5 px-2 text-xs font-semibold text-zinc-500">
          <SlidersHorizontal className="h-3.5 w-3.5" /> {filteredExams.length} {filteredExams.length === 1 ? 'exam' : 'exams'}
        </div>
      </div>

      {isLoading && (
        <div className="space-y-2">
          {Array.from({ length: 4 }).map((_, index) => (
            <div key={index} className="h-16 animate-pulse rounded-xl border border-white/5 bg-[#181818]" />
          ))}
        </div>
      )}

      {!isLoading && loadError && (
        <div className="rounded-2xl border border-rose-500/20 bg-[#181818] p-6 text-center">
          <AlertCircle className="mx-auto h-8 w-8 text-rose-400" />
          <h3 className="mt-2 font-semibold text-white">Exams could not be loaded</h3>
          <p className="mt-1 text-xs text-zinc-400">{loadError}</p>
          <button type="button" onClick={loadExams} className="mt-4 inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-3.5 py-2 text-xs font-semibold text-white hover:bg-emerald-500">
            <RefreshCw className="h-3.5 w-3.5" /> Retry
          </button>
        </div>
      )}

      {!isLoading && !loadError && exams.length === 0 && (
        <div className="rounded-2xl border border-dashed border-white/15 bg-[#181818] px-6 py-10 text-center">
          <CalendarDays className="mx-auto h-8 w-8 text-emerald-400" />
          <h3 className="mt-3 text-lg font-semibold text-white">No exams configured yet</h3>
        </div>
      )}

      {!isLoading && !loadError && exams.length > 0 && filteredExams.length === 0 && (
        <div className="rounded-2xl border border-white/10 bg-[#181818] p-8 text-center text-xs text-zinc-400">
          No exams match your search query.
        </div>
      )}

      {!isLoading && !loadError && filteredExams.length > 0 && (
        <div className="space-y-2">
          {filteredExams.map((exam) => (
            <ExamRow
              key={exam.id}
              exam={exam}
              isOpen={expandedExamId === exam.id}
              onToggle={() => setExpandedExamId((current) => (current === exam.id ? null : exam.id))}
              onEdit={(item) => item.editable === true && setActiveExam(item)}
            />
          ))}
        </div>
      )}

      {activeExam && (
        <ExamFormModal
          exam={activeExam}
          classes={classes}
          onClose={() => setActiveExam(null)}
          onSaved={handleSaved}
          onError={(message) => setToast({ type: 'error', message })}
          onRefresh={loadExams}
        />
      )}

      {toast && (
        <div className="fixed right-4 top-4 z-[70] max-w-sm rounded-2xl border border-white/10 bg-[#181818] p-4 text-white shadow-2xl" role="status">
          <div className="flex items-start gap-3">
            {toast.type === 'success' ? <CheckCircle2 className="h-5 w-5 text-emerald-400" /> : <AlertCircle className="h-5 w-5 text-rose-400" />}
            <div>
              <p className="text-sm font-semibold">{toast.type === 'success' ? 'Success' : 'Unable to continue'}</p>
              <p className="mt-0.5 text-xs text-zinc-400">{toast.message}</p>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

export default ExamSetup;