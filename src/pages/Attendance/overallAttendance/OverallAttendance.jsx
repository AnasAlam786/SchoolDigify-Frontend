import { useRef, useState } from 'react'
import { apiGet, apiPost } from '../../../api/api'
import { ErrorState, NoStudentsState } from '../../utils/GlobalPageStatus'
import { InitialState, SkeletonLoader } from '../dailyAttendance/components/PageStatus'

function OverallAttendance({ classes, classesLoading }) {
  const [selectedClass, setSelectedClass] = useState('')
  const [students, setStudents] = useState(null)
  const [loading, setLoading] = useState(false)
  const [savingId, setSavingId] = useState(null)
  const [error, setError] = useState(null)
  const [notice, setNotice] = useState('')
  const [search, setSearch] = useState('')
  const inputs = useRef({})
  const loadRequestId = useRef(0)

  const loadStudents = async classId => {
    const requestId = ++loadRequestId.current
    setLoading(true)
    setError(null)
    setNotice('')
    setSearch('')
    setStudents(null)

    try {
      const query = new URLSearchParams({ classID: classId })
      const response = await apiGet(`/api/get_overall_attendance_data?${query}`)
      const data = await response.json()
      if (!response.ok) throw new Error(data.message || 'Could not load attendance.')
      if (!Array.isArray(data.students)) throw new Error(data.message || 'Could not load students for this class.')

      if (requestId === loadRequestId.current) {
        setStudents(data.students.map(student => ({
          ...student,
          total_present: student.total_present ?? '',
        })))
      }
    } catch (loadError) {
      if (requestId === loadRequestId.current) {
        setError(loadError.message || 'Error loading attendance. Check your connection.')
      }
    } finally {
      if (requestId === loadRequestId.current) setLoading(false)
    }
  }

  const handleClassChange = classId => {
    setSelectedClass(classId)
    if (classId) {
      loadStudents(classId)
    } else {
      loadRequestId.current += 1
      setStudents(null)
      setError(null)
      setNotice('')
      setLoading(false)
    }
  }

  const updatePresent = (studentId, value) => {
    setStudents(current => current.map(student => student.student_session_id === studentId
      ? { ...student, total_present: value }
      : student))
    setNotice('')
  }

  const getVisibleInput = studentId => inputs.current[studentId]
    ?.find(input => input.getClientRects().length > 0)

  const saveStudent = async (student, index) => {
    const value = String(student.total_present).trim()
    if (value && (!Number.isInteger(Number(value)) || Number(value) < 0)) {
      setError('Enter a whole number of present days greater than or equal to zero, or leave it blank.')
      getVisibleInput(student.student_session_id)?.focus()
      return
    }

    setSavingId(student.student_session_id)
    setError(null)
    setNotice('')
    try {
      const response = await apiPost('/api/update_overall_attendance', {
        student_session_id: student.student_session_id,
        total_present: value ? Number(value) : null,
      })
      const result = await response.json()
      if (!response.ok || result.message !== 'Overall attendance updated successfully') {
        throw new Error(result.message || 'Could not save attendance.')
      }

      setNotice(`Saved present days for ${student.student_name}.`)
      const nextStudent = students[index + 1]
      if (nextStudent) {
        requestAnimationFrame(() => {
          getVisibleInput(nextStudent.student_session_id)?.focus()
        })
      } else {
        setNotice('All students processed. Attendance is up to date.')
      }
    } catch (saveError) {
      setError(saveError.message || 'Error saving attendance.')
    } finally {
      setSavingId(null)
    }
  }

  const filteredStudents = (students || []).filter(student => {
    const term = search.trim().toLowerCase()
    return !term || [student.student_name, student.fathers_name, student.roll]
      .some(value => String(value ?? '').toLowerCase().includes(term))
  })
  const className = classes.find(classItem => String(classItem.id) === String(selectedClass))?.class_name

  const presentInput = (student, mobile = false) => (
    <input
      ref={element => {
        if (element) {
          inputs.current[student.student_session_id] ||= []
          const inputIndex = mobile ? 1 : 0
          inputs.current[student.student_session_id][inputIndex] = element
        }
      }}
      type="number"
      min="0"
      step="1"
      inputMode="numeric"
      value={student.total_present}
      onChange={event => updatePresent(student.student_session_id, event.target.value)}
      onKeyDown={event => {
        if (event.key === 'Enter') saveStudent(student, students.indexOf(student))
      }}
      aria-label={`Total present days for ${student.student_name}`}
      className="w-full rounded-lg border border-[#2A2A2A] bg-[#1A1A1A] px-3 py-2.5 text-center text-base font-semibold text-white outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 md:max-w-32"
    />
  )

  const saveButton = (student, index, compact = false) => (
    <button
      type="button"
      onClick={() => saveStudent(student, index)}
      disabled={savingId === student.student_session_id}
      className={`inline-flex items-center justify-center gap-2 rounded-lg bg-emerald-500 px-4 py-2.5 text-sm font-semibold text-[#06120e] transition hover:bg-emerald-400 disabled:cursor-wait disabled:opacity-60 ${compact ? 'w-full' : ''}`}
    >
      <i className={`fas ${savingId === student.student_session_id ? 'fa-spinner fa-spin' : 'fa-save'}`} aria-hidden="true" />
      {savingId === student.student_session_id ? 'Saving' : compact ? 'Save & Next' : 'Save'}
    </button>
  )

  return (
    <section className="pb-10 text-gray-100">
      <header className="mb-7 flex flex-col justify-between gap-4 md:flex-row md:items-end">
        <div>
          <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-indigo-400">Academic year summary</p>
          <h1 className="text-3xl font-bold tracking-tight text-white md:text-4xl">Overall attendance</h1>
          <p className="mt-2 max-w-2xl text-sm text-gray-400">Set each student&apos;s total present days for the academic year.</p>
        </div>
        <div className="inline-flex w-fit items-center gap-2 rounded-lg border border-[#2A2A2A] bg-[#1C1C1C] px-3 py-2 text-sm text-gray-300">
          <i className="fas fa-user-graduate text-indigo-400" aria-hidden="true" />
          {students?.length ?? 0} {(students?.length ?? 0) === 1 ? 'student' : 'students'}
        </div>
      </header>

        <div className="mb-8 rounded-xl border border-[#2A2A2A] bg-[#1C1C1C] p-4 shadow-xl shadow-black/20 md:p-6">
        <div>
          <label htmlFor="overall-class" className="mb-2 block text-sm font-medium text-gray-300">Select class</label>
          <select
            id="overall-class"
            value={selectedClass}
              onChange={event => handleClassChange(event.target.value)}
            disabled={classesLoading}
            className="w-full rounded-lg border border-white/10 bg-[#1A1A1A] px-4 py-3 text-white outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
          >
            <option value="">{classesLoading ? 'Loading classes...' : 'Choose a class'}</option>
            {classes.map(classItem => (
              <option key={classItem.id} value={classItem.id}>{classItem.class_name}</option>
            ))}
          </select>
        </div>
      </div>

      {(error || notice) && (
        <div role={error ? 'alert' : 'status'} className={`mb-5 rounded-lg border px-4 py-3 text-sm ${error ? 'border-rose-400/20 bg-rose-400/10 text-rose-200' : 'border-emerald-400/20 bg-emerald-400/10 text-emerald-200'}`}>
          {error || notice}
        </div>
      )}

      {loading ? (
        <SkeletonLoader />
      ) : error ? (
        <ErrorState message={error} onRetry={() => loadStudents(selectedClass)} />
      ) : students === null ? (
        <InitialState
          title="Update Overall Attendance"
          badge="Academic Year Summary"
          description="Choose a class above to load its students and update their total present days."
          hint="Select a class to begin"
        />
      ) : students.length === 0 ? (
        <NoStudentsState message="There are no students in this class to update." />
      ) : (
        <>
          <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-xl font-semibold text-white">{className || 'Class'} students</h2>
              <p className="mt-1 text-sm text-gray-400">Update totals and save each student individually.</p>
            </div>
            <label className="relative w-full sm:max-w-xs">
              <i className="fas fa-search absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" aria-hidden="true" />
              <input
                type="search"
                value={search}
                onChange={event => setSearch(event.target.value)}
                placeholder="Find a student"
                aria-label="Find a student"
                className="w-full rounded-lg border border-white/10 bg-[#1C1C1C] py-2.5 pl-9 pr-3 text-sm text-white outline-none focus:border-indigo-500"
              />
            </label>
          </div>

          <div className="hidden overflow-hidden rounded-xl border border-[#2A2A2A] bg-[#1C1C1C] md:block">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[700px] border-collapse text-left">
                <thead className="border-b border-[#2A2A2A] bg-[#202020] text-xs uppercase tracking-wider text-gray-400">
                  <tr>
                    <th className="w-24 px-5 py-4 text-center font-semibold">Roll</th>
                    <th className="px-5 py-4 font-semibold">Student</th>
                    <th className="px-5 py-4 font-semibold">Father&apos;s name</th>
                    <th className="w-48 px-5 py-4 text-center font-semibold">Total present days</th>
                    <th className="w-32 px-5 py-4 text-center font-semibold">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#2A2A2A]">
                  {filteredStudents.map(student => {
                    const index = students.indexOf(student)
                    return (
                      <tr key={student.student_session_id} className="transition-colors hover:bg-white/[0.03]">
                        <td className="px-5 py-4 text-center font-mono text-sm text-gray-300">{student.roll || '—'}</td>
                        <td className="px-5 py-4 font-medium text-white">{student.student_name}</td>
                        <td className="px-5 py-4 text-sm text-gray-400">{student.fathers_name || '—'}</td>
                        <td className="px-5 py-4">{presentInput(student)}</td>
                        <td className="px-5 py-4 text-center">{saveButton(student, index)}</td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </div>

          <div className="space-y-3 md:hidden">
            {filteredStudents.map(student => {
              const index = students.indexOf(student)
              return (
                <article key={student.student_session_id} className="rounded-xl border border-[#2A2A2A] bg-[#1C1C1C] p-4">
                  <div className="mb-4 flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <h3 className="truncate font-semibold text-white">{student.student_name}</h3>
                      <p className="mt-1 text-sm text-gray-400">Father: {student.fathers_name || '—'}</p>
                    </div>
                    <span className="shrink-0 rounded-md border border-white/5 bg-[#2A2A2A] px-2 py-1 font-mono text-xs text-gray-300">Roll {student.roll || '—'}</span>
                  </div>
                  <label className="mb-3 block text-xs font-medium text-gray-400">Total present days</label>
                  {presentInput(student, true)}
                  <div className="mt-3">{saveButton(student, index, true)}</div>
                </article>
              )
            })}
          </div>

          {filteredStudents.length === 0 && (
            <p className="rounded-lg border border-[#2A2A2A] bg-[#1C1C1C] px-4 py-8 text-center text-sm text-gray-400">No students match that search.</p>
          )}
        </>
      )}
    </section>
  )
}

export default OverallAttendance