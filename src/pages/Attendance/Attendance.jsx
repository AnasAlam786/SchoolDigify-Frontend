import { useState, useCallback, useEffect } from 'react'
import { apiGet, apiPost } from '../../api/api'
import { fetchClasses } from '../utils/fetchClasses'

import Header from './components/Header'
import ControlPannel from './components/ControlPannel'
import AttendanceSummary from './components/AttendanceSummary'
import StudentCard from './components/StudentCard'
import AttendanceCalendar from './Modals/AttendanceCalendar'
import MarkHoliday from './Modals/MarkHoliday'
import ViewHoliday from './Modals/ViewHoliday'
import AbsentStudentsList from './Modals/AbsentStudentsList'

import { InitialState, SkeletonLoader, HolidayState } from './components/PageStatus'
import { ErrorState, NoStudentsState } from "../utils/GlobalPageStatus"
import "./style/Attendance.css"
import usePermission from '../../hooks/usePermission'

function Attendance() {
  const { hasPermission, PERMISSIONS } = usePermission()

  const [classes, setClasses] = useState([])
  const [studentsData, setStudentsData] = useState(null)
  const [selectedClass, setSelectedClass] = useState('')
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0])

  const [loadingStudentsData, setLoadingStudentsData] = useState(false)
  const [studentDataError, setStudentDataError] = useState(null)

  const [summary, setSummary] = useState({ total: 0, present: 0, absent: 0, half_day: 0, not_marked: 0, })

  const [holiday, setHoliday] = useState(null)

  const [showMarkHolidayModal, setShowMarkHolidayModal] = useState(false)
  const [showViewHolidayModal, setShowViewHolidayModal] = useState(false)
  const [showCalendarModal, setShowCalendarModal] = useState(false)
  const [showAbsenteesModal, setAbsenteesModal] = useState(false)

  const [selectedStudent, setSelectedStudent] = useState(null)

  // ---------------- LOAD CLASSES ----------------



  useEffect(() => {
    const loadClasses = async () => {
      const classData = await fetchClasses();
      setClasses(classData);
    }
    loadClasses()
  }, [])

  // ---------------- FETCH ATTENDANCE ----------------
  const fetchAttendance = useCallback(async (classId, date) => {
    if (!classId || !date) {
      setStudentDataError('Select a class and date')
      return
    }

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
        setSummary({
          total: 0,
          present: 0,
          absent: 0,
          half_day: 0,
          not_marked: 0,
        })
        setLoadingStudentsData(false)
        return
      }

      if (response.ok) {
        // setStudentDataError("There is no students" || 'Failed to fetch attendance')
        setStudentsData(data.attendance_data || [])
        setSummary(data.attendance_summary || summary)
      } else {
        setStudentDataError(data.message || 'Failed to fetch attendance')
        showAlert(500, data.message || 'Failed to fetch attendance')
      }
    } catch (err) {
      console.error(err)
      setStudentDataError('Network error')
    } finally {
      setLoadingStudentsData(false)
    }
  }, [])

  // ---------------- MARK ATTENDANCE ----------------
  const MarkAttendance = useCallback(async (studentID, status) => {
    try {
      const response = await apiPost('/api/mark_attendance', {
        student_session_id: studentID,
        status: status ?? null,
        date: selectedDate,
      })

      const data = await response.json()

      if (!response.ok) {
        setStudentDataError(data.message || 'Failed to mark attendance')
        showAlert(500, data.message || 'Failed to mark attendance')
        return
      }

      setStudentsData(prev => {
        const updated = prev.map(s =>
          s.student_session_id === studentID
            ? { ...s, attendance_status: status || "" }
            : s
        )

        // recompute summary from updated state
        const totals = {
          total: updated.length,
          present: 0, absent: 0, half_day: 0, not_marked: 0,
        }

        updated.forEach(s => {
          const st = (s.attendance_status || '').toUpperCase()

          if (st === 'PRESENT') totals.present++
          else if (st === 'ABSENT') totals.absent++
          else if (st === 'HALF_DAY') totals.half_day++
          else totals.not_marked++
        })

        setSummary(totals)
        return [...updated]
      })
    } catch (err) {
      console.error(err)
      setStudentDataError('Network error')
    }
  }, [selectedDate])

  const handleOpenCalendar = useCallback(student => {
    setSelectedStudent(student)
    setShowCalendarModal(true)
  }, [])

  let mainPageState;

  if (loadingStudentsData) {
    mainPageState = <SkeletonLoader />
  } else if (studentDataError) {
    mainPageState = <ErrorState message={studentDataError} onRetry={() => fetchAttendance(selectedClass, selectedDate)} />
  } else if (holiday) {
    mainPageState = (<HolidayState holidayDetails={holiday} setShowViewHolidayModal={setShowViewHolidayModal} />)
  } else if (studentsData === null) {
    mainPageState = <InitialState />
  } else if (studentsData.length === 0) {
    mainPageState = (<NoStudentsState />)
  } else {
    mainPageState = (
      <>
        <AttendanceSummary summary={summary} date={selectedDate} setAbsenteesModal={setAbsenteesModal} />

        <section className="mb-10">
          <div className="grid gap-4 justify-center [grid-template-columns:repeat(auto-fit,minmax(0,420px))] max-[480px]:grid-cols-1">
            {studentsData.map(student => (
              <StudentCard
                key={student.student_session_id}
                student={student}
                selectedDate={selectedDate}
                MarkAttendance={MarkAttendance}
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
        onClassChange={setSelectedClass}
        onDateChange={setSelectedDate}
        onGetAttendance={() => fetchAttendance(selectedClass, selectedDate)}
        loadingStudentsData={loadingStudentsData}
      />


      {mainPageState}


      {hasPermission(PERMISSIONS.MARK_HOLIDAY) && showMarkHolidayModal && (
        <MarkHoliday
          classes={classes}
          onClose={() => setShowMarkHolidayModal(false)}
        />
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

      {showAbsenteesModal && (
        <AbsentStudentsList
          classID={selectedClass}
          date={selectedDate}
          onClose={() => setAbsenteesModal(false)}
        />
      )}
    </div>
  )
}

export default Attendance