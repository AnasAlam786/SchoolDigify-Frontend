import React, { useState } from "react";

function AccountInfo({ formData, fieldErrors = {}, handleFieldChange }) {
  // Toggle visibility states
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  return (
    <div className="form-section bg-gray-dark/70 backdrop-blur-md rounded-xl p-6 mb-6 shadow-section">
      <div className="section-header flex items-center mb-6 pb-4 border-b border-gray-800">
        <div className="section-icon w-10 h-10 bg-primary/15 rounded-lg flex items-center justify-center mr-4 text-primary">
          <i className="fas fa-lock" />
        </div>
        <div>
          <h2 className="section-title text-[1.4rem] font-semibold text-white">
            Account Credentials
          </h2>
        </div>
      </div>

      <div className="form-grid grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Username */}
        <div className="form-group mb-4">
          <label className="form-label block mb-2 font-medium text-gray-light required">
            Username
          </label>
          <input
            type="text"
            id="username"
            placeholder="johndoe"
            value={formData.username || ""}
            onChange={(event) => handleFieldChange("username", event.target.value)}
            className={`form-input w-full p-3 rounded-xl text-gray-light text-base transition-all duration-300 focus:outline-none focus:border-primary focus:shadow-[0_0_0_3px_rgba(67,97,238,0.2)] ${
              fieldErrors.username ? "error border-red-500 bg-red-500/10" : ""
            }`}
          />
          {fieldErrors.username && (
            <div className="error-message text-red-400 text-sm mt-1 font-medium flex items-center gap-1">
              <i className="fas fa-exclamation-circle text-xs" />
              <span>{fieldErrors.username}</span>
            </div>
          )}
        </div>

        {/* Password */}
        <div className="form-group mb-4">
          <label className="form-label block mb-2 font-medium text-gray-light required">
            Password
          </label>
          <div className="relative flex items-center">
            <input
              type={showPassword ? "text" : "password"}
              id="password"
              placeholder="••••••••"
              value={formData.password || ""}
              onChange={(event) => handleFieldChange("password", event.target.value)}
              className={`form-input w-full p-3 pr-11 rounded-xl text-gray-light text-base transition-all duration-300 focus:outline-none focus:border-primary focus:shadow-[0_0_0_3px_rgba(67,97,238,0.2)] ${
                fieldErrors.password ? "error border-red-500 bg-red-500/10" : ""
              }`}
            />
            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              aria-label={showPassword ? "Hide password" : "Show password"}
              className="absolute right-3 text-gray-400 hover:text-gray-200 p-1.5 focus:outline-none transition-colors"
            >
              <i className={`fas ${showPassword ? "fa-eye-slash" : "fa-eye"} text-base`} />
            </button>
          </div>
          {fieldErrors.password && (
            <div className="error-message text-red-400 text-sm mt-1 font-medium flex items-center gap-1">
              <i className="fas fa-exclamation-circle text-xs" />
              <span>{fieldErrors.password}</span>
            </div>
          )}
        </div>

        {/* Confirm Password */}
        <div className="form-group mb-4">
          <label className="form-label block mb-2 font-medium text-gray-light required">
            Confirm Password
          </label>
          <div className="relative flex items-center">
            <input
              type={showConfirmPassword ? "text" : "password"}
              id="confirmPassword"
              placeholder="••••••••"
              value={formData.confirmPassword || ""}
              onChange={(event) => handleFieldChange("confirmPassword", event.target.value)}
              className={`form-input w-full p-3 pr-11 rounded-xl text-gray-light text-base transition-all duration-300 focus:outline-none focus:border-primary focus:shadow-[0_0_0_3px_rgba(67,97,238,0.2)] ${
                fieldErrors.confirmPassword ? "error border-red-500 bg-red-500/10" : ""
              }`}
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword((prev) => !prev)}
              aria-label={showConfirmPassword ? "Hide confirm password" : "Show confirm password"}
              className="absolute right-3 text-gray-400 hover:text-gray-200 p-1.5 focus:outline-none transition-colors"
            >
              <i className={`fas ${showConfirmPassword ? "fa-eye-slash" : "fa-eye"} text-base`} />
            </button>
          </div>
          {fieldErrors.confirmPassword && (
            <div className="error-message text-red-400 text-sm mt-1 font-medium flex items-center gap-1">
              <i className="fas fa-exclamation-circle text-xs" />
              <span>{fieldErrors.confirmPassword}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default AccountInfo;