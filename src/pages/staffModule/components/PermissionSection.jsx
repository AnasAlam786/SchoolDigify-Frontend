import React, { useMemo } from "react";

function PermissionSection({
    formData,
    selectedPermissions = [],
    handleOpenPermissionModal,
    isPermissionsLoading,
}) {

    return (
        <div className="form-section bg-gray-dark/70 backdrop-blur-md rounded-xl p-6 mb-6 shadow-section">
            {/* Main Section Header */}
            <div className="section-header flex items-center mb-6 pb-4 border-b border-gray-800">
                <div className="section-icon w-10 h-10 bg-primary/15 rounded-lg flex items-center justify-center mr-4 text-primary">
                    <i className="fas fa-shield-alt text-lg" />
                </div>
                <div>
                    <h2 className="section-title text-[1.4rem] font-semibold text-white">
                        Permissions
                    </h2>
                </div>
            </div>

            <div className="form-content">
                {/* 1. LOADING STATE */}
                {isPermissionsLoading ? (
                    <div className="space-y-6">
                        <div className="text-center">
                            <div className="h-8 w-64 mx-auto bg-gray-700 rounded animate-pulse mb-3" />
                            <div className="h-10 w-44 mx-auto bg-gray-700 rounded-xl animate-pulse mb-4" />
                            <div className="h-4 w-96 max-w-full mx-auto bg-gray-700 rounded animate-pulse" />
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                            {[...Array(8)].map((_, index) => (
                                <div
                                    key={index}
                                    className="rounded-2xl p-5 bg-gradient-to-br from-gray-800 to-gray-900 border border-gray-700 animate-pulse"
                                >
                                    <div className="flex items-center gap-3 mb-4">
                                        <div className="w-10 h-10 rounded-xl bg-gray-700" />
                                        <div className="flex-1">
                                            <div className="h-4 w-28 bg-gray-700 rounded mb-2" />
                                            <div className="h-3 w-20 bg-gray-700 rounded" />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <div className="h-3 bg-gray-700 rounded" />
                                        <div className="h-3 bg-gray-700 rounded w-5/6" />
                                        <div className="h-3 bg-gray-700 rounded w-2/3" />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                ) : !formData.role_id ? (
                    /* 2. NO ROLE SELECTED STATE */
                    <div className="flex flex-col items-center justify-center text-center rounded-2xl border border-dashed border-gray-700 bg-[#1A1A1A] p-10 shadow-inner">
                        <div className="flex items-center justify-center w-16 h-16 mb-5 rounded-full bg-indigo-500/10 text-indigo-400">
                            <i className="fas fa-user-shield text-2xl" />
                        </div>

                        <h3 className="text-lg font-semibold text-gray-100 mb-2">
                            No Role Selected
                        </h3>
                        <p className="text-gray-400 max-w-sm leading-relaxed mb-6 text-sm">
                            Please select a role to automatically load its default permissions.
                            Once selected, assigned permissions will appear here.
                        </p>

                        <button
                            type="button"
                            onClick={() =>
                                document
                                    .querySelector('[name="role_id"]')
                                    ?.scrollIntoView({ behavior: "smooth", block: "center" })
                            }
                            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-medium transition-all duration-300 shadow-md hover:shadow-lg"
                        >
                            <i className="fas fa-arrow-up text-sm" />
                            Select a Role
                        </button>
                    </div>
                ) : (
                    /* 3. HAS ROLE (WITH OR WITHOUT PERMISSIONS) */
                    <>
                        {/* Header Controls */}
                        <div className="text-center mb-8">
                            <h2 className="text-2xl font-semibold text-blue-400 mb-3">
                                Permissions & Features
                            </h2>

                            <button
                                type="button"
                                onClick={handleOpenPermissionModal}
                                className="px-5 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white transition-colors duration-200 shadow-md hover:shadow-blue-500/20"
                            >
                                <i className="fas fa-pen-to-square mr-2" />
                                Manage Permissions
                            </button>

                            <p className="text-gray-400 mt-4 max-w-2xl mx-auto text-sm">
                                These permissions will be assigned to this staff member.
                            </p>
                        </div>

                        {/* Empty State vs Permission Cards Grid */}
                        {selectedPermissions.length === 0 ? (
                            <div className="flex flex-col items-center justify-center text-center py-16 bg-[#1A1A1A] rounded-2xl border border-dashed border-gray-700 shadow-inner">
                                <div className="h-20 w-20 rounded-full bg-blue-600/20 flex items-center justify-center mb-5 shadow-lg shadow-blue-600/10">
                                    <i className="fa-solid fa-lock-open text-blue-400 text-3xl" />
                                </div>
                                <h3 className="text-xl font-semibold text-blue-400 mb-2">
                                    No Permissions Assigned
                                </h3>
                                <p className="text-gray-400 text-sm max-w-md mb-5">
                                    This role doesn’t currently have any permissions or features
                                    assigned. Try assigning permissions using the "Manage Permissions"
                                    button above.
                                </p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                                {selectedPermissions.map((perm) => (
                                    <div
                                        key={perm.id}
                                        className="group rounded-2xl p-5 bg-gradient-to-br from-gray-800 to-gray-900 border border-gray-700 hover:border-blue-500 hover:shadow-lg hover:shadow-blue-500/20 transition-all duration-300 hover:-translate-y-1"
                                    >
                                        <div className="flex items-center gap-3 mb-4">
                                            <div className="w-11 h-11 rounded-xl bg-blue-600/20 text-blue-400 group-hover:bg-blue-600 group-hover:text-white flex items-center justify-center transition-colors duration-300 shrink-0">
                                                <i className={perm.icon || "fa-solid fa-key"} />
                                            </div>

                                            <h3 className="font-semibold text-blue-400 line-clamp-1">
                                                {perm.title}
                                            </h3>
                                        </div>

                                        <p className="text-sm text-gray-400 line-clamp-3">
                                            {perm.description || "No description provided."}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
}

export default PermissionSection;