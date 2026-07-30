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

// StaffPageSkeleton.jsx

const StatsCardSkeleton = () => (
  <div className="staff-card p-5 rounded-xl bg-gray-900 border border-gray-800">
    <div className="flex justify-between items-center">
      <div className="space-y-3 flex-1">
        <div className="h-3 w-24 rounded bg-gray-700 animate-pulse"></div>
        <div className="h-8 w-14 rounded bg-gray-700 animate-pulse"></div>
      </div>

      <div className="w-14 h-14 rounded-xl bg-gray-700 animate-pulse"></div>
    </div>
  </div>
);

const TableRowSkeleton = () => (
  <tr className="border-b border-gray-800">
    <td className="py-5">
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-full bg-gray-700 animate-pulse"></div>

        <div className="space-y-2">
          <div className="h-4 w-36 rounded bg-gray-700 animate-pulse"></div>
          <div className="h-3 w-52 rounded bg-gray-800 animate-pulse"></div>
        </div>
      </div>
    </td>

    <td><div className="h-7 w-20 rounded-full bg-gray-700 animate-pulse"></div></td>
    <td><div className="h-4 w-24 rounded bg-gray-700 animate-pulse"></div></td>
    <td><div className="h-4 w-28 rounded bg-gray-700 animate-pulse"></div></td>
    <td><div className="h-4 w-14 rounded bg-gray-700 animate-pulse"></div></td>
    <td><div className="h-4 w-16 rounded bg-gray-700 animate-pulse"></div></td>

    <td>
      <div className="flex justify-end gap-2">
        <div className="w-10 h-10 rounded-lg bg-gray-700 animate-pulse"></div>
        <div className="w-10 h-10 rounded-lg bg-gray-700 animate-pulse"></div>
      </div>
    </td>
  </tr>
);

const MobileCardSkeleton = () => (
  <div className="rounded-xl border border-gray-800 bg-gray-900 p-4 mb-4">
    <div className="flex items-center gap-3">
      <div className="w-12 h-12 rounded-full bg-gray-700 animate-pulse"></div>

      <div className="flex-1 space-y-2">
        <div className="h-4 w-32 rounded bg-gray-700 animate-pulse"></div>
        <div className="h-3 w-44 rounded bg-gray-800 animate-pulse"></div>
      </div>
    </div>

    <div className="grid grid-cols-2 gap-4 mt-5">
      {[...Array(4)].map((_, i) => (
        <div key={i}>
          <div className="h-3 w-16 rounded bg-gray-800 animate-pulse mb-2"></div>
          <div className="h-4 w-20 rounded bg-gray-700 animate-pulse"></div>
        </div>
      ))}
    </div>

    <div className="flex gap-2 mt-5">
      <div className="flex-1 h-10 rounded-lg bg-gray-700 animate-pulse"></div>
      <div className="flex-1 h-10 rounded-lg bg-gray-700 animate-pulse"></div>
    </div>
  </div>
);

function SkeletonLoader() {
  return (
    <div className="animate-pulse">

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {[...Array(4)].map((_, i) => (
          <StatsCardSkeleton key={i} />
        ))}
      </div>

      {/* Desktop */}
      <div className="hidden md:block rounded-xl border border-gray-800 bg-gray-900 overflow-hidden">
        <div className="p-6 border-b border-gray-800">
          <div className="h-6 w-40 rounded bg-gray-700"></div>
        </div>

        <table className="w-full">
          <tbody>
            {[...Array(8)].map((_, i) => (
              <TableRowSkeleton key={i} />
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile */}
      <div className="md:hidden">
        {[...Array(6)].map((_, i) => (
          <MobileCardSkeleton key={i} />
        ))}
      </div>

    </div>
  );
}
export { SkeletonLoader, NoStaff }
