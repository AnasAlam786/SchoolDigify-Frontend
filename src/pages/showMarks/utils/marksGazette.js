const PAGE_CONTENT_HEIGHT_MM = 194
const PAGE_GAP_MM = 4
const BLOCKS_PER_PAGE = 4
const BLOCK_HEADER_HEIGHT_MM = 9
const FIXED_TABLE_HEIGHT_MM = 14
const BLOCK_PADDING_MM = 2
const MIN_SUBJECT_ROW_HEIGHT_MM = 3.2

const escapeHtml = (value) => String(value ?? '')
  .replaceAll('&', '&amp;')
  .replaceAll('<', '&lt;')
  .replaceAll('>', '&gt;')
  .replaceAll('"', '&quot;')
  .replaceAll("'", '&#39;')

const getSubjectNames = (student, examNames) => {
  const marks = student?.marks || {}
  const firstExam = examNames[0] ? marks[examNames[0]] : null
  const subjectMarks = firstExam?.subject_marks_dict || {}

  if (Array.isArray(student?.subject_order)) {
    return student.subject_order.filter((subject) => subject in subjectMarks)
  }

  return Object.keys(subjectMarks)
}

const getExamNames = (student) => {
  const marks = student?.marks || {}
  if (Array.isArray(student?.exam_order)) {
    return student.exam_order.filter((examName) => examName in marks)
  }

  return Object.keys(marks)
}

const formatPercentage = (value) => {
  if (value === null || value === undefined || value === '' || value === '-') return '—'
  const numericValue = Number(value)
  if (!Number.isFinite(numericValue)) return String(value)
  return `${Number.isInteger(numericValue) ? numericValue : numericValue.toFixed(2)}%`
}

export const getMarksGazetteLayoutIssue = (students) => {
  const rows = 2
  const blockHeight = (PAGE_CONTENT_HEIGHT_MM - PAGE_GAP_MM * (rows - 1)) / rows
  const subjectAreaHeight = blockHeight - BLOCK_HEADER_HEIGHT_MM - FIXED_TABLE_HEIGHT_MM - BLOCK_PADDING_MM

  const denseStudent = students.find((student) => {
    const subjects = getSubjectNames(student, getExamNames(student))
    return subjects.length > 0 && subjectAreaHeight / subjects.length < MIN_SUBJECT_ROW_HEIGHT_MM
  })

  if (!denseStudent) return null
  return 'At least one student has too many subjects to print legibly in the fixed four-student A4 layout.'
}

const renderStudentBlock = (student) => {
  const marks = student?.marks || {}
  const examNames = getExamNames(student)
  const subjects = getSubjectNames(student, examNames)
  const rowCount = Math.max(subjects.length, 1)
  const columnCount = Math.max(examNames.length, 1)
  const columns = `minmax(22mm, 1.4fr) repeat(${columnCount}, minmax(0, 1fr))`

  const examHeaderCells = examNames.length > 0
    ? examNames.map((examName) => {
      const examData = marks[examName] || {}
      return `<div class="cell exam-heading" title="${escapeHtml(examName)}">${escapeHtml(examName)}<small>${escapeHtml(examData.weightage ?? '')}</small></div>`
    }).join('')
    : '<div class="cell exam-heading">No exams</div>'

  const subjectRows = subjects.length > 0
    ? subjects.map((subject, index) => {
      const subjectCells = examNames.map((examName) => {
        const value = marks[examName]?.subject_marks_dict?.[subject] ?? ''
        return `<div class="cell mark-cell" title="${escapeHtml(value || '—')}">${escapeHtml(value || '—')}</div>`
      }).join('')
      return `<div class="cell subject-cell ${index % 2 ? 'alternate' : ''}" title="${escapeHtml(subject)}">${escapeHtml(subject)}</div>${subjectCells}`
    }).join('')
    : '<div class="cell empty-marks" style="grid-column: 1 / -1; grid-row: 2">No marks data</div>'

  const summaryRows = [
    {
      label: 'Total',
      className: 'total-cell',
      getValue: (examData) => examData.exam_total ?? '—',
    },
    {
      label: '% / Grade',
      className: 'percentage-cell',
      getValue: (examData) => formatPercentage(examData.percentage),
    },
  ].map((row) => {
    const cells = examNames.map((examName) => {
      const examData = marks[examName] || {}
      const value = row.getValue(examData)
      return `<div class="cell ${row.className}" title="${escapeHtml(value)}">${escapeHtml(value)}</div>`
    }).join('')
    return `<div class="cell summary-label ${row.className}">${row.label}</div>${cells || '<div class="cell summary-label">—</div>'}`
  }).join('')

  return `<article class="gazette-block">
    <header class="student-header">
      <strong class="student-name" title="${escapeHtml(student.STUDENTS_NAME || '—')}">${escapeHtml(student.STUDENTS_NAME || '—')}</strong>
      <span class="student-detail" title="Father: ${escapeHtml(student.FATHERS_NAME || '—')}">Father: ${escapeHtml(student.FATHERS_NAME || '—')}</span>
      <span class="student-detail" title="Class: ${escapeHtml(student.CLASS || '—')}">Class: ${escapeHtml(student.CLASS || '—')}</span>
      <span class="student-detail" title="Roll: ${escapeHtml(student.ROLL ?? '—')}">Roll: ${escapeHtml(student.ROLL ?? '—')}</span>
    </header>
    <div class="gazette-table" style="--gazette-columns: ${columns}; --subject-rows: ${rowCount}">
      <div class="cell subject-heading">Subject</div>${examHeaderCells}
      ${subjectRows}${summaryRows}
    </div>
  </article>`
}

export const buildMarksGazetteHtml = (students) => {
  const pages = []

  for (let index = 0; index < students.length; index += BLOCKS_PER_PAGE) {
    const pageStudents = students.slice(index, index + BLOCKS_PER_PAGE)
    pages.push(`<section class="gazette-page">${pageStudents.map(renderStudentBlock).join('')}</section>`)
  }

  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Student Marks Gazette</title>
  <style>
    @page { size: A4 landscape; margin: 8mm; }
    * { box-sizing: border-box; }
    html, body { margin: 0; padding: 0; color: #17212b; font-family: Arial, Helvetica, sans-serif; }
    body { background: #e8edf1; }
    .gazette-page {
      width: 281mm; height: 194mm; margin: 8mm auto; padding: 0;
      display: grid; grid-template-columns: repeat(2, minmax(0, 1fr));
      grid-template-rows: repeat(2, minmax(0, 1fr)); gap: 4mm;
      break-after: page; page-break-after: always; overflow: hidden;
    }
    .gazette-page:last-child { break-after: auto; page-break-after: auto; }
    .gazette-block {
      min-width: 0; min-height: 0; overflow: hidden; padding: 1mm;
      display: flex; flex-direction: column; border: 0.3mm solid #53616d; background: #fff;
      break-inside: avoid; page-break-inside: avoid;
    }
    .student-header {
      flex: 0 0 9mm; height: 9mm; min-width: 0; overflow: hidden;
      display: flex; align-items: center; gap: 2mm;
      border-bottom: 0.25mm solid #8a969f; padding: 0 1mm;
    }
    .student-name, .student-detail { min-width: 0; overflow: hidden; white-space: nowrap; text-overflow: ellipsis; }
    .student-name { flex: 1.15 1 0; font-size: 8.5pt; }
    .student-detail { flex: 1 1 0; color: #33424d; font-size: 7.5pt; }
    .gazette-table {
      flex: 1 1 auto; min-height: 0; overflow: hidden; display: grid;
      grid-template-columns: var(--gazette-columns);
      grid-template-rows: 5mm repeat(var(--subject-rows), minmax(0, 1fr)) 5mm 4mm;
      border-left: 0.2mm solid #9aa5ad; border-top: 0.2mm solid #9aa5ad;
    }
    .cell {
      min-width: 0; min-height: 0; overflow: hidden; display: flex; align-items: center;
      justify-content: center; padding: 0 0.6mm; border-right: 0.2mm solid #aeb8bf;
      border-bottom: 0.2mm solid #aeb8bf; font-size: 7.5pt; line-height: 1.05;
      white-space: nowrap; text-overflow: ellipsis;
    }
    .subject-heading, .exam-heading { background: #e8edf0; font-weight: 700; }
    .subject-heading, .subject-cell, .summary-label { justify-content: flex-start; }
    .exam-heading { flex-direction: column; gap: 0.2mm; font-size: 7pt; }
    .exam-heading small { font-size: 6pt; font-weight: 400; }
    .subject-cell { font-weight: 600; }
    .alternate { background: #f2f5f6; }
    .mark-cell { font-variant-numeric: tabular-nums; }
    .summary-label, .total-cell, .percentage-cell { background: #e8edf0; font-weight: 700; }
    .percentage-cell { font-size: 7pt; }
    .empty-marks { color: #5b6770; font-style: italic; }
    @media screen {
      .gazette-page { box-shadow: 0 2mm 8mm #26374633; }
    }
    @media print {
      html, body { width: 281mm; height: auto; background: #fff; }
      .gazette-page { margin: 0; }
      .gazette-page:last-child { margin-bottom: 0; }
      html, body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
    }
  </style>
</head>
<body>${pages.join('')}</body>
</html>`
}