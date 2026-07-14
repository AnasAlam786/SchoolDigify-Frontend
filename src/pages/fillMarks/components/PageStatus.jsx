function InitialState() {
    return (
        // Initial state: no selection made yet
        <div className="flex flex-col items-center justify-center py-16 px-4 text-center glass-card rounded-2xl border border-white/5">
            <div className="w-24 h-24 mb-6 rounded-full bg-gradient-to-br from-indigo-500/20 to-purple-500/20 flex items-center justify-center animate-soft-pulse">
                <i className="fas fa-hand-pointer text-4xl text-indigo-300"></i>
            </div>
            <h3 className="text-2xl font-bold text-white mb-2">Ready to update marks?</h3>
            <p className="text-gray-400 mb-2 max-w-md">Please select a <span className="text-indigo-400 font-semibold">class</span>,
                <span className="text-purple-400 font-semibold">subject</span>, and
                <span className="text-blue-400 font-semibold">exam</span>
                from the dropdowns above, then click
                <span className="text-white font-medium">Get Marks</span>.
            </p>
            <p className="text-gray-500 text-sm mt-4">We'll show the list of students once you've made your choices.</p>
        </div>
    );
}

function SkeletonLoader() {
    return (
        <div className="space-y-6" aria-busy="true">
            {/* Desktop */}
            <div className="hidden lg:block glass-card rounded-2xl p-5">
                <div className="animate-pulse space-y-4">
                    <div className="h-8 bg-white/5 rounded w-1/4"></div>

                    {Array.from({ length: 6 }, (_, i) => (
                        <div className="flex items-center gap-4" key={i}>
                            <div className="h-10 w-10 bg-white/5 rounded-full"></div>
                            <div className="flex-1 h-10 bg-white/5 rounded"></div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Mobile */}
            <div className="lg:hidden space-y-4">
                {Array.from({ length: 4 }, (_, i) => (
                    <div className="glass-card rounded-2xl p-5 animate-pulse" key={i}>
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-10 h-10 bg-white/5 rounded-full"></div>
                            <div className="flex-1 h-5 bg-white/5 rounded"></div>
                        </div>

                        <div className="h-10 bg-white/5 rounded mb-3"></div>
                        <div className="h-10 bg-white/5 rounded"></div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export { InitialState, SkeletonLoader };