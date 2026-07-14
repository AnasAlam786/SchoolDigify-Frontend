import React from 'react'

export function ErrorState({ message }) {
  return (
    <div className="py-16 px-4 text-center">
      <div className="max-w-xl mx-auto rounded-2xl border border-red-600/30 bg-[#1A1A1A]/80 p-10">
        <div className="mb-6 inline-flex items-center justify-center rounded-3xl bg-red-600/10 p-5 text-red-300">
          <i className="fas fa-exclamation-triangle text-3xl"></i>
        </div>
        <h3 className="text-3xl md:text-4xl font-bold text-white mb-3">Unable to load marksheets</h3>
        <p className="text-gray-300 text-lg md:text-xl mb-6">{message || 'Something went wrong while fetching student marksheets.'}</p>
      </div>
    </div>
  )
}

export function NoStudentsState({ onRetry }) {
  return (
    <div id="results" className="text-center py-16 px-4">
      <div className="max-w-md mx-auto">
        <div className="mb-8 relative">
          <div className="w-24 h-24 mx-auto bg-gradient-to-br from-amber-700/30 to-orange-800/30 rounded-2xl flex items-center justify-center shadow-2xl border border-amber-600/40 backdrop-blur-sm">
            <i className="fas fa-users-slash text-4xl text-amber-300"></i>
          </div>
          <div className="absolute -z-10 inset-0 flex justify-center">
            <div className="w-32 h-32 bg-blue-600/10 rounded-full blur-3xl"></div>
          </div>
        </div>
        <h3 className="text-3xl md:text-4xl font-bold text-white mb-3">No Students In This Class</h3>
        <p className="text-gray-300 text-lg md:text-xl mb-8 max-w-sm mx-auto">
          It looks like there are no student records for the selected class. You can add new students or retry loading the class.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <a
            href="/admission"
            className="px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 text-white rounded-xl font-medium flex items-center justify-center gap-3 transition-all duration-200 shadow-lg hover:shadow-xl"
          >
            <i className="fas fa-user-plus"></i>
            Add Student
          </a>
          <button
            type="button"
            onClick={onRetry}
            className="px-6 py-3 bg-[#1A1A1A]/80 hover:bg-[#1A1A1A]/90 text-white rounded-xl font-medium flex items-center justify-center gap-3 transition-all duration-200 border border-gray-700/70 backdrop-blur-sm"
          >
            <i className="fas fa-redo"></i>
            Retry Loading
          </button>
        </div>
      </div>
    </div>
  )
}

export function NoClassSelectedState({ onSelectClass, onSearch }) {
  return (
    <div id="results" className="text-center py-16 px-4">
      <div className="max-w-md mx-auto">
        <div className="mb-8 relative">
          <div className="w-24 h-24 mx-auto bg-gradient-to-br from-blue-700/30 to-indigo-800/30 rounded-2xl flex items-center justify-center shadow-2xl border border-blue-600/40 backdrop-blur-sm">
            <i className="fas fa-file-alt text-4xl text-blue-300"></i>
          </div>
          <div className="absolute -z-10 inset-0 flex justify-center">
            <div className="w-32 h-32 bg-blue-600/10 rounded-full blur-3xl"></div>
          </div>
        </div>
        <h3 className="text-3xl md:text-4xl font-bold text-white mb-3">No Marksheets Loaded</h3>
        <p className="text-gray-300 text-lg md:text-xl mb-8 max-w-sm mx-auto">
          Select a class from the dropdown above to view student marksheets
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            type="button"
            onClick={onSelectClass}
            className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white rounded-xl font-medium flex items-center justify-center gap-3 transition-all duration-200 shadow-lg hover:shadow-xl"
          >
            <i className="fas fa-graduation-cap"></i>
            Select Class
          </button>
          <button
            type="button"
            onClick={onSearch}
            className="px-6 py-3 bg-[#1A1A1A]/80 hover:bg-[#1A1A1A]/90 text-white rounded-xl font-medium flex items-center justify-center gap-3 transition-all duration-200 border border-gray-700/70 backdrop-blur-sm"
          >
            <i className="fas fa-search"></i>
            Search Students
          </button>
        </div>
      </div>
    </div>
  )
}

export function SkeletonLoader() {
  return (
    <div id="skeleton-loader" className="space-y-6">
      {[1, 2, 3].map((item) => (
        <div key={item} className="bg-[#1A1A1A] backdrop-blur-sm rounded-2xl border border-gray-800/50 overflow-hidden shadow-xl animate-pulse">
          <div className="p-5 flex flex-col lg:flex-row lg:items-start justify-between gap-4">
            <div className="flex-1">
              <div className="flex items-start gap-4">
                <div className="w-7 h-7 rounded-lg bg-gray-700/50 border border-gray-600/30"></div>
                <div className="flex-1">
                  <div className="h-7 bg-gradient-to-r from-gray-700/50 to-gray-600/30 rounded-lg w-64 mb-2"></div>
                  <div className="h-4 bg-gradient-to-r from-gray-700/40 to-gray-600/20 rounded w-48 mb-4"></div>
                  <div className="flex flex-wrap gap-3">
                    <div className="w-20 h-12 bg-gradient-to-r from-gray-700/40 to-gray-600/20 rounded-xl border border-gray-700/30"></div>
                    <div className="w-20 h-12 bg-gradient-to-r from-gray-700/40 to-gray-600/20 rounded-xl border border-gray-700/30"></div>
                    <div className="w-24 h-12 bg-gradient-to-r from-blue-950/40 to-blue-900/30 rounded-xl border border-blue-800/30"></div>
                  </div>
                </div>
              </div>
            </div>
            <div className="w-36 h-12 bg-gradient-to-r from-gray-700/40 to-gray-600/20 rounded-xl border border-gray-700/30"></div>
          </div>

          <div className="border-t border-gray-800/60">
            <div className="overflow-x-auto">
              <div className="min-w-full">
                <div className="grid grid-cols-8 gap-0 bg-[#1F1F1F] py-4 px-2 border-b border-gray-700/60">
                  <div className="col-span-1 flex items-center gap-2 pl-4">
                    <div className="w-4 h-4 bg-gray-700/50 rounded-full"></div>
                    <div className="h-5 bg-gray-700/50 rounded w-16"></div>
                  </div>
                  {[...Array(7)].map((_, index) => (
                    <div key={index} className="col-span-1 flex justify-center">
                      <div className="h-6 bg-gray-700/50 rounded w-20"></div>
                    </div>
                  ))}
                </div>
                {[...Array(4)].map((rowIndex) => (
                  <div
                    key={rowIndex}
                    className={`grid grid-cols-8 gap-0 py-4 px-2 border-b border-gray-800/60 ${rowIndex % 2 === 0 ? 'bg-[#1A1A1A]' : 'bg-[#1A1A1A]/70'}`}
                  >
                    <div className="col-span-1 flex items-center gap-2 pl-4">
                      <div className="w-2 h-2 bg-blue-400/50 rounded-full"></div>
                      <div className="h-5 bg-gray-700/40 rounded w-24"></div>
                    </div>
                    {[...Array(7)].map((_, j) => (
                      <div key={j} className="col-span-1 flex justify-center">
                        <div className="h-6 bg-gray-700/30 rounded w-12"></div>
                      </div>
                    ))}
                  </div>
                ))}
                <div className="grid grid-cols-8 gap-0 py-4 px-2 bg-gradient-to-r from-amber-950/50 to-orange-950/40 border-t border-amber-800/50">
                  <div className="col-span-1 flex items-center gap-2 pl-4">
                    <div className="w-4 h-4 bg-amber-400/50 rounded-full"></div>
                    <div className="h-5 bg-amber-700/30 rounded w-16"></div>
                  </div>
                  {[...Array(7)].map((_, j) => (
                    <div key={j} className="col-span-1 flex justify-center">
                      <div className="h-7 bg-amber-950/60 rounded-lg w-16 border border-amber-800/40"></div>
                    </div>
                  ))}
                </div>
                <div className="grid grid-cols-8 gap-0 py-4 px-2 bg-gradient-to-r from-blue-950/40 to-indigo-950/30 border-t border-blue-800/40">
                  <div className="col-span-1 flex items-center gap-2 pl-4">
                    <div className="w-4 h-4 bg-blue-400/50 rounded-full"></div>
                    <div className="h-5 bg-blue-700/30 rounded w-12"></div>
                  </div>
                  {[...Array(7)].map((_, j) => (
                    <div key={j} className="col-span-1 flex justify-center">
                      <div className="h-6 bg-blue-950/40 rounded-lg w-16 border border-blue-800/30"></div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="px-4 py-3 border-t border-gray-800/60 bg-[#1A1A1A]/60">
              <div className="flex justify-between items-center">
                <div className="h-4 bg-gray-700/30 rounded w-32"></div>
                <div className="h-4 bg-gray-700/30 rounded w-40"></div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
