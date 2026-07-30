import React from 'react'
import FormField from '../components/FormField';


function GuardianInfo({
    form, errors, educationOptions, fatherOccupationOptions,
    motherOccupationOptions, handleInputChange, handleAadharChange
}) {
    return (

        <div className="section-card gradient-border rounded-2xl p-4 sm:p-6 bg-gray-900/50 backdrop-blur-sm">
            <div className="flex items-center gap-3 sm:gap-4 mb-6 sm:mb-8">
                <div className="relative">
                    <div className="w-10 h-10 sm:w-14 sm:h-14 rounded-lg sm:rounded-xl bg-gradient-to-br from-amber-600 to-orange-700 flex items-center justify-center shadow-lg">
                        <i className="fas fa-users text-white text-base sm:text-xl"></i>
                    </div>
                    <div className="absolute -top-1 -right-1 w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-amber-500 border-2 border-gray-900 flex items-center justify-center">
                        <span className="text-xs font-bold text-white">3</span>
                    </div>
                </div>
                <div>
                    <h2 className="text-xl sm:text-2xl font-bold text-white">Guardian Information</h2>
                    <p className="text-gray-400 text-sm">Parent or guardian details</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                <div className="lg:col-span-1 md:col-span-2">
                    <div className="p-4 rounded-xl bg-gray-800/30 border border-gray-800">
                        <h3 className="text-base sm:text-lg font-semibold text-amber-400 mb-4 flex items-center gap-2">
                            <i className="fas fa-male"></i>
                            Father Details
                        </h3>
                        <div className="space-y-4">
                            <FormField id="FATHERS_NAME" label="Name" required error={errors.FATHERS_NAME}>
                                <div className="relative">
                                    <input
                                        type="text"
                                        id="FATHERS_NAME"
                                        name="FATHERS_NAME"
                                        value={form.FATHERS_NAME}
                                        onChange={(e) => handleInputChange("FATHERS_NAME", e.target.value)}
                                        placeholder="Father's name"
                                        onInput={(e) => {
                                            e.target.value = e.target.value
                                                .toLowerCase()
                                                .replace(/\b\w/g, c => c.toUpperCase());
                                        }}
                                        className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500 transition-all duration-300"
                                    />
                                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                                        <i className="fas fa-user-tie"></i>
                                    </div>
                                </div>
                            </FormField>

                            <FormField id="FATHERS_AADHAR" label="Aadhar Number" error={errors.FATHERS_AADHAR}>
                                <div className="relative">
                                    <input
                                        type="text"
                                        id="FATHERS_AADHAR"
                                        name="FATHERS_AADHAR"
                                        value={form.FATHERS_AADHAR}
                                        onChange={(e) => handleInputChange("FATHERS_AADHAR", e.target.value)}
                                        placeholder="XXXX XXXX XXXX"
                                        maxLength={14}
                                        className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500 transition-all duration-300"
                                    />
                                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                                        <i className="fas fa-fingerprint"></i>
                                    </div>
                                </div>
                            </FormField>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <FormField id="FATHERS_EDUCATION" label="Qualification" error={errors.FATHERS_EDUCATION}>
                                    <select
                                        id="FATHERS_EDUCATION"
                                        name="FATHERS_EDUCATION"
                                        value={form.FATHERS_EDUCATION}
                                        onChange={(e) => handleInputChange("FATHERS_EDUCATION", e.target.value)}
                                        className="w-full px-3 py-2.5 bg-gray-800/50 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500 transition-all duration-300 text-sm"
                                    >
                                        <option value="" className="bg-gray-800">Select</option>
                                        {educationOptions.map((option) => (
                                            <option key={option} value={option} className="bg-gray-800">{option}</option>
                                        ))}
                                    </select>
                                </FormField>

                                <FormField id="FATHERS_OCCUPATION" label="Occupation" error={errors.FATHERS_OCCUPATION}>
                                    <select
                                        id="FATHERS_OCCUPATION"
                                        name="FATHERS_OCCUPATION"
                                        value={form.FATHERS_OCCUPATION}
                                        onChange={(e) => handleInputChange("FATHERS_OCCUPATION", e.target.value)}
                                        className="w-full px-3 py-2.5 bg-gray-800/50 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500 transition-all duration-300 text-sm"
                                    >
                                        <option value="" className="bg-gray-800">Select</option>
                                        {fatherOccupationOptions.map((option) => (
                                            <option key={option} value={option} className="bg-gray-800">{option}</option>
                                        ))}
                                    </select>
                                </FormField>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="lg:col-span-1 md:col-span-2">
                    <div className="p-4 rounded-xl bg-gray-800/30 border border-gray-800">
                        <h3 className="text-base sm:text-lg font-semibold text-pink-400 mb-4 flex items-center gap-2">
                            <i className="fas fa-female"></i>
                            Mother Details
                        </h3>
                        <div className="space-y-4">
                            <FormField id="MOTHERS_NAME" label="Name" required error={errors.MOTHERS_NAME}>
                                <div className="relative">
                                    <input
                                        type="text"
                                        id="MOTHERS_NAME"
                                        name="MOTHERS_NAME"
                                        value={form.MOTHERS_NAME}
                                        onChange={(e) => handleInputChange("MOTHERS_NAME", e.target.value)}
                                        placeholder="Mother's name"
                                        onInput={(e) => {
                                            e.target.value = e.target.value
                                                .toLowerCase()
                                                .replace(/\b\w/g, c => c.toUpperCase());
                                        }}
                                        className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-pink-500/50 focus:border-pink-500 transition-all duration-300"
                                    />
                                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                                        <i className="fas fa-female"></i>
                                    </div>
                                </div>
                            </FormField>

                            <FormField id="MOTHERS_AADHAR" label="Aadhar Number" error={errors.MOTHERS_AADHAR}>
                                <div className="relative">
                                    <input
                                        type="text"
                                        id="MOTHERS_AADHAR"
                                        name="MOTHERS_AADHAR"
                                        value={form.MOTHERS_AADHAR}
                                        onChange={(e) => handleInputChange("MOTHERS_AADHAR", e.target.value)}
                                        placeholder="XXXX XXXX XXXX"
                                        maxLength={14}
                                        className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-pink-500/50 focus:border-pink-500 transition-all duration-300"
                                    />
                                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                                        <i className="fas fa-fingerprint"></i>
                                    </div>
                                </div>
                            </FormField>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <FormField id="MOTHERS_EDUCATION" label="Qualification" error={errors.MOTHERS_EDUCATION}>
                                    <select
                                        id="MOTHERS_EDUCATION"
                                        name="MOTHERS_EDUCATION"
                                        value={form.MOTHERS_EDUCATION}
                                        onChange={(e) => handleInputChange("MOTHERS_EDUCATION", e.target.value)}
                                        className="w-full px-3 py-2.5 bg-gray-800/50 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-pink-500/50 focus:border-pink-500 transition-all duration-300 text-sm"
                                    >
                                        <option value="" className="bg-gray-800">Select</option>
                                        {educationOptions.map((option) => (
                                            <option key={option} value={option} className="bg-gray-800">{option}</option>
                                        ))}
                                    </select>
                                </FormField>

                                <FormField id="MOTHERS_OCCUPATION" label="Occupation" error={errors.MOTHERS_OCCUPATION}>
                                    <select
                                        id="MOTHERS_OCCUPATION"
                                        name="MOTHERS_OCCUPATION"
                                        value={form.MOTHERS_OCCUPATION}
                                        onChange={(e) => handleInputChange("MOTHERS_OCCUPATION", e.target.value)}
                                        className="w-full px-3 py-2.5 bg-gray-800/50 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-pink-500/50 focus:border-pink-500 transition-all duration-300 text-sm"
                                    >
                                        <option value="" className="bg-gray-800">Select</option>
                                        {motherOccupationOptions.map((option) => (
                                            <option key={option} value={option} className="bg-gray-800">{option}</option>
                                        ))}
                                    </select>
                                </FormField>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="lg:col-span-1 md:col-span-2">
                    <div className="p-4 rounded-xl bg-gray-800/30 border border-gray-800">
                        <h3 className="text-base sm:text-lg font-semibold text-emerald-400 mb-4 flex items-center gap-2">
                            <i className="fas fa-phone"></i>
                            Contact Details
                        </h3>
                        <div className="space-y-4">
                            <FormField id="PHONE" label="Phone Number" required error={errors.PHONE}>
                                <div className="relative">
                                    <input
                                        type="tel"
                                        id="PHONE"
                                        name="PHONE"
                                        value={form.PHONE}
                                        onChange={(e) => handleInputChange("PHONE", e.target.value)}
                                        placeholder="10-digit mobile number"
                                        maxLength={10}
                                        className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all duration-300"
                                    />
                                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                                        <i className="fas fa-mobile-alt"></i>
                                    </div>
                                </div>
                            </FormField>

                            <FormField id="ALT_MOBILE" label="Alternate Mobile" error={errors.ALT_MOBILE}>
                                <div className="relative">
                                    <input
                                        type="tel"
                                        id="ALT_MOBILE"
                                        name="ALT_MOBILE"
                                        value={form.ALT_MOBILE}
                                        onChange={(e) => handleInputChange("ALT_MOBILE", e.target.value)}
                                        placeholder="Alternate mobile number"
                                        maxLength={10}
                                        className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all duration-300"
                                    />
                                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                                        <i className="fas fa-phone-alt"></i>
                                    </div>
                                </div>
                            </FormField>

                            <FormField id="EMAIL" label="Email ID" error={errors.EMAIL}>
                                <div className="relative">
                                    <input
                                        type="email"
                                        id="EMAIL"
                                        name="EMAIL"
                                        value={form.EMAIL}
                                        onChange={(e) => handleInputChange("EMAIL", e.target.value)}
                                        placeholder="Email address"
                                        className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all duration-300"
                                    />
                                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                                        <i className="fas fa-envelope"></i>
                                    </div>
                                </div>
                            </FormField>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default GuardianInfo
