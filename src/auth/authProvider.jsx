
import {
    createContext, useCallback,
    useEffect, useMemo, useState,
} from "react";

export const AuthContext = createContext({
    sessionData: null,
    setSessionData: () => {},
    authenticated: false,
    loading: true,
    refreshSessionData: async () => { },
});

export default function AuthProvider({ children }) {
    const [sessionData, setSessionData] = useState(null);
    const [loading, setLoading] = useState(true);

    const loadSessionData = useCallback(async () => {
        setLoading(true);

        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/api/me`, {
                credentials: "include",
            });

            const data = await response.json().catch(() => ({}));

            if (!response.ok) {
                throw new Error(data.error || "Something went wrong, Try again!"); 
            }
            setSessionData(data.sessionData ?? data);
            
        } catch (error) {
            // showAlert(400, error )
            console.error("Authentication check failed:", error);
            setSessionData(null);
        } finally {
            setLoading(false);
        }
    }, []);

    // initial load
    useEffect(() => {
        loadSessionData();
    }, [loadSessionData]);

    // refresh function
    const refreshSessionData = useCallback(async () => {
        await loadSessionData();
    }, [loadSessionData]);

    const value = useMemo(
        () => ({
            sessionData,
            setSessionData,
            authenticated: !!sessionData,
            loading,
            refreshSessionData,
        }),
        [sessionData, loading, refreshSessionData]
    );

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
}