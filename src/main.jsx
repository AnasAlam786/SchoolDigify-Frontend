import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import "./index.css";

import AuthProvider from "./auth/authProvider.jsx";
import LoginCheck from "./auth/LoginCheck.jsx";
import LoginRequired from "./auth/LoginRequired.jsx";
import PermissionRoute from "./auth/PermissionRoute.jsx";

import Layout from "./Layout.jsx";
import TitleManager from "./components/TitleManager.jsx";

import Login from "./pages/login/Login.jsx";
import Logout from "./pages/logout/Logout.jsx";

import IDCard from "./pages/IDCard/IDCard.jsx";
import FillMarks from "./pages/fillMarks/FillMarks.jsx";
import Dashboard from "./pages/questionPaperMaker/PaperDashboard/Dashboard.jsx";
import Editor from "./pages/questionPaperMaker/PaperEditor/Editor.jsx";
import AdmitAndScheme from "./pages/admitCard/AdmitAndScheme.jsx";
import Attendance from "./pages/Attendance/Attendance.jsx";
import ShowMarks from "./pages/showMarks/ShowMarks.jsx";
import AddStudent from "./pages/addStudent/AddStudent.jsx";
import StudentsList from "./pages/studentsList/StudentsList.jsx";
import PromoteAndTC from "./pages/promoteAndTC/PromoteAndTC.jsx";
import EditStudent from "./pages/editStudent/EditStudent.jsx";

import ShowStaff from "./pages/showStaff/ShowStaff.jsx";
import AddStaff from "./pages/staffModule/addStaff/AddStaff.jsx";
import EditStaff from "./pages/staffModule/editStaff/EditStaff.jsx";
import FeePage from "./pages/feeModule/FeePage.jsx";

createRoot(document.getElementById("root")).render(
    <AuthProvider>
      <BrowserRouter>
        <TitleManager />

        <Routes>

          {/* Login */}
          <Route path="/login" element={<LoginCheck> <Login /> </LoginCheck>} />

          <Route element={<LoginRequired> <Layout /> </LoginRequired>} >

            <Route path="/logout" element={<Logout />} />

            <Route
              path="/idcard"
              element={<PermissionRoute permission="idcard"> <IDCard /> </PermissionRoute>} />

            <Route
              path="/fillmarks"
              element={<PermissionRoute permission="fill_marks"> <FillMarks /> </PermissionRoute>} />

            <Route
              path="/question-papers"
              element={<PermissionRoute permission="create_paper"> <Dashboard /> </PermissionRoute>} />

            <Route
              path="/question-papers/:paperId"
              element={<PermissionRoute permission="create_paper"> <Editor /> </PermissionRoute>} />

            <Route
              path="/admit_and_scheme"
              element={<PermissionRoute permission="admit_card"> <AdmitAndScheme /> </PermissionRoute>} />

            <Route
              path="/attendance"
              element={<PermissionRoute permission="attendance"> <Attendance /> </PermissionRoute>} />

            <Route
              path="/show_marks"
              element={<PermissionRoute permission="show_marks"> <ShowMarks /> </PermissionRoute>} />

            <Route
              path="/admission"
              element={<PermissionRoute permission="admission"> <AddStudent /> </PermissionRoute>} />

            <Route
              path="/student_list"
              element={<PermissionRoute permission="student_list"> <StudentsList /> </PermissionRoute>} />

            <Route
              path="/edit_student/:studentID"
              element={<PermissionRoute permission="update_student"> <EditStudent /> </PermissionRoute>} />

            <Route
              path="/promote_and_tc"
              element={<PermissionRoute permission="promote_student"> <PromoteAndTC /> </PermissionRoute>} />

            <Route
              path="/show_staff"
              element={<PermissionRoute permission="show_staff"> <ShowStaff /> </PermissionRoute>} />

            <Route
              path="/add_staff"
              element={<PermissionRoute permission="add_staff"> <AddStaff /> </PermissionRoute>} />

            <Route
              path="/edit_staff/:staffId"
              element={<PermissionRoute permission="update_staff"> <EditStaff /> </PermissionRoute>} />

            <Route
              path="/fees"
              element={<PermissionRoute permission="pay_fees"> <FeePage /> </PermissionRoute>} />

          </Route>

          {/* Default */}
          <Route path="/" element={<Navigate to="/student_list" replace />} />

        </Routes>

      </BrowserRouter>
    </AuthProvider>

);