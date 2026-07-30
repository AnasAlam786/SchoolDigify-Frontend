import React from 'react'
import { useNavigate } from "react-router-dom";


function Header() {
  const navigate = useNavigate();


    return (
        <div className="flex flex-col md:flex-row justify-between items-center mb-6 md:mb-8">
            <div className="mb-4 md:mb-0">
                <h1 className="text-2xl md:text-3xl font-bold text-white">Staff Management</h1>
                <p className="text-gray-400 mt-1 md:mt-2 text-sm md:text-base">Manage all staff members and their profiles</p>
            </div>
            <div className="mt-4 md:mt-0">
                <button onClick={() => navigate("/add_staff")} className="bg-gradient-to-r from-blue-500 to-indigo-700 text-white px-6 py-3 rounded-xl font-medium flex items-center">
                    <i className="fas fa-plus mr-2"></i>Add Staff
                </button>
            </div>
        </div>
    )
}

export default Header
