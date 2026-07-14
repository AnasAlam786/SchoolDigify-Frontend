import React, { useState } from 'react'

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
            <p className="text-xs text-gray-400 leading-tight">
              C/O {student.FATHERS_NAME}
            </p>
          </div>
        </div>

        <div className="flex gap-2">
          <button type="button"
            onClick={() => onOpenCalendar(student)}
            className="w-10 h-10 bg-slate-800/90 hover:bg-slate-700 text-white rounded-xl
            flex items-center justify-center shadow-lg transition">
            <i className="fas fa-calendar-days"></i>
          </button>

          <button type="button"
            // onClick={() => onOpenCalendar(student)}
            className="student-message-btn w-10 h-10 bg-green-600/90 hover:bg-green-600 
            text-white rounded-xl flex items-center justify-center shadow-lg transition">
            <i className="fab fa-whatsapp"></i>
          </button>
        </div>
      </div>

      {/* DETAILS */}

      <div className="flex gap-2 mb-5 text-sm">
        <span className="bg-[#2A2A2A] px-3 py-1.5 rounded-lg">
          <i className="fas fa-chalkboard-teacher mr-2"></i>
          {student.CLASS}
        </span>
        <span className="bg-[#2A2A2A] px-3 py-1.5 rounded-lg">
          <i className="fas fa-hashtag"></i>
          {student.ROLL}
        </span>
        <a href="tel:7248151871" className="bg-[#2A2A2A] px-3 py-1.5 rounded-lg hover:bg-[#333]">
          <i className="fas fa-phone text-blue-400 mr-2"></i>
          <span className="text-white text-sm font-semibold">7248151871</span>
        </a>
      </div>

      {/* BUTTONS */}
      <div className="pt-4 border-t border-[#333]">
        <div className="grid grid-cols-3 gap-3">

          {/* PRESENT */}
          <button
            disabled={isLoading('PRESENT')}
            onClick={() =>
              handleMarkAttendance(student.student_session_id, 'PRESENT')
            }
            className={`attendance-option present-option ${presentSelected}
              border border-green-600 text-green-500 bg-green-500/10 hover:bg-green-500/20
              py-3 rounded-xl flex flex-col items-center gap-1 transition`} >

            {isLoading('PRESENT') ? (
              <i className="fas fa-spinner fa-spin text-lg"></i>
            ) : (
              <i className="fas fa-check-circle text-lg"></i>
            )}
            {isLoading('PRESENT') ? 'Marking...' : 'Present'}
          </button>

          {/* ABSENT */}
          <button
            disabled={isLoading('ABSENT')}
            onClick={() =>
              handleMarkAttendance(student.student_session_id, 'ABSENT')
            }
            className={`attendance-option absent-option ${absentSelected}
              border border-red-600 text-red-400 bg-red-500/10 hover:bg-red-500/20
              py-3 rounded-xl flex flex-col items-center gap-1 transition`} >
            <i className="fas  text-lg"></i>

            {isLoading('ABSENT') ? (
              <i className="fas fa-spinner fa-spin text-lg"></i>
            ) : (
              <i className="fas fa-times-circle text-lg"></i>
            )}
            {isLoading('ABSENT') ? 'Marking...' : 'Absent'}
          </button>

          {/* HALF */}
          <button
            disabled={isLoading('HALF_DAY')}
            onClick={() =>
              handleMarkAttendance(student.student_session_id, 'HALF_DAY')
            }
            className={`attendance-option halfDay-option ${halfDaySelected}
              border border-yellow-500 text-yellow-400 bg-yellow-400/10 hover:bg-yellow-400/20
              py-3 rounded-xl flex flex-col items-center gap-1 transition`}>
            {isLoading('HALF_DAY') ? (
              <i className="fas fa-spinner fa-spin text-lg"></i>
            ) : (
              <i className="fas fa-clock text-lg"></i>
            )}
            {isLoading('HALF_DAY') ? 'Marking...' : 'Half Day'}
          </button>

        </div>
      </div>
    </div>
  )
}

export default StudentCard