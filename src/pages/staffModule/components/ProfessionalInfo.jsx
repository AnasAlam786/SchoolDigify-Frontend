import React from "react";
import { apiGet } from "../../../api/api";

function ProfessionalInfo({
  formData = {},
  fieldErrors = {},
  allRoles = [],
  setPermissionsLoading,
  handleFieldChange,
}) {
  const handleRoleSelect = async (roleId) => {
    // Find role object to update role_name dynamically as well
    const selectedRole = allRoles.find((r) => String(r.id) === String(roleId));
    
    handleFieldChange("role_id", String(roleId));
    if (selectedRole) {
      handleFieldChange("role_name", selectedRole.role_name || "");
    }

    try {
      setPermissionsLoading(true);
      const response = await apiGet(`/api/get_role_permissions/${roleId}`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to load permissions");
      }

      const permissionIds = (data.permissions_list || []).map(String);
      handleFieldChange("assigned_permissions_id", permissionIds);
    } catch (err) {
      console.error("Error fetching permissions:", err);
      handleFieldChange("assigned_permissions_id", []);
    } finally {
      setPermissionsLoading(false);
    }
  };

  return (
    <div className="form-section bg-gray-dark/70 backdrop-blur-md rounded-xl p-6 mb-6 shadow-section">
      {/* Header */}
      <div className="section-header flex items-center mb-6 pb-4 border-b border-gray-800">
        <div className="section-icon w-10 h-10 bg-primary/15 rounded-lg flex items-center justify-center mr-4 text-primary">
          <i className="fas fa-briefcase text-lg" />
        </div>
        <div>
          <h2 className="section-title text-[1.4rem] font-semibold text-white">
            Professional Information
          </h2>
        </div>
      </div>

      <div className="form-grid grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Date of Joining */}
        <div className="form-group mb-2">
          <label
            htmlFor="date_of_joining"
            className="form-label block mb-2 font-medium text-gray-light text-sm"
          >
            Date of Joining
          </label>
          <input
            type="date"
            id="date_of_joining"
            className={`form-input w-full p-3 rounded-xl text-gray-light text-base transition-all duration-300 focus:outline-none focus:border-primary focus:shadow-[0_0_0_3px_rgba(67,97,238,0.2)] ${
              fieldErrors.date_of_joining ? "border-red-500 bg-red-500/10 border" : ""
            }`}
            value={formData.date_of_joining || ""}
            onChange={(event) =>
              handleFieldChange("date_of_joining", event.target.value)
            }
          />
          {fieldErrors.date_of_joining && (
            <div className="error-message text-red-500 text-sm mt-1">
              {fieldErrors.date_of_joining}
            </div>
          )}
        </div>

        {/* Qualification */}
        <div className="form-group mb-2">
          <label
            htmlFor="qualification"
            className="form-label block mb-2 font-medium text-gray-light text-sm"
          >
            Qualification
          </label>
          <input
            type="text"
            id="qualification"
            placeholder="MSc, BEd, PhD, etc."
            className={`form-input w-full p-3 rounded-xl text-gray-light text-base transition-all duration-300 focus:outline-none focus:border-primary focus:shadow-[0_0_0_3px_rgba(67,97,238,0.2)] ${
              fieldErrors.qualification ? "border-red-500 bg-red-500/10 border" : ""
            }`}
            value={formData.qualification || ""}
            onChange={(event) =>
              handleFieldChange("qualification", event.target.value)
            }
          />
          {fieldErrors.qualification && (
            <div className="error-message text-red-500 text-sm mt-1">
              {fieldErrors.qualification}
            </div>
          )}
        </div>

        {/* Salary */}
        <div className="form-group mb-2">
          <label
            htmlFor="salary"
            className="form-label block mb-2 font-medium text-gray-light text-sm"
          >
            Salary
          </label>
          <input
            type="text"
            id="salary"
            placeholder="In rupees"
            className={`form-input w-full p-3 rounded-xl text-gray-light text-base transition-all duration-300 focus:outline-none focus:border-primary focus:shadow-[0_0_0_3px_rgba(67,97,238,0.2)] ${
              fieldErrors.salary ? "border-red-500 bg-red-500/10 border" : ""
            }`}
            value={formData.salary || ""}
            onChange={(event) =>
              handleFieldChange("salary", event.target.value)
            }
          />
          {fieldErrors.salary && (
            <div className="error-message text-red-500 text-sm mt-1">
              {fieldErrors.salary}
            </div>
          )}
        </div>

        {/* UDISE National ID */}
        <div className="form-group mb-2">
          <label
            htmlFor="national_id"
            className="form-label block mb-2 font-medium text-gray-light text-sm"
          >
            UDISE National ID
          </label>
          <input
            type="text"
            id="national_id"
            placeholder="e.g: UP2021123456789"
            className={`form-input w-full p-3 rounded-xl text-gray-light text-base transition-all duration-300 focus:outline-none focus:border-primary focus:shadow-[0_0_0_3px_rgba(67,97,238,0.2)] ${
              fieldErrors.national_id ? "border-red-500 bg-red-500/10 border" : ""
            }`}
            value={formData.national_id || ""}
            onChange={(event) =>
              handleFieldChange("national_id", event.target.value.toUpperCase())
            }
          />
          {fieldErrors.national_id && (
            <div className="error-message text-red-500 text-sm mt-1">
              {fieldErrors.national_id}
            </div>
          )}
        </div>

        {/* Role Selection Grid */}
        <div className="form-group radio-group-container mb-2 col-span-full">
          <label className="form-label block mb-3 font-medium text-gray-light text-sm required">
            Role
          </label>
          <div className="flex flex-wrap justify-center gap-4">
            {allRoles.map((option) => {
              const selected = String(option.id) === String(formData.role_id);

              return (
                <button
                  key={option.id}
                  type="button"
                  className={`radio-card flex flex-col items-center justify-center cursor-pointer transition-all duration-300 relative w-[46%] sm:w-[30%] md:w-[22%] lg:w-[18%] p-4 rounded-xl text-center border ${
                    selected
                      ? "selected bg-primary/10 border-primary"
                      : fieldErrors.role_id
                      ? "border-red-500/50 bg-red-500/5 hover:border-red-500"
                      : "border-gray-700/50 bg-gray-800/40 hover:border-primary/50"
                  }`}
                  onClick={() => handleRoleSelect(option.id)}
                >
                  <input
                    type="radio"
                    name="role_id"
                    value={option.id}
                    checked={selected}
                    onChange={() => {}}
                    className="absolute opacity-0 w-0 h-0"
                  />
                  <i
                    className={`text-[1.8rem] mb-2 ${
                      option.icon || "fas fa-user-tag"
                    } ${option.color || "text-primary"}`}
                  />
                  <div className="font-medium text-sm text-gray-200">
                    {option.role_name}
                  </div>
                </button>
              );
            })}
          </div>
          {fieldErrors.role_id && (
            <div className="error-message text-red-500 text-sm mt-2 text-center">
              {fieldErrors.role_id}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ProfessionalInfo;