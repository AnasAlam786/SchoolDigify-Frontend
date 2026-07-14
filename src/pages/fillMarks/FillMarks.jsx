import Header from "./components/Header";
import ControlPannel from "./components/ControlPanel";
import { InitialState, SkeletonLoader } from "./components/PageStatus";
import MarksEntryContainer from "./components/MarksEntryContainer/MarksEntryContainer";
import "./style/FillMarks.css"
import {NoStudentsState, ErrorState}  from "../utils/GlobalPageStatus"
import { useState, useEffect } from "react";

function FillMarks() {

    const [classes, setClasses] = useState([]);
    const [exams, setExams] = useState([]);
    const [subjects, setSubjects] = useState([]);

    const [StudentsData, setStudentsData] = useState(null);
    const [studentDataError, setStudentDataError] = useState("");
    const [isStudentDataloading, setstudentDataLoading] = useState(false);

    const [SubjectFetchingError, setSubjectFetchingError] = useState("");

    const [filters, setFilters] = useState({ classId: "", subjectId: "", examId: "", });

    useEffect(() => {
        fetchClassesAndExams();
    }, []);


    useEffect(() => {
        if (!filters.classId) {
            setSubjects([]);
            return;
        }

        fetchSubjectsForClass(filters.classId);

    }, [filters.classId]);



    async function fetchClassesAndExams() {
        try {
            console.log(import.meta.env.VITE_API_URL)

            const response = await fetch(`${import.meta.env.VITE_API_URL}/api/fetchClassesAndExams`, {
                credentials: "include",
            });

            if (!response.ok) {
                throw new Error("Failed to fetch data");
            }

            const data = await response.json();
            console.log(data.classes)

            setExams(data.exams);
            setClasses(data.classes);
        } catch (err) {
            console.error(err);
        }
    }

    async function fetchSubjectsForClass(classId) {
        setSubjectFetchingError("");
        setSubjects([]);

        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/api/subjects/${filters.classId}`, {
                credentials: "include",
            });

            if (!response.ok) {
                throw new Error("Failed to fetch subjects");
            }

            const subjectsList = await response.json();

            if (subjectsList.length === 0) {
                setSubjectFetchingError("No subjects found for the selected class");
            }
            setSubjects(subjectsList);
        } catch (err) {
            console.error(err);
            setSubjectFetchingError("Error fetching subjects");
        }
    }

    async function submitFilters() {

        if (!filters.classId || !filters.subjectId || !filters.examId) {
            alert("Please select all options before submitting.");
            return;
        }

        setStudentDataError("");
        setstudentDataLoading(true);

        try {

            const params = new URLSearchParams({
                class_id: filters.classId,
                subject_id: filters.subjectId,
                exam_id: filters.examId,
            });

            const response = await fetch(
                `${import.meta.env.VITE_API_URL}/api/get_marks?${params}`,
                {
                    credentials: "include",
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || "Failed to fetch marks");
            }

            setStudentsData(data.students);

        } catch (err) {

            console.error(err);

            setStudentsData([]);

            setStudentDataError(
                err.message || "Failed to load students"
            );

        } finally {
            setstudentDataLoading(false);
        }
    }


    let mainPageStates;

    if (isStudentDataloading) { mainPageStates = <SkeletonLoader />; }
    else if (studentDataError) { mainPageStates = <ErrorState message={studentDataError} onRetry={submitFilters} />; }
    else if (StudentsData === null) { mainPageStates = <InitialState />; }
    else if (StudentsData.length === 0) { mainPageStates = <NoStudentsState />; }
    else {
        mainPageStates = <MarksEntryContainer studentsMarksData={StudentsData} />
    }


    return (
        <>
            <Header />
            <ControlPannel
                classes={classes} exams={exams} subjects={subjects}
                filters={filters} setFilters={setFilters}
                submitFilters={submitFilters}
                SubjectFetchingError={SubjectFetchingError}
                isStudentDataloading = {isStudentDataloading}>
            </ControlPannel>

            {mainPageStates}

        </>
    );
}

export default FillMarks;