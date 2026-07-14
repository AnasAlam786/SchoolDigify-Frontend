import React from 'react';

function LoadingSkeleton() {
  return (

    // <!-- Loading skeleton -->
      <div className="promotion-cards">
        {/* <!-- 6 skeleton cards --> */}
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="bg-[#1e1e1e] rounded-2xl overflow-hidden border border-gray-800">
            <div className="h-2 w-full bg-gradient-to-r from-transparent via-gray-700 to-transparent shimmer"></div>
            <div className="p-6">
              <div className="flex gap-4">
                <div className="w-24 h-32 rounded-lg shimmer flex-shrink-0"></div>
                <div className="flex-1 space-y-3">
                  <div className="h-5 w-3/4 shimmer rounded"></div>
                  <div className="h-4 w-1/2 shimmer rounded"></div>
                  <div className="h-4 w-full shimmer rounded"></div>
                  <div className="h-4 w-2/3 shimmer rounded"></div>
                </div>
              </div>
              <div className="flex gap-3 mt-4">
                <div className="h-10 w-full shimmer rounded-lg"></div>
                <div className="h-10 w-full shimmer rounded-lg"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
  );
}

function InitialState() {
  return (
    <div id="initialState" className="flex flex-col items-center justify-center py-16 px-4 text-center">
      <div className="w-32 h-32 bg-gradient-to-br from-green-500/20 to-blue-500/20 rounded-full flex items-center justify-center mb-6 animate-pulse">
        <i className="fas fa-graduation-cap text-5xl text-green-400/60"></i>
      </div>
      <h3 className="text-2xl font-bold text-white mb-3">Welcome to Promotion Portal</h3>
      <p className="text-gray-400 max-w-md mb-8">Select a class from the dropdown above to view and manage students.</p>
      <a href="/admission" className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-green-600 to-green-500 hover:from-green-500 hover:to-green-400 text-white font-medium rounded-xl shadow-lg transition-all duration-200">
        <i className="fas fa-plus-circle mr-2"></i> Add New Student
      </a>
    </div>
  );
}

export { InitialState, LoadingSkeleton };