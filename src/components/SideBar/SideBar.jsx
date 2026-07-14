// components/Sidebar.jsx

import { NavLink } from "react-router-dom";
import { AuthContext } from "../../auth/authProvider";
import { useContext, useState } from "react";
import { apiPost } from "../../api/api";
import usePermission from "../../hooks/usePermission";

export default function Sidebar({ isSidebarOpen, setSidebarOpen, menuSections }) {

    const { hasPermission } = usePermission();

    const { sessionData, loading, setSessionData } = useContext(AuthContext);
    const [changeSessionLoading, setChangeSessionLoading] = useState(false);



    if (loading) {
        return <div>Loading...</div>;
    }

    const visibleSections = menuSections
        .map(section => ({
            ...section,
            items: section.items.filter(item => hasPermission(item.permissionName)
            ),
        }))
        .filter(section => section.items.length > 0);

    const changeSession = async (sessionYear) => {
        if (!sessionData) return;

        try {
            setChangeSessionLoading(true);
            const response = await apiPost(`/api/change_session`, { year: sessionYear })

            const data = await response.json();

            if (response.ok) {
                setSessionData((prev) => ({
                    ...prev, session: sessionYear,
                }));

                showAlert(response.status, data.message);
                setTimeout(() => {
                    window.location.reload();
                }, 700);
            } else {
                showAlert(response.status, data.error);
                console.error(data.error);
            }
        } catch (error) {
            showAlert(500, "Some error occurred!");
            console.error(error);
        } finally {
            setChangeSessionLoading(false);
        }
    };

    const schoolName = sessionData?.school_name;
    const userName = sessionData?.user_name;
    const userRole = sessionData?.role;
    const userInitial = userName.charAt(0).toUpperCase();
    const schoolLogo = sessionData?.logo;
    const selectedSession = sessionData?.session_id;     //Session selected by user in the sidebar dropdown
    const currentSession = sessionData?.current_running_session;
    const allSessions = sessionData?.all_sessions;

    console.log("Sidebar auth:", sessionData);

    return (
        <>
            {/* Drawer Overlay */}
            {isSidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-40 lg:hidden"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            {/* Sidebar */}
            <div className={`
                sidebar-container glass-effect h-full z-50 transform transition-transform duration-300 
                ease-in-out lg:relative lg:translate-x-0 lg:flex-shrink-0
                ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}
            `}>

                {/* Header */}
                <div className="p-5 border-b border-white/5">

                    <div className="flex items-center space-x-3 mb-4">

                        {schoolLogo ? (
                            <div className="relative">
                                <img loading="lazy"
                                    src={schoolLogo}
                                    alt="Logo"
                                    className="w-12 h-12 rounded-xl border-2 border-primary/30 object-cover shadow-lg"
                                />

                                <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-gray-900"></div>
                            </div>
                        ) : (
                            <div className="relative">
                                <div className="bg-gradient-to-br from-primary to-accent w-12 h-12 rounded-xl flex items-center justify-center shadow-lg">
                                    <i className="fas fa-graduation-cap text-white text-xl"></i>
                                </div>

                                <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-gray-900"></div>
                            </div>
                        )}

                        <div className="flex-1 min-w-0">
                            <h1 className="text-white font-bold text-base school-name">
                                {schoolName}
                            </h1>
                            <div className="flex items-center space-x-2 mt-2">
                                <span className="session-badge">
                                    <i className="fas fa-calendar-alt"></i>{" "}
                                    {selectedSession}-{Number(selectedSession) + 1}
                                </span>
                                {selectedSession === currentSession && (
                                    <span className="text-xs bg-green-500/20 text-green-400 px-1 py-1 rounded-full border border-green-500/30">
                                        Current
                                    </span>
                                )}
                            </div>
                        </div>

                    </div>

                    {/* User Card */}
                    <div className="user-card p-3">

                        <div className="flex items-center space-x-3">

                            <div className="user-avatar">

                                {sessionData?.user?.image ? (
                                    <img loading="lazy"
                                        src={sessionData.user.image}
                                        alt="User"
                                        style={{ borderRadius: "25%" }}
                                    />
                                ) : (
                                    userInitial
                                )}

                            </div>

                            <div className="flex-1 min-w-0">

                                <p className="text-white font-medium text-sm truncate">
                                    {userName}
                                </p>

                                <p className="text-gray-400 text-xs flex items-center gap-1">
                                    <i className="fas fa-shield-alt"></i>
                                    {userRole}
                                </p>

                            </div>

                            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>

                        </div>

                    </div>

                </div>

                {/* Navigation */}
                <div className="p-4">

                    <nav className="space-y-1">

                        {visibleSections.map((section) => (
                            <div key={section.title} className="pt-6">

                                <h3 className="section-header mb-3">
                                    {section.title}
                                </h3>

                                <div className="space-y-1">

                                    {section.items.map((item) => (
                                        <NavLink

                                            onClick={() => setSidebarOpen(false)}
                                            key={item.route}
                                            to={item.route}
                                            className={({ isActive }) =>
                                                `nav-link flex items-center p-3 rounded-xl transition-all ${isActive
                                                    ? "bg-gradient-to-r from-primary/20 to-accent/20 border border-primary/30 text-white"
                                                    : "text-gray-300 hover:bg-white/5 hover:text-white"
                                                }`
                                            }
                                        >
                                            <div className="icon-container">
                                                <i className={item.icon}></i>
                                            </div>

                                            <span className="font-medium">
                                                {item.label}
                                            </span>
                                        </NavLink>
                                    ))}

                                </div>

                            </div>
                        ))}

                    </nav>

                </div>

                {/* Footer */}
                <div className="mt-auto p-5 border-t border-white/5">

                    {hasPermission('change_session') && (

                        <div className="mb-4">

                            <label className="block text-xs font-medium text-gray-400 mb-2 flex items-center gap-2">

                                <div className="w-6 h-6 rounded-lg bg-primary/10 flex items-center justify-center">
                                    <i className="fas fa-calendar-alt text-primary text-xs"></i>
                                </div>

                                Switch Session

                            </label>

                            <div className="relative">

                                <select
                                    className="w-full bg-[#111111] text-gray-300 py-2.5 px-4 rounded-lg border border-white/10"
                                    onChange={(e) => changeSession(e.target.value)}
                                    value={selectedSession} >
                                    {allSessions.map((year) => (
                                        <option key={year} value={year}>
                                            {year} - {year + 1}
                                            {year === currentSession ? " (Current)" : ""}
                                        </option>
                                    ))}
                                </select>

                            </div>

                        </div>
                    )}

                    <NavLink
                        to="/logout"
                        className="flex items-center justify-center w-full py-3 bg-gradient-to-r from-danger to-red-600 text-white rounded-xl"
                    >
                        <i className="fas fa-sign-out-alt mr-2"></i>
                        Logout
                    </NavLink>

                </div>

            </div>
        </>
    );
}