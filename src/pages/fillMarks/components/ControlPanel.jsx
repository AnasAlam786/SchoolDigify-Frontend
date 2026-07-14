import usePermission from "../../../hooks/usePermission";

function ControlPanel({
  classes = [], exams = [],
  subjects = [], filters, setFilters,
  submitFilters, SubjectFetchingError,
  isStudentDataloading,
}) {

  const {hasPermission, PERMISSIONS} = usePermission()
  return (
    <>
      {/* Selection Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 mb-10">

        {/* Class */}
        <div className="glass-card rounded-xl p-5">
          <label className="block text-sm font-semibold text-gray-300 mb-2 ml-1">
            <i className="fas fa-graduation-cap mr-2 text-indigo-400"></i>
            Class
          </label>

          <div className="relative">
            <select
              className="w-full bg-[#1A1A1A] border border-white/10 text-gray-100 text-base p-3 pl-4 rounded-lg focus:ring-2 
              focus:ring-indigo-500/50 focus:border-indigo-500 outline-none transition-all appearance-none cursor-pointer"

              value={filters.classId}
              onChange={(e) => {
                const classId = e.target.value;
                setFilters(prev => ({
                  ...prev,
                  classId,
                  subjectId: "",
                }));
              }}
            >
              <option value="" disabled>
                Select Class
              </option>

              {classes.map((cls) => (
                <option
                  key={cls.id}
                  value={cls.id}
                  className="bg-[#1A1A1A] text-gray-100"
                >
                  {cls.className}
                </option>
              ))}
            </select>

            <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
              <i className="fas fa-chevron-down"></i>
            </div>
          </div>
        </div>

        {/* Subject */}
        <div className="glass-card rounded-xl p-5">
          <label className="block text-sm font-semibold text-gray-300 mb-2 ml-1">
            <i className="fas fa-book mr-2 text-purple-400"></i>
            Subject
          </label>

          <div className="relative">
            <select
              className="w-full bg-[#1A1A1A] border border-white/10 text-gray-100 text-base p-3 pl-4 rounded-lg 
              focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500 outline-none transition-all 
              appearance-none cursor-pointer disabled:opacity-50"

              value={filters.subjectId}
              onChange={(e) =>
                setFilters(prev => ({
                  ...prev,
                  subjectId: e.target.value,
                }))
              }
              disabled={!filters.classId || !!SubjectFetchingError}
            >


              <option value="" disabled>
                {SubjectFetchingError
                  ? SubjectFetchingError
                  : filters.classId
                    ? "Select Subject"
                    : "Please Select Class First"}
              </option>


              {!SubjectFetchingError &&
                subjects.map((subject) => (
                  <option
                    key={subject.id}
                    value={subject.id}
                    className="bg-[#1A1A1A] text-gray-100"
                  >
                    {subject.subjectName}
                  </option>
                ))}
            </select>

            <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
              <i className="fas fa-chevron-down"></i>
            </div>
          </div>
        </div>

        {/* Exam */}
        <div className="glass-card rounded-xl p-5">
          <label className="block text-sm font-semibold text-gray-300 mb-2 ml-1">
            <i className="fas fa-clipboard-list mr-2 text-blue-400"></i>
            Exam
          </label>

          <div className="relative">
            <select
              value={filters.examId}

              onChange={(e) =>
                setFilters(prev => ({
                  ...prev,
                  examId: e.target.value,
                }))
              }

              className="w-full bg-[#1A1A1A] border border-white/10 text-gray-100 text-base p-3 pl-4 
              rounded-lg focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 outline-none transition-all 
              appearance-none cursor-pointer"
            >
              <option value="" disabled>
                Select Exam
              </option>

              {exams.map((exam) => (
                <option
                  key={exam.id}
                  value={exam.id}
                  disabled={
                    !exam.is_enabled &&
                    !hasPermission(PERMISSIONS.OVERRIDE_MARKS_LOCK)
                  }
                  className="bg-[#1A1A1A] text-gray-100">

                  {exam.exam_name}
                </option>
              ))}
            </select>

            <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
              <i className="fas fa-chevron-down"></i>
            </div>
          </div>
        </div>

      </div>

      {/* Get Marks Button */}
      <div className="text-center mb-12">
        <button
          type="button"
          onClick={submitFilters}
          disabled={isStudentDataloading}
          className={`
        group relative px-10 py-4 text-white font-semibold rounded-xl
        shadow-lg transition-all duration-300
        ${isStudentDataloading
              ? "bg-gray-600 cursor-not-allowed opacity-70"
              : "bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 hover:shadow-indigo-500/30 transform hover:-translate-y-1"
            }
    `}
        >
          {isStudentDataloading ? (
            <span className="flex items-center gap-3">
              <svg
                className="w-5 h-5 animate-spin"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                />
              </svg>

              <span>Loading...</span>
            </span>
          ) : (
            <span className="flex items-center gap-3">
              <i className="fas fa-download"></i>

              <span>Get Marks</span>

              <i className="fas fa-arrow-right group-hover:translate-x-1 transition-transform"></i>
            </span>
          )}
        </button>
      </div>
    </>
  );
}

export default ControlPanel