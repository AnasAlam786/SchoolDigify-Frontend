import usePermission from "../hooks/usePermission";
import NotAllowed404 from "../pages/404/404";

export default function PermissionRoute({
    permission,
    permissions,
    children,
}) {
    const { hasPermission } = usePermission();

    const allowed = permissions
        ? permissions.some((requiredPermission) => hasPermission(requiredPermission))
        : hasPermission(permission);

    if (!allowed) {
        return <NotAllowed404 />;
    }

    return children;
}