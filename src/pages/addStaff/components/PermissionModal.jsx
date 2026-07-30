export default function PermissionModal({ open, permissions, selectedPermissions, onTogglePermission, onClose }) {
  if (!open) return null;

  const selectedCount = selectedPermissions.length;

  return (
    <div
      className="fixed inset-0 bg-black/50 backdrop-blur-lg z-50 flex items-center justify-center p-4"
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div className="bg-[#0f0f0f] rounded-2xl w-full max-w-4xl mx-4 shadow-2xl border border-gray-800 max-h-[90vh] flex flex-col overflow-hidden transition-all duration-300">
        <div className="relative bg-gradient-to-br from-slate-900 to-slate-800 p-4 sm:p-6 border-b border-slate-700/50">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3 sm:space-x-4">
              <div className="p-2 sm:p-3 bg-white/5 rounded-xl backdrop-blur-sm border border-slate-600/30">
                <i className="fas fa-user-shield text-slate-300 text-lg sm:text-xl" />
              </div>
              <div>
                <h5 className="text-white text-xl sm:text-2xl font-light tracking-tight">Manage Permissions</h5>
                <p className="text-slate-400 text-xs sm:text-sm mt-1 font-light">
                  Configure access controls and system privileges
                </p>
              </div>
            </div>
            <button
              type="button"
              className="p-2 text-slate-400 hover:text-white hover:bg-white/5 rounded-xl transition-all duration-200 border border-transparent hover:border-slate-600"
              onClick={onClose}
            >
              <i className="fas fa-times text-base sm:text-lg" />
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 bg-[#0f0f0f] scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-transparent hover:scrollbar-thumb-slate-600">
          <div className="selected-permissions-preview mb-6 p-4 bg-slate-900/30 rounded-xl border border-slate-700/30 backdrop-blur-sm transition-all duration-300">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 mb-4">
              <div className="flex items-center space-x-3">
                <i className="fas fa-check-circle text-emerald-400 text-lg" />
                <span className="text-slate-300 font-medium text-base sm:text-lg">Selected Permissions</span>
              </div>
              <span className="px-3 py-1 bg-emerald-500/10 text-emerald-400 text-sm rounded-full font-medium border border-emerald-500/20">
                {selectedCount} selected
              </span>
            </div>
            <div className="selected-permissions-tags flex flex-wrap gap-2 min-h-8">
              {selectedPermissions.length > 0 ? (
                selectedPermissions.map((permission) => (
                  <span
                    key={permission.id}
                    className="inline-flex items-center space-x-1 px-2 py-1 bg-blue-600/20 text-blue-400 border border-blue-500/30 rounded-full text-sm"
                  >
                    <span>{permission.title}</span>
                  </span>
                ))
              ) : (
                <div className="flex items-center space-x-2 text-slate-500 text-sm">
                  <i className="fas fa-info-circle" />
                  <span>Select permissions from the list below</span>
                </div>
              )}
            </div>
          </div>

          <div className="mb-2">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-6">
              <h6 className="text-slate-400 font-medium text-sm uppercase tracking-widest">Available Permissions</h6>
              <div className="flex items-center space-x-2 text-slate-500 text-sm">
                <i className="fas fa-filter" />
                <span>{permissions.length} permissions available</span>
              </div>
            </div>

            <div className="permissions-grid grid grid-cols-1 lg:grid-cols-2 gap-3 overflow-y-auto p-1">
              {permissions.map((permission) => {
                const selected = selectedPermissions.some((item) => String(item.id) === String(permission.id));
                return (
                  <button
                    key={permission.id}
                    type="button"
                    className={`permission-card p-4 sm:p-5 rounded-xl text-left cursor-pointer transition-all duration-300 border border-slate-700/50 hover:border-blue-400/30 hover:bg-slate-800/20 hover:shadow-lg hover:shadow-blue-500/5 group relative overflow-hidden ${
                      selected ? "selected border-blue-400/40 bg-slate-800/30" : ""
                    }`}
                    onClick={() => onTogglePermission(permission.id)}
                  >
                    <div className="absolute top-3 sm:top-4 right-3 sm:right-4 w-5 h-5 sm:w-6 sm:h-6 border-2 border-slate-600 rounded-lg transition-all duration-300 flex items-center justify-center">
                      <div className={`w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-sm ${selected ? "bg-blue-500 scale-100" : "bg-transparent scale-0"}`} />
                    </div>
                    <div className="pr-6 sm:pr-8">
                      <div className="font-semibold text-slate-200 group-hover:text-white transition-colors mb-2 text-base sm:text-lg leading-tight">
                        {permission.title}
                      </div>
                      <div className="text-xs sm:text-sm text-slate-400 mb-3 sm:mb-4 leading-relaxed font-light">
                        {permission.description}
                      </div>
                      <div className="permission-category-tag inline-flex items-center space-x-1.5 px-2.5 py-1 text-xs rounded-full bg-slate-700/50 text-slate-300 border border-slate-600/50">
                        <i className="fas fa-tag text-xs" />
                        <span className="truncate max-w-[120px] sm:max-w-none">{permission.action}</span>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        <div className="bg-slate-900/50 border-t border-slate-700/30 px-4 sm:px-6 lg:px-8 py-4 flex flex-col sm:flex-row gap-3 justify-between backdrop-blur-sm">
          <button
            type="button"
            className="px-5 py-2.5 bg-transparent hover:bg-slate-700/50 text-slate-400 hover:text-white rounded-xl font-medium transition-all duration-200 border border-slate-600 hover:border-slate-500 flex items-center justify-center space-x-2"
            onClick={onClose}
          >
            <i className="fas fa-arrow-left" />
            <span>Cancel</span>
          </button>
        </div>
      </div>
    </div>
  );
}
