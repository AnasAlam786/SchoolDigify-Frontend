import { useState } from 'react'
import { AlertTriangle, CheckCheck, Eraser, X } from 'lucide-react'

const actions = [
  { value: 'PRESENT', label: 'Mark all present' },
  { value: 'ABSENT', label: 'Mark all absent' },
  { value: 'UNMARK', label: 'Unmark all' },
]

function BulkAttendance({ className, date, onClose, onConfirm }) {
  const [action, setAction] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const selectedAction = actions.find(option => option.value === action)
  const formattedDate = date
    ? new Date(`${date}T00:00:00`).toLocaleDateString(undefined, {
        weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
      })
    : ''

  const handleSubmit = async event => {
    event.preventDefault()
    if (!action || loading) return

    setLoading(true)
    setError('')
    const result = await onConfirm(action)
    if (result) setError(result)
    setLoading(false)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4 py-6" onClick={loading ? undefined : onClose}>
      <div className="absolute inset-0 bg-black/75 backdrop-blur-sm" />
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="bulk-attendance-title"
        className="relative w-full max-w-lg overflow-hidden rounded-2xl border border-white/10 bg-[#17191d] shadow-2xl shadow-black/50"
        onClick={event => event.stopPropagation()}
      >
        <div className="h-1 bg-gradient-to-r from-emerald-400 via-cyan-400 to-blue-500" />
        <form onSubmit={handleSubmit}>
          <div className="p-5 sm:p-7">
            <div className="mb-6 flex items-start justify-between gap-4">
              <div className="flex items-center gap-3">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-cyan-400/10 text-cyan-300">
                  <CheckCheck size={22} aria-hidden="true" />
                </span>
                <div>
                  <h2 id="bulk-attendance-title" className="text-xl font-semibold text-white">Bulk attendance</h2>
                  <p className="mt-1 text-sm text-gray-400">One action for the whole class</p>
                </div>
              </div>
              <button type="button" onClick={onClose} disabled={loading} aria-label="Close dialog" className="rounded-lg p-2 text-gray-400 transition hover:bg-white/10 hover:text-white disabled:opacity-40">
                <X size={19} />
              </button>
            </div>

            <div className="mb-5 rounded-xl border border-white/10 bg-white/[0.035] p-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">Attendance will apply to</p>
              <p className="mt-2 font-semibold text-white">{className}</p>
              <p className="mt-1 text-sm text-gray-400">{formattedDate}</p>
            </div>

            <label htmlFor="bulk-attendance-action" className="mb-2 block text-sm font-medium text-gray-200">Choose an action</label>
            <select
              id="bulk-attendance-action"
              value={action}
              onChange={event => setAction(event.target.value)}
              className="w-full rounded-xl border border-white/10 bg-[#22252a] px-4 py-3 text-white outline-none transition focus:border-cyan-400/70 focus:ring-2 focus:ring-cyan-400/20"
            >
              <option value="" disabled>Select attendance action</option>
              {actions.map(option => <option key={option.value} value={option.value}>{option.label}</option>)}
            </select>

            <div className={`mt-4 flex gap-3 rounded-xl border p-4 ${action === 'UNMARK' ? 'border-amber-400/20 bg-amber-400/[0.06]' : 'border-cyan-400/15 bg-cyan-400/[0.05]'}`}>
              {action === 'UNMARK'
                ? <AlertTriangle size={19} className="mt-0.5 shrink-0 text-amber-300" aria-hidden="true" />
                : <CheckCheck size={19} className="mt-0.5 shrink-0 text-cyan-300" aria-hidden="true" />}
              <p className="text-sm leading-6 text-gray-300">
                {selectedAction
                  ? <><strong className="font-semibold text-white">{selectedAction.label}</strong> for every student in <strong className="font-semibold text-white">{className}</strong> on <strong className="font-semibold text-white">{formattedDate}</strong>.{action === 'UNMARK' ? ' Existing attendance records for this class and date will be removed.' : ' Any existing marks for this class and date will be replaced.'}</>
                  : <>Choose an action to see exactly what will happen. This affects every student enrolled in this class on the selected date.</>}
              </p>
            </div>

            {error && <p role="alert" className="mt-4 rounded-lg border border-red-400/20 bg-red-400/10 px-3 py-2.5 text-sm text-red-200">{error}</p>}
          </div>

          <div className="flex flex-col-reverse gap-3 border-t border-white/10 bg-black/10 p-5 sm:flex-row sm:justify-end sm:px-7">
            <button type="button" onClick={onClose} disabled={loading} className="rounded-xl border border-white/10 px-5 py-3 text-sm font-medium text-gray-300 transition hover:bg-white/5 disabled:opacity-50">Cancel</button>
            <button
              type="submit"
              disabled={!action || loading}
              className={`flex items-center justify-center gap-2 rounded-xl px-5 py-3 text-sm font-semibold text-white transition disabled:cursor-not-allowed disabled:opacity-40 ${action === 'UNMARK' ? 'bg-amber-600 hover:bg-amber-500' : 'bg-cyan-600 hover:bg-cyan-500'}`}
            >
              {action === 'UNMARK' ? <Eraser size={17} /> : <CheckCheck size={17} />}
              {loading ? 'Updating attendance...' : 'Confirm and apply'}
            </button>
          </div>
        </form>
      </section>
    </div>
  )
}

export default BulkAttendance