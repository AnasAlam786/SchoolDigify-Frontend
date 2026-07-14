export default function PaperInfoCard({ meta, onMetaChange, totals }) {
  return (
    <div className="bg-navbg/50 backdrop-blur-sm border border-gray-700 rounded-2xl shadow-2xl overflow-hidden">
      <div className="bg-gradient-to-r from-primary/20 to-secondary/20 border-b border-gray-700 px-6 py-4">
        <h2 className="text-lg font-bold text-white flex items-center gap-3">
          <i className="fas fa-file-alt text-primary" />
          Paper Information
        </h2>
      </div>
      <div className="p-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div>
            <label className="block text-sm font-semibold text-white mb-2">Event/Assessment</label>
            <div className="relative">
              <i className="fas fa-calendar absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                id="event"
                className="pl-10 w-full bg-darkbg/50 text-white border border-gray-600 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition"
                placeholder="Formative Assessment - I"
                value={meta.event}
                onChange={(e) => onMetaChange('event', e.target.value)}
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-semibold text-white mb-2">Subject</label>
            <div className="relative">
              <i className="fas fa-book absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                className="pl-10 w-full bg-darkbg/50 text-white border border-gray-600 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition"
                placeholder="Mathematics"
                value={meta.subject}
                onChange={(e) => onMetaChange('subject', e.target.value)}
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-semibold text-white mb-2">Class/Grade</label>
            <div className="relative">
              <i className="fas fa-graduation-cap absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                className="pl-10 w-full bg-darkbg/50 text-white border border-gray-600 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition"
                placeholder="Class 10A"
                value={meta.std}
                onChange={(e) => onMetaChange('std', e.target.value)}
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-semibold text-white mb-2">Duration</label>
              <div className="relative">
                <i className="fas fa-clock absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  className="pl-10 w-full bg-darkbg/50 text-white border border-gray-600 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition"
                  placeholder="2 Hrs"
                  value={meta.hrs}
                  onChange={(e) => onMetaChange('hrs', e.target.value)}
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-semibold text-white mb-2">Total Marks</label>
              <div className="relative">
                <i className="fas fa-star absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="number"
                  className="pl-10 w-full bg-darkbg/50 text-white border border-gray-600 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition"
                  placeholder="100"
                  value={meta.MM}
                  onChange={(e) => onMetaChange('MM', e.target.value)}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 flex flex-wrap items-center justify-between gap-4 border-t border-gray-700 pt-5">
          <div className="hidden text-success text-sm items-center gap-2">
            <i className="fas fa-check-circle" />
            Changes saved
          </div>
          <div className="flex items-center gap-6 text-sm">
            <div className="flex items-center gap-2">
              <span className="text-gray-400">Questions:</span>
              <span className="text-white font-bold">{totals.totalQuestions}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-gray-400">Sections:</span>
              <span className="text-white font-bold">{totals.totalSections}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-gray-400">Marks:</span>
              <span className="text-white font-bold">{meta.MM}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
