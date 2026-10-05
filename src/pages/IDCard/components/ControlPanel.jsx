import { useMemo, useState } from "react";

function ControlPanel({
    classes = [],
    filters,
    selection,
    setSelectedClass,
    handlePrint,
    design
}) {

    const { search, setSearch, showOnlyImages, setshowOnlyImages } = filters;
    const { totalSelected, handleSelectAllVisible } = selection;
    const [isDesignModalOpen, setIsDesignModalOpen] = useState(false);

    const designOptions = useMemo(
        () => Object.values(design?.designs || {}),
        [design]
    );

    const selectedDesign =
        design?.designs?.[design.selectedDesignId] || designOptions[0] || null;

    return (
        <>
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
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-6 border-t border-white/5">

                <button
                    type="button"
                    onClick={() => setIsDesignModalOpen(true)}
                    className="group relative px-5 py-3.5 bg-white/[0.04] border border-white/10 hover:border-cyan-400/40 hover:bg-cyan-500/5 text-white font-semibold rounded-xl transition-all duration-300 flex items-center gap-3 min-w-[180px] justify-center text-sm shadow-lg shadow-black/20"
                >
                    <span className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-blue-600 to-cyan-500 text-white shadow-lg shadow-cyan-500/30">
                        <i className="fas fa-layer-group text-sm"></i>
                    </span>
                    <span className="flex flex-col items-start leading-tight">
                        <span className="text-[10px] uppercase tracking-[0.22em] text-blue-300/80">Template</span>
                        <span className="text-sm font-semibold text-white">{selectedDesign?.name || "Select Design"}</span>
                    </span>
                </button>

                <button
                    id="download-images"
                    className="group relative px-8 py-4 bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 
                        hover:to-cyan-400 text-white font-semibold rounded-xl transition-all duration-300 transform 
                        hover:-translate-y-0.5 active:translate-y-0 shadow-lg shadow-blue-500/30 hover:shadow-blue-500/50 
                        flex items-center gap-3 min-w-[240px] justify-center text-base
                        disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none"
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

        {isDesignModalOpen && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 backdrop-blur-md p-4">
                <div className="w-full max-w-5xl rounded-[28px] border border-white/10 bg-[#0f172a]/95 shadow-[0_30px_80px_rgba(15,23,42,0.85)] ring-1 ring-blue-500/20">
                    <div className="flex items-center justify-between border-b border-white/10 px-6 py-5 sm:px-8">
                        <div>
                            <p className="text-[10px] uppercase tracking-[0.24em] text-cyan-300/80">Design Library</p>
                            <h3 className="mt-2 text-2xl font-bold text-white">Choose an ID Card Design</h3>
                        </div>
                        <button
                            type="button"
                            onClick={() => setIsDesignModalOpen(false)}
                            className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/5 text-xl text-gray-300 transition hover:bg-white/10 hover:text-white"
                            aria-label="Close design selector"
                        >
                            ×
                        </button>
                    </div>

                    <div className="grid gap-5 p-6 sm:grid-cols-2 lg:grid-cols-3 sm:p-8">
                        {designOptions.map((option) => {
                            const isSelected = option.id === selectedDesign?.id;

                            return (
                                <button
                                    key={option.id}
                                    type="button"
                                    onClick={() => {
                                        if (design?.setSelectedDesignId) {
                                            design.setSelectedDesignId(option.id);
                                        }
                                        setIsDesignModalOpen(false);
                                    }}
                                    className={`group relative overflow-hidden rounded-2xl border p-3 text-left transition-all duration-300 ${
                                        isSelected
                                            ? "border-cyan-400/60 bg-cyan-500/10 shadow-[0_0_30px_rgba(34,211,238,0.2)]"
                                            : "border-white/10 bg-white/[0.02] hover:border-blue-400/40 hover:bg-blue-500/5"
                                    }`}
                                >
                                    <div className="mb-4 rounded-2xl border border-white/10 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-950 p-3">
                                        <div className="mx-auto h-36 w-full max-w-[180px] rounded-xl bg-gradient-to-br from-blue-500/10 via-slate-800 to-slate-900 p-2 shadow-inner ring-1 ring-white/10">
                                            <div className="flex h-full flex-col justify-between rounded-lg border border-white/10 bg-[#0b1120] p-3">
                                                <div className="flex items-center justify-between">
                                                    <div className="h-7 w-7 rounded-full bg-cyan-400/20 ring-1 ring-cyan-300/40" />
                                                    <div className="h-2.5 w-16 rounded-full bg-white/10" />
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <div className="h-12 w-12 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-400/90 shadow-lg" />
                                                    <div className="flex-1 space-y-1.5">
                                                        <div className="h-2.5 w-2/3 rounded-full bg-white/80" />
                                                        <div className="h-2 rounded-full bg-white/50" />
                                                        <div className="h-2 w-1/2 rounded-full bg-white/40" />
                                                    </div>
                                                </div>
                                                <div className="flex items-center justify-between text-[9px] text-slate-300">
                                                    <span>Class</span>
                                                    <span>Roll</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex items-center justify-between gap-3">
                                        <div>
                                            <h4 className="text-base font-semibold text-white">{option.name}</h4>
                                            <p className="mt-1 text-xs text-slate-400">{option.description || "Premium student card layout"}</p>
                                        </div>
                                        {isSelected && (
                                            <span className="inline-flex items-center rounded-full bg-cyan-400/15 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-cyan-300 ring-1 ring-cyan-400/30">
                                                Active
                                            </span>
                                        )}
                                    </div>
                                </button>
                            );
                        })}
                    </div>

                    <div className="flex flex-col-reverse gap-3 border-t border-white/10 px-6 py-5 sm:flex-row sm:items-center sm:justify-end sm:px-8">
                        <button
                            type="button"
                            onClick={() => setIsDesignModalOpen(false)}
                            className="rounded-xl border border-white/10 bg-white/5 px-5 py-2.5 text-sm font-medium text-gray-300 transition hover:bg-white/10 hover:text-white"
                        >
                            Cancel
                        </button>
                        <button
                            type="button"
                            onClick={() => setIsDesignModalOpen(false)}
                            className="rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-cyan-500/30 transition hover:brightness-110"
                        >
                            Done
                        </button>
                    </div>
                </div>
            </div>
        )}
        </>
    );
}

export default ControlPanel