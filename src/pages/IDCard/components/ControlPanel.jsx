function ControlPanel({
    classes = [],
    filters,
    selection,
    setSelectedClass,
    handlePrint
}) {

    const { search, setSearch, showOnlyImages, setshowOnlyImages } = filters;
    const { totalSelected, handleSelectAllVisible } = selection;




    return (
        <div className="rounded-2xl bg-[#1A1A1A] border border-white/[0.05] shadow-2xl shadow-black/80 p-6 
                md:p-8 transition-all duration-300 hover:border-blue-500/20 hover:shadow-blue-500/5">

            {/* Controls Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 mb-8">

                {/* Search */}
                <div className="space-y-3">
                    <label
                        htmlFor="search"
                        className="block text-xs font-semibold uppercase tracking-wider text-gray-400 flex items-center gap-2"
                    >
                        <i className="fas fa-search text-blue-400/80 text-sm"></i>
                        Search Students
                    </label>

                    <div className="relative group">
                        <input onChange={(e) => setSearch(e.target.value)}
                            type="text"
                            id="search"
                            placeholder="e.g., John Doe"
                            className="w-full px-5 py-4 bg-black/40 border border-white/10 rounded-xl text-white placeholder-gray-500 
                                focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500/40 
                                transition-all duration-200 group-hover:border-white/20 text-base"
                        />
                    </div>
                </div>

                {/* Class Filter */}
                <div className="space-y-3">
                    <label
                        htmlFor="class-filter"
                        className="block text-xs font-semibold uppercase tracking-wider text-gray-400 flex items-center gap-2"
                    >
                        <i className="fas fa-school text-blue-400/80 text-sm"></i>
                        Filter by Class
                    </label>

                    <div className="relative group">
                        <select
                            id="class-filter" onChange={(e) => setSelectedClass(e.target.value) }
                            className="w-full px-5 py-4 bg-black/40 border border-white/10 rounded-xl text-white focus:outline-none 
                                focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500/40 appearance-none cursor-pointer
                                transition-all duration-200 group-hover:border-white/20 text-base"
                        >
                            <option
                                value=""
                                className="bg-[#1A1A1A] text-gray-300"
                            >
                                All Classes
                            </option>

                            {classes.map((cls) => (
                                <option
                                    key={cls.id}
                                    value={cls.id}
                                    className="bg-[#1A1A1A]"
                                >
                                    {cls.class_name}
                                </option>
                            ))}
                        </select>

                        <div className="absolute right-5 top-1/2 transform -translate-y-1/2 pointer-events-none text-gray-400">
                            <i className="fas fa-chevron-down"></i>
                        </div>
                    </div>
                </div>

                {/* Options */}
                <div className="space-y-3 md:col-span-2 lg:col-span-1">
                    <span className="block text-xs font-semibold uppercase tracking-wider text-gray-400 flex items-center gap-2">
                        <i className="fas fa-cog text-blue-400/80 text-sm"></i>
                        Display Options
                    </span>

                    <div className="flex flex-col gap-4 pt-1">

                        {/* Show only with images */}
                        <label className="flex items-center gap-3 cursor-pointer group">
                            <input
                                onChange={(e) => setshowOnlyImages(e.target.checked)}
                                type="checkbox"
                                id="show-images"
                                className="sr-only peer"
                                checked={!!showOnlyImages}
                            />

                            <div className="w-5 h-5 rounded-md border border-white/20 bg-black/40 peer-checked:border-blue-500 
                                peer-checked:bg-blue-500/20 transition-all duration-200 group-hover:border-white/40 flex items-center 
                                justify-center">
                                <span className="w-2.5 h-1.5 border-b-2 border-l-2 border-white rotate-[-45deg] mb-0.5 hidden peer-checked:block"></span>
                            </div>

                            <span className="text-sm text-gray-400 group-hover:text-white transition-colors">
                                Show only with images
                            </span>
                        </label>

                        {/* Select all visible */}
                        <label className="flex items-center gap-3 cursor-pointer group">
                            <input
                                type="checkbox"
                                id="select-all"
                                className="sr-only peer"
                                onChange={(e) => handleSelectAllVisible && handleSelectAllVisible(e.target.checked)}
                            />

                            <div className="w-5 h-5 rounded-md border border-white/20 bg-black/40 peer-checked:border-blue-500 
                                peer-checked:bg-blue-500/20 transition-all duration-200 group-hover:border-white/40 flex 
                                items-center justify-center">
                                <i className="fas fa-check text-white text-xs opacity-0 peer-checked:opacity-100 transition-opacity"></i>
                            </div>

                            <span className="text-sm text-gray-400 group-hover:text-white transition-colors">
                                Select all visible
                            </span>
                        </label>

                    </div>
                </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-6 pt-6 border-t border-white/5">

                <button
                    id="download-images"
                    className="group relative px-8 py-4 bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 
                        hover:to-cyan-400 text-white font-semibold rounded-xl transition-all duration-300 transform 
                        hover:-translate-y-0.5 active:translate-y-0 shadow-lg shadow-blue-500/30 hover:shadow-blue-500/50 
                        flex items-center gap-3 min-w-[240px] justify-center text-base

                        "
                    disabled={!totalSelected}
                    onClick={() => handlePrint && handlePrint()}
                >
                    <i className="fas fa-print"></i>
                        Print {totalSelected ? ` ${totalSelected}` : ''} ID Card
                </button>

                <div
                    id="download-status"
                    className="hidden items-center gap-3 bg-black/40 px-5 py-4 rounded-xl border border-white/5"
                >
                    <div className="w-5 h-5 border-2 border-white/20 border-t-blue-400 rounded-full animate-spin"></div>

                    <span className="text-sm text-gray-400 font-medium">
                        Preparing print layout...
                    </span>
                </div>

            </div>
        </div>
    );
}

export default ControlPanel