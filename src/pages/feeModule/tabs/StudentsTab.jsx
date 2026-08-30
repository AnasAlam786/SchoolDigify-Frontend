import { useMemo, useState, useEffect, useCallback } from 'react';
import StudentFeeCard from '../components/StudentFeeCard';
import StudentDetailsModal from '../../utils/StudentsDetailsModal.jsx/StudentDetailsModal';
import FeeDrawer from '../../utils/feeDrawer/FeeDrawer';
import TransactionModal from '../../utils/feeTransactionsModal/TransactionModal';
import { fetchClasses } from "../../utils/fetchClasses";
import { filterAndSortStudents } from './filter';

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
  sortBy: 'class-roll',
  sortDir: 'asc',
};

export default function StudentsTab({ students = [], totalDiscountBySchool = 0, }) {
  const [filters, setFilters] = useState(initialFilters);
  const [isFeeDrawerOpen, setFeeDrawerOpen] = useState(false);
  const [feeDrawerStudent, setFeeDrawerStudent] = useState(null);
  const [isTransactionModalOpen, setTransactionModalOpen] = useState(false);
  const [transactionModalStudent, setTransactionModalStudent] = useState(null);
  const [selectedStudent, setSelectedStudent] = useState(null);

  const [classes, setClasses] = useState([]);

  useEffect(() => {
    fetchClasses().then(setClasses);
  }, []);

  
  let filteredStudents = useMemo(() => {
    return filterAndSortStudents(students, filters, classes);
  }, [students, filters]);


  const summary = useMemo(() => {
    const totalStudents = students.length;
    const totalSettledAmount = students.reduce((sum, student) => sum + (student.totalSettledAmount || 0), 0);
    const totalOutstanding = students.reduce((sum, student) => sum + (student.dueAmount || 0), 0);
    const totalDiscount = totalDiscountBySchool;

    return { totalStudents, totalSettledAmount, totalOutstanding, totalDiscount };
  }, [students]);

  const openStudentDetails = useCallback((student) => {
    setSelectedStudent(student);
  }, []);

  const openFeeDrawer = useCallback((student) => {
    setFeeDrawerStudent({
      studentSessionId: student?.student_session_id || student?.id,
      studentPhone: student?.PHONE,
    });

    setFeeDrawerOpen(true);
  }, []);

  const openTransactionModal = useCallback((student) => {
    setTransactionModalStudent({
      studentSessionId: student?.student_session_id || student?.id,
      phone: student?.PHONE,
    });

    setTransactionModalOpen(true);
  }, []);

  const updateFilter = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const clearFilters = () => {
    setFilters(initialFilters);
  };

  const onSortToggle = () => {
    setFilters((prev) => ({ ...prev, sortDir: prev.sortDir === 'asc' ? 'desc' : 'asc' }));
  };

  return (
    <>
      {/* Desktop Filter Section */}
      <div className="hidden lg:block">
        <div className="p-6 space-y-6">
          <div className="flex items-center gap-6">
            {/* Search and Class Filter */}
            <div className="flex-1 bg-gray-900/40 backdrop-blur-xl rounded-2xl p-5 border border-gray-800/70">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-2 h-8 bg-gradient-to-b from-blue-500 to-cyan-400 rounded-full" />
                <h3 className="text-lg font-semibold text-white">Search Students</h3>
              </div>

              <div className="flex items-stretch gap-3">
                {/* Search Input */}
                <div className="flex-1 relative">
                  <input
                    type="text"
                    value={filters.search}
                    onChange={(e) => updateFilter('search', e.target.value)}
                    placeholder="Search by name, father name, SR..."
                    className="w-full h-full bg-gray-900/80 backdrop-blur-sm border border-gray-700/50 rounded-xl pl-5 pr-4 py-4 text-base focus:outline-none focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20 transition-all duration-200 placeholder-gray-500 text-white"
                  />
                </div>

                {/* Class Filter */}
                <div className="relative">
                  <div className="text-xs text-gray-400 absolute -top-5 left-0">Class</div>
                  <select
                    value={filters.classFilter}
                    onChange={(e) => updateFilter('classFilter', e.target.value)}
                    className="h-full bg-gray-900/80 backdrop-blur-sm border border-gray-700/50 rounded-xl pl-4 pr-10 py-4 text-base focus:outline-none focus:border-emerald-500/50 focus:ring-2 focus:ring-emerald-500/20 transition-all duration-200 cursor-pointer text-white appearance-none min-w-[180px]"
                    style={{
                      backgroundImage:
                        "url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%239ca3af%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.5-12.8z%22%2F%3E%3C%2Fsvg%3E')",
                      backgroundRepeat: "no-repeat",
                      backgroundPosition: "right 1rem center",
                      backgroundSize: ".65rem auto",
                    }}
                  >
                    <option value="All">All Classes</option>
                    {classes.map(cls => (
                      <option key={cls.id} value={cls.id}>
                        {cls.class_name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Stats and Clear Button */}
            <div className="bg-gradient-to-br from-gray-900/40 to-gray-900/20 backdrop-blur-xl rounded-2xl p-5 border border-gray-800/70 min-w-[320px]">
              <div className="flex items-center justify-between h-full">
                <div className="text-center">
                  <div className="text-sm text-gray-400 mb-2">Showing</div>
                  <div className="text-3xl font-bold text-white">
                    <span className="text-blue-400">{filteredStudents.length}</span>
                    <span className="text-gray-500 mx-2">/</span>
                    <span className="text-gray-300">{students.length}</span>
                  </div>
                  <div className="text-xs text-gray-400 mt-1">students</div>
                </div>

                <div className="w-px h-16 bg-gray-800" />

                <button
                  type="button"
                  onClick={clearFilters}
                  title="Clear all filters"
                  className="relative flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-red-500/15 to-red-700/20 border border-red-500/40 text-red-300 hover:from-red-500/30 hover:to-red-700/30 hover:border-red-400/70 hover:shadow-[0_0_0_3px_rgba(239,68,68,0.15)] active:scale-95 transition-all duration-300 group"
                >
                  <svg className="w-5 h-5 group-hover:rotate-90 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
          </div>

          {/* Sorting Section */}
          <div className="bg-gray-900/40 backdrop-blur-xl rounded-2xl p-5 border border-gray-800/70">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-2 h-8 bg-gradient-to-b from-amber-500 to-orange-400 rounded-full" />
              <h3 className="text-lg font-semibold text-white">Sorting</h3>
            </div>

            <div className="bg-gray-900/50 rounded-xl p-4 border border-gray-700/30">
              <div className="text-xs text-gray-400 mb-2">Sort By</div>
              <div className="flex items-center gap-3">
                <select
                  value={filters.sortBy}
                  onChange={(e) => updateFilter('sortBy', e.target.value)}
                  className="flex-1 appearance-none bg-gray-900/80 backdrop-blur-sm border-0 text-base focus:outline-none focus:ring-0 cursor-pointer text-white pr-8"
                >
                  {sortOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>

                <button
                  type="button"
                  className="flex items-center justify-center w-10 h-10 bg-gradient-to-br from-amber-500/20 to-orange-500/20 border border-amber-500/30 rounded-lg hover:from-amber-500/30 hover:to-orange-500/30 transition-all"
                  onClick={onSortToggle}
                >
                  <div className="transform transition-transform duration-300">
                    {filters.sortDir === 'asc' ? (
                      <svg className="w-5 h-5 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 15l7-7 7 7" />
                      </svg>
                    ) : (
                      <svg className="w-5 h-5 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                      </svg>
                    )}
                  </div>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Filter Section */}
      <div className="lg:hidden p-4 space-y-4">
        <div className="bg-gray-900/40 backdrop-blur-xl rounded-2xl p-5 border border-gray-800/50">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-2 h-6 bg-gradient-to-b from-blue-500 to-cyan-400 rounded-full" />
            <h3 className="text-base font-semibold text-white">Search Students</h3>
          </div>

          <div className="space-y-3">
            {/* Search Input Mobile */}
            <div className="relative">
              <input
                type="text"
                value={filters.search}
                onChange={(e) => updateFilter('search', e.target.value)}
                placeholder="Search students..."
                className="w-full bg-gray-900/80 backdrop-blur-sm border border-gray-700/50 rounded-xl pl-4 pr-4 py-3.5 text-base focus:outline-none focus:border-blue-500/50 text-white placeholder-gray-500"
              />
            </div>

            {/* Class Filter Mobile */}
            <div>
              <div className="text-xs text-gray-400 mb-1 ml-1">Class Filter</div>
              <select
                value={filters.classFilter}
                onChange={(e) => updateFilter('classFilter', e.target.value)}
                className="w-full appearance-none bg-gray-900/80 backdrop-blur-sm border border-gray-700/50 rounded-xl px-4 py-3 text-sm focus:outline-none cursor-pointer text-white"
                style={{
                  backgroundImage:
                    "url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%239ca3af%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.5-12.8z%22%2F%3E%3C%2Fsvg%3E')",
                  backgroundRepeat: "no-repeat",
                  backgroundPosition: "right 1rem center",
                  backgroundSize: ".65rem auto",
                }}
              >
                <option value="All">All Classes</option>
                {classes.map(cls => (
                  <option key={cls.id} value={cls.id}>
                    {cls.class_name}
                  </option>
                ))}
              </select>
            </div>

            {/* Sorting Mobile */}
            <div>
              <div className="text-xs text-gray-400 mb-1 ml-1">Sort By</div>
              <div className="flex items-center gap-3">
                <select
                  value={filters.sortBy}
                  onChange={(e) => updateFilter('sortBy', e.target.value)}
                  className="flex-1 appearance-none bg-gray-900/80 backdrop-blur-sm border border-gray-700/50 rounded-xl px-4 py-3 text-sm focus:outline-none cursor-pointer text-white"
                >
                  {sortOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>

                <button
                  type="button"
                  className="flex items-center justify-center w-10 h-10 bg-gradient-to-br from-amber-500/20 to-orange-500/20 border border-amber-500/30 rounded-lg hover:from-amber-500/30 hover:to-orange-500/30 transition-all"
                  onClick={onSortToggle}
                >
                  {filters.sortDir === 'asc' ? (
                    <svg className="w-5 h-5 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 15l7-7 7 7" />
                    </svg>
                  ) : (
                    <svg className="w-5 h-5 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            {/* Clear Button Mobile */}
            <button
              type="button"
              onClick={clearFilters}
              className="w-full flex items-center justify-center gap-2 rounded-lg border border-red-500/40 bg-gradient-to-br from-red-500/15 to-red-700/20 px-4 py-2.5 text-sm font-medium text-red-300 hover:from-red-500/30 hover:to-red-700/30 transition-all"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
              Clear filters
            </button>
          </div>
        </div>

        {/* Mobile Stats */}
        <div className="bg-gray-900/40 backdrop-blur-xl rounded-2xl p-4 border border-gray-800/70 text-center">
          <div className="text-sm text-gray-400 mb-2">Showing</div>
          <div className="text-2xl font-bold text-white">
            <span className="text-blue-400">{filteredStudents.length}</span>
            <span className="text-gray-500 mx-2">/</span>
            <span className="text-gray-300">{students.length}</span>
          </div>
          <div className="text-xs text-gray-400 mt-1">students</div>
        </div>
      </div>

      {/* Summary Stats */}
      <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4 p-5">
        <div className="rounded-2xl border border-[#2A2A2A] bg-[#1A1A1A] p-4">
          <p className="text-[11px] uppercase tracking-[0.18em] text-gray-400">Total Collected</p>
          <p className="mt-2 text-2xl font-bold text-emerald-300">₹{summary.totalSettledAmount.toLocaleString('en-IN')}</p>
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

      {/* Students Grid */}
      <section className="px-5 pb-5">
        {filteredStudents.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-[#3A3A3A] bg-[#1A1A1A] px-6 py-16 text-center">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-[#111111] text-gray-300">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" className="h-6 w-6">
                <circle cx="11" cy="11" r="6" />
                <path d="M20 20L16.65 16.65" strokeLinecap="round" />
              </svg>
            </div>
            <h2 className="text-xl font-semibold text-white">No students match the current filters</h2>
            <p className="mt-2 text-sm text-gray-400">Try adjusting the search term or class filter.</p>
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
    </>
  );
}
