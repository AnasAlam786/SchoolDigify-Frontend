import { useState } from 'react'
import {
  CalendarDays,
  MessageCircle,
  GraduationCap,
  Hash,
  Phone,
  CheckCircle2,
  XCircle,
  Clock,
  Loader2
} from 'lucide-react';

function StudentCard({ student, selectedDate, MarkAttendance, onOpenCalendar }) {
  const [loadingStatus, setLoadingStatus] = useState(null)

  const attendanceStatus = student.attendance_status

  const presentSelected = attendanceStatus === 'PRESENT' ? 'selected' : ''
  const absentSelected = attendanceStatus === 'ABSENT' ? 'selected' : ''
  const halfDaySelected = attendanceStatus === 'HALF_DAY' ? 'selected' : ''

  const studentImageUrl = student.IMAGE
    ? `https://lh3.googleusercontent.com/d/${student.IMAGE}=s200`
    : 'https://via.placeholder.com/64'

  const handleMarkAttendance = async (studentID, newStatus) => {
    setLoadingStatus(newStatus)

    try {
      // TOGGLE LOGIC (CLICK SAME = REMOVE)
      const finalStatus =
        attendanceStatus === newStatus ? null : newStatus

      await MarkAttendance(studentID, finalStatus)

    } catch (err) {
      console.error('Error marking attendance:', err)
    } finally {
      setLoadingStatus(null)
    }
  }

  const isLoading = (status) => loadingStatus === status

  return (
    <div className="bg-[#1C1C1C] rounded-2xl p-5 border border-[#2A2A2A] shadow-xl 
        hover:shadow-2xl hover:border-[#3A3A3A] transition-all duration-300">

      {/* HEADER */}
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-4">
          <img loading="lazy"
            src={studentImageUrl}
            className="w-16 h-16 rounded-xl object-cover shadow-md"
            alt={student.STUDENTS_NAME}
          />
          <div>
            <h3 className="text-lg font-semibold text-white leading-tight">
              {student.STUDENTS_NAME}
            </h3>
            <p className="text-xs text-gray-400 mt-1 leading-tight">
              C/O {student.FATHERS_NAME}
            </p>
          </div>
        </div>

        <div className="flex gap-2">
          {/* Calendar Button */}
          <button type="button"
            onClick={() => onOpenCalendar(student)}
            className="w-10 h-10 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl
            flex items-center justify-center shadow-lg transition-colors duration-200">
            <CalendarDays className="w-5 h-5" strokeWidth={2} />
          </button>

          {/* WhatsApp / Message Button */}
          <button type="button"
            className="student-message-btn w-10 h-10 bg-green-600/90 hover:bg-green-500 
            text-white rounded-xl flex items-center justify-center shadow-lg transition-colors duration-200">
            <MessageCircle className="w-5 h-5 fill-white/10" strokeWidth={2} />
          </button>
        </div>
      </div>

      {/* DETAILS */}
      <div className="flex flex-wrap gap-2 mb-6 text-sm">
        {/* Class Badge */}
        <span className="flex items-center gap-2 bg-[#2A2A2A] text-gray-200 px-3 py-1.5 rounded-lg border border-white/5">
          <GraduationCap className="w-4 h-4 text-gray-400" strokeWidth={2} />
          {student.CLASS}
        </span>

        {/* Roll Badge */}
        <span className="flex items-center gap-1.5 bg-[#2A2A2A] text-gray-200 px-3 py-1.5 rounded-lg border border-white/5">
          <Hash className="w-4 h-4 text-gray-400" strokeWidth={2} />
          {student.ROLL}
        </span>

        {/* Phone Badge */}
        <a href="tel:7248151871"
          className="flex items-center gap-2 bg-[#2A2A2A] px-3 py-1.5 rounded-lg border border-white/5 hover:bg-[#333] transition-colors">
          <Phone className="w-4 h-4 text-blue-400" strokeWidth={2} />
          <span className="text-white text-sm font-semibold tracking-wide">7248151871</span>
        </a>
      </div>

      {/* BUTTONS */}
      <div className="pt-5 border-t border-[#333]">
        <div className="grid grid-cols-3 gap-3">

          {/* PRESENT */}
          <button
            disabled={isLoading('PRESENT')}
            onClick={() => handleMarkAttendance(student.student_session_id, 'PRESENT')}
            className={`attendance-option present-option ${presentSelected}
              border text-green-500 py-3 rounded-xl flex flex-col items-center gap-1.5 transition-all duration-200
              ${presentSelected
                ? 'bg-green-500/20 border-green-500 shadow-[0_0_15px_rgba(34,197,94,0.15)]'
                : 'bg-green-500/5 border-green-500/30 hover:bg-green-500/10 hover:border-green-500/50'
              }`}
          >
            {isLoading('PRESENT') ? (
              <Loader2 className="w-6 h-6 animate-spin" strokeWidth={2.5} />
            ) : (
              <CheckCircle2 className="w-6 h-6" strokeWidth={2.5} />
            )}
            <span className="text-xs font-semibold tracking-wide uppercase">
              {isLoading('PRESENT') ? 'Marking...' : 'Present'}
            </span>
          </button>

          {/* ABSENT */}
          <button
            disabled={isLoading('ABSENT')}
            onClick={() => handleMarkAttendance(student.student_session_id, 'ABSENT')}
            className={`attendance-option absent-option ${absentSelected}
              border text-red-400 py-3 rounded-xl flex flex-col items-center gap-1.5 transition-all duration-200
              ${absentSelected
                ? 'bg-red-500/20 border-red-500 shadow-[0_0_15px_rgba(239,68,68,0.15)]'
                : 'bg-red-500/5 border-red-500/30 hover:bg-red-500/10 hover:border-red-500/50'
              }`}
          >
            {isLoading('ABSENT') ? (
              <Loader2 className="w-6 h-6 animate-spin" strokeWidth={2.5} />
            ) : (
              <XCircle className="w-6 h-6" strokeWidth={2.5} />
            )}
            <span className="text-xs font-semibold tracking-wide uppercase">
              {isLoading('ABSENT') ? 'Marking...' : 'Absent'}
            </span>
          </button>

          {/* HALF DAY */}
          <button
            disabled={isLoading('HALF_DAY')}
            onClick={() => handleMarkAttendance(student.student_session_id, 'HALF_DAY')}
            className={`attendance-option halfDay-option ${halfDaySelected}
              border text-yellow-400 py-3 rounded-xl flex flex-col items-center gap-1.5 transition-all duration-200
              ${halfDaySelected
                ? 'bg-yellow-400/20 border-yellow-400 shadow-[0_0_15px_rgba(250,204,21,0.15)]'
                : 'bg-yellow-400/5 border-yellow-400/30 hover:bg-yellow-400/10 hover:border-yellow-400/50'
              }`}
          >
            {isLoading('HALF_DAY') ? (
              <Loader2 className="w-6 h-6 animate-spin" strokeWidth={2.5} />
            ) : (
              <Clock className="w-6 h-6" strokeWidth={2.5} />
            )}
            <span className="text-xs font-semibold tracking-wide uppercase">
              {isLoading('HALF_DAY') ? 'Marking...' : 'Half Day'}
            </span>
          </button>

        </div>
      </div>
    </div>
  );
}

export default StudentCard