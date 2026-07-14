import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "./authProvider";

export default function LoginRequired({ children }) {
    const { authenticated, loading } = useContext(AuthContext);

    if (loading) {
        return <div>Checking authentication...</div>;
    }

    if (!authenticated) {
        return <Navigate to="/login" replace />;
    }

    return children;
}