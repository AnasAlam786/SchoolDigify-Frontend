function ReportModal({ children, onClose, loading = false, labelledBy = 'report-modal-title', className = '' }) {
    return (
        <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/75 p-2 backdrop-blur-sm sm:p-5" onClick={loading ? undefined : onClose}>
            <section
                role="dialog"
                aria-modal="true"
                aria-labelledby={labelledBy}
                className={`relative flex max-h-[96vh] w-full flex-col overflow-hidden rounded-xl border border-white/10 bg-[#17191d] shadow-2xl ${className}`}
                onClick={event => event.stopPropagation()}
            >
                {children}
            </section>
        </div>
    )
}

export default ReportModal