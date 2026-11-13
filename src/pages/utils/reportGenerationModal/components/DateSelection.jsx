import { CalendarDays } from 'lucide-react'

function DateSelection({ startDate, endDate, dateLimits, onStartDateChange, onEndDateChange, disabled = false, startLabel = 'Start date', endLabel = 'End date' }) {
    return (
        <div className="grid gap-4 sm:grid-cols-2">
            <label className="block text-sm font-medium text-gray-300">
                <span className="mb-2 block">{startLabel}</span>
                <span className="flex items-center gap-3 rounded-lg border border-white/10 bg-[#22252a] px-3 text-gray-400 transition focus-within:border-emerald-400/70">
                    <CalendarDays size={18} aria-hidden="true" />
                    <input type="date" lang="en-IN" value={startDate} min={dateLimits?.start_date} max={endDate || dateLimits?.end_date} onChange={event => onStartDateChange(event.target.value)} disabled={disabled || !dateLimits} className="min-w-0 flex-1 bg-transparent py-3 text-white outline-none disabled:cursor-wait disabled:opacity-50" required />
                </span>
            </label>
            <label className="block text-sm font-medium text-gray-300">
                <span className="mb-2 block">{endLabel}</span>
                <span className="flex items-center gap-3 rounded-lg border border-white/10 bg-[#22252a] px-3 text-gray-400 transition focus-within:border-emerald-400/70">
                    <CalendarDays size={18} aria-hidden="true" />
                    <input type="date" lang="en-IN" value={endDate} min={startDate || dateLimits?.start_date} max={dateLimits?.end_date} onChange={event => onEndDateChange(event.target.value)} disabled={disabled || !dateLimits} className="min-w-0 flex-1 bg-transparent py-3 text-white outline-none disabled:cursor-wait disabled:opacity-50" required />
                </span>
            </label>
        </div>
    )
}

export default DateSelection