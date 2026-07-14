import React, { useState, useEffect } from "react";
import { apiGet } from "../../../api/api";

const monthNames = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

const statusInfo = {
  PRESENT: { label: "Present", abbr: "P", className: "status-present" },
  ABSENT: { label: "Absent", abbr: "A", className: "status-absent" },
  HALF_DAY: { label: "Half Day", abbr: "H", className: "status-half-day" },
  LEAVE: { label: "Leave", abbr: "L", className: "status-leave" },
  HOLIDAY: { label: "Holiday", abbr: "O", className: "status-holiday" },
};

const getStatus = (s) => statusInfo[s] || { label: "Unmarked", abbr: "—", className: "status-unmarked" };

export default function AttendanceCalendar({ student, onClose }) {
  const today = new Date();
  const [year, setYear] = useState(today.getFullYear());
  const [month, setMonth] = useState(today.getMonth() + 1);
  const [isLoading, setLoading] = useState(false);

  // All data in a single state
  const [attendanceData, setAttendanceData] = useState({
    records: [],
    monthly_summary: {},
    session_summary: {},
  });

  const loadMonth = async () => {
    if (!student?.student_session_id) return;

    setLoading(true);
    setAttendanceData({ records: [], monthly_summary: {}, session_summary: {},
  })

    try {
      const query = new URLSearchParams({ student_session_id: student.student_session_id, year, month })
      const response = await apiGet(`/api/get_student_attendance_month?${query}`)

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
        return
      }

      const data = await response.json();

      setAttendanceData({
        records: data.records || [],
        monthly_summary: data.monthly_summary || {},
        session_summary: data.session_summary || {},
      });
    } catch (error) {
      showAlert(500, "Failed to load attendance:", error)
      console.error("Failed to load attendance:", error);

      setAttendanceData({
        records: [],
        monthly_summary: {},
        session_summary: {},
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (student) loadMonth();
  }, [student, year, month]);

  if (!student) return null;

  const { records, monthly_summary: ms, session_summary: ss } = attendanceData;

  const isCurrentMonth = year === today.getFullYear() && month === today.getMonth() + 1;
  const currentDay = today.getDate();
  const firstDay = new Date(year, month - 1, 1).getDay();
  const daysInMonth = new Date(year, month, 0).getDate();
  const recordMap = {};
  records.forEach(r => (recordMap[r.date] = r.status));

  const changeMonth = (offset) => {
    const d = new Date(year, month - 1 + offset, 1);
    setYear(d.getFullYear());
    setMonth(d.getMonth() + 1);
  };


  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <style>{`
        .student-attendance-modal { width: min(100vw - 2rem, 1180px); max-width: min(100vw - 2rem, 1180px); max-height: calc(100vh - 2rem); border-radius: 2rem; }
        .student-attendance-modal .calendar-grid { min-height: 320px; display: grid; grid-template-columns: repeat(7, minmax(0, 1fr)); gap: 0.75rem; overflow-x: visible; overflow-y: visible; padding-bottom: 0.35rem; }
        .student-attendance-modal .weekday-row { display: grid; grid-template-columns: repeat(7, minmax(0, 1fr)); gap: 0.75rem; margin-bottom: 0.5rem; }
        .student-attendance-modal .weekday-row .calendar-weekday { color: #9ca3af; font-size: 0.68rem; letter-spacing: 0.16em; text-transform: uppercase; text-align: center; font-weight: 600; }
        .student-attendance-modal .calendar-cell { min-height: 88px; border-radius: 1.25rem; border: 1px solid rgba(255,255,255,0.08); background-color: rgba(28,28,28,0.95); padding: 0.85rem; transition: transform 0.2s ease, background-color 0.2s ease, box-shadow 0.2s ease; display: flex; flex-direction: column; justify-content: space-between; backdrop-filter: blur(4px); overflow: hidden; }
        .student-attendance-modal .calendar-cell:hover { transform: translateY(-2px); box-shadow: 0 14px 40px rgba(0,0,0,0.3); }
        .student-attendance-modal .calendar-cell.today { border-color: rgba(99,102,241,0.8); box-shadow: 0 0 0 1px rgba(99,102,241,0.25); }
        .student-attendance-modal .calendar-cell .day-number { font-weight: 700; color: #f5f5f5; font-size: 1.1rem; }
        .student-attendance-modal .calendar-cell .status-chip { display: inline-flex; align-items: center; justify-content: center; padding: 0.35rem 0.75rem; border-radius: 999px; font-size: 0.75rem; letter-spacing: 0.01em; line-height: 1.2; font-weight: 600; white-space: nowrap; max-width: 100%; overflow: hidden; text-overflow: ellipsis; min-width: 0; align-self: flex-start; }
        .status-present { background: rgba(16,185,129,0.15); color: #10b981; border: 1px solid rgba(16,185,129,0.25); }
        .status-absent  { background: rgba(239,68,68,0.14); color: #ef4444; border: 1px solid rgba(239,68,68,0.28); }
        .status-half-day { background: rgba(245,158,11,0.14); color: #f59e0b; border: 1px solid rgba(245,158,11,0.28); }
        .status-leave   { background: rgba(14,165,233,0.14); color: #0ea5e9; border: 1px solid rgba(14,165,233,0.28); }
        .status-holiday { background: rgba(139,92,246,0.14); color: #8b5cf6; border: 1px solid rgba(139,92,246,0.28); }
        .status-unmarked { background: rgba(255,255,255,0.06); color: #9ca3af; border: 1px solid rgba(255,255,255,0.1); }
        .student-attendance-summary { background: rgba(255,255,255,0.02); border: 1px solid rgba(255,255,255,0.06); border-radius: 1.75rem; padding: 1.25rem; }
        .student-attendance-summary .summary-item { display: flex; align-items: center; justify-content: space-between; gap: 0.75rem; padding: 0.9rem 1rem; border-radius: 1.25rem; background: rgba(255,255,255,0.02); border: 1px solid rgba(255,255,255,0.05); font-size: 0.95rem; }
        .student-attendance-summary .summary-item span:last-child { font-weight: 700; font-size: 1.1rem; }
        .student-attendance-legend { display: grid; grid-template-columns: repeat(2, minmax(0,1fr)); gap: 0.75rem; }
        .student-attendance-legend .legend-chip { display: flex; align-items: center; gap: 0.75rem; padding: 1rem 1.1rem; border-radius: 1.25rem; border: 1px solid rgba(255,255,255,0.06); background: rgba(255,255,255,0.02); font-size: 0.9rem; }
        .student-attendance-legend .legend-chip span { width: 0.9rem; height: 0.9rem; border-radius: 999px; display: inline-flex; }
        @media (max-width: 768px) {
          .student-attendance-modal { width: calc(100vw - 1rem); max-height: calc(100vh - 1rem); border-radius: 1.5rem; }
          .student-attendance-modal .calendar-grid { gap: 0.3rem; min-height: auto; overflow-x: visible !important; padding-bottom: 0; }
          .student-attendance-modal .weekday-row { gap: 0.3rem; margin-bottom: 0.25rem; }
          .student-attendance-modal .weekday-row .calendar-weekday { font-size: 0.5rem; letter-spacing: 0.05em; }
          .student-attendance-modal .calendar-cell { min-height: 64px; padding: 0.4rem 0.2rem; border-radius: 0.7rem; }
          .student-attendance-modal .calendar-cell .day-number { font-size: 0.85rem; }
          .student-attendance-modal .calendar-cell .flex.items-center.justify-between .text-\\[10px\\] { display: none !important; }
          .student-attendance-modal .calendar-cell .status-chip { padding: 0.2rem 0.35rem; font-size: 0.65rem; margin-top: 0.25rem; }
          .student-attendance-summary { padding: 0.9rem; }
          .student-attendance-summary .summary-item { padding: 0.7rem 0.8rem; font-size: 0.85rem; }
          .student-attendance-summary .summary-item span:last-child { font-size: 1rem; }
          .student-attendance-legend { grid-template-columns: 1fr; gap: 0.5rem; }
          .student-attendance-legend .legend-chip { padding: 0.8rem 0.9rem; font-size: 0.8rem; }
          .student-attendance-modal .flex.flex-nowrap.items-center.gap-3 { flex-wrap: nowrap !important; overflow-x: auto; padding-bottom: 2px; }
          .student-attendance-modal .flex.flex-nowrap.items-center.gap-3::-webkit-scrollbar { display: none; }
          .student-attendance-modal .flex.flex-nowrap.items-center.gap-3 { -ms-overflow-style: none; scrollbar-width: none; }
        }
        @media (max-width: 520px) {
          .student-attendance-modal .calendar-grid { gap: 0.2rem; }
          .student-attendance-modal .weekday-row { gap: 0.2rem; }
          .student-attendance-modal .weekday-row .calendar-weekday { font-size: 0.45rem; }
          .student-attendance-modal .calendar-cell { min-height: 52px; padding: 0.25rem 0.15rem; border-radius: 0.6rem; }
          .student-attendance-modal .calendar-cell .day-number { font-size: 0.75rem; }
          .student-attendance-modal .calendar-cell .status-chip { padding: 0.15rem 0.25rem; font-size: 0.6rem; min-width: 1.6rem; text-align: center; justify-content: center; }
        }
        @media (max-width: 1024px) {
          .student-attendance-modal .calendar-grid { overflow-x: auto; padding-bottom: 0.5rem; }
          .student-attendance-modal .calendar-grid::-webkit-scrollbar { display: none; }
          .student-attendance-modal .calendar-grid { -ms-overflow-style: none; scrollbar-width: none; }
        }
        .student-attendance-modal .modal-content-scrollable { overflow-y: auto; flex: 1 1 0%; min-height: 0; }
      `}</style>
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full student-attendance-modal mx-auto bg-[#111111] border border-white/10 rounded-[30px] shadow-2xl flex flex-col max-h-[calc(100vh-2rem)]">
        {/* Header */}
        <div className="flex flex-col gap-4 p-5 border-b border-white/10 sm:flex-row sm:items-center sm:justify-between bg-[#111111] rounded-t-[30px]">
          <div className="min-w-0">
            <p className="text-sm text-neutral-400 mb-1">Class · Session attendance</p>
            <h3 className="text-2xl sm:text-3xl font-semibold tracking-tight text-white">
              {student.STUDENTS_NAME || "Student"}
            </h3>
          </div>
          <div className="flex flex-nowrap items-center gap-2 sm:gap-3 overflow-x-auto pb-0.5">
            <button onClick={() => changeMonth(-1)} className="inline-flex items-center justify-center h-10 sm:h-11 px-3 sm:px-4 rounded-xl sm:rounded-2xl bg-neutral-800 text-neutral-200 hover:bg-neutral-700 transition shadow-md flex-shrink-0 text-sm sm:text-base">
              <i className="fas fa-chevron-left mr-1 sm:mr-2" /> Prev
            </button>
            <div className="inline-flex items-center justify-center rounded-xl sm:rounded-2xl bg-neutral-800 border border-white/10 px-3 py-2 text-sm font-medium text-white shadow-inner flex-shrink-0">
              {monthNames[month - 1]} {year}
            </div>
            <button onClick={() => changeMonth(1)} className="inline-flex items-center justify-center h-10 sm:h-11 px-3 sm:px-4 rounded-xl sm:rounded-2xl bg-neutral-800 text-neutral-200 hover:bg-neutral-700 transition shadow-md flex-shrink-0 text-sm sm:text-base">
              Next<i className="fas fa-chevron-right ml-1 sm:ml-2" />
            </button>
            <button onClick={onClose} className="inline-flex items-center justify-center h-10 w-10 sm:h-11 sm:w-11 rounded-xl sm:rounded-2xl bg-neutral-800 text-neutral-300 hover:text-white hover:bg-neutral-700 transition shadow-md flex-shrink-0">
              <i className="fas fa-times" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="modal-content-scrollable p-3">
          <div className="grid gap-4 lg:grid-cols-[1fr_0.48fr]">
            {/* Calendar */}
            <div className="flex flex-col gap-4">
              <div className="weekday-row">
                <div className="calendar-weekday">Sun</div>
                <div className="calendar-weekday">Mon</div>
                <div className="calendar-weekday">Tue</div>
                <div className="calendar-weekday">Wed</div>
                <div className="calendar-weekday">Thu</div>
                <div className="calendar-weekday">Fri</div>
                <div className="calendar-weekday">Sat</div>
              </div>
              <div className="calendar-grid">

                {isLoading ? (
                  <div className="col-span-7 py-20 text-center text-neutral-400">
                    Loading attendance...
                  </div>
                ) : (
                  <>
                  {/* This Create Empty cell befor day 1 */}
                    {Array.from({ length: firstDay }).map((_, index) => (
                      <div key={`empty-${index}`}/>
                    ))}

                    {Array.from({ length: daysInMonth }).map((_, index) => {
                      const day = index + 1;

                      const dateKey = `${year}-${String(month).padStart( 2, "0")}-${String(day).padStart(2, "0")}`;

                      return (
                        <AttendanceCell
                          key={day}
                          day={day}
                          status={recordMap[dateKey] || "UNMARKED"}
                          isToday={isCurrentMonth && day === currentDay}
                        />
                      );
                    })}
                  </>
                )}
              </div>
            </div>

            {/* Summaries */}
            <div className="space-y-5">

              <div className="student-attendance-summary pb-4">
                <div className="flex items-center justify-between mb-4 gap-3">
                  <div>
                    <p className="text-sm text-neutral-400">Current month</p>
                    <p className="text-sm text-neutral-300">{monthNames[month - 1]} {year}</p>
                  </div>
                  <div className="text-neutral-400 text-xs">Summary</div>
                </div>
                <div className="grid gap-3 sm:grid-cols-2">
                  <div className="summary-item"><span className="text-neutral-400">Present</span><span className="text-emerald-400">{ms.present || 0}</span></div>
                  <div className="summary-item"><span className="text-neutral-400">Absent</span><span className="text-red-400">{ms.absent || 0}</span></div>
                  <div className="summary-item"><span className="text-neutral-400">Half Day</span><span className="text-amber-400">{ms.half_day || 0}</span></div>
                  <div className="summary-item"><span className="text-neutral-400">Holiday</span><span className="text-violet-400">{ms.holiday || 0}</span></div>
                  <div className="summary-item"><span className="text-neutral-400">Unmarked</span><span className="text-neutral-300">{ms.unmarked || 0}</span></div>
                  <div className="summary-item"><span className="text-neutral-400">Leave</span><span className="text-sky-400">{ms.leave || 0}</span></div>
                </div>
              </div>


              <div className="student-attendance-summary pb-4">
                <div className="flex items-center justify-between mb-4 gap-3">
                  <div>
                    <p className="text-sm text-neutral-400">Session overview</p>
                    <p className="text-sm text-neutral-300">{ss.range || "Session overview"}</p>
                  </div>
                  <div className="text-neutral-400 text-xs">Total days</div>
                </div>
                <div className="grid gap-3 sm:grid-cols-2">
                  <div className="summary-item"><span className="text-neutral-400">Present</span><span className="text-emerald-400">{ss.present || 0}</span></div>
                  <div className="summary-item"><span className="text-neutral-400">Absent</span><span className="text-red-400">{ss.absent || 0}</span></div>
                  <div className="summary-item"><span className="text-neutral-400">Half Day</span><span className="text-amber-400">{ss.half_day || 0}</span></div>
                  <div className="summary-item"><span className="text-neutral-400">Holiday</span><span className="text-violet-400">{ss.holiday || 0}</span></div>
                  <div className="summary-item"><span className="text-neutral-400">Leave</span><span className="text-sky-400">{ss.leave || 0}</span></div>
                  <div className="summary-item"><span className="text-neutral-400">Unmarked</span><span className="text-neutral-300">{ss.unmarked || 0}</span></div>
                </div>
                <div className="mt-4 rounded-2xl bg-neutral-800/50 border border-white/5 p-4">
                  <p className="text-neutral-400 text-sm">Session attendance</p>
                  <p className="text-white text-xl font-semibold mt-2">{ss.present_percent || 0}% Present</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function AttendanceCell({ day, status, isToday }) {
  const info = getStatus(status);

  return (
    <div className={`calendar-cell ${isToday ? "today" : ""}`}>
      <div className="flex items-center justify-between mb-3">
        <span className="day-number text-sm text-white">{day}</span>
        <span className="text-[10px] uppercase tracking-[0.2em] text-neutral-500">
          {info.abbr}
        </span>
      </div>

      <div className={`status-chip ${info.className}`}>
        <span className="hidden sm:inline">{info.label}</span>
        <span className="sm:hidden">{info.abbr}</span>
      </div>
    </div>
  );
}