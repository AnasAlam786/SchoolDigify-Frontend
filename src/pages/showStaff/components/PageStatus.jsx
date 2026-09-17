import React from 'react'

function NoStaff({onResetFilters}) {
  return (
    <div className="flex-col items-center justify-center py-10 text-center">
      <div className="animate-bounce mb-6">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-24 w-24 mx-auto text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      </div>
      <h3 className="text-xl font-semibold text-white mb-2">No Staff Found</h3>
      <p className="text-gray-400 max-w-md mx-auto">We couldn't find any staff matching your criteria. Try adjusting your search or filters.</p>
      <button type="button" onClick={onResetFilters} className="mt-6 btn-primary text-white px-4 py-2 rounded-lg font-medium flex items-center mx-auto">
        <i className="fas fa-sync-alt mr-2" /> Reset Filters
      </button>
    </div>
  )
}


function SkeletonLoader() {
  return (
    <div className="w-full space-y-6 md:space-y-8 animate-pulse">
      
      {/* 1. Stats Grid Skeleton (Matching your 4-column metrics layout with color-coded hints) */}
      <div className="stats-grid grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        
        {/* Total Staff Card */}
        <div className="staff-card p-4 md:p-5 bg-gray-900/60 border border-gray-800/80 rounded-2xl shadow-lg relative overflow-hidden">
          <div className="flex justify-between items-center">
            <div className="space-y-2">
              <div className="h-3.5 w-20 bg-gray-800/90 rounded-md"></div>
              <div className="h-7 w-10 bg-gray-800 rounded-md mt-1"></div>
            </div>
            <div className="bg-blue-500/10 p-3 rounded-xl w-11 h-11 md:w-12 md:h-12 border border-blue-500/20"></div>
          </div>
        </div>

        {/* Teachers Card */}
        <div className="staff-card p-4 md:p-5 bg-gray-900/60 border border-gray-800/80 rounded-2xl shadow-lg relative overflow-hidden">
          <div className="flex justify-between items-center">
            <div className="space-y-2">
              <div className="h-3.5 w-16 bg-gray-800/90 rounded-md"></div>
              <div className="h-7 w-10 bg-gray-800 rounded-md mt-1"></div>
            </div>
            <div className="bg-purple-500/10 p-3 rounded-xl w-11 h-11 md:w-12 md:h-12 border border-purple-500/20"></div>
          </div>
        </div>

        {/* Administrators Card */}
        <div className="staff-card p-4 md:p-5 bg-gray-900/60 border border-gray-800/80 rounded-2xl shadow-lg relative overflow-hidden">
          <div className="flex justify-between items-center">
            <div className="space-y-2">
              <div className="h-3.5 w-24 bg-gray-800/90 rounded-md"></div>
              <div className="h-7 w-6 bg-gray-800 rounded-md mt-1"></div>
            </div>
            <div className="bg-emerald-500/10 p-3 rounded-xl w-11 h-11 md:w-12 md:h-12 border border-emerald-500/20"></div>
          </div>
        </div>

        {/* Support Staff Card */}
        <div className="staff-card p-4 md:p-5 bg-gray-900/60 border border-gray-800/80 rounded-2xl shadow-lg relative overflow-hidden">
          <div className="flex justify-between items-center">
            <div className="space-y-2">
              <div className="h-3.5 w-22 bg-gray-800/90 rounded-md"></div>
              <div className="h-7 w-6 bg-gray-800 rounded-md mt-1"></div>
            </div>
            <div className="bg-amber-500/10 p-3 rounded-xl w-11 h-11 md:w-12 md:h-12 border border-amber-500/20"></div>
          </div>
        </div>

      </div>

      {/* 2. Main Content Container Skeleton */}
      <div className="staff-card p-4 md:p-6 bg-gray-900/60 border border-gray-800/80 rounded-2xl shadow-xl">
        
        {/* Title Header Skeleton */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-4">
          <div className="h-6 w-32 bg-gray-800 rounded-md"></div>
        </div>
        
        {/* Tabs Bar Skeleton */}
        <div className="flex gap-4 mb-6 border-b border-gray-800/80 pb-3">
          <div className="h-8 w-28 bg-gray-800 rounded-lg"></div>
          <div className="h-8 w-28 bg-gray-800/50 rounded-lg"></div>
        </div>

        {/* Desktop Table View Skeleton */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-800/80">
                <th className="pb-4 text-left"><div className="h-4 w-32 bg-gray-800 rounded-md"></div></th>
                <th className="pb-4 text-left"><div className="h-4 w-16 bg-gray-800 rounded-md"></div></th>
                <th className="pb-4 text-left"><div className="h-4 w-16 bg-gray-800 rounded-md"></div></th>
                <th className="pb-4 text-left"><div className="h-4 w-16 bg-gray-800 rounded-md"></div></th>
                <th className="pb-4 text-right"><div className="h-4 w-16 bg-gray-800 rounded-md ml-auto"></div></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800/40">
              {[...Array(8)].map((_, i) => (
                <tr key={i} className="group">
                  <td className="py-4">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 rounded-full bg-gray-800 border border-gray-700/50"></div>
                      <div className="space-y-2">
                        <div className="h-4 w-28 bg-gray-800 rounded-md"></div>
                        <div className="h-3 w-40 bg-gray-800/60 rounded-md"></div>
                      </div>
                    </div>
                  </td>
                  <td className="py-4">
                    <div className="h-6 w-20 bg-gray-800/80 rounded-full"></div>
                  </td>
                  <td className="py-4">
                    <div className="h-4 w-10 bg-gray-800 rounded-md"></div>
                  </td>
                  <td className="py-4">
                    <div className="h-4 w-12 bg-gray-800 rounded-md"></div>
                  </td>
                  <td className="py-4 text-right">
                    <div className="h-9 w-9 bg-gray-800 rounded-xl ml-auto"></div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile Card View Skeleton (Mirrors your mobile stack layout) */}
        <div className="md:hidden space-y-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="bg-gray-800/30 border border-gray-800/80 p-4 rounded-xl space-y-4">
              <div className="flex justify-between items-center">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-full bg-gray-800"></div>
                  <div className="space-y-1.5">
                    <div className="h-4 w-28 bg-gray-800 rounded-md"></div>
                    <div className="h-3 w-36 bg-gray-800/60 rounded-md"></div>
                  </div>
                </div>
                <div className="h-5 w-16 bg-gray-800 rounded-full"></div>
              </div>
              
              <div className="grid grid-cols-2 gap-3 pt-3 border-t border-gray-800/60">
                <div className="space-y-1">
                  <div className="h-3 w-12 bg-gray-800/70 rounded"></div>
                  <div className="h-4 w-8 bg-gray-800 rounded"></div>
                </div>
                <div className="space-y-1">
                  <div className="h-3 w-16 bg-gray-800/70 rounded"></div>
                  <div className="h-4 w-12 bg-gray-800 rounded"></div>
                </div>
              </div>

              <div className="pt-2 flex justify-end">
                <div className="h-9 w-24 bg-gray-800 rounded-lg"></div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}


export { SkeletonLoader, NoStaff }
