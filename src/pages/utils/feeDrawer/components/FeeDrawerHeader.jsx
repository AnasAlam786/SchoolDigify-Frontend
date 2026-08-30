import { MessageCircle } from 'lucide-react';
const indicatorColors = ['bg-blue-500', 'bg-green-500', 'bg-amber-500', 'bg-purple-500'];
import { feeDemandMessage } from '../../watsappMessages';
import { sendWhatsAppMessage } from '../../sendWhatsAppMessage';
import { useContext } from "react";
import { AuthContext } from '../../../../auth/authProvider';



export default function FeeDrawerHeader({
    students,
    currentStudentData,
}) {
    const { sessionData } = useContext(AuthContext);

    let pendingMonths = 0;
    for (const student of students) {
        pendingMonths += Number(student.total_due_terms || 0);
    }

    function getStudentDueAmount(student) {
        let total = 0;

        if (Array.isArray(student?.monthlyFees)) {
            for (const fee of student.monthlyFees) {
                if (fee.status.toLowerCase() !== 'paid') {
                    total += Number(fee.amount || 0);
                }
            }
        }
        if (Array.isArray(student?.otherFees)) {
            for (const fee of student.otherFees) {
                if (fee.status.toLowerCase() !== 'paid') {
                    total += Number(fee.amount || 0);
                }
            }
        }

        return total;
    }

    const grandTotalDueAmountOfAllStudents =
        students.reduce((sum, student) => sum + getStudentDueAmount(student), 0);


    async function handleWhatsAppReminder(students) {
        try {
            if (!Array.isArray(students) || students.length === 0) {
                throw new Error("No student fee data available");
            }

            const schoolName = sessionData.school_name || "School Administration"

            // Generate message from the fresh API data
            const message = feeDemandMessage(students, schoolName);

            // No outstanding fees / unable to generate message
            if (!message) {
                throw new Error("Unable to prepare the fee reminder message");
            }

            // Primary student's registered phone number
            const phone = students[0]?.phone;

            if (!phone) {
                throw new Error("Registered phone number not available");
            }

            await sendWhatsAppMessage(phone, message);

        } catch (err) {
            console.error("WhatsApp reminder error:", err);

            showAlert(
                500, err?.message || "Unable to send WhatsApp fee reminder"
            );
        }
    }


    return (
        <div className="flex-shrink-0 border-b border-gray-800 bg-gray-900">
            {/* Grand Total Due Card */}
            <div className="border border-red-700/30 bg-gradient-to-r from-red-900/25 to-red-800/10 px-4 py-4 shadow-sm sm:px-6 sm:py-5">
                <div className="flex items-start justify-between gap-4">
                    <div className="flex min-w-0 items-start gap-3">
                        <div className="flex-shrink-0 bg-red-600/20 p-2 text-red-400">
                            <i className="fas fa-exclamation-triangle text-lg" aria-hidden="true" />
                        </div>
                        <h3 className="text-lg font-bold text-white">Grand Total Due</h3>
                    </div>
                    <div className="text-right text-3xl font-extrabold leading-none tabular-nums text-white">
                        ₹{grandTotalDueAmountOfAllStudents}
                    </div>
                </div>
                <div className="mt-3 flex items-center justify-between border-t border-red-700/20 pt-3 text-sm text-gray-300">
                    <span><i className="fas fa-users mr-2 text-gray-400" />Students: <strong className="text-white">{students.length}</strong></span>
                    <span><i className="fas fa-calendar-times mr-2 text-gray-400" />Pending Months: <strong className="text-white">{pendingMonths}</strong></span>
                </div>
            </div>

            {/* Current Student Card */}
            <div className="relative mt-4 overflow-hidden rounded-2xl bg-gradient-to-r from-gray-800 to-gray-700 p-5 shadow-xl ring-1 ring-white/10 transition-all duration-300 hover:ring-white/20 m-4">
                {/* Subtle background glow effect */}
                <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-blue-500/10 blur-2xl pointer-events-none" />

                <div className="relative flex items-center justify-between gap-4">
                    <div className="min-w-0 flex-1">
                        <h3 className="text-xl font-bold tracking-tight text-white">{currentStudentData?.name || 'Student'}</h3>
                        <p className="mt-0.5 text-xs font-medium text-gray-400">
                            Father: <span className="text-gray-300">{currentStudentData?.fatherName || '-'}</span>
                        </p>

                        <div className="mt-3 flex flex-wrap items-center gap-2">
                            <span className="inline-flex items-center rounded-lg bg-blue-500/15 px-2.5 py-1 text-xs font-semibold tracking-wide text-blue-300 ring-1 ring-blue-500/30">
                                Class: {currentStudentData?.class || '-'}
                            </span>

                            <span className="inline-flex items-center rounded-lg bg-purple-500/15 px-2.5 py-1 text-xs font-semibold tracking-wide text-purple-300 ring-1 ring-purple-500/30">
                                Roll: {currentStudentData?.rollNo || currentStudentData?.roll_no || '-'}
                            </span>

                            <span className="inline-flex items-center rounded-lg bg-red-500/15 px-2.5 py-1 text-xs font-semibold tracking-wide text-red-300 ring-1 ring-red-500/30">
                                <i className="fas fa-clock mr-1.5 opacity-80" />Due: ₹{getStudentDueAmount(currentStudentData)}
                            </span>

                            <button
                                type="button"
                                onClick={() => handleWhatsAppReminder(students)}
                                title="Send fee reminder on WhatsApp"
                                aria-label="Send fee reminder on WhatsApp"
                                className="group inline-flex items-center gap-1.5 rounded-xl border border-white/10 bg-gray-900/60 px-3 py-1.5 text-xs font-medium text-emerald-400 shadow-sm backdrop-blur-md transition-all duration-200 hover:border-emerald-500/50 hover:bg-emerald-500/15 hover:text-emerald-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 active:scale-95"
                            >
                                <MessageCircle className="h-4 w-4 transition-transform duration-200 group-hover:scale-110" strokeWidth={2.2} />
                                <span>Reminder</span>
                            </button>
                        </div>
                    </div>

                    <div className="relative shrink-0">
                        <img
                            src={currentStudentData?.image || currentStudentData?.photo || 'https://static.vecteezy.com/system/resources/previews/036/594/092/large_2x/man-empty-avatar-photo-placeholder-for-social-networks-resumes-forums-and-dating-sites-male-and-female-no-photo-images-for-unfilled-user-profile-free-vector.jpg'}
                            alt={currentStudentData?.name || 'Student Avatar'}
                            className="h-16 w-16 rounded-full object-cover shadow-md ring-2 ring-blue-500/80 transition-transform duration-300 hover:scale-105"
                        />
                        <div className="absolute bottom-0 right-0 h-3.5 w-3.5 rounded-full border-2 border-gray-800 bg-emerald-500" title="Active Status" />
                    </div>
                </div>
            </div>
        </div>
    );
}