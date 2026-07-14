import React, { useState } from "react";
import DetailCard from "./DetailCard";

function RTEDetails({ student }) {
    const [open, setOpen] = useState(false);

    return (
        <div className="bg-gray-800/30 rounded-xl border border-gray-700/30 overflow-hidden
                        hover:border-emerald-500/30 transition-all duration-300">

            {/* HEADER */}
            <button
                type="button"
                onClick={() => setOpen(prev => !prev)}
                className="w-full flex items-center justify-between p-4 hover:bg-gray-700/20 
                           transition-all duration-200"
            >
                <div className="flex items-center gap-3 flex-1 min-w-0">

                    <div className="relative">
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500/20 to-green-500/20 flex items-center justify-center">
                            <i className="fas fa-university text-emerald-400 text-lg"></i>
                        </div>

                        {/* <!-- RTE Badge Indicator --> */}
                        {student.is_RTE && (
                            <div className="absolute -top-1 -right-1 w-5 h-5 bg-gradient-to-r from-emerald-500 to-green-500 rounded-full flex items-center justify-center border border-gray-800">
                                <i className="fas fa-check text-xs text-white" />
                            </div>
                        )}
                    </div>

                    <div className="text-left min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                            <h3 className="text-lg font-semibold text-white truncate">
                                Financial & RTE Details
                            </h3>

                            {student.is_RTE ? (
                                <span className="px-2 py-1 bg-gradient-to-r from-emerald-500/30 to-green-500/30 text-emerald-300 text-xs font-medium rounded-full whitespace-nowrap">
                                    RTE Student
                                </span>
                            ) : (
                                <span className="px-2 py-1 bg-gradient-to-r from-gray-600/30 to-gray-700/30 text-gray-400 text-xs font-medium rounded-full whitespace-nowrap">
                                    Non-RTE
                                </span>
                            )}
                        </div>

                        <div className="flex items-center justify-between">
                            {/* Left side */}
                            <div className="flex items-center gap-1">
                                <i
                                    className={`fas fa-credit-card ${student.account_number ? "text-emerald-400" : "text-gray-500"
                                        } text-xs`}
                                />

                                <span
                                    className={`text-sm ${student.account_number ? "text-gray-300" : "text-gray-500"
                                        }`}
                                >
                                    {student.account_number ? "Bank Details Available" : "No Bank Details"}
                                </span>
                            </div>

                            {/* Right side */}
                            <div className="flex items-center gap-2 text-gray-400">
                                <i
                                    className={`fas fa-chevron-down text-xs transition-transform duration-300 ${open ? "rotate-180" : ""
                                        }`}
                                />
                                <span className="text-xs">
                                    Click to {open ? "collapse" : "expand"}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </button>

            {/* COLLAPSIBLE CONTENT */}
            <div
                className="transition-all duration-300 ease-in-out overflow-hidden"
                style={{
                    maxHeight: open ? "1000px" : "0px",
                    opacity: open ? 1 : 0,
                }} >
                <div className="border-t border-gray-700/30">

                    {/* RTE Info */}
                    <div className="p-4">
                        <div className="flex items-center gap-2 mb-3">
                            <div className="w-1.5 h-4 bg-emerald-500 rounded-full"></div>
                            <h4 className="text-sm font-semibold text-white">RTE Information</h4>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            <DetailCard
                                icon={student.is_RTE ? 'fas fa-check-circle' : 'fas fa-times-circle'}
                                label="RTE Status"
                                value={student.is_RTE ? 'RTE Student' : 'Non-RTE Student'}
                                color={student.is_RTE ? 'green' : 'gray'}
                                fillColour={student.is_RTE ? 'green' : 'gray'}
                            />

                            <DetailCard
                                icon={student.RTE_registered_year ? 'fas fa-calendar-check' : 'fas fa-calendar-times'}
                                label="RTE Session Year"
                                value={student.RTE_registered_year || 'Not Registered'}
                                color={student.RTE_registered_year ? 'blue' : 'gray'}
                                fillColour={student.RTE_registered_year ? 'blue' : 'gray'}
                            />
                        </div>
                    </div>

                    {/* Bank Details */}
                    <div className="p-4 pt-0">
                        <div className="flex items-center gap-2 mb-3">
                            <div className="w-1.5 h-4 bg-cyan-500 rounded-full"></div>
                            <h4 className="text-sm font-semibold text-white">Bank Account Details</h4>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            <DetailCard icon="fas fa-hashtag" label="RTE Registration No"
                                value={student.registration_no} color="cyan" />

                            <DetailCard icon="fas fa-credit-card" label="Account Number"
                                value={student.account_number} color="emerald" />

                            <DetailCard icon="fas fa-code" label="IFSC Code"
                                value={student.ifsc} color="blue" />

                            <DetailCard icon="fas fa-university" label="Bank Name"
                                value={student.bank_name} color="purple" />

                            <DetailCard icon="fas fa-map-marker-alt" label="Bank Branch"
                                value={student.bank_branch} color="yellow" />

                            <DetailCard icon="fas fa-user-circle" label="Account Holder"
                                value={student.account_holder} color="pink" />
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}

export default RTEDetails;