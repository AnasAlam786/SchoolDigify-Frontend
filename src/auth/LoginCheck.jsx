import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "./authProvider.jsx";

export default function LoginCheck({ children }) {
    const { authenticated, loading } = useContext(AuthContext);

    if (loading) {
        return <div>Checking authentication...</div>;
    }

    if (authenticated) {
        return <Navigate to="/student_list" replace />;
    }

    return children;
}