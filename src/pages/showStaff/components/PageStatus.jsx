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
    <div>

    </div>
  )
}

export { SkeletonLoader, NoStaff }
