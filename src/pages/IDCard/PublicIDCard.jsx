import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { apiGet } from "../../api/api";
import StudentDetailsModal from "../utils/StudentsDetailsModal.jsx/StudentDetailsModal";
import FeeDrawer from "../utils/feeDrawer/FeeDrawer";
import TransactionModal from "../utils/feeTransactionsModal/TransactionModal";
import AttendanceCalendar from "../Attendance/dailyAttendance/Modals/AttendanceCalendar";

const imageBaseUrl = "https://lh3.googleusercontent.com/d/";

function MarksheetModal({ marksheet, onClose }) {
  if (!marksheet) {
    return (
      <Modal onClose={onClose} title="Marksheet">
        <p className="py-12 text-center text-slate-300">No marksheet is available for this session.</p>
      </Modal>
    );
  }

  const { exams = [], subjects = [], exam_totals: examTotals = {}, summary = {} } = marksheet;

  return (
    <Modal onClose={onClose} title="Marksheet">
      <div className="mb-4 flex flex-wrap gap-3">
        <Summary label="Overall" value={`${summary.overall_percentage ?? 0}%`} />
        <Summary label="Total marks" value={`${summary.grand_total ?? 0} / ${summary.grand_max_total ?? 0}`} />
      </div>
      <div className="overflow-x-auto rounded-xl border border-slate-700">
        <table className="min-w-full text-left text-sm text-slate-200">
          <thead className="bg-slate-800 text-xs uppercase text-slate-300">
            <tr>
              <th className="px-4 py-3">Exam</th>
              {subjects.map((subject) => <th key={subject.id} className="px-4 py-3">{subject.name}</th>)}
              <th className="px-4 py-3">Total</th>
              <th className="px-4 py-3">Percentage</th>
            </tr>
          </thead>
          <tbody>
            {exams.map((exam) => {
              const totals = examTotals[String(exam.id)] || {};
              return (
                <tr key={exam.id} className="border-t border-slate-700">
                  <th className="px-4 py-3 font-semibold">{exam.name}</th>
                  {subjects.map((subject) => (
                    <td key={subject.id} className="px-4 py-3">
                      {subject.marks?.[String(exam.id)] ?? "—"}
                    </td>
                  ))}
                  <td className="px-4 py-3">{totals.total ?? 0} / {totals.max_total ?? 0}</td>
                  <td className="px-4 py-3">{totals.percentage ?? 0}%</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </Modal>
  );
}

function Modal({ title, onClose, children }) {
  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/70 p-3" onMouseDown={(event) => {
      if (event.target === event.currentTarget) onClose();
    }}>
      <section className="max-h-[92vh] w-full max-w-5xl overflow-hidden rounded-2xl border border-slate-700 bg-slate-900 shadow-2xl">
        <header className="flex items-center justify-between border-b border-slate-700 px-5 py-4">
          <h2 className="text-xl font-bold text-white">{title}</h2>
          <button type="button" onClick={onClose} aria-label="Close" className="rounded-lg px-3 py-2 text-slate-300 hover:bg-slate-800">✕</button>
        </header>
        <div className="max-h-[calc(92vh-4rem)] overflow-auto p-4 sm:p-6">{children}</div>
      </section>
    </div>
  );
}

function Summary({ label, value }) {
  return (
    <div className="min-w-36 rounded-xl border border-slate-700 bg-slate-800/70 px-4 py-3">
      <p className="text-xs uppercase tracking-wide text-slate-400">{label}</p>
      <p className="mt-1 text-lg font-semibold text-white">{value}</p>
    </div>
  );
}

function FeatureCard({ title, description, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="rounded-2xl border border-slate-700 bg-slate-900/80 p-5 text-left shadow-lg transition hover:-translate-y-0.5 hover:border-sky-500/60 hover:bg-slate-800"
    >
      <h2 className="text-lg font-bold text-white">{title}</h2>
      <p className="mt-2 text-sm text-slate-400">{description}</p>
      <span className="mt-5 inline-flex text-sm font-semibold text-sky-300">View details →</span>
    </button>
  );
}

export default function PublicIDCard() {
  const { token } = useParams();
  const [status, setStatus] = useState("loading");
  const [data, setData] = useState(null);
  const [error, setError] = useState("");
  const [activePanel, setActivePanel] = useState(null);

  useEffect(() => {
    let cancelled = false;

    async function loadStudentCard() {
      setStatus("loading");
      setError("");
      try {
        const response = await apiGet(`/api/public/idcard/${encodeURIComponent(token || "")}`);
        const payload = await response.json();
        if (!response.ok) {
          throw new Error(payload.error || "Unable to load this ID card.");
        }
        if (!cancelled) {
          setData(payload);
          setStatus("success");
        }
      } catch (requestError) {
        if (!cancelled) {
          setError(requestError.message || "Unable to load this ID card.");
          setStatus("error");
        }
      }
    }

    loadStudentCard();
    return () => { cancelled = true; };
  }, [token]);

  const profileStudent = useMemo(() => {
    if (!data?.student) return null;
    return {
      ...data.student,
    };
  }, [data]);
  const initialFeeStudents = useMemo(
    () => (data?.fees ? [data.fees] : []),
    [data],
  );

  if (status === "loading") {
    return <main className="grid min-h-screen place-items-center bg-slate-950 text-slate-200">Loading student information…</main>;
  }

  if (status === "error") {
    return (
      <main className="grid min-h-screen place-items-center bg-slate-950 p-6 text-center text-white">
        <div>
          <h1 className="text-2xl font-bold">ID card unavailable</h1>
          <p className="mt-2 text-slate-400">{error}</p>
        </div>
      </main>
    );
  }

  const { student, school, transactions, marksheet } = data;

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-blue-950 px-4 py-8 text-white sm:px-6">
      <div className="mx-auto max-w-5xl">
        <header className="mb-8 flex flex-col items-center text-center">
          {school.logo && (
            <img src={school.logo} alt={`${school.name} logo`} className="mb-4 h-20 w-20 rounded-2xl bg-white object-contain p-2" />
          )}
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-sky-300">{school.name}</p>
          {school.udise && <p className="mt-1 text-xs text-slate-400">UDISE: {school.udise}</p>}
          <div className="mt-6 flex flex-col items-center gap-4 sm:flex-row sm:text-left">
            {student.image && (
              <img src={`${imageBaseUrl}${student.image}=s220`} alt={student.name} className="h-24 w-24 rounded-full border-4 border-sky-500/30 object-cover" />
            )}
            <div>
              <h1 className="text-3xl font-extrabold">{student.name}</h1>
              <p className="mt-1 text-slate-300">Father: {student.father_name || "—"}</p>
              <p className="mt-1 text-slate-400">
                Class {student.class}{student.section ? ` - ${student.section}` : ""} · Roll {student.roll ?? "—"} · {student.session_year}
              </p>
            </div>
          </div>
        </header>

        <section className="grid gap-4 sm:grid-cols-2">
          <FeatureCard title="Student details" description="View the student's profile and school information." onClick={() => setActivePanel("details")} />
          <FeatureCard title="Fee details" description="Review fee items, payment status, and amounts due." onClick={() => setActivePanel("fees")} />
          <FeatureCard title="Fee transactions" description="View recorded fee payments and transaction breakdowns." onClick={() => setActivePanel("transactions")} />
          <FeatureCard title="Marksheet" description="Review exam-wise marks and overall results." onClick={() => setActivePanel("marksheet")} />
          <FeatureCard title="Attendance" description="View the monthly attendance calendar and session summary." onClick={() => setActivePanel("attendance")} />
        </section>

        <p className="mt-8 text-center text-xs text-slate-500">This page is available to anyone with this ID card QR link.</p>
      </div>

      {activePanel === "details" && (
        <StudentDetailsModal student={profileStudent} onClose={() => setActivePanel(null)} />
      )}
      {activePanel === "fees" && (
        <FeeDrawer
          feeDrawerStudent={{ studentSessionId: student.student_session_id }}
          initialStudents={initialFeeStudents}
          readOnly
          onClose={() => setActivePanel(null)}
          onSetupFeeSession={() => {}}
          setTransactionModalOpen={() => {}}
        />
      )}
      {activePanel === "transactions" && (
        <TransactionModal
          transactionModalStudent={{ studentSessionId: student.student_session_id }}
          initialTransactions={transactions}
          readOnly
          onClose={() => setActivePanel(null)}
        />
      )}
      {activePanel === "marksheet" && <MarksheetModal marksheet={marksheet} onClose={() => setActivePanel(null)} />}
      {activePanel === "attendance" && (
        <AttendanceCalendar
          student={{ student_session_id: student.student_session_id }}
          qrToken={token}
          onClose={() => setActivePanel(null)}
        />
      )}
    </main>
  );
}
