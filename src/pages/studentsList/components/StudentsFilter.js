// Searchable fields when "All Fields" is selected
export const DEFAULT_FILTERS = {
    search: "",
    searchIn: "all",
    classView: "All",
    sortBy: "",
    sortDir: "asc",
    filterRTE: false,
    filterPEN: "any",
    filterGender: "any",
    filterAdmission: "any",
};

export const GLOBAL_FIELDS = [
    "STUDENTS_NAME",
    "FATHERS_NAME", "SR",
    "ROLL", "PHONE",
    "AADHAAR", "PEN",
];

export const fieldOptions = [
    { value: "all", label: "All Fields" },
    { value: "STUDENTS_NAME", label: "Name" },
    { value: "FATHERS_NAME", label: "Father" },
    { value: "SR", label: "SR No" },
    { value: "ROLL", label: "Roll" },
    { value: "PHONE", label: "Phone" },
    { value: "AADHAAR", label: "Aadhaar" },
    { value: "PEN", label: "PEN" },
];

export const sortOptions = [
    { value: "", label: "Class → Roll (Default)" },
    { value: "STUDENTS_NAME", label: "Name (A-Z)" },
    { value: "ADMISSION_DATE", label: "Admission Date" },
    { value: "ADMISSION_NO", label: "Admission Number" },
    { value: "DOB", label: "Date of Birth" },
];

// Default sorting (Class -> Roll)
export function defaultSort(a, b) {
    const da = parseInt(a.display_order, 10);
    const db = parseInt(b.display_order, 10);

    if (!Number.isNaN(da) && !Number.isNaN(db) && da !== db) {
        return da - db;
    }

    const ra = parseInt(a.ROLL, 10);
    const rb = parseInt(b.ROLL, 10);

    if (!Number.isNaN(ra) && !Number.isNaN(rb)) {
        return ra - rb;
    }

    return String(a.ROLL).localeCompare(String(b.ROLL));
}


// Available sorting methods
export const SORTERS = {
    STUDENTS_NAME: (a, b) =>
        String(a.STUDENTS_NAME).localeCompare(String(b.STUDENTS_NAME)),

    ADMISSION_DATE: (a, b) =>
        new Date(b.ADMISSION_DATE) - new Date(a.ADMISSION_DATE),

    ADMISSION_NO: (a, b) =>
        String(a.ADMISSION_NO).localeCompare(String(b.ADMISSION_NO)),

    DOB: (a, b) =>
        new Date(a.DOB) - new Date(b.DOB),
};


// Convert any value into lowercase string
function norm(value) {
    return value == null ? "" : String(value).toLowerCase();
}


// Check if one field matches the search token
function fieldMatch(student, field, token) {
    const value = norm(student[field]);

    if (!value) return false;

    if (field === "ROLL") {
        return value === token || value.endsWith(token);
    }

    if (field === "PHONE" || field === "AADHAAR") {
        return value.endsWith(token) || value.includes(token);
    }

    return value.includes(token);
}

// Main Exporting Functions Start from Here
// Search filter
export function matchesSearch(student, filters) {
    const query = norm(filters.search);

    if (!query) return true;

    const tokens = query.split(/\s+/).filter(Boolean); //anas 15 -> ["anas", "15"]

    return tokens.every((token) => {
        if (filters.searchIn !== "all") {
            return fieldMatch(student, filters.searchIn, token);
        }

        return GLOBAL_FIELDS.some((field) =>
            fieldMatch(student, field, token)
        );
    });
}


// Advanced filters
export function matchesFilters(student, filters) {

    if (
        filters.classView !== "All" &&
        String(student.class_id) !== filters.classView
    ) {
        return false;
    }

    if (filters.filterRTE && !student.is_RTE) {
        return false;
    }

    if (
        filters.filterPEN === "present" &&
        (!student.PEN || String(student.PEN).trim() === "")
    ) {
        return false;
    }

    if (
        filters.filterPEN === "missing" &&
        student.PEN &&
        String(student.PEN).trim() !== ""
    ) {
        return false;
    }

    if (
        filters.filterGender !== "any" &&
        norm(student.GENDER) !== filters.filterGender
    ) {
        return false;
    }

    if (
        filters.filterAdmission !== "any" &&
        student.student_status !== filters.filterAdmission
    ) {
        return false;
    }

    return true;
}


// Sort students
export function sortStudents(students, filters) {

    const sorted = [...students];

    if (!filters.sortBy) {
        sorted.sort(defaultSort);
        return sorted;
    }

    const direction = filters.sortDir === "desc" ? -1 : 1;

    sorted.sort((a, b) => {
        const result = SORTERS[filters.sortBy](a, b);

        return result === 0
            ? defaultSort(a, b)
            : result * direction;
    });

    return sorted;
}