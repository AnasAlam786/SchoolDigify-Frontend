import React, { useState } from 'react';
import { apiPost } from '../../../../api/api';

function CreatePaperModal({ setCreateModalOpen }) {
    const [formData, setFormData] = useState({
        event: '',
        subject: '',
        class_name: '',
        marks: '',
        duration: ''
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleCreatePaper = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const response = await apiPost('/question-papers/api/create', {
                event: formData.event,
                subject: formData.subject,
                class_name: formData.class_name,
                marks: Number(formData.marks),
                duration: formData.duration
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Failed to create paper.');
            }

            // Redirect to editor using returned URL
            if (data.redirect) {
                window.location.href = data.redirect;
            }
        } catch (err) {
            setError(err.message);
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-navbg border border-gray-700 rounded-2xl shadow-2xl max-w-md w-full transform transition-all duration-300">
                <div className="bg-gradient-to-r from-primary/20 to-secondary/20 border-b border-gray-700 px-6 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-primary/20 rounded-lg">
                            <i className="fas fa-plus text-primary" />
                        </div>
                        <h2 className="text-xl font-bold text-white">Create New Paper</h2>
                    </div>
                    <button
                        type="button"
                        onClick={() => setCreateModalOpen(false)}
                        className="text-gray-400 hover:text-white transition transform hover:rotate-90 duration-300"
                        disabled={loading}
                    >
                        <i className="fas fa-times text-xl" />
                    </button>
                </div>

                <form className="px-6 py-6 space-y-5" onSubmit={handleCreatePaper}>
                    {error && (
                        <div className="p-3 bg-red-500/10 border border-red-500/50 rounded-xl text-red-400 text-sm">
                            {error}
                        </div>
                    )}

                    <div>
                        <label className="block text-sm font-semibold text-white mb-2 flex items-center gap-2">
                            <i className="fas fa-calendar text-primary" />
                            Event <span className="text-danger">*</span>
                        </label>
                        <div className="relative">
                            <i className="fas fa-chevron-down absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" />
                            <input
                                type="text"
                                name="event"
                                required
                                value={formData.event}
                                onChange={handleChange}
                                list="eventList"
                                placeholder="Select event"
                                className="w-full bg-darkbg/50 text-white border border-gray-600 rounded-xl px-4 py-3 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition pl-10"
                            />
                            <i className="fas fa-calendar-day absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                        </div>
                        <datalist id="eventList">
                            <option value="Formative Assessment - I" />
                            <option value="Summative Assessment - I" />
                            <option value="Formative Assessment - II" />
                            <option value="Summative Assessment - II" />
                            <option value="Unit Test" />
                            <option value="Half Yearly" />
                            <option value="Annual Examination" />
                        </datalist>
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-white mb-2 flex items-center gap-2">
                            <i className="fas fa-book text-primary" />
                            Subject <span className="text-danger">*</span>
                        </label>
                        <div className="relative">
                            <i className="fas fa-chevron-down absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" />
                            <input
                                type="text"
                                name="subject"
                                required
                                value={formData.subject}
                                onChange={handleChange}
                                list="subjectList"
                                placeholder="Select subject"
                                className="w-full bg-darkbg/50 text-white border border-gray-600 rounded-xl px-4 py-3 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition pl-10"
                            />
                            <i className="fas fa-book-open absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                        </div>
                        <datalist id="subjectList">
                            <option value="English" />
                            <option value="Hindi" />
                            <option value="Math" />
                            <option value="Science" />
                            <option value="Computer" />
                            <option value="Social Studies" />
                        </datalist>
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-white mb-2 flex items-center gap-2">
                            <i className="fas fa-users text-primary" />
                            Class <span className="text-danger">*</span>
                        </label>
                        <div className="relative">
                            <i className="fas fa-chevron-down absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" />
                            <input
                                type="text"
                                name="class_name"
                                required
                                value={formData.class_name}
                                onChange={handleChange}
                                list="classList"
                                placeholder="Select class"
                                className="w-full bg-darkbg/50 text-white border border-gray-600 rounded-xl px-4 py-3 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition pl-10"
                            />
                            <i className="fas fa-graduation-cap absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                        </div>
                        <datalist id="classList">
                            <option value="IX" />
                            <option value="X" />
                            <option value="XI" />
                            <option value="XII" />
                        </datalist>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-semibold text-white mb-2 flex items-center gap-2">
                                <i className="fas fa-star text-primary" />
                                Marks <span className="text-danger">*</span>
                            </label>
                            <input
                                type="number"
                                name="marks"
                                required
                                value={formData.marks}
                                onChange={handleChange}
                                placeholder="Marks"
                                className="w-full bg-darkbg/50 text-white border border-gray-600 rounded-xl px-4 py-3 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-white mb-2 flex items-center gap-2">
                                <i className="fas fa-clock text-primary" />
                                Duration <span className="text-danger">*</span>
                            </label>
                            <input
                                type="text"
                                name="duration"
                                required
                                value={formData.duration}
                                onChange={handleChange}
                                placeholder="Duration"
                                className="w-full bg-darkbg/50 text-white border border-gray-600 rounded-xl px-4 py-3 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition"
                            />
                        </div>
                    </div>

                    <div className="flex gap-3 pt-4">
                        <button
                            type="button"
                            onClick={() => setCreateModalOpen(false)}
                            disabled={loading}
                            className="flex-1 group relative overflow-hidden bg-gray-700/50 hover:bg-gray-600 text-white font-semibold py-3 px-4 rounded-xl transition duration-300 border border-gray-600 disabled:opacity-50"
                        >
                            <div className="absolute inset-0 bg-white/10 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="flex-1 group relative overflow-hidden bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 text-white font-semibold py-3 px-4 rounded-xl transition duration-300 shadow-lg hover:shadow-xl disabled:opacity-50 flex items-center justify-center gap-2"
                        >
                            <div className="absolute inset-0 bg-white/10 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
                            {loading ? (
                                <>
                                    <i className="fas fa-spinner fa-spin" />
                                    Creating...
                                </>
                            ) : (
                                <>
                                    <i className="fas fa-plus" />
                                    Create & Edit
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default CreatePaperModal;