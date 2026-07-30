export default function VerificationModal({ open, reviewData, imageUrl, onClose, onConfirm }) {
  if (!open || !reviewData) return null;

  const formatDate = (value) => {
    if (!value) return "Not Provided";
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return "Not Provided";
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div className="modal fixed inset-0 w-full h-full bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="modal-content bg-slate-800 rounded-2xl max-w-2xl w-full overflow-hidden shadow-modal animate-modal-enter">
        <div className="modal-header p-6 pb-4 border-b border-slate-700">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-indigo-500/20 flex items-center justify-center">
                <i className="fas fa-shield-alt text-indigo-500" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-white">Verify Staff Details</h3>
                <p className="text-sm text-slate-400 mt-1">Review all information before adding to system</p>
              </div>
            </div>
            <button
              className="close-modal bg-slate-700 hover:bg-slate-600 w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:text-white transition-colors duration-300"
              type="button"
              onClick={onClose}
            >
              <i className="fas fa-times" />
            </button>
          </div>
        </div>

        <div className="modal-body p-6 max-h-[70vh] overflow-y-auto modal-scrollbar">
          <div className="flex flex-col items-center mb-6">
            <div
              className="profile-preview w-24 h-24 rounded-full mb-4 bg-cover bg-center border-4 border-indigo-500/30 shadow-lg bg-slate-700 flex items-center justify-center text-slate-400"
              style={{ backgroundImage: imageUrl ? `url(${imageUrl})` : "none" }}
            >
              {!imageUrl ? <i className="fas fa-user text-2xl" /> : null}
            </div>
          </div>

          <div className="verification-grid grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div className="verification-item p-4 bg-slate-700/50 rounded-xl border border-slate-600">
              <div className="verification-label text-xs text-slate-400 mb-1">Full Name</div>
              <div className="verification-value font-medium text-white">{reviewData.name || "Not Provided"}</div>
            </div>
            <div className="verification-item p-4 bg-slate-700/50 rounded-xl border border-slate-600">
              <div className="verification-label text-xs text-slate-400 mb-1">Email</div>
              <div className="verification-value font-medium text-white">{reviewData.email || "Not Provided"}</div>
            </div>
            <div className="verification-item p-4 bg-slate-700/50 rounded-xl border border-slate-600">
              <div className="verification-label text-xs text-slate-400 mb-1">Phone</div>
              <div className="verification-value font-medium text-white">{reviewData.phone || "Not Provided"}</div>
            </div>
            <div className="verification-item p-4 bg-slate-700/50 rounded-xl border border-slate-600">
              <div className="verification-label text-xs text-slate-400 mb-1">Role</div>
              <div className="verification-value font-medium text-white">{reviewData.role_name || "Not selected"}</div>
            </div>
            <div className="verification-item p-4 bg-slate-700/50 rounded-xl border border-slate-600">
              <div className="verification-label text-xs text-slate-400 mb-1">Username</div>
              <div className="verification-value font-medium text-white">{reviewData.username || "Not Provided"}</div>
            </div>
            <div className="verification-item p-4 bg-slate-700/50 rounded-xl border border-slate-600">
              <div className="verification-label text-xs text-slate-400 mb-1">Status</div>
              <div className="verification-value font-medium">
                <span className="px-2 py-1 rounded-full text-xs bg-emerald-500/20 text-emerald-400">Active</span>
              </div>
            </div>
            <div className="verification-item p-4 bg-slate-700/50 rounded-xl border border-slate-600">
              <div className="verification-label text-xs text-slate-400 mb-1">Qualification</div>
              <div className="verification-value font-medium text-white">{reviewData.qualification || "Not Provided"}</div>
            </div>
            <div className="verification-item p-4 bg-slate-700/50 rounded-xl border border-slate-600">
              <div className="verification-label text-xs text-slate-400 mb-1">Salary</div>
              <div className="verification-value font-medium text-white">{reviewData.salary || "Not Provided"}</div>
            </div>
            <div className="verification-item p-4 bg-slate-700/50 rounded-xl border border-slate-600">
              <div className="verification-label text-xs text-slate-400 mb-1">National ID</div>
              <div className="verification-value font-medium text-white">{reviewData.national_id || "Not Provided"}</div>
            </div>
            <div className="verification-item p-4 bg-slate-700/50 rounded-xl border border-slate-600 md:col-span-2">
              <div className="verification-label text-xs text-slate-400 mb-1">Assigned Classes</div>
              <div className="verification-value flex flex-wrap gap-1">
                {reviewData.assignedClasses?.length > 0 ? (
                  reviewData.assignedClasses.map((className) => (
                    <span key={className} className="inline-flex items-center px-2 py-1 rounded-full bg-blue-50 text-blue-700 text-sm">
                      {className}
                    </span>
                  ))
                ) : (
                  <span className="inline-flex items-center px-2 py-1 rounded-full bg-gray-100 text-gray-600 text-sm">None</span>
                )}
              </div>
            </div>
            <div className="verification-item p-4 bg-slate-700/50 rounded-xl border border-slate-600 md:col-span-2">
              <div className="verification-label text-xs text-slate-400 mb-1">Assigned Permissions</div>
              <div className="verification-value flex flex-wrap gap-1">
                {reviewData.assignedPermissions?.length > 0 ? (
                  reviewData.assignedPermissions.map((permission) => (
                    <span key={permission} className="inline-flex items-center px-2 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-sm">
                      {permission}
                    </span>
                  ))
                ) : (
                  <span className="inline-flex items-center px-2 py-1 rounded-full bg-gray-100 text-gray-600 text-sm">None</span>
                )}
              </div>
            </div>
            <div className="verification-item p-4 bg-slate-700/50 rounded-xl border border-slate-600 md:col-span-2">
              <div className="verification-label text-xs text-slate-400 mb-1">Date of Joining</div>
              <div className="verification-value font-medium text-white">{formatDate(reviewData.date_of_joining)}</div>
            </div>
          </div>

          <div className="mt-6 bg-slate-700/30 p-4 rounded-xl border border-slate-600">
            <div className="flex items-start gap-3">
              <i className="fas fa-info-circle text-indigo-500 mt-0.5" />
              <p className="text-sm text-slate-300">
                Please verify all details carefully before adding to the system. Once confirmed, the staff member will be added to the database and will receive system access.
              </p>
            </div>
          </div>
        </div>

        <div className="modal-footer p-6 pt-4 border-t border-slate-700 flex flex-col sm:flex-row justify-end gap-3">
          <button
            type="button"
            className="btn-crop btn-cancel px-5 py-3 rounded-xl font-medium cursor-pointer transition-all duration-300 border border-slate-600 bg-slate-700 text-slate-300 hover:bg-slate-600 hover:text-white w-full sm:w-auto"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            type="button"
            className="btn-crop btn-confirm px-5 py-3 rounded-xl font-medium cursor-pointer transition-all duration-300 border-none bg-primary-gradient text-white hover:shadow-primary-glow flex items-center justify-center gap-2 w-full sm:w-auto"
            onClick={onConfirm}
          >
            <i className="fas fa-check-circle" />
            Verify & Add Staff
          </button>
        </div>
      </div>
    </div>
  );
}
