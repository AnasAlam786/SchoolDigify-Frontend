import { useState } from "react";

export default function StudentStatsSection({ stats }) {
  const [isOpen, setIsOpen] = useState(false);

  if (!stats) {
    return null;
  }

  const increColor = stats.increased_students > 0 ? "text-green-500" : "text-red-500";
  const growthColor = stats.new_students_growth_percentage > 0 ? "text-green-500" : "text-red-500";
  const growthArrow = stats.new_students_growth_percentage > 0 ? "fas fa-arrow-up" : "fas fa-arrow-down";

  return (
    <>
      <div
        className="flex justify-between items-center bg-gradient-to-br from-[#1a1a2e] to-[#16213e] rounded-xl p-3 cursor-pointer shadow-md transition-all duration-300 hover:from-[#16213e] hover:to-[#0f3460] hover:border-[#4361ee] hover:shadow-xl"
        onClick={() => setIsOpen((prev) => !prev)}
      >
        <h2 className="flex items-center text-[#8f94fb] font-semibold text-lg">
          <i className="fas fa-chart-line mr-3 text-xl" /> Student Statistics Overview
        </h2>
        <span className="accordion-icon text-[#8f94fb] transition-transform duration-300" style={{ transform: isOpen ? "rotate(180deg)" : "rotate(0deg)" }}>
          <i className="fas fa-chevron-down" />
        </span>
      </div>

      <div
        className="accordion-content overflow-hidden transition-all duration-500 ease-in-out mt-4"
        style={{ maxHeight: isOpen ? "1600px" : "0px" }}
      >
        <div className="pb-4">
          <div className="grid gap-6 justify-center" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(200px, 420px))" }}>
            <div className="stat-card relative w-full bg-gradient-to-br from-[#1e1e1e] to-[#2a2a2a] rounded-2xl p-6 shadow-md hover:shadow-xl hover:-translate-y-1.5 hover:border-[#4361ee] transition-all duration-300 overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#4e54c8] to-[#8f94fb]" />
              <div className="stat-icon w-12 h-12 flex items-center justify-center rounded-full bg-[#4f54c820] text-[#8f94fb] text-2xl mb-4">
                <i className="fas fa-user-plus" />
              </div>
              <h3 className="stat-title text-[#a0a7ff] font-medium mb-2 text-lg">Total Students</h3>
              <div className="stat-value text-white text-3xl font-bold mb-2">{stats.total_students}</div>
              <div className={`stat-meta flex items-center font-bold text-sm mb-4 ${increColor}`}>
                <span>{stats.increased_students > 0 ? "+" : ""}{stats.increased_students} students YoY</span>
                <i className="fas fa-chart-line ml-2" />
              </div>
              <ul className="stat-details text-[#8a92b2] text-sm border-t border-[#333] pt-4 space-y-2">
                <li className="flex justify-between"><span>New Admissions:</span> <span className="text-white font-medium">{stats.new_students}</span></li>
                <li className="flex justify-between"><span>Old Students:</span> <span className="text-white font-medium">{stats.old_students}</span></li>
              </ul>
            </div>

            <div className="stat-card relative w-full bg-gradient-to-br from-[#1e1e1e] to-[#2a2a2a] rounded-2xl p-6 shadow-md hover:shadow-xl hover:-translate-y-1.5 hover:border-[#4361ee] transition-all duration-300 overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#4e54c8] to-[#8f94fb]" />
              <div className="stat-icon w-12 h-12 flex items-center justify-center rounded-full bg-[#4f54c820] text-[#8f94fb] text-2xl mb-4">
                <i className="fas fa-chart-bar" />
              </div>
              <h3 className="stat-title text-[#a0a7ff] font-medium mb-2 text-lg">Student Growth</h3>
              <div className="stat-value text-white text-3xl font-bold mb-2">
                {stats.total_growth_percentage !== null ? `${stats.total_growth_percentage > 0 ? "+" : ""}${stats.total_growth_percentage.toFixed(1)}%` : "N/A"}
              </div>
              <div className={`stat-meta flex items-center text-sm font-bold ${growthColor} mb-4`}>
                <span>{stats.new_students_growth_percentage !== null ? `${stats.new_students_growth_percentage > 0 ? "+" : ""}${stats.new_students_growth_percentage.toFixed(1)}%` : "N/A"} from last year</span>
                <i className={`f ml-2 ${growthArrow}`} />
              </div>
              <ul className="stat-details text-[#8a92b2] text-sm border-t border-[#333] pt-4 space-y-2">
                <li className="flex justify-between"><span>Last Year New Admissions:</span> <span className="text-white font-medium">{stats.new_students_prev}</span></li>
                <li className="flex justify-between"><span>Last Year Students:</span> <span className="text-white font-medium">{stats.previous_year_students_total}</span></li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
