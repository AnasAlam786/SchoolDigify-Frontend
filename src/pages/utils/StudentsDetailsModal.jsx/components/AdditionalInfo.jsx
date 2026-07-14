import React from 'react'

function AdditionalInfo({ student }) {
    return (
        <div className="space-y-4">
            <div className="pt-4 border-t border-gray-700/30">
                <h4 className="text-sm font-semibold text-gray-300 mb-4 flex items-center gap-2">
                    <i className="fas fa-info-circle text-blue-400"></i>
                    Additional Information
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* <!-- Student ID --> */}
                    <div className="flex justify-between md:block">
                        <span className="text-gray-400 text-sm">Student ID: </span>
                        <span className="text-white text-sm font-medium">{student.id || "N/A"}</span>
                    </div>

                    <div className="flex justify-between md:block">
                        <span className="text-gray-400 text-sm">Previous School: </span>
                        <span className="text-white text-sm font-medium">{student.Previous_School_Name || "N/A"}</span>
                    </div>

                    <div className="flex justify-between md:block">
                        <span className="text-gray-400 text-sm">Previous School Marks: </span>
                        <span className="text-white text-sm font-medium">{student.Previous_School_Marks || "N/A"}</span>
                    </div>

                    <div className="flex justify-between md:block">
                        <span className="text-gray-400 text-sm">Previous School Attendance: </span>
                        <span className="text-white text-sm font-medium">{student.Previous_School_Attendance || "N/A"}</span>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default AdditionalInfo
