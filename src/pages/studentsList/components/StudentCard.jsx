import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { sendWhatsAppMessage } from "../../utils/sendWhatsAppMessage";
import boyImage from "../../../assets/no-student-boy-image.png";
import girlImage from "../../../assets/no-student-girl-image.png";
import { printAdmissionForm } from '../../utils/printAdmissionForm';
import usePermission from "../../../hooks/usePermission";
import ImageUploader from "../../utils/ImageUploader/ImageUploader.jsx";
import { apiPostFormData } from "../../../api/api";



import { Eye, Edit, Phone, MessageCircle, UserCircle, IndianRupee, Printer } from 'lucide-react';

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

function StudentCard({ student, onViewDetails, onPayFees, onImageUpdated }) {

    const { hasPermission, PERMISSIONS } = usePermission()

    const navigate = useNavigate();
    const phone = normalizePhone(student.PHONE);
    const imageUrl = getImageUrl(student);

    const [showImageUploadModal, setShowImageUploadModal] = useState(false);
    const [imagePreview, setImagePreview] = useState("");
    const [selectedImageFile, setSelectedImageFile] = useState(null);
    const [isUploadingPhoto, setIsUploadingPhoto] = useState(false);

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

    const handleImageSelection = (nextImage) => {
        if (nextImage instanceof Blob) {
            setSelectedImageFile(nextImage);
            setImagePreview(URL.createObjectURL(nextImage));
            return;
        }

        if (typeof nextImage === "string") {
            setSelectedImageFile(null);
            setImagePreview(nextImage);
        }
    };

    const handleStudentImageUpload = async (file) => {
        if (!(file instanceof Blob)) return;

        setIsUploadingPhoto(true);

        try {
            const formData = new FormData();
            formData.append("student_id", Number(student.id));
            formData.append("image_file", file, "student_image.jpg");

            const response = await apiPostFormData("/api/update_student_image", formData);
            const data = await response.json();

            if (!response.ok) {
                throw new Error(data?.error || data?.message || "Failed to upload student image.");
            }

            const nextImageId = data?.image_id ||  student.IMAGE;

            if (typeof onImageUpdated === "function") {
                onImageUpdated(student.id, nextImageId);
            }

            setShowImageUploadModal(false);
            setImagePreview("");
            setSelectedImageFile(null);
        } catch (err) {
            showAlert(400, err.message || "Failed to upload student image.");
        } finally {
            setIsUploadingPhoto(false);
        }
    };

    return (
        <>
        <div className="student-card overflow-vissible">
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
                        className="relative group p-1.5 hover:bg-gray-700 rounded-full"
                        onClick={() => printAdmissionForm(student.id)}
                    >
                        <Printer className="text-amber-400" size={18} />
                        <span className="absolute right-1/2 translate-x-1/2 -top-7 hidden group-hover:block bg-black text-white text-xs px-2 py-1 rounded shadow-lg whitespace-nowrap z-10">
                            Print Admission Form
                        </span>
                    </button>

                    {hasPermission(PERMISSIONS.UPDATE_STUDENT) && (

                        <button
                            type="button"
                            onClick={() => navigate(`/edit_student/${student.id}`)}
                            className="relative group p-1.5 hover:bg-gray-700 rounded-full"
                        >
                            <Edit className="text-green-400" size={18} />
                            <span className="absolute right-1/2 translate-x-1/2 -top-7 hidden group-hover:block bg-black text-white text-xs px-2 py-1 rounded shadow-lg whitespace-nowrap z-10">
                                Edit Student
                            </span>
                        </button>
                    )}
                </div>
            </div>

            <div className="p-4">
                <div className="flex items-start">
                    <div className="relative mr-4 flex-shrink-0">
                        <img
                            src={imageUrl}
                            alt="Student"
                            onClick={() => {
                                if (!student.IMAGE) {
                                    setImagePreview("");
                                    setShowImageUploadModal(true);
                                }
                            }}
                            className={`student-image w-20 h-20 object-cover border-2 border-gray-700 shadow-lg ${!student.IMAGE ? "cursor-pointer" : ""}`}
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
                                <Phone className="text-blue-400 mr-2" size={16} />
                                <span className="text-white text-sm font-semibold">{phone || "N/A"}</span>
                            </a>

                            <button
                                type="button"
                                onClick={handleWhatsApp}
                                className="flex items-center justify-center bg-green-500 rounded-full p-2"
                            >
                                <MessageCircle className="text-white" size={18} />
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
                    <UserCircle className="mr-2 inline-block" size={18} /> Details
                </button>


                <button
                    type="button"
                    onClick={handlePayFees}
                    className="action-button bg-green-800 bg-opacity-20 text-green-400 hover:bg-[rgba(65,233,135,0.2)] hover:text-white rounded-br-lg"
                >
                    <IndianRupee className="mr-2 inline-block" size={16} />
                    {hasPermission(PERMISSIONS.PAY_FEES) ? "Pay Fees" : "View Fees"}
                </button>
            </div>
        </div>

        {showImageUploadModal && (
            <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/70 p-4">
                <div className="w-full max-w-xl rounded-2xl border border-gray-700 bg-[#111827] p-4 shadow-2xl">
                    <div className="mb-4 flex items-center justify-between">
                        <h3 className="text-lg font-semibold text-white">Upload Student Photo</h3>
                        <button
                            type="button"
                            onClick={() => setShowImageUploadModal(false)}
                            disabled={isUploadingPhoto}
                            className={`rounded-full border px-2 py-1 text-sm ${
                                isUploadingPhoto
                                    ? "cursor-not-allowed border-gray-700 text-gray-500"
                                    : "border-gray-600 text-gray-200 hover:bg-gray-800"
                            }`}
                        >
                            Close
                        </button>
                    </div>

                    <ImageUploader
                        image={imagePreview}
                        setImage={handleImageSelection}
                        showSaveButton={true}
                        saveButtonText={isUploadingPhoto ? "Uploading..." : "Upload Image"}
                        saveDisabled={!selectedImageFile || isUploadingPhoto}
                        onSave={() => handleStudentImageUpload(selectedImageFile)}
                    />
                </div>
            </div>
        )}
        </>
    );
}


export default React.memo(StudentCard);