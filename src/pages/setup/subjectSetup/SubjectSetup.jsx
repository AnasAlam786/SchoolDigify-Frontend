import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  AlertCircle,
  BookOpen,
  CheckCircle2,
  ChevronDown,
  Edit3,
  GraduationCap,
  LockKeyhole,
  RefreshCw,
  Search,
  SlidersHorizontal,
  Users,
} from 'lucide-react';

import { apiGet } from '../../../api/api.js';
import { fetchClasses } from '../../utils/fetchClasses.js';
import SubjectFormModal from './SubjectFormModal.jsx';

function SubjectSkeleton() {
  return (
    <div className="space-y-2" aria-label="Loading subjects">
      {Array.from({ length: 5 }).map((_, index) => (
        <div
          key={index}
          className="flex h-16 animate-pulse items-center justify-between rounded-xl border border-white/5 bg-[#181818] px-4"
        >
          <div className="flex items-center gap-3">
            <div className="h-4 w-4 rounded bg-zinc-800" />
            <div className="h-4 w-48 rounded bg-zinc-800" />
            <div className="h-4 w-16 rounded bg-zinc-900" />
          </div>
          <div className="flex items-center gap-4">
            <div className="h-4 w-24 rounded bg-zinc-900" />
            <div className="h-8 w-16 rounded-lg bg-zinc-800" />
          </div>
        </div>
      ))}
    </div>
  );
}

function Toast({ toast }) {
  if (!toast) return null;
  const success = toast.type === 'success';
  return (
    <div
      className="fixed right-4 top-4 z-[70] max-w-sm rounded-2xl border border-white/10 bg-[#181818] p-4 text-white shadow-2xl"
      role="status"
    >
      <div className="flex items-start gap-3">
        {success ? (
          <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-emerald-400" />
        ) : (
          <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-rose-400" />
        )}
        <div>
          <p className="text-sm font-semibold">
            {success ? 'Success' : 'Unable to continue'}
          </p>
          <p className="mt-0.5 text-xs text-zinc-400">{toast.message}</p>
        </div>
      </div>
    </div>
  );
}

function SubjectRow({ subject, isOpen, onToggle, onEdit }) {
  const isEditable = subject.editable === true;
  const assignedClasses = subject.classes || [];

  return (
    <div
      className={`group rounded-xl border transition-all ${
        isOpen
          ? 'border-indigo-500/30 bg-[#1a1a1e]'
          : 'border-white/5 bg-[#141414] hover:border-white/10 hover:bg-[#181818]'
      }`}
    >
      <div className="flex flex-wrap items-center justify-between gap-3 p-3.5 sm:px-4">
        <div className="flex min-w-0 flex-1 items-center gap-3">
          <button
            type="button"
            onClick={onToggle}
            className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border border-white/5 bg-zinc-900 text-zinc-400 transition group-hover:border-white/10 group-hover:text-zinc-200"
            aria-label={isOpen ? 'Collapse classes' : 'Expand classes'}
          >
            <ChevronDown
              className={`h-4 w-4 transition-transform duration-200 ${
                isOpen ? 'rotate-180 text-indigo-400' : ''
              }`}
            />
          </button>

          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <h3 className="truncate text-sm font-semibold text-white">
                {subject.subject || 'Unnamed subject'}
              </h3>
              {subject.abbreviation && (
                <span className="rounded bg-zinc-800 px-1.5 py-0.5 text-[10px] font-mono text-zinc-400">
                  {subject.abbreviation}
                </span>
              )}
            </div>
            <p className="mt-0.5 text-xs text-zinc-400">
              {assignedClasses.length}{' '}
              {assignedClasses.length === 1 ? 'class' : 'classes'} assigned
              {subject.max_marks ? ` · Max ${subject.max_marks}` : ''}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div
            className={`inline-flex items-center gap-1 rounded-md px-2 py-1 text-[11px] font-medium ${
              isEditable
                ? 'bg-indigo-500/10 text-indigo-300'
                : 'bg-zinc-800/80 text-zinc-500'
            }`}
            title={!isEditable ? 'Editing locked after marks entry' : 'Editable'}
          >
            {isEditable ? (
              <Edit3 className="h-3 w-3" />
            ) : (
              <LockKeyhole className="h-3 w-3" />
            )}
            <span className="hidden sm:inline">{isEditable ? 'Editable' : 'Locked'}</span>
          </div>

          <button
            type="button"
            onClick={() => onEdit(subject)}
            disabled={!isEditable}
            className="inline-flex items-center gap-1.5 rounded-lg border border-white/10 bg-zinc-900 px-3 py-1.5 text-xs font-semibold text-zinc-200 transition hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-40"
          >
            <Edit3 className="h-3.5 w-3.5" />
            Edit
          </button>
        </div>
      </div>

      {isOpen && (
        <div className="border-t border-white/5 bg-zinc-950/40 p-4">
          <div className="flex items-center gap-2 text-xs font-semibold text-zinc-400">
            <GraduationCap className="h-4 w-4 text-indigo-400" />
            Assigned Classes ({assignedClasses.length})
          </div>

          {assignedClasses.length === 0 ? (
            <p className="mt-2 text-xs text-zinc-500 italic">
              No classes assigned to this subject.
            </p>
          ) : (
            <div className="mt-2.5 flex flex-wrap gap-2">
              {assignedClasses.map((cls, idx) => (
                <div
                  key={cls.id || idx}
                  className="flex items-center gap-2 rounded-lg border border-indigo-500/20 bg-indigo-500/10 px-3 py-1.5 text-xs font-medium text-indigo-200"
                >
                  <span>{cls.class_name || 'Unnamed Class'}</span>
                  {cls.student_count !== undefined && (
                    <span className="flex items-center gap-0.5 rounded bg-indigo-950/60 px-1.5 py-0.5 text-[10px] text-indigo-300">
                      <Users className="h-2.5 w-2.5" />
                      {cls.student_count}
                    </span>
                  )}
                </div>
              ))}
            </div>
          )}

          {!isEditable && (
            <p className="mt-3 flex items-center gap-1.5 text-[11px] text-zinc-500">
              <LockKeyhole className="h-3 w-3" />
              Editing unavailable after marks have been entered for this subject.
            </p>
          )}
        </div>
      )}
    </div>
  );
}

function SubjectSetup() {
  const [subjects, setSubjects] = useState([]);
  const [classes, setClasses] = useState([]);
  const [staff, setStaff] = useState([]);
  const [search, setSearch] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState('');
  const [toast, setToast] = useState(null);
  const [activeSubject, setActiveSubject] = useState(null);
  const [expandedSubjectId, setExpandedSubjectId] = useState(null);

  const loadSubjects = useCallback(async () => {
    setIsLoading(true);
    setLoadError('');
    try {
      const response = await apiGet('/api/get_subjects_data');
      const payload = await response.json().catch(() => ({}));
      if (!response.ok)
        throw new Error(payload.error || 'Unable to load subjects.');
      setSubjects(Array.isArray(payload.subjects) ? payload.subjects : []);
    } catch (error) {
      setLoadError(error.message || 'Unable to load subjects.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadSubjects();
    fetchClasses().then(setClasses);
    apiGet('/api/get_all_staff')
      .then((response) =>
        response.json().then((payload) => (response.ok ? payload.staff || [] : []))
      )
      .then(setStaff)
      .catch(() => setStaff([]));
  }, [loadSubjects]);

  useEffect(() => {
    if (!toast) return undefined;
    const timeout = setTimeout(() => setToast(null), 3500);
    return () => clearTimeout(timeout);
  }, [toast]);

  const filteredSubjects = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return subjects;
    return subjects.filter((subject) => {
      const assignedClasses =
        subject.classes?.map((item) => item.class_name).join(' ') || '';
      return [
        subject.subject,
        subject.abbreviation,
        assignedClasses,
      ].some((value) => String(value || '').toLowerCase().includes(query));
    });
  }, [search, subjects]);

  function handleSaved(message) {
    setActiveSubject(null);
    setToast({ type: 'success', message });
    loadSubjects();
  }

  const toggleAccordion = (id) => {
    setExpandedSubjectId((prev) => (prev === id ? null : id));
  };

  return (
    <section className="mx-auto mt-6 max-w-5xl pb-10 text-zinc-100">
      {/* Top Header */}
      <div className="mb-5 flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="mb-1 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-indigo-400">
            <BookOpen className="h-3.5 w-3.5" />
            Exam Setup
          </div>
          <h2 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
            Subjects
          </h2>
        </div>
        {/* <button
          type="button"
          onClick={() => setIsCreateOpen(true)}
          className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-xs font-semibold text-white shadow-lg shadow-indigo-600/20 transition hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          <Plus className="h-4 w-4" />
          Add Subject
        </button> */}
      </div>

      {/* Search Bar */}
      <div className="mb-4 flex flex-wrap items-center gap-3 rounded-2xl border border-white/10 bg-[#181818] p-2.5">
        <div className="relative min-w-[200px] flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500" />
          <input
            id="subject-search"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search subject or assigned class..."
            className="w-full rounded-xl border border-white/10 bg-zinc-900/80 py-2 pl-9 pr-4 text-xs text-zinc-100 outline-none transition placeholder:text-zinc-600 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
          />
        </div>
        <div className="flex items-center gap-1.5 px-2 text-xs font-semibold text-zinc-500">
          <SlidersHorizontal className="h-3.5 w-3.5" />
          {filteredSubjects.length} {filteredSubjects.length === 1 ? 'subject' : 'subjects'}
        </div>
      </div>

      {/* Loading state */}
      {isLoading && <SubjectSkeleton />}

      {/* Error state */}
      {!isLoading && loadError && (
        <div className="rounded-2xl border border-rose-500/20 bg-[#181818] p-6 text-center">
          <AlertCircle className="mx-auto h-8 w-8 text-rose-400" />
          <h3 className="mt-2 text-base font-semibold text-white">
            Subjects could not be loaded
          </h3>
          <p className="mt-1 text-xs text-zinc-400">{loadError}</p>
          <button
            type="button"
            onClick={loadSubjects}
            className="mt-4 inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-3.5 py-2 text-xs font-semibold text-white hover:bg-indigo-500"
          >
            <RefreshCw className="h-3.5 w-3.5" /> Retry
          </button>
        </div>
      )}

      {/* Empty State */}
      {!isLoading && !loadError && subjects.length === 0 && (
        <div className="rounded-2xl border border-dashed border-white/15 bg-[#181818] px-6 py-10 text-center">
          <BookOpen className="mx-auto h-8 w-8 text-indigo-400" />
          <h3 className="mt-3 text-lg font-semibold text-white">
            No subjects configured yet
          </h3>
          <p className="mx-auto mt-1 max-w-sm text-xs text-zinc-400">
            Your examination subjects will appear here.
          </p>
        </div>
      )}

      {/* No Search Matches */}
      {!isLoading &&
        !loadError &&
        subjects.length > 0 &&
        filteredSubjects.length === 0 && (
          <div className="rounded-2xl border border-white/10 bg-[#181818] p-8 text-center text-xs text-zinc-400">
            No subjects match your search query.
          </div>
        )}

      {/* Accordion Row List */}
      {!isLoading && !loadError && filteredSubjects.length > 0 && (
        <div className="space-y-2">
          {filteredSubjects.map((subject) => (
            <SubjectRow
              key={subject.id}
              subject={subject}
              isOpen={expandedSubjectId === subject.id}
              onToggle={() => toggleAccordion(subject.id)}
              onEdit={(item) => item.editable === true && setActiveSubject(item)}
            />
          ))}
        </div>
      )}

      {activeSubject && (
        <SubjectFormModal
          subject={activeSubject}
          classes={classes}
          staff={staff}
          onClose={() => setActiveSubject(null)}
          onSaved={handleSaved}
          onError={(message) => setToast({ type: 'error', message })}
          onRefresh={loadSubjects}
        />
      )}

      <Toast toast={toast} />
    </section>
  );
}

export default SubjectSetup;