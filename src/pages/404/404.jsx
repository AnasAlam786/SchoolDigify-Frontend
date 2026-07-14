import React from "react";
import { useNavigate } from "react-router-dom";

function NotAllowed404() {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen flex items-center justify-center px-6">
            <div className="relative w-full max-w-xl">
                {/* Glow */}
                <div className="absolute -inset-1 rounded-3xl blur-3xl"></div>

                {/* Card */}
                <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 backdrop-blur-2xl shadow-2xl">
                    {/* Top Gradient */}
                    <div className="h-2 bg-gradient-to-r from-red-500 via-pink-500 to-orange-500"></div>

                    <div className="p-10 text-center">
                        {/* Icon */}
                        <div className="mx-auto mb-8 flex h-24 w-24 items-center justify-center rounded-full bg-red-500/10 ring-1 ring-red-500/30">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-12 w-12 text-red-400"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                                strokeWidth={2}
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M12 11c1.657 0 3-1.343 3-3V6a3 3 0 10-6 0v2c0 1.657 1.343 3 3 3zm6 2H6a2 2 0 00-2 2v5a2 2 0 002 2h12a2 2 0 002-2v-5a2 2 0 00-2-2z"
                                />
                            </svg>
                        </div>

                        {/* Error Code */}
                        <h1 className="bg-gradient-to-r from-red-400 via-pink-400 to-orange-400 bg-clip-text text-7xl font-black text-transparent">
                            403
                        </h1>

                        {/* Title */}
                        <h2 className="mt-4 text-3xl font-bold text-white">
                            Permission Denied
                        </h2>

                        {/* Description */}
                        <p className="mx-auto mt-5 max-w-md leading-7 text-gray-400">
                            You don't have permission to access this page. If you
                            believe this is an error, please contact your school
                            administrator for the required access.
                        </p>

                        {/* Buttons */}
                        <div className="mt-10 flex flex-col justify-center gap-4 sm:flex-row">
                            <button
                                type="button"
                                onClick={() => navigate("/student_list")}
                                className="inline-flex items-center justify-center rounded-xl bg-gradient-to-r from-red-500 to-pink-500 px-6 py-3 font-semibold text-white shadow-lg shadow-red-500/20 transition duration-300 hover:scale-105 hover:shadow-red-500/40"
                            >
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="mr-2 h-5 w-5"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M3 12l2-2m0 0l7-7 7 7m-9 9V10m0 11H5a2 2 0 01-2-2v-7"
                                    />
                                </svg>

                                Go Home
                            </button>

                            <button
                                type="button"
                                onClick={() => navigate(-1)}
                                className="inline-flex items-center justify-center rounded-xl border border-white/10 bg-white/5 px-6 py-3 font-semibold text-gray-200 backdrop-blur-xl transition duration-300 hover:border-white/20 hover:bg-white/10"
                            >
                                ← Go Back
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default NotAllowed404;