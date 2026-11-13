import { MessageCircle, BadgeCheck, CalendarClock, AlertCircle } from 'lucide-react';
import { feeDemandMessage } from '../../watsappMessages';
import { sendWhatsAppMessage } from '../../sendWhatsAppMessage';
import { useContext } from "react";
import { AuthContext } from '../../../../auth/authProvider';



export default function FeeDrawerHeader({
    students,
    currentStudentData,
    readOnly = false,
}) {

    const { sessionData } = useContext(AuthContext);

    let pendingMonths = 0;
    for (const student of students) {
        pendingMonths += Number(student.total_due_terms || 0);
    }

    function getStudentDueAmount(student) {
        if(student?.isRTE) {
            return 0;
        }else{
            return Number(student?.total_due_amount || 0);
        }
    }

    function getStudentPaidAmount(student) {
        if(student?.isRTE) {
            return "Paid via RTE";
        }else{
            return Number(student?.total_paid_amount || 0);
        }
    }

    function getStudentUpcomingAmount(student) {
        if(student?.isRTE) {
            return 0;
        }else{
            return Number(student?.total_upcoming_amount || 0);
        }
    }

    const summaryCards = [
        {
            label: 'Paid Amount',
            amount: getStudentPaidAmount(currentStudentData),
            icon: BadgeCheck,
            styles: 'border-emerald-500/25 bg-emerald-950/20 text-emerald-300',
        },
        {
            label: 'Due Amount',
            amount: getStudentDueAmount(currentStudentData),
            icon: AlertCircle,
            styles: 'border-rose-500/25 bg-rose-950/20 text-rose-300',
        },
        {
            label: 'Upcoming Amount',
            amount: getStudentUpcomingAmount(currentStudentData),
            icon: CalendarClock,
            styles: 'border-gray-500/25 bg-gray-800/40 text-gray-300',
        },
    ];

    const grandTotalDueAmountOfAllStudents =
        students.reduce((sum, student) => sum + getStudentDueAmount(student), 0);



    async function handleWhatsAppReminder(students) {
        try {
            if (!Array.isArray(students) || students.length === 0) {
                throw new Error("No student fee data available");
            }

            const schoolName = sessionData?.school_name || "School Administration"

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
                        <div>
                            <h3 className="text-lg font-bold text-white">Grand Total Due</h3>
                            <p className="mt-1 text-xs text-red-200/70">Combined due for all siblings</p>
                        </div>
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

            <div className="grid grid-cols-3 gap-2 px-4 pt-3 sm:gap-3 sm:px-6">
                {summaryCards.map((card) => {
                    const Icon = card.icon;

                    return (
                        <div
                            key={card.label}
                            className={`min-w-0 rounded-xl border px-2.5 py-3 sm:px-4 sm:py-3.5 ${card.styles}`}
                        >
                            <p className="truncate text-[9px] font-semibold uppercase tracking-wider opacity-75 sm:text-[10px]">
                                {card.label}
                            </p>

                            <div className="mt-2 flex items-center justify-between gap-1.5">
                                <p className="min-w-0 truncate text-sm font-bold tracking-tight tabular-nums sm:text-lg">
                                    ₹{Number(card.amount || 0).toLocaleString('en-IN')}
                                </p>

                                <Icon size={17} strokeWidth={2} className="shrink-0 opacity-80 sm:size-[19px]" />
                            </div>
                        </div>
                    );
                })}
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
                            {currentStudentData?.isRTE && (
                                <span className="bg-yellow-500 text-gray-900 text-[9px] font-bold px-1.5 py-[2px] rounded">
                                    RTE
                                </span>
                            )}
                            <span className="inline-flex items-center rounded-lg bg-blue-500/15 px-2.5 py-1 text-xs font-semibold tracking-wide text-blue-300 ring-1 ring-blue-500/30">
                                Class: {currentStudentData?.class || '-'}
                            </span>

                            <span className="inline-flex items-center rounded-lg bg-purple-500/15 px-2.5 py-1 text-xs font-semibold tracking-wide text-purple-300 ring-1 ring-purple-500/30">
                                Roll: {currentStudentData?.rollNo || currentStudentData?.roll_no || '-'}
                            </span>

                            <span className="inline-flex items-center rounded-lg bg-red-500/15 px-2.5 py-1 text-xs font-semibold tracking-wide text-red-300 ring-1 ring-red-500/30">
                                <i className="fas fa-clock mr-1.5 opacity-80" />Due: ₹{getStudentDueAmount(currentStudentData)}
                            </span>

                            {!readOnly && <button
                                type="button"
                                onClick={() => handleWhatsAppReminder(students)}
                                title="Send fee reminder on WhatsApp"
                                aria-label="Send fee reminder on WhatsApp"
                                className="group inline-flex items-center gap-1.5 rounded-xl border border-white/10 bg-gray-900/60 px-3 py-1.5 text-xs font-medium text-emerald-400 shadow-sm backdrop-blur-md transition-all duration-200 hover:border-emerald-500/50 hover:bg-emerald-500/15 hover:text-emerald-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 active:scale-95"
                            >
                                <MessageCircle className="h-4 w-4 transition-transform duration-200 group-hover:scale-110" strokeWidth={2.2} />
                                <span>Reminder</span>
                            </button>}
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