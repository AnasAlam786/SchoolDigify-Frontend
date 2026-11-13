import { FileText, Printer, X } from 'lucide-react'

function Heading({ title, subtitle, icon: Icon = FileText, titleId = 'report-modal-title', printLabel = 'Print report', printableReport, onClose, actions }) {
    const printReport = () => {
        const printWindow = window.open('', '_blank')
        if (!printWindow) {
            alert('Allow pop-ups to open and print the report.')
            return
        }

        printWindow.document.open()
        printWindow.document.write(printableReport)
        printWindow.document.close()
    }

    return (
        <header className="flex shrink-0 items-center justify-between gap-4 border-b border-white/10 px-4 py-4 sm:px-6">
            <div className="flex min-w-0 items-center gap-3">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-emerald-400/10 text-emerald-300">
                    <Icon size={20} aria-hidden="true" />
                </span>
                <div className="min-w-0">
                    <h2 id={titleId} className="truncate text-lg font-semibold text-white sm:text-xl">
                        {title}
                    </h2>
                    {subtitle && <p className="text-xs text-gray-400 sm:text-sm">{subtitle}</p>}
                </div>
            </div>
            <div className="flex shrink-0 items-center gap-2">
                {printableReport && <button type="button" onClick={printReport} className="flex items-center gap-2 rounded-lg bg-emerald-600 px-3 py-2 text-sm font-semibold text-white transition hover:bg-emerald-500">
                    <Printer size={16} aria-hidden="true" /><span className="hidden sm:inline">{printLabel}</span>
                </button>}
                {actions}
                <button type="button" onClick={onClose} aria-label="Close report" className="rounded-lg p-2 text-gray-400 transition hover:bg-white/10 hover:text-white">
                    <X size={19} />
                </button>
            </div>
        </header>
    )
}

export default Heading