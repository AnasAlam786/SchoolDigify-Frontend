import React from 'react'

function ControlPannel({
  classes,
  selectedClass,
  selectedDate,
  onClassChange,
  onDateChange,
  onGetAttendance,
  loadingStudentsData,
}) 



{
  return (
    <section className="w-full mb-10 p-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-6">
        {/* Class Selector */}
        <div className="glass-card rounded-xl p-5">
          <label className="block text-sm font-semibold text-gray-300 mb-2 ml-1">
            <i className="fas fa-graduation-cap mr-2 text-indigo-400"></i>Class
          </label>
          <div className="relative">
            <select
              value={selectedClass}
              onChange={(e) => onClassChange(e.target.value)}
              required
              className="w-full bg-[#1A1A1A] border border-white/10 text-gray-100 text-base p-3 pl-4 rounded-lg focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 outline-none transition-all appearance-none cursor-pointer"
            >
              <option disabled value="" className="bg-[#1A1A1A] text-gray-500">
                Select Class
              </option>
              {classes && classes.length > 0 ? (
                classes.map((cls) => (
                  <option key={cls.id} value={cls.id} className="bg-[#1A1A1A] text-gray-100">
                    {cls.class_name}
                  </option>
                ))
              ) : (
                <option disabled>No classes available</option>
              )}
            </select>
            <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
              <i className="fas fa-chevron-down"></i>
            </div>
          </div>
        </div>

        {/* Date Picker */}
        <div className="glass-card rounded-xl p-5">
          <label className="block text-sm font-semibold text-gray-300 mb-2 ml-1">
            <i className="fas fa-calendar-alt mr-2 text-blue-400"></i>Date
          </label>
          <div className="relative">
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => onDateChange(e.target.value)}
              required
              className="w-full bg-[#1A1A1A] border border-white/10 text-gray-100 text-base p-3 pl-4 pr-10 rounded-lg focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 outline-none transition-all cursor-pointer"
            />
          </div>
        </div>
      </div>

      {/* Get Attendance Button */}
      <div className="lg:col-span-2 mt-3 flex justify-center">
        <button
          onClick={onGetAttendance}
          disabled={loadingStudentsData}
          className="w-full lg:w-1/2 bg-gradient-to-r from-purple-600 to-indigo-600 
                     hover:from-purple-700 hover:to-indigo-700 text-white font-semibold 
                     py-3.5 px-6 rounded-xl transition-all duration-300 shadow-xl 
                     shadow-purple-900/30 hover:shadow-purple-900/40 
                     flex items-center justify-center gap-3 transform hover:-translate-y-0.5 group
                     disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loadingStudentsData ? (
            <>
              <div className="h-5 flex items-center justify-center">
                <span className="loader-spin w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin"></span>
              </div>
              <span>Loading...</span>
            </>
          ) : (
            <>
              <div className="p-1.5 bg-white/20 rounded-lg group-hover:scale-110 transition-transform duration-300">
                <i className="fas fa-calendar-plus text-white"></i>
              </div>
              <span>Get Attendance</span>
            </>
          )}
        </button>
      </div>
    </section>
  )
}

export default ControlPannel
