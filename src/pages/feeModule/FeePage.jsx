import { useState, useEffect, useCallback } from 'react';
import { WalletCards, BarChart3 } from 'lucide-react';
import StudentsTab from './studentsListTab/StudentsTab';
import DashboardTab from './dashboard/DashboardTab';
import { apiGet } from '../../api/api';
import { ErrorState, NoStudentsState } from "../utils/GlobalPageStatus";
import { SkeletonLoader } from './studentsListTab/components/PageStatus';
import { NoFeeSessionStatus } from './studentsListTab/components/PageStatus';

function FeePage() {
  const [activeTab, setActiveTab] = useState('pay-fees');

  const [studentsData, setStudentsData] = useState([]);
  const [totalDiscountBySchool, setTotalDiscountBySchool] = useState(0);
  const [dashboardData, setDashboardData] = useState(null);

  // All Page state and status
  const [isStudentsDataLoading, setStudentsDataLoading] = useState(false);
  const [studentsDataError, setStudentsDataError] = useState(null);
  const [showNoFeeSessionState, setNoFeeSessionState] = useState(false);
  const [showNoStudentState, setNoStudentState] = useState(false);
  const [isDashboardLoading, setDashboardLoading] = useState(false);
  const [dashboardError, setDashboardError] = useState(null);

  const loadStudentFeeData = useCallback(async () => {
    setStudentsDataLoading(true);
    setStudentsDataError(null);
    setNoFeeSessionState(false);
    setNoStudentState(false);

    try {
      const response = await apiGet(`/api/get_students_fees`);
      const payload = await response.json();

      if (!response.ok) {
        setStudentsDataError(payload.error);
        if (payload.ERROR_CODE === "NO_SESSION_FEE_SETUP") {
          setNoFeeSessionState(true);
        } else if (payload.ERROR_CODE === "NO_STUDENTS") {
          setNoStudentState(true);
        }

        throw new Error(payload?.error || 'Failed to fetch student fee data');
      }

      const studentsFeeData = payload.students_fee_data || [];
      const totalDiscountBySchool = payload.total_discount_given_by_school || 0;

      setTotalDiscountBySchool(totalDiscountBySchool);
      setStudentsData(studentsFeeData);
    } catch (error) {
      console.error('Failed to fetch fee data:', error);
    } finally {
      setStudentsDataLoading(false);
    }
  }, []);

  const loadDashboardData = useCallback(async () => {
    setDashboardLoading(true);
    setDashboardError(null);

    try {
      const response = await apiGet('/api/fee-dashboard');
      const payload = await response.json();

      if (!response.ok) {
        throw new Error(payload?.error || 'Failed to load dashboard');
      }

      setDashboardData(payload);
    } catch (error) {
      console.error('Failed to fetch fee dashboard data:', error);
      setDashboardError(error.message || 'Unable to load dashboard data.');
    } finally {
      setDashboardLoading(false);
    }
  }, []);

  useEffect(() => {
    Promise.allSettled([loadStudentFeeData(), loadDashboardData()]);
  }, [loadStudentFeeData, loadDashboardData]);

  const tabOptions = [
    { value: 'pay-fees', label: 'Pay Fees', icon: WalletCards },
    { value: 'dashboard', label: 'Dashboard', icon: BarChart3 },
  ];

  return (
    <div className="mx-auto max-w-7xl">
      <header className="mb-5 overflow-hidden rounded-2xl border border-[#2A2A2A] bg-[#1A1A1A] shadow-[0_18px_40px_-18px_rgba(0,0,0,0.8)]">
        <div className="flex flex-col gap-4 px-4 py-5 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-7">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-gray-300">Fee management</p>
            <h1 className="mt-2 text-2xl font-bold tracking-tight text-white sm:text-3xl">Student Fee Overview</h1>
          </div>

          <div className="flex items-center gap-2 rounded-2xl border border-[#2A2A2A] bg-[#111111] p-1.5 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]">
            {tabOptions.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.value;

              return (
                <button
                  key={tab.value}
                  type="button"
                  onClick={() => setActiveTab(tab.value)}
                  className={[
                    'inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition-all duration-200',
                    isActive
                      ? 'border border-[#3A3A3A] bg-[#2A2A2A] text-white shadow-[0_10px_25px_-18px_rgba(255,255,255,0.9)]'
                      : 'text-gray-300 hover:bg-[#1E1E1E] hover:text-white'
                  ].join(' ')}
                >
                  <Icon size={16} />
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>
      </header>

      {activeTab === 'pay-fees' ? (
        isStudentsDataLoading ? (
          <SkeletonLoader />
        ) : showNoFeeSessionState ? (
          <NoFeeSessionStatus onFeeSessionCreated={loadStudentFeeData} />
        ) : showNoStudentState ? (
          <NoStudentsState message={studentsDataError} />
        ) : studentsDataError ? (
          <ErrorState message={studentsDataError} />
        ) : (
          <StudentsTab
            students={studentsData}
            totalDiscountBySchool={totalDiscountBySchool}
          />
        )
      ) : (
        <DashboardTab
          data={dashboardData}
          loading={isDashboardLoading}
          error={dashboardError}
          onRetry={loadDashboardData}
          students={studentsData}
        />
      )}
    </div>
  );
}

export default FeePage;