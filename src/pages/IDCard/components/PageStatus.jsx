import React from 'react'

function InitialState() {
    return (
        <div className="flex flex-col items-center justify-center py-16 px-4 text-center glass-card rounded-2xl border border-white/5 mt-5">
            <div
                className="w-24 h-24 mb-6 rounded-full bg-gradient-to-br from-blue-500/20 to-cyan-500/20 flex items-center justify-center animate-soft-pulse">
                <i className="fas fa-hand-pointer text-4xl text-blue-300"></i>
            </div>
            <h3 className="text-2xl font-bold text-white mb-2">Ready to create ID cards?</h3>
            <p className="text-gray-400 mb-2 max-w-md">Please select a <span
                className="text-blue-400 font-semibold">class</span> from the dropdown above to view students.</p>
            <p className="text-gray-500 text-sm mt-4">We'll show the list of students once you've made your choice.</p>
        </div>
    )
}

function NoStudentsState() {
    return (
        <div className="mt-5 flex flex-col items-center justify-center py-16 px-4 text-center glass-card rounded-2xl border border-white/5">
            <div
                className="w-24 h-24 mb-6 rounded-full bg-gradient-to-br from-blue-500/20 to-cyan-500/20 flex items-center justify-center animate-gentle-bounce">
                <i className="fas fa-user-slash text-4xl text-blue-300"></i>
            </div>
            <h3 className="text-2xl font-bold text-white mb-2">No students found</h3>
            <p className="text-gray-400 mb-8 max-w-md">This class doesn't have any students yet. Add a new student to
                start creating ID cards.</p>
            <a href="/admission"
                className="inline-flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white font-semibold rounded-xl transition-all duration-300 shadow-lg hover:shadow-blue-500/30 transform hover:-translate-y-1">
                <i className="fas fa-plus-circle"></i>
                <span>Add Student</span>
                <i className="fas fa-arrow-right"></i>
            </a>
        </div>
    )
}

function ErrorState({
    message = "Failed to load students. Please try again.",
    onRetry,
}) {
    return (
        <div className="mt-5 flex flex-col items-center justify-center py-16 px-4 text-center glass-card rounded-2xl border border-white/5">
            <div
                className="w-24 h-24 mb-6 rounded-full bg-gradient-to-br from-red-500/20 to-orange-500/20 flex items-center justify-center">
                <i className="fas fa-exclamation-triangle text-4xl text-red-300"></i>
            </div>
            <h3 className="text-2xl font-bold text-white mb-2">Oops! Something went wrong</h3>
            <p className="text-gray-400 mb-6 max-w-md">{message}</p>
            <button onClick={onRetry}
                className="inline-flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white font-semibold rounded-xl transition-all duration-300 shadow-lg hover:shadow-blue-500/30 transform hover:-translate-y-1">
                <i className="fas fa-sync-alt"></i>
                <span>Retry</span>
            </button>
        </div>
    )
}

function SkeletonLoader() {
    const skeletonCards = Array.from({ length: 6 });

    return (
        <div className="flex flex-wrap justify-center gap-6 mt-5">
            {skeletonCards.map((_, i) => (
                <div
                    key={i}
                    className="relative bg-gray-800 rounded-xl overflow-hidden shadow-lg"
                    style={{ width: "239px" }}
                >
                    {/* Image skeleton */}
                    <div className="w-full h-[280px] bg-gray-700 animate-pulse" />

                    {/* Footer skeleton */}
                    <div className="p-3 bg-gray-700 border-t border-gray-600">
                        <div className="h-4 w-3/4 bg-gray-600 rounded animate-pulse mb-2" />
                        <div className="h-3 w-1/2 bg-gray-600 rounded animate-pulse" />
                    </div>
                </div>
            ))}
        </div>
    );
}

export { InitialState, NoStudentsState, ErrorState, SkeletonLoader }