import { useCallback, useEffect, useMemo, useState } from "react";
import { fetchClasses } from "../../utils/fetchClasses";
import {
  createStaff,
  fetchPermissions,
  fetchRolePermissions,
  fetchStaffRoles,
} from "../api/addStaffApi";

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
  assigned_classes: [],
  imagePreview: "",
  imageFile: null,
};

function normalizeText(value) {
  return value
    .replace(/\b\w/g, (c) => c.toUpperCase())
    .replace(/\B\w/g, (c) => c.toLowerCase());
}

function isValidEmail(value) {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(value);
}

function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

export function useAddStaffForm() {
  const [formData, setFormData] = useState(defaultFormState);
  const [roles, setRoles] = useState([]);
  const [classes, setClasses] = useState([]);
  const [permissions, setPermissions] = useState([]);
  const [fieldErrors, setFieldErrors] = useState({});
  const [apiErrors, setApiErrors] = useState([]);
  const [loading, setLoading] = useState({ roles: false, permissions: false, classes: false, submit: false });

  useEffect(() => {
    async function loadInitialData() {
      setLoading({ roles: true, permissions: true, classes: true, submit: false });
      const [roleData, permissionData, classData] = await Promise.all([
        fetchStaffRoles(),
        fetchPermissions(),
        fetchClasses(),
      ]);
      setRoles(roleData);
      setPermissions(permissionData.map((permission) => ({ ...permission, selected: false })));
      setClasses(classData);
      setLoading((current) => ({ ...current, roles: false, permissions: false, classes: false }));
    }

    loadInitialData();
  }, []);

  const selectedRole = useMemo(
    () => roles.find((role) => String(role.id) === String(formData.role_id)),
    [roles, formData.role_id],
  );

  const selectedClasses = useMemo(
    () => classes.filter((cls) => formData.assigned_classes.includes(String(cls.id))),
    [classes, formData.assigned_classes],
  );

  const selectedPermissions = useMemo(
    () => permissions.filter((permission) => permission.selected),
    [permissions],
  );

  const handleFieldChange = useCallback((field, value) => {
    const nextValue = field === "name" || field === "address" ? normalizeText(value) : value;
    setFormData((current) => ({ ...current, [field]: nextValue }));
  }, []);

  const handleRoleSelect = useCallback(
    async (roleId) => {
      const role = roles.find((item) => String(item.id) === String(roleId));
      setFormData((current) => ({
        ...current,
        role_id: String(roleId),
        role_name: role?.role_name || "",
      }));

      const rolePermissions = await fetchRolePermissions(roleId);
      setPermissions((current) =>
        current.map((permission) => ({
          ...permission,
          selected: rolePermissions.includes(String(permission.id)),
        })),
      );
    },
    [roles],
  );

  const handleGenderSelect = useCallback((value) => {
    setFormData((current) => ({ ...current, gender: value }));
  }, []);

  const handleClassToggle = useCallback((classItem) => {
    setFormData((current) => {
      const normalizedId = String(classItem.id);
      const exists = current.assigned_classes.includes(normalizedId);
      const nextClasses = exists
        ? current.assigned_classes.filter((id) => id !== normalizedId)
        : [...current.assigned_classes, normalizedId];
      return { ...current, assigned_classes: nextClasses };
    });
  }, []);

  const handlePermissionToggle = useCallback((permissionId) => {
    setPermissions((current) =>
      current.map((permission) =>
        String(permission.id) === String(permissionId)
          ? { ...permission, selected: !permission.selected }
          : permission,
      ),
    );
  }, []);

  const setImageFile = useCallback((file, preview) => {
    setFormData((current) => ({ ...current, imageFile: file, imagePreview: preview }));
  }, []);

  const handleImageRemove = useCallback(() => {
    setFormData((current) => ({ ...current, imageFile: null, imagePreview: "" }));
  }, []);

  const validateForm = useCallback(() => {
    const errors = {};
    const newApiErrors = [];

    if (!formData.name.trim()) {
      errors.name = "Please enter a full name";
      newApiErrors.push("Full Name is required.");
    }

    if (!formData.email.trim()) {
      errors.email = "Please enter a valid email address";
      newApiErrors.push("Email is required.");
    } else if (!isValidEmail(formData.email.trim())) {
      errors.email = "Please enter a valid email address";
      newApiErrors.push("Email is invalid.");
    }

    if (!formData.username.trim()) {
      errors.username = "Please enter a username";
      newApiErrors.push("Username is required.");
    }

    if (!formData.password) {
      errors.password = "Please enter a password";
      newApiErrors.push("Password is required.");
    } else if (formData.password.length < 8) {
      errors.password = "Password must be at least 8 characters";
      newApiErrors.push("Password must be at least 8 characters.");
    }

    if (!formData.confirmPassword) {
      errors.confirmPassword = "Please confirm your password";
      newApiErrors.push("Confirm Password is required.");
    } else if (formData.confirmPassword !== formData.password) {
      errors.confirmPassword = "Passwords do not match";
      newApiErrors.push("Passwords do not match.");
    }

    if (!formData.gender) {
      errors.gender = "Please select a gender";
      newApiErrors.push("Gender is required.");
    }

    if (!formData.role_id) {
      errors.role_id = "Please select a role";
      newApiErrors.push("Role is required.");
    }

    setFieldErrors(errors);
    setApiErrors(newApiErrors);
    return { valid: Object.keys(errors).length === 0, errors: newApiErrors };
  }, [formData]);

  const buildPayload = useCallback(async () => {
    const image = formData.imageFile ? await fileToBase64(formData.imageFile) : null;
    return {
      name: formData.name.trim(),
      email: formData.email.trim(),
      phone: formData.phone.trim(),
      dob: formData.dob || null,
      gender: formData.gender || null,
      address: formData.address.trim() || null,
      username: formData.username.trim(),
      password: formData.password,
      date_of_joining: formData.date_of_joining || null,
      qualification: formData.qualification.trim() || null,
      salary: formData.salary.trim() || null,
      national_id: formData.national_id.trim() || null,
      role_id: formData.role_id || null,
      role_name: formData.role_name || null,
      assigned_classes: formData.assigned_classes,
      permissions: selectedPermissions.map((permission) => String(permission.id)),
      image,
    };
  }, [formData, selectedPermissions]);

  const submitStaff = useCallback(async () => {
    setLoading((current) => ({ ...current, submit: true }));
    setApiErrors([]);

    try {
      const payload = await buildPayload();
      const response = await createStaff(payload);
      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        const serverErrors =
          Array.isArray(data.errors) && data.errors.length > 0
            ? data.errors
            : [data.message || "Failed to add staff. Please review the form."];
        setApiErrors(serverErrors);
        return { ok: false, data, errors: serverErrors };
      }

      return { ok: true, data };
    } catch (error) {
      setApiErrors(["Network error while saving. Please try again."]);
      console.error("submitStaff error", error);
      return { ok: false, error };
    } finally {
      setLoading((current) => ({ ...current, submit: false }));
    }
  }, [buildPayload]);

  const clearValidation = useCallback(() => {
    setFieldErrors({});
    setApiErrors([]);
  }, []);

  return {
    formData,
    roles,
    classes,
    permissions,
    selectedRole,
    selectedClasses,
    selectedPermissions,
    fieldErrors,
    apiErrors,
    loading,
    handleFieldChange,
    handleGenderSelect,
    handleRoleSelect,
    handleClassToggle,
    handlePermissionToggle,
    setImageFile,
    handleImageRemove,
    validateForm,
    submitStaff,
    clearValidation,
  };
}
