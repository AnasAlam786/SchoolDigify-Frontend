import React from "react";

/* ==========================================================
   DESKTOP VIEW COMPONENT
   Optimized exclusively for large screens (lg+)
========================================================== */
function MarksEntryFormDesktop({
    studentsMarksData, selectedSubjectInfo, selectedExamInfo,
    marks, loading, submitStatus,
    onMarkChange, handleSubmit,
}) {
    return (
        <div className="hidden lg:block w-full">
            <div className="bg-[#181918] border border-white/10 rounded-3xl shadow-2xl overflow-hidden backdrop-blur-2xl">
                {/* Header Banner */}
                <div className="px-8 py-6 border-b border-white/10 flex items-center justify-between bg-white/[0.02]">
                    <div>
                        <h2 className="text-xl font-bold text-white tracking-tight">Student Academic Evaluation</h2>
                        <p className="text-xs text-slate-400 mt-1">Manage scores, grades, and records for the current term.</p>
                    </div>
                    <div className="flex items-center gap-3">
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-blue-500/10 text-blue-400 border border-blue-500/20">
                            <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse"></span>
                            {studentsMarksData?.length || 0} Students Enrolled
                        </span>
                    </div>
                </div>

                {/* Table Layout */}
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b border-white/10 text-xs font-semibold text-slate-400 uppercase tracking-wider bg-black/20">
                                <th className="py-4 px-8">Roll No.</th>
                                <th className="py-4 px-8">Student Profile</th>
                                <th className="py-4 px-8">Exam / Subject</th>
                                <th className="py-4 px-8">Score Input</th>
                                <th className="py-4 px-8 text-right">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5 text-sm">
                            {studentsMarksData?.map((student) => (
                                <tr key={student.student_id} className="group hover:bg-white/[0.015] transition-colors">
                                    <td className="py-5 px-8 font-mono font-medium text-slate-400">
                                        #{student.ROLL}
                                    </td>
                                    <td className="py-5 px-8">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-white/10 to-white/5 flex items-center justify-center text-white font-semibold border border-white/10 shadow-inner">
                                                {student.STUDENTS_NAME?.charAt(0)}
                                            </div>
                                            <div>
                                                <p className="font-semibold text-white group-hover:text-indigo-400 transition-colors">
                                                    {student.STUDENTS_NAME}
                                                </p>
                                                <p className="text-xs text-slate-500 font-mono">Class: {student.class_name}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="py-5 px-8">
                                        <div className="flex flex-col">
                                            <span className="text-white font-medium text-xs">{selectedExamInfo.name}</span>
                                            <span className=" text-slate-500 text-[11px] truncate max-w-[180px]">{selectedSubjectInfo.name}</span>
                                        </div>
                                    </td>
                                    <td className="py-5 px-8">
                                        <div className="flex items-center gap-2">
                                            <DesktopInputBox
                                                student={student}
                                                value={marks[student.student_id] ?? ""}
                                                onChange={onMarkChange}
                                            />
                                            <span className="text-xs text-slate-500 font-mono">/ {selectedExamInfo.weightage}</span>
                                        </div>
                                    </td>
                                    <td className="py-5 px-8 text-right">
                                        <DesktopSubmitButton
                                            student={student}
                                            loading={loading?.[student.student_id]}
                                            status={submitStatus?.[student.student_id]}
                                            handleSubmit={handleSubmit}
                                        />
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

/* ==========================================================
   MOBILE VIEW COMPONENT
   Optimized exclusively for small screens (max lg)
========================================================== */
function MarksEntryFormMobile({
    studentsMarksData, selectedSubjectInfo, selectedExamInfo,
    marks, loading, submitStatus, onMarkChange, handleSubmit,
}) {
    return (
        <div className="lg:hidden space-y-4 w-full px-1">
            {/* Top Stats Indicator for Mobile */}
            <div className="flex items-center justify-between px-2 pb-2">
                <h2 className="text-base font-bold text-white tracking-tight">Marks Entry Panel</h2>
                <span className="text-xs bg-white/5 border border-white/10 px-3 py-1 rounded-full text-slate-400">
                    Total: <strong className="text-white">{studentsMarksData?.length || 0}</strong>
                </span>
            </div>

            {studentsMarksData?.map((student) => (
                <div
                    key={student.student_id}
                    className="bg-[#181918] border border-white/10 rounded-2xl p-5 shadow-xl flex flex-col gap-3.5 relative overflow-hidden"
                >
                    {/* Absolute Accent Bar on left edge matching gender */}
                    <div className={`absolute top-0 left-0 bottom-0 w-1.5 ${
                        student.GENDER === "Male" ? "bg-blue-500" : "bg-pink-500"
                    }`} />

                    {/* Card Header */}
                    <div className="flex items-start justify-between gap-3 pl-1">
                        <div className="flex items-center gap-3">
                            <div className="w-11 h-11 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-white font-bold text-base shadow-inner">
                                {student.STUDENTS_NAME?.charAt(0)}
                            </div>
                            <div>
                                <h3 className="font-bold text-white text-base leading-snug">
                                    {student.STUDENTS_NAME}
                                </h3>
                                <p className="text-xs text-slate-400 font-mono mt-0.5">
                                    Roll #{student.ROLL} • {student.class_name}
                                </p>
                            </div>
                        </div>

                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-medium ${
                            student.GENDER === "Male"
                                ? "bg-blue-500/10 text-blue-400 border border-blue-500/20"
                                : "bg-pink-500/10 text-pink-400 border border-pink-500/20"
                        }`}>
                            {student.GENDER}
                        </span>
                    </div>

                    {/* Exam Sub-card metadata */}
                    <div className="ml-0 bg-black/30 border border-white/5 rounded-xl p-3 flex items-center justify-between text-xs">
                        <span className="text-slate-400 font-medium">Exam Assessment</span>
                        <span className="text-white font-semibold truncate max-w-[160px]">{selectedExamInfo.name}</span>
                    </div>

                    {/* Subject Sub-card metadata */}
                    <div className="ml-0 bg-black/30 border border-white/5 rounded-xl p-3 flex items-center justify-between text-xs">
                        <span className="text-slate-400 font-medium">Subject Assessment</span>
                        <span className="text-white font-semibold truncate max-w-[160px]">{selectedSubjectInfo.name}</span>
                    </div>

                    {/* Action & Input Row */}
                    <div className="ml-0 pt-2 flex items-center justify-between gap-3 border-t border-white/5">
                        <div className="flex-1">
                            <label className="block text-[10px] uppercase tracking-wider font-semibold text-slate-400 mb-1">
                                Score (Max {selectedExamInfo.weightage})
                            </label>
                            <MobileInputBox
                                student={student}
                                value={marks[student.student_id] ?? ""}
                                onChange={onMarkChange}
                            />
                        </div>

                        <div className="pt-5">
                            <MobileSubmitButton
                                student={student}
                                loading={loading?.[student.student_id]}
                                status={submitStatus?.[student.student_id]}
                                handleSubmit={handleSubmit}
                            />
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}

/* ==========================================================
   DESKTOP SUB-COMPONENTS
========================================================== */
function DesktopInputBox({ student, value, onChange }) {
    return (
        <input
            type={student.evaluation_type === "grading" ? "text" : "number"}
            value={value}
            placeholder="—"
            onChange={(e) =>
                onChange(student.student_id, e.target.value, student.evaluation_type)
            }
            className="w-28 px-3.5 py-2 bg-black/40 border border-white/10 rounded-xl text-white font-mono text-center focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all placeholder:text-slate-600 shadow-inner"
        />
    );
}

function DesktopSubmitButton({ student, loading, status, handleSubmit }) {
    if (status === "success") {
        return (
            <div className="inline-flex items-center gap-1.5 px-4 py-2 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-medium text-xs rounded-xl animate-fade-in">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
                <span>Saved</span>
            </div>
        );
    }

    if (status === "error") {
        return (
            <div className="inline-flex items-center gap-1.5 px-3 py-2 bg-rose-500/10 border border-rose-500/20 text-rose-400 font-medium text-xs rounded-xl">
                <span>Failed</span>
            </div>
        );
    }

    return (
        <button
            onClick={() => handleSubmit(student)}
            disabled={loading}
            className={`px-5 py-2 rounded-xl text-xs font-semibold text-white transition-all shadow-lg active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center min-w-[84px] ${
                student.GENDER === "Male"
                    ? "bg-blue-600 hover:bg-blue-500 shadow-blue-600/20"
                    : "bg-pink-600 hover:bg-pink-500 shadow-pink-600/20"
            }`}
        >
            {loading ? (
                <svg className="animate-spin h-3.5 w-3.5 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
            ) : (
                "Save Score"
            )}
        </button>
    );
}

/* ==========================================================
   MOBILE SUB-COMPONENTS
========================================================== */
function MobileInputBox({ student, value, onChange }) {
    return (
        <input
            type={student.evaluation_type === "grading" ? "text" : "number"}
            value={value}
            placeholder="—"
            onChange={(e) =>
                onChange(student.student_id, e.target.value, student.evaluation_type)
            }
            className="w-full px-3 py-2.5 bg-black/50 border border-white/10 rounded-xl text-white font-mono text-center text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all placeholder:text-slate-600 shadow-inner"
        />
    );
}

function MobileSubmitButton({ student, loading, status, handleSubmit }) {
    if (status === "success") {
        return (
            <div className="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-medium text-xs rounded-xl shadow-lg">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
                <span>Saved</span>
            </div>
        );
    }

    if (status === "error") {
        return (
            <div className="inline-flex items-center justify-center gap-1.5 px-3 py-2.5 bg-rose-500/10 border border-rose-500/20 text-rose-400 font-medium text-xs rounded-xl">
                <span>Failed</span>
            </div>
        );
    }

    return (
        <button
            onClick={() => handleSubmit(student)}
            disabled={loading}
            className={`px-5 py-2.5 rounded-xl text-xs font-semibold text-white transition-all shadow-lg active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center min-w-[80px] ${
                student.GENDER === "Male"
                    ? "bg-blue-600 hover:bg-blue-500 shadow-blue-600/20"
                    : "bg-pink-600 hover:bg-pink-500 shadow-pink-600/20"
            }`}
        >
            {loading ? (
                <svg className="animate-spin h-3.5 w-3.5 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
            ) : (
                "Save"
            )}
        </button>
    );
}

export { MarksEntryFormMobile, MarksEntryFormDesktop };