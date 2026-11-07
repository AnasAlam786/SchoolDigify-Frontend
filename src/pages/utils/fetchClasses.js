import { apiGet } from "../../api/api";

export const fetchClasses = async ({ signal } = {}) => {
    const response = await apiGet('/api/get_classes', { signal });
    const data = await response.json();

    if (!response.ok) {
        showAlert(400, error )
        throw new Error(data?.error || "Failed to fetch classes.");
    }

    return data.classes;
};