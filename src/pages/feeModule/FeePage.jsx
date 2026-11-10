import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { WalletCards, BarChart3 } from 'lucide-react';
import StudentsTab from './studentsListTab/StudentsTab';
import DashboardTab from './dashboard/DashboardTab';
import { apiGet } from '../../api/api';
import usePermission from '../../hooks/usePermission'

async function fetchFeeDashboardData(key, signal) {
  const response = await apiGet(`/api/fee-dashboard/${key}`, { signal });
  const payload = await response.json();
  if (!response.ok) {
    throw new Error(payload?.error || `Failed to load ${key.replace('-', ' ')}.`);
  }
  return payload[key.replaceAll('-', '_')];
}

function FeePage() {
  const { hasPermission, PERMISSIONS } = usePermission()
  const canViewFeeData = hasPermission(PERMISSIONS.VIEW_FEE_DATA);
  const canViewAnalytics = hasPermission(PERMISSIONS.FEES_ANALYTICS);

  const [activeTab, setActiveTab] = useState(
    canViewFeeData ? 'pay-fees' : 'dashboard'
  );

  const schoolSummaryQuery = useQuery({
    queryKey: ['fee-dashboard', 'school-summary'],
    queryFn: ({ signal }) => fetchFeeDashboardData('summary', signal),
    enabled: canViewFeeData || canViewAnalytics,
  });
  const dailyCollectionsQuery = useQuery({
    queryKey: ['fee-dashboard', 'daily-collections'],
    queryFn: ({ signal }) => fetchFeeDashboardData('daily-collections', signal),
    enabled: canViewAnalytics,
  });
  const classAnalysisQuery = useQuery({
    queryKey: ['fee-dashboard', 'class-analysis'],
    queryFn: ({ signal }) => fetchFeeDashboardData('class-analysis', signal),
    enabled: canViewAnalytics,
  });

  const dashboardData = {
    summary: schoolSummaryQuery.data,
    daily_collections: dailyCollectionsQuery.data,
    class_analysis: classAnalysisQuery.data,
  };
  const isDashboardLoading =
    schoolSummaryQuery.isLoading || dailyCollectionsQuery.isLoading || classAnalysisQuery.isLoading;
  const dashboardError =
    schoolSummaryQuery.error?.message || dailyCollectionsQuery.error?.message || classAnalysisQuery.error?.message;
  const retryDashboard = () => Promise.all([
    dailyCollectionsQuery.refetch(),
    classAnalysisQuery.refetch(),
  ]);

  const tabOptions = [
    canViewFeeData && { value: 'pay-fees', label: 'Pay Fees', icon: WalletCards },
    canViewAnalytics && { value: 'dashboard', label: 'Dashboard', icon: BarChart3 },
  ].filter(Boolean);
  const selectedTab = tabOptions.some((tab) => tab.value === activeTab)
    ? activeTab
    : tabOptions[0]?.value;

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

      {selectedTab === 'pay-fees' ? (
        <StudentsTab
          schoolSummary={dashboardData?.summary}
          isSchoolSummaryLoading={schoolSummaryQuery.isLoading}
        />
      ) : selectedTab === 'dashboard' ? (
        <DashboardTab
          data={dashboardData}
          loading={isDashboardLoading}
          error={dashboardError}
          onRetry={retryDashboard}
        />
      ) : null}
    </div>
  );
}

export default FeePage;