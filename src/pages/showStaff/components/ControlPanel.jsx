import { FaSearch, FaChevronDown } from "react-icons/fa";

const ControlPanel = ({
    searchValue, setSearchValue,
    roleFilter, setRoleFilter,
}) => {
    return (
        <div className="flex flex-col gap-3 mb-6 md:mb-10">
            {/* Search Box */}
            <div className="search-box p-3 rounded-lg md:rounded-xl">
                <div className="flex items-center">
                    <FaSearch className="text-gray-500 mr-3" />

                    <input
                        type="text"
                        placeholder="Search staff by name or email....."
                        value={searchValue}
                        onChange={(e) => setSearchValue(e.target.value)}
                        className="w-full bg-transparent border-0 text-white focus:outline-none text-sm md:text-base"
                    />
                </div>
            </div>

            {/* Role Filter */}
            <div className="relative">
                <select
                    value={roleFilter}
                    onChange={(e) => setRoleFilter(e.target.value)}
                    className="custom-select w-full p-3 rounded-lg md:rounded-xl appearance-none cursor-pointer text-gray-400 text-sm md:text-base"
                >
                    <option value="">All Roles</option>
                    <option value="Administrators">Administrators</option>
                    <option value="Teacher">Teacher</option>
                    <option value="Support">Support</option>
                </select>

                <FaChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
            </div>
        </div>
    );
};

export default ControlPanel;