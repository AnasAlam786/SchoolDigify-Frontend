import { useEffect, useState } from 'react'
import { FileText, LoaderCircle } from 'lucide-react'
import { apiGet, apiPost } from '../../../../api/api'
import ReportModal from '../../../utils/reportGenerationModal/ReportModal'
import DateSelection from '../../../utils/reportGenerationModal/components/DateSelection'
import ClassesSelection from '../../../utils/reportGenerationModal/components/ClassesSelection'
import Heading from '../../../utils/reportGenerationModal/components/Heading'
import ReportGenerator from '../../../utils/reportGenerationModal/components/ReportGenerator'
import { formatReportDate, getLocalToday, REPORT_STYLES } from '../../../utils/reportGenerationModal/components/reportUtils'

function escapeHtml(value) {
    return String(value ?? '').replace(/[&<>"']/g, character => ({
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#39;',
    })[character])
}

function renderPrintableReport(report) {
    const classes = report.classes.map(classReport => `
    <article class="attendance-report-page">
      <div class="report-heading">
        <div>
          <p class="report-kicker">Student attendance</p>
          <h3>${escapeHtml(classReport.class_name)}</h3>
          <p class="report-period">${formatReportDate(report.start_date)} – ${formatReportDate(report.end_date)}</p>
        </div>
        <div class="report-class-summary">
          <span><strong>${classReport.students.length}</strong> students</span>
          <span><strong>${classReport.school_opened}</strong> school days</span>
          <span><strong>${classReport.holidays}</strong> holidays</span>
        </div>
      </div>
      ${classReport.students.length ? `
        <div class="report-table-wrap">
                                        <table class="report-table">
                                                <colgroup><col style="width:5%"><col style="width:21%"><col style="width:18%"><col style="width:7%"><col style="width:6%"><col style="width:6%"><col style="width:7%"><col style="width:7%"><col style="width:6%"><col style="width:7%"><col style="width:5%"><col style="width:5%"></colgroup>
                                                <thead><tr><th>Roll no.</th><th>Student</th><th>Father</th><th>Class</th><th>Present</th><th>Absent</th><th>Half day</th><th>Unmarked</th><th>Holidays</th><th>School opened</th><th>Present</th><th>Absent</th></tr></thead>
            <tbody>${classReport.students.map(student => `
              <tr>
                                <td>${escapeHtml(student.roll ?? '—')}</td>
                                <td><span class="report-student-name">${escapeHtml(student.student_name)}</span></td>
                                <td>${escapeHtml(student.fathers_name || '—')}</td>
                                <td>${escapeHtml(classReport.class_name)}</td><td>${escapeHtml(student.present)}</td><td>${escapeHtml(student.absent)}</td><td>${escapeHtml(student.half_day)}</td><td>${escapeHtml(student.unmarked)}</td><td>${escapeHtml(student.holidays)}</td><td>${escapeHtml(student.school_opened)}</td><td>${escapeHtml(student.present_percentage)}%</td><td>${escapeHtml(student.absent_percentage)}%</td>
              </tr>`).join('')}
            </tbody>
          </table>
        </div>` : '<p class="report-empty">No students are enrolled in this class for the current session.</p>'}
    <footer class="report-footer"><span>Attendance report</span><span>Generated ${formatReportDate(getLocalToday())}</span></footer>
    </article>`).join('')

    return `<!doctype html>
    <html lang="en">
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <title>Attendance report</title>
        <style>${REPORT_STYLES}</style>
      </head>
      <body><main class="attendance-report-print">${classes}</main>
        <script>
          (function () {
            function printWhenReady() {
              var fontsReady = document.fonts && document.fonts.ready ? document.fonts.ready : Promise.resolve();
              fontsReady.then(function () {
                requestAnimationFrame(function () {
                  setTimeout(function () { window.focus(); window.print(); }, 150);
                });
              });
            }
            if (document.readyState === 'complete') printWhenReady();
            else window.addEventListener('load', printWhenReady, { once: true });
          })();
        </script>
      </body>
    </html>`
}

function AttendanceReport({ classes, onClose }) {
    const [dateLimits, setDateLimits] = useState(null)
    const [limitsLoading, setLimitsLoading] = useState(true)
    const [limitsError, setLimitsError] = useState('')
    const [startDate, setStartDate] = useState('')
    const [endDate, setEndDate] = useState(getLocalToday)
    const [selectedClassIds, setSelectedClassIds] = useState([])
    const [report, setReport] = useState(null)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')

    useEffect(() => {
        let active = true
        apiGet('/api/attendance_report_limits')
            .then(async response => {
                const data = await response.json()
                if (!response.ok) throw new Error(data.error || 'Unable to load current session dates.')
                if (active) {
                    setDateLimits(data)
                    setStartDate(data.start_date)
                    setEndDate(data.end_date)
                }
            })
            .catch(requestError => {
                if (active) setLimitsError(requestError.message || 'Unable to load current session dates.')
            })
            .finally(() => {
                if (active) setLimitsLoading(false)
            })

        return () => { active = false }
    }, [])


    const toggleClass = classId => {
        setSelectedClassIds(current => current.includes(classId)
            ? current.filter(id => id !== classId)
            : [...current, classId])
    }

    const generateReport = async event => {
        event.preventDefault()
        setError('')
        setReport(null)

        if (!dateLimits || !startDate || !endDate || startDate > endDate || !selectedClassIds.length) {
            setError('Choose a valid date range and at least one class.')
            return
        }
        if (startDate < dateLimits.start_date || endDate > dateLimits.end_date) {
            setError('Dates must be within the current session and cannot be after today.')
            return
        }

        setLoading(true)
        try {
            const response = await apiPost('/api/attendance_report', {
                start_date: startDate,
                end_date: endDate,
                class_ids: selectedClassIds,
            })
            const data = await response.json()
            if (!response.ok) throw new Error(data.error || 'Unable to generate attendance report.')
            setReport(data)
        } catch (requestError) {
            setError(requestError.message || 'Network error while generating report.')
        } finally {
            setLoading(false)
        }
    }

    return (
        <ReportModal onClose={onClose} loading={loading} className="max-w-6xl">
            <Heading
                title="Attendance report"
                subtitle="Student summary by class"
                printLabel="Print report"
                printableReport = {report ? renderPrintableReport(report) : undefined}
                report={report}
                onClose={onClose}
            />
                <div className="min-h-0 flex-1 overflow-y-auto">
                    <form onSubmit={generateReport} className="attendance-report-controls space-y-5 border-b border-white/10 bg-white/[0.025] p-4 sm:p-6">
                        <DateSelection
                            startDate={startDate}
                            endDate={endDate}
                            dateLimits={dateLimits}
                            onStartDateChange={setStartDate}
                            onEndDateChange={setEndDate}
                            disabled={limitsLoading}
                        />
                        <ClassesSelection
                            classes={classes}
                            selectedClassIds={selectedClassIds}
                            onToggleClass={toggleClass}
                            disabled={limitsLoading || !dateLimits}
                        />

                        <div className="flex flex-col-reverse gap-3 border-t border-white/[0.07] pt-4 sm:flex-row sm:items-center sm:justify-between">
                            <div className="min-w-0 text-sm">
                                {limitsLoading && <p className="text-gray-400">Loading current session dates...</p>}
                                {limitsError && <p role="alert" className="text-red-300">{limitsError}</p>}
                                {error && <p role="alert" className="text-red-300">{error}</p>}
                            </div>
                            <button type="submit" disabled={loading || limitsLoading || !dateLimits || !classes.length} className="flex min-h-11 shrink-0 items-center justify-center gap-2 rounded-lg bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-500 disabled:cursor-not-allowed disabled:opacity-50">
                                {loading ? <LoaderCircle size={17} className="animate-spin" /> : <FileText size={17} />}
                                {loading ? 'Generating...' : 'Generate report'}
                            </button>
                        </div>
                    </form>
                    {report ? (
                        <ReportGenerator report={report} />
                    ) : !loading && <div className="attendance-report-empty px-6 py-12 text-center text-sm text-gray-500">Select a date range and classes to prepare the report.</div>}
                </div>
        </ReportModal>
    )
}

export default AttendanceReport