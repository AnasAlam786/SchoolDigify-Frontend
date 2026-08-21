export const PAYMENT_STATUS = {
  SUCCESS: 'success',
  ERROR: 'error',
  INFO: 'info',
};

export const STATUS_ICONS = {
  success: '✓',
  error: '✕',
  info: 'ℹ',
};

export const STATUS_STYLES = {
  success: 'bg-emerald-500/10 border border-emerald-500/30 text-emerald-300',
  error: 'bg-rose-500/10 border border-rose-500/30 text-rose-300',
  info: 'bg-sky-500/10 border border-sky-500/30 text-sky-300',
};

export const SAMPLE_STUDENTS = [
  {
    id: 1,
    name: 'Sarah Johnson',
    class: '10-A',
    rollNo: 25,
    session: '2023-24',
    image: '',
    student_session_id: 'ST-101',
    total_due_terms: 2,
    total_due_amount: 26500,
    monthlyFees: [
      { id: 'sarah_jan', month: 'Jan', period_name: 'Tuition Fee', amount: 2500, dueDate: '5 Jan', status: 'paid', paid_date: '2024-01-05' },
      { id: 'sarah_feb', month: 'Feb', period_name: 'Tuition Fee', amount: 2500, dueDate: '5 Feb', status: 'paid', paid_date: '2024-02-05' },
      { id: 'sarah_mar', month: 'Mar', period_name: 'Tuition Fee', amount: 2500, dueDate: '5 Mar', status: 'due' },
      { id: 'sarah_apr', month: 'Apr', period_name: 'Tuition Fee', amount: 2500, dueDate: '5 Apr', status: 'due' },
      { id: 'sarah_may', month: 'May', period_name: 'Tuition Fee', amount: 2500, dueDate: '5 May', status: 'upcoming' },
      { id: 'sarah_jun', month: 'Jun', period_name: 'Tuition Fee', amount: 2500, dueDate: '5 Jun', status: 'upcoming' },
      { id: 'sarah_jul', month: 'Jul', period_name: 'Tuition Fee', amount: 2500, dueDate: '5 Jul', status: 'upcoming' },
      { id: 'sarah_aug', month: 'Aug', period_name: 'Tuition Fee', amount: 2500, dueDate: '5 Aug', status: 'upcoming' },
      { id: 'sarah_sep', month: 'Sep', period_name: 'Tuition Fee', amount: 2500, dueDate: '5 Sep', status: 'upcoming' },
      { id: 'sarah_oct', month: 'Oct', period_name: 'Tuition Fee', amount: 2500, dueDate: '5 Oct', status: 'upcoming' },
      { id: 'sarah_nov', month: 'Nov', period_name: 'Tuition Fee', amount: 2500, dueDate: '5 Nov', status: 'upcoming' },
      { id: 'sarah_dec', month: 'Dec', period_name: 'Tuition Fee', amount: 2500, dueDate: '5 Dec', status: 'upcoming' },
    ],
    otherFees: [
      { id: 'sarah_exam', name: 'Exam Fee', period_name: 'Exam Fee', amount: 1500, dueDate: '15 Mar', status: 'due' },
      { id: 'sarah_annual', name: 'Annual Fee', period_name: 'Annual Fee', amount: 5000, dueDate: '10 Jan', status: 'paid', paid_date: '2024-01-10' },
      { id: 'sarah_transport', name: 'Transport', period_name: 'Transport', amount: 1200, dueDate: '8 Mar', status: 'due' },
      { id: 'sarah_library', name: 'Library', period_name: 'Library', amount: 800, dueDate: '1 Apr', status: 'upcoming' },
    ],
    selectedFees: [],
  },
  {
    id: 2,
    name: 'Aarav Kumar',
    class: '12-B',
    rollNo: 12,
    session: '2023-24',
    image: '',
    student_session_id: 'ST-102',
    total_due_terms: 1,
    total_due_amount: 12000,
    monthlyFees: [
      { id: 'aarav_jan', month: 'Jan', period_name: 'Tuition Fee', amount: 3000, dueDate: '5 Jan', status: 'paid', paid_date: '2024-01-05' },
      { id: 'aarav_feb', month: 'Feb', period_name: 'Tuition Fee', amount: 3000, dueDate: '5 Feb', status: 'paid', paid_date: '2024-02-05' },
      { id: 'aarav_mar', month: 'Mar', period_name: 'Tuition Fee', amount: 3000, dueDate: '5 Mar', status: 'due' },
      { id: 'aarav_apr', month: 'Apr', period_name: 'Tuition Fee', amount: 3000, dueDate: '5 Apr', status: 'upcoming' },
      { id: 'aarav_may', month: 'May', period_name: 'Tuition Fee', amount: 3000, dueDate: '5 May', status: 'upcoming' },
    ],
    otherFees: [
      { id: 'aarav_exam', name: 'Exam Fee', period_name: 'Exam Fee', amount: 1800, dueDate: '15 Mar', status: 'due' },
    ],
    selectedFees: [],
  },
];

export const SAMPLE_TRANSACTIONS = [
  {
    id: 'TXN-2024-001',
    paymentDate: '2024-03-15',
    totalPaid: 25500,
    discount: 1000,
    paymentMode: 'Online Banking',
    remark: 'Paid on time with early bird discount',
    isDeleted: false,
    siblings: [
      {
        studentName: 'Aarav Kumar',
        className: 'Grade 10-A',
        rollNo: '2024-A-015',
        fees: {
          monthly: {
            label: 'Tuition Fees',
            total: 15000,
            months: ['January 2024', 'February 2024', 'March 2024'],
          },
          oneTime: [
            { name: 'Exam Fee', amount: 2500 },
            { name: 'Lab Fee', amount: 3000 },
          ],
        },
      },
      {
        studentName: 'Diya Kumar',
        className: 'Grade 7-B',
        rollNo: '2024-B-032',
        fees: {
          monthly: {
            label: 'Tuition Fees',
            total: 9000,
            months: ['January 2024', 'February 2024', 'March 2024'],
          },
          oneTime: [
            { name: 'Sports Fee', amount: 1500 },
            { name: 'Activity Fee', amount: 1500 },
          ],
        },
      },
    ],
  },
  {
    id: 'TXN-2024-002',
    paymentDate: '2024-02-28',
    totalPaid: 18000,
    discount: 500,
    paymentMode: 'UPI',
    remark: 'Regular payment',
    isDeleted: false,
    siblings: [
      {
        studentName: 'Rohan Sharma',
        className: 'Grade 12-A',
        rollNo: '2024-A-008',
        fees: {
          monthly: {
            label: 'Tuition Fees',
            total: 12000,
            months: ['January 2024', 'February 2024'],
          },
          oneTime: [
            { name: 'Board Exam Fee', amount: 3500 },
            { name: 'Library Fee', amount: 2000 },
          ],
        },
      },
    ],
  },
  {
    id: 'TXN-2023-150',
    paymentDate: '2023-12-20',
    totalPaid: 14500,
    discount: 0,
    paymentMode: 'Cash',
    remark: 'Year-end payment',
    isDeleted: true,
    siblings: [
      {
        studentName: 'Priya Patel',
        className: 'Grade 9-C',
        rollNo: '2023-C-021',
        fees: {
          monthly: {
            label: 'Tuition Fees',
            total: 10000,
            months: ['November 2023', 'December 2023'],
          },
          oneTime: [{ name: 'Annual Fee', amount: 4500 }],
        },
      },
    ],
  },
];

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

export function normalizeStudentData(studentData = []) {
  return studentData.map((student, index) => ({
    ...student,
    selectedFees: Array.isArray(student.selectedFees) ? student.selectedFees : [],
    monthlyFees: Array.isArray(student.monthlyFees) ? student.monthlyFees : [],
    otherFees: Array.isArray(student.otherFees) ? student.otherFees : [],
    id: student.id ?? index,
  }));
}

export function createFeePayload(students, discount, paymentMode, paymentDate) {
  const selectedFees = students.flatMap((student) =>
    student.selectedFees.map((fee) => ({
      ...fee,
      student_id: student.id,
      student_session_id: student.student_session_id,
    }))
  );

  const grandTotal = getGrandTotal(students);
  const finalAmount = Math.max(0, grandTotal - Number(discount || 0));

  return {
    payment_mode: paymentMode,
    payment_date: paymentDate,
    discount: Number(discount || 0),
    total_amount: grandTotal,
    final_amount: finalAmount,
    fees: selectedFees,
    student_session_ids: students
      .filter((student) => student.selectedFees.length > 0)
      .map((student) => student.student_session_id)
      .filter(Boolean),
  };
}
