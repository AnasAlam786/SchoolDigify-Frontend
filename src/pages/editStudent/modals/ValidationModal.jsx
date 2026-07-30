export default function ValidationModal({ open, data, onClose, onConfirm }) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-lg z-[100] flex items-center justify-center p-4">
      <div className="modal-wrapper w-full max-w-md">
        <div className="modal-animate-in w-full bg-gradient-to-br from-gray-900 to-gray-950 rounded-2xl border border-gray-800/50 shadow-2xl overflow-hidden">
          <div className="p-6 sm:p-8 text-center">
            <div className="relative inline-block mb-4 sm:mb-6">
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-gradient-to-br from-emerald-600 to-teal-600 flex items-center justify-center mx-auto shadow-lg animate-bounce">
                <i className="fas fa-check text-white text-xl sm:text-2xl"></i>
              </div>
              <div className="absolute -top-2 -right-2 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center border-4 border-gray-900 animate-pulse">
                <i className="fas fa-star text-white text-xs sm:text-sm"></i>
              </div>
            </div>

            <h3 className="text-xl sm:text-2xl font-bold text-white mb-3">Review Student Details</h3>
            <p className="text-gray-400 mb-6 sm:mb-8 text-sm sm:text-base">
              Confirm the details before completing the admission process.
            </p>

            <div className="bg-[#0f172a] rounded-3xl border border-gray-800/70 p-5 text-left space-y-3 mb-6">
              <div className="grid gap-3 sm:grid-cols-2">
                <div>
                  <p className="text-xs text-gray-400">Student</p>
                  <p className="text-white font-semibold">{data?.STUDENTS_NAME || '—'}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-400">Current Class</p>
                  <p className="text-white font-semibold">{data?.CLASS || '—'}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-400">Admission No.</p>
                  <p className="text-white font-semibold">{data?.ADMISSION_NO || '—'}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-400">Phone</p>
                  <p className="text-white font-semibold">{data?.PHONE || '—'}</p>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-3">
              <button
                type="button"
                onClick={onConfirm}
                className="inline-flex items-center justify-center gap-2 px-4 sm:px-6 py-3 sm:py-3.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold transition-all duration-300 hover:shadow-xl hover:scale-[1.01]"
              >
                <i className="fas fa-check-circle"></i>
                Submit Admission
              </button>
              <button
                type="button"
                onClick={onClose}
                className="px-4 sm:px-6 py-2.5 rounded-xl bg-gray-800 hover:bg-gray-700 border border-gray-700 text-gray-300 hover:text-white transition-all duration-300 font-medium text-sm sm:text-base"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
