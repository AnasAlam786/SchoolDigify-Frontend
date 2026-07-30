import React from 'react'
import FormField from '../components/FormField';


function AdditionalInfo({ form, errors, handleInputChange, homeDistanceOptions }) {
    return (
        <div className="section-card gradient-border rounded-2xl p-4 sm:p-6 bg-gray-900/50 backdrop-blur-sm">
            <div className="flex items-center gap-3 sm:gap-4 mb-6 sm:mb-8">
                <div className="relative">
                    <div className="w-10 h-10 sm:w-14 sm:h-14 rounded-lg sm:rounded-xl bg-gradient-to-br from-emerald-600 to-teal-700 flex items-center justify-center shadow-lg">
                        <i className="fas fa-home text-white text-base sm:text-xl"></i>
                    </div>
                    <div className="absolute -top-1 -right-1 w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-emerald-500 border-2 border-gray-900 flex items-center justify-center">
                        <span className="text-xs font-bold text-white">4</span>
                    </div>
                </div>
                <div>
                    <h2 className="text-xl sm:text-2xl font-bold text-white">Address & Additional Information</h2>
                    <p className="text-gray-400 text-sm">Residential address and other details</p>
                </div>
            </div>

            <div className="space-y-6">
                <FormField id="ADDRESS" label="Home Address" required error={errors.ADDRESS}>
                    <div className="relative">
                        <textarea
                            id="ADDRESS"
                            name="ADDRESS"
                            value={form.ADDRESS}
                            onChange={(e) => handleInputChange("ADDRESS", e.target.value)}
                            rows={3}
                            placeholder="Enter complete home address"
                            className="w-full px-4 py-3 sm:py-3.5 bg-gray-800/70 border border-gray-700 rounded-lg sm:rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all duration-300 resize-none"
                        />
                        <div className="absolute right-3 top-3 text-gray-500">
                            <i className="fas fa-map-marker-alt"></i>
                        </div>
                    </div>
                </FormField>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4 sm:gap-6">
                    <FormField id="PIN" label="PIN Code" required error={errors.PIN}>
                        <div className="relative">
                            <input
                                type="number"
                                id="PIN"
                                name="PIN"
                                value={form.PIN}
                                onChange={(e) => handleInputChange("PIN", e.target.value)}
                                placeholder="6-digit PIN"
                                maxLength={6}
                                className="w-full px-4 py-3 sm:py-3.5 bg-gray-800/70 border border-gray-700 rounded-lg sm:rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all duration-300"
                            />
                            <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                                <i className="fas fa-map-pin"></i>
                            </div>
                        </div>
                    </FormField>

                    <FormField id="Home_Distance" label="Home Distance" error={errors.Home_Distance}>
                        <div className="relative">
                            <select
                                id="Home_Distance"
                                name="Home_Distance"
                                value={form.Home_Distance}
                                onChange={(e) => handleInputChange("Home_Distance", e.target.value)}
                                className="w-full px-4 py-3 sm:py-3.5 bg-gray-800/70 border border-gray-700 rounded-lg sm:rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all duration-300 appearance-none"
                            >
                                <option value="" className="bg-gray-800">Select Distance</option>
                                {homeDistanceOptions.map((option) => (
                                    <option key={option} value={option} className="bg-gray-800">{option}</option>
                                ))}
                            </select>
                        </div>
                    </FormField>
                </div>

                <div className="mt-4 pt-6 border-t border-gray-800">
                    <h3 className="text-base sm:text-lg font-semibold text-gray-300 mb-4">Previous School Information</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
                        <FormField id="Previous_School_Name" label="School Name" error={errors.Previous_School_Name}>
                            <div className="relative">
                                <input
                                    type="text"
                                    id="Previous_School_Name"
                                    name="Previous_School_Name"
                                    value={form.Previous_School_Name}
                                    onChange={(e) => handleInputChange("Previous_School_Name", e.target.value)}
                                    placeholder="Previous school name"
                                    onInput={(e) => {
                                        e.target.value = e.target.value
                                            .toLowerCase()
                                            .replace(/\b\w/g, c => c.toUpperCase());
                                    }}
                                    className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all duration-300"
                                />
                                <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                                    <i className="fas fa-school"></i>
                                </div>
                            </div>
                        </FormField>

                        <FormField id="Previous_School_Marks" label="Marks (%)" error={errors.Previous_School_Marks}>
                            <div className="relative">
                                <input
                                    type="number"
                                    id="Previous_School_Marks"
                                    name="Previous_School_Marks"
                                    value={form.Previous_School_Marks}
                                    onChange={(e) => handleInputChange("Previous_School_Marks", e.target.value)}
                                    placeholder="Percentage"
                                    className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all duration-300"
                                />
                                <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                                    <span className="text-sm">%</span>
                                </div>
                            </div>
                        </FormField>

                        <FormField id="Previous_School_Attendance" label="Attendance (days)" error={errors.Previous_School_Attendance}>
                            <div className="relative">
                                <input
                                    type="number"
                                    id="Previous_School_Attendance"
                                    name="Previous_School_Attendance"
                                    value={form.Previous_School_Attendance}
                                    onChange={(e) => handleInputChange("Previous_School_Attendance", e.target.value)}
                                    placeholder="Attendance"
                                    className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all duration-300"
                                />
                                <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                                    <i className="fas fa-clipboard-check"></i>
                                </div>
                            </div>
                        </FormField>
                    </div>
                </div>

                <div className="mt-6 pt-6 border-t border-gray-800">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 gap-4 mobile-section-header">
                        <div className="flex items-center gap-3 w-full sm:w-auto">
                            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-violet-600 to-purple-700 flex items-center justify-center flex-shrink-0">
                                <i className="fas fa-hand-holding-heart text-white"></i>
                            </div>
                            <div className="flex-1">
                                <h3 className="text-base sm:text-lg font-semibold text-white">RTE (Right to Education)</h3>
                                <p className="text-gray-400 text-xs sm:text-sm">Scholarship and financial aid information</p>
                            </div>
                        </div>
                        <label className="custom-checkbox flex items-center gap-3 cursor-pointer">
                            <input
                                type="checkbox"
                                id="is_RTE"
                                name="is_RTE"
                                checked={form.is_RTE}
                                onChange={(e) => handleInputChange("is_RTE", e.target.value)}
                                className="hidden"
                            />
                            <span className="checkmark"></span>
                            <span className="text-gray-300 text-sm sm:text-base">Student is under RTE?</span>
                        </label>
                    </div>

                    <div id="rteFields" className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mt-6 ${!form.is_RTE ? 'hidden' : ''}`}>
                        <div className="md:col-span-2 lg:col-span-3">
                            <h4 className="text-sm sm:text-md font-semibold text-violet-400 mb-4">Bank Account Details</h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                                <FormField id="registration_no" label="RTE Registration No" error={errors.registration_no}>
                                    <input
                                        type="number"
                                        id="registration_no"
                                        name="registration_no"
                                        value={form.registration_no}
                                        onChange={(e) => handleInputChange("registration_no", e.target.value)}
                                        placeholder="Reg. No (6 digits)"
                                        className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-violet-500/50 focus:border-violet-500 transition-all duration-300"
                                    />
                                </FormField>

                                <FormField id="account_number" label="Account Number" error={errors.account_number}>
                                    <input
                                        type="number"
                                        id="account_number"
                                        name="account_number"
                                        value={form.account_number}
                                        onChange={(e) => handleInputChange("account_number", e.target.value)}
                                        placeholder="Bank account number"
                                        className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-violet-500/50 focus:border-violet-500 transition-all duration-300"
                                    />
                                </FormField>

                                <FormField id="ifsc" label="IFSC Code" error={errors.ifsc}>
                                    <input
                                        type="text"
                                        id="ifsc"
                                        name="ifsc"
                                        value={form.ifsc}
                                        onChange={(e) => handleInputChange("ifsc", e.target.value.toUpperCase())}
                                        placeholder="IFSC code"
                                        className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-violet-500/50 focus:border-violet-500 transition-all duration-300"
                                    />
                                </FormField>

                                <FormField id="bank_name" label="Bank Name" error={errors.bank_name}>
                                    <input
                                        type="text"
                                        id="bank_name"
                                        name="bank_name"
                                        value={form.bank_name}
                                        onInput={(e) => {
                                            e.target.value = e.target.value
                                                .toLowerCase()
                                                .replace(/\b\w/g, c => c.toUpperCase());
                                        }}
                                        onChange={(e) => handleInputChange("bank_name", e.target.value)}
                                        placeholder="Bank name"
                                        className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-violet-500/50 focus:border-violet-500 transition-all duration-300"
                                    />
                                </FormField>

                                <FormField id="bank_branch" label="Bank Branch" error={errors.bank_branch}>
                                    <input
                                        type="text"
                                        id="bank_branch"
                                        name="bank_branch"
                                        value={form.bank_branch}
                                        onChange={(e) => handleInputChange("bank_branch", e.target.value)}
                                        placeholder="Branch name"
                                        className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-violet-500/50 focus:border-violet-500 transition-all duration-300"
                                    />
                                </FormField>

                                <FormField id="account_holder" label="Account Holder" error={errors.account_holder}>
                                    <input
                                        type="text"
                                        id="account_holder"
                                        name="account_holder"
                                        value={form.account_holder}
                                        onChange={(e) => handleInputChange("account_holder", e.target.value)}
                                        placeholder="Account holder name"
                                        className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-violet-500/50 focus:border-violet-500 transition-all duration-300"
                                    />
                                </FormField>

                                <FormField id="RTE_registered_year" label="RTE Registered Year" error={errors.RTE_registered_year}>
                                    <input
                                        type="number"
                                        id="RTE_registered_year"
                                        name="RTE_registered_year"
                                        value={form.RTE_registered_year}
                                        onChange={(e) => handleInputChange("RTE_registered_year", e.target.value)}
                                        placeholder="YYYY"
                                        className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-violet-500/50 focus:border-violet-500 transition-all duration-300"
                                    />
                                </FormField>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default AdditionalInfo
