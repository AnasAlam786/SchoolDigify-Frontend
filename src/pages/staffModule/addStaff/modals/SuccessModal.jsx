export default function SuccessModal({ message, onClose, onSendWhatsApp }) {
  return (
    <div className="modal fixed inset-0 w-full h-full bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="modal-content bg-slate-800 rounded-2xl max-w-md w-full overflow-hidden shadow-modal animate-scale-in">
        <div className="success-modal-content text-center p-8">
          <div className="success-icon w-20 h-20 bg-success-gradient rounded-full flex items-center justify-center mx-auto mb-5 text-white text-2xl shadow-lg animate-modal-enter">
            <i className="fas fa-check" />
          </div>
          <h2 className="success-title text-2xl font-bold mb-3 text-white">Success!</h2>
          <p className="success-message text-slate-300 mb-6">{message}</p>
          <div className="success-actions flex flex-col sm:flex-row justify-center gap-3 mt-6">
            <a
              href="/show_staff"
              className="btn btn-success px-5 py-3 rounded-xl font-medium flex items-center justify-center gap-2 cursor-pointer transition-all duration-300 border-none bg-success-gradient text-white hover:shadow-success-glow w-full sm:w-auto"
            >
              <i className="fas fa-users" />
              Staff Module
            </a>
            <button
              type="button"
              onClick={onSendWhatsApp}
              className="btn btn-whatsapp px-5 py-3 rounded-xl font-medium flex items-center justify-center gap-2 cursor-pointer transition-all duration-300 border-none bg-whatsapp-gradient text-white hover:shadow-whatsapp-glow w-full sm:w-auto"
            >
              <i className="fab fa-whatsapp" />
              Send WhatsApp
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
