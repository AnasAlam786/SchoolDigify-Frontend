import React from 'react'
import { apiGet } from '../../../api/api';
import usePermission from '../../../hooks/usePermission';

function Header() {

    const {hasPermission, PERMISSIONS} = usePermission()

    const handleDownloadPdf = async () => {
        try {
            const response = await apiGet("/api/get_students_pdf_api");
            if (!response.ok) {
                throw new Error("Failed to fetch PDF.");
            }
            const data = await response.json();
            const htmlContent = data.html;
            const newWindow = window.open();
            if (!newWindow) {
                alert("Pop-up blocked! Please allow pop-ups.");
                return;
            }
            newWindow.document.write(htmlContent);
            newWindow.document.close();
        } catch (err) {
            console.error(err);
            alert("Failed to download PDF.");
        }
    };

    return (
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-6 gap-4">
            <div>
                <h1 className="text-2xl md:text-3xl font-bold text-white">Student Management</h1>
                <p className="text-gray-400 mt-1 md:mt-2 text-sm md:text-base">Manage all students and their information</p>
            </div>

            <div className="flex flex-col md:flex-row gap-3 mt-4 md:mt-0 w-full lg:w-auto">

                {hasPermission(PERMISSIONS.ADMISSION) && 
                (<button
                    type="button"
                    onClick={() => (window.location.href = "/admission")}
                    className="bg-gradient-to-r from-blue-500 to-indigo-700 text-white px-6 py-3 rounded-xl font-medium flex items-center justify-center"
                >
                    <i className="fas fa-plus mr-2" /> Add New Student
                </button>)}

                {hasPermission(PERMISSIONS.EXPORT_STUDENT_DATA) &&
                (<button
                    type="button"
                    onClick={handleDownloadPdf}
                    className="bg-gradient-to-r from-green-500 to-emerald-700 text-white px-6 py-3 rounded-xl font-medium flex items-center justify-center"
                >
                    <i className="fas fa-file-download mr-2" /> Students Data PDF
                </button>)}
            </div>
        </div>
    )
}

export default Header
