import { Link } from "react-router-dom";
import usePermission from "../../hooks/usePermission";

function NoStudentsState({
    message = "No students found. Add students to get started",
}) {

    const { hasPermission, PERMISSIONS } = usePermission()
    return (
        <div className="flex flex-col items-center justify-center py-16 px-4 text-center glass-card rounded-2xl border border-white/5 m-0 sm:m-10">
            <div className="w-24 h-24 mb-6 rounded-full bg-gradient-to-br from-indigo-500/20 to-purple-500/20 flex items-center justify-center animate-gentle-bounce">
                <i className="fas fa-user-slash text-4xl text-indigo-300"></i>
            </div>

            <h3 className="text-2xl font-bold text-white mb-2">
                No students found
            </h3>

            <p className="text-gray-400 mb-8 max-w-md">
                {message}
            </p>
            
            {hasPermission(PERMISSIONS.ADMISSION) && (
                <Link
                    to="/admission"
                    className="inline-flex items-center gap-3 px-6 py-3 bg-gradient-to-r
                from-indigo-600 to-purple-600 hover:from-indigo-500
                hover:to-purple-500 text-white font-semibold rounded-xl
                transition-all duration-300 shadow-lg
                hover:shadow-indigo-500/30 transform hover:-translate-y-1"
                >
                    <i className="fas fa-plus-circle"></i>
                    <span>Add Student</span>
                    <i className="fas fa-arrow-right"></i>
                </Link>
            )}
        </div>
    );
}

function ErrorState({
    message = "An error occurred",
    onRetry = null,
}) {
    return (
        <div className="flex flex-col items-center justify-center py-16 px-4 text-center glass-card rounded-2xl border border-white/5">
            <div className="w-24 h-24 mb-6 rounded-full bg-gradient-to-br from-red-500/20 to-pink-500/20 flex items-center justify-center">
                <i className="fas fa-exclamation-triangle text-4xl text-red-300"></i>
            </div>

            <h3 className="text-2xl font-bold text-white mb-2">
                Something went wrong!
            </h3>

            <p className="text-gray-400 mb-4 max-w-md">
                {message}
            </p>

            <div className="flex gap-3">

                {onRetry && (
                    <button
                        onClick={onRetry}
                        className="inline-flex items-center gap-2 px-6 py-3 bg-red-600 hover:bg-red-500 text-white font-semibold rounded-xl transition"
                    >
                        Retry
                    </button>
                )}

                <button
                    onClick={() => window.location.reload()}
                    className="inline-flex items-center gap-2 px-6 py-3 bg-white/5 hover:bg-white/10 text-gray-200 font-semibold rounded-xl transition"
                >
                    Refresh
                </button>
            </div>
        </div>
    );
}

export { NoStudentsState, ErrorState };