

export function formatCurrency(amount = 0) {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatDateDisplay(dateString) {
  if (!dateString) return '';
  const [year, month, day] = dateString.split('-');
  const date = new Date(Number(year), Number(month) - 1, Number(day));
  return date.toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
}

export function formatInputDate(dateValue) {
  if (!dateValue) return '';
  const date = new Date(dateValue);
  if (Number.isNaN(date.getTime())) return dateValue;
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
}

export function getStudentTotal(student) {
  const monthlyTotal = Array.isArray(student?.monthlyFees)
    ? student.monthlyFees.reduce((sum, fee) => {
        if (fee.status === 'paid') return sum;
        return sum + Number(fee.amount || 0);
      }, 0)
    : 0;

  const otherTotal = Array.isArray(student?.otherFees)
    ? student.otherFees.reduce((sum, fee) => {
        if (fee.status === 'paid') return sum;
        return sum + Number(fee.amount || 0);
      }, 0)
    : 0;

  return monthlyTotal + otherTotal;
}

export function getSelectedFeeTotal(student) {
  return Array.isArray(student?.selectedFees)
    ? student.selectedFees.reduce((sum, fee) => sum + Number(fee.amount || 0), 0)
    : 0;
}

export function getGrandTotal(students = []) {
  return students.reduce((sum, student) => sum + getSelectedFeeTotal(student), 0);
}