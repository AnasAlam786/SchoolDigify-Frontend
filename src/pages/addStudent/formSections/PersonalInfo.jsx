import React from 'react'
import FormField from '../components/FormField';

function PersonalInfo({
    form, setForm, handleInputChange, handleAadharChange, errors,
    bloodGroupOptions, religionOptions, casteTypeOptions, genderOptions
}) {

    const calculateAge = () => {

        const dob = form.DOB
        if (!dob || dob.length !== 10) return null;

        const [dayStr, monthStr, yearStr] = dob.split('-');
        const day = parseInt(dayStr, 10);
        const month = parseInt(monthStr, 10);
        const year = parseInt(yearStr, 10);

        if (isNaN(day) || isNaN(month) || isNaN(year)) return null;

        // Validate actual calendar dates (e.g., prevent 31-02-2023)
        const birthDate = new Date(year, month - 1, day);
        if (
            birthDate.getFullYear() !== year ||
            birthDate.getMonth() !== month - 1 ||
            birthDate.getDate() !== day
        ) {
            return null;
        }

        const today = new Date();
        let age = today.getFullYear() - birthDate.getFullYear();
        const monthDiff = today.getMonth() - birthDate.getMonth();

        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
            age--;
        }

        return age >= 0 ? age : null;
    };




    return (
        <div className="section-card gradient-border rounded-2xl p-4 sm:p-6 bg-gray-900/50 backdrop-blur-sm">
            <div className="flex items-center gap-3 sm:gap-4 mb-6 sm:mb-8">
                <div className="relative">
                    <div className="w-10 h-10 sm:w-14 sm:h-14 rounded-lg sm:rounded-xl bg-gradient-to-br from-indigo-600 to-purple-700 flex items-center justify-center shadow-lg">
                        <i className="fas fa-user text-white text-base sm:text-xl"></i>
                    </div>
                    <div className="absolute -top-1 -right-1 w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-indigo-500 border-2 border-gray-900 flex items-center justify-center">
                        <span className="text-xs font-bold text-white">1</span>
                    </div>
                </div>
                <div>
                    <h2 className="text-xl sm:text-2xl font-bold text-white">Personal Information</h2>
                    <p className="text-gray-400 text-sm">Basic details and personal information</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                <FormField id="STUDENTS_NAME" label="Student's Name" required error={errors.STUDENTS_NAME}>
                    <div className="relative">
                        <input
                            type="text"
                            id="STUDENTS_NAME"
                            name="STUDENTS_NAME"
                            value={form.STUDENTS_NAME}
                            onChange={(e) => handleInputChange("STUDENTS_NAME", e.target.value)}
                            placeholder="Enter full name"
                            onInput={(e) => {
                                e.target.value = e.target.value
                                    .toLowerCase()
                                    .replace(/\b\w/g, c => c.toUpperCase());
                            }}
                            className="w-full px-4 py-3 sm:py-3.5 bg-gray-800/70 border border-gray-700 rounded-lg sm:rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all duration-300"
                        />
                        <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                            <i className="fas fa-user"></i>
                        </div>
                    </div>
                </FormField>

                <FormField id="DOB" label="Date of Birth" required error={errors.DOB}>
                    <div className="relative">
                        <input
                            type="text"
                            id="DOB"
                            name="DOB"
                            value={form.DOB}
                            onChange={(event) => {
                                let value = event.target.value.replace(/\D/g, '').slice(0, 8);

                                if (value.length >= 5) {
                                    value = `${value.slice(0, 2)}-${value.slice(2, 4)}-${value.slice(4)}`
                                } else if (value.length >= 3) {
                                    value = `${value.slice(0, 2)}-${value.slice(2)}`
                                };
                                setForm((state) => ({
                                    ...state,
                                    DOB: value,
                                }));
                            }}
                            placeholder="DD-MM-YYYY"
                            className="w-full px-4 py-3 sm:py-3.5 bg-gray-800/70 border border-gray-700 rounded-lg sm:rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all duration-300"
                        />
                        <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                            <i className="fas fa-calendar"></i>
                        </div>
                    </div>
                    {form.DOB && (
                        <div className="text-sm text-gray-400 mt-1">
                            Age: {calculateAge()} years
                        </div>
                    )}
                </FormField>

                <FormField id="GENDER" label="Gender" required error={errors.GENDER}>
                    <div className="relative">
                        <select
                            id="GENDER"
                            name="GENDER"
                            value={form.GENDER}
                            onChange={(e) => handleInputChange("GENDER", e.target.value)}
                            className="w-full px-4 py-3 sm:py-3.5 bg-gray-800/70 border border-gray-700 rounded-lg sm:rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all duration-300 appearance-none"
                        >
                            <option value="" className="bg-gray-800">Select Gender</option>
                            {genderOptions.map((option) => (
                                <option key={option} value={option} className="bg-gray-800">{option}</option>
                            ))}
                        </select>
                        <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
                            <i className="fas fa-chevron-down text-gray-500"></i>
                        </div>
                    </div>
                </FormField>

                <FormField id="AADHAAR" label="Aadhar Number" error={errors.AADHAAR}>
                    <div className="relative">
                        <input
                            type="text"
                            id="AADHAAR"
                            name="AADHAAR"
                            value={form.AADHAAR}
                            onChange={handleAadharChange('AADHAAR')}
                            placeholder="XXXX XXXX XXXX"
                            maxLength={14}
                            className="w-full px-4 py-3 sm:py-3.5 bg-gray-800/70 border border-gray-700 rounded-lg sm:rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all duration-300"
                        />
                        <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                            <i className="fas fa-id-card"></i>
                        </div>
                    </div>
                </FormField>

                <FormField id="Caste" label="Student's Caste" error={errors.Caste}>
                    <div className="relative">
                        <input
                            type="text"
                            id="Caste"
                            name="Caste"
                            value={form.Caste}
                            onChange={(e) => handleInputChange("Caste", e.target.value)}
                            placeholder="Enter caste"
                            onInput={(e) => {
                                e.target.value = e.target.value
                                    .toLowerCase()
                                    .replace(/\b\w/g, c => c.toUpperCase());
                            }}
                            className="w-full px-4 py-3 sm:py-3.5 bg-gray-800/70 border border-gray-700 rounded-lg sm:rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all duration-300"
                        />
                        <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                            <i className="fas fa-users"></i>
                        </div>
                    </div>
                </FormField>

                <FormField id="Caste_Type" label="Caste Type" required error={errors.Caste_Type}>
                    <div className="relative">
                        <select
                            id="Caste_Type"
                            name="Caste_Type"
                            value={form.Caste_Type}
                            onChange={(e) => handleInputChange("Caste_Type", e.target.value)}
                            className="w-full px-4 py-3 sm:py-3.5 bg-gray-800/70 border border-gray-700 rounded-lg sm:rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all duration-300 appearance-none"
                        >
                            <option value="" className="bg-gray-800">Select Caste Type</option>
                            {casteTypeOptions.map((option) => (
                                <option key={option} value={option} className="bg-gray-800">{option}</option>
                            ))}
                        </select>
                        <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
                            <i className="fas fa-chevron-down text-gray-500"></i>
                        </div>
                    </div>
                </FormField>

                <FormField id="RELIGION" label="Religion" required error={errors.RELIGION}>
                    <div className="relative">
                        <select
                            id="RELIGION"
                            name="RELIGION"
                            value={form.RELIGION}
                            onChange={(e) => handleInputChange("RELIGION", e.target.value)}
                            className="w-full px-4 py-3 sm:py-3.5 bg-gray-800/70 border border-gray-700 rounded-lg sm:rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all duration-300 appearance-none"
                        >
                            <option value="" className="bg-gray-800">Select Religion</option>
                            {religionOptions.map((option) => (
                                <option key={option} value={option} className="bg-gray-800">{option}</option>
                            ))}
                        </select>
                        <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
                            <i className="fas fa-chevron-down text-gray-500"></i>
                        </div>
                    </div>
                </FormField>

                <FormField id="Height" label="Height (cm)" error={errors.Height}>
                    <div className="relative">
                        <input
                            type="number"
                            id="Height"
                            name="Height"
                            value={form.Height}
                            onChange={(e) => handleInputChange("Height", e.target.value)}
                            placeholder="Enter height"
                            className="w-full px-4 py-3 sm:py-3.5 bg-gray-800/70 border border-gray-700 rounded-lg sm:rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all duration-300"
                        />
                        <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                            <span className="text-sm">cm</span>
                        </div>
                    </div>
                </FormField>

                <FormField id="Weight" label="Weight (kg)" error={errors.Weight}>
                    <div className="relative">
                        <input
                            type="number"
                            id="Weight"
                            name="Weight"
                            value={form.Weight}
                            onChange={(e) => handleInputChange("Weight", e.target.value)}
                            placeholder="Enter weight"
                            className="w-full px-4 py-3 sm:py-3.5 bg-gray-800/70 border border-gray-700 rounded-lg sm:rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all duration-300"
                        />
                        <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                            <span className="text-sm">kg</span>
                        </div>
                    </div>
                </FormField>

                <FormField id="BLOOD_GROUP" label="Blood Group" error={errors.BLOOD_GROUP}>
                    <div className="relative">
                        <select
                            id="BLOOD_GROUP"
                            name="BLOOD_GROUP"
                            value={form.BLOOD_GROUP}
                            onChange={(e) => handleInputChange("BLOOD_GROUP", e.target.value)}
                            className="w-full px-4 py-3 sm:py-3.5 bg-gray-800/70 border border-gray-700 rounded-lg sm:rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all duration-300 appearance-none"
                        >
                            <option value="" className="bg-gray-800">Select Blood Group</option>
                            {bloodGroupOptions.map((option) => (
                                <option key={option} value={option} className="bg-gray-800">{option}</option>
                            ))}
                        </select>
                        <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
                            <i className="fas fa-tint text-gray-500"></i>
                        </div>
                    </div>
                </FormField>
            </div>
        </div>
    )
}

export default PersonalInfo
