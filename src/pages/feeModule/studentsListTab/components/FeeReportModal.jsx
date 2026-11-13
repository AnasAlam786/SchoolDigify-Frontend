import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { FileText, LoaderCircle } from "lucide-react";
import { apiGet } from "../../../../api/api";
import ReportModal from "../../../utils/reportGenerationModal/ReportModal";
import ClassesSelection from "../../../utils/reportGenerationModal/components/ClassesSelection";
import Heading from "../../../utils/reportGenerationModal/components/Heading";
import { REPORT_STYLES, formatReportDate, getLocalToday } from "../../../utils/reportGenerationModal/components/reportUtils";

const currencyFormatter = new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
});

function formatCurrency(value) {
    return currencyFormatter.format(Number(value || 0));
}

function escapeHtml(value) {
    return String(value ?? "").replace(/[&<>"']/g, (character) => ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;",
    })[character]);
}

function getStudentStatus(student) {
    return student.isRTE ? "RTE" : student.feeStatus || "Due";
}

function renderPrintableReport(students) {
    const rows = students.map((student) => `
    <tr>
      <td>${escapeHtml(student.ROLL || "—")}</td>
      <td>${escapeHtml(student.STUDENTS_NAME || "—")}</td>
      <td>${escapeHtml(student.FATHERS_NAME || "—")}</td>
      <td>${escapeHtml(student.CLASS || "—")}</td>
      <td>${escapeHtml(getStudentStatus(student))}</td>
      <td>${student.isRTE ? "—" : escapeHtml(student.dueMonths)}</td>
      <td>${student.isRTE ? "—" : escapeHtml(formatCurrency(student.dueAmount))}</td>
    </tr>`).join("");

    return `<!doctype html>
    <html lang="en">
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <title>Fee report</title>
        <style>${REPORT_STYLES}</style>
      </head>
      <body>
        <main class="attendance-report-print">
          <article class="attendance-report-page">
            <header class="report-heading">
              <div><p class="report-kicker">Student fees</p><h3>Fee report</h3></div>
              <div class="report-class-summary"><span><strong>${students.length}</strong> students</span></div>
            </header>
            <div class="report-table-wrap">
              <table class="report-table">
                <thead>
                <tr>
                    <th>Roll</th>
                    <th>Student</th>
                    <th>Father</th>
                    <th>Class</th>
                    <th>Status</th>
                    <th>Due Months</th>
                    <th>Due</th>
                </tr>
                </thead>
                <tbody>${rows || "<tr><td colspan=\"9\">No students found.</td></tr>"}</tbody>
              </table>
            </div>
            <footer class="report-footer"><span>Fee report</span><span>Generated ${formatReportDate(getLocalToday())}</span></footer>
          </article>
        </main>
        <script>
          (function () {
            function printWhenReady() {
              var fontsReady = document.fonts && document.fonts.ready ? document.fonts.ready : Promise.resolve();
              fontsReady.then(function () { requestAnimationFrame(function () { setTimeout(function () { window.focus(); window.print(); }, 150); }); });
            }
            if (document.readyState === 'complete') printWhenReady();
            else window.addEventListener('load', printWhenReady, { once: true });
          })();
        </script>
      </body>
    </html>`;
}

function FeeReportModal({ classes = [], onClose }) {
    const [selectedClassIds, setSelectedClassIds] = useState([]);
    const [requestedClassIds, setRequestedClassIds] = useState([]);
    const [requestVersion, setRequestVersion] = useState(0);

    const reportQuery = useQuery({
        queryKey: ["fee-student-report", requestedClassIds, requestVersion],
        enabled: requestVersion > 0 && requestedClassIds.length > 0,
        queryFn: async ({ signal }) => {
            const params = new URLSearchParams({
                fetch_all: "true",
                sort_by: "class-roll",
                sort_dir: "asc",
            });

            requestedClassIds.forEach((classId) => params.append("class_ids", classId));

            const response = await apiGet(`/api/get_students_fees?${params}`, { signal });
            const payload = await response.json();
            if (!response.ok) {
                throw Object.assign(new Error(payload?.error || "Unable to generate fee report."), {
                    errorCode: payload?.ERROR_CODE,
                });
            }

            return {
                students: payload.students_fee_data || [],
                studentCount: payload.students_count ?? 0,
            };
        },
        retry: (failureCount, error) => !error.errorCode && failureCount < 2,
    });

    const students = reportQuery.data?.students || [];
    const hasCurrentReport = requestedClassIds.length === selectedClassIds.length
        && requestedClassIds.every((classId) => selectedClassIds.includes(classId));
    const totals = students.reduce((summary, student) => {
        if (!student.isRTE) {
            summary.payable += Number(student.totalPayable || 0);
            summary.paid += Number(student.totalSettledAmount || 0);
            summary.due += Number(student.dueAmount || 0);
        }
        return summary;
    }, { payable: 0, paid: 0, due: 0 });

    const toggleClass = (classId) => {
        setSelectedClassIds((current) => current.includes(classId)
            ? current.filter((id) => id !== classId)
            : [...current, classId]);
    };

    const generateReport = (event) => {
        event.preventDefault();
        if (!selectedClassIds.length) return;
        setRequestedClassIds([...selectedClassIds]);
        setRequestVersion((version) => version + 1);
    };

    const reportMarkup = reportQuery.data && hasCurrentReport
        ? renderPrintableReport(students)
        : undefined;

    return (
        <ReportModal onClose={onClose} loading={reportQuery.isFetching} className="max-w-6xl">
            <Heading
                title="Fee report"
                subtitle="Student fee summary by class"
                printableReport={reportMarkup}
                onPrintError={(message) => window.alert(message)}
                onClose={onClose}
            />
            <div className="min-h-0 flex-1 overflow-y-auto">
                <form onSubmit={generateReport} className="space-y-5 border-b border-white/10 bg-white/[0.025] p-4 sm:p-6">
                    <ClassesSelection
                        classes={classes}
                        selectedClassIds={selectedClassIds}
                        onToggleClass={toggleClass}
                        disabled={reportQuery.isFetching}
                        label="Classes to include"
                    />
                    <div className="flex flex-col-reverse gap-3 border-t border-white/[0.07] pt-4 sm:flex-row sm:items-center sm:justify-between">
                        <div className="min-w-0 text-sm">
                            {!selectedClassIds.length && <p className="text-gray-400">Select at least one class to generate a report.</p>}
                            {reportQuery.error && <p role="alert" className="text-red-300">{reportQuery.error.message}</p>}
                        </div>
                        <button
                            type="submit"
                            disabled={!selectedClassIds.length || reportQuery.isFetching || !classes.length}
                            className="flex min-h-11 shrink-0 items-center justify-center gap-2 rounded-lg bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-500 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            {reportQuery.isFetching ? <LoaderCircle size={17} className="animate-spin" /> : <FileText size={17} />}
                            {reportQuery.isFetching ? "Generating..." : "Generate report"}
                        </button>
                    </div>
                </form>

                {reportQuery.isFetching ? (
                    <div className="flex items-center justify-center gap-2 px-6 py-12 text-sm text-gray-400">
                        <LoaderCircle size={18} className="animate-spin" /> Loading fee data...
                    </div>
                ) : reportQuery.data && hasCurrentReport ? (
                    <section className="space-y-4 p-4 sm:p-6">
                        <div className="flex flex-wrap items-baseline justify-between gap-2">
                            <h3 className="text-base font-semibold text-white">Fee summary</h3>
                            <p className="text-sm text-gray-400">{reportQuery.data.studentCount} students</p>
                        </div>
                        <div className="grid gap-3 sm:grid-cols-3">
                            {[
                                ["Outstanding", totals.due],
                            ].map(([label, amount]) => (
                                <div key={label} className="rounded-lg border border-white/10 bg-white/[0.03] p-3">
                                    <p className="text-xs uppercase tracking-wide text-gray-400">{label}</p>
                                    <p className="mt-1 text-lg font-semibold text-white">{formatCurrency(amount)}</p>
                                </div>
                            ))}
                        </div>
                        {students.length ? (
                            <div className="overflow-x-auto rounded-lg border border-white/10">
                                <table className="min-w-[900px] w-full border-collapse text-left text-sm">
                                    <thead className="bg-white/[0.06] text-xs uppercase text-gray-400">
                                        <tr>{["Roll", "Student", "Father", "Class", "Status", "Due Months", "Due"].map((heading) => <th key={heading} className="px-3 py-2 font-medium">{heading}</th>)}</tr>
                                    </thead>
                                    <tbody>
                                        {students.map((student) => (
                                            <tr key={student.student_session_id} className="border-t border-white/[0.08] text-gray-200">
                                                <td className="px-3 py-2">{student.ROLL || "—"}</td>
                                                <td className="px-3 py-2 font-medium">{student.STUDENTS_NAME || "—"}</td>
                                                <td className="px-3 py-2">{student.FATHERS_NAME || "—"}</td>
                                                <td className="px-3 py-2">{student.CLASS || "—"}</td>
                                                <td className="px-3 py-2">{getStudentStatus(student)}</td>
                                                <td className="px-3 py-2">{student.isRTE ? "—" : student.dueMonths}</td>
                                                <td className="px-3 py-2">{student.isRTE ? "—" : formatCurrency(student.dueAmount)}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        ) : (
                            <p className="py-8 text-center text-sm text-gray-400">No students were found in the selected classes.</p>
                        )}
                    </section>
                ) : !reportQuery.error && (
                    <div className="px-6 py-12 text-center text-sm text-gray-500">Select classes and generate a fee report.</div>
                )}
            </div>
        </ReportModal>
    );
}

export default FeeReportModal;