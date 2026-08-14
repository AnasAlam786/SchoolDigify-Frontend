import { useEffect, useContext } from "react";
import { useLocation, matchPath } from "react-router-dom";
import { AuthContext } from "../auth/authProvider";

export default function TitleManager() {
  const location = useLocation();
  const { sessionData } = useContext(AuthContext);


  useEffect(() => {
    const { pathname } = location;

    let title = "SchoolDigify";

    if (matchPath("/question-papers/:paperId", pathname)) {
      title = "Question Paper Editor";
    } else if (matchPath("/edit_student/:studentID", pathname)) {
      title = "Edit Student";
    } else if (matchPath("/edit_staff/:staffId", pathname)) {
      title = "Edit Staff";
    } else {
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
        "/add_staff": "Add Staff",
        "/show_staff":"Staff List",
      };

      title = titles[pathname] || "SchoolDigify";
    }

    document.title = title;

    // Update favicon
    const session = JSON.parse(sessionStorage.getItem("session"));

    // Update favicon
    if (sessionData?.logo) {
      setFavicon(sessionData.logo);
    }
  }, [location.pathname, sessionData]);

  return null;
}

function setFavicon(url) {
  let link = document.querySelector("link[rel='icon']");

  if (!link) {
    link = document.createElement("link");
    link.rel = "icon";
    document.head.appendChild(link);
  }

  link.href = url;
}