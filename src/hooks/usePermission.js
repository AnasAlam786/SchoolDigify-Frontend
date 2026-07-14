import { useContext } from "react";
import { AuthContext } from "../auth/authProvider";

const SUPER_ROLES = new Set(["admin", "manager"]);

const PERMISSIONS = Object.freeze({
    // Student
    STUDENT_LIST: "student_list",
    STUDENT_DETAILS: "student_details",
    ADMISSION: "admission",
    UPDATE_STUDENT: "update_student",
    PROMOTE_STUDENT: "promote_student",
    TC: "tc",
    DELETE_STUDENT: "delete_student",
    EXPORT_STUDENT_DATA: "export_student_data",
    IDCARD: "idcard",

    // Marks & Results
    SHOW_MARKS: "show_marks",
    FILL_MARKS: "fill_marks",
    GET_RESULT: "get_result",
    LOCK_MARKS: "lock_marks",
    OVERRIDE_MARKS_LOCK: "override_marks_lock",

    // Attendance
    ATTENDANCE: "attendance",
    OVERALL_ATTENDANCE: "overall_attendance",
    MARK_HOLIDAY: "mark_holiday",
    VIEW_HOLIDAYS: "view_holidays",
    MARK_ANY_DAY_ATTENDANCE: "mark_any_day_attendance",

    // Examination
    CREATE_PAPER: "create_paper",
    VIEW_ALL_PAPERS: "view_all_papers",
    ADMIT_CARD: "admit_card",

    // Staff
    SHOW_STAFF: "show_staff",
    ADD_STAFF: "add_staff",
    UPDATE_STAFF: "update_staff",
    EDIT_STAFF: "edit_staff",
    DELETE_STAFF: "delete_staff",

    // Fees
    PAY_FEES: "pay_fees",
    VIEW_FEE_DATA: "view_fee_data",

    // Statistics
    STUDENTS_STATS: "students_stats",

    // Administration
    CHANGE_SESSION: "change_session",
    CONTROL_ACCESS: "control_access",
});

export default function usePermission() {
    const { sessionData } = useContext(AuthContext);

    function hasPermission(permission) {
        const role = sessionData?.role?.toLowerCase();

        if (SUPER_ROLES.has(role)) {
            return true;
        }

        return sessionData?.permissions?.includes(permission) ?? false;
    }

    return {
        hasPermission,
        PERMISSIONS,
    };
}