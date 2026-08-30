import { useState } from 'react';
import NavBar from './components/NavBar.jsx';
import Sidebar from './components/SideBar/SideBar.jsx';
import { Outlet } from 'react-router-dom';
import usePermission from './hooks/usePermission.js';
// import routesData
import { GraduationCap, Receipt, UserPlus,
  TrendingUp, UserCheck, CalendarDays, FileEdit,
  BarChart3, Contact, UserCog, FileText, Ticket
} from "lucide-react";

function Layout() {
  const { PERMISSIONS } = usePermission()
  const [isSidebarOpen, setSidebarOpen] = useState(false);




  const menuSections = [
    {
      title: "Student Management",
      items: [
        {
          label: "Student List",
          route: "/student_list",
          icon: GraduationCap,
          color: "text-blue-500",
          permissionName: PERMISSIONS.STUDENT_LIST
        },
        {
          label: "Fees",
          route: "/fees",
          icon: Receipt,
          color: "text-emerald-500",
          permissionName: PERMISSIONS.VIEW_FEE_DATA
        },
        {
          label: "Add Student",
          route: "/admission",
          icon: UserPlus,
          color: "text-teal-500",
          permissionName: PERMISSIONS.ADMISSION
        },
        {
          label: "Promotion & TC",
          route: "/promote_and_tc",
          icon: TrendingUp,
          color: "text-orange-500",
          permissionName: PERMISSIONS.PROMOTE_STUDENT
        }
      ]
    },
    {
      title: "Academics",
      items: [
        {
          label: "Attendance",
          route: "/attendance",
          icon: UserCheck,
          color: "text-purple-500",
          permissionName: PERMISSIONS.ATTENDANCE
        },
        {
          label: "Overall Attendance",
          route: "/overall_attendance",
          icon: CalendarDays,
          color: "text-indigo-500",
          permissionName: PERMISSIONS.OVERALL_ATTENDANCE
        },
        {
          label: "Update Marks",
          route: "/fillmarks",
          icon: FileEdit,
          color: "text-rose-500",
          permissionName: PERMISSIONS.FILL_MARKS
        },
        {
          label: "Show Marks",
          route: "/show_marks",
          icon: BarChart3,
          color: "text-pink-500",
          permissionName: PERMISSIONS.SHOW_MARKS
        }
      ]
    },
    {
      title: "Administration",
      items: [
        {
          label: "ID Cards",
          route: "/idcard",
          icon: Contact,
          color: "text-cyan-500",
          permissionName: PERMISSIONS.IDCARD
        },
        {
          label: "Staff Module",
          route: "/show_staff",
          icon: UserCog,
          color: "text-amber-500",
          permissionName: PERMISSIONS.SHOW_STAFF
        }
      ]
    },
    {
      title: "Examination",
      items: [
        {
          label: "Question Papers",
          route: "/question-papers",
          icon: FileText,
          color: "text-sky-500",
          permissionName: PERMISSIONS.CREATE_PAPER
        },
        {
          label: "Admit & Scheme",
          route: "/admit_and_scheme",
          icon: Ticket,
          color: "text-violet-500",
          permissionName: PERMISSIONS.ADMIT_CARD
        }
      ]
    }
  ];

  return (
    <>
      <NavBar
        setSidebarOpen={setSidebarOpen}
      />

      <div className="flex h-screen">

        <Sidebar
          isSidebarOpen={isSidebarOpen}
          setSidebarOpen={setSidebarOpen}
          menuSections={menuSections}
        />

        <div className="main-content flex-1 overflow-auto">
          <Outlet />
        </div>
      </div>
    </>
  );
}

export default Layout
