import React from 'react'

function NoPaperStatus({setCreateModalOpen}) {
    return (
        <div className="text-center py-16">
            <div className="max-w-md mx-auto">
                <div className="relative mb-6">
                    <div className="w-32 h-32 mx-auto bg-gradient-to-br from-primary/20 to-secondary/20 rounded-full flex items-center justify-center">
                        <i className="fas fa-file-alt text-6xl text-gray-600" />
                    </div>
                </div>
                <h3 className="text-2xl font-bold text-white mb-2">No Papers Found</h3>
                <p className="text-gray-400 mb-8">Try adjusting your filters or create a new paper.</p>
                <button
                    type="button"
                    onClick={() => setCreateModalOpen(true)}
                    className="group relative overflow-hidden bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 text-white font-semibold py-3 px-8 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl"
                >
                    <div className="absolute inset-0 bg-white/10 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
                    <i className="fas fa-plus mr-2" />
                    Create New Paper
                </button>
            </div>
        </div>
    )
}


export default function LoadingSkeleton() {
  // Inline keyframes for a smooth shimmer effect
  const shimmerStyle = `
    @keyframes shimmer {
      0% { background-position: -200% 0; }
      100% { background-position: 200% 0; }
    }
    .animate-shimmer {
      background: linear-gradient(90deg, #374151 25%, #4b5563 50%, #374151 75%);
      background-size: 200% 100%;
      animation: shimmer 1.8s ease-in-out infinite;
    }
  `;

  // Reusable skeleton card structure
  const SkeletonCard = () => (
    <div className="transform transition-all duration-300">
      <div className="group bg-navbg/50 backdrop-blur-sm border border-gray-700 rounded-2xl overflow-hidden h-full flex flex-col">
        {/* Gradient line */}
        <div className="relative">
          <div className="h-2 bg-gradient-to-r from-primary/30 to-secondary/30 animate-pulse"></div>

          {/* Three-dot menu placeholder */}
          <div className="absolute top-3 right-3">
            <div className="w-8 h-8 rounded-lg bg-gray-700/50 animate-shimmer"></div>
          </div>
        </div>

        {/* Body */}
        <div className="p-6 flex-1">
          {/* Title + teacher */}
          <div className="flex items-start justify-between mb-5">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-4 h-4 rounded bg-gray-700/50 animate-shimmer"></div>
                <div className="h-5 w-3/4 rounded bg-gray-700/50 animate-shimmer"></div>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 rounded-full bg-gray-700/50 animate-shimmer"></div>
                <div className="h-3 w-1/2 rounded bg-gray-700/50 animate-shimmer"></div>
              </div>
            </div>
          </div>

          {/* Stat boxes */}
          <div className="grid grid-cols-2 gap-3 mb-5">
            <div className="bg-darkbg/30 rounded-xl p-3 border border-gray-700/50">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-gray-700/50 animate-shimmer"></div>
                <div className="flex-1 space-y-1.5">
                  <div className="h-2.5 w-1/2 rounded bg-gray-700/50 animate-shimmer"></div>
                  <div className="h-3.5 w-3/4 rounded bg-gray-700/50 animate-shimmer"></div>
                </div>
              </div>
            </div>
            <div className="bg-darkbg/30 rounded-xl p-3 border border-gray-700/50">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-gray-700/50 animate-shimmer"></div>
                <div className="flex-1 space-y-1.5">
                  <div className="h-2.5 w-1/2 rounded bg-gray-700/50 animate-shimmer"></div>
                  <div className="h-3.5 w-3/4 rounded bg-gray-700/50 animate-shimmer"></div>
                </div>
              </div>
            </div>
          </div>

          {/* Dates */}
          <div className="space-y-2.5">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded bg-gray-700/50 animate-shimmer"></div>
              <div className="h-3 w-1/3 rounded bg-gray-700/50 animate-shimmer"></div>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded bg-gray-700/50 animate-shimmer"></div>
              <div className="h-3 w-1/4 rounded bg-gray-700/50 animate-shimmer"></div>
            </div>
          </div>

          {/* Questions & words */}
          <div className="flex justify-between mt-3">
            <div className="h-3 w-1/4 rounded bg-gray-700/50 animate-shimmer"></div>
            <div className="h-3 w-1/4 rounded bg-gray-700/50 animate-shimmer"></div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-darkbg/30 border-t border-gray-700">
          <div className="flex flex-col gap-3">
            {/* Slider track */}
            <div className="flex items-center gap-3">
              <div className="w-4 h-4 rounded bg-gray-700/50 animate-shimmer"></div>
              <div className="flex-1 h-1.5 rounded-full bg-gray-700/50 animate-shimmer"></div>
              <div className="w-10 h-4 rounded bg-gray-700/50 animate-shimmer"></div>
            </div>

            {/* Action buttons */}
            <div className="flex gap-3">
              <div className="flex-1 h-9 rounded-lg bg-gray-700/50 animate-shimmer"></div>
              <div className="flex-1 h-9 rounded-lg bg-gray-700/50 animate-shimmer"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <>
      <style>{shimmerStyle}</style>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 p-10">
        {[...Array(4)].map((_, i) => (
          <SkeletonCard key={i} />
        ))}
      </div>
    </>
  );
}

export {NoPaperStatus, LoadingSkeleton }
