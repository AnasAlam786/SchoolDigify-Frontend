import React from 'react'

function ControlPannel({ 
  searchQuery, onSearchChange, selectedClass, onClassChange, classes
}) {


  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-10">
      <div className="lg:col-span-2">
        <div className="group relative rounded-2xl bg-white/[0.04] border border-white/10 backdrop-blur-xl transition-all duration-300 focus-within:border-blue-500/50 focus-within:ring-2 focus-within:ring-blue-500/20">
          <div className="flex items-center px-5 py-4">
            <i className="fas fa-search text-gray-500 group-focus-within:text-blue-400 transition"></i>
            <input
              type="text"
              id="search-input"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Search by Name, Father's Name or Roll Number"
              className="ml-4 w-full bg-transparent text-white placeholder-gray-500 focus:outline-none text-sm md:text-base"
            />
          </div>
        </div>
      </div>

      <div className="relative">
        <div className="group relative rounded-2xl bg-white/[0.04] border border-white/10 backdrop-blur-xl transition-all duration-300 focus-within:border-blue-500/50 focus-within:ring-2 focus-within:ring-blue-500/20">
          <select
            id="classView"
            name="selectClass"
            value={selectedClass}
            onChange={(e) => onClassChange(e.target.value)}
            className="w-full appearance-none bg-transparent px-5 py-4 pr-12 text-gray-200 text-sm md:text-base focus:outline-none cursor-pointer"
          >
            <option value="" disabled hidden style={{ background: '#111111', color: '#e5e7eb' }}>
              Select Class
            </option>
            {classes && classes.length > 0 ? (
              classes.map((cls) => (
                <option key={cls.id} value={cls.id} style={{ background: '#111111', color: '#e5e7eb' }}>
                  {cls.CLASS ?? cls.class_name ?? cls.className}
                </option>
              ))
            ) : (
              <option value="" disabled style={{ background: '#111111', color: '#e5e7eb' }}>
                No classes available
              </option>
            )}
          </select>
          <i className="fas fa-chevron-down absolute right-5 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none group-focus-within:text-blue-400 transition"></i>
        </div>
      </div>
    </div>
  )
}

export default ControlPannel
