import React from "react";
import { useNavigate } from "react-router-dom";
import { sendWhatsAppMessage } from "../../utils/sendWhatsAppMessage";
import boyImage from "../../../assets/no-student-boy-image.png";
import girlImage from "../../../assets/no-student-girl-image.png";

function normalizePhone(phone) {
    return phone ? String(phone).trim() : "";
}

function getImageUrl(student) {
    if (student.IMAGE) {
        return `https://lh3.googleusercontent.com/d/${student.IMAGE}=s200`;
    }

    return student.GENDER?.toLowerCase() === "male"
        ? boyImage : girlImage;
}

function StudentCard({ student, onViewDetails, onPayFees }) {

    const navigate = useNavigate();

    const phone = normalizePhone(student.PHONE);
    const imageUrl = getImageUrl(student);

    const handleWhatsApp = (event) => {
        event.preventDefault();
        try {
            sendWhatsAppMessage(phone, "");
        } catch (err) {
            alert(err.message || "Failed to open WhatsApp.");
        }
    };

    const handlePayFees = () => {
        if (typeof onPayFees === "function") {
            onPayFees(student, phone);
            return;
        }
        console.warn("Pay fees drawer handler is not available.");
    };

    return (
        <div className="student-card overflow-hidden">
            <div className="flex items-center justify-between px-3 py-0.5 bg-gray-800 bg-opacity-40 border-b border-gray-700">
                <div className="flex space-x-1 p-1">
                    {student.is_RTE && (
                        <span className="bg-yellow-500 text-gray-900 text-[9px] font-bold px-1.5 py-[2px] rounded">RTE</span>
                    )}
                    {student.student_status === "new" && (
                        <span className="bg-blue-500 text-[9px] font-bold px-1.5 py-[2px] rounded">NEW</span>
                    )}
                    {(!student.AADHAAR || student.AADHAAR === "" || student.AADHAAR === "999999999999") && (
                        <span className="bg-red-500 text-[9px] font-bold px-1.5 py-[2px] rounded">No Aadhaar</span>
                    )}
                    {(!student.PEN || student.PEN === "" || student.PEN === "999999999999") && (
                        <span className="bg-orange-500 text-[9px] font-bold px-1.5 py-[2px] rounded">No PEN</span>
                    )}
                </div>

                <div className="flex items-center space-x-2">
                    <button
                        type="button"
                        onClick={() => onViewDetails(student.id, phone)}
                        className="relative group p-1.5 hover:bg-gray-700 rounded-full"
                    >
                        <i className="fas fa-eye text-blue-400 text-lg" />
                        <span className="absolute right-1/2 translate-x-1/2 -top-7 hidden group-hover:block bg-black text-white text-xs px-2 py-1 rounded shadow-lg">
                            View
                        </span>
                    </button>

                    <button
                        type="button"
                        onClick={() => navigate(`/edit_student/${student.id}`)}
                        className="relative group p-1.5 hover:bg-gray-700 rounded-full"
                    >
                        <i className="fas fa-edit text-green-400 text-lg" />
                        <span className="absolute right-1/2 translate-x-1/2 -top-7 hidden group-hover:block bg-black text-white text-xs px-2 py-1 rounded shadow-lg">
                            Edit
                        </span>
                    </button>
                </div>
            </div>

            <div className="p-4">
                <div className="flex items-start">
                    <div className="relative mr-4 flex-shrink-0">
                        <img
                            src={imageUrl}
                            alt="Student"
                            className="student-image w-20 h-20 object-cover border-2 border-gray-700 shadow-lg"
                            loading="lazy"
                        />

                        <div className="absolute -bottom-2 -right-2
                            flex items-center gap-1.5
                            px-2.5 py-1
                            rounded-full
                            bg-slate-950/75
                            backdrop-blur-md
                            border border-indigo-500/25
                            shadow-[0_3px_12px_-3px_rgba(99,102,241,0.25)]
                            transition-all duration-300
                            hover:border-indigo-500/40">

                            <span className="w-1.5 h-1.5 rounded-full
                                bg-gradient-to-r from-indigo-500 to-purple-600" />

                            <span className="text-[9px] font-semibold
                                tracking-wider text-indigo-300/75 uppercase">
                                SR
                            </span>

                            <span className="w-px h-2.5 bg-white/10" />

                            <span className="text-[11px] font-bold
                   text-white/90 tracking-tight">
                                {student.SR}
                            </span>
                        </div>


                    </div>

                    <div className="flex-1 min-w-0">
                        <h3 className="text-xl font-bold text-blue-400 mb-0 truncate">
                            <button
                                type="button"
                                onClick={() => onViewDetails(student.id, phone)}
                                className="cursor-pointer text-left text-blue-400 hover:text-blue-300"
                            >
                                {student.STUDENTS_NAME}
                            </button>
                        </h3>
                        <p className="text-gray-400 text-md mb-2 truncate">C/O {student.FATHERS_NAME}</p>

                        <div className="bg-blue-900 bg-opacity-50 text-blue-400 px-2 py-1 rounded text-base font-medium mb-1 inline-block">
                            {student.CLASS} - {student.ROLL}
                        </div>

                        <div className="text-gray-400 text-sm truncate mb-2">
                            <span className="text-lg">🎂</span> {student.DOB}
                        </div>

                        <div className="flex items-center gap-2">
                            <a href={`tel:${phone}`} className="phone-badge flex items-center">
                                <i className="fas fa-phone text-blue-400 mr-2" />
                                <span className="text-white text-sm font-semibold">{phone || "N/A"}</span>
                            </a>

                            <button
                                type="button"
                                onClick={handleWhatsApp}
                                className="flex items-center justify-center bg-green-500 rounded-full p-2"
                            >
                                <i className="fab fa-whatsapp text-white" />
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-2 border-t border-gray-700 mt-auto">
                <button
                    type="button"
                    onClick={() => onViewDetails(student.id, phone)}
                    className="action-button bg-blue-800 bg-opacity-20 text-blue-400 hover:text-white hover:bg-[rgba(67,97,238,0.2)] rounded-bl-lg"
                >
                    <i className="fas fa-user-circle mr-2" /> Details
                </button>
                <button
                    type="button"
                    onClick={handlePayFees}
                    className="action-button bg-green-800 bg-opacity-20 text-green-400 hover:bg-[rgba(65,233,135,0.2)] hover:text-white rounded-br-lg"
                >
                    <i className="fa-solid fa-indian-rupee-sign mr-2" /> Pay Fees
                </button>
            </div>
        </div>
    );
}


export default React.memo(StudentCard);