import { useEffect, useMemo, useState, useCallback } from "react";
import { apiGet } from "../../api/api";
import StudentFilters from "./components/StudentFilters";
import StudentCard from "./components/StudentCard";
import StudentStatsSection from "./components/StudentStatsSection";
import StudentDetailsModal from "../utils/StudentsDetailsModal.jsx/StudentDetailsModal";
import Header from "./components/Header";
import { fetchClasses } from "../utils/fetchClasses";
import "./style/StudentsList.css";
import SkeletonLoader from "./components/PageStatus";
import { ErrorState, NoStudentsState } from "../utils/GlobalPageStatus";
import { DEFAULT_FILTERS, matchesSearch, matchesFilters, sortStudents } from "./components/StudentsFilter";

import usePermission from "../../hooks/usePermission";

export default function StudentsList() {
    
    const {hasPermission, PERMISSIONS} = usePermission()

    const [students, setStudents] = useState([]);
    const [classes, setClasses] = useState([]);
    const [studentFilters, setStudentFilters] = useState(DEFAULT_FILTERS);

    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [selectedStudent, setSelectedStudent] = useState(null);
    const [isDetailModalOpen, setDetailModalOpen] = useState(false);
    const [selectedPhone, setSelectedPhone] = useState("");

    useEffect(() => {
        fetchClasses().then(setClasses);
    }, []);

    useEffect(() => {
        const loadStudents = async () => {
            setLoading(true);
            setError("");
            try {
                const response = await apiGet("/api/get_students_data");
                const data = await response.json();
                if (!response.ok) {
                    throw new Error("Failed to load students data.");
                }

                const loadedStudents = data.students || [];
                setStudents(loadedStudents);
                setStats(data.stats || null);
            } catch (err) {
                setError(err.message || "Unable to load student data.");
            } finally {
                setLoading(false);
            }
        };

        loadStudents();
    }, []);


    const filteredStudents = useMemo(() => {
        const filtered = students.filter(student =>
            matchesSearch(student, studentFilters) &&
            matchesFilters(student, studentFilters)
        );

        const result = sortStudents(filtered, studentFilters);
        return result;
    }, [students, studentFilters]);


    const activeTags = useMemo(() => {
        const tags = [];
        if (studentFilters.search) {
            tags.push(`Search: ${studentFilters.search}`);
        }
        if (studentFilters.searchIn !== "all") {
            tags.push(`Field: ${studentFilters.searchIn}`);
        }
        if (studentFilters.classView !== "All") {
            tags.push(`Class: ${studentFilters.classView}`);
        }
        if (studentFilters.filterRTE) {
            tags.push("RTE");
        }
        if (studentFilters.filterPEN !== "any") {
            tags.push(`PEN: ${studentFilters.filterPEN}`);
        }
        if (studentFilters.filterGender !== "any") {
            tags.push(`Gender: ${studentFilters.filterGender}`);
        }
        if (studentFilters.filterAdmission !== "any") {
            tags.push(`Admission: ${studentFilters.filterAdmission}`);
        }
        if (studentFilters.sortBy) {
            tags.push(`Sort: ${studentFilters.sortBy}`);
        }
        if (studentFilters.sortDir !== "asc") {
            tags.push(`Dir: ${studentFilters.sortDir}`);
        }
        return tags;
    }, [studentFilters]);

    // Student Detail Modal onopen And on close Code
    const openStudentDetails = useCallback((studentId, phone) => {
        setSelectedStudent(studentId);
        setSelectedPhone(phone);
        setDetailModalOpen(true);
    }, []);

    const closeStudentDetails = () => {
        setDetailModalOpen(false);
        setSelectedStudent(null);
        setSelectedPhone("");
    };

    let mainContent;

    if (loading) { mainContent = <SkeletonLoader /> }
    else if (error) { mainContent = <ErrorState message={error} /> }
    else if (filteredStudents.length === 0) { mainContent = <NoStudentsState /> }
    else {
        mainContent = (
            <div className="students-grid">
                {filteredStudents.map((student) => (
                    <StudentCard
                        key={student.id}
                        student={student}
                        onViewDetails={openStudentDetails}
                    />
                ))}
            </div>
        )
    }

    return (
        <div className="mx-auto p-4">
            <Header />

            <StudentFilters
                studentFilters={studentFilters}
                setStudentFilters={setStudentFilters}

                totalCount={students.length}
                visibleCount={filteredStudents.length}

                activeTags={activeTags}
                classes={classes} />

            

            {stats && hasPermission(PERMISSIONS.STUDENTS_STATS) && <StudentStatsSection stats={stats} />}

            <section className="mt-3">
                {mainContent}
            </section>

            <StudentDetailsModal
                isOpen={isDetailModalOpen}
                onClose={closeStudentDetails}
                studentId={selectedStudent}
                phone={selectedPhone}
            />
        </div>
    );
}
