import React, { useEffect, useState } from "react";

function ManageExamModal({ open, onClose }) {
    const [examList, setExamList] = useState([]);
    const [isLoading, setLoading] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        if (!open) {
            setExamList([]);
            setError("");
            return;
        }

        const controller = new AbortController();

        async function loadExams() {
            setLoading(true);
            setError("");

            try {
                const response = await fetch(
                    `${import.meta.env.VITE_API_URL}/api/get_all_exams`,
                    {
                        credentials: "include",
                        signal: controller.signal,
                    }
                );

                if (!response.ok) {
                    throw new Error("Failed to fetch exams");
                }

                const exams = await response.json();
                setExamList(exams);
            } catch (err) {
                if (err.name !== "AbortError") {
                    setError(err.message || "Something went wrong");
                    console.error(err);
                }
            } finally {
                setLoading(false);
            }
        }

        loadExams();

        return () => controller.abort();
    }, [open]);

    async function toggleExam(id) {
        const currentExam = examList.find((exam) => exam.id === id);

        if (!currentExam) return;

        const newEnabledValue = !currentExam.is_enabled;

        try {
            // Optimistic UI update
            setExamList((prev) =>
                prev.map((exam) =>
                    exam.id === id
                        ? { ...exam, is_enabled: newEnabledValue }
                        : exam
                )
            );

            // Update backend
            const response = await fetch(
                `${import.meta.env.VITE_API_URL}/update_exam_status`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    credentials: "include",
                    body: JSON.stringify({
                        exam_id: id,
                        is_enabled: newEnabledValue,
                    }),
                }
            );

            if (!response.ok) {
                const errorMessage = await response.json();
                alert(errorMessage.error || "Failed to update exam status");
                throw new Error(errorMessage.error || "Failed to update exam status");
            }
        } catch (err) {
            console.error("Something went wrong");

            // Rollback UI
            setExamList((prev) =>
                prev.map((exam) =>
                    exam.id === id
                        ? { ...exam, exam_name: currentExam.enabled }
                        : exam
                )
            );

            alert(err.message || "Failed to update exam status");
        }
    }

    if (!open) return null;

    return (
        <div
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={onClose}
        >
            <div
                className="glass-card w-full max-w-md rounded-2xl border border-white/10 shadow-2xl bg-black/40 backdrop-blur-xl"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-white/10">
                    <h2 className="text-xl font-semibold text-white">
                        Manage Exams
                    </h2>

                    <button
                        onClick={onClose}
                        aria-label="Close modal"
                        className="text-gray-400 hover:text-white text-2xl"
                    >
                        ×
                    </button>
                </div>

                {/* Body */}
                <div className="px-6 py-4">
                    {isLoading ? (
                        <ModalSkeleton />
                    ) : error ? (
                        <div className="text-red-400">{error}</div>
                    ) : examList.length === 0 ? (
                        <div className="text-gray-400">
                            No exams found
                        </div>
                    ) : (
                        <div className="max-h-[360px] overflow-y-auto space-y-3">
                            {examList.map((exam) => (
                                <div
                                    key={exam.id}
                                    className="flex items-center justify-between p-3 rounded-xl bg-white/5 hover:bg-white/10 transition"
                                >
                                    <span className="text-white text-sm font-medium">
                                        {exam.exam_name}
                                    </span>

                                    <button
                                        type="button"
                                        aria-label={`Toggle ${exam.exam_name}`}
                                        onClick={() =>
                                            toggleExam(exam.id)
                                        }
                                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition 
                                            ${exam.is_enabled
                                                ? "bg-green-500"
                                                : "bg-gray-600"
                                            }`}
                                    >
                                        <span
                                            className={`inline-block h-4 w-4 rounded-full bg-white transition-transform 
                                                ${exam.is_enabled
                                                    ? "translate-x-6"
                                                    : "translate-x-1"
                                                }`}
                                        />
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* <!-- Info message: exam disabled behavior --> */}
                <div
                    className="mb-4 p-3 m-3 rounded-lg bg-blue-500/10 border border-blue-500/20 text-blue-300 text-sm flex items-start gap-3">
                    <i className="fas fa-info-circle text-blue-400 mt-0.5"></i>
                    <span>
                        <span className="font-semibold">Note:</span> After disabling an exam, you can still update marks.
                        However, teachers and other staff will not be able to fill or modify marks.
                    </span>
                </div>

                {/* Footer */}
                <div className="px-6 py-4 border-t border-white/10 flex justify-end">
                    <button
                        onClick={onClose}
                        className="px-5 py-2 rounded-lg bg-white/5 hover:bg-white/10 text-gray-300"
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
}

function ModalSkeleton() {
    return (
        <div className="space-y-3">
            {Array.from({ length: 4 }).map((_, i) => (
                <div
                    key={i}
                    className="flex items-center justify-between p-3 rounded-xl bg-white/5 animate-pulse"
                >
                    <div className="h-4 w-32 rounded bg-white/10"></div>
                    <div className="h-6 w-11 rounded-full bg-white/10"></div>
                </div>
            ))}
        </div>
    );
}

export default ManageExamModal;