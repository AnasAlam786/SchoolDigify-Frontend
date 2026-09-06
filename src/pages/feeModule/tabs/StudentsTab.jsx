import { useMemo, useState, useEffect, useCallback } from "react";
import StudentFeeCard from "../components/StudentFeeCard";
import StudentDetailsModal from "../../utils/StudentsDetailsModal.jsx/StudentDetailsModal";
import FeeDrawer from "../../utils/feeDrawer/FeeDrawer";
import TransactionModal from "../../utils/feeTransactionsModal/TransactionModal";
import { fetchClasses } from "../../utils/fetchClasses";
import { filterAndSortStudents } from "./filter";
import usePermission from "../../../hooks/usePermission";

const sortOptions = [
  { value: "class-roll", label: "Class / Roll number" },
  { value: "student-name", label: "Student name" },
  { value: "highest-due", label: "Highest due" },
  { value: "lowest-due", label: "Lowest due" },
  { value: "due-months", label: "Due months" },
];

const initialFilters = {
  search: "",
  classFilter: "All",
  sortBy: "class-roll",
  sortDir: "asc",
};

export default function StudentsTab({
  students = [],
  totalDiscountBySchool = 0,
}) {
  const { hasPermission, PERMISSIONS } = usePermission();

  const [filters, setFilters] = useState(initialFilters);

  const [isFeeDrawerOpen, setFeeDrawerOpen] = useState(false);
  const [feeDrawerStudent, setFeeDrawerStudent] = useState(null);

  const [isTransactionModalOpen, setTransactionModalOpen] = useState(false);
  const [transactionModalStudent, setTransactionModalStudent] = useState(null);

  const [selectedStudent, setSelectedStudent] = useState(null);

  const [classes, setClasses] = useState([]);

  /*
   * Fetch classes
   */
  useEffect(() => {
    fetchClasses().then(setClasses);
  }, []);

  /*
   * Filter + sort students
   *
   * classes is included because classFilter depends on it.
   */
  const filteredStudents = useMemo(() => {
    return filterAndSortStudents(students, filters, classes);
  }, [students, filters, classes]);

  /*
   * Summary
   */
  const summary = useMemo(() => {
    const totalStudents = filteredStudents.length;

    const totalSettledAmount = filteredStudents.reduce(
      (sum, student) => sum + (student.totalSettledAmount || 0),
      0,
    );

    const totalOutstanding = filteredStudents.reduce(
      (sum, student) => sum + (student.dueAmount || 0),
      0,
    );

    const totalDiscount = totalDiscountBySchool;

    return {
      totalStudents,
      totalSettledAmount,
      totalOutstanding,
      totalDiscount,
    };
  }, [filteredStudents, totalDiscountBySchool]);

  /*
   * Student actions
   */
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

  /*
   * Filter helpers
   */
  const updateFilter = (key, value) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const clearFilters = () => {
    setFilters(initialFilters);
  };

  const clearSearch = () => {
    updateFilter("search", "");
  };

  const onSortToggle = () => {
    setFilters((prev) => ({
      ...prev,
      sortDir: prev.sortDir === "asc" ? "desc" : "asc",
    }));
  };

  const hasActiveFilters =
    filters.search.trim() !== "" ||
    filters.classFilter !== "All" ||
    filters.sortBy !== "class-roll" ||
    filters.sortDir !== "asc";

  const selectedSortLabel =
    sortOptions.find((option) => option.value === filters.sortBy)?.label ||
    "Class / Roll number";

  return (
    <>
      {/* =========================================================
          DESKTOP FILTER / SEARCH
      ========================================================= */}

      <div className="hidden lg:block">
        <div className="px-6 pt-5 pb-2">
          <div
            className="
              relative
              overflow-hidden
              rounded-2xl
              border
              border-[#2A2A2A]
              bg-[#1A1A1A]
              shadow-[0_14px_40px_-24px_rgba(0,0,0,0.9)]
            "
          >
            {/* Subtle top highlight */}
            <div
              className="
                pointer-events-none
                absolute
                inset-x-0
                top-0
                h-px
                bg-gradient-to-r
                from-transparent
                via-white/10
                to-transparent
              "
            />

            <div className="p-4">
              {/* ===============================
                  TOP ROW
              =============================== */}

              <div className="flex items-center gap-3">
                {/* Search */}
                <div className="relative flex-1">
                  {/* Search icon */}
                  <div
                    className="
                      pointer-events-none
                      absolute
                      inset-y-0
                      left-0
                      flex
                      items-center
                      pl-4
                      text-gray-500
                    "
                  >
                    <svg
                      className="h-[18px] w-[18px]"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.8"
                    >
                      <circle cx="11" cy="11" r="6.5" />
                      <path d="M16 16L20 20" strokeLinecap="round" />
                    </svg>
                  </div>

                  <input
                    type="text"
                    value={filters.search}
                    onChange={(e) => updateFilter("search", e.target.value)}
                    placeholder="Search students by name, father name, SR number..."
                    aria-label="Search students"
                    className="
                      h-12
                      w-full
                      rounded-xl
                      border
                      border-[#2A2A2A]
                      bg-[#111111]
                      pl-11
                      pr-11
                      text-[14px]
                      font-medium
                      text-white
                      placeholder:text-gray-600
                      outline-none
                      transition-all
                      duration-200
                      hover:border-[#363636]
                      focus:border-[#4A4A4A]
                      focus:bg-[#131313]
                      focus:ring-4
                      focus:ring-white/[0.035]
                    "
                  />

                  {/* Clear search */}
                  {filters.search && (
                    <button
                      type="button"
                      onClick={clearSearch}
                      aria-label="Clear search"
                      className="
                        absolute
                        inset-y-0
                        right-2
                        my-auto
                        flex
                        h-8
                        w-8
                        items-center
                        justify-center
                        rounded-lg
                        text-gray-500
                        transition
                        hover:bg-white/[0.06]
                        hover:text-gray-200
                        active:scale-95
                      "
                    >
                      <svg
                        className="h-4 w-4"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                      >
                        <path d="M6 6L18 18M18 6L6 18" strokeLinecap="round" />
                      </svg>
                    </button>
                  )}
                </div>

                {/* Showing counter */}
                <div
                  className="
                    flex
                    h-12
                    min-w-[142px]
                    items-center
                    justify-center
                    rounded-xl
                    border
                    border-[#2A2A2A]
                    bg-[#111111]
                    px-4
                  "
                >
                  <div className="text-center">
                    <div className="flex items-baseline justify-center gap-1.5">
                      <span className="text-lg font-bold text-white">
                        {filteredStudents.length}
                      </span>

                      <span className="text-xs text-gray-600">/</span>

                      <span className="text-sm font-medium text-gray-400">
                        {students.length}
                      </span>
                    </div>

                    <div className="text-[10px] font-medium uppercase tracking-[0.16em] text-gray-600">
                      Students
                    </div>
                  </div>
                </div>
              </div>

              {/* ===============================
                  FILTER ROW
              =============================== */}

              <div className="mt-3 flex items-center gap-3">
                {/* Filter label */}
                <div
                  className="
                    flex
                    shrink-0
                    items-center
                    gap-2
                    px-1
                    text-[11px]
                    font-semibold
                    uppercase
                    tracking-[0.14em]
                    text-gray-600
                  "
                >
                  <svg
                    className="h-3.5 w-3.5"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                  >
                    <path d="M4 6h16M7 12h10M10 18h4" strokeLinecap="round" />
                  </svg>
                  Filters
                </div>

                {/* Class */}
                <div
                  className="
                    group
                    relative
                    flex
                    h-10
                    min-w-[190px]
                    items-center
                    rounded-xl
                    border
                    border-[#2A2A2A]
                    bg-[#111111]
                    transition-all
                    duration-200
                    hover:border-[#3A3A3A]
                    focus-within:border-[#4A4A4A]
                    focus-within:ring-4
                    focus-within:ring-white/[0.025]
                  "
                >
                  <div className="pointer-events-none px-3">
                    <div className="text-[9px] font-semibold uppercase tracking-[0.13em] text-gray-600">
                      Class
                    </div>

                    <div className="text-[12px] font-medium text-gray-200">
                      {filters.classFilter === "All"
                        ? "All Classes"
                        : classes.find(
                            (cls) =>
                              String(cls.id) === String(filters.classFilter),
                          )?.class_name || "Selected class"}
                    </div>
                  </div>

                  <select
                    value={filters.classFilter}
                    onChange={(e) =>
                      updateFilter("classFilter", e.target.value)
                    }
                    aria-label="Filter by class"
                    className="
                      absolute
                      inset-0
                      h-full
                      w-full
                      cursor-pointer
                      appearance-none
                      opacity-0
                    "
                  >
                    <option value="All">All Classes</option>

                    {classes.map((cls) => (
                      <option key={cls.id} value={cls.id}>
                        {cls.class_name}
                      </option>
                    ))}
                  </select>

                  <svg
                    className="
                      pointer-events-none
                      absolute
                      right-3
                      h-4
                      w-4
                      text-gray-500
                      transition
                      group-hover:text-gray-300
                    "
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                  >
                    <path
                      d="M6 9l6 6 6-6"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>

                {/* Sort */}
                <div
                  className="
                    group
                    relative
                    flex
                    h-10
                    min-w-[225px]
                    items-center
                    rounded-xl
                    border
                    border-[#2A2A2A]
                    bg-[#111111]
                    transition-all
                    duration-200
                    hover:border-[#3A3A3A]
                    focus-within:border-[#4A4A4A]
                    focus-within:ring-4
                    focus-within:ring-white/[0.025]
                  "
                >
                  <div className="pointer-events-none px-3">
                    <div className="text-[9px] font-semibold uppercase tracking-[0.13em] text-gray-600">
                      Sort by
                    </div>

                    <div className="text-[12px] font-medium text-gray-200">
                      {selectedSortLabel}
                    </div>
                  </div>

                  <select
                    value={filters.sortBy}
                    onChange={(e) => updateFilter("sortBy", e.target.value)}
                    aria-label="Sort students"
                    className="
                      absolute
                      inset-0
                      h-full
                      w-full
                      cursor-pointer
                      appearance-none
                      opacity-0
                    "
                  >
                    {sortOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>

                  <svg
                    className="
                      pointer-events-none
                      absolute right-3 h-4 w-4
                      text-gray-500 transition
                      group-hover:text-gray-300
                    "
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                  >
                    <path
                      d="M6 9l6 6 6-6"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>

                {/* Direction */}
                <button
                  type="button"
                  onClick={onSortToggle}
                  title={
                    filters.sortDir === "asc"
                      ? "Ascending — click for descending"
                      : "Descending — click for ascending"
                  }
                  aria-label="Toggle sort direction"
                  className="
                    flex
                    h-10
                    w-10
                    shrink-0
                    items-center
                    justify-center
                    rounded-xl
                    border
                    border-[#2A2A2A]
                    bg-[#111111]
                    text-gray-400
                    transition-all
                    duration-200
                    hover:border-[#3A3A3A]
                    hover:bg-[#161616]
                    hover:text-white
                    active:scale-95
                  "
                >
                  {filters.sortDir === "asc" ? (
                    <svg
                      className="h-[17px] w-[17px]"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.8"
                    >
                      <path d="M12 18V6" strokeLinecap="round" />
                      <path
                        d="M7 11l5-5 5 5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path d="M5 20h14" strokeLinecap="round" opacity=".35" />
                    </svg>
                  ) : (
                    <svg
                      className="h-[17px] w-[17px]"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.8"
                    >
                      <path d="M12 6v12" strokeLinecap="round" />
                      <path
                        d="M7 13l5 5 5-5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path d="M5 4h14" strokeLinecap="round" opacity=".35" />
                    </svg>
                  )}
                </button>

                {/* Active filter indicator */}
                <div className="ml-auto flex items-center gap-3">
                  {hasActiveFilters && (
                    <div className="flex items-center gap-2">
                      <span
                        className="
                          h-1.5
                          w-1.5
                          rounded-full
                          bg-white
                        "
                      />

                      <span className="text-[11px] font-medium text-gray-500">
                        Filters active
                      </span>
                    </div>
                  )}

                  {/* Clear */}
                  <button
                    type="button"
                    onClick={clearFilters}
                    disabled={!hasActiveFilters}
                    className="
                      flex
                      h-10
                      items-center
                      gap-2
                      rounded-xl
                      border
                      border-[#2A2A2A]
                      bg-[#111111]
                      px-3.5
                      text-[12px]
                      font-medium
                      text-gray-500
                      transition-all
                      duration-200
                      hover:border-[#3A3A3A]
                      hover:bg-[#161616]
                      hover:text-gray-200
                      active:scale-[0.98]
                      disabled:cursor-default
                      disabled:opacity-40
                      disabled:hover:border-[#2A2A2A]
                      disabled:hover:bg-[#111111]
                      disabled:hover:text-gray-500
                    "
                  >
                    <svg
                      className="h-3.5 w-3.5"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.8"
                    >
                      <path d="M6 6l12 12M18 6L6 18" strokeLinecap="round" />
                    </svg>
                    Clear
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* =========================================================
          MOBILE FILTER / SEARCH
      ========================================================= */}

      <div className="lg:hidden px-4 pt-4">
        <div
          className="
            overflow-hidden
            rounded-2xl
            border
            border-[#2A2A2A]
            bg-[#1A1A1A]
            shadow-[0_14px_40px_-24px_rgba(0,0,0,0.9)]
          "
        >
          <div className="p-4">
            {/* Search */}
            <div className="relative">
              <div
                className="
                  pointer-events-none
                  absolute
                  inset-y-0
                  left-0
                  flex
                  items-center
                  pl-4
                  text-gray-500
                "
              >
                <svg
                  className="h-[18px] w-[18px]"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                >
                  <circle cx="11" cy="11" r="6.5" />

                  <path d="M16 16L20 20" strokeLinecap="round" />
                </svg>
              </div>

              <input
                type="text"
                value={filters.search}
                onChange={(e) => updateFilter("search", e.target.value)}
                placeholder="Search students..."
                aria-label="Search students"
                className="
                  h-12
                  w-full
                  rounded-xl
                  border
                  border-[#2A2A2A]
                  bg-[#111111]
                  pl-11
                  pr-11
                  text-[14px]
                  font-medium
                  text-white
                  placeholder:text-gray-600
                  outline-none
                  transition-all
                  focus:border-[#4A4A4A]
                  focus:ring-4
                  focus:ring-white/[0.035]
                "
              />

              {filters.search && (
                <button
                  type="button"
                  onClick={clearSearch}
                  aria-label="Clear search"
                  className="
                    absolute
                    inset-y-0
                    right-2
                    my-auto
                    flex
                    h-8
                    w-8
                    items-center
                    justify-center
                    rounded-lg
                    text-gray-500
                    hover:bg-white/[0.06]
                    hover:text-gray-200
                  "
                >
                  <svg
                    className="h-4 w-4"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M6 6L18 18M18 6L6 18" strokeLinecap="round" />
                  </svg>
                </button>
              )}
            </div>

            {/* Results */}
            <div className="mt-3 flex items-center justify-between">
              <div>
                <div className="text-[10px] font-semibold uppercase tracking-[0.15em] text-gray-600">
                  Results
                </div>

                <div className="mt-0.5 text-sm font-medium text-gray-300">
                  <span className="font-bold text-white">
                    {filteredStudents.length}
                  </span>

                  <span className="mx-1.5 text-gray-700">/</span>

                  <span className="text-gray-500">{students.length}</span>

                  <span className="ml-1 text-gray-600">students</span>
                </div>
              </div>

              {hasActiveFilters && (
                <button
                  type="button"
                  onClick={clearFilters}
                  className="
                    flex
                    items-center
                    gap-1.5
                    rounded-lg
                    px-2.5
                    py-1.5
                    text-[11px]
                    font-medium
                    text-gray-500
                    transition
                    hover:bg-white/[0.05]
                    hover:text-gray-200
                  "
                >
                  <svg
                    className="h-3.5 w-3.5"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                  >
                    <path d="M6 6l12 12M18 6L6 18" strokeLinecap="round" />
                  </svg>
                  Clear
                </button>
              )}
            </div>

            {/* Divider */}
            <div className="my-3.5 h-px bg-[#242424]" />

            {/* Class + Sort */}
            <div className="grid grid-cols-[1fr_auto] gap-2.5">
              {/* Class */}
              <div
                className="
                  group
                  relative
                  h-12
                  rounded-xl
                  border
                  border-[#2A2A2A]
                  bg-[#111111]
                  px-3
                  transition
                  focus-within:border-[#4A4A4A]
                "
              >
                <div className="pointer-events-none pt-1.5">
                  <div className="text-[9px] font-semibold uppercase tracking-[0.13em] text-gray-600">
                    Class
                  </div>

                  <div className="truncate pr-5 text-[12px] font-medium text-gray-200">
                    {filters.classFilter === "All"
                      ? "All Classes"
                      : classes.find(
                          (cls) =>
                            String(cls.id) === String(filters.classFilter),
                        )?.class_name || "Selected class"}
                  </div>
                </div>

                <select
                  value={filters.classFilter}
                  onChange={(e) => updateFilter("classFilter", e.target.value)}
                  aria-label="Filter by class"
                  className="
                    absolute
                    inset-0
                    h-full
                    w-full
                    cursor-pointer
                    appearance-none
                    opacity-0
                  "
                >
                  <option value="All">All Classes</option>

                  {classes.map((cls) => (
                    <option key={cls.id} value={cls.id}>
                      {cls.class_name}
                    </option>
                  ))}
                </select>

                <svg
                  className="
                    pointer-events-none
                    absolute
                    right-3
                    top-1/2
                    h-3.5
                    w-3.5
                    -translate-y-1/2
                    text-gray-500
                  "
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                >
                  <path
                    d="M6 9l6 6 6-6"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>

              {/* Sort + Direction */}
              <div className="flex gap-2">
                <div
                  className="
                    group
                    relative
                    h-12
                    min-w-[128px]
                    rounded-xl
                    border
                    border-[#2A2A2A]
                    bg-[#111111]
                    px-3
                    transition
                    focus-within:border-[#4A4A4A]
                  "
                >
                  <div className="pointer-events-none pt-1.5">
                    <div className="text-[9px] font-semibold uppercase tracking-[0.13em] text-gray-600">
                      Sort
                    </div>

                    <div className="truncate pr-4 text-[12px] font-medium text-gray-200">
                      {selectedSortLabel}
                    </div>
                  </div>

                  <select
                    value={filters.sortBy}
                    onChange={(e) => updateFilter("sortBy", e.target.value)}
                    aria-label="Sort students"
                    className="
                      absolute
                      inset-0
                      h-full
                      w-full
                      cursor-pointer
                      appearance-none
                      opacity-0
                    "
                  >
                    {sortOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>

                  <svg
                    className="
                      pointer-events-none
                      absolute
                      right-2.5
                      top-1/2
                      h-3.5
                      w-3.5
                      -translate-y-1/2
                      text-gray-500
                    "
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                  >
                    <path
                      d="M6 9l6 6 6-6"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>

                <button
                  type="button"
                  onClick={onSortToggle}
                  aria-label="Toggle sort direction"
                  className="
                    flex h-12 w-11 shrink-0
                    items-center justify-center
                    rounded-xl
                    border
                    border-[#2A2A2A]
                    bg-[#111111]
                    text-gray-400
                    transition
                    hover:border-[#3A3A3A]
                    hover:bg-[#161616]
                    hover:text-white
                    active:scale-95
                  "
                >
                  {filters.sortDir === "asc" ? (
                    <svg
                      className="h-4 w-4"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.8"
                    >
                      <path d="M12 18V6" strokeLinecap="round" />
                      <path
                        d="M7 11l5-5 5 5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  ) : (
                    <svg
                      className="h-4 w-4"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.8"
                    >
                      <path d="M12 6v12" strokeLinecap="round" />
                      <path
                        d="M7 13l5 5 5-5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile stats */}
        <div
          className="
            mt-3
            rounded-2xl
            border
            border-[#2A2A2A]
            bg-[#1A1A1A]
            px-4
            py-3
          "
        >
          <div className="grid grid-cols-2 divide-x divide-[#292929]">
            <div className="text-center">
              <div className="text-[10px] font-semibold uppercase tracking-[0.15em] text-gray-600">
                Showing
              </div>

              <div className="mt-1 text-lg font-bold text-white">
                {filteredStudents.length}
              </div>
            </div>

            <div className="text-center">
              <div className="text-[10px] font-semibold uppercase tracking-[0.15em] text-gray-600">
                Total
              </div>

              <div className="mt-1 text-lg font-bold text-gray-400">
                {students.length}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* =========================================================
          ANALYTICS
      ========================================================= */}

      {hasPermission(PERMISSIONS.FEES_ANALYTICS) && (
        <section className="mt-5 grid gap-3 px-0 sm:grid-cols-2 xl:grid-cols-4">
          <div className="rounded-2xl border border-[#2A2A2A] bg-[#1A1A1A] p-4">
            <p className="text-[11px] uppercase tracking-[0.18em] text-gray-400">
              Total Collected
            </p>

            <p className="mt-2 text-2xl font-bold text-emerald-300">
              ₹{summary.totalSettledAmount.toLocaleString("en-IN")}
            </p>
          </div>

          <div className="rounded-2xl border border-[#2A2A2A] bg-[#1A1A1A] p-4">
            <p className="text-[11px] uppercase tracking-[0.18em] text-gray-400">
              Outstanding
            </p>

            <p className="mt-2 text-2xl font-bold text-red-300">
              ₹{summary.totalOutstanding.toLocaleString("en-IN")}
            </p>
          </div>

          <div className="rounded-2xl border border-[#2A2A2A] bg-[#1A1A1A] p-4">
            <p className="text-[11px] uppercase tracking-[0.18em] text-gray-400">
              Discount Given
            </p>

            <p className="mt-2 text-2xl font-bold text-gray-200">
              ₹{summary.totalDiscount.toLocaleString("en-IN")}
            </p>
          </div>

          <div className="rounded-2xl border border-[#2A2A2A] bg-[#1A1A1A] p-4">
            <p className="text-[11px] uppercase tracking-[0.18em] text-gray-400">
              Total Students
            </p>

            <p className="mt-2 text-2xl font-bold text-white">
              {summary.totalStudents}
            </p>
          </div>
        </section>
      )}

      {/* =========================================================
          STUDENTS
      ========================================================= */}

      <section className="mt-6 pb-5">
        {filteredStudents.length === 0 ? (
          <div
            className="
              rounded-3xl
              border
              border-dashed
              border-[#3A3A3A]
              bg-[#1A1A1A]
              px-6
              py-16
              text-center
            "
          >
            <div
              className="
                mx-auto
                mb-4
                flex
                h-14
                w-14
                items-center
                justify-center
                rounded-full
                border
                border-[#2A2A2A]
                bg-[#111111]
                text-gray-400
              "
            >
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.7"
                className="h-6 w-6"
              >
                <circle cx="11" cy="11" r="6" />

                <path d="M20 20L16.65 16.65" strokeLinecap="round" />
              </svg>
            </div>

            <h2 className="text-xl font-semibold text-white">
              No students match the current filters
            </h2>

            <p className="mt-2 text-sm text-gray-400">
              Try adjusting the search term or class filter.
            </p>

            {hasActiveFilters && (
              <button
                type="button"
                onClick={clearFilters}
                className="
                  mt-5
                  inline-flex
                  items-center
                  gap-2
                  rounded-xl
                  border
                  border-[#333333]
                  bg-[#111111]
                  px-4
                  py-2.5
                  text-sm
                  font-medium
                  text-gray-300
                  transition
                  hover:border-[#454545]
                  hover:bg-[#181818]
                  hover:text-white
                "
              >
                <svg
                  className="h-4 w-4"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                >
                  <path d="M6 6l12 12M18 6L6 18" strokeLinecap="round" />
                </svg>
                Clear filters
              </button>
            )}
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

      {/* =========================================================
          STUDENT DETAILS MODAL
      ========================================================= */}

      {selectedStudent && (
        <StudentDetailsModal
          student={selectedStudent}
          onClose={() => setSelectedStudent(null)}
        />
      )}

      {/* =========================================================
          FEE DRAWER
      ========================================================= */}

      {isFeeDrawerOpen && feeDrawerStudent && (
        <FeeDrawer
          feeDrawerStudent={feeDrawerStudent}
          onClose={() => setFeeDrawerOpen(false)}
          onSetupFeeSession={() => setFeeDrawerOpen(false)}
          setTransactionModalOpen={(studentSessionId, studentPhone) => {
            setTransactionModalStudent({
              studentSessionId,
              phone: studentPhone,
            });

            setTransactionModalOpen(true);
          }}
        />
      )}

      {/* =========================================================
          TRANSACTION MODAL
      ========================================================= */}

      {isTransactionModalOpen && transactionModalStudent && (
        <TransactionModal
          transactionModalStudent={transactionModalStudent}
          onClose={() => setTransactionModalOpen(false)}
        />
      )}
    </>
  );
}
