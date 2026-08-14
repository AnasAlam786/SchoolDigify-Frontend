import React from "react";

function PersonalInfo({ formData, fieldErrors = {}, genderOptions, handleFieldChange }) {
  return (
    <div className="form-section bg-gray-dark/70 backdrop-blur-md rounded-xl p-6 mb-6 shadow-section">
      <div className="section-header flex items-center mb-6 pb-4 border-b border-gray-800">
        <div className="section-icon w-10 h-10 bg-primary/15 rounded-lg flex items-center justify-center mr-4 text-primary">
          <i className="fas fa-user" />
        </div>
        <div>
          <h2 className="section-title text-[1.4rem] font-semibold text-white">
            Personal Information
          </h2>
        </div>
      </div>

      <div className="form-grid grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Full Name */}
        <div className="form-group mb-4">
          <label className="form-label block mb-2 font-medium text-gray-light required">
            Full Name
          </label>
          <input
            type="text"
            id="name"
            placeholder="Full Name"
            value={formData.name}
            onChange={(event) => handleFieldChange("name", event.target.value)}
            className={`form-input w-full p-3 rounded-xl text-gray-light text-base transition-all duration-300 focus:outline-none focus:border-primary focus:shadow-[0_0_0_3px_rgba(67,97,238,0.2)] ${
              fieldErrors.name ? "error border-red-500 bg-red-500/10" : ""
            }`}
          />
          {fieldErrors.name && (
            <div className="error-message text-red-400 text-sm mt-1 font-medium">
              {fieldErrors.name}
            </div>
          )}
        </div>

        {/* Email */}
        <div className="form-group mb-4">
          <label className="form-label block mb-2 font-medium text-gray-light required">
            Email
          </label>
          <input
            type="email"
            id="email"
            placeholder="email@example.com"
            value={formData.email}
            onChange={(event) => handleFieldChange("email", event.target.value)}
            className={`form-input w-full p-3 rounded-xl text-gray-light text-base transition-all duration-300 focus:outline-none focus:border-primary focus:shadow-[0_0_0_3px_rgba(67,97,238,0.2)] ${
              fieldErrors.email ? "error border-red-500 bg-red-500/10" : ""
            }`}
          />
          {fieldErrors.email && (
            <div className="error-message text-red-400 text-sm mt-1 font-medium">
              {fieldErrors.email}
            </div>
          )}
        </div>

        {/* Phone Number */}
        <div className="form-group mb-4">
          <label className="form-label block mb-2 font-medium text-gray-light">
            Phone Number
          </label>
          <input
            type="tel"
            id="phone"
            placeholder="+91 98765543210"
            value={formData.phone}
            onChange={(event) => handleFieldChange("phone", event.target.value)}
            className="form-input w-full p-3 rounded-xl text-gray-light text-base transition-all duration-300 focus:outline-none focus:border-primary focus:shadow-[0_0_0_3px_rgba(67,97,238,0.2)]"
          />
        </div>

        {/* Date of Birth */}
        <div className="form-group mb-4">
          <label className="form-label block mb-2 font-medium text-gray-light">
            Date of Birth
          </label>
          <input
            type="date"
            id="dob"
            value={formData.dob}
            onChange={(event) => handleFieldChange("dob", event.target.value)}
            className="form-input w-full p-3 rounded-xl text-gray-light text-base transition-all duration-300 focus:outline-none focus:border-primary focus:shadow-[0_0_0_3px_rgba(67,97,238,0.2)]"
          />
        </div>

        {/* Gender Options */}
        <div className="form-group radio-group-container mb-4 mt-2 col-span-full">
          <label className="form-label block mb-2 font-medium text-gray-light required">
            Gender
          </label>
          <div className="radio-group grid grid-cols-1 sm:grid-cols-2 gap-4">
            {genderOptions.map((option) => {
              const selected = String(option.value).toLowerCase() === String(formData.gender).toLowerCase();
              return (
                <button
                  key={option.value}
                  type="button"
                  className={`radio-card p-4 rounded-xl text-center cursor-pointer transition-all duration-300 relative ${
                    selected ? "selected border-primary" : ""
                  } ${fieldErrors.gender ? "border border-red-500 bg-red-500/10" : ""}`}
                  onClick={() => handleFieldChange("gender", option.value)}
                >
                  <input
                    type="radio"
                    name="gender"
                    value={option.value}
                    className="absolute opacity-0 w-0 h-0"
                    readOnly
                  />
                  <i className={`${option.icon} text-[1.8rem] mb-2 ${option.color}`} />
                  <div>{option.label}</div>
                </button>
              );
            })}
          </div>
          {fieldErrors.gender && (
            <div className="error-message text-red-400 text-sm mt-1 font-medium">
              {fieldErrors.gender}
            </div>
          )}
        </div>

        {/* Address */}
        <div className="form-group col-span-full">
          <label className="form-label block mb-2 font-medium text-gray-light">
            Address
          </label>
          <textarea
            rows="3"
            id="address"
            placeholder="123 Main Street, City, Country"
            value={formData.address}
            onChange={(event) => handleFieldChange("address", event.target.value)}
            className="form-input w-full p-3 rounded-xl text-gray-light text-base transition-all duration-300 focus:outline-none focus:border-primary focus:shadow-[0_0_0_3px_rgba(67,97,238,0.2)]"
          />
        </div>
      </div>
    </div>
  );
}

export default PersonalInfo;