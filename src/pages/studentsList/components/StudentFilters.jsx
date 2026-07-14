import { useState } from "react";
import { DEFAULT_FILTERS, fieldOptions, sortOptions } from "./StudentsFilter";



export default function StudentFilters({
    studentFilters, setStudentFilters,
    totalCount, visibleCount,
    activeTags, 
    classes, 
}) {

    let hasActiveTags = activeTags.length > 0

    const [desktopAdvancedOpen, setDesktopAdvancedOpen] = useState(false);
    const [mobileAdvancedOpen, setMobileAdvancedOpen] = useState(false);

    const onToggleDesktopAdvanced = () => setDesktopAdvancedOpen((prev) => !prev)
    const onToggleMobileAdvanced = () => setMobileAdvancedOpen((prev) => !prev)


    const updateFilter = (key, value) => {
        setStudentFilters((prev) => ({ ...prev, [key]: value }));
    };

    const clearFilters = () => {
        setStudentFilters(DEFAULT_FILTERS);
    };

    const onSortToggle = () => {
        setStudentFilters((prev) => ({ ...prev, sortDir: prev.sortDir === "asc" ? "desc" : "asc" }));
    };

    return (
        <>
            <div className="hidden lg:block">
                <div className="p-6 space-y-6">
                    <div className="flex items-center gap-6">
                        <div className="flex-1 bg-gray-900/40 backdrop-blur-xl rounded-2xl p-5 border border-gray-800/70">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-2 h-8 bg-gradient-to-b from-blue-500 to-cyan-400 rounded-full" />
                                <h3 className="text-lg font-semibold text-white">Search Students</h3>
                            </div>

                            <div className="flex items-stretch gap-3">
                                <div className="flex-1 relative">
                                    <input
                                        type="text"
                                        value={studentFilters.search}
                                        onChange={(e) => updateFilter("search", e.target.value)}
                                        placeholder="Search by name, father name, SR, pen..."
                                        className="w-full h-full bg-gray-900/80 backdrop-blur-sm border border-gray-700/50 rounded-xl pl-5 pr-36 py-4 text-base focus:outline-none focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20 transition-all duration-200 placeholder-gray-500"
                                    />
                                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2 flex items-center gap-2">
                                        <div className="w-px h-6 bg-gray-700" />
                                        <select
                                            value={studentFilters.searchIn}
                                            onChange={(e) => updateFilter("searchIn", e.target.value)}
                                            className="appearance-none bg-transparent border-0 pl-2 pr-6 py-1 text-sm focus:outline-none focus:ring-0 cursor-pointer text-white"
                                            style={{
                                                backgroundImage:
                                                    "url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%239ca3af%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.5-12.8z%22%2F%3E%3C%2Fsvg%3E')",
                                                backgroundRepeat: "no-repeat",
                                                backgroundPosition: "right .25rem center",
                                                backgroundSize: ".6rem auto",
                                            }}
                                        >
                                            {fieldOptions.map((option) => (
                                                <option key={option.value} value={option.value}>
                                                    {option.label}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                </div>

                                <div className="relative">
                                    <div className="text-xs text-gray-400 absolute -top-5 left-0">Class</div>
                                    <select
                                        value={studentFilters.classView}
                                        onChange={(e) => updateFilter("classView", e.target.value)}
                                        className="h-full bg-gray-900/80 backdrop-blur-sm border border-gray-700/50 rounded-xl pl-4 pr-10 py-4 text-base focus:outline-none focus:border-emerald-500/50 focus:ring-2 focus:ring-emerald-500/20 transition-all duration-200 cursor-pointer text-white appearance-none min-w-[180px]"
                                        style={{
                                            backgroundImage:
                                                "url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%239ca3af%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.5-12.8z%22%2F%3E%3C%2Fsvg%3E')",
                                            backgroundRepeat: "no-repeat",
                                            backgroundPosition: "right 1rem center",
                                            backgroundSize: ".65rem auto",
                                        }}
                                    >
                                        <option value="All">All Classes</option>
                                        {classes.map(cls => (
                                            <option key={cls.id} value={cls.id}>
                                                {cls.class_name}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                        </div>

                        <div className="bg-gradient-to-br from-gray-900/40 to-gray-900/20 backdrop-blur-xl rounded-2xl p-5 border border-gray-800/70 min-w-[320px]">
                            <div className="flex items-center justify-between h-full">
                                <div className="text-center">
                                    <div className="text-sm text-gray-400 mb-2">Showing</div>
                                    <div className="text-3xl font-bold text-white">
                                        <span className="text-blue-400">{visibleCount}</span>
                                        <span className="text-gray-500 mx-2">/</span>
                                        <span className="text-gray-300">{totalCount}</span>
                                    </div>
                                    <div className="text-xs text-gray-400 mt-1">students</div>
                                </div>

                                <div className="w-px h-16 bg-gray-800" />

                                <button
                                    type="button"
                                    onClick={clearFilters}
                                    title="Clear all filters"
                                    className="relative flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-red-500/15 to-red-700/20 border border-red-500/40 text-red-300 hover:from-red-500/30 hover:to-red-700/30 hover:border-red-400/70 hover:shadow-[0_0_0_3px_rgba(239,68,68,0.15)] active:scale-95 transition-all duration-300 group"
                                >
                                    <svg className="w-5 h-5 group-hover:rotate-90 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className="bg-gray-900/40 backdrop-blur-xl border border-gray-800/70 rounded-2xl overflow-hidden">
                        <div
                            id="toggle-advanced-all"
                            role="button"
                            aria-expanded={desktopAdvancedOpen}
                            className="group flex items-center justify-between px-6 py-4 cursor-pointer select-none hover:bg-gray-800/40 transition-colors"
                            onClick={onToggleDesktopAdvanced}
                        >
                            <div className="flex items-center gap-4">
                                <div className="w-2 h-10 rounded-full bg-gradient-to-b from-purple-500 via-pink-500 to-amber-400" />
                                <div>
                                    <h3 className="text-lg font-semibold text-white leading-tight">Advanced Filtering</h3>
                                    <p className="text-xs text-gray-400">Filters and sorting options (collapsed)</p>
                                </div>
                            </div>

                            <div className="flex items-center gap-3">
                                <span className="text-xs text-gray-500 opacity-0 group-hover:opacity-100 transition-opacity">Click to expand</span>
                                <div className="p-2 rounded-lg bg-gray-900/40 border border-gray-700/40 group-hover:border-purple-500/40 transition-all">
                                    <svg
                                        id="advanced-all-chevron"
                                        className={`w-5 h-5 text-gray-300 transform transition-transform duration-300 ${desktopAdvancedOpen ? "rotate-180" : ""}`}
                                        viewBox="0 0 20 20"
                                        fill="none"
                                        stroke="currentColor"
                                    >
                                        <path d="M6 8l4 4 4-4" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div
                        id="advanced-filters-section"
                        className="grid grid-cols-2 gap-6"
                        style={{ display: desktopAdvancedOpen ? "grid" : "none" }}
                    >
                        <div className="bg-gray-900/40 backdrop-blur-xl rounded-2xl p-5 border border-gray-800/70">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-2 h-8 bg-gradient-to-b from-purple-500 to-pink-400 rounded-full" />
                                <h3 className="text-lg font-semibold text-white">Advanced Filters</h3>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="bg-gray-900/50 rounded-xl p-4 border border-gray-700/30 hover:border-purple-500/30 transition-colors">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-xl bg-purple-500/10 flex items-center justify-center">
                                                <svg className="w-5 h-5 text-purple-400" fill="currentColor" viewBox="0 0 20 20">
                                                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                                </svg>
                                            </div>
                                            <div>
                                                <div className="text-sm font-medium text-white">RTE</div>
                                                <div className="text-xs text-gray-400">Students</div>
                                            </div>
                                        </div>
                                        <label className="relative inline-flex items-center cursor-pointer">
                                            <input
                                                type="checkbox"
                                                checked={studentFilters.filterRTE}
                                                onChange={(e) => updateFilter("filterRTE", e.target.checked)}
                                                className="sr-only peer"
                                            />
                                            <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-500" />
                                        </label>
                                    </div>
                                </div>

                                <div className="bg-gray-900/50 rounded-xl p-4 border border-gray-700/30 hover:border-purple-500/30 transition-colors">
                                    <div className="mb-1">
                                        <div className="text-xs text-gray-400 mb-1">PEN Status</div>
                                        <select
                                            value={studentFilters.filterPEN}
                                            onChange={(e) => updateFilter("filterPEN", e.target.value)}
                                            className="w-full appearance-none bg-transparent border-0 text-sm focus:outline-none focus:ring-0 cursor-pointer text-white"
                                        >
                                            <option value="any">Any Status</option>
                                            <option value="present">PEN Present</option>
                                            <option value="missing">PEN Missing</option>
                                        </select>
                                    </div>
                                </div>

                                <div className="bg-gray-900/50 rounded-xl p-4 border border-gray-700/30 hover:border-purple-500/30 transition-colors">
                                    <div className="mb-1">
                                        <div className="text-xs text-gray-400 mb-1">Gender</div>
                                        <select
                                            value={studentFilters.filterGender}
                                            onChange={(e) => updateFilter("filterGender", e.target.value)}
                                            className="w-full appearance-none bg-transparent border-0 text-sm focus:outline-none focus:ring-0 cursor-pointer text-white"
                                        >
                                            <option value="any">Any Gender</option>
                                            <option value="male">Male</option>
                                            <option value="female">Female</option>
                                            <option value="other">Other</option>
                                        </select>
                                    </div>
                                </div>

                                <div className="bg-gray-900/50 rounded-xl p-4 border border-gray-700/30 hover:border-purple-500/30 transition-colors">
                                    <div className="mb-1">
                                        <div className="text-xs text-gray-400 mb-1">Admission Type</div>
                                        <select
                                            value={studentFilters.filterAdmission}
                                            onChange={(e) => updateFilter("filterAdmission", e.target.value)}
                                            className="w-full appearance-none bg-transparent border-0 text-sm focus:outline-none focus:ring-0 cursor-pointer text-white"
                                        >
                                            <option value="any">Any Admission</option>
                                            <option value="new">New Admission</option>
                                            <option value="old">Old Student</option>
                                        </select>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="bg-gray-900/40 backdrop-blur-xl rounded-2xl p-5 border border-gray-800/70">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-2 h-8 bg-gradient-to-b from-amber-500 to-orange-400 rounded-full" />
                                <h3 className="text-lg font-semibold text-white">Sorting</h3>
                            </div>

                            <div className="space-y-4">
                                <div className="bg-gray-900/50 rounded-xl p-4 border border-gray-700/30">
                                    <div className="text-xs text-gray-400 mb-2">Sort By</div>
                                    <div className="flex items-center gap-3">
                                        <select
                                            value={studentFilters.sortBy}
                                            onChange={(e) => updateFilter("sortBy", e.target.value)}
                                            className="flex-1 appearance-none bg-transparent border-0 text-base focus:outline-none focus:ring-0 cursor-pointer text-white pr-8"
                                        >
                                            {sortOptions.map((option) => (
                                                <option key={option.value} value={option.value}>
                                                    {option.label}
                                                </option>
                                            ))}
                                        </select>

                                        <button
                                            type="button"
                                            id="sort-dir-toggle"
                                            className="flex items-center justify-center w-10 h-10 bg-gradient-to-br from-amber-500/20 to-orange-500/20 border border-amber-500/30 rounded-lg"
                                            onClick={onSortToggle}
                                        >
                                            <div className="transform transition-transform duration-300" id="sort-dir-icon">
                                                {studentFilters.sortDir === "asc" ? (
                                                    <svg className="w-5 h-5 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 15l7-7 7 7" />
                                                    </svg>
                                                ) : (
                                                    <svg className="w-5 h-5 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                                                    </svg>
                                                )}
                                            </div>
                                        </button>
                                    </div>
                                </div>

                                <div id="active-filters" className="min-h-[50px] bg-gradient-to-r from-gray-900/40 
                                    to-gray-900/20 border border-gray-700/30 rounded-xl p-3 flex items-center gap-2 
                                    backdrop-blur-sm flex-wrap"
                                    style={{ display: hasActiveTags ? "flex" : "none" }}>
                                    {activeTags?.length ? (
                                        activeTags.map((tag) => (
                                            <span key={tag} className="rounded-full bg-gray-800 px-3 py-1 text-sm text-gray-300">
                                                {tag}
                                            </span>
                                        ))
                                    ) : (
                                        <div className="text-sm text-gray-400 italic">No active filters</div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="lg:hidden mb-3">
                <div className="space-y-4">
                    <div className="bg-gray-900/40 backdrop-blur-xl rounded-2xl p-5 border border-gray-800/50">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-2 h-6 bg-gradient-to-b from-blue-500 to-cyan-400 rounded-full" />
                            <h3 className="text-base font-semibold text-white">Search Students</h3>
                        </div>

                        <div className="space-y-3">
                            <div className="relative">
                                <input
                                    type="text"
                                    value={studentFilters.search}
                                    onChange={(e) => updateFilter("search", e.target.value)}
                                    placeholder="Search students..."
                                    className="w-full bg-gray-900/80 backdrop-blur-sm border border-gray-700/50 rounded-xl pl-4 pr-28 py-3.5 text-base focus:outline-none focus:border-blue-500/50"
                                />
                                <div className="absolute right-2 top-1/2 transform -translate-y-1/2">
                                    <select
                                        value={studentFilters.searchIn}
                                        onChange={(e) => updateFilter("searchIn", e.target.value)}
                                        className="appearance-none bg-transparent border-0 pl-1 pr-5 py-1 text-xs focus:outline-none focus:ring-0 cursor-pointer text-white"
                                    >
                                        {fieldOptions.map((option) => (
                                            <option key={option.value} value={option.value}>
                                                {option.label}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            <div>
                                <div className="text-xs text-gray-400 mb-1 ml-1">Class Filter</div>
                                <select
                                    value={studentFilters.classView}
                                    onChange={(e) => updateFilter("classView", e.target.value)}
                                    className="w-full appearance-none bg-gray-900/80 backdrop-blur-sm border border-gray-700/50 rounded-xl px-4 py-3 text-sm focus:outline-none cursor-pointer text-white"
                                >
                                    <option value="All">All Classes</option>
                                    {classes.map(cls => (
                                        <option key={cls.id} value={cls.id}>
                                            {cls.class_name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    </div>

                    <div className="bg-gray-900/40 backdrop-blur-xl border border-gray-800/50 rounded-2xl overflow-hidden">
                        <div
                            id="toggle-advanced-all-mobile"
                            role="button"
                            aria-expanded={mobileAdvancedOpen}
                            className="group flex items-center justify-between px-5 py-4 cursor-pointer select-none hover:bg-gray-800/40 transition-colors"
                            onClick={onToggleMobileAdvanced}
                        >
                            <div className="flex items-center gap-3">
                                <div className="w-1.5 h-8 rounded-full bg-gradient-to-b from-purple-500 via-pink-500 to-amber-400" />
                                <div>
                                    <h3 className="text-sm font-semibold text-white leading-tight">Advanced Filtering</h3>
                                    <p className="text-[11px] text-gray-400">Filters and sorting options</p>
                                </div>
                            </div>

                            <div className="flex items-center gap-2">
                                <span className="text-[10px] text-gray-500 opacity-0 group-hover:opacity-100 transition-opacity">Tap to expand</span>
                                <div className="p-1.5 rounded-md bg-gray-900/40 border border-gray-700/40 group-hover:border-purple-500/40 transition-all">
                                    <svg
                                        id="advanced-all-chevron-mobile"
                                        className={`w-4 h-4 text-gray-300 transform transition-transform duration-300 ${mobileAdvancedOpen ? "rotate-180" : ""}`}
                                        viewBox="0 0 20 20"
                                        fill="none"
                                        stroke="currentColor"
                                    >
                                        <path d="M6 8l4 4 4-4" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div id="advanced-filters-section-mobile" style={{ display: mobileAdvancedOpen ? "block" : "none" }} className="space-y-4">
                        <div className="bg-gray-900/40 backdrop-blur-xl rounded-2xl p-5 border border-gray-800/50">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-2 h-6 bg-gradient-to-b from-purple-500 to-pink-400 rounded-full" />
                                <h3 className="text-base font-semibold text-white">Filters</h3>
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <div className="bg-gray-900/50 rounded-lg p-3 border border-gray-700/30">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <div className="w-8 h-8 rounded-lg bg-purple-500/10 flex items-center justify-center">
                                                <svg className="w-4 h-4 text-purple-400" fill="currentColor" viewBox="0 0 20 20">
                                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                                </svg>
                                            </div>
                                            <span className="text-sm font-medium text-white">RTE</span>
                                        </div>
                                        <label className="relative inline-flex items-center cursor-pointer">
                                            <input
                                                type="checkbox"
                                                checked={studentFilters.filterRTE}
                                                onChange={(e) => updateFilter("filterRTE", e.target.checked)}
                                                className="sr-only peer"
                                            />
                                            <div className="w-9 h-5 bg-gray-700 peer-focus:outline-none rounded-full peer 
                                            peer-checked:after:translate-x-full peer-checked:after:border-white 
                                            after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white 
                                            after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-purple-500" />
                                        </label>
                                    </div>
                                </div>

                                <div className="bg-gray-900/50 rounded-lg p-3 border border-gray-700/30">
                                    <div className="text-xs text-gray-400 mb-1">PEN Status</div>
                                    <select
                                        value={studentFilters.filterPEN}
                                        onChange={(e) => updateFilter("filterPEN", e.target.value)}
                                        className="w-full appearance-none bg-transparent border-0 text-sm focus:outline-none focus:ring-0 cursor-pointer text-white"
                                    >
                                        <option value="any">Any PEN</option>
                                        <option value="present">Present</option>
                                        <option value="missing">Missing</option>
                                    </select>
                                </div>

                                <div className="bg-gray-900/50 rounded-lg p-3 border border-gray-700/30">
                                    <div className="text-xs text-gray-400 mb-1">Gender</div>
                                    <select
                                        value={studentFilters.filterGender}
                                        onChange={(e) => updateFilter("filterGender", e.target.value)}
                                        className="w-full appearance-none bg-transparent border-0 text-sm focus:outline-none focus:ring-0 cursor-pointer text-white"
                                    >
                                        <option value="any">Any Gender</option>
                                        <option value="male">Male</option>
                                        <option value="female">Female</option>
                                        <option value="other">Other</option>
                                    </select>
                                </div>

                                <div className="bg-gray-900/50 rounded-lg p-3 border border-gray-700/30">
                                    <div className="text-xs text-gray-400 mb-1">Admission</div>
                                    <select
                                        value={studentFilters.filterAdmission}
                                        onChange={(e) => updateFilter("filterAdmission", e.target.value)}
                                        className="w-full appearance-none bg-transparent border-0 text-sm focus:outline-none focus:ring-0 cursor-pointer text-white"
                                    >
                                        <option value="any">Any Admission</option>
                                        <option value="new">New</option>
                                        <option value="old">Old</option>
                                    </select>
                                </div>
                            </div>
                        </div>

                        <div className="bg-gray-900/40 backdrop-blur-xl rounded-2xl p-5 border border-gray-800/50">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-2 h-6 bg-gradient-to-b from-amber-500 to-orange-400 rounded-full" />
                                <h3 className="text-base font-semibold text-white">Sorting</h3>
                            </div>

                            <div className="space-y-3">
                                <div className="bg-gray-900/50 rounded-lg p-3 border border-gray-700/30">
                                    <div className="text-xs text-gray-400 mb-1">Sort By</div>
                                    <div className="flex items-center gap-2">
                                        <select
                                            value={studentFilters.sortBy}
                                            onChange={(e) => updateFilter("sortBy", e.target.value)}
                                            className="flex-1 appearance-none bg-transparent border-0 text-sm focus:outline-none focus:ring-0 cursor-pointer text-white"
                                        >
                                            {sortOptions.map((option) => (
                                                <option key={option.value} value={option.value}>
                                                    {option.label}
                                                </option>
                                            ))}
                                        </select>

                                        <button
                                            type="button"
                                            id="sort-dir-toggle-mobile"
                                            className="flex items-center justify-center w-9 h-9 bg-gradient-to-br from-amber-500/20 to-orange-500/20 border border-amber-500/30 rounded-lg"
                                            onClick={onSortToggle}
                                        >
                                            {studentFilters.sortDir === "asc" ? (
                                                <svg className="w-4 h-4 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 15l7-7 7 7" />
                                                </svg>
                                            ) : (
                                                <svg className="w-4 h-4 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                                                </svg>
                                            )}
                                        </button>
                                    </div>
                                </div>

                                <div id="active-filters-mobile" className="min-h-[50px] bg-gradient-to-r 
                                from-gray-900/40 to-gray-900/20 border border-gray-700/30 rounded-xl p-3 flex items-center gap-2 backdrop-blur-sm overflow-x-auto">
                                    {activeTags?.length ? (
                                        activeTags.map((tag) => (
                                            <span key={tag} className="rounded-full bg-gray-800 px-3 py-1 text-sm text-gray-300">
                                                {tag}
                                            </span>
                                        ))
                                    ) : (
                                        <div className="text-sm text-gray-400 italic">No active filters</div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-gradient-to-r from-gray-900 to-gray-800 border-b border-gray-800 px-4 py-3 mt-3">
                        <div className="flex items-center justify-between">
                            <div className="text-center flex-1">
                                <div className="text-xl font-bold text-white">
                                    <span className="text-blue-400">{visibleCount}</span>
                                    <span className="text-gray-500 mx-2">/</span>
                                    <span className="text-gray-300">{totalCount}</span>
                                </div>
                                <div className="text-xs text-gray-400">students showing</div>
                            </div>

                            <button
                                type="button"
                                onClick={clearFilters}
                                id="clear-filters-mobile"
                                className="relative flex items-center justify-center w-10 h-10 rounded-lg bg-gradient-to-br 
                                from-red-500/15 to-red-700/20 border border-red-500/40 text-red-300 hover:from-red-500/30 
                                hover:to-red-700/30 hover:border-red-400/70 active:scale-95 transition-all duration-300 group"
                                title="Clear all filters">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
