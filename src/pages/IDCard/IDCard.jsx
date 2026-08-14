import { useEffect, useState, useMemo } from 'react';
import Header from './components/Header'
import ControlPanel from './components/ControlPanel'
import StatusBar from './components/StatusBar';
import IDCardContainer from "./components/IDCardContainer"
import { InitialState, NoStudentsState, ErrorState, SkeletonLoader } from './components/PageStatus'
import { PrintIDCard } from "./components/PrintIDCard";
import { fetchClasses } from '../utils/fetchClasses';
import { apiGet } from '../../api/api';
import "./style/IDCard.css"

function IDCard() {

    const [StudentsIDCardData, setStudentsIDCardData] = useState(null);
    const [SchoolData, setSchoolData] = useState(null);

    const [studentIDCardError, setstudentIDCardError] = useState(null);
    const [isStudentIDCardloading, setStudentIDCardloading] = useState(false);

    const [classes, setClasses] = useState([]);
    const [selectedClass, setSelectedClass] = useState(null);
    const [search, setSearch] = useState("");
    const [showOnlyImages, setshowOnlyImages] = useState(true);

    const [selectedStudents, setSelectedStudents] = useState(new Set());

    let totalSelected = selectedStudents.size;

    const handlePrint = () => {

        if (!Array.isArray(StudentsIDCardData)) { return };

        const selectedStudentsData = StudentsIDCardData.filter(
            student =>
                selectedStudents.has(student.student_id)
        );

        if (selectedStudentsData.length === 0) {
            alert("Please select at least one ID card to print.");
            return;
        }

        PrintIDCard(selectedStudentsData, SchoolData);
    };


    async function FetchAndLoadPreview(selectedClass) {
        setStudentIDCardloading(true);
        setstudentIDCardError(null);

        try {
            const response = await apiGet(`/api/idcard_students/${selectedClass}`)
            const data = await response.json()

            // simulate API
            if (response.ok) {
                setStudentsIDCardData(data.students_data)
                setSchoolData(data.school_data)
            } else {
                setstudentIDCardError(data.message || 'Failed to fetch attendance')
                showAlert(500, data.message || 'Failed to fetch attendance')
            }

        } catch (err) {
            // handle error if needed
            console.error(err);
            setstudentIDCardError(err?.message || "Failed to load students.");
        } finally {
            setStudentIDCardloading(false);
        }
    }

    const filteredStudents = useMemo(() => {
        return (StudentsIDCardData || []).filter((student) => {

            const term = search.trim().toLowerCase();

            if (term) {
                
                const studentName =
                    student.student_name?.toLowerCase() || "";

                const studentFather =
                    student.student_father?.toLowerCase() || "";

                if (
                    !studentName.includes(term) &&
                    !studentFather.includes(term)
                ) {
                    return false;
                }
            }

            if (showOnlyImages) {
                if (
                    typeof student.image !== "string" ||
                    student.image.trim() === ""
                ) {
                    return false;
                }
            }

            return true;
        });
    }, [
        StudentsIDCardData,
        search, showOnlyImages,
        selectedClass
    ]);

    // selects or unselects only the currently visible (filtered) students
    const handleSelectAllVisible = (checked) => {
        const visibleIds = filteredStudents.map(
            student => student.student_id
        );

        setSelectedStudents(prev => {
            const updated = new Set(prev);

            if (checked) {
                visibleIds.forEach(id => updated.add(id));
            } else {
                visibleIds.forEach(id => updated.delete(id));
            }

            return updated;
        });
    }

    useEffect(() => {
        const loadClasses = async () => {
            const classData = await fetchClasses();
            setClasses(classData);
        };
        loadClasses()
    }, [])


    useEffect(() => {
        if (selectedClass) {
            setSelectedStudents(new Set()); // Clear previous selection
            FetchAndLoadPreview(selectedClass);
        }
    }, [selectedClass]);

    let mainPageStates;

    if (isStudentIDCardloading) {
        mainPageStates = <SkeletonLoader />;
    }
    else if (studentIDCardError) {
        mainPageStates = <ErrorState
            message={studentIDCardError}
            onRetry={() => FetchAndLoadPreview(selectedClass)}
        />;
    }
    else if (StudentsIDCardData === null) {

        mainPageStates = <InitialState />;
    }
    else if (Array.isArray(StudentsIDCardData) && StudentsIDCardData.length === 0) {
        mainPageStates = <NoStudentsState />;
    }
    else {
        mainPageStates = (
            <IDCardContainer
                filteredStudents={filteredStudents}
                selectedStudents={selectedStudents}
                schoolData={SchoolData}
                setSelectedStudents={setSelectedStudents}
            />);
    }

    return (
        <>
            <Header />
            <ControlPanel
                classes={classes}
                filters={{ search, setSearch, showOnlyImages, setshowOnlyImages }}
                selection={{ totalSelected, handleSelectAllVisible }}

                setSelectedClass={setSelectedClass}
                handlePrint={handlePrint}
            />

            <StatusBar
                totalSelected={totalSelected}
                totalOverall={StudentsIDCardData?.length || 0}
            />

            {mainPageStates}
        </>
    )
}



export default IDCard
