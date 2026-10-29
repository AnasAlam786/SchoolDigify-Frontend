import { useEffect, useState } from 'react'
import { CalendarDays, FileText, LoaderCircle, Printer, X } from 'lucide-react'
import { apiGet, apiPost } from '../../../../api/api'

const REPORT_STYLES = `
.attendance-report-page{margin:0 auto 1.5rem;max-width:1280px;overflow:hidden;border:1px solid rgba(255,255,255,.12);border-radius:8px;background:#fff;color:#17211d;box-shadow:0 12px 32px rgba(0,0,0,.2)}
.report-heading{display:flex;flex-direction:row;align-items:flex-start;justify-content:space-between;gap:1rem;padding:1.4rem 1.5rem 1rem;border-bottom:2px solid #19734e}
.report-heading>div:first-child{min-width:0;flex:1 1 auto}
.report-kicker{margin:0 0 .3rem;color:#19734e;font-size:.68rem;font-weight:700;text-transform:uppercase}
.report-heading h3{margin:0;font-size:1.45rem;font-weight:700}
.report-period{margin:.3rem 0 0;color:#66736d;font-size:.8rem}
.report-class-summary{display:flex;flex:0 0 auto;flex-wrap:nowrap;justify-content:flex-end;gap:.4rem 1rem;color:#59665f;font-size:.75rem}
.report-class-summary span{white-space:nowrap}
.report-class-summary strong{color:#17211d}
.report-table-wrap{overflow-x:auto;padding:.75rem 1rem 1rem}
.report-table{width:100%;table-layout:fixed;border-collapse:collapse;font-size:.82rem;text-align:center}
.report-table th,.report-table td{border:1px solid #dce3df;padding:.45rem .35rem;white-space:nowrap}
.report-table th{background:#edf4f0;color:#294438;font-weight:700}
.report-table th:nth-child(2),.report-table td:nth-child(2),.report-table th:nth-child(3),.report-table td:nth-child(3){text-align:left;white-space:normal;overflow-wrap:anywhere}
.report-table tbody tr:nth-child(even){background:#f8faf9}
.report-student-name{display:block}
.report-student-name{font-weight:600}
.report-empty{padding:2.5rem 1rem;color:#66736d;text-align:center}
.report-footer{display:flex;justify-content:space-between;border-top:1px solid #e1e7e3;padding:.55rem 1.5rem;color:#78847e;font-size:.65rem}
@media(max-width:640px){.report-heading{align-items:flex-start;flex-direction:column;padding:1rem}.report-class-summary{justify-content:flex-start}.report-table-wrap{padding:.5rem}}
@page{size:A4 landscape;margin:8mm}
@media print{body{margin:0}.attendance-report-print{padding:0!important}.attendance-report-page{width:100%;max-width:none;margin:0;overflow:visible;border:0;border-radius:0;box-shadow:none;break-after:page;page-break-after:always}.attendance-report-page:last-child{break-after:auto;page-break-after:auto}.report-heading{display:flex!important;flex-direction:row!important;align-items:flex-start!important;justify-content:space-between!important;padding:0 0 5mm}.report-class-summary{display:flex!important;flex:0 0 auto!important;flex-direction:row!important;flex-wrap:nowrap!important;white-space:nowrap}.report-table-wrap{overflow:visible;padding:3mm 0}.report-table{font-size:10pt}.report-table th,.report-table td{padding:2mm 1.2mm;white-space:normal;overflow-wrap:anywhere;line-height:1.25}.report-table th:first-child,.report-table td:first-child{white-space:nowrap}.report-table tr{break-inside:avoid;page-break-inside:avoid}.report-footer{padding:2mm 0}}
`

function getLocalToday() {
    const date = new Date()
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
}

function formatReportDate(value) {
    const [year, month, day] = value.split('-')
    return `${day}/${month}/${year}`
}

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
                                                <thead><tr><th>Roll no.</th><th>Student</th><th>Father</th><th>Class</th><th>Present</th><th>Absent</th><th>Half day</th><th>Unmarked</th><th>Holidays</th><th>School opened</th><th>Present %</th><th>Absent %</th></tr></thead>
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

    const printReport = () => {
        const printWindow = window.open('', '_blank')
        if (!printWindow) {
            setError('Allow pop-ups to open and print the report.')
            return
        }

        printWindow.document.open()
        printWindow.document.write(renderPrintableReport(report))
        printWindow.document.close()
    }

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
        <div className="attendance-report-overlay fixed inset-0 z-[70] flex items-center justify-center bg-black/75 p-2 backdrop-blur-sm sm:p-5" onClick={loading ? undefined : onClose}>
            <section
                role="dialog"
                aria-modal="true"
                aria-labelledby="attendance-report-title"
                className="attendance-report-dialog relative flex max-h-[96vh] w-full max-w-6xl flex-col overflow-hidden rounded-xl border border-white/10 bg-[#17191d] shadow-2xl"
                onClick={event => event.stopPropagation()}
            >
                <header className="flex shrink-0 items-center justify-between gap-4 border-b border-white/10 px-4 py-4 sm:px-6">
                    <div className="flex min-w-0 items-center gap-3">
                        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-emerald-400/10 text-emerald-300">
                            <FileText size={20} aria-hidden="true" />
                        </span>
                        <div className="min-w-0">
                            <h2 id="attendance-report-title" className="truncate text-lg font-semibold text-white sm:text-xl">Attendance report</h2>
                            <p className="text-xs text-gray-400 sm:text-sm">Student summary by class</p>
                        </div>
                    </div>
                    <div className="flex shrink-0 items-center gap-2">
                        {report && <button type="button" onClick={printReport} className="flex items-center gap-2 rounded-lg bg-emerald-600 px-3 py-2 text-sm font-semibold text-white transition hover:bg-emerald-500">
                            <Printer size={16} aria-hidden="true" /><span className="hidden sm:inline">Print report</span>
                        </button>}
                        <button type="button" onClick={onClose} aria-label="Close report" className="rounded-lg p-2 text-gray-400 transition hover:bg-white/10 hover:text-white">
                            <X size={19} />
                        </button>
                    </div>
                </header>

                <div className="min-h-0 flex-1 overflow-y-auto">
                    <form onSubmit={generateReport} className="attendance-report-controls space-y-5 border-b border-white/10 bg-white/[0.025] p-4 sm:p-6">
                        <div className="grid gap-4 sm:grid-cols-2">
                            <label className="block text-sm font-medium text-gray-300">
                                <span className="mb-2 block">Start date</span>
                                <span className="flex items-center gap-3 rounded-lg border border-white/10 bg-[#22252a] px-3 text-gray-400 transition focus-within:border-emerald-400/70">
                                    <CalendarDays size={18} aria-hidden="true" />
                                    <input type="date" lang="en-IN" value={startDate} min={dateLimits?.start_date} max={endDate || dateLimits?.end_date} onChange={event => setStartDate(event.target.value)} disabled={limitsLoading || !dateLimits} className="min-w-0 flex-1 bg-transparent py-3 text-white outline-none disabled:cursor-wait disabled:opacity-50" required />
                                </span>
                            </label>
                            <label className="block text-sm font-medium text-gray-300">
                                <span className="mb-2 block">End date</span>
                                <span className="flex items-center gap-3 rounded-lg border border-white/10 bg-[#22252a] px-3 text-gray-400 transition focus-within:border-emerald-400/70">
                                    <CalendarDays size={18} aria-hidden="true" />
                                    <input type="date" lang="en-IN" value={endDate} min={startDate || dateLimits?.start_date} max={dateLimits?.end_date} onChange={event => setEndDate(event.target.value)} disabled={limitsLoading || !dateLimits} className="min-w-0 flex-1 bg-transparent py-3 text-white outline-none disabled:cursor-wait disabled:opacity-50" required />
                                </span>
                            </label>
                        </div>

                        <fieldset disabled={limitsLoading || !dateLimits} className="min-w-0">
                            <legend className="mb-2 flex w-full items-center justify-between gap-3 text-sm font-medium text-gray-300">
                                <span>Classes to include</span>
                                <span className="text-xs font-normal text-gray-500">{selectedClassIds.length} selected</span>
                            </legend>
                            <div className="grid max-h-36 grid-cols-2 gap-2 overflow-y-auto rounded-lg border border-white/10 bg-[#22252a] p-2 sm:grid-cols-3 lg:grid-cols-4">
                                {classes.map(classItem => {
                                    const classId = String(classItem.id)
                                    const selected = selectedClassIds.includes(classId)
                                    return <label key={classItem.id} className={`flex min-w-0 cursor-pointer items-center gap-2 rounded-md px-3 py-2.5 text-sm transition ${selected ? 'bg-emerald-400/10 text-emerald-100 ring-1 ring-inset ring-emerald-400/30' : 'text-gray-300 hover:bg-white/[0.06]'} ${limitsLoading || !dateLimits ? 'cursor-wait opacity-50' : ''}`}>
                                        <input type="checkbox" checked={selected} onChange={() => toggleClass(classId)} className="accent-emerald-400" />
                                        <span className="truncate">{classItem.class_name}</span>
                                    </label>
                                })}
                                {!classes.length && <span className="col-span-full px-2 py-2 text-sm text-gray-500">No classes available</span>}
                            </div>
                        </fieldset>

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
                        <div className="attendance-report-print p-3 sm:p-6">
                            <style>{REPORT_STYLES}</style>
                            {report.classes.map(classReport => (
                                <article className="attendance-report-page" key={classReport.class_id}>
                                    <div className="report-heading">
                                        <div>
                                            <p className="report-kicker">Student attendance</p>
                                            <h3>{classReport.class_name}</h3>
                                            <p className="report-period">{formatReportDate(report.start_date)} – {formatReportDate(report.end_date)}</p>
                                        </div>
                                        <div className="report-class-summary">
                                            <span><strong>{classReport.students.length}</strong> students</span>
                                            <span><strong>{classReport.school_opened}</strong> school days</span>
                                            <span><strong>{classReport.holidays}</strong> holidays</span>
                                        </div>
                                    </div>
                                    {classReport.students.length ? <div className="report-table-wrap">
                                        <table className="report-table">
                                            <colgroup><col style={{ width: '5%' }} /><col style={{ width: '21%' }} /><col style={{ width: '18%' }} /><col style={{ width: '7%' }} /><col style={{ width: '6%' }} /><col style={{ width: '6%' }} /><col style={{ width: '7%' }} /><col style={{ width: '7%' }} /><col style={{ width: '6%' }} /><col style={{ width: '7%' }} /><col style={{ width: '5%' }} /><col style={{ width: '5%' }} /></colgroup>
                                            <thead><tr>
                                                <th>Roll no.</th>
                                                <th>Student</th>
                                                <th>Father</th>
                                                <th>Class</th>
                                                <th>Present</th>
                                                <th>Absent</th>
                                                <th>Half day</th>
                                                <th>Unmarked</th>
                                                <th>Holidays</th>
                                                <th>School opened</th>
                                                <th>Present %</th>
                                                <th>Absent %</th>
                                            </tr></thead>
                                            <tbody>{classReport.students.map((student, index) => <tr key={`${student.roll}-${student.student_name}-${index}`}>
                                                <td>{student.roll ?? '—'}</td>
                                                <td>
                                                    <span className="report-student-name">
                                                        {student.student_name}
                                                    </span>
                                                </td>
                                                <td>{student.fathers_name || '—'}</td>
                                                <td>{classReport.class_name}</td>
                                                <td>{student.present}</td>
                                                <td>{student.absent}</td>
                                                <td>{student.half_day}</td>
                                                <td>{student.unmarked}</td>
                                                <td>{student.holidays}</td>
                                                <td>{student.school_opened}</td>
                                                <td>{student.present_percentage}%</td>
                                                <td>{student.absent_percentage}%</td>
                                            </tr>)}</tbody>
                                        </table>
                                    </div> : <p className="report-empty">No students are enrolled in this class for the current session.</p>}
                                    <footer className="report-footer"><span>Attendance report</span><span>Generated {formatReportDate(getLocalToday())}</span></footer>
                                </article>
                            ))}
                        </div>
                    ) : !loading && <div className="attendance-report-empty px-6 py-12 text-center text-sm text-gray-500">Select a date range and classes to prepare the report.</div>}
                </div>
            </section>
        </div>
    )
}

export default AttendanceReport