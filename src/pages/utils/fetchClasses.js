import { apiGet } from "../../api/api";

export const fetchClasses = async () => {
  try {
    const response = await apiGet('/api/get_classes');
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "Something went wrong, Try again!");
    }

    return data.classes;
      
    return [];
  } catch (error) {
    showAlert(400, error )
    console.error('Error fetching classes:', error);
    return [];
  }
};