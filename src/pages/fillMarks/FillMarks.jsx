import Header from "./components/Header";
import ControlPannel from "./components/ControlPanel";
import { InitialState, SkeletonLoader } from "./components/PageStatus";
import MarksEntryContainer from "./components/MarksEntryContainer/MarksEntryContainer";
import "./style/FillMarks.css"
import { NoStudentsState, ErrorState } from "../utils/GlobalPageStatus"
import { useState, useEffect } from "react";
import { apiGet } from "../../api/api"
import { fetchClasses } from "../utils/fetchClasses"

function FillMarks() {

    const [classes, setClasses] = useState([]);
    const [exams, setExams] = useState([]);
    const [subjects, setSubjects] = useState([]);

    const [StudentsData, setStudentsData] = useState(null);
    const [studentDataError, setStudentDataError] = useState("");
    const [isStudentDataloading, setstudentDataLoading] = useState(false);

    const [SubjectFetchingError, setSubjectFetchingError] = useState("");
    const [ExamFetchingError, setExamFetchingError] = useState("");

    const [filters, setFilters] = useState({ classId: "", subjectId: "", examId: "", });
    const [selectedExamInfo, setSelectedExamInfo] = useState({});
    const [selectedSubjectInfo, setSelectedSubjectInfo] = useState({});

    useEffect(() => {
        if (!filters.classId) {
            setSubjects([]);
            return;
        }

        fetchSubjectsAndExamsForClass(filters.classId);

    }, [filters.classId]);


    useEffect(() => {
        const loadClasses = async () => {
            const classData = await fetchClasses();
            setClasses(classData);
        };
        loadClasses()
    }, [])

    async function fetchSubjectsAndExamsForClass(classId) {
        setSubjectFetchingError("");
        setExamFetchingError("");

        setSubjects([]);
        setExams([]);

        try {
            const response = await apiGet(
                `/api/subjects_and_exams_by_class/${classId}`
            );
            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    response.error || "Failed to fetch subjects and exams"
                );
            }

            const subjectsList = data.subjects;
            const examsList = data.exams;

            if (subjectsList.length === 0) {
                setSubjectFetchingError("No subjects found for the selected class");
            }

            if (examsList.length === 0) {
                setExamFetchingError("No exams found for the selected class");
            }

            setSubjects(subjectsList);
            setExams(examsList);

        } catch (err) {
            console.error(err);

            showAlert(400, err.message);

            setSubjectFetchingError("Error fetching Subjects");
            setExamFetchingError("Error fetching Exams");
        }
    }

    async function submitFilters() {

        if (!filters.classId || !filters.subjectId || !filters.examId) {
            alert("Please select all options before submitting.");
            return;
        }

        setStudentDataError("");
        setstudentDataLoading(true);

        setStudentsData([])
        setSelectedSubjectInfo({})
        setSelectedExamInfo({})

        try {

            const params = new URLSearchParams({
                class_id: filters.classId,
                subject_id: filters.subjectId,
                exam_id: filters.examId,
            });

            const response = await apiGet(`/api/get_marks?${params}`);
            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || "Failed to fetch marks");

            }

            setStudentsData(data.students);
            setSelectedSubjectInfo(data.subject)
            setSelectedExamInfo(data.exam)

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
        mainPageStates = (
            <MarksEntryContainer
                studentsMarksData={StudentsData}
                selectedExamInfo={selectedExamInfo}
                selectedSubjectInfo={selectedSubjectInfo}
            />
        );
    }


    return (
        <>
            <Header />
            <ControlPannel
                classes={classes} exams={exams} subjects={subjects}
                filters={filters} setFilters={setFilters}
                submitFilters={submitFilters}
                SubjectFetchingError={SubjectFetchingError}
                ExamFetchingError={ExamFetchingError}
                isStudentDataloading={isStudentDataloading}>
            </ControlPannel>

            {mainPageStates}

        </>
    );
}

export default FillMarks;