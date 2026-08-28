import { useMemo, useState } from 'react';
import FeeSummaryCard from '../components/FeeSummaryCard';
import FeeTimeRangeSelector from '../components/FeeTimeRangeSelector';
import CollectionTrend from '../components/CollectionTrend';

const collectionSeries = {
  today: [
    { label: '8 AM', value: 1200 },
    { label: '10 AM', value: 6800 },
    { label: '12 PM', value: 10300 },
    { label: '2 PM', value: 14400 },
    { label: '4 PM', value: 19800 },
    { label: '6 PM', value: 31200 },
    { label: '8 PM', value: 45200 },
  ],
  week: [
    { label: 'Mon', value: 42000 },
    { label: 'Tue', value: 63000 },
    { label: 'Wed', value: 71000 },
    { label: 'Thu', value: 96000 },
    { label: 'Fri', value: 124000 },
    { label: 'Sat', value: 168000 },
    { label: 'Sun', value: 184500 },
  ],
  month: [
    { label: 'W1', value: 133000 },
    { label: 'W2', value: 190000 },
    { label: 'W3', value: 224000 },
    { label: 'W4', value: 295500 },
    { label: 'W5', value: 842500 },
  ],
  session: [
    { label: 'Apr', value: 420000 },
    { label: 'May', value: 495000 },
    { label: 'Jun', value: 628000 },
    { label: 'Jul', value: 776000 },
    { label: 'Aug', value: 964000 },
    { label: 'Sep', value: 1120000 },
  ],
};

const rangeMeta = {
  today: {
    label: 'Today',
    collections: 45200,
    payments: 32,
    monthLabel: 'Daily collection',
  },
  week: {
    label: 'This Week',
    collections: 184500,
    payments: 126,
    monthLabel: 'Weekly collection',
  },
  month: {
    label: 'This Month',
    collections: 842500,
    payments: 486,
    monthLabel: 'Monthly collection',
  },
  session: {
    label: 'This Session',
    collections: 3120000,
    payments: 1842,
    monthLabel: 'Academic collection',
  },
};

function formatCurrency(value) {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(value || 0);
}

function buildClassBreakdown(students) {
  const grouped = students.reduce((acc, student) => {
    const className = String(student.CLASS || 'Unassigned');
    if (!acc[className]) {
      acc[className] = {
        className,
        totalCollected: 0,
        totalOutstanding: 0,
        studentsWithDue: 0,
        paidStudents: 0,
        totalStudents: 0,
      };
    }

    const entry = acc[className];
    entry.totalCollected += student.totalPaid || 0;
    entry.totalOutstanding += student.dueAmount || 0;
    entry.totalStudents += 1;
    if ((student.dueAmount || 0) > 0) entry.studentsWithDue += 1;
    if (student.feeStatus === 'Paid') entry.paidStudents += 1;

    return acc;
  }, {});

  return Object.values(grouped)
    .map((entry) => ({
      ...entry,
      collectionRate: entry.totalStudents ? (entry.paidStudents / entry.totalStudents) * 100 : 0,
    }))
    .sort((a, b) => b.totalCollected - a.totalCollected);
}

export default function DashboardTab({ students = [] }) {
  const [selectedRange, setSelectedRange] = useState('month');

  const classBreakdown = useMemo(() => buildClassBreakdown(students), [students]);

  const totalOutstanding = useMemo(
    () => students.reduce((sum, student) => sum + (student.dueAmount || 0), 0),
    [students]
  );

  const studentsWithDue = useMemo(
    () => students.filter((student) => (student.dueAmount || 0) > 0).length,
    [students]
  );

  const fullyPaidStudents = useMemo(
    () => students.filter((student) => student.feeStatus === 'Paid').length,
    [students]
  );

  const partiallyPaidStudents = useMemo(
    () => students.filter((student) => student.feeStatus === 'Partially Paid').length,
    [students]
  );

  const totalCollected = useMemo(
    () => students.reduce((sum, student) => sum + (student.totalPaid || 0), 0),
    [students]
  );

  const currentRange = rangeMeta[selectedRange];
  const currentSeries = collectionSeries[selectedRange];

  const classCollection = useMemo(
    () => [...classBreakdown].sort((a, b) => b.totalCollected - a.totalCollected),
    [classBreakdown]
  );

  const classOutstanding = useMemo(
    () => [...classBreakdown].sort((a, b) => b.totalOutstanding - a.totalOutstanding),
    [classBreakdown]
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 rounded-2xl border border-[#2A2A2A] bg-[#1A1A1A] p-3 sm:p-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-gray-300">Collection analysis</p>
          <h2 className="mt-2 text-xl font-semibold text-white">Fee dashboard overview</h2>
        </div>

        <FeeTimeRangeSelector value={selectedRange} onChange={setSelectedRange} />
      </div>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <FeeSummaryCard
          label="Today's Collection"
          value={formatCurrency(currentRange.collections)}
          context={`${currentRange.payments} payments`}
          tone="sky"
        />
        <FeeSummaryCard
          label="This Month"
          value={formatCurrency(rangeMeta.month.collections)}
          context="Current academic session"
          tone="emerald"
        />
        <FeeSummaryCard
          label="Total Outstanding"
          value={formatCurrency(totalOutstanding)}
          context={`${studentsWithDue} students`}
          tone="amber"
        />
        <FeeSummaryCard
          label="Students With Due"
          value={String(studentsWithDue)}
          context="Need attention"
          tone="rose"
        />
      </section>

      <section className="rounded-2xl border border-[#2A2A2A] bg-[#1A1A1A] p-4 sm:p-5">
        <div className="mb-4 flex items-center justify-between gap-2">
          <div>
            <p className="text-[11px] uppercase tracking-[0.18em] text-gray-400">Collection trend</p>
            <h3 className="mt-1 text-lg font-semibold text-white">{currentRange.label}</h3>
          </div>
          <div className="rounded-full border border-[#3A3A3A] bg-[#111111] px-2.5 py-1 text-sm font-medium text-gray-200">
            {formatCurrency(currentRange.collections)}
          </div>
        </div>

        <CollectionTrend data={currentSeries} />
      </section>

      <section className="grid gap-5 xl:grid-cols-2">
        <div className="rounded-2xl border border-[#2A2A2A] bg-[#1A1A1A] p-4 sm:p-5">
          <div className="mb-4 flex items-center justify-between gap-3">
            <div>
              <p className="text-[11px] uppercase tracking-[0.18em] text-gray-400">Class-wise collection</p>
              <h3 className="mt-1 text-lg font-semibold text-white">Collection by class</h3>
            </div>
          </div>

          <div className="space-y-3">
            {classCollection.slice(0, 6).map((item) => (
              <div key={item.className} className="rounded-xl border border-[#2A2A2A] bg-[#111111] p-3">
                <div className="mb-2 flex items-center justify-between gap-3">
                  <span className="text-sm font-medium text-gray-200">Class {item.className}</span>
                  <span className="text-sm font-semibold text-emerald-300">{formatCurrency(item.totalCollected)}</span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-[#2A2A2A]">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-emerald-400"
                    style={{ width: `${Math.min(100, (item.totalCollected / Math.max(classCollection[0]?.totalCollected || 1, 1)) * 100)}%` }}
                  />
                </div>
                <div className="mt-2 flex items-center justify-between text-xs text-gray-400">
                  <span>{item.paidStudents} paid</span>
                  <span>{item.totalStudents} students</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-2xl border border-[#2A2A2A] bg-[#1A1A1A] p-4 sm:p-5">
          <div className="mb-4 flex items-center justify-between gap-3">
            <div>
              <p className="text-[11px] uppercase tracking-[0.18em] text-gray-400">Class-wise outstanding</p>
              <h3 className="mt-1 text-lg font-semibold text-white">Outstanding by class</h3>
            </div>
          </div>

          <div className="space-y-3">
            {classOutstanding.slice(0, 6).map((item) => (
              <div key={item.className} className="rounded-xl border border-[#2A2A2A] bg-[#111111] p-3">
                <div className="mb-2 flex items-center justify-between gap-3">
                  <span className="text-sm font-medium text-gray-200">Class {item.className}</span>
                  <span className="text-sm font-semibold text-amber-300">{formatCurrency(item.totalOutstanding)}</span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-[#2A2A2A]">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-amber-500 to-orange-500"
                    style={{ width: `${Math.min(100, (item.totalOutstanding / Math.max(classOutstanding[0]?.totalOutstanding || 1, 1)) * 100)}%` }}
                  />
                </div>
                <div className="mt-2 flex items-center justify-between text-xs text-gray-400">
                  <span>{item.studentsWithDue} students</span>
                  <span>{item.totalStudents} total</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <div className="rounded-2xl border border-slate-700/80 bg-slate-900/80 p-4">
          <p className="text-[11px] uppercase tracking-[0.18em] text-slate-500">Total students</p>
          <p className="mt-2 text-2xl font-bold text-white">{students.length}</p>
        </div>
        <div className="rounded-2xl border border-slate-700/80 bg-slate-900/80 p-4">
          <p className="text-[11px] uppercase tracking-[0.18em] text-slate-500">Fully paid</p>
          <p className="mt-2 text-2xl font-bold text-emerald-300">{fullyPaidStudents}</p>
        </div>
        <div className="rounded-2xl border border-slate-700/80 bg-slate-900/80 p-4">
          <p className="text-[11px] uppercase tracking-[0.18em] text-slate-500">Partially paid</p>
          <p className="mt-2 text-2xl font-bold text-sky-300">{partiallyPaidStudents}</p>
        </div>
        <div className="rounded-2xl border border-slate-700/80 bg-slate-900/80 p-4">
          <p className="text-[11px] uppercase tracking-[0.18em] text-slate-500">Collection rate</p>
          <p className="mt-2 text-2xl font-bold text-violet-300">
            {(((totalCollected / Math.max(students.reduce((sum, student) => sum + (student.totalFee || 0), 0), 1)) * 100) || 0).toFixed(1)}%
          </p>
        </div>
      </section>
    </div>
  );
}
