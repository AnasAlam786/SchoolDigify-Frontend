function ClassesSelection({ classes = [], selectedClassIds = [], onToggleClass, disabled = false, label = 'Classes to include' }) {
    return (
        <fieldset disabled={disabled} className="min-w-0">
            <legend className="mb-2 flex w-full items-center justify-between gap-3 text-sm font-medium text-gray-300">
                <span>{label}</span>
                <span className="text-xs font-normal text-gray-500">{selectedClassIds.length} selected</span>
            </legend>
            <div className="grid max-h-36 grid-cols-2 gap-2 overflow-y-auto rounded-lg border border-white/10 bg-[#22252a] p-2 sm:grid-cols-3 lg:grid-cols-4">
                {classes.map(classItem => {
                    const classId = String(classItem.id)
                    const selected = selectedClassIds.includes(classId)
                    return <label key={classItem.id} data-selected={selected} className={`attendance-report-class-option flex min-w-0 cursor-pointer items-center gap-2 rounded-md px-3 py-2.5 text-sm transition ${selected ? 'bg-emerald-400/10 text-emerald-100 ring-1 ring-inset ring-emerald-400/30' : 'text-gray-300 hover:bg-white/[0.06]'} ${disabled ? 'cursor-wait opacity-50' : ''}`}>
                        <input type="checkbox" checked={selected} onChange={() => onToggleClass(classId)} className="accent-emerald-400" />
                        <span className="truncate">{classItem.class_name}</span>
                    </label>
                })}
            {!classes.length && <span className="col-span-full px-2 py-2 text-sm text-gray-500">No classes available</span>}
            </div>
        </fieldset>
    )
}

export default ClassesSelection