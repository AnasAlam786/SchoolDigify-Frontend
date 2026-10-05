import { useState, useCallback } from 'react'
import { apiGet, apiPost } from '../../../api/api'

import Header from './components/Header'
import ControlPannel from './components/ControlPannel'
import AttendanceSummary from './components/AttendanceSummary'
import StudentCard from './components/StudentCard'
import AttendanceCalendar from './Modals/AttendanceCalendar'
import MarkHoliday from './Modals/MarkHoliday'
import ViewHoliday from './Modals/ViewHoliday'
import StudentAttendanceList from './Modals/StudentAttendanceList'

import { InitialState, SkeletonLoader, HolidayState } from './components/PageStatus'
import { ErrorState, NoStudentsState } from '../../utils/GlobalPageStatus'
import './style/Attendance.css'
import usePermission from '../../../hooks/usePermission'

function DailyAttendance({ classes, classesLoading }) {
  const { hasPermission, PERMISSIONS } = usePermission()
  const [studentsData, setStudentsData] = useState(null)
  const [selectedClass, setSelectedClass] = useState('')
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0])
  const [filterValidationErrors, setFilterValidationErrors] = useState({ class: false, date: false })
  const [loadingStudentsData, setLoadingStudentsData] = useState(false)
  const [studentDataError, setStudentDataError] = useState(null)
  const [summary, setSummary] = useState({ total: 0, present: 0, absent: 0, half_day: 0, not_marked: 0 })
  const [holiday, setHoliday] = useState(null)
  const [showMarkHolidayModal, setShowMarkHolidayModal] = useState(false)
  const [showViewHolidayModal, setShowViewHolidayModal] = useState(false)
  const [showCalendarModal, setShowCalendarModal] = useState(false)
  const [showStudentAttendanceModal, setShowStudentAttendanceModal] = useState(false)
  const [attendanceCategory, setAttendanceCategory] = useState('all')
  const [selectedStudent, setSelectedStudent] = useState(null)

  const fetchAttendance = useCallback(async (classId, date) => {
    if (!classId || !date) {
      setStudentDataError(null)
      setStudentsData(null)
      setFilterValidationErrors({ class: !classId, date: !date })
      return
    }

    setFilterValidationErrors({ class: false, date: false })
    setLoadingStudentsData(true)
    setStudentDataError(null)
    setHoliday(null)

    try {
      const query = new URLSearchParams({ classID: classId, date })
      const response = await apiGet(`/api/get_attendance_data?${query}`)
      const data = await response.json()

      if (data.holiday) {
        setHoliday(data)
        setStudentsData([])
        setSummary({ total: 0, present: 0, absent: 0, half_day: 0, not_marked: 0 })
      } else if (response.ok) {
        setStudentsData(data.attendance_data || [])
        setSummary(data.attendance_summary || summary)
      } else {
        setStudentDataError(data.message || 'Failed to fetch attendance')
        window.showAlert?.(500, data.message || 'Failed to fetch attendance')
      }
    } catch (error) {
      console.error(error)
      setStudentDataError('Network error')
    } finally {
      setLoadingStudentsData(false)
    }
  }, [summary])

  const markAttendance = useCallback(async (studentID, status) => {
    try {
      const response = await apiPost('/api/mark_attendance', {
        student_session_id: studentID,
        status: status ?? null,
        date: selectedDate,
      })
      const data = await response.json()

      if (!response.ok) {
        setStudentDataError(data.message || 'Failed to mark attendance')
        window.showAlert?.(500, data.message || 'Failed to mark attendance')
        return
      }

      setStudentsData(previous => {
        const updated = previous.map(student => student.student_session_id === studentID
          ? { ...student, attendance_status: status || '' }
          : student)
        const totals = { total: updated.length, present: 0, absent: 0, half_day: 0, not_marked: 0 }

        updated.forEach(student => {
          const statusValue = (student.attendance_status || '').toUpperCase()
          if (statusValue === 'PRESENT') totals.present++
          else if (statusValue === 'ABSENT') totals.absent++
          else if (statusValue === 'HALF_DAY') totals.half_day++
          else totals.not_marked++
        })

        setSummary(totals)
        return updated
      })
    } catch (error) {
      console.error(error)
      setStudentDataError('Network error')
    }
  }, [selectedDate])

  const handleOpenCalendar = useCallback(student => {
    setSelectedStudent(student)
    setShowCalendarModal(true)
  }, [])

  const selectedClassName = classes.find(classItem => String(classItem.id) === String(selectedClass))?.class_name || ''
  const handleOpenCategoryModal = useCallback((category = 'all') => {
    setAttendanceCategory(category)
    setShowStudentAttendanceModal(true)
  }, [])

  let mainPageState
  if (classesLoading || loadingStudentsData) {
    mainPageState = <SkeletonLoader />
  } else if (studentDataError) {
    mainPageState = <ErrorState message={studentDataError} onRetry={() => fetchAttendance(selectedClass, selectedDate)} />
  } else if (holiday) {
    mainPageState = <HolidayState holidayDetails={holiday} setShowViewHolidayModal={setShowViewHolidayModal} />
  } else if (studentsData === null) {
    mainPageState = <InitialState />
  } else if (studentsData.length === 0) {
    mainPageState = <NoStudentsState />
  } else {
    mainPageState = (
      <>
        <AttendanceSummary summary={summary} date={selectedDate} onOpenStudentList={handleOpenCategoryModal} />
        <section className="mb-10">
          <div className="grid gap-4 justify-center [grid-template-columns:repeat(auto-fit,minmax(0,420px))] max-[480px]:grid-cols-1">
            {studentsData.map(student => (
              <StudentCard
                key={student.student_session_id}
                student={student}
                selectedDate={selectedDate}
                MarkAttendance={markAttendance}
                onOpenCalendar={handleOpenCalendar}
              />
            ))}
          </div>
        </section>
      </>
    )
  }

  return (
    <div className="mx-auto">
      <Header
        onOpenMarkHolidayModal={() => setShowMarkHolidayModal(true)}
        onOpenViewHolidayModal={() => setShowViewHolidayModal(true)}
      />
      <ControlPannel
        classes={classes}
        selectedClass={selectedClass}
        selectedDate={selectedDate}
        filterValidationErrors={filterValidationErrors}
        onClassChange={value => {
          setSelectedClass(value)
          if (value) setFilterValidationErrors(current => ({ ...current, class: false }))
        }}
        onDateChange={value => {
          setSelectedDate(value)
          if (value) setFilterValidationErrors(current => ({ ...current, date: false }))
        }}
        onGetAttendance={() => fetchAttendance(selectedClass, selectedDate)}
        loadingStudentsData={loadingStudentsData || classesLoading}
      />
      {mainPageState}
      {hasPermission(PERMISSIONS.MARK_HOLIDAY) && showMarkHolidayModal && (
        <MarkHoliday classes={classes} onClose={() => setShowMarkHolidayModal(false)} />
      )}
      {hasPermission(PERMISSIONS.VIEW_HOLIDAYS) && showViewHolidayModal && (
        <ViewHoliday onClose={() => setShowViewHolidayModal(false)} />
      )}
      {showCalendarModal && selectedStudent && (
        <AttendanceCalendar
          student={selectedStudent}
          onClose={() => {
            setShowCalendarModal(false)
            setSelectedStudent(null)
          }}
        />
      )}
      {showStudentAttendanceModal && (
        <StudentAttendanceList
          className={selectedClassName}
          date={selectedDate}
          studentData={studentsData || []}
          summary={summary}
          category={attendanceCategory}
          onClose={() => {
            setShowStudentAttendanceModal(false)
            setAttendanceCategory('all')
          }}
        />
      )}
    </div>
  )
}

export default DailyAttendance