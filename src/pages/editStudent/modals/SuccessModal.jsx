import { sendMessage } from "../../utils/sendWhatsAppMessage";
import { printAdmissionForm } from "../../utils/printAdmissionForm";

export default function SuccessModal({ mode, message, studentID, onClose, }) {

  const onPrint = () => {
    if (!studentID) return
    printAdmissionForm(studentID)
  };

  const onWhatsApp = () => {
    if (!studentID) return
    sendMessage(studentID)
  };
  
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

            <h3 className="text-xl sm:text-2xl font-bold text-white mb-3">{mode === 'edit' ? 'Student Updated!' : 'Student Added Successfully!'}</h3>
            <p className="text-gray-400 mb-6 sm:mb-8 text-sm sm:text-base">{message}</p>

            <div className="flex flex-col gap-3">
              <button
                type="button"
                onClick={onPrint}
                className="group px-4 sm:px-6 py-3 sm:py-3.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold transition-all duration-300 hover:shadow-xl hover:scale-[1.01] inline-flex items-center justify-center gap-2 text-sm sm:text-base"
              >
                <i className="fas fa-print"></i>
                Print Admission Form
                <i className="fas fa-arrow-right group-hover:translate-x-1 transition-transform"></i>
              </button>

              {mode !== 'edit' ? (
                <button
                  type="button"
                  onClick={onWhatsApp}
                  className="group px-4 sm:px-6 py-3 sm:py-3.5 rounded-xl bg-gradient-to-r from-green-600 to-emerald-600 text-white font-semibold transition-all duration-300 hover:shadow-xl hover:scale-[1.01] inline-flex items-center justify-center gap-2 text-sm sm:text-base"
                >
                  <i className="fab fa-whatsapp"></i>
                  Send WhatsApp
                  <i className="fas fa-paper-plane group-hover:translate-x-1 transition-transform"></i>
                </button>
              ) : null}

              <button
                type="button"
                onClick={onClose}
                className="px-4 sm:px-6 py-2.5 rounded-xl bg-gray-800 hover:bg-gray-700 border border-gray-700 text-gray-300 hover:text-white transition-all duration-300 font-medium text-sm sm:text-base"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
