import {
    FaUsers,
    FaChalkboard,
    FaUserShield,
    FaHeadset,
} from "react-icons/fa";

const StaffStats = ({
    totalStaff, teachersCount, administratorCount, helperStaffCount,
}) => {
    return (
        <div className="stats-grid grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-6 md:mb-8">
            {/* Total Staff */}
            <div className="staff-card p-4 md:p-5">
                <div className="flex justify-between items-center">
                    <div>
                        <p className="text-gray-400 text-sm md:text-base">
                            Total Staff
                        </p>

                        <h3 className="text-xl md:text-2xl font-bold text-white mt-1">
                            {totalStaff}
                        </h3>
                    </div>

                    <div className="bg-primary bg-opacity-20 p-2 md:p-3 rounded-lg">
                        <FaUsers className="text-primary text-lg md:text-xl" />
                    </div>
                </div>
            </div>

            {/* Teachers */}
            <div className="staff-card p-4 md:p-5">
                <div className="flex justify-between items-center">
                    <div>
                        <p className="text-gray-400 text-sm md:text-base">
                            Teachers
                        </p>

                        <h3 className="text-xl md:text-2xl font-bold text-white mt-1">
                            {teachersCount}
                        </h3>
                    </div>

                    <div className="bg-teacher bg-opacity-20 p-2 md:p-3 rounded-lg">
                        <FaChalkboard className="text-teacher text-lg md:text-xl" />
                    </div>
                </div>
            </div>

            {/* Administrators */}
            <div className="staff-card p-4 md:p-5">
                <div className="flex justify-between items-center">
                    <div>
                        <p className="text-gray-400 text-sm md:text-base">
                            Administrators
                        </p>

                        <h3 className="text-xl md:text-2xl font-bold text-white mt-1">
                            {administratorCount}
                        </h3>
                    </div>

                    <div className="bg-admin bg-opacity-20 p-2 md:p-3 rounded-lg">
                        <FaUserShield className="text-admin text-lg md:text-xl" />
                    </div>
                </div>
            </div>

            {/* Support Staff */}
            <div className="staff-card p-4 md:p-5">
                <div className="flex justify-between items-center">
                    <div>
                        <p className="text-gray-400 text-sm md:text-base">
                            Support Staff
                        </p>

                        <h3 className="text-xl md:text-2xl font-bold text-white mt-1">
                            {helperStaffCount}
                        </h3>
                    </div>

                    <div className="bg-support bg-opacity-20 p-2 md:p-3 rounded-lg">
                        <FaHeadset className="text-support text-lg md:text-xl" />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default StaffStats;