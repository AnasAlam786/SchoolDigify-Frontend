import React from 'react'

function SkeletonLoader() {
    return (
        <div className="grid gap-4 justify-center [grid-template-columns:repeat(auto-fit,minmax(0,420px))] max-[480px]:grid-cols-1">
            {[...Array(6)].map((_, i) => (
                <div
                    key={i}
                    className="bg-[#1C1C1C] rounded-2xl p-5 border border-[#2A2A2A] shadow-xl animate-pulse"
                >
                    <div className="flex items-center justify-between mb-5">
                        <div className="flex items-center gap-4">
                            <div className="w-16 h-16 rounded-xl bg-[#2A2A2A]"></div>
                            <div className="space-y-2">
                                <div className="w-32 h-4 bg-[#2A2A2A] rounded"></div>
                                <div className="w-24 h-3 bg-[#2A2A2A] rounded"></div>
                            </div>
                        </div>
                    </div>
                    <div className="flex gap-2 mb-5">
                        <div className="w-20 h-6 bg-[#2A2A2A] rounded-lg"></div>
                        <div className="w-20 h-6 bg-[#2A2A2A] rounded-lg"></div>
                    </div>
                    <div className="pt-4 border-t border-[#333]">
                        <div className="grid grid-cols-3 gap-3">
                            <div className="w-full h-16 bg-[#2A2A2A] rounded-xl"></div>
                            <div className="w-full h-16 bg-[#2A2A2A] rounded-xl"></div>
                            <div className="w-full h-16 bg-[#2A2A2A] rounded-xl"></div>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    )
}

function HolidayState({ holidayDetails, setShowViewHolidayModal }) {
    if (!holidayDetails) return null
    console.log(holidayDetails)
    return (

        <div id="attendanceAlertContainer" className="mb-6">
            <div className="bg-gradient-to-r from-yellow-500/10 via-red-600/10 to-indigo-600/8 border border-white/5 rounded-2xl p-4 md:p-6 flex flex-col md:flex-row items-start md:items-center gap-4 shadow-lg">
                <div className="flex-shrink-0">
                    <div className="w-12 h-12 rounded-lg bg-red-600/10 flex items-center justify-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                        </svg>
                    </div>
                </div>

                <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                            <div className="text-white font-semibold text-lg">{holidayDetails.message}</div>
                            <div className="text-sm text-gray-300 mt-1">
                                <div className="mt-3 text-sm text-gray-400 leading-relaxed">
                                    {holidayDetails.info}
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="mt-4 flex flex-wrap gap-3">
                        <button onClick={() => setShowViewHolidayModal(true)}
                            className="px-4 py-2 bg-white/5 hover:bg-white/10 text-white rounded-xl text-sm font-medium
                            transition">View Holidays</button>
                    </div>
                </div>
            </div>
        </div>

    )
}



function InitialState() {
    return (
        <div className="flex flex-col items-center justify-center py-20 px-6 text-center glass-card rounded-3xl border border-white/10 relative overflow-hidden">

            {/* Background Glow */}
            <div className="absolute -top-10 -right-10 w-40 h-40 bg-emerald-500/10 blur-3xl rounded-full"></div>
            <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-cyan-500/10 blur-3xl rounded-full"></div>

            {/* Icon */}
            <div className="relative z-10 w-24 h-24 rounded-3xl bg-gradient-to-br from-emerald-500/20 to-cyan-500/20 border border-white/10 flex items-center justify-center mb-6">
                <i className="fas fa-user-check text-4xl text-emerald-300"></i>
            </div>

            {/* Badge */}
            <span className="mb-4 px-4 py-1 rounded-full bg-emerald-500/10 text-emerald-300 text-sm border border-emerald-500/20">
                Attendance Management
            </span>

            {/* Title */}
            <h2 className="text-3xl font-bold text-white mb-3">
                Mark Student Attendance
            </h2>

            {/* Description */}
            <p className="max-w-lg text-gray-400 leading-relaxed">
                Select the class, section, and attendance date to load students.
                Once loaded, you can quickly mark students as
                <span className="text-green-400"> Present</span>,
                <span className="text-red-400"> Absent</span>, or
                <span className="text-yellow-400"> Leave</span>.
            </p>

            {/* Hint */}
            <div className="mt-8 flex items-center gap-2 text-sm text-gray-500">
                <i className="fas fa-arrow-up"></i>
                <span>Choose filters above to begin</span>
            </div>

        </div>
    )
}


export { InitialState, SkeletonLoader, HolidayState }