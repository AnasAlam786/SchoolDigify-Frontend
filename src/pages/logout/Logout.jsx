import { useContext, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../auth/authProvider.jsx";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

export default function Logout() {
    const { refreshSessionData } = useContext(AuthContext);
    const navigate = useNavigate();
    const [error, setError] = useState(null);

    const hasRun = useRef(false);

    useEffect(() => {
        if (hasRun.current) return;
        hasRun.current = true;

        const performLogout = async () => {
            try {
                const response = await fetch(`${API_URL}/logout`, {
                    method: "POST",
                    credentials: "include",
                });

                const data = await response.json().catch(() => ({}));

                if (!response.ok) {
                    throw new Error(
                        data.message || "Logout failed"
                    );
                }

                await refreshSessionData();

                navigate("/login", { replace: true });
            } catch (err) {
                setError(err.message || "Logout failed");
            }
        };

        performLogout();
    }, [navigate, refreshSessionData]);

    return (
        <div className="flex min-h-screen items-center justify-center bg-slate-950 text-white">
            <div className="rounded-2xl border border-white/10 bg-slate-900/80 p-8 shadow-xl">
                <h1 className="mb-4 text-2xl font-semibold">
                    Logging out...
                </h1>

                {error ? (
                    <p className="text-red-400">{error}</p>
                ) : (
                    <p>Please wait while we end your session.</p>
                )}
            </div>
        </div>
    );
}