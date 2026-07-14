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
    const [studentIDCardError, setstudentIDCardError] = useState(null);
    const [isStudentIDCardloading, setStudentIDCardloading] = useState(false);

    const [classes, setClasses] = useState([]);
    const [selectedClass, setSelectedClass] = useState(null);
    const [search, setSearch] = useState("");
    const [showOnlyImages, setshowOnlyImages] = useState(true);

    const [selectedStudents, setSelectedStudents] = useState(new Set());

    let totalSelected = selectedStudents.size;


    const students = [
        {
            student_id: 1,
            studentName: "Anas Khan",
            studentFather: "Mohd. Ali",
            studentImage: "https://randomuser.me/api/portraits/men/32.jpg",
            studentClassRoll: "10 - 25",
            studentDOB: "12-03-2008",
            studentPhone: "9876543210",
            studentAddress: "Moradabad, UP",

            schoolName: "ABC School",
            schoolUDISE: "123456",
            schoolLogo: "/logo.png",
            sessionYear: "2025-26",

            teacherSign: "/sign/teacher.png",
            principalSign: "https://www.clipartmax.com/png/full/474-4744045_signatures-samples-png-signature-samples-png.png",

            schoolAddress: "Moradabad, UP",
            schoolPhone: "9999999999"
        },

        {
            student_id: 2,
            studentName: "Aarav Sharma",
            studentFather: "Rajesh Sharma",
            studentImage: "https://randomuser.me/api/portraits/men/11.jpg",
            studentClassRoll: "6 - 12",
            studentDOB: "21-08-2013",
            studentPhone: "9123456780",
            studentAddress: "Delhi, India",

            schoolName: "ABC School",
            schoolUDISE: "123456",
            schoolLogo: "/logo.png",
            sessionYear: "2025-26",

            teacherSign: "/sign/teacher.png",
            principalSign: "https://www.clipartmax.com/png/full/474-4744045_signatures-samples-png-signature-samples-png.png",

            schoolAddress: "Moradabad, UP",
            schoolPhone: "9999999999"
        },

        {
            student_id: 3,
            studentName: "Priya Verma",
            studentFather: "Sanjay Verma",
            studentImage: "https://randomuser.me/api/portraits/women/21.jpg",
            studentClassRoll: "7 - 08",
            studentDOB: "15-11-2012",
            studentPhone: "9234567810",
            studentAddress: "Lucknow, UP",

            schoolName: "ABC School",
            schoolUDISE: "123456",
            schoolLogo: "/logo.png",
            sessionYear: "2025-26",

            teacherSign: "/sign/teacher.png",
            principalSign: "https://www.clipartmax.com/png/full/474-4744045_signatures-samples-png-signature-samples-png.png",

            schoolAddress: "Moradabad, UP",
            schoolPhone: "9999999999"
        },

        {
            student_id: 4,
            studentName: "Mohammad Faizan",
            studentFather: "Irfan Ahmad",
            studentImage: "https://randomuser.me/api/portraits/men/45.jpg",
            studentClassRoll: "8 - 17",
            studentDOB: "05-02-2011",
            studentPhone: "9345678120",
            studentAddress: "Bareilly, UP",

            schoolName: "ABC School",
            schoolUDISE: "123456",
            schoolLogo: "/logo.png",
            sessionYear: "2025-26",

            teacherSign: "/sign/teacher.png",
            principalSign: "https://www.clipartmax.com/png/full/474-4744045_signatures-samples-png-signature-samples-png.png",

            schoolAddress: "Moradabad, UP",
            schoolPhone: "9999999999"
        },

        {
            student_id: 5,
            studentName: "Sneha Gupta",
            studentFather: "Manoj Gupta",
            studentImage: "https://randomuser.me/api/portraits/women/55.jpg",
            studentClassRoll: "9 - 03",
            studentDOB: "18-07-2010",
            studentPhone: "9456781230",
            studentAddress: "Kanpur, UP",

            schoolName: "ABC School",
            schoolUDISE: "123456",
            schoolLogo: "/logo.png",
            sessionYear: "2025-26",

            teacherSign: "/sign/teacher.png",
            principalSign: "https://www.clipartmax.com/png/full/474-4744045_signatures-samples-png-signature-samples-png.png",

            schoolAddress: "Moradabad, UP",
            schoolPhone: "9999999999"
        },

        {
            student_id: 6,
            studentName: "Rahul Singh",
            studentFather: "Vijay Singh",
            studentImage: "https://randomuser.me/api/portraits/men/61.jpg",
            studentClassRoll: "11 - 14",
            studentDOB: "02-01-2009",
            studentPhone: "9567812340",
            studentAddress: "Agra, UP",

            schoolName: "ABC School",
            schoolUDISE: "123456",
            schoolLogo: "/logo.png",
            sessionYear: "2025-26",

            teacherSign: "/sign/teacher.png",
            principalSign: "https://www.clipartmax.com/png/full/474-4744045_signatures-samples-png-signature-samples-png.png",

            schoolAddress: "Moradabad, UP",
            schoolPhone: "9999999999"
        },

        {
            student_id: 7,
            studentName: "Ayesha Siddiqui",
            studentFather: "Nadeem Siddiqui",
            studentImage: "https://randomuser.me/api/portraits/women/68.jpg",
            studentClassRoll: "12 - 07",
            studentDOB: "27-09-2008",
            studentPhone: "9678123450",
            studentAddress: "Aligarh, UP",

            schoolName: "ABC School",
            schoolUDISE: "123456",
            schoolLogo: "/logo.png",
            sessionYear: "2025-26",

            teacherSign: "/sign/teacher.png",
            principalSign: "https://www.clipartmax.com/png/full/474-4744045_signatures-samples-png-signature-samples-png.png",

            schoolAddress: "Moradabad, UP",
            schoolPhone: "9999999999"
        },

        {
            student_id: 8,
            studentName: "Rohan Patel",
            studentFather: "Dinesh Patel",
            studentImage: "https://randomuser.me/api/portraits/men/72.jpg",
            studentClassRoll: "5 - 19",
            studentDOB: "14-04-2014",
            studentPhone: "9781234506",
            studentAddress: "Ahmedabad, Gujarat",

            schoolName: "ABC School",
            schoolUDISE: "123456",
            schoolLogo: "/logo.png",
            sessionYear: "2025-26",

            teacherSign: "/sign/teacher.png",
            principalSign: "https://www.clipartmax.com/png/full/474-4744045_signatures-samples-png-signature-samples-png.png",

            schoolAddress: "Moradabad, UP",
            schoolPhone: "9999999999"
        }
    ];

    const handlePrint = () => {

        if (!Array.isArray(StudentsIDCardData)) { return };

        const selectedData = StudentsIDCardData.filter(
            student =>
                selectedStudents.has(student.student_id)
        );

        if (selectedData.length === 0) {
            alert("Please select at least one ID card to print.");
            return;
        }

        PrintIDCard(selectedData);
    };


    async function FetchAndLoadPreview(selectedClass) {
        setStudentIDCardloading(true);
        setstudentIDCardError(null);

        try {
            const response = await apiGet(`/api/idcard_students/${selectedClass}`)
            const data = await response.json()

            // simulate API
            if (response.ok) {
                setStudentsIDCardData(data.students)
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
