import { useEffect, useMemo, useState } from 'react'
import { apiPost } from '../../api/api'
import ControlPannel from './components/ControlPannel'
import Header from './components/Header'
import MarksTable from './components/MarksTable'
import SelectionBar from './components/SelectionBar'
import { fetchClasses } from '../utils/fetchClasses'
import { ErrorState, NoClassSelectedState, NoStudentsState, SkeletonLoader }
  from './components/PageStatus'
import './style/ShowMarks.css'
import usePermission from '../../hooks/usePermission'

const formatStudentMarks = (result) => {
  const student = result.student || {}
  const exams = result.exams || []
  const subjects = result.subjects || []
  const examTotals = result.exam_totals || {}
  const summary = result.summary || {}
  const marks = {}

  exams.forEach((exam) => {
    const totals = examTotals[String(exam.id)] || {}

    marks[exam.name] = {
      weightage: exam.weightage,
      exam_display_order: exam.display_order,
      exam_total: totals.total,
      percentage: totals.percentage,
      subject_marks_dict: Object.fromEntries(
        subjects.map((subject) => [
          subject.name,
          subject.marks?.[String(exam.id)] ?? '',
        ])
      ),
    }
  })

  const termGroups = new Map()
  exams.forEach((exam) => {
    const termNumber = String(exam.term ?? '').match(/\d+/)?.[0]
    if (!termNumber) return

    if (!termGroups.has(termNumber)) termGroups.set(termNumber, [])
    termGroups.get(termNumber).push(exam)
  })

  const examOrder = []
  Array.from(termGroups.entries())
    .sort(([firstTerm], [secondTerm]) => Number(firstTerm) - Number(secondTerm))
    .forEach(([termNumber, termExams]) => {
      termExams.sort((firstExam, secondExam) => (
        (firstExam.display_order ?? 0) - (secondExam.display_order ?? 0)
      ))
      examOrder.push(...termExams.map((exam) => exam.name))

      const termName = `${termNumber} Total`
      const termTotals = termExams.map((exam) => examTotals[String(exam.id)] || {})
      const termMarks = Object.fromEntries(subjects.map((subject) => {
        const subjectMarks = termExams
          .map((exam) => subject.marks?.[String(exam.id)])
          .filter((mark) => mark !== null && mark !== undefined && mark !== '')
          .map(Number)
          .filter(Number.isFinite)
        const subjectTotal = subjectMarks.reduce((total, mark) => total + mark, 0)
        return [subject.name, subjectMarks.length > 0 ? subjectTotal : '']
      }))
      const total = termTotals.reduce((sum, examTotal) => sum + Number(examTotal.total || 0), 0)
      const maxTotal = termTotals.reduce((sum, examTotal) => sum + Number(examTotal.max_total || 0), 0)

      marks[termName] = {
        weightage: termExams.reduce((sum, exam) => sum + Number(exam.weightage || 0), 0),
        exam_total: Math.round(total * 10) / 10,
        percentage: maxTotal > 0 ? Number(((total / maxTotal) * 100).toFixed(2)) : 0,
        subject_marks_dict: termMarks,
      }
      examOrder.push(termName)
    })

  exams
    .filter((exam) => !String(exam.term ?? '').match(/\d+/))
    .sort((firstExam, secondExam) => (
      (firstExam.display_order ?? 0) - (secondExam.display_order ?? 0)
    ))
    .forEach((exam) => examOrder.push(exam.name))

  const grandTotalName = 'G. Total'
  examOrder.push(grandTotalName)
  marks[grandTotalName] = {
    weightage: summary.grand_max_total,
    exam_total: summary.grand_total,
    percentage: summary.overall_percentage,
    subject_marks_dict: Object.fromEntries(subjects.map((subject) => {
      const subjectMarks = exams
        .map((exam) => subject.marks?.[String(exam.id)])
        .filter((mark) => mark !== null && mark !== undefined && mark !== '')
        .map(Number)
        .filter(Number.isFinite)
      const subjectTotal = subjectMarks.reduce((total, mark) => total + mark, 0)
      return [subject.name, subjectMarks.length > 0 ? subjectTotal : '']
    })),
  }

  const percentage = Number(summary.overall_percentage || 0)
  const grade = percentage >= 80 ? 'A'
    : percentage >= 60 ? 'B'
      : percentage >= 45 ? 'C'
        : percentage >= 33 ? 'D' : 'E'
  marks.Grades = {
    weightage: '',
    exam_total: grade,
    percentage: '-',
    subject_marks_dict: Object.fromEntries(subjects.map((subject) => [subject.name, grade])),
  }
  examOrder.push('Grades')

  return {
    ...student,
    student_id: student.id,
    student_session_id: student.session_id,
    STUDENTS_NAME: student.name,
    ROLL: student.roll,
    CLASS: student.class,
    overall_rank: summary.rank,
    marks,
    exam_order: examOrder,
    subject_order: subjects.map((subject) => subject.name),
  }
}

function ShowMarks() {

  const { hasPermission, PERMISSIONS } = usePermission()

  const [classes, setClasses] = useState([])
  const [selectedClass, setSelectedClass] = useState('')
  const [students, setStudents] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedIds, setSelectedIds] = useState(new Set())
  const [error, setError] = useState(null)

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

    try {
      const response = await apiPost(`/api/show_marks`, { class_id: classId })
      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || 'Failed to load marksheets.')
      }

      const studentMarks = data.student_marks
      setStudents(Array.isArray(studentMarks) ? studentMarks.map(formatStudentMarks) : [])
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
        .filter((student) => studentIds.has(student.student_session_id))
        .map((student) => ({
          student_session_id: student.student_session_id,
          STUDENTS_NAME: student.STUDENTS_NAME,
          FATHERS_NAME: student.FATHERS_NAME,
          CLASS: student.CLASS,
          IMAGE: student.IMAGE,
          overall_rank: student.overall_rank,
          percentage: student.marks?.['G. Total']?.percentage ?? 0,
        }))

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
        { student_session_id: studentIDs, class_id: selectedClass }
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
