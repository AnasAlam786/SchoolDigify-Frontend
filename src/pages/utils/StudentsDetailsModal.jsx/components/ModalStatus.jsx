function ModalSkeleton() {
  return (
    <div className="p-4 space-y-6">
      {/* <!-- Profile Skeleton --> */}
      <div className="text-center animate-pulse">
        <div className="w-20 h-20 md:w-24 md:h-24 rounded-full bg-gray-700 mx-auto mb-4"></div>
        <div className="h-6 bg-gray-700 rounded w-40 mx-auto mb-2"></div>
        <div className="h-4 bg-gray-700 rounded w-32 mx-auto"></div>
      </div>

      {/* <!-- Grid Skeleton --> */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

        <div className="space-y-2 p-3 bg-gray-800/20 rounded-lg">
          <div className="h-3 bg-gray-700 rounded w-20"></div>
          <div className="h-4 bg-gray-700 rounded w-full"></div>
        </div>

        <div className="space-y-2 p-3 bg-gray-800/20 rounded-lg">
          <div className="h-3 bg-gray-700 rounded w-20"></div>
          <div className="h-4 bg-gray-700 rounded w-full"></div>
        </div>

        <div className="space-y-2 p-3 bg-gray-800/20 rounded-lg">
          <div className="h-3 bg-gray-700 rounded w-20"></div>
          <div className="h-4 bg-gray-700 rounded w-full"></div>
        </div>

        <div className="space-y-2 p-3 bg-gray-800/20 rounded-lg">
          <div className="h-3 bg-gray-700 rounded w-20"></div>
          <div className="h-4 bg-gray-700 rounded w-full"></div>
        </div>

        <div className="space-y-2 p-3 bg-gray-800/20 rounded-lg">
          <div className="h-3 bg-gray-700 rounded w-20"></div>
          <div className="h-4 bg-gray-700 rounded w-full"></div>
        </div>

        <div className="space-y-2 p-3 bg-gray-800/20 rounded-lg">
          <div className="h-3 bg-gray-700 rounded w-20"></div>
          <div className="h-4 bg-gray-700 rounded w-full"></div>
        </div>

        <div className="space-y-2 p-3 bg-gray-800/20 rounded-lg">
          <div className="h-3 bg-gray-700 rounded w-20"></div>
          <div className="h-4 bg-gray-700 rounded w-full"></div>
        </div>

        <div className="space-y-2 p-3 bg-gray-800/20 rounded-lg">
          <div className="h-3 bg-gray-700 rounded w-20"></div>
          <div className="h-4 bg-gray-700 rounded w-full"></div>
        </div>

        <div className="space-y-2 p-3 bg-gray-800/20 rounded-lg">
          <div className="h-3 bg-gray-700 rounded w-20"></div>
          <div className="h-4 bg-gray-700 rounded w-full"></div>
        </div>

        <div className="space-y-2 p-3 bg-gray-800/20 rounded-lg">
          <div className="h-3 bg-gray-700 rounded w-20"></div>
          <div className="h-4 bg-gray-700 rounded w-full"></div>
        </div>

      </div>
    </div>
  )
}

function ModalError() {
  return (
    <div className="p-4 flex flex-col items-center justify-center min-h-[400px] text-center">
      <div className="w-16 h-16 rounded-full bg-gray-800 flex items-center justify-center mb-4">
        <i className="fas fa-user-slash text-gray-500 text-2xl"></i>
      </div>
      <h3 className="text-lg font-semibold text-gray-300 mb-2">No Data Available</h3>
      <p className="text-gray-500">Student information could not be loaded.</p>
    </div>
  )
}


export {ModalError, ModalSkeleton}