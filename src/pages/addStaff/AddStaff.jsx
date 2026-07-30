import { useMemo, useState } from "react";
import "./style/AddStaff.css";
import { useAddStaffForm } from "./hooks/useAddStaffForm";
import SectionHeader from "./components/SectionHeader.jsx";
import RadioCardGroup from "./components/RadioCardGroup.jsx";
import StaffPhotoUploader from "./components/StaffPhotoUploader.jsx";
import ClassAssignment from "./components/ClassAssignment.jsx";
import ValidationSummary from "./components/ValidationSummary.jsx";
import PermissionModal from "./components/PermissionModal.jsx";
import VerificationModal from "./components/VerificationModal.jsx";
import SuccessModal from "./components/SuccessModal.jsx";

const genderOptions = [
  { value: "male", label: "Male", icon: "fas fa-mars", color: "text-[#3a86ff]" },
  { value: "female", label: "Female", icon: "fas fa-venus", color: "text-[#ff006e]" },
];

export default function AddStaff() {
  const {
    formData,
    roles,
    classes,
    permissions,
    selectedClasses,
    selectedPermissions,
    fieldErrors,
    apiErrors,
    handleFieldChange,
    handleGenderSelect,
    handleRoleSelect,
    handleClassToggle,
    handlePermissionToggle,
    setImageFile,
    handleImageRemove,
    validateForm,
    submitStaff,
  } = useAddStaffForm();

  const [permissionModalOpen, setPermissionModalOpen] = useState(false);
  const [verificationOpen, setVerificationOpen] = useState(false);
  const [successOpen, setSuccessOpen] = useState(false);
  const [reviewData, setReviewData] = useState(null);
  const [successMessage, setSuccessMessage] = useState("");

  const roleOptions = useMemo(
    () => roles.map((role) => ({
      value: role.id,
      label: role.role_name,
      icon: role.icon,
      color: role.color,
    })),
    [roles],
  );

  const showClassAssignment = roleOptions.some((role) => String(role.value) === String(formData.role_id) && role.label.toLowerCase().includes("teacher"));

  const handleOpenPermissionModal = () => setPermissionModalOpen(true);
  const handleClosePermissionModal = () => setPermissionModalOpen(false);

  const handleSaveClick = () => {
    const { valid } = validateForm();
    if (!valid) return;

    setReviewData({
      ...formData,
      assignedClasses: selectedClasses.map((cls) => cls.CLASS),
      assignedPermissions: selectedPermissions.map((permission) => permission.title),
    });
    setVerificationOpen(true);
  };

  const handleConfirmVerification = async () => {
    setVerificationOpen(false);
    const response = await submitStaff();
    if (response.ok) {
      setSuccessMessage(`${formData.name} has been successfully added to the staff database.`);
      setSuccessOpen(true);
    }
  };

  const handleSendWhatsApp = () => {
    const phone = formData.phone?.replace(/\D/g, "") || "";
    const name = formData.name || "Staff Member";

    if (!phone) {
      window.alert("Phone number is required to send WhatsApp message");
      return;
    }

    const whatsappUrl = `https://wa.me/${phone}?text=Welcome%20${encodeURIComponent(name)}%20to%20our%20staff%20team!%20Your%20account%20has%20been%20successfully%20created.`;
    window.open(whatsappUrl, "_blank");
  };

  return (
    <div className="mx-auto">
      <header className="flex justify-between items-center py-5 border-b border-border-light mb-[30px] bg-gradient-to-r from-slate-800/50 to-slate-900/50 rounded-xl p-6">
        <div className="mb-[30px]">
          <h1 className="text-[2.2rem] font-bold mb-2 bg-title-gradient bg-clip-text">Add New Staff Member</h1>
          <p className="text-gray-lighter text-[1.1rem] max-w-[600px]">
            Fill in all required details to add a new staff member to your organization
          </p>
        </div>
        <div className="user-actions flex gap-4">
          <button
            type="button"
            className="btn btn-primary flex items-center gap-2 px-5 py-3 rounded-xl font-semibold cursor-pointer transition-all duration-300 border-none bg-primary-gradient text-white shadow-primary-glow hover:-translate-y-0.5 hover:shadow-[0_6px_20px_rgba(67,97,238,0.4)]"
            onClick={handleSaveClick}
          >
            <i className="fas fa-save" /> Save Staff
          </button>
        </div>
      </header>

      <ValidationSummary errors={apiErrors} />

      <div className="form-container flex flex-col gap-[30px] flex-wrap">
        <div className="main-form flex-1 min-w-[300px]">
          <div className="form-section bg-gray-dark/70 backdrop-blur-md rounded-xl p-6 mb-6 shadow-section">
            <SectionHeader icon="fas fa-user" title="Personal Information" />
            <div className="form-grid grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="form-group mb-4">
                <label className="form-label block mb-2 font-medium text-gray-light required">Full Name</label>
                <input
                  type="text"
                  className={`form-input w-full p-3 rounded-xl text-gray-light text-base transition-all duration-300 focus:outline-none focus:border-primary focus:shadow-[0_0_0_3px_rgba(67,97,238,0.2)] ${fieldErrors.name ? "error" : ""}`}
                  id="name"
                  placeholder="John Smith"
                  value={formData.name}
                  onChange={(event) => handleFieldChange("name", event.target.value)}
                />
                {fieldErrors.name && <div className="error-message text-danger text-sm mt-1">{fieldErrors.name}</div>}
              </div>

              <div className="form-group mb-4">
                <label className="form-label block mb-2 font-medium text-gray-light required">Email</label>
                <input
                  type="email"
                  className={`form-input w-full p-3 rounded-xl text-gray-light text-base transition-all duration-300 focus:outline-none focus:border-primary focus:shadow-[0_0_0_3px_rgba(67,97,238,0.2)] ${fieldErrors.email ? "error" : ""}`}
                  id="email"
                  placeholder="john.smith@example.com"
                  value={formData.email}
                  onChange={(event) => handleFieldChange("email", event.target.value)}
                />
                {fieldErrors.email && <div className="error-message text-danger text-sm mt-1">{fieldErrors.email}</div>}
              </div>

              <div className="form-group mb-4">
                <label className="form-label block mb-2 font-medium text-gray-light">Phone Number</label>
                <input
                  type="tel"
                  className="form-input w-full p-3 rounded-xl text-gray-light text-base transition-all duration-300 focus:outline-none focus:border-primary focus:shadow-[0_0_0_3px_rgba(67,97,238,0.2)]"
                  id="phone"
                  placeholder="+91 98765543210"
                  value={formData.phone}
                  onChange={(event) => handleFieldChange("phone", event.target.value)}
                />
              </div>

              <div className="form-group mb-4">
                <label className="form-label block mb-2 font-medium text-gray-light">Date of Birth</label>
                <input
                  type="date"
                  className="form-input w-full p-3 rounded-xl text-gray-light text-base transition-all duration-300 focus:outline-none focus:border-primary focus:shadow-[0_0_0_3px_rgba(67,97,238,0.2)]"
                  id="dob"
                  value={formData.dob}
                  onChange={(event) => handleFieldChange("dob", event.target.value)}
                />
              </div>

              <div className="form-group radio-group-container mb-4 mt-2 mb-5 col-span-full">
                <label className="form-label block mb-2 font-medium text-gray-light required">Gender</label>
                <div className="radio-group grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {genderOptions.map((option) => {
                    const selected = String(option.value) === String(formData.gender);
                    return (
                      <button
                        key={option.value}
                        type="button"
                        className={`radio-card p-4 rounded-xl text-center cursor-pointer transition-all duration-300 relative ${selected ? "selected" : ""}`}
                        onClick={() => handleGenderSelect(option.value)}
                      >
                        <input type="radio" name="gender" value={option.value} className="absolute opacity-0 w-0 h-0" readOnly />
                        <i className={`${option.icon} text-[1.8rem] mb-2 ${option.color}`} />
                        <div>{option.label}</div>
                      </button>
                    );
                  })}
                </div>
                {fieldErrors.gender && <div className="error-message text-danger text-sm mt-1">{fieldErrors.gender}</div>}
              </div>

              <div className="form-group col-span-full">
                <label className="form-label block mb-2 font-medium text-gray-light">Address</label>
                <textarea
                  className="form-input w-full p-3 rounded-xl text-gray-light text-base transition-all duration-300 focus:outline-none focus:border-primary focus:shadow-[0_0_0_3px_rgba(67,97,238,0.2)]"
                  rows="3"
                  id="address"
                  placeholder="123 Main Street, City, Country"
                  value={formData.address}
                  onChange={(event) => handleFieldChange("address", event.target.value)}
                />
              </div>
            </div>
          </div>

          <div className="form-section bg-gray-dark/70 backdrop-blur-md rounded-xl p-6 mb-6 shadow-section">
            <SectionHeader icon="fas fa-lock" title="Account Information" />
            <div className="form-grid grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="form-group mb-4">
                <label className="form-label block mb-2 font-medium text-gray-light required">Username</label>
                <input
                  type="text"
                  className={`form-input w-full p-3 rounded-xl text-gray-light text-base transition-all duration-300 focus:outline-none focus:border-primary focus:shadow-[0_0_0_3px_rgba(67,97,238,0.2)] ${fieldErrors.username ? "error" : ""}`}
                  id="username"
                  placeholder="john.smith"
                  value={formData.username}
                  onChange={(event) => handleFieldChange("username", event.target.value)}
                />
                {fieldErrors.username && <div className="error-message text-danger text-sm mt-1">{fieldErrors.username}</div>}
              </div>

              <div className="form-group mb-4">
                <label className="form-label block mb-2 font-medium text-gray-light required">Password</label>
                <div className="password-wrapper relative w-full">
                  <input
                    type="password"
                    className={`form-input w-full p-3 rounded-xl text-gray-light text-base transition-all duration-300 focus:outline-none focus:border-primary focus:shadow-[0_0_0_3px_rgba(67,97,238,0.2)] pr-12 ${fieldErrors.password ? "error" : ""}`}
                    id="password"
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={(event) => handleFieldChange("password", event.target.value)}
                  />
                </div>
                {fieldErrors.password && <div className="error-message text-danger text-sm mt-1">{fieldErrors.password}</div>}
              </div>

              <div className="form-group mb-4">
                <label className="form-label block mb-2 font-medium text-gray-light required">Confirm Password</label>
                <div className="password-wrapper relative w-full">
                  <input
                    type="password"
                    className={`form-input w-full p-3 rounded-xl text-gray-light text-base transition-all duration-300 focus:outline-none focus:border-primary focus:shadow-[0_0_0_3px_rgba(67,97,238,0.2)] pr-12 ${fieldErrors.confirmPassword ? "error" : ""}`}
                    id="confirmPassword"
                    placeholder="••••••••"
                    value={formData.confirmPassword}
                    onChange={(event) => handleFieldChange("confirmPassword", event.target.value)}
                  />
                </div>
                {fieldErrors.confirmPassword && <div className="error-message text-danger text-sm mt-1">{fieldErrors.confirmPassword}</div>}
              </div>
            </div>
          </div>

          <div className="form-section bg-gray-dark/70 backdrop-blur-md rounded-xl p-6 mb-6 shadow-section">
            <SectionHeader icon="fas fa-briefcase" title="Professional Information" />
            <div className="form-grid grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="form-group mb-4">
                <label className="form-label block mb-2 font-medium text-gray-light">Date of Joining</label>
                <input
                  type="date"
                  className="form-input w-full p-3 rounded-xl text-gray-light text-base transition-all duration-300 focus:outline-none focus:border-primary focus:shadow-[0_0_0_3px_rgba(67,97,238,0.2)]"
                  id="date_of_joining"
                  value={formData.date_of_joining}
                  onChange={(event) => handleFieldChange("date_of_joining", event.target.value)}
                />
              </div>

              <div className="form-group mb-4">
                <label className="form-label block mb-2 font-medium text-gray-light">Qualification</label>
                <input
                  type="text"
                  className="form-input w-full p-3 rounded-xl text-gray-light text-base transition-all duration-300 focus:outline-none focus:border-primary focus:shadow-[0_0_0_3px_rgba(67,97,238,0.2)]"
                  id="qualification"
                  placeholder="MSc, BEd, PhD, etc."
                  value={formData.qualification}
                  onChange={(event) => handleFieldChange("qualification", event.target.value)}
                />
              </div>

              <div className="form-group mb-4">
                <label className="form-label block mb-2 font-medium text-gray-light">Salary</label>
                <input
                  type="text"
                  className="form-input w-full p-3 rounded-xl text-gray-light text-base transition-all duration-300 focus:outline-none focus:border-primary focus:shadow-[0_0_0_3px_rgba(67,97,238,0.2)]"
                  id="salary"
                  placeholder="In rupees"
                  value={formData.salary}
                  onChange={(event) => handleFieldChange("salary", event.target.value)}
                />
              </div>

              <div className="form-group mb-4">
                <label className="form-label block mb-2 font-medium text-gray-light">UDISE National ID</label>
                <input
                  type="text"
                  className="form-input w-full p-3 rounded-xl text-gray-light text-base transition-all duration-300 focus:outline-none focus:border-primary focus:shadow-[0_0_0_3px_rgba(67,97,238,0.2)]"
                  id="national_id"
                  placeholder="e.g: UP2021123456789"
                  value={formData.national_id}
                  onChange={(event) => handleFieldChange("national_id", event.target.value.toUpperCase())}
                />
              </div>

              <div className="form-group radio-group-container mb-4 col-span-full">
                <label className="form-label block mb-2 font-medium text-gray-light required">Role</label>
                <div className="flex flex-wrap justify-center gap-4">
                  {roleOptions.map((option) => {
                    const selected = String(option.value) === String(formData.role_id);
                    return (
                      <button
                        key={option.value}
                        type="button"
                        className={`radio-card flex flex-col items-center justify-center cursor-pointer transition-all duration-300 relative w-[46%] sm:w-[30%] md:w-[22%] lg:w-[18%] p-4 rounded-xl text-center ${selected ? "selected" : ""}`}
                        onClick={() => handleRoleSelect(option.value)}
                      >
                        <input type="radio" name="role_id" value={option.value} className="absolute opacity-0 w-0 h-0" readOnly />
                        <i className={`${option.icon} text-[1.8rem] mb-2 ${option.color}`} />
                        <div className="font-medium">{option.label}</div>
                      </button>
                    );
                  })}
                </div>
                {fieldErrors.role_id && <div className="error-message text-danger text-sm mt-1">{fieldErrors.role_id}</div>}
              </div>
            </div>
          </div>

          <div className="form-section bg-gray-dark/70 backdrop-blur-md rounded-xl p-6 mb-6 shadow-section">
            <SectionHeader icon="fas fa-shield-alt" title="Permissions" />
            <div className="form-content" id="permissionCardBody">
              {selectedPermissions.length === 0 ? (
                <div className="flex flex-col items-center justify-center text-center rounded-2xl border border-dashed border-gray-700 bg-[#1A1A1A] p-10 shadow-inner">
                  <div className="flex items-center justify-center w-16 h-16 mb-5 rounded-full bg-indigo-500/10 text-indigo-400">
                    <i className="fas fa-user-shield text-2xl" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-100 mb-2">No Role Selected</h3>
                  <p className="text-gray-400 max-w-sm leading-relaxed mb-6">
                    Please select a role to automatically load its default permissions. Once selected, permissions will appear here.
                  </p>
                  <button
                    type="button"
                    onClick={() => document.querySelector('[name="role_id"]')?.scrollIntoView({ behavior: "smooth", block: "center" })}
                    className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-medium transition-all duration-300 shadow-md hover:shadow-lg"
                  >
                    <i className="fas fa-arrow-up text-sm" />
                    Select a Role
                  </button>
                </div>
              ) : (
                <div className="space-y-6">
                  <div className="text-center">
                    <h2 className="text-2xl font-semibold text-blue-400 mb-2">Permissions & Features</h2>
                    <button
                      type="button"
                      onClick={handleOpenPermissionModal}
                      className="mb-4 px-5 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-sm font-medium shadow shadow-blue-500/30 transition-all duration-300"
                    >
                      <i className="fas fa-pen-to-square mr-2" /> Manage Permissions
                    </button>
                    <p className="text-gray-400 text-sm max-w-2xl mx-auto">
                      For the selected role, these are the permissions and features this staff member will have access to.
                    </p>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                    {selectedPermissions.map((perm) => (
                      <div
                        key={perm.id}
                        className="permission_list group relative rounded-2xl p-5 bg-gradient-to-br from-gray-800 to-gray-900 border border-gray-700 shadow-lg hover:shadow-blue-500/40 hover:scale-[1.03] transition-all duration-300"
                      >
                        <div className="absolute inset-0 bg-gradient-to-tr from-blue-500/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl" />
                        <div className="relative z-10">
                          <div className="flex items-center gap-3 mb-3">
                            <div className="h-10 w-10 rounded-xl bg-blue-600 flex items-center justify-center shadow-inner shadow-black/30">
                              <i className={`${perm.icon} text-white text-lg`} />
                            </div>
                            <h3 className="font-semibold text-lg text-blue-400 group-hover:text-blue-300 transition-colors duration-300">
                              {perm.title}
                            </h3>
                          </div>
                          <p className="text-gray-400 text-sm leading-snug relative z-10">{perm.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {showClassAssignment ? (
            <ClassAssignment classes={classes} selectedClasses={selectedClasses} onToggleClass={handleClassToggle} />
          ) : null}

          <StaffPhotoUploader
            value={formData.imagePreview}
            onChange={setImageFile}
            onRemove={handleImageRemove}
            label="Click to upload the image of staff"
          />
        </div>
      </div>

      <PermissionModal
        open={permissionModalOpen}
        permissions={permissions}
        selectedPermissions={selectedPermissions}
        onTogglePermission={handlePermissionToggle}
        onClose={handleClosePermissionModal}
      />

      <VerificationModal
        open={verificationOpen}
        reviewData={reviewData}
        imageUrl={formData.imagePreview}
        onClose={() => setVerificationOpen(false)}
        onConfirm={handleConfirmVerification}
      />

      <SuccessModal
        open={successOpen}
        message={successMessage}
        onClose={() => setSuccessOpen(false)}
        onSendWhatsApp={handleSendWhatsApp}
      />
    </div>
  );
}
