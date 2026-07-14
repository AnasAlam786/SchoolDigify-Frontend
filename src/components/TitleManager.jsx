import { useEffect } from "react";
import { useLocation, matchPath } from "react-router-dom";

export default function TitleManager() {
  const location = useLocation();

  useEffect(() => {
    const { pathname } = location;

    let title = "SchoolDigify";

    // Dynamic routes
    if (matchPath("/question-papers/:paperId", pathname)) {
      title = "Question Paper Editor";
    }

    // Static routes
    else {
      const titles = {
        "/login": "Login",
        "/logout": "Logout",
        "/student_list": "Students List",
        "/attendance": "Attendance",
        "/admission": "Admission",
        "/fillmarks": "Fill Marks",
        "/idcard": "ID Card",
        "/question-papers": "Question Papers",
        "/admit_and_scheme": "Admit Card & Scheme",
        "/show_marks": "Show Marks",
        "/promote_and_tc": "Promote & TC",
      };

      title = titles[pathname] || "SchoolDigify";
    }

    document.title = `${title}`;
  }, [location.pathname]);

  return null;
}