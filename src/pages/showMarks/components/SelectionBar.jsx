import React from 'react'

export default function SelectionBar(
    { filteredStudents, selectedIds, setSelectedIds, handlePrintCertificate, handlePrintResult }
) {

    const toggleSelectAll = () => {
        setSelectedIds((prev) => {
            const allIds = filteredStudents.map((student) => student.student_id)
            if (allIds.length === 0) return new Set()
            const allSelected = allIds.every((id) => prev.has(id))
            if (allSelected) return new Set()
            return new Set(allIds)
        })
    }

    const selectedCount = selectedIds.size
    const displayedCount = filteredStudents.length
    const allSelected = displayedCount > 0 && filteredStudents.every(
        (student) => selectedIds.has(student.student_id)
    )

    return (

        <div
            id="bulk-selection-bar"
            className="relative mb-10 rounded-2xl border border-white/10 bg-gradient-to-br from-white/[0.05] 
                    to-white/[0.02] backdrop-blur-2xl shadow-[0_10px_40px_rgba(0,0,0,0.5)]"
        >
            <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-6 p-4 sm:p-6">
                <div className="flex flex-wrap items-center gap-4 w-full lg:w-auto justify-between sm:justify-start">
                    <label className="flex items-center gap-2 sm:gap-3 cursor-pointer group">
                        <input
                            type="checkbox"
                            id="select-all"
                            onChange={toggleSelectAll}
                            checked={allSelected}
                            className="w-5 h-5 rounded-lg border border-gray-600 bg-gray-800 text-blue-500 focus:ring-2 focus:ring-blue-500/40"
                        />
                        <span className="text-sm sm:text-base text-gray-300 group-hover:text-white">Select All</span>
                    </label>

                    <div className="px-3 py-1.5 rounded-xl bg-black/30 border border-white/10">
                        <span id="selected-count" className="text-sm font-semibold text-gray-300">
                            {selectedCount} selected
                        </span>
                    </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
                    <button
                        type="button"
                        onClick={() => { setSelectedIds(new Set()) }}
                        className="w-full sm:w-auto px-4 py-2.5 rounded-xl border border-white/10 text-gray-400 hover:text-white hover:bg-white/5 text-sm font-medium"
                    >
                        Clear
                    </button>

                    <button
                        id="bulk-download-btn"
                        type="button"
                        disabled={selectedCount === 0}
                        onClick={() => handlePrintResult(selectedIds)}
                        className="w-full sm:w-auto flex items-center justify-center gap-2 sm:gap-3 px-4 sm:px-6 py-2.5 sm:py-3 rounded-xl text-sm font-semibold bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 shadow-lg hover:shadow-blue-500/20 disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                        <i className="fas fa-download"></i>
                        <span>Marksheet</span>
                        <span
                            id="download-count"
                            className="px-2 py-0.5 rounded-lg bg-white/20 text-xs font-bold min-w-[26px] 
                            text-center" >
                            {selectedCount}
                        </span>
                    </button>

                    <button
                        id="bulk-certificate-btn"
                        type="button"
                        disabled={selectedCount === 0}
                        onClick={() => handlePrintCertificate(selectedIds)}
                        className="w-full sm:w-auto flex items-center justify-center gap-2 sm:gap-3 px-4 sm:px-6 py-2.5 sm:py-3 
                            rounded-xl text-sm font-semibold bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 
                            hover:to-orange-400 shadow-lg hover:shadow-amber-400/20 disabled:opacity-40 disabled:cursor-not-allowed">
                        <i className="fas fa-download"></i>
                        <span className="truncate"> Certificates</span>
                        <span
                            id="download-count"
                            className="px-2 py-0.5 rounded-lg bg-white/20 text-xs font-bold min-w-[26px] 
                            text-center" >
                            {selectedCount}
                        </span>
                    </button>
                </div>
            </div>
        </div>
    )
}
