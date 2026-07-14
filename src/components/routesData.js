  const routesData = [
    {
      title: "Student Management",
      items: [
        {
          label: "Student List",
          route: "/student_list",
          icon: "fas fa-user-graduate icon-purple",
          permissionName: "student_list"
        },
        {
          label: "Add Student",
          route: "/admission",
          icon: "fas fa-user-plus icon-cyan",
          permissionName: "admission"
        },
        {
          label: "Promotion & TC",
          route: "/promote_and_tc",
          icon: "fas fa-graduation-cap icon-yellow",
          permissionName: "promote_student"
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
          permissionName: "attendance"
        },
        {
          label: "Overall Attendance",
          route: "/overall_attendance",
          icon: "fas fa-calendar-alt icon-cyan",
          permissionName: "overall_attendance"
        },
        {
          label: "Update Marks",
          route: "/fillmarks",
          icon: "fas fa-edit icon-pink",
          permissionName: "fill_marks"
        },
        {
          label: "Show Marks",
          route: "/show_marks",
          icon: "fas fa-chart-bar icon-blue",
          permissionName: "show_marks"
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
          permissionName: "idcard"
        },
        {
          label: "Staff Module",
          route: "/show_staff",
          icon: "fas fa-users icon-pink",
          permissionName: "show_staff"
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
          permissionName: "create_paper"
        },
        {
          label: "Admit & Scheme",
          route: "/admit_and_scheme",
          icon: "fas fa-ticket-alt icon-cyan",
          permissionName: "admit_card"
        }
      ]
    }
  ];
