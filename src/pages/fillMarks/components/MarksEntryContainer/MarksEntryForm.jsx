/* =========================
   DESKTOP VIEW
========================= */
function MarksEntryFormDesktop({
    studentsMarksData,
    marks,
    loading,
    onMarkChange,
    handleSubmit,
}) {
    return (
        <div className="hidden lg:block">
            <div className="glass-card rounded-2xl overflow-hidden border border-white/5">
                <div className="custom-scrollbar overflow-x-auto">
                    <table className="w-full text-sm text-left text-gray-300">
                        <thead className="bg-gray-900/40 border-b border-white/5">
                            <tr>
                                <th className="px-6 py-4">Roll</th>
                                <th className="px-6 py-4">Name</th>
                                <th className="px-6 py-4">Gender</th>
                                <th className="px-6 py-4">
                                    Marks (0-{studentsMarksData?.[0]?.weightage || 0})
                                </th>
                                <th className="px-6 py-4">Action</th>
                            </tr>
                        </thead>

                        <tbody className="divide-y divide-white/5">
                            {studentsMarksData?.map((student) => (
                                <tr key={student.student_id}>
                                    <td className="px-6 py-4 text-white">
                                        {student.ROLL}
                                    </td>

                                    <td className="px-6 py-4">
                                        {student.STUDENTS_NAME}
                                    </td>

                                    <td className="px-6 py-4">
                                        {student.GENDER}
                                    </td>

                                    <td className="px-6 py-4">
                                        <InputBox
                                            student={student}
                                            value={marks[student.student_id] || ""}
                                            onChange={onMarkChange}
                                        />
                                    </td>

                                    <td className="px-6 py-4">
                                        <SubmitButton
                                            student={student}
                                            loading={loading}
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

/* =========================
   MOBILE VIEW
========================= */
function MarksEntryFormMobile({
    studentsMarksData,
    marks,
    loading,
    onMarkChange,
    handleSubmit,
}) {
    return (
        <div className="lg:hidden space-y-4">
            {studentsMarksData?.map((student) => (
                <div
                    key={student.student_id}
                    className="glass-card rounded-2xl p-5 border border-white/5"
                >
                    {/* Header */}
                    <div className="flex justify-between items-start mb-4">
                        <div className="flex items-center gap-3">
                            <div
                                className={`w-3 h-3 rounded-full ${student.GENDER === "Male"
                                    ? "bg-blue-500"
                                    : "bg-pink-500"
                                    }`}
                            />

                            <div>
                                <p className="font-semibold text-white">
                                    {student.STUDENTS_NAME}
                                </p>
                                <p className="text-xs text-gray-400">
                                    Roll #{student.ROLL}
                                </p>
                            </div>
                        </div>

                        <span
                            className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${student.GENDER === "Male"
                                ? "bg-blue-500/20 text-blue-300"
                                : "bg-pink-500/20 text-pink-300"
                                }`}
                        >
                            {student.GENDER}
                        </span>
                    </div>

                    {/* Info */}
                    <div className="grid grid-cols-2 gap-4 mb-4">
                        <div>
                            <p className="text-gray-400 text-xs uppercase tracking-wider mb-1">
                                Class
                            </p>
                            <p className="text-sm font-semibold text-white">
                                {student.CLASS}
                            </p>
                        </div>

                        <div>
                            <p className="text-gray-400 text-xs uppercase tracking-wider mb-1">
                                Exam
                            </p>
                            <p className="text-sm font-semibold text-white">
                                {student.exam_name}
                            </p>
                        </div>
                    </div>

                    {/* Marks input */}
                    <div className="mb-3">
                        <p className="text-gray-400 text-xs uppercase tracking-wider mb-2">
                            Marks (0-{student.weightage})
                        </p>

                        <InputBox
                            student={student}
                            value={marks[student.student_id] || ""}
                            onChange={onMarkChange}
                        />
                    </div>

                    {/* Submit */}
                    <SubmitButton
                        student={student}
                        loading={loading}
                        handleSubmit={handleSubmit}
                    />
                </div>
            ))}
        </div>
    );
}

/* =========================
   INPUT BOX
========================= */
function InputBox({ student, value, onChange }) {
    return (
        <input
            type={student.evaluation_type === "grading" ? "text" : "number"}
            value={value}
            onChange={(e) =>
                onChange(
                    student.student_id,
                    e.target.value,
                    student.evaluation_type
                )
            }
            className="w-24 px-3 py-2 bg-gray-800/50 border border-white/10 rounded-lg text-white"
        />
    );
}

/* =========================
   BUTTON
========================= */
function SubmitButton({ student, loading, handleSubmit }) {
    return (
        <button
            onClick={() => handleSubmit(student)}
            className={`px-3 py-2 rounded-lg text-white ${student.GENDER === "Male" ? "bg-blue-600" : "bg-pink-600"
                }`}
            disabled={loading?.[student.student_id]}
        >
            {loading?.[student.student_id] ? "..." : "submit"}
        </button>
    );
}

export { MarksEntryFormMobile, MarksEntryFormDesktop }