export default function SkeletonLoader() {
  return (
    <div className="space-y-6">
      {/* Filter Section Skeleton */}
      <div className="hidden lg:block">
        <div className="p-6 space-y-6">
          {/* Search and Stats Row */}
          <div className="flex items-center gap-6">
            {/* Search and Class Filter Skeleton */}
            <div className="flex-1 bg-gray-900/40 backdrop-blur-xl rounded-2xl p-5 border border-gray-800/70 animate-pulse">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-2 h-8 bg-gradient-to-b from-blue-500 to-cyan-400 rounded-full opacity-30" />
                <div className="h-6 bg-gray-700 rounded-lg w-32 opacity-30" />
              </div>

              <div className="flex items-stretch gap-3">
                <div className="flex-1 h-12 bg-gray-800 rounded-xl opacity-30" />
                <div className="w-[180px] h-12 bg-gray-800 rounded-xl opacity-30" />
              </div>
            </div>

            {/* Stats Skeleton */}
            <div className="bg-gray-900/40 backdrop-blur-xl rounded-2xl p-5 border border-gray-800/70 min-w-[320px] animate-pulse">
              <div className="flex items-center justify-between h-full gap-4">
                <div className="text-center flex-1">
                  <div className="h-4 bg-gray-700 rounded w-12 mx-auto mb-2 opacity-30" />
                  <div className="h-8 bg-gray-700 rounded w-20 mx-auto mb-1 opacity-30" />
                  <div className="h-3 bg-gray-700 rounded w-16 mx-auto opacity-30" />
                </div>

                <div className="w-px h-16 bg-gray-800 opacity-30" />

                <div className="w-12 h-12 bg-gray-800 rounded-xl opacity-30" />
              </div>
            </div>
          </div>

          {/* Sorting Section Skeleton */}
          <div className="bg-gray-900/40 backdrop-blur-xl rounded-2xl p-5 border border-gray-800/70 animate-pulse">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-2 h-8 bg-gradient-to-b from-amber-500 to-orange-400 rounded-full opacity-30" />
              <div className="h-6 bg-gray-700 rounded-lg w-20 opacity-30" />
            </div>

            <div className="bg-gray-900/50 rounded-xl p-4 border border-gray-700/30">
              <div className="h-3 bg-gray-700 rounded w-12 mb-3 opacity-30" />
              <div className="flex items-center gap-3">
                <div className="flex-1 h-10 bg-gray-800 rounded-xl opacity-30" />
                <div className="w-10 h-10 bg-gray-800 rounded-lg opacity-30" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Filter Skeleton */}
      <div className="lg:hidden p-4 space-y-4 animate-pulse">
        <div className="bg-gray-900/40 backdrop-blur-xl rounded-2xl p-5 border border-gray-800/50">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-2 h-6 bg-gradient-to-b from-blue-500 to-cyan-400 rounded-full opacity-30" />
            <div className="h-5 bg-gray-700 rounded-lg w-28 opacity-30" />
          </div>

          <div className="space-y-3">
            <div className="h-10 bg-gray-800 rounded-xl opacity-30" />
            <div className="h-10 bg-gray-800 rounded-xl opacity-30" />
            <div className="flex gap-3">
              <div className="flex-1 h-10 bg-gray-800 rounded-xl opacity-30" />
              <div className="w-10 h-10 bg-gray-800 rounded-lg opacity-30" />
            </div>
            <div className="h-10 bg-gray-800 rounded-lg opacity-30" />
          </div>
        </div>

        <div className="bg-gray-900/40 backdrop-blur-xl rounded-2xl p-4 border border-gray-800/70 text-center opacity-30">
          <div className="h-4 bg-gray-700 rounded w-12 mx-auto mb-2" />
          <div className="h-8 bg-gray-700 rounded w-20 mx-auto mb-1" />
          <div className="h-3 bg-gray-700 rounded w-16 mx-auto" />
        </div>
      </div>

      {/* Summary Stats Skeleton */}
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4 p-5 animate-pulse">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="rounded-2xl border border-[#2A2A2A] bg-[#1A1A1A] p-4">
            <div className="h-3 bg-gray-700 rounded w-24 opacity-30" />
            <div className="mt-3 h-7 bg-gray-700 rounded w-32 opacity-30" />
          </div>
        ))}
      </div>

      {/* Students Grid Skeleton */}
      <div className="px-5 pb-5">
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3 animate-pulse">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="rounded-2xl border border-[#2A2A2A] bg-[#1A1A1A] p-5 space-y-4">
              {/* Header Skeleton */}
              <div className="flex items-start justify-between">
                <div className="flex-1 space-y-2">
                  <div className="h-5 bg-gray-700 rounded w-32 opacity-30" />
                  <div className="h-4 bg-gray-700 rounded w-24 opacity-30" />
                </div>
                <div className="w-10 h-10 bg-gray-700 rounded-lg opacity-30" />
              </div>

              {/* Divider */}
              <div className="h-px bg-gray-700 opacity-20" />

              {/* Info Rows Skeleton */}
              <div className="space-y-3">
                {[1, 2, 3, 4].map((j) => (
                  <div key={j} className="flex items-center justify-between">
                    <div className="h-4 bg-gray-700 rounded w-20 opacity-30" />
                    <div className="h-4 bg-gray-700 rounded w-24 opacity-30" />
                  </div>
                ))}
              </div>

              {/* Action Buttons Skeleton */}
              <div className="flex gap-2 pt-3">
                <div className="flex-1 h-9 bg-gray-700 rounded-lg opacity-30" />
                <div className="flex-1 h-9 bg-gray-700 rounded-lg opacity-30" />
                <div className="flex-1 h-9 bg-gray-700 rounded-lg opacity-30" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Add CSS animations */}
      <style>{`
        @keyframes shimmer {
          0% {
            background-position: -1000px 0;
          }
          100% {
            background-position: 1000px 0;
          }
        }

        @keyframes pulse-soft {
          0%, 100% {
            opacity: 0.6;
          }
          50% {
            opacity: 0.8;
          }
        }

        .animate-pulse {
          animation: pulse-soft 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }
      `}</style>
    </div>
  );
}
