import React from 'react'
import usePermission from '../../../hooks/usePermission'

function Header({ onOpenMarkHolidayModal, onOpenViewHolidayModal }) {
  const {hasPermission, PERMISSIONS} = usePermission()

  return (
    <header className="mb-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold text-white tracking-tight">
            Attendance Management System
          </h1>
          <p className="text-gray-400 mt-2 text-sm md:text-base">
            Efficiently track and manage student attendance with a clean and modern interface
          </p>
        </div>

        <div className="flex items-center gap-3">

          { hasPermission(PERMISSIONS.MARK_HOLIDAY) && (<button
            onClick={onOpenMarkHolidayModal}
            className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 
                       text-white px-5 py-2 rounded-xl font-semibold shadow-lg shadow-blue-900/20 
                       hover:shadow-blue-900/30 transition-all duration-300 flex items-center gap-2 
                       transform hover:-translate-y-0.5"
          >
            <i className="fas fa-plus text-white"></i>
            Mark Holiday
          </button>)}

          {hasPermission(PERMISSIONS.VIEW_HOLIDAYS) && (<button
            onClick={onOpenViewHolidayModal}
            className="bg-white/5 hover:bg-white/10 text-white px-4 py-2 rounded-xl font-medium transition"
          >
            <i className="far fa-calendar-alt mr-2"></i>View Holidays
          </button>)}
        </div>
      </div>
    </header>
  )
}

export default Header
