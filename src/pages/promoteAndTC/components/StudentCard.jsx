import React from 'react';
import { apiPost } from '../../../api/api';

export default function StudentCard(
    { student, onOpenPromotion, onOpenDepromotion,onOpenUpdatePromotion, onOpenTC, onOpenTCCancel }
) {
    const placeholderBoy = '/static/no-student-boy-image.png';
    const placeholderGirl = '/static/no-student-girl-image.png';

    const imageSrc = student.IMAGE
        ? `https://lh3.googleusercontent.com/d/${student.IMAGE}=s200`
        : student.GENDER === "Male"
            ? placeholderBoy
            : placeholderGirl;

    const stateColors = {
        PROMOTED: "bg-green-900/40 text-green-300",
        TC_ISSUED: "bg-amber-900/40 text-amber-300",
        NOT_PROMOTED_NOT_TC: "bg-gray-700 text-gray-300",
    };

    const stateLabels = {
        PROMOTED: "Promoted",
        TC_ISSUED: "TC Issued",
        NOT_PROMOTED_NOT_TC: "No Action",
    };

    const printTC = async (studentSessionId) => {
        try {
            const resp = await apiPost("/api/get_tc_html", {
                student_session_id: studentSessionId,
            });

            const content = await resp.json();

            if (!resp.ok) {
                showAlert(resp.status, content.message);
                return;
            }

            const printWindow = window.open("", "_blank");

            if (!printWindow) {
                showAlert(400, "Unable to open print window.");
                return;
            }

            printWindow.document.open();
            printWindow.document.write(content.html);
            printWindow.document.close();

            printWindow.onload = () => {
                printWindow.focus();
                printWindow.print();
            };

        } catch (err) {
            console.error(err);
            showAlert(400, "Unable to reprint TC.");
        }
    };



    return (
        <div className="student-card rounded-2xl overflow-hidden shadow-lg">
            {/* Header */}
            <div className="flex items-center justify-end gap-3 px-4 py-2 border-b border-gray-700">

                <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold inline-flex items-center gap-2 
                        ${stateColors[student.state]}`} >
                    <span className="h-2 w-2 rounded-full bg-current"></span>
                    {stateLabels[student.state]}
                </span>
            </div>


            {/* Body */}
            <div className="p-5">

                <div className="flex gap-4">

                    <img src={imageSrc} alt="Student" className="student-image" loading="lazy" />

                    <div className="flex-1 min-w-0">

                        <h3 className="font-bold text-green-400 text-lg truncate">
                            {student.STUDENTS_NAME}
                        </h3>

                        <p className="text-sm text-gray-400 truncate">
                            C/O {student.FATHERS_NAME || "-"}
                        </p>

                        <p className="text-sm text-gray-400 truncate">
                            PEN: {student.PEN || "-"}
                        </p>

                        <div className="mt-3 space-y-1 text-sm">

                            <div className="flex justify-between">
                                <span className="text-gray-400">Class:</span>
                                <span className="font-medium text-white">
                                    {student.previous_class}
                                </span>
                            </div>

                            <div className="flex justify-between">
                                <span className="text-gray-400">Roll:</span>
                                <span className="font-medium text-white">
                                    {student.previous_roll || "-"}
                                </span>
                            </div>

                            {student.state === "PROMOTED" && (
                                <>
                                    <div className="flex justify-between">
                                        <span className="text-gray-400">New Class:</span>
                                        <span className="font-medium text-green-400">
                                            {student.new_class}
                                        </span>
                                    </div>

                                    <div className="flex justify-between">
                                        <span className="text-gray-400">New Roll:</span>
                                        <span className="font-medium text-green-400">
                                            {student.new_roll || "-"}
                                        </span>
                                    </div>
                                </>
                            )}

                            {student.state === "TC_ISSUED" && (
                                <>
                                    <div className="flex justify-between">
                                        <span className="text-gray-400">TC No.</span>
                                        <span className="font-medium text-amber-400">
                                            {student.tc_number || "-"}
                                        </span>
                                    </div>

                                    <div className="flex justify-between">
                                        <span className="text-gray-400">TC Date</span>
                                        <span className="font-medium text-amber-400">
                                            {student.tc_date || "-"}
                                        </span>
                                    </div>
                                </>
                            )}

                            {student.has_cancelled_tc && (
                                <>
                                    <div className="flex justify-between">
                                        <span className="text-gray-400">
                                            Cancelled TC
                                        </span>

                                        <span className="font-medium text-amber-300">
                                            {student.cancelled_tc_number || "-"}
                                        </span>
                                    </div>
                                </>
                            )}

                        </div>

                    </div>

                </div>

                {/* Buttons */}

                <div className="mt-4 flex gap-2">

                    {student.state === "PROMOTED" ? (
                        <>
                            <button
                                className="flex-1 py-2.5 rounded-lg bg-blue-700 hover:bg-blue-600 text-white font-medium"
                                onClick={() => onOpenUpdatePromotion(student.student_session_id, student.promoted_student_id)} >
                                <i className="fas fa-sync-alt mr-2"></i>
                                Update
                            </button>

                            <button
                                className="flex-1 py-2.5 rounded-lg bg-red-700 hover:bg-red-600 text-white font-medium"
                                onClick={() => onOpenDepromotion(student.student_session_id, student.promoted_student_id)}>
                                <i className="fas fa-undo mr-2"></i>
                                Depromote
                            </button>
                        </>
                    ) : student.state === "TC_ISSUED" ? (
                        <>
                            <button
                                className="flex-1 py-2.5 rounded-lg bg-green-700 hover:bg-green-600 text-white font-medium"
                                onClick={() => printTC(student.student_session_id)} >
                                <i className="fas fa-file-alt mr-2"></i>
                                Get TC
                            </button>

                            <button
                                className="flex-1 py-2.5 rounded-lg bg-yellow-700 hover:bg-yellow-600 text-white font-medium"
                                onClick={() => onOpenTCCancel(student.student_session_id)} >
                                <i className="fas fa-ban mr-2"></i>
                                Cancel TC
                            </button>
                        </>
                    ) : (
                        <>
                            <button
                                disabled={student.is_terminal}
                                onClick={() => onOpenPromotion(student.id)}
                                className={`flex-1 py-2.5 rounded-lg text-white font-medium 
                                    ${student.is_terminal
                                        ? "bg-gray-600 cursor-not-allowed opacity-60"
                                        : "bg-green-700 hover:bg-green-600"}`
                                }>
                                <i className="fas fa-graduation-cap mr-2"></i>

                                {student.is_terminal ? "No Classes" : "Promote"}
                            </button>

                            <button
                                className="flex-1 py-2.5 rounded-lg bg-amber-700 hover:bg-amber-600 text-white font-medium"
                                onClick={() => onOpenTC(student.id)} >
                                <i className="fas fa-file-alt mr-2"></i>

                                {student.has_cancelled_tc ? "Restore TC" : "Create TC"}
                            </button>
                        </>
                    )}

                </div>
            </div>
        </div>
    );
}
