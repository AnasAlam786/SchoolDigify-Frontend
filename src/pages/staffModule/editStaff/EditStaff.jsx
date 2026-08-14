import { useState, useEffect, useCallback } from "react";
import { useParams } from "react-router-dom";
import { apiGet, apiPostFormData } from "../../../api/api.js";

import Header from "./components/Header.jsx";
import ClassAssignment from "../components/ClassAssignment.jsx";
import PermissionModal from "../components/PermissionModal.jsx";
import PersonalInfo from "../components/PersonalInfo.jsx";
import AccountInfo from "../components/AccountInfo.jsx";
import ProfessionalInfo from "../components/ProfessionalInfo.jsx";
import PermissionSection from "../components/PermissionSection.jsx";
import ValidationSummary from "../components/ValidationSummary.jsx";

import FormSkeletonLoader from "../components/PageStatus.jsx";
import { ErrorState } from "../../utils/GlobalPageStatus.jsx";

import ImageUploader from "../../utils/ImageUploader/ImageUploader.jsx";
import "../style/StaffForm.css";

const genderOptions = [
    { value: "male", label: "Male", icon: "fas fa-mars", color: "text-[#3a86ff]" },
    { value: "female", label: "Female", icon: "fas fa-venus", color: "text-[#ff006e]" },
];

const defaultFormState = {
    staff_id: "",
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

function EditStaff() {
    const { staffId } = useParams();

    const [isLoading, setIsLoading] = useState(true);
    const [staffLoadingError, setStaffLoadingError] = useState("");

    const [formData, setFormData] = useState(defaultFormState);
    const [allRoles, setRoles] = useState([]);
    const [allClasses, setClasses] = useState([]);
    const [allPermissions, setPermissions] = useState([]);    

    // Single state for all field errors: { [fieldName]: "Error Message" }
    const [fieldErrors, setFieldErrors] = useState({});

    const [isPermissionsLoading, setPermissionsLoading] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [permissionModalOpen, setPermissionModalOpen] = useState(false);

    // Fetch initial setup data
    const loadStaffDetails = useCallback(async () => {
        setIsLoading(true);
        setStaffLoadingError(""); // Reset error state on retry

        try {
            const response = await apiGet(`/api/update_staff?id=${staffId}`);
            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || "Failed to load staff details.");
            }

            // Populate React state directly with safe fallback defaults
            setFormData({ ...defaultFormState, ...data.staff });
            setRoles(data.roles || []);
            setPermissions(data.permissions || []);
            setClasses(data.classes || []);
            handleFieldChange("staff_id", staffId)
        } catch (error) {
            setStaffLoadingError(error.message || "An unexpected error occurred.");
        } finally {
            setIsLoading(false);
        }
    }, [staffId]);

    useEffect(() => {
        if (staffId) {
            loadStaffDetails();
        }
    }, [staffId, loadStaffDetails]);

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

        if (fieldErrors[field]) {
            setFieldErrors((prev) => {
                const next = { ...prev };
                delete next[field];
                return next;
            });
        }

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

        if (!formData.name?.trim()) {
            errors.name = "Full Name is required.";
        }

        if (!formData.email?.trim()) {
            errors.email = "Email address is required.";
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
            errors.email = "Please enter a valid email address.";
        }

        if (!formData.gender) {
            errors.gender = "Gender selection is required.";
        }

        if (!formData.username?.trim()) {
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

    // Submit Staff Payload to API
    const handleSaveClick = async () => {
        const { valid } = validateForm();
        if (!valid) {
            window.scrollTo({ top: 0, behavior: "smooth" });
            return;
        }

        setIsSubmitting(true);
        try {
            const mergedData = { ...defaultFormState, ...formData, };
            const payload = new FormData();

            Object.keys(mergedData).forEach((key) => {
                const value = mergedData[key];

                if (key === "imageFile" && value) {
                    payload.append("image", value);
                } else if (key === "signFile" && value) {
                    payload.append("sign", value);
                } else if (Array.isArray(value)) {
                    payload.append(key, JSON.stringify(value));
                } else if (key !== "imageFile" && key !== "signFile") {
                    payload.append(key, value ?? "");
                }
            });

            const response = await apiPostFormData("/api/update_staff_api", payload);
            const resData = await response.json().catch(() => ({}));

            if (!response.ok) {
                if (resData.errors && typeof resData.errors === "object" && !Array.isArray(resData.errors)) {
                    setFieldErrors(resData.errors);
                } else {
                    const generalMsg =
                        resData.error || resData.message || "Failed to save staff record.";
                    setFieldErrors({ api: generalMsg });
                }

                window.scrollTo({ top: 0, behavior: "smooth" });
                return { ok: false };
            }

            showAlert(200, "Staff Updated Successfully!");
        } catch (error) {
            console.error("Submit Staff Error:", error);
            setFieldErrors({ api: error.message || "An error occurred while saving." });
            window.scrollTo({ top: 0, behavior: "smooth" });
            return { ok: false };
        } finally {
            setIsSubmitting(false);
        }
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
                    onRetry={loadStaffDetails}
                />
            </div>
        );
    }

    // 3. Render Form
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
        </div>
    );
}

export default EditStaff;