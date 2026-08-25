import { getGrandTotal, getStudentTotal } from './feeDrawer.utils';

const indicatorColors = ['bg-blue-500', 'bg-green-500', 'bg-amber-500', 'bg-purple-500'];

export default function FeeDrawerHeader({
    students,
    currentStudentIndex,
    currentStudentData,
    setCurrentStudentIndex,
}) {
    const pendingMonths = students.reduce(
        (sum, student) => sum + Number(student.total_due_terms || 0),
        0,
    );

    return (
        <div className="flex-shrink-0 border-b border-gray-800 bg-gray-900">

            <div className="m-3 flex rounded-[16px] bg-slate-800/80 p-[6px]">
                {students.map((student, index) => (
                    <button
                        key={student.student_session_id || student.id || student.name || index}
                        type="button"
                        onClick={() => setCurrentStudentIndex(index)}
                        className={`flex flex-1 items-center justify-center gap-2 rounded-xl border px-3 py-2 text-sm font-medium transition-all 
                            ${index === currentStudentIndex
                                ? 'border-sky-500/30 bg-sky-500/15 text-sky-300 shadow-sm'
                                : 'border-transparent bg-transparent text-slate-400 hover:bg-slate-800 hover:text-slate-200'
                            }`}
                    >
                        <span className={`h-2.5 w-2.5 rounded-full ${indicatorColors[index % indicatorColors.length]}`} />
                        <span className="truncate">{student.name || 'Student'}</span>
                    </button>
                ))}
            </div>

            <div className="border border-red-700/30 bg-gradient-to-r from-red-900/25 to-red-800/10 px-4 py-4 shadow-sm sm:px-6 sm:py-5">
                <div className="flex items-start justify-between gap-4">
                    <div className="flex min-w-0 items-start gap-3">
                        <div className="flex-shrink-0 bg-red-600/20 p-2 text-red-400">
                            <i className="fas fa-exclamation-triangle text-lg" aria-hidden="true" />
                        </div>
                        <h3 className="text-lg font-bold text-white">Grand Total Due</h3>
                    </div>
                    <div className="text-right text-3xl font-extrabold leading-none tabular-nums text-white">
                        ₹{getGrandTotal(students)}
                    </div>
                </div>
                <div className="mt-3 flex items-center justify-between border-t border-red-700/20 pt-3 text-sm text-gray-300">
                    <span><i className="fas fa-users mr-2 text-gray-400" />Students: <strong className="text-white">{students.length}</strong></span>
                    <span><i className="fas fa-calendar-times mr-2 text-gray-400" />Pending Months: <strong className="text-white">{pendingMonths}</strong></span>
                </div>
            </div>

            <div className="mt-4 rounded-2xl bg-gradient-to-r from-gray-800 to-gray-700 p-4 m-4">
                <div className="flex items-start justify-between gap-4">
                    <div className="min-w-0">
                        <h3 className="text-lg font-bold text-white">{currentStudentData?.name || 'Student'}</h3>
                        <div className="mt-2 flex flex-wrap gap-2">
                            <span className="rounded-lg bg-blue-500/20 px-2 py-1 text-sm text-blue-300">Class: {currentStudentData?.class || '-'}</span>
                            <span className="rounded-lg bg-purple-500/20 px-2 py-1 text-sm text-purple-300">Roll No: {currentStudentData?.rollNo || currentStudentData?.roll_no || '-'}</span>
                            <span className="rounded-lg bg-red-500/20 px-2 py-1 text-sm text-red-300"><i className="fas fa-clock mr-1" />Due: ₹{getStudentTotal(currentStudentData)}</span>
                        </div>
                    </div>
                    <img
                        src={currentStudentData?.image || currentStudentData?.photo || 'https://static.vecteezy.com/system/resources/previews/036/594/092/large_2x/man-empty-avatar-photo-placeholder-for-social-networks-resumes-forums-and-dating-sites-male-and-female-no-photo-images-for-unfilled-user-profile-free-vector.jpg'}
                        alt="Student"
                        className="h-16 w-16 shrink-0 rounded-full border-2 border-blue-500 object-cover"
                    />
                </div>
            </div>
        </div>
    );
}
