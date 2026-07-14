import { useEffect, useState } from "react";
import { MarksEntryFormDesktop, MarksEntryFormMobile } from "./MarksEntryForm"

/* =========================
   PARENT COMPONENT
========================= */
export default function MarksEntryContainer({ studentsMarksData }) {
    const [marks, setMarks] = useState({});
    const [loading, setLoading] = useState({});

    /* ✅ initialize default marks from API */
    useEffect(() => {
        if (!studentsMarksData) return;

        const initialMarks = {};
        studentsMarksData.forEach((student) => {
            initialMarks[student.student_id] = student.score ?? "";
        });

        setMarks(initialMarks);
    }, [studentsMarksData]);

    const handleMarkChange = (studentId, value, type) => {
        if (type === "grading") {
            value = value.toUpperCase();
        }

        setMarks((prev) => ({
            ...prev,
            [studentId]: value,
        }));
    };

    const handleSubmit = async (student) => {
        const studentId = student.student_id;

        setLoading((prev) => ({
            ...prev,
            [studentId]: true,
        }));

        try {
            const response = await fetch(
                `${import.meta.env.VITE_API_URL}/update_marks_api`,
                {
                    method: "POST",
                    credentials: "include",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        mark_id: student.mark_id,
                        score: marks[studentId],
                    }),
                }
            );
            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data.message || "Failed to update marks"
                );
            }

            alert(data.message);
        } catch (err) {
            console.error(err);

            alert(
                err.message || "Failed to update marks"
            );
        } finally {
            setLoading((prev) => ({
                ...prev,
                [studentId]: false,
            }));
        }
    };

    return (
        <>
            <MarksEntryFormDesktop
                studentsMarksData={studentsMarksData}
                marks={marks}
                loading={loading}
                onMarkChange={handleMarkChange}
                handleSubmit={handleSubmit}
            />

            <MarksEntryFormMobile
                studentsMarksData={studentsMarksData}
                marks={marks}
                loading={loading}
                onMarkChange={handleMarkChange}
                handleSubmit={handleSubmit}
            />
        </>
    );
}
