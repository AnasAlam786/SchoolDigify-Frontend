import React from 'react'

function AttendanceSummary({ summary, date, setAbsenteesModal }) {
  const total = summary.total || 0
  const present = summary.present || 0
  const absent = summary.absent || 0
  const halfDay = summary.half_day || 0
  const notMarked = summary.not_marked || 0

  const presentPct = total > 0 ? ((present / total) * 100).toFixed(1) : 0
  const absentPct = total > 0 ? ((absent / total) * 100).toFixed(1) : 0
  const halfDayPct = total > 0 ? ((halfDay / total) * 100).toFixed(1) : 0
  const notMarkedPct = total > 0 ? ((notMarked / total) * 100).toFixed(1) : 0

  return (
    <div className="attendance-card rounded-2xl p-4 md:p-6 mb-6 bg-[#1C1C1C]">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-white">Class Attendance</h1>
          <p className="text-gray-400 mt-1 text-sm md:text-base">Real-time attendance summary</p>
        </div>
        <div className="mt-4 md:mt-0">
          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-primary-opacity text-primary border border-primary">
            <i className="fas fa-calendar-alt mr-2"></i>
            {date}
          </span>
        </div>
      </div>

      {/* Two-column layout: KPI donut + compact stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Donut KPI (left card) */}
        <div className="rounded-xl p-4 md:p-6 bg-[#101010] flex items-center justify-center">
          <div className="w-full flex flex-col md:flex-row items-center gap-4">
            <div className="mx-auto">
              {/* Donut container */}
              <div
                className="relative rounded-full"
                style={{
                  width: '120px',
                  height: '120px',
                  borderRadius: '50%',
                  background: `conic-gradient(#10b981 ${presentPct}%, rgba(255,255,255,0.06) ${presentPct}% 100%)`,
                  boxShadow: 'inset 0 -6px 18px rgba(0,0,0,0.6), 0 1px 0 rgba(255,255,255,0.02)',
                }}
              >
                {/* Inner circle (cutout) */}
                <div
                  className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-[#0F1724] rounded-full flex flex-col items-center justify-center"
                  style={{
                    width: '80px',
                    height: '80px',
                    boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.02)',
                  }}
                >
                  <div className="text-white font-bold text-lg">{presentPct}%</div>
                  <div className="text-gray-400 text-xs">Present</div>
                </div>
              </div>
            </div>

            <div className="flex-1 text-center md:text-left">
              <div className="text-gray-400 text-xs md:text-sm">Total Students</div>
              <div className="text-white font-extrabold text-2xl md:text-3xl mt-1">{total}</div>
              <div className="mt-3 flex flex-wrap items-center gap-3 justify-center md:justify-start">
                <div className="flex items-center gap-2">
                  <span className="inline-block w-2 h-2 rounded-full bg-success"></span>
                  <span className="text-gray-400 text-xs">{presentPct}% Present</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="inline-block w-2 h-2 rounded-full bg-danger"></span>
                  <span className="text-gray-400 text-xs">{absentPct}% Absent</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats card (right) */}
        <div className="rounded-xl p-4 md:p-6 bg-[#101010] flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-xs md:text-sm font-medium">Attendance Overview</p>
              <h3 className="text-white font-bold text-lg md:text-xl mt-1">Quick Summary</h3>
            </div>
            <div className="text-gray-400 text-xs">Last updated: {date}</div>
          </div>

          <div className="mt-4 space-y-4">
            {/* Present */}
            <div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-success-opacity flex items-center justify-center">
                    <i className="fas fa-check text-success"></i>
                  </div>
                  <div>
                    <div className="text-gray-400 text-xs">Present</div>
                    <div className="text-white font-bold text-lg">{present}</div>
                  </div>
                </div>
                <div className="w-1/3">
                  <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                    <div className="h-2 rounded-full bg-success" style={{ width: `${presentPct}%` }}></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Absent */}
            <div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-danger-opacity flex items-center justify-center">
                    <i className="fas fa-times text-danger"></i>
                  </div>
                  <div>
                    <div className="text-gray-400 text-xs">Absent</div>
                    <div className="text-white font-bold text-lg cursor-pointer text-red-400" onClick={() => setAbsenteesModal(true)}>
                      {absent}
                    </div>
                  </div>
                </div>
                <div className="w-1/3">
                  <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                    <div className="h-2 rounded-full bg-danger" style={{ width: `${absentPct}%` }}></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Micro stats */}
            <div className="flex gap-3 flex-wrap mt-2">
              <div className="px-3 py-2 bg-white/5 rounded-full flex items-center gap-2 text-xs">
                <span className="inline-block w-2 h-2 rounded-full bg-warning"></span>
                <span className="text-gray-300">{halfDay}</span>
                <span className="text-gray-400">Half Day</span>
              </div>
              <div className="px-3 py-2 bg-white/5 rounded-full flex items-center gap-2 text-xs">
                <span className="inline-block w-2 h-2 rounded-full bg-neutral"></span>
                <span className="text-gray-300">{notMarked}</span>
                <span className="text-gray-400">Not Marked</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AttendanceSummary
