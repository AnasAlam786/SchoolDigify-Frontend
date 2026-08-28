import { useMemo, useState } from 'react';
import StudentFeeCard from '../components/StudentFeeCard';
import StudentDetailsModal from '../../utils/StudentsDetailsModal.jsx/StudentDetailsModal';
import FeeDrawer from '../../utils/feeDrawer/FeeDrawer';
import TransactionModal from '../../utils/feeTransactionsModal/TransactionModal';

const sortOptions = [
  { value: 'class-roll', label: 'Class / Roll number' },
  { value: 'student-name', label: 'Student name' },
  { value: 'highest-due', label: 'Highest due' },
  { value: 'lowest-due', label: 'Lowest due' },
  { value: 'due-months', label: 'Due months' },
];

const initialFilters = {
  search: '',
  classFilter: 'All',
  sectionFilter: 'All',
  feeStatus: 'All',
  sortBy: 'class-roll',
};

function toNumber(value) {
  const parsed = Number.parseInt(value, 10);
  return Number.isNaN(parsed) ? 0 : parsed;
}

function getClassNumber(classLabel) {
  if (!classLabel) return 0;
  const match = String(classLabel).match(/\d+/);
  return match ? Number.parseInt(match[0], 10) : 0;
}

export default function StudentsTab({ students = [] }) {
  const [filters, setFilters] = useState(initialFilters);
  const [isFeeDrawerOpen, setFeeDrawerOpen] = useState(false);
  const [feeDrawerStudent, setFeeDrawerStudent] = useState(null);
  const [isTransactionModalOpen, setTransactionModalOpen] = useState(false);
  const [transactionModalStudent, setTransactionModalStudent] = useState(null);
  const [selectedStudent, setSelectedStudent] = useState(null);


  const classOptions = useMemo(
    () => ['All', ...new Set(students.map((student) => String(student.CLASS)).sort((a, b) => getClassNumber(a) - getClassNumber(b)))],
    [students]
  );

  const sectionOptions = useMemo(
    () => ['All', ...new Set(students.map((student) => String(student.section || student.SECTION || '')).filter(Boolean).sort())],
    [students]
  );

  const filteredStudents = useMemo(() => {
    const query = filters.search.trim().toLowerCase();

    const matches = students.filter((student) => {
      const searchableText = [
        student.STUDENTS_NAME,
        student.FATHERS_NAME,
        student.SR,
        student.CLASS,
        student.ROLL,
      ]
        .filter(Boolean)
        .join(' ')
        .toLowerCase();

      if (query && !searchableText.includes(query)) {
        return false;
      }

      if (filters.classFilter !== 'All' && String(student.CLASS) !== String(filters.classFilter)) {
        return false;
      }

      if (filters.sectionFilter !== 'All' && String(student.section || student.SECTION || '') !== String(filters.sectionFilter)) {
        return false;
      }

      if (filters.feeStatus !== 'All' && student.feeStatus !== filters.feeStatus) {
        return false;
      }

      return true;
    });

    const sorted = [...matches];

    sorted.sort((a, b) => {
      switch (filters.sortBy) {
        case 'student-name':
          return (a.STUDENTS_NAME || '').localeCompare(b.STUDENTS_NAME || '');
        case 'highest-due':
          return (b.dueAmount || 0) - (a.dueAmount || 0);
        case 'lowest-due':
          return (a.dueAmount || 0) - (b.dueAmount || 0);
        case 'due-months':
          return (b.dueMonths || 0) - (a.dueMonths || 0);
        case 'class-roll':
        default: {
          const classDifference = getClassNumber(a.CLASS) - getClassNumber(b.CLASS);
          if (classDifference !== 0) return classDifference;
          return toNumber(a.ROLL) - toNumber(b.ROLL);
        }
      }
    });

    return sorted;
  }, [filters, students]);

  const summary = useMemo(() => {
    const totalStudents = students.length;
    const totalPaid = students.reduce((sum, student) => sum + (student.actualPaidAmount || 0), 0);
    const totalOutstanding = students.reduce((sum, student) => sum + (student.dueAmount || 0), 0);
    const totalDiscount = students.reduce((sum, student) => sum + (student.discount || 0), 0);

    return { totalStudents, totalPaid, totalOutstanding, totalDiscount };
  }, [students]);

  const openStudentDetails = (student) => {
    setSelectedStudent(student);
  };

  const openFeeDrawer = (student) => {
    setFeeDrawerStudent({
      studentSessionId: student?.student_session_id || student?.id,
      studentPhone: student?.PHONE,
    });
    setFeeDrawerOpen(true);
  };

  const openTransactionModal = (student) => {
    setTransactionModalStudent({
      studentSessionId: student?.student_session_id || student?.id,
      phone: student?.PHONE,
    });
    setTransactionModalOpen(true);
  };

  const clearFilters = () => {
    setFilters(initialFilters);
  };

  return (
    <div className="space-y-6">
      <section className="rounded-2xl border border-[#2A2A2A] bg-[#1A1A1A] p-3 shadow-[0_12px_25px_-18px_rgba(0,0,0,0.8)] sm:p-4">
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-3 xl:flex-row xl:items-center">
            <label className="relative block flex-1">
              <span className="sr-only">Search student</span>
              <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-gray-400">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-4 w-4">
                  <circle cx="11" cy="11" r="6" />
                  <path d="M20 20L16.65 16.65" strokeLinecap="round" />
                </svg>
              </span>
              <input
                value={filters.search}
                onChange={(event) => setFilters((current) => ({ ...current, search: event.target.value }))}
                placeholder="Search by name, guardian, admission no"
                className="w-full rounded-xl border border-[#3A3A3A] bg-[#111111] py-2.5 pl-10 pr-3 text-sm text-white placeholder:text-gray-500 focus:border-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-500/20"
              />
            </label>

            <div className="grid gap-3 sm:grid-cols-2 xl:flex xl:flex-wrap xl:items-center xl:justify-end">
              <label className="flex min-w-[140px] flex-col gap-1.5 text-xs font-medium uppercase tracking-[0.12em] text-gray-400">
                <span>Class</span>
                <select
                  value={filters.classFilter}
                  onChange={(event) => setFilters((current) => ({ ...current, classFilter: event.target.value }))}
                  className="rounded-xl border border-[#3A3A3A] bg-[#111111] px-3 py-2.5 text-sm text-white focus:border-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-500/20"
                >
                  {classOptions.map((option) => (
                    <option key={option} value={option}>{option}</option>
                  ))}
                </select>
              </label>

              <label className="flex min-w-[140px] flex-col gap-1.5 text-xs font-medium uppercase tracking-[0.12em] text-gray-400">
                <span>Section</span>
                <select
                  value={filters.sectionFilter}
                  onChange={(event) => setFilters((current) => ({ ...current, sectionFilter: event.target.value }))}
                  className="rounded-xl border border-[#3A3A3A] bg-[#111111] px-3 py-2.5 text-sm text-white focus:border-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-500/20"
                >
                  {sectionOptions.map((option) => (
                    <option key={option} value={option}>{option}</option>
                  ))}
                </select>
              </label>

              <label className="flex min-w-[150px] flex-col gap-1.5 text-xs font-medium uppercase tracking-[0.12em] text-gray-400">
                <span>Status</span>
                <select
                  value={filters.feeStatus}
                  onChange={(event) => setFilters((current) => ({ ...current, feeStatus: event.target.value }))}
                  className="rounded-xl border border-[#3A3A3A] bg-[#111111] px-3 py-2.5 text-sm text-white focus:border-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-500/20"
                >
                  <option value="All">All</option>
                  <option value="Paid">Paid</option>
                  <option value="Due">Due</option>
                </select>
              </label>

              <label className="flex min-w-[170px] flex-col gap-1.5 text-xs font-medium uppercase tracking-[0.12em] text-gray-400">
                <span>Sort by</span>
                <select
                  value={filters.sortBy}
                  onChange={(event) => setFilters((current) => ({ ...current, sortBy: event.target.value }))}
                  className="rounded-xl border border-[#3A3A3A] bg-[#111111] px-3 py-2.5 text-sm text-white focus:border-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-500/20"
                >
                  {sortOptions.map((option) => (
                    <option key={option.value} value={option.value}>{option.label}</option>
                  ))}
                </select>
              </label>
            </div>
          </div>

          <div className="flex flex-col gap-2 border-t border-slate-700/80 pt-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="text-sm text-gray-300">
              Showing <span className="font-semibold text-white">{filteredStudents.length}</span> of <span className="font-semibold text-white">{students.length}</span> students
            </div>
            <button
              type="button"
              onClick={clearFilters}
              className="inline-flex items-center justify-center rounded-lg border border-[#3A3A3A] bg-[#202020] px-3 py-2 text-sm font-medium text-gray-200 transition-colors hover:border-gray-500 hover:bg-[#2A2A2A]"
            >
              Clear filters
            </button>
          </div>
        </div>
      </section>

      <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <div className="rounded-2xl border border-[#2A2A2A] bg-[#1A1A1A] p-4">
          <p className="text-[11px] uppercase tracking-[0.18em] text-gray-400">Total Collected</p>
          <p className="mt-2 text-2xl font-bold text-emerald-300">₹{summary.totalPaid.toLocaleString('en-IN')}</p>
        </div>
        <div className="rounded-2xl border border-[#2A2A2A] bg-[#1A1A1A] p-4">
          <p className="text-[11px] uppercase tracking-[0.18em] text-gray-400">Outstanding</p>
          <p className="mt-2 text-2xl font-bold text-red-300">₹{summary.totalOutstanding.toLocaleString('en-IN')}</p>
        </div>
        <div className="rounded-2xl border border-[#2A2A2A] bg-[#1A1A1A] p-4">
          <p className="text-[11px] uppercase tracking-[0.18em] text-gray-400">Discount Given</p>
          <p className="mt-2 text-2xl font-bold text-gray-200">₹{summary.totalDiscount.toLocaleString('en-IN')}</p>
        </div>
        <div className="rounded-2xl border border-[#2A2A2A] bg-[#1A1A1A] p-4">
          <p className="text-[11px] uppercase tracking-[0.18em] text-gray-400">Total students</p>
          <p className="mt-2 text-2xl font-bold text-white">{summary.totalStudents}</p>
        </div>
      </section>

      <section>
        {filteredStudents.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-[#3A3A3A] bg-[#1A1A1A] px-6 py-16 text-center">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-[#111111] text-gray-300">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" className="h-6 w-6">
                <circle cx="11" cy="11" r="6" />
                <path d="M20 20L16.65 16.65" strokeLinecap="round" />
              </svg>
            </div>
            <h2 className="text-xl font-semibold text-white">No students match the current filters</h2>
            <p className="mt-2 text-sm text-gray-400">Try adjusting the search term, class, section, or fee status.</p>
          </div>
        ) : (
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {filteredStudents.map((student) => (
              <StudentFeeCard
                key={student.id}
                student={student}
                onViewDetails={openStudentDetails}
                onPayFees={openFeeDrawer}
                onViewTransactions={openTransactionModal}
              />
            ))}
          </div>
        )}
      </section>

      {selectedStudent && (
        <StudentDetailsModal
          student={selectedStudent}
          onClose={() => setSelectedStudent(null)}
        />
      )}

      {isFeeDrawerOpen && feeDrawerStudent && (
        <FeeDrawer
          feeDrawerStudent={feeDrawerStudent}
          onClose={() => setFeeDrawerOpen(false)}
          onSetupFeeSession={() => setFeeDrawerOpen(false)}
          setTransactionModalOpen={(studentSessionId, studentPhone) => {
            setTransactionModalStudent({ studentSessionId, phone: studentPhone });
            setTransactionModalOpen(true);
          }}
        />
      )}

      {isTransactionModalOpen && transactionModalStudent && (
        <TransactionModal
          transactionModalStudent={transactionModalStudent}
          onClose={() => setTransactionModalOpen(false)}
        />
      )}
    </div>
  );
}
