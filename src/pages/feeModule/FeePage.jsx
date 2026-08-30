import { useState, useEffect, useCallback } from 'react';
import StudentsTab from './tabs/StudentsTab';
import DashboardTab from './tabs/DashboardTab';
import { apiGet } from '../../api/api';
import { ErrorState, NoStudentsState } from "../utils/GlobalPageStatus";
import { SkeletonLoader } from './components/PageStatus';
import { NoFeeSessionStatus } from './components/PageStatus';

function FeePage() {
  const [activeTab, setActiveTab] = useState('students');

  const [studentsData, setStudentsData] = useState([]);
  const [totalDiscountBySchool, setTotalDiscountBySchool] = useState(0);

  // All Page state and status
  const [isStudentsDataLoading, setStudentsDataLoading] = useState(false);
  const [studentsDataError, setStudentsDataError] = useState(null);
  const [showNoFeeSessionState, setNoFeeSessionState] = useState(false);
  const [showNoStudentState, setNoStudentState] = useState(false);

  // 1. Extract function out of useEffect so it can be passed as a prop
  const loadStudentFeeData = useCallback(async () => {
    // Reset flags before fetching fresh data
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
      // Ensure showAlert is defined in your scope if using it
    } finally {
      setStudentsDataLoading(false);
    }
  }, []);

  // 2. Initial load on mount
  useEffect(() => {
    loadStudentFeeData();
  }, [loadStudentFeeData]);

  return (
    <div className="min-h-screen bg-[#111111] text-white">
      <div className="mx-auto max-w-7xl">
        <header className="m-4 mb-0 overflow-hidden rounded-2xl border border-[#2A2A2A] bg-[#1A1A1A] shadow-[0_18px_40px_-18px_rgba(0,0,0,0.8)]">
          <div className="flex flex-col gap-4 px-4 py-5 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-7">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-gray-300">Fee management</p>
              <h1 className="mt-2 text-2xl font-bold tracking-tight text-white sm:text-3xl">Student Fee Overview</h1>
            </div>
          </div>
        </header>

        {isStudentsDataLoading ? (
          <SkeletonLoader />
        ) : showNoFeeSessionState ? (
          <NoFeeSessionStatus
            onFeeSessionCreated={loadStudentFeeData}
          />
        ) : showNoStudentState ? (
          <NoStudentsState message={studentsDataError}/>
        ) : studentsDataError ? (
          <ErrorState message={studentsDataError} />
        ) : (
          <>
            <div className={activeTab === "students" ? "block" : "hidden"}>
              <StudentsTab
                students={studentsData}
                totalDiscountBySchool={totalDiscountBySchool}
              />
            </div>

            <div className={activeTab === "dashboard" ? "block" : "hidden"}>
              <DashboardTab
                students={studentsData}
                totalDiscountBySchool={totalDiscountBySchool}
              />
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default FeePage;