// Convert any value into lowercase string
function norm(value) {
  return value == null ? "" : String(value).toLowerCase();
}

// Searchable fields for students
const GLOBAL_FIELDS = [
  "STUDENTS_NAME",
  "FATHERS_NAME",
  "SR",
  "ROLL",
  "PHONE",
];

// Check if one field matches the search token
function fieldMatch(student, field, token) {
  const value = norm(student[field]);

  if (!value) return false;

  if (field === "ROLL") {
    return value === token || value.endsWith(token);
  }

  if (field === "PHONE") {
    return value.endsWith(token) || value.includes(token);
  }

  return value.includes(token);
}

// Search filter
export function matchesSearch(student, filters) {
  const query = norm(filters.search);

  if (!query) return true;

  const tokens = query.split(/\s+/).filter(Boolean);

  return tokens.every((token) => {
    return GLOBAL_FIELDS.some((field) =>
      fieldMatch(student, field, token)
    );
  });
}

// Class filter
export function matchesClassFilter(student, filters, classes) {
  if (
    filters.classFilter !== 'All' &&
    String(student.class_id) !== String(filters.classFilter)
  ) {
    return false;
  }

  return true;
}

// Sort students
export function sortStudents(students, filters) {
  const sorted = [...students];

  sorted.sort((a, b) => {
    let compareResult = 0;

    switch (filters.sortBy) {
      case 'student-name':
        compareResult = (a.STUDENTS_NAME || '').localeCompare(
          b.STUDENTS_NAME || ''
        );
        break;

      case 'highest-due':
        compareResult = (b.dueAmount || 0) - (a.dueAmount || 0);
        break;

      case 'lowest-due':
        compareResult = (a.dueAmount || 0) - (b.dueAmount || 0);
        break;

      case 'due-months':
        compareResult = (b.dueMonths || 0) - (a.dueMonths || 0);
        break;

      case 'class-roll':
      default:
        const classA = parseInt(a.class_id, 10) || 0;
        const classB = parseInt(b.class_id, 10) || 0;
        compareResult = classA - classB;
        if (compareResult === 0) {
          const rollA = parseInt(a.ROLL, 10) || 0;
          const rollB = parseInt(b.ROLL, 10) || 0;
          compareResult = rollA - rollB;
        }
        break;
    }

    return filters.sortDir === 'asc' ? compareResult : -compareResult;
  });

  return sorted;
}

// Main export - filter and sort students
export const filterAndSortStudents = (students, filters, classes) => {
  const filtered = students.filter(student =>
    matchesSearch(student, filters) &&
    matchesClassFilter(student, filters, classes)
  );

  return sortStudents(filtered, filters);
};
