

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

function normalizeFee(fee = {}, index) {
  return {
    ...fee,
    id: fee.id ?? fee.fee_id ?? `${fee.fee_type || 'fee'}-${index}`,
    period_name: fee.period_name ?? fee.periodName,
    dueDate: fee.dueDate ?? fee.due_date ?? fee.dueDateString ?? '',
    amount: Number(fee.amount ?? fee.fee_amount ?? fee.total_amount ?? 0),
    status: String(fee.status ?? 'DUE').toUpperCase(),
  };
}

export function normalizeStudentFeeData(payload) {
  const data = payload?.students_fee_data
    ?? payload?.studentsFeeData
    ?? payload?.data?.students_fee_data
    ?? payload?.data
    ?? [];
  const records = Array.isArray(data) ? data : [data];

  return records.filter(Boolean).map((student) => {
    const monthlyFees = student.monthlyFees ?? student.monthly_fees ?? student.monthly_fee_data ?? [];
    const otherFees = student.otherFees ?? student.other_fees ?? student.other_fee_data ?? [];
    const selectedFees = student.selectedFees ?? student.selected_fees ?? [];

    return {
      ...student,
      name: student.name ?? student.student_name ?? 'Student',
      class: student.class ?? student.class_name ?? student.className,
      rollNo: student.rollNo ?? student.roll_no,
      student_session_id: student.student_session_id ?? student.studentSessionId,
      monthlyFees: Array.isArray(monthlyFees) ? monthlyFees.map(normalizeFee) : [],
      otherFees: Array.isArray(otherFees) ? otherFees.map(normalizeFee) : [],
      selectedFees: Array.isArray(selectedFees) ? selectedFees.map(normalizeFee) : [],
    };
  });
}