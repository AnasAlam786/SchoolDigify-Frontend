import React, { useState, useEffect } from 'react';
import FormField from '../components/FormField';
import { apiPost } from '../../../api/api';

function AcedamicInfo({ form, setForm, classes, studentID, errors, sessionYears, hasOtherSessions, handleInputChange, getClassName }) {


    const [rollText, setRollText] = useState('');
    const [original] = useState({
        ROLL: form.ROLL,
        class_id: form.class_id,
        SR: form.SR,
        ADMISSION_NO: form.ADMISSION_NO
    });

    const fetchAvailableRolls = async (classId) => {
        console.log("Sending class:", classId);
        if (!form.class_id) {
            setRollText("Available rolls will appear after selecting class.");
            return;
        }
        setRollText("Loading...")
        try {
            const response = await apiPost("/api/get-available-rolls", { class_id: classId, excluded_student_id: studentID })

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || "Failed to fetch rolls");
            }

            const rolls = data.available_rolls;

            setRollText(`Available rolls: ${rolls.join(", ")}`);

            // Optionally auto-fill the roll field
            setForm((prev) => ({
                ...prev,
                ROLL: rolls.at(-1),
            }));

        } catch (error) {
            console.error(error);
            showAlert(400, error);
            setRollText("Error fetching available rolls.");
        }
    };


    // Custom handler for class_id that syncs admission_class_id when new admission
    const handleClassChange = (e) => {
        const classId = e.target.value;

        handleInputChange("class_id", classId);

        if (form.admitted_as_new) {
            handleInputChange("admission_class_id", classId);
        }

        fetchAvailableRolls(classId);
    };

    const getClassSuggestion = (dobString) => {
        // 1. Validate format & presence
        if (!dobString || dobString.length !== 10) {
            return null
        }

        const [dayStr, monthStr, yearStr] = dobString.split('-');
        const day = parseInt(dayStr, 10);
        const month = parseInt(monthStr, 10);
        const year = parseInt(yearStr, 10);

        if (isNaN(day) || isNaN(month) || isNaN(year)) {
            return 'Enter valid DOB to get class suggestion!';
        }

        // 2. Validate calendar integrity (e.g., prevents invalid dates like 31-02-2024)
        const birthDate = new Date(year, month - 1, day);
        if (
            birthDate.getFullYear() !== year ||
            birthDate.getMonth() !== month - 1 ||
            birthDate.getDate() !== day
        ) {
            return 'Enter valid DOB to get class suggestion!';
        }

        // 3. Calculate exact age
        const today = new Date();
        let age = today.getFullYear() - birthDate.getFullYear();
        const monthDiff = today.getMonth() - birthDate.getMonth();

        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
            age--;
        }

        // 4. Return appropriate class suggestion
        if (age < 3) return 'Too young for admission';
        if (age > 17) return 'Suggested class: Above 12th';

        const classMap = {
            3: 'Nursery or Pre-Nursery',
            4: 'Nursery', 5: 'LKG',
            6: 'UKG', 7: '1st', 8: '2nd',
            9: '3rd', 10: '4th',
            11: '5th', 12: '6th',
            13: '7th', 14: '8th',
            15: '9th', 16: '10th', 17: '11th',
        };

        return classMap[age] ? `Suggested class: ${classMap[age]}` : 'Age not suitable';
    };

    return (
        <div className="section-card gradient-border rounded-2xl p-4 sm:p-6 bg-gray-900/50 backdrop-blur-sm">
            <div className="flex items-center gap-3 sm:gap-4 mb-6 sm:mb-8">
                <div className="relative">
                    <div className="w-10 h-10 sm:w-14 sm:h-14 rounded-lg sm:rounded-xl bg-gradient-to-br from-blue-600 to-cyan-700 flex items-center justify-center shadow-lg">
                        <i className="fas fa-graduation-cap text-white text-base sm:text-xl"></i>
                    </div>
                    <div className="absolute -top-1 -right-1 w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-blue-500 border-2 border-gray-900 flex items-center justify-center">
                        <span className="text-xs font-bold text-white">2</span>
                    </div>
                </div>
                <div>
                    <h2 className="text-xl sm:text-2xl font-bold text-white">Academic Details</h2>
                    <p className="text-gray-400 text-sm">Academic and enrollment information</p>
                </div>
            </div>

            {!hasOtherSessions && (
                <>
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-300 mb-4 required">Student Status</label>
                        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                            <label className="cursor-pointer flex-1">
                                <input
                                    type="radio"
                                    name="admitted_as_new"
                                    // value="new"
                                    checked={form.admitted_as_new === true}
                                    onChange={() => setForm((state) => ({
                                        ...state,
                                        admitted_as_new: true,
                                        admission_session_id: sessionYears.length > 0 ? sessionYears[0].id : state.admission_session_id,
                                        class_id: state.admission_class_id // initial sync
                                    }))}
                                    className="peer hidden"
                                />
                                <div className="peer-checked:bg-gradient-to-r peer-checked:from-blue-600/20 peer-checked:to-cyan-600/20 peer-checked:border-blue-500/50 peer-checked:text-blue-400 p-4 sm:p-5 rounded-xl border-2 border-gray-800 hover:border-gray-700 transition-all duration-300">
                                    <div className="flex flex-col sm:flex-row items-center justify-center sm:justify-start gap-3 mb-2 sm:mb-3">
                                        <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-gradient-to-br from-blue-500 to-cyan-600 flex items-center justify-center">
                                            <i className="fas fa-user-plus text-white text-sm sm:text-lg"></i>
                                        </div>
                                        <div className="text-center sm:text-left">
                                            <div className="font-semibold text-white mb-1 text-sm sm:text-base">New Admission</div>
                                            <p className="text-xs sm:text-sm text-gray-400">First time enrollment</p>
                                        </div>
                                    </div>
                                </div>
                            </label>

                            <label className="cursor-pointer flex-1">
                                <input
                                    type="radio"
                                    name="admitted_as_new"
                                    // value="old"
                                    checked={form.admitted_as_new === false}
                                    onChange={() => setForm((state) => ({ ...state, admitted_as_new: false }))}
                                    className="peer hidden"
                                />
                                <div className="peer-checked:bg-gradient-to-r peer-checked:from-emerald-600/20 peer-checked:to-green-600/20 peer-checked:border-emerald-500/50 peer-checked:text-emerald-400 p-4 sm:p-5 rounded-xl border-2 border-gray-800 hover:border-gray-700 transition-all duration-300">
                                    <div className="flex flex-col sm:flex-row items-center justify-center sm:justify-start gap-3 mb-2 sm:mb-3">
                                        <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-gradient-to-br from-emerald-500 to-green-600 flex items-center justify-center">
                                            <i className="fas fa-user-graduate text-white text-sm sm:text-lg"></i>
                                        </div>
                                        <div className="text-center sm:text-left">
                                            <div className="font-semibold text-white mb-1 text-sm sm:text-base">Continuing Student</div>
                                            <p className="text-xs sm:text-sm text-gray-400">Previously enrolled</p>
                                        </div>
                                    </div>
                                </div>
                            </label>
                        </div>
                    </div>

                    <div className="mb-4 p-4 rounded-xl border border-gray-800 bg-gradient-to-r from-gray-900/40 to-gray-900/10 text-xs sm:text-sm text-gray-300 leading-relaxed">
                        <div>
                            <span className="font-semibold text-blue-400">New Admission:</span>
                            <ul className="list-disc ml-5 space-y-1 text-gray-400">
                                <li>For students joining your school for the first time.</li>
                                <li><span className="text-white">Admission Class</span> and <span className="text-white">Current Class</span> will be the same.</li>
                                <li><span className="text-white">Admission Session</span> will be set to the current session automatically.</li>
                                <li>You cannot change the admission session.</li>
                            </ul>
                        </div>
                        <div className="mt-2">
                            <span className="font-semibold text-emerald-400">Continuing Student:</span>
                            <ul className="list-disc ml-5 space-y-1 text-gray-400">
                                <li>For students who studied in previous years and are being added now.</li>
                                <li>You can select <span className="text-white">Admission Session</span>, <span className="text-white">Admission Class</span>, and <span className="text-white">Current Class</span> separately.</li>
                            </ul>
                        </div>
                    </div>

                </>

            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                <FormField id="admission_session_id" label="Admission Session" required error={errors.admission_session_id}>
                    <div className="relative">
                        <select
                            id="admission_session_id"
                            value={form.admission_session_id || ""}
                            onChange={(e) => handleInputChange("admission_session_id", e.target.value)}
                            disabled={form.admitted_as_new}
                            className="w-full px-4 py-3 sm:py-3.5 bg-gray-800/70 border border-gray-700 rounded-lg sm:rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all duration-300 appearance-none"
                        >
                            <option value="" className="bg-gray-800">Select Session</option>
                            {sessionYears.map((option) => (
                                <option key={option.id} value={option.id} className="bg-gray-800">
                                    {option.label}
                                </option>
                            ))}
                        </select>
                        <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
                            <i className="fas fa-calendar-alt text-gray-500"></i>
                        </div>
                    </div>
                </FormField>

                <FormField id="admission_class_id" label="Admission Class" required error={errors.admission_class_id}>
                    <div className="relative">
                        <select
                            id="admission_class_id"
                            name="admission_class_id"
                            value={form.admission_class_id}
                            onChange={(e) => handleInputChange("admission_class_id", e.target.value)}
                            disabled={form.admitted_as_new}
                            className="w-full px-4 py-3 sm:py-3.5 bg-gray-800/70 border border-gray-700 rounded-lg sm:rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all duration-300 appearance-none"
                        >
                            <option value="" className="bg-gray-800">Select Class</option>
                            {classes.map((option) => (
                                <option key={option.id} value={option.id} className="bg-gray-800">{option.class_name}</option>
                            ))}
                        </select>
                        <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
                            <i className="fas fa-chalkboard-teacher text-gray-500"></i>
                        </div>
                    </div>
                </FormField>

                <FormField id="class_id" label="Current Class" required error={errors.class_id}
                    labelHint={
                        form.class_id !== original.class_id ? `Original: ${getClassName(original.class_id)}` : null
                    }>
                    <div className="relative">
                        <select
                            id="class_id"
                            name="class_id"
                            disabled={hasOtherSessions}
                            value={form.class_id}
                            onChange={handleClassChange}
                            className="w-full px-4 py-3 sm:py-3.5 bg-gray-800/70 border border-gray-700 rounded-lg sm:rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all duration-300 appearance-none"
                        >
                            <option value="" className="bg-gray-800">Select Class</option>
                            {classes.map((option) => (
                                <option key={option.id} value={option.id} className="bg-gray-800">{option.class_name}</option>
                            ))}
                        </select>
                        <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
                            <i className="fas fa-school text-gray-500"></i>
                        </div>
                    </div>

                    {hasOtherSessions && (
                        <p className="text-xs text-red-400">
                            You can change the class from Promotions page.
                        </p>
                    )}

                    {form.DOB?.length === 10 && (
                        <div className="class-suggestion text-sm text-blue-400 mt-1">
                            {getClassSuggestion(form.DOB)}
                        </div>
                    )}

                </FormField>

                <FormField id="ROLL" label="Roll No" required error={errors.ROLL}
                    labelHint={
                        form.ROLL !== original.ROLL ? `Original: ${original.ROLL}` : null
                    }>
                    <div className="relative">
                        <input
                            type="number"
                            id="ROLL"
                            name="ROLL"
                            value={form.ROLL}
                            onChange={(e) => handleInputChange("ROLL", e.target.value)}
                            placeholder="Enter roll number"
                            className="w-full px-4 py-3 sm:py-3.5 bg-gray-800/70 border border-gray-700 rounded-lg sm:rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all duration-300"
                        />
                        <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                            <i className="fas fa-hashtag"></i>
                        </div>
                    </div>
                    <div id="rollHint" className="text-sm text-gray-500 mt-2">
                        {rollText}
                    </div>
                </FormField>

                <FormField id="SR" label="SR No." required error={errors.SR}
                    labelHint={
                        form.SR !== original.SR ? `Original: ${original.SR}` : null
                    }>
                    <div className="relative">
                        <input
                            type="number"
                            id="SR"
                            name="SR"
                            value={form.SR}
                            onChange={(e) => handleInputChange("SR", e.target.value)}
                            placeholder="Enter SR number"
                            className="w-full px-4 py-3 sm:py-3.5 bg-gray-800/70 border border-gray-700 rounded-lg sm:rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all duration-300"
                        />
                        <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                            <i className="fas fa-file-alt"></i>
                        </div>
                    </div>
                </FormField>

                <FormField id="ADMISSION_NO" label="Admission No." required error={errors.ADMISSION_NO}
                    labelHint={
                        form.ADMISSION_NO !== original.ADMISSION_NO ? `Original: ${original.ADMISSION_NO}` : null
                    }>
                    <div className="relative">
                        <input
                            type="number"
                            id="ADMISSION_NO"
                            name="ADMISSION_NO"
                            value={form.ADMISSION_NO}
                            onChange={(e) => handleInputChange("ADMISSION_NO", e.target.value)}
                            placeholder="Enter admission number"
                            className="w-full px-4 py-3 sm:py-3.5 bg-gray-800/70 border border-gray-700 rounded-lg sm:rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all duration-300"
                        />
                        <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                            <i className="fas fa-id-badge"></i>
                        </div>
                    </div>
                </FormField>

                <FormField id="ADMISSION_DATE" label="Admission Date" required error={errors.ADMISSION_DATE}>
                    <div className="relative">
                        <input
                            type="text"
                            id="ADMISSION_DATE"
                            name="ADMISSION_DATE"
                            value={form.ADMISSION_DATE}
                            onChange={(e) => {
                                let value = e.target.value.replace(/\D/g, "").slice(0, 8);

                                if (value.length >= 5) {
                                    value = `${value.slice(0, 2)}-${value.slice(2, 4)}-${value.slice(4)}`;
                                } else if (value.length >= 3) {
                                    value = `${value.slice(0, 2)}-${value.slice(2)}`;
                                }

                                handleInputChange("ADMISSION_DATE", value);
                            }}
                            placeholder="DD-MM-YYYY"
                            className="w-full px-4 py-3 sm:py-3.5 bg-gray-800/70 border border-gray-700 rounded-lg sm:rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all duration-300"
                        />
                        <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                            <i className="fas fa-calendar-check"></i>
                        </div>
                    </div>
                </FormField>

                <FormField id="PEN" label="PEN No." error={errors.PEN}>
                    <div className="relative">
                        <input
                            type="number"
                            id="PEN"
                            name="PEN"
                            value={form.PEN}
                            onChange={(e) => handleInputChange("PEN", e.target.value)}
                            placeholder="Enter PEN number"
                            maxLength={11}
                            className="w-full px-4 py-3 sm:py-3.5 bg-gray-800/70 border border-gray-700 rounded-lg sm:rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all duration-300"
                        />
                        <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                            <i className="fas fa-passport"></i>
                        </div>
                    </div>
                </FormField>

                <FormField id="APAAR" label="APAAR No." error={errors.APAAR}>
                    <div className="relative">
                        <input
                            type="number"
                            id="APAAR"
                            name="APAAR"
                            value={form.APAAR}
                            onChange={(e) => handleInputChange("APAAR", e.target.value)}
                            placeholder="Enter APAAR number"
                            maxLength={12}
                            className="w-full px-4 py-3 sm:py-3.5 bg-gray-800/70 border border-gray-700 rounded-lg sm:rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all duration-300"
                        />
                        <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                            <i className="fas fa-qrcode"></i>
                        </div>
                    </div>
                </FormField>
            </div>
        </div>
    );
}

export default AcedamicInfo;