import React, { useState, useEffect, useRef } from 'react'

const STATUS_LOOKUP = {
  PRESENT: 'Present',
  ABSENT: 'Absent',
  HALF_DAY: 'Half Day',
  UNMARKED: 'Unmarked',
}

const CATEGORY_META = {
  all: {
    title: 'All Students',
    empty: 'No students found for this class and date.',
  },
  present: {
    title: 'Present Students',
    empty: 'No present students for this date.',
  },
  absent: {
    title: 'Absent Students',
    empty: 'No absent students for this date.',
  },
  half_day: {
    title: 'Half-Day Students',
    empty: 'No half-day students for this date.',
  },
  unmarked: {
    title: 'Unmarked Students',
    empty: 'No unmarked students for this date.',
  },
}

function normalizeStatus(status) {
  const raw = String(status || '').trim().toUpperCase()
  if (!raw) return 'UNMARKED'
  return raw
}

function filterStudents(studentData, category = 'all') {
  const students = Array.isArray(studentData) ? studentData : []

  if (category === 'all') return students

  return students.filter((student) => {
    const status = normalizeStatus(student?.attendance_status)

    if (category === 'present') return status === 'PRESENT'
    if (category === 'absent') return status === 'ABSENT'
    if (category === 'half_day') return status === 'HALF_DAY'
    if (category === 'unmarked') return status === 'UNMARKED'

    return true
  })
}

function tableFromStudents(students, className, date) {
  let formatted = `📋 Students Attendance List\n\n`
  formatted += `🏫 Class: ${className || 'Unknown Class'}\n`
  formatted += `📅 Date: ${date || 'Not selected'}\n`
  formatted += `┌────────┬─────────────────┬──────────────┐\n`
  formatted += `│  Roll  │  Student Name   │   Status     │\n`
  formatted += `├────────┼─────────────────┼──────────────┤\n`

  students.forEach((student) => {
    const rollContent = String(student?.ROLL || '-')
      .substring(0, 6)
      .padEnd(6)
    const nameContent = String(student?.STUDENTS_NAME || 'Unknown Student')
      .substring(0, 15)
      .padEnd(15)
    const statusContent = String(STATUS_LOOKUP[normalizeStatus(student?.attendance_status)] || 'Unmarked')
      .substring(0, 12)
      .padEnd(12)

    formatted += `│ ${rollContent} │ ${nameContent} │ ${statusContent} │\n`
  })

  formatted += `└────────┴─────────────────┴──────────────┘`
  return formatted
}

function listFromStudents(students, className, date) {
  let formatted = `🏫 Attendance Report for ${className || 'Unknown Class'}\n`
  formatted += `📅 Date: ${date || 'Not selected'}\n\n`

  if (!students || students.length === 0) {
    formatted += `✅ All students present\n`
  } else {
    students.forEach((student) => {
      const status = normalizeStatus(student?.attendance_status)
      if (status === 'UNMARKED') {
        formatted += `⏱ [Unmarked] ${student?.STUDENTS_NAME || 'Unknown Student'} (Roll: ${student?.ROLL || '-'})\n`
      } else if (status === 'HALF_DAY') {
        formatted += `⏱ [Half Day] ${student?.STUDENTS_NAME || 'Unknown Student'} (Roll: ${student?.ROLL || '-'})\n`
      } else {
        formatted += `${student?.STUDENTS_NAME || 'Unknown Student'} (Roll: ${student?.ROLL || '-'}) - ${STATUS_LOOKUP[status] || 'Unmarked'}\n`
      }
    })
  }

  return formatted
}

function compactFromStudents(students, className, date) {
  let formatted = `📅 ${className || 'Unknown Class'} - ${date || 'Not selected'}\n\n`

  if (!students || students.length === 0) {
    formatted += `✅ All students present`
  } else {
    formatted += students
      .map((student) => {
        const status = normalizeStatus(student?.attendance_status)
        const name = student?.STUDENTS_NAME || 'Unknown Student'
        const roll = student?.ROLL || '-'

        if (status === 'UNMARKED') return `• ⏱ ${name} #${roll}`
        if (status === 'HALF_DAY') return `• ⏱ ${name} #${roll} [Half Day]`
        return `• ${name} #${roll} [${STATUS_LOOKUP[status] || 'Unmarked'}]`
      })
      .join('\n')
  }

  return formatted
}

function getEmptyText(category, className, date) {
  if (category === 'all') {
    return `No students found for this class and date.\n\n🏫 ${className || 'Unknown Class'}\n📅 ${date || 'Not selected'}`
  }

  return `${CATEGORY_META[category]?.empty || 'No students found for this class and date.'}\n\n🏫 ${className || 'Unknown Class'}\n📅 ${date || 'Not selected'}`
}

function generateTextContent(studentData, category, className, date, format = 'table') {
  const students = filterStudents(studentData, category)

  if (!students.length) {
    return getEmptyText(category, className, date)
  }

  if (format === 'list') return listFromStudents(students, className, date)
  if (format === 'compact') return compactFromStudents(students, className, date)

  return tableFromStudents(students, className, date)
}

function StudentAttendanceList({ className, date, studentData, summary, category = 'all', onClose }) {
  const [currentFormat, setCurrentFormat] = useState('table')
  const [textContent, setTextContent] = useState('')
  const textareaRef = useRef(null)

  useEffect(() => {
    setTextContent(generateTextContent(studentData, category, className, date, currentFormat))
  }, [studentData, category, className, date, currentFormat])

  const handleClose = () => {
    onClose?.()
  }

  const handleClear = () => {
    if (window.confirm('Clear the list?')) {
      setTextContent('')
    }
  }

  const handleToggleFormat = () => {
    const formats = ['table', 'list', 'compact']
    const nextFormat = formats[(formats.indexOf(currentFormat) + 1) % formats.length]
    setCurrentFormat(nextFormat)
  }

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(textContent)
      const copyBtn = document.getElementById('copyAbsentListBtn')
      if (copyBtn) {
        const originalHTML = copyBtn.innerHTML
        copyBtn.innerHTML = '<i className="fas fa-check mr-2"></i>Copied'
        copyBtn.classList.add('bg-green-500')
        setTimeout(() => {
          copyBtn.innerHTML = originalHTML
          copyBtn.classList.remove('bg-green-500')
        }, 1500)
      }
    } catch (err) {
      console.error('Failed to copy:', err)
      alert('Failed to copy to clipboard')
    }
  }

  const handleRefresh = () => {
    setTextContent(generateTextContent(studentData, category, className, date, currentFormat))
  }

  const title = CATEGORY_META[category]?.title || 'All Students'
  const formatButtonLabel = {
    table: 'Table',
    list: 'List',
    compact: 'Compact',
  }[currentFormat]
  const formatIcon = {
    table: 'fa-table',
    list: 'fa-list',
    compact: 'fa-compress-alt',
  }[currentFormat]

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={(e) => {
        if (e.target === e.currentTarget) handleClose()
      }}
    >
      <div className="absolute inset-0 bg-black/70"></div>

      <div className="relative bg-[#1A1A1A] rounded-2xl w-full max-w-4xl shadow-2xl border border-[#2A2A2A] flex flex-col max-h-[90vh] overflow-hidden">
        <div className="p-5 border-b border-[#2A2A2A] flex justify-between items-center">
          <div>
            <h3 className="text-lg font-semibold text-white">{title}</h3>
            <p className="text-sm text-gray-400 mt-1" id="absentListDate">
              Date: {date || 'Loading...'}
            </p>
          </div>
          <button onClick={handleClose} className="text-gray-400 hover:text-white transition">
            <i className="fas fa-times text-xl"></i>
          </button>
        </div>

        <div className="flex-1 overflow-hidden flex flex-col">
          <div className="flex-1 overflow-hidden p-5">
            <div className="flex items-center justify-between mb-3">
              <label className="block text-sm font-medium text-gray-300">
                Premium Absent Report
              </label>
              <div className="flex items-center gap-2">
                <button
                  onClick={handleToggleFormat}
                  className="px-3 py-1.5 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white rounded-lg text-sm transition-all duration-300 shadow-lg shadow-purple-500/20 hover:shadow-purple-500/30 flex items-center"
                >
                  <i className={`fas ${formatIcon} mr-1`}></i>
                  {formatButtonLabel}
                </button>
                <button
                  onClick={handleClear}
                  className="px-3 py-1.5 bg-gradient-to-r from-gray-700 to-gray-600 hover:from-gray-600 hover:to-gray-500 text-white rounded-lg text-sm transition-all duration-300 shadow-lg shadow-gray-700/20 hover:shadow-gray-700/30 flex items-center"
                >
                  <i className="fas fa-eraser mr-1"></i>
                  Clear
                </button>
              </div>
            </div>

            <textarea
              ref={textareaRef}
              id="absentStudentsTextArea"
              className="w-full h-full min-h-[300px] bg-[#2A2A2A] border border-[#3A3A3A] text-white rounded-xl p-4 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all resize-none overflow-y-auto font-mono text-sm"
              value={textContent}
              readOnly
              placeholder="Loading absent students list..."
            />
          </div>
        </div>

        <div className="p-5 border-t border-[#2A2A2A] flex flex-col sm:flex-row gap-3">
          <button
            id="copyAbsentListBtn"
            onClick={handleCopy}
            className="flex-1 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-medium py-3.5 px-4 rounded-xl transition shadow-lg flex items-center justify-center gap-2"
          >
            <i className="far fa-copy"></i>
            <span>Copy to Clipboard</span>
          </button>
          <button
            id="refreshAbsentListBtn"
            onClick={handleRefresh}
            className="flex-1 bg-white/5 hover:bg-white/10 text-white font-medium py-3.5 px-4 rounded-xl transition flex items-center justify-center gap-2 disabled:opacity-50"
          >
            <i className="fas fa-sync-alt"></i>
            <span>Refresh List</span>
          </button>
        </div>
      </div>
    </div>
  )
}

export default StudentAttendanceList
