import { useState, useEffect, useMemo } from "react";
import "../style/StaffForm.css";
import { apiGet, apiPostFormData } from "../../../api/api.js";

import Header from "./components/Header.jsx";

import ValidationSummary from "../components/ValidationSummary.jsx";


import VerificationModal from "./modals/VerificationModal.jsx";
import SuccessModal from "./modals/SuccessModal.jsx";

import ImageUploader from "../../utils/ImageUploader/ImageUploader.jsx";

import ClassAssignment from "../components/ClassAssignment.jsx";
import PermissionModal from "../components/PermissionModal.jsx";
import PersonalInfo from "../components/PersonalInfo.jsx";
import AccountInfo from "../components/AccountInfo.jsx";
import ProfessionalInfo from "../components/ProfessionalInfo.jsx";
import PermissionSection from "../components/PermissionSection.jsx";

import FormSkeletonLoader from "../components/PageStatus.jsx";
import { ErrorState } from "../../utils/GlobalPageStatus.jsx";

const genderOptions = [
  { value: "male", label: "Male", icon: "fas fa-mars", color: "text-[#3a86ff]" },
  { value: "female", label: "Female", icon: "fas fa-venus", color: "text-[#ff006e]" },
];

const defaultFormState = {
  name: "",
  email: "",
  phone: "",
  dob: "",
  gender: "",
  address: "",
  username: "",
  password: "",
  confirmPassword: "",
  date_of_joining: "",
  qualification: "",
  salary: "",
  national_id: "",
  role_id: "",
  role_name: "",
  assigned_classes_id: [],
  assigned_permissions_id: [],
  imagePreview: "",
  imageFile: null,
};

export default function AddStaff() {
  const [formData, setFormData] = useState(defaultFormState);

  // Loading state for initial data fetch
  const [isLoading, setIsLoading] = useState(true);
  const [staffLoadingError, setStaffLoadingError] = useState("");

  const [allRoles, setRoles] = useState([]);
  const [allClasses, setClasses] = useState([]);
  const [allPermissions, setPermissions] = useState([]);

  // Single state for all field errors: { [fieldName]: "Error Message" }
  const [fieldErrors, setFieldErrors] = useState({});

  const [isPermissionsLoading, setPermissionsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [reviewData, setReviewData] = useState(null);

  const [permissionModalOpen, setPermissionModalOpen] = useState(false);
  const [verificationOpen, setVerificationOpen] = useState(false);

  const [successOpen, setSuccessOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  // Fetch initial setup data
  useEffect(() => {
    async function loadInitialData() {
      setIsLoading(true);
      setStaffLoadingError(""); // Reset error state on retry
      try {
        const response = await apiGet("/api/add_staff");
        const data = await response.json().catch(() => ({}));

        if (!response.ok) {
          throw new Error(data.error || "Failed to load add staff setup data.");
        }

        setRoles(data.roles || []);
        setPermissions(data.permissions || []);
        setClasses(Array.isArray(data.classes) ? data.classes : []);
      } catch (error) {
        console.error("fetchStaffSetup error", error);
        setStaffLoadingError(error.message || "An unexpected error occurred.");
      } finally {
        setIsLoading(false);
      }
    }

    loadInitialData();
  }, []);

  // Compute selected classes array dynamically for ClassAssignment component
  const selectedClasses = allClasses.filter((cls) =>
    formData?.assigned_classes_id?.map(String).includes(String(cls.id))
  );

  const selectedPermissions = allPermissions.filter((permission) =>
    formData?.assigned_permissions_id?.map(String).includes(String(permission.id))
  );


  // Handle field change & clear specific error
  const handleFieldChange = (field, value) => {
    setFormData((current) => ({ ...current, [field]: value }));

    // Clear error for the current field if present
    if (fieldErrors[field]) {
      setFieldErrors((prev) => {
        const next = { ...prev };
        delete next[field];
        return next;
      });
    }

    // Clear password mismatch error when password fields change
    if ((field === "password" || field === "confirmPassword") && fieldErrors.confirmPassword) {
      setFieldErrors((prev) => {
        const next = { ...prev };
        delete next.confirmPassword;
        return next;
      });
    }
  };

  // Image setter for ImageUploader component
  const handleImageChange = (imageData) => {
    if (imageData instanceof File) {
      const previewUrl = URL.createObjectURL(imageData);
      setFormData((prev) => ({
        ...prev,
        imageFile: imageData,
        imagePreview: previewUrl,
      }));
    } else if (typeof imageData === "string") {
      setFormData((prev) => ({
        ...prev,
        imagePreview: imageData,
        imageFile: null,
      }));
    }
  };

  // Single Validation Function
  const validateForm = () => {
    const errors = {};

    if (!formData.name.trim()) {
      errors.name = "Full Name is required.";
    }

    if (!formData.email.trim()) {
      errors.email = "Email address is required.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
      errors.email = "Please enter a valid email address.";
    }

    if (!formData.gender) {
      errors.gender = "Gender selection is required.";
    }

    if (!formData.username.trim()) {
      errors.username = "Username is required.";
    }

    if (!formData.password) {
      errors.password = "Password is required.";
    }

    if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = "Password and Confirm Password do not match.";
    }

    if (!formData.role_id) {
      errors.role_id = "Please select a Role for the staff member.";
    }

    setFieldErrors(errors);
    return { valid: Object.keys(errors).length === 0, errors };
  };

  // Triggered on header save button
  const handleSaveClick = () => {
    const { valid } = validateForm();
    if (!valid) {
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    setReviewData({
      ...formData,
      selectedClasses: selectedClasses,
      selectedPermissions: selectedPermissions,
    });


    setVerificationOpen(true);
  };

  // Submit Staff Payload to API (Standardized FormData)
  const submitStaff = async () => {
    setIsSubmitting(true);
    try {
      const mergedData = { ...defaultFormState, ...formData };
      const payload = new FormData();

      Object.keys(mergedData).forEach((key) => {
        const value = mergedData[key];

        // Handle Files
        if (key === "imageFile" && value) {
          payload.append("image", value);
        } else if (key === "signFile" && value) {
          payload.append("sign", value);
        }
        // Handle JSON Arrays (Permissions, Classes, etc.)
        else if (Array.isArray(value)) {
          payload.append(key, JSON.stringify(value));
        }
        // Handle Regular Text/Number Inputs
        else if (key !== "imageFile" && key !== "signFile") {
          payload.append(key, value ?? "");
        }
      });

      // Send payload. Do NOT set Content-Type header manually—
      // fetch/axios handles multipart boundaries automatically when given a FormData object.
      const response = await apiPostFormData("/api/add_staff", payload);
      const resData = await response.json().catch(() => ({}));

      console.log(resData)

      if (!response.ok) {
        if (resData.errors && typeof resData.errors === "object" && !Array.isArray(resData.errors)) {
          setFieldErrors(resData.errors);
        } else {
          // General single error message string
          const generalMsg =
            resData.error || resData.message || "Failed to save staff record.";
          setFieldErrors({ api: generalMsg });
        }

        window.scrollTo({ top: 0, behavior: "smooth" });
        return { ok: false };
      }

      return { ok: true, data: resData };
    } catch (error) {
      console.error("Submit Staff Error:", error);
      showAlert(500, error.message);
      setFieldErrors({ api: error.message || "An error occurred while saving." });
      window.scrollTo({ top: 0, behavior: "smooth" });
      return { ok: false };
    } finally {
      setIsSubmitting(false);
    }
  };

  // Final verification confirmation
  const handleConfirmVerification = async () => {
    setVerificationOpen(false);
    const result = await submitStaff();
    if (result.ok) {
      setSuccessMessage(`${formData.name} has been successfully added to the staff database.`);
      setSuccessOpen(true);
    }
  };

  // Reset Form state after closing success modal
  const handleSuccessClose = () => {
    setSuccessOpen(false);
    setFormData(defaultFormState);
    setFieldErrors({});
  };

  // 1. Return Skeleton Loader while fetching staff details
  if (isLoading) {
    return <FormSkeletonLoader />;
  }

  // 2. Return Error State if fetching staff details failed
  if (staffLoadingError) {
    return (
      <div className="mx-auto max-w-4xl py-12">
        <ErrorState
          message={staffLoadingError}
          onRetry={loadInitialData}
        />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl">
      <Header handleSaveClick={handleSaveClick} isSubmitting={isSubmitting} />

      {/* Dynamic Validation Errors Summary */}
      <ValidationSummary errors={fieldErrors} />

      <div className="form-container flex flex-col gap-[30px] flex-wrap">
        <div className="main-form flex-1 min-w-[300px]">
          {/* Personal Details */}
          <PersonalInfo
            formData={formData}
            fieldErrors={fieldErrors}
            genderOptions={genderOptions}
            handleFieldChange={handleFieldChange}
          />

          {/* Account Credentials */}
          <AccountInfo
            formData={formData}
            fieldErrors={fieldErrors}
            handleFieldChange={handleFieldChange}
          />

          {/* Role & Professional Details */}
          <ProfessionalInfo
            formData={formData}
            fieldErrors={fieldErrors}
            allRoles={allRoles}
            setPermissions={setPermissions}
            setPermissionsLoading={setPermissionsLoading}
            handleFieldChange={handleFieldChange}
          />

          {/* Permissions Overview */}
          <PermissionSection
            formData={formData}
            selectedPermissions={selectedPermissions}
            isPermissionsLoading={isPermissionsLoading}
            handleOpenPermissionModal={() => setPermissionModalOpen(true)}
          />

          {/* Classes Assignment */}
          <ClassAssignment
            setFormData={setFormData}
            allClasses={allClasses}
            selectedClasses={selectedClasses}
          />

          {/* Profile Picture Uploader */}
          <div className="form-section bg-gray-dark/70 backdrop-blur-md rounded-xl p-6 mb-20 shadow-section border border-gray-800">
            <div className="section-header flex items-center mb-6 pb-4 border-b border-gray-800">
              <div className="section-icon w-10 h-10 bg-primary/15 rounded-lg flex items-center justify-center mr-4 text-primary">
                <i className="fas fa-camera text-lg" />
              </div>
              <div>
                <h2 className="section-title text-[1.4rem] font-semibold text-white">
                  Profile Photo
                </h2>
                <p className="text-gray-400 text-sm mt-0.5">
                  Upload or capture a profile photo for the staff member
                </p>
              </div>
            </div>

            <div className="max-w-lg mx-auto">
              <ImageUploader
                image={formData.imagePreview}
                setImage={handleImageChange}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Dynamic Permission Modal */}
      {permissionModalOpen && (
        <PermissionModal
          formData={formData}
          allPermissions={allPermissions}
          handleFieldChange={handleFieldChange}
          onClose={() => setPermissionModalOpen(false)}
        />
      )}

      {/* Review / Verification Confirmation Modal */}
      {verificationOpen && (
        <VerificationModal
          reviewData={reviewData}
          imageUrl={formData.imagePreview}
          onClose={() => setVerificationOpen(false)}
          onConfirm={handleConfirmVerification}
        />
      )}

      {/* Final Action Success Modal */}
      {successOpen && (
        <SuccessModal
          message={successMessage}
          onClose={handleSuccessClose}
        />
      )}
    </div>
  );
}