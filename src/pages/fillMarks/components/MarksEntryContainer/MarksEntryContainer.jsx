import { useEffect, useState } from "react";
import { MarksEntryFormDesktop, MarksEntryFormMobile } from "./MarksEntryForm";

/* =========================================================
   PARENT CONTAINER
   ========================================================= */

export default function MarksEntryContainer({
    studentsMarksData,
    selectedExamInfo,
    selectedSubjectInfo,
}) {
    const [marks, setMarks] = useState({});
    const [loading, setLoading] = useState({});
    const [submitStatus, setSubmitStatus] = useState({});

    /* -----------------------------------------
       Initialize marks from API
       ----------------------------------------- */

    useEffect(() => {
        if (!studentsMarksData) return;

        const initialMarks = {};

        studentsMarksData.forEach((student) => {
            const studentKey = student.student_session_id
            initialMarks[studentKey] = student.score ?? "";
        });

        setMarks(initialMarks);
    }, [studentsMarksData]);


    /* -----------------------------------------
       Handle mark changes
       ----------------------------------------- */

    const handleMarkChange = (
        studentSessionId, value, type
    ) => {
        if (type === "grading") {
            value = value.toUpperCase();
        }

        setMarks((prev) => ({
            ...prev,
            [studentSessionId]: value,
        }));

        setSubmitStatus((prev) => ({
            ...prev,
            [studentSessionId]: undefined,
        }));
    };


    /* -----------------------------------------
       Submit marks
       ----------------------------------------- */

    const handleSubmit = async (student) => {
        const studentSessionId = student.student_session_id;

        setLoading((prev) => ({
            ...prev,
            [studentSessionId]: true,
        }));

        setSubmitStatus((prev) => ({
            ...prev,
            [studentSessionId]: undefined,
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
                        student_session_id: studentSessionId,
                        exam_id: selectedExamInfo.id,
                        subject_id: selectedSubjectInfo.id,
                        score: marks[studentSessionId],
                    }),
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data.message ||
                        "Failed to update marks"
                );
            }

            setSubmitStatus((prev) => ({
                ...prev,
                [studentSessionId]: "success",
            }));

            // Return button to normal after 2.5 seconds.
            setTimeout(() => {
                setSubmitStatus((prev) => ({
                    ...prev,
                    [studentSessionId]: undefined,
                }));
            }, 2500);

        } catch (err) {
            console.error(err);
            setSubmitStatus((prev) => ({
                ...prev,
                [studentSessionId]: "error",
            }));

            // Return to normal after 3 seconds.
            setTimeout(() => {
                setSubmitStatus((prev) => ({
                    ...prev,
                    [studentSessionId]: undefined,
                }));
            }, 3000);

        } finally {
            setLoading((prev) => ({
                ...prev,
                [studentSessionId]: false,
            }));
        }
    };


    return (
        <>
            <MarksEntryFormDesktop
                studentsMarksData={studentsMarksData}
                selectedSubjectInfo={selectedSubjectInfo}
                selectedExamInfo={selectedExamInfo}
                marks={marks}
                loading={loading}
                submitStatus={submitStatus}
                onMarkChange={handleMarkChange}
                handleSubmit={handleSubmit}
            />

            <MarksEntryFormMobile
                studentsMarksData={studentsMarksData}
                selectedSubjectInfo={selectedSubjectInfo}
                selectedExamInfo={selectedExamInfo}
                marks={marks}
                loading={loading}
                submitStatus={submitStatus}
                onMarkChange={handleMarkChange}
                handleSubmit={handleSubmit}
            />
        </>
    );
}
