import React from 'react'
import { useNavigate } from "react-router-dom";
import { printAdmissionForm } from '../../utils/printAdmissionForm';
import { sendMessage } from '../../utils/sendWhatsAppMessage';


function Header({ studentID }) {

    const navigate = useNavigate();

    return (
        <div className="relative z-10 p-6 md:p-8">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
                <div className="flex items-start gap-4 lg:gap-5">
                    <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center shadow-lg">
                        <i className="fas fa-user-plus text-white text-xl"></i>
                    </div>
                    <div className="flex flex-col gap-1">
                        <div className="flex items-center gap-3">
                            <h1 className="text-xl sm:text-2xl lg:text-3xl font-semibold text-white">Edit Student</h1>
                            <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-700/60 text-gray-200 border border-gray-600">Edit</span>
                        </div>
                        <p className="text-gray-400 text-sm max-w-xl">Update student information and details</p>
                    </div>
                </div>

                <div className="flex flex-col sm:flex-row lg:flex-row gap-3">

                    <button className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg bg-amber-600 hover:bg-amber-500 text-white text-sm font-medium transition"
                        onClick={() => printAdmissionForm(studentID)}>
                        <i className="fas fa-print"></i>
                        Print Form
                    </button>

                    <button className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg bg-green-600 hover:bg-green-500 text-white text-sm font-medium transition"
                        onClick={() => sendMessage(studentID)}>
                        <i className="fab fa-whatsapp"></i>
                        Send Message
                    </button>

                    <button
                        onClick={() => navigate(-1)}
                        className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg 
                        bg-gray-800 hover:bg-gray-700 border border-gray-700 text-gray-300 hover:text-white 
                        transition text-sm">
                        <i className="fas fa-arrow-left text-xs"></i>
                        Back to Students
                    </button>
                </div>
            </div>
        </div>
    )
}

export default Header
