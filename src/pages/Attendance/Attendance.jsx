
import { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { CalendarDays, ClipboardCheck } from 'lucide-react'
import { fetchClasses } from '../utils/fetchClasses'
import DailyAttendance from './dailyAttendance/DailyAttendance'
import OverallAttendance from './overallAttendance/OverallAttendance'

function Attendance() {
    const [classes, setClasses] = useState([])
    const [classesLoading, setClassesLoading] = useState(true)
    const location = useLocation()
    const navigate = useNavigate()
    const isOverall = location.pathname === '/overall_attendance'

    useEffect(() => {
        let active = true

        fetchClasses().then(classData => {
            if (active) {
                setClasses(classData || [])
                setClassesLoading(false)
            }
        })

        return () => {
            active = false
        }
    }, [])

    return (
        <main className="mx-auto w-full max-w-7xl">
            {/* Attendance navigation */}
            <div className="mb-7 flex justify-center">
                <nav
                    aria-label="Attendance type"
                    className="
                        flex w-full max-w-[520px]
                        rounded-xl
                        border border-[#2A2A2A]
                        bg-[#1A1A1A]
                        p-1
                        shadow-lg shadow-black/20
                    "
                >
                    <button
                        type="button"
                        onClick={() => navigate('/attendance')}
                        aria-current={!isOverall ? 'page' : undefined}
                        className={`
              group
              flex min-w-0 flex-1 items-center justify-center
              gap-2
                            rounded-lg
                            px-3 py-3 sm:px-5
              text-sm font-semibold
              transition-all duration-200 ease-out
                            ${!isOverall ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-lg shadow-indigo-950/30' : 'text-gray-400 hover:bg-white/[0.06] hover:text-white'}
            `}
                    >
                        <ClipboardCheck
                            size={17}
                            strokeWidth={2}
                            className="shrink-0"
                        />

                        <span className="truncate">
                            Attendance
                        </span>
                    </button>

                    <button
                        type="button"
                        onClick={() => navigate('/overall_attendance')}
                        aria-current={isOverall ? 'page' : undefined}
                        className={`
              group
              flex min-w-0 flex-1 items-center justify-center
              gap-2
                            rounded-lg
                            px-3 py-3 sm:px-5
              text-sm font-semibold
              transition-all duration-200 ease-out
                            ${isOverall ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-lg shadow-indigo-950/30' : 'text-gray-400 hover:bg-white/[0.06] hover:text-white'}
            `}
                    >
                        <CalendarDays
                            size={17}
                            strokeWidth={2}
                            className="shrink-0"
                        />

                        <span className="truncate">
                            Overall Attendance
                        </span>
                    </button>
                </nav>
            </div>

            {isOverall ? (
                <OverallAttendance
                    classes={classes}
                    classesLoading={classesLoading}
                />
            ) : (
                <DailyAttendance
                    classes={classes}
                    classesLoading={classesLoading}
                />
            )}
        </main>
    )
}

export default Attendance
