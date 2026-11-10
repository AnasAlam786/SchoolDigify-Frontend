import { useState } from 'react'
import {
  CalendarDays,
  MessageCircle,
  MessageSquareText,
  GraduationCap,
  Hash,
  Phone,
  CheckCircle2,
  XCircle,
  Clock,
  Loader2
} from 'lucide-react';
import { sendWhatsAppMessage, sendSmsMessage } from '../../../utils/sendWhatsAppMessage';

function StudentCard({ student, selectedDate, MarkAttendance, onOpenCalendar }) {
  const [loadingStatus, setLoadingStatus] = useState(null)

  const attendanceStatus = student.attendance_status
  const attendanceMarked = ['PRESENT', 'ABSENT', 'HALF_DAY'].includes(attendanceStatus)

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

  const handleSendAttendanceMessage = (channel) => {
    if (!attendanceMarked) return

    const formattedDate = new Date(`${selectedDate}T00:00:00`).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    })
    const messageDetails = {
      PRESENT: {
        icon: '✅',
        label: 'Present',
        update: `${student.STUDENTS_NAME} was present at school on ${formattedDate}.`,
        closing: 'Thank you for your support.',
      },
      ABSENT: {
        icon: '⚠️',
        label: 'Absent',
        update: `${student.STUDENTS_NAME} was marked absent from school on ${formattedDate}.`,
        closing: 'If you have already informed the school, please ignore this message. Otherwise, please contact the school.',
      },
      HALF_DAY: {
        icon: '⏰',
        label: 'Half Day',
        update: `${student.STUDENTS_NAME} attended school for half a day on ${formattedDate}.`,
        closing: 'Please contact the school if you have any questions.',
      },
    }[attendanceStatus]

    if (!messageDetails) return

    const message = [
      '📚 School Attendance Update',
      '',
      'Dear Parent/Guardian,',
      '',
      `👤 Student: ${student.STUDENTS_NAME}`,
      `📅 Date: ${formattedDate}`,
      `${messageDetails.icon} Status: ${messageDetails.label}`,
      '',
      messageDetails.update,
      '',
      messageDetails.closing,
      '',
      'Regards,',
      'School Administration',
    ].join('\n')

    try {
      const sendMessage = channel === 'whatsapp' ? sendWhatsAppMessage : sendSmsMessage
      sendMessage(student.PHONE, message)
    } catch (error) {
      console.error(`Error sending attendance message via ${channel}:`, error)
      window.showAlert?.(500, error.message || 'Unable to open the messaging app')
    }
  }

  return (
    <div className="flex h-full flex-col rounded-2xl border border-white/10 bg-sidebar p-5 shadow-xl
        transition-all duration-300 hover:-translate-y-0.5 hover:shadow-2xl">

      {/* HEADER */}
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-4">
          <img loading="lazy"
            src={studentImageUrl}
            className="w-16 h-16 rounded-xl object-cover shadow-md"
            alt={student.STUDENTS_NAME}
          />
          <div>
            <h3 className="text-lg font-semibold text-[rgb(var(--text-primary))] leading-tight">
              {student.STUDENTS_NAME}
            </h3>
            <p className="text-xs text-[rgb(var(--text-secondary))] mt-1 leading-tight">
              C/O {student.FATHERS_NAME}
            </p>
          </div>
        </div>

        <div className="flex gap-2">
          {/* Calendar Button */}
          <button type="button"
            onClick={() => onOpenCalendar(student)}
            aria-label={`View attendance calendar for ${student.STUDENTS_NAME}`}
            className="w-10 h-10 rounded-xl border border-white/10 bg-navbg text-[rgb(var(--text-secondary))]
            flex items-center justify-center transition-colors duration-200 hover:text-[rgb(var(--text-primary))]">
            <CalendarDays className="w-5 h-5" strokeWidth={2} />
          </button>
        </div>
      </div>

      {/* DETAILS */}
      <div className="flex flex-wrap gap-2 mb-6 text-sm">
        {/* Class Badge */}
        <span className="flex items-center gap-2 rounded-lg border border-white/10 bg-navbg px-3 py-1.5 text-[rgb(var(--text-primary))]">
          <GraduationCap className="w-4 h-4 text-[rgb(var(--text-secondary))]" strokeWidth={2} />
          {student.CLASS}
        </span>

        {/* Roll Badge */}
        <span className="flex items-center gap-1.5 rounded-lg border border-white/10 bg-navbg px-3 py-1.5 text-[rgb(var(--text-primary))]">
          <Hash className="w-4 h-4 text-[rgb(var(--text-secondary))]" strokeWidth={2} />
          {student.ROLL}
        </span>

        {/* Phone Badge */}
        {student.PHONE ? (
          <a href={`tel:${student.PHONE}`}
            className="flex items-center gap-2 rounded-lg border border-white/10 bg-navbg px-3 py-1.5 transition-colors hover:bg-[rgb(var(--surface-hover))]">
            <Phone className="w-4 h-4 text-blue-400" strokeWidth={2} />
            <span className="text-sm font-semibold tracking-wide text-[rgb(var(--text-primary))]">{student.PHONE}</span>
          </a>
        ) : (
          <span className="flex items-center gap-2 rounded-lg border border-white/10 bg-navbg px-3 py-1.5 text-[rgb(var(--text-secondary))]">
            <Phone className="w-4 h-4" strokeWidth={2} />
            <span className="text-sm">No phone number</span>
          </span>
        )}
      </div>

      {/* BUTTONS */}
      <div className="mt-auto border-t border-white/10 pt-5">
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
        <div className="mt-4 grid grid-cols-2 gap-3">
          <button
            type="button"
            disabled={!attendanceMarked}
            onClick={() => handleSendAttendanceMessage('whatsapp')}
            aria-label={`Send attendance by WhatsApp for ${student.STUDENTS_NAME}`}
            title={!attendanceMarked ? 'Mark attendance to enable messaging' : 'Send attendance by WhatsApp'}
            className="flex min-h-11 items-center justify-center gap-2 rounded-xl border border-green-500/25 bg-green-500/10 px-3 py-2.5 text-sm font-semibold text-green-500 transition-all hover:border-green-500/50 hover:bg-green-500/15 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-500/60 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:border-green-500/25 disabled:hover:bg-green-500/10"
          >
            <MessageCircle className="h-4 w-4 shrink-0" strokeWidth={2} />
            <span>WhatsApp</span>
          </button>
          <button
            type="button"
            disabled={!attendanceMarked}
            onClick={() => handleSendAttendanceMessage('sms')}
            aria-label={`Send attendance by SMS for ${student.STUDENTS_NAME}`}
            title={!attendanceMarked ? 'Mark attendance to enable messaging' : 'Send attendance by SMS'}
            className="flex min-h-11 items-center justify-center gap-2 rounded-xl border border-blue-500/25 bg-blue-500/10 px-3 py-2.5 text-sm font-semibold text-blue-500 transition-all hover:border-blue-500/50 hover:bg-blue-500/15 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/60 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:border-blue-500/25 disabled:hover:bg-blue-500/10"
          >
            <MessageSquareText className="h-4 w-4 shrink-0" strokeWidth={2} />
            <span>SMS</span>
          </button>
        </div>
      </div>
    </div>
  );
}

export default StudentCard