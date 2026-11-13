import { REPORT_STYLES, formatReportDate, getLocalToday } from './reportUtils'

function ReportGenerator({ report }) {
    if (!report) return null

    return (
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
                                <th>Present</th>
                                <th>Absent</th>
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
    )
}

export default ReportGenerator