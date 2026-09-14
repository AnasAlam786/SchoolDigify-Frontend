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
            initialMarks[student.student_id] =
                student.score ?? "";
        });

        setMarks(initialMarks);
    }, [studentsMarksData]);


    /* -----------------------------------------
       Handle mark changes
       ----------------------------------------- */

    const handleMarkChange = (
        studentId, value, type
    ) => {
        if (type === "grading") {
            value = value.toUpperCase();
        }

        setMarks((prev) => ({
            ...prev,
            [studentId]: value,
        }));

        setSubmitStatus((prev) => ({
            ...prev,
            [studentId]: undefined,
        }));
    };


    /* -----------------------------------------
       Submit marks
       ----------------------------------------- */

    const handleSubmit = async (student) => {
        const studentId = student.student_id;

        setLoading((prev) => ({
            ...prev,
            [studentId]: true,
        }));

        setSubmitStatus((prev) => ({
            ...prev,
            [studentId]: undefined,
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
                        student_id: studentId,
                        exam_id: selectedExamInfo.id,
                        subject_id: selectedSubjectInfo.id,
                        score: marks[studentId],
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
                [studentId]: "success",
            }));

            // Return button to normal after 2.5 seconds.
            setTimeout(() => {
                setSubmitStatus((prev) => ({
                    ...prev,
                    [studentId]: undefined,
                }));
            }, 2500);

        } catch (err) {
            console.error(err);
            setSubmitStatus((prev) => ({
                ...prev,
                [studentId]: "error",
            }));

            // Return to normal after 3 seconds.
            setTimeout(() => {
                setSubmitStatus((prev) => ({
                    ...prev,
                    [studentId]: undefined,
                }));
            }, 3000);

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
