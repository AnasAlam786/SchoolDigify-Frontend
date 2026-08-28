import { useState, useEffect } from 'react';
import StudentsTab from './tabs/StudentsTab';
import DashboardTab from './tabs/DashboardTab';
import { apiGet } from '../../api/api';


function FeePage() {
  console.log("FeePage rendered");
  const [activeTab, setActiveTab] = useState('students');
  

  const [studentsData, setStudentsData] = useState([]);
  
  const [isStudentsDataLoading, setStudentsDataLoading] = useState(null);
  const [studentsDataError, setStudentsDataError] = useState(null);
  


  useEffect(() => {
    async function loadStudentFeeData() {

      setStudentsDataLoading(true);
      try {
        const response = await apiGet(`/api/get_students_fees`);
        const payload = await response.json();

        if (!response.ok) {
          setStudentsDataError(payload.error);
          throw new Error(payload?.error || 'Failed to fetch student fee data');
        }

        const studentsFeeData = payload.students_fee_data || [];

        setStudentsData(studentsFeeData);

      } catch (error) {
        console.error('Failed to fetch fee data:', error);
        showAlert(500, error)
      } finally {
        setStudentsDataLoading(false);
      }
    }
    loadStudentFeeData();
  }, []);

  return (
    <div className="min-h-screen bg-[#111111] text-white">
      <div className="mx-auto max-w-7xl">
        <header className="mb-6 overflow-hidden rounded-2xl border border-[#2A2A2A] bg-[#1A1A1A] shadow-[0_18px_40px_-18px_rgba(0,0,0,0.8)]">
          <div className="flex flex-col gap-4 px-4 py-5 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-7">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-gray-300">Fee management</p>
              <h1 className="mt-2 text-2xl font-bold tracking-tight text-white sm:text-3xl">Student Fee Overview</h1>
            </div>
            <div className="flex items-center gap-2 self-start rounded-full border border-gray-700 bg-[#111111] px-3 py-1.5 text-sm font-medium text-gray-200">
              <span className="inline-flex h-2.5 w-2.5 rounded-full bg-gray-300" />
              {studentsData.length} students
            </div>
          </div>
        </header>

        <div className="mb-6 inline-flex w-full max-w-md items-center gap-1 rounded-2xl border border-[#2A2A2A] bg-[#1A1A1A] p-1.5 shadow-[0_12px_25px_-18px_rgba(0,0,0,0.8)]">
          {['students', 'dashboard'].map((tab) => (
            <button
              key={tab}
              type="button"
              onClick={() => setActiveTab(tab)}
              className={`flex-1 rounded-xl px-4 py-2.5 text-sm font-semibold transition-all ${activeTab === tab
                ? 'bg-[#2A2A2A] text-white border border-[#3A3A3A]'
                : 'text-gray-300 hover:bg-[#2A2A2A] hover:text-white'
                }`}
            >
              {tab === 'students' ? 'Students' : 'Dashboard'}
            </button>
          ))}
        </div>

        <div className={activeTab === 'students' ? 'block' : 'hidden'}>
          <StudentsTab students={studentsData} />
        </div>

        <div className={activeTab === 'dashboard' ? 'block' : 'hidden'}>
          <DashboardTab students={studentsData} />
        </div>
      </div>
    </div>
  );
}

export default FeePage;
