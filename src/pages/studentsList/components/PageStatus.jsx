import React from 'react'

function SkeletonLoader() {
    return (
        <div className="students-grid">
            {Array.from({ length: 8 }).map((_, index) => (
                <div key={index} className="student-card overflow-hidden animate-pulse">
                    <div className="flex items-center justify-between px-3 py-0.5 bg-gray-800 bg-opacity-40 border-b border-gray-700">
                        <div className="flex space-x-1 p-1">
                            <div className="h-4 w-12 rounded bg-gray-700" />
                        </div>
                        <div className="flex items-center space-x-2">
                            <div className="h-8 w-8 rounded-full bg-gray-700" />
                            <div className="h-8 w-8 rounded-full bg-gray-700" />
                        </div>
                    </div>
                    <div className="p-4">
                        <div className="flex items-start">
                            <div className="relative mr-4 flex-shrink-0">
                                <div className="student-image bg-gray-700" />
                                <div className="absolute -bottom-2 -right-2 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-950/75 backdrop-blur-md border border-indigo-500/25 shadow-[0_3px_12px_-3px_rgba(99,102,241,0.25)] animate-pulse">
                                    {/* Dot placeholder */}
                                    <span className="w-1.5 h-1.5 rounded-full bg-indigo-500/40" />
                                    {/* Divider */}
                                    <span className="w-px h-2.5 bg-white/10" />
                                    {/* Number value placeholder */}
                                    <span className="w-5 h-2.5 rounded bg-white/20" />
                                </div>
                            </div>
                            <div className="flex-1 min-w-0 space-y-3">
                                <div className="h-6 w-3/4 rounded bg-gray-700" />
                                <div className="h-4 w-1/2 rounded bg-gray-700" />
                                <div className="h-8 w-1/2 rounded bg-gray-700" />
                                <div className="h-4 w-2/3 rounded bg-gray-700" />
                            </div>
                        </div>
                    </div>
                    <div className="grid grid-cols-2 border-t border-gray-700 mt-auto">
                        <div className="h-12 bg-gray-700" />
                        <div className="h-12 bg-gray-700" />
                    </div>
                </div>
            ))}
        </div>
    )
}
export default SkeletonLoader
