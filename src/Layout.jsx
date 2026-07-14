import { useState } from 'react';
import NavBar from './components/NavBar.jsx';
import Sidebar from './components/SideBar/SideBar.jsx';
import { Outlet } from 'react-router-dom';
import usePermission from './hooks/usePermission.js';
// import routesData

function Layout() {
  const {PERMISSIONS} = usePermission()
  const [isSidebarOpen, setSidebarOpen] = useState(false);


  const menuSections = [
    {
      title: "Student Management",
      items: [
        {
          label: "Student List",
          route: "/student_list",
          icon: "fas fa-user-graduate icon-purple",
          permissionName: PERMISSIONS.STUDENT_LIST
        },
        {
          label: "Add Student",
          route: "/admission",
          icon: "fas fa-user-plus icon-cyan",
          permissionName: PERMISSIONS.ADMISSION
        },
        {
          label: "Promotion & TC",
          route: "/promote_and_tc",
          icon: "fas fa-graduation-cap icon-yellow",
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
          icon: "fas fa-clipboard-check icon-purple",
          permissionName: PERMISSIONS.ATTENDANCE
        },
        {
          label: "Overall Attendance",
          route: "/overall_attendance",
          icon: "fas fa-calendar-alt icon-cyan",
          permissionName: PERMISSIONS.OVERALL_ATTENDANCE
        },
        {
          label: "Update Marks",
          route: "/fillmarks",
          icon: "fas fa-edit icon-pink",
          permissionName: PERMISSIONS.FILL_MARKS
        },
        {
          label: "Show Marks",
          route: "/show_marks",
          icon: "fas fa-chart-bar icon-blue",
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
          icon: "fas fa-id-card icon-blue",
          permissionName: PERMISSIONS.IDCARD
        },
        {
          label: "Staff Module",
          route: "/show_staff",
          icon: "fas fa-users icon-pink",
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
          icon: "fas fa-file-alt icon-pink",
          permissionName: PERMISSIONS.CREATE_PAPER
        },
        {
          label: "Admit & Scheme",
          route: "/admit_and_scheme",
          icon: "fas fa-ticket-alt icon-cyan",
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
