import { useEffect, useMemo, useState } from 'react'
import { apiGet } from '../../api/api'
import ControlPannel from './components/ControlPannel'
import Header from './components/Header'
import MarksTable from './components/MarksTable'
import SelectionBar from './components/SelectionBar'
import { apiPost } from '../../api/api'
import { fetchClasses } from '../utils/fetchClasses'
import { ErrorState, NoClassSelectedState, NoStudentsState, SkeletonLoader }
  from './components/PageStatus'
import './style/ShowMarks.css'
import usePermission from '../../hooks/usePermission'

function ShowMarks() {

  const { hasPermission, PERMISSIONS } = usePermission()

  const [classes, setClasses] = useState([])
  const [selectedClass, setSelectedClass] = useState('')
  const [students, setStudents] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedIds, setSelectedIds] = useState(new Set())
  const [error, setError] = useState(null)
  const [classEmpty, setClassEmpty] = useState(false)

  useEffect(() => {
    const loadClasses = async () => {
      const classData = await fetchClasses();
      setClasses(classData);
    };
    loadClasses()
  }, [])

  const filteredStudents = useMemo(() => {
    const query = searchQuery.trim().toLowerCase()
    if (!query) return students

    return students.filter((student) => {
      const name = student.STUDENTS_NAME?.toString().toLowerCase() || ''
      const father = student.FATHERS_NAME?.toString().toLowerCase() || ''
      const roll = student.ROLL?.toString().toLowerCase() || ''
      return [name, father, roll].some((value) => value.includes(query))
    })
  }, [searchQuery, students])


  const loadMarksheets = async (classId) => {
    if (!classId || isLoading) return

    setSelectedClass(classId)
    setIsLoading(true)
    setError(null)
    setSelectedIds(new Set())
    setStudents([])
    setClassEmpty(false)

    try {
      const response = await apiPost(`/api/show_marks`, { class_id: classId })
      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || 'Failed to load marksheets.')
      }

      const studentMarks = data.student_marks || data.students || []
      setStudents(Array.isArray(studentMarks) ? studentMarks : [])
      setClassEmpty(data.class_empty ?? (Array.isArray(studentMarks) && studentMarks.length === 0))
    } catch (err) {
      console.error(err)
      setError(err.message || 'Failed to load marksheets.')
    } finally {
      setIsLoading(false)
    }
  }

  const handlePrintCertificate = async (studentIds) => {
    try {

      const studentPayload = students
        .filter((student) => studentIds.has(student.student_id))
        .map((student) => ({
          student_id: student.student_id,
          STUDENTS_NAME: student.STUDENTS_NAME,
          FATHERS_NAME: student.FATHERS_NAME,
          CLASS: student.CLASS,
          IMAGE: student.IMAGE,
          overall_rank: student.overall_rank,
          percentage: student.marks?.["G. Total"]?.percentage ?? 0,
        }));

        console.log(studentPayload)


      const response = await apiPost("/api/bulk_print_certificate", {
        students_data: studentPayload,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to generate certificate");
      }

      const printWindow = window.open("", "_blank");
      printWindow.document.write(data.html);
      printWindow.document.close();
      printWindow.onload = () => printWindow.print();

    } catch (error) {
      console.error(error);
    }
  };

  const handlePrintResult = async (studentIds) => {
    try {

      // Accept both Set and Array
      const studentIDs = studentIds instanceof Set
        ? Array.from(studentIds)
        : studentIds;

      if (!Array.isArray(studentIDs)) {
        throw new Error("studentIds must be a Set or an Array.");
      }
      const response = await apiPost('/api/bulk_download_results',
        { student_ids: studentIDs, class_id: selectedClass }
      )

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to generate certificate');
      }

      const printWindow = window.open("", "_blank");
      printWindow.document.write(data.html);
      printWindow.document.close();
      printWindow.onload = () => {
        printWindow.print();
      };

    } catch (error) {
      console.error(error);
    }
  };


  return (
    <div className="mx-auto">
      <Header />
      <ControlPannel
        searchQuery={searchQuery}
        onSearchChange={(value) => setSearchQuery(value)}
        selectedClass={selectedClass}
        onClassChange={loadMarksheets}
        classes={classes}
      />

      {hasPermission(PERMISSIONS.GET_RESULT) && (
        <SelectionBar
          filteredStudents={filteredStudents}
          selectedIds={selectedIds}
          setSelectedIds={setSelectedIds}

          handlePrintCertificate={handlePrintCertificate}
          handlePrintResult={handlePrintResult}
        />
      )}

      {error && <ErrorState message={error} />}
      {isLoading ? (
        <SkeletonLoader />
      ) : students.length > 0 ? (
        <MarksTable
          students={filteredStudents}
          selectedIds={selectedIds}
          setSelectedIds={setSelectedIds}

          handlePrintCertificate={handlePrintCertificate}
          handlePrintResult={handlePrintResult}
        />
      ) : selectedClass ? (
        <NoStudentsState onRetry={() => loadMarksheets(selectedClass)} />
      ) : (
        <NoClassSelectedState onSelectClass={() => document.getElementById('classView')?.focus()}
          onSearch={() => document.getElementById('search-input')?.focus()} />
      )}
    </div>
  )
}

export default ShowMarks
