// components/NavBar.jsx

import { useContext } from "react";
import { AuthContext } from "../auth/authProvider";

export default function NavBar({ setSidebarOpen }) {
    const { sessionData, loading } = useContext(AuthContext);

    if (loading) {
        return <div>Loading...</div>;
    }
   
    return (
        <>
            <div className="mobile-top-bar lg:hidden">
                <div className="flex items-center justify-between w-full">

                    {/* Left Side */}
                    <div className="flex items-center space-x-3">

                        <button
                            onClick={() => setSidebarOpen(true)}
                            className="text-gray-300 hover:text-white hover:bg-white/5 p-2 rounded-lg transition-all premium-glow"
                        >
                            <i className="fas fa-bars text-lg"></i>
                        </button>

                        <div className="flex items-center space-x-2">

                            {sessionData?.logo ? (
                                <img loading="lazy"
                                    src={sessionData.logo}
                                    alt="Logo"
                                    className="w-8 h-8 rounded-lg border border-gray-700 object-cover shadow-lg"
                                />
                            ) : (
                                <div className="bg-gradient-to-br from-primary to-info w-8 h-8 rounded-lg flex items-center justify-center shadow-lg">
                                    <i className="fas fa-graduation-cap text-white text-sm"></i>
                                </div>
                            )}

                            <div className="hidden sm:block">
                                <h1 className="text-white font-medium text-sm school-name max-w-[120px]">
                                    {sessionData?.school_name ?? "None"}
                                </h1>
                            </div>

                        </div>

                    </div>

                    {/* Right Side */}
                    <div className="flex items-center space-x-3">

                        <div className="hidden sm:block text-right">
                            <p className="text-white font-medium text-sm">
                                { sessionData?.user_name }
                            </p>

                            <p className="text-gray-400 text-xs">
                                { sessionData?.role }
                            </p>
                        </div>

                        <div className="relative">
                            <div className="user-avatar">
                                { ( sessionData?.user_name ).charAt(0).toUpperCase() }
                            </div>
                        </div>

                    </div>

                </div>
            </div>
        </>
    );
}