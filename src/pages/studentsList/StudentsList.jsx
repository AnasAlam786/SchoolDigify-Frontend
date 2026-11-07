import { useEffect, useMemo, useState, useCallback } from "react";
import { useInfiniteQuery, useQuery, useQueryClient } from "@tanstack/react-query";
import { useInView } from "react-intersection-observer";
import { apiGet } from "../../api/api";
import StudentFilters from "./components/StudentFilters";
import StudentCard from "./components/StudentCard";
import StudentStatsSection from "./components/StudentStatsSection";
import StudentDetailsModal from "../utils/StudentsDetailsModal.jsx/StudentDetailsModal";
import Header from "./components/Header";
import { useClasses } from "../../hooks/useClasses";
import "./style/StudentsList.css";
import SkeletonLoader from "./components/PageStatus";
import { ErrorState, NoStudentsState } from "../utils/GlobalPageStatus";
import { DEFAULT_FILTERS } from "./components/StudentsFilter";

import FeeDrawer from "../utils/feeDrawer/FeeDrawer";
import FeeSessionSetupModal from "../utils/feeSessionSetup/FeeSessionSetupModal";
import TransactionModal from '../utils/feeTransactionsModal/TransactionModal';
import RollNumberGapWarning from "./components/RollNumberGapWarning";
import { createStudentRegisterHtml } from "./components/StudentRegisterPrint";

import usePermission from "../../hooks/usePermission";

export default function StudentsList() {

    const { hasPermission, PERMISSIONS } = usePermission()
    const queryClient = useQueryClient();

    const [studentFilters, setStudentFilters] = useState(DEFAULT_FILTERS);
    const [debouncedSearch, setDebouncedSearch] = useState(DEFAULT_FILTERS.search);
    const [debouncedSearchIn, setDebouncedSearchIn] = useState(DEFAULT_FILTERS.searchIn);

    useEffect(() => {
        const timeoutId = setTimeout(() => {
            setDebouncedSearch(studentFilters.search);
            setDebouncedSearchIn(studentFilters.searchIn);
        }, 500);

        return () => clearTimeout(timeoutId);
    }, [studentFilters.search]);

    const [selectedStudent, setSelectedStudent] = useState(null);
    const [isDetailModalOpen, setDetailModalOpen] = useState(false);
    const [selectedPhone, setSelectedPhone] = useState("");

    const [feeDrawerOpen, setFeeDrawerOpen] = useState(false);
    const [feeDrawerStudent, setFeeDrawerStudent] = useState({});
    const [feeSessionSetup, setFeeSessionSetup] = useState(null);

    const [isTransactionModalOpen, setTransactionModalOpen] = useState(false);
    const [transactionModalStudent, setTransactionModalStudent] = useState({});

    const { 
        data: classes = [], isPending: isClassesLoading, error: classError 
    } = useClasses();


    const queryParams = useMemo(() => ({
        search: debouncedSearch,
        searchIn: debouncedSearch.trim()
            ? studentFilters.search === debouncedSearch
                ? studentFilters.searchIn
                : debouncedSearchIn
            : "all",
        classView: studentFilters.classView,
        sortBy: studentFilters.sortBy,
        sortDir: studentFilters.sortDir,
        filterRTE: String(studentFilters.filterRTE),
        filterPEN: studentFilters.filterPEN,
        filterGender: studentFilters.filterGender,
        filterAdmission: studentFilters.filterAdmission,
    }), [studentFilters, debouncedSearch, debouncedSearchIn]);

    const getStudentsData = async ({ queryParams, pageParam, signal }) => {
        const searchParams = new URLSearchParams(queryParams);
        searchParams.set("page", String(pageParam));

        const response = await apiGet(
            `/api/get_students_data?${searchParams.toString()}`,
            { signal }
        );
        const data = await response.json();
        if (!response.ok) {
            throw new Error(data?.error || "Failed to load students data.");
        }
        return data;
    };

    const getStudentStats = async ({ signal }) => {
        const response = await apiGet(
            "/api/get_students_stats",
            { signal }
        );
        const data = await response.json();
        if (!response.ok) {
            throw new Error(data?.error || "Failed to load student statistics.");
        }
        return data;
    };

    const studentsQuery = useInfiniteQuery({
        queryKey: ["students", queryParams],
        initialPageParam: 1,
        queryFn: ({ pageParam, signal }) =>
            getStudentsData({ queryParams, pageParam, signal }),
        getNextPageParam: (lastPage) =>
            lastPage.has_more ? lastPage.page + 1 : undefined,
    });

    const statsQuery = useQuery({
        queryKey: ["studentStats"],
        enabled: hasPermission(PERMISSIONS.STUDENTS_STATS),
        queryFn: getStudentStats,
    });



    const students = studentsQuery.data?.pages.flatMap((page) => page.students) ?? [];
    const filteredStudentsCount = studentsQuery.data?.pages[0]?.total_count ?? 0;
    const totalStudentsCount = statsQuery.data?.total_students ?? 0;

    const { ref: loadMoreRef, inView } = useInView({ threshold: 0 });
    useEffect(() => {
        if (
            inView &&
            studentsQuery.hasNextPage &&
            !studentsQuery.isFetching &&
            !studentsQuery.isFetchNextPageError
        ) {
            studentsQuery.fetchNextPage();
        }
    }, [
        inView,
        studentsQuery.hasNextPage,
        studentsQuery.isFetching,
        studentsQuery.isFetchNextPageError,
        studentsQuery.fetchNextPage,
    ]);

    const printStudentRegister = useCallback(async () => {
        const printWindow = window.open("", "_blank");
        if (!printWindow) {
            alert("Pop-up blocked. Please allow pop-ups to print the student register.");
            return;
        }

        try {
            const response = await apiGet("/api/get_students_print_data");
            if (!response.ok) {
                throw new Error("Failed to load student register data.");
            }
            const data = await response.json();
            if (!Array.isArray(data.students)) {
                throw new Error("Student register data is unavailable.");
            }

            printWindow.document.open();
            printWindow.document.write(createStudentRegisterHtml(data.students));
            printWindow.document.close();
            printWindow.setTimeout(() => printWindow.print(), 250);
        } catch (err) {
            printWindow.close();
            alert(err.message || "Unable to print the student register.");
        }
    }, []);



    const handleStudentImageUpdated = useCallback((studentId, nextImageId) => {
        queryClient.setQueryData(["students", queryParams], (previous) => {
            if (!previous) return previous;
            return {
                ...previous,
                pages: previous.pages.map((page) => ({
                    ...page,
                    students: page.students.map((student) =>
                        String(student.id) === String(studentId)
                            ? { ...student, IMAGE: nextImageId ?? student.IMAGE }
                            : student
                    ),
                })),
            };
        });
    }, [queryClient, queryParams]);


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


    const openFeeDrawer = useCallback((student) => {

        const studentSessionId = student?.student_session_id || student?.id;
        const studentPhone = student?.PHONE;
        setFeeDrawerStudent({ studentSessionId, studentPhone });

        setFeeDrawerOpen(true);
    }, []);

    const openTransactionModal = useCallback((studentSessionId, Phone) => {
        setTransactionModalStudent({ studentSessionId, phone: Phone });
        setTransactionModalOpen(true);
    }, []);

    const closeStudentDetails = useCallback(() => {
        setDetailModalOpen(false);
        setSelectedStudent(null);
        setSelectedPhone("");
    }, []);

    let mainContent;

    if (studentsQuery.isPending) { mainContent = <SkeletonLoader /> }
    else if (studentsQuery.isError && !studentsQuery.data) {
        mainContent = <ErrorState message={studentsQuery.error.message || "Unable to load student data."} />;
    }
    else if (students.length === 0) { mainContent = <NoStudentsState /> }
    else {
        mainContent = (
            <>
                <div className="students-grid">
                    {students.map((student) => (
                        <StudentCard
                            key={student.id}
                            student={student}
                            onViewDetails={openStudentDetails}
                            onPayFees={openFeeDrawer}
                            onImageUpdated={handleStudentImageUpdated}
                        />
                    ))}
                </div>
                {studentsQuery.hasNextPage && (
                    <div ref={loadMoreRef} className="py-5 text-center text-sm text-gray-400" role="status">
                        {studentsQuery.isFetchingNextPage ? "Loading more students..." : "Scroll for more students"}
                    </div>
                )}
                {!studentsQuery.hasNextPage && (
                    <div className="py-5 text-center text-sm text-gray-500" role="status">
                        End of student list
                    </div>
                )}
                {studentsQuery.isFetchNextPageError && (
                    <div className="py-3 text-center text-sm text-red-400" role="alert">
                        {studentsQuery.error.message || "Unable to load more students."}
                        <button
                            type="button"
                            onClick={() => studentsQuery.fetchNextPage()}
                            className="ml-2 underline"
                        >Retry</button>
                    </div>
                )}
            </>
        )
    }

    return (
        <div className="mx-auto">
            <Header onPrintStudentRegister={printStudentRegister} />

            <StudentFilters
                studentFilters={studentFilters}
                setStudentFilters={setStudentFilters}

                filteredStudentsCount={filteredStudentsCount}
                totalStudentsCount={totalStudentsCount}

                activeTags={activeTags}
                classes={classes} />



            {statsQuery.data && hasPermission(PERMISSIONS.STUDENTS_STATS) && (
                <>
                    <StudentStatsSection stats={statsQuery.data} />
                    {
                        !studentFilters.search &&
                        studentFilters.classView === "All" &&
                        !studentFilters.filterRTE &&
                        studentFilters.filterPEN === "any" &&
                        studentFilters.filterGender === "any" &&
                        studentFilters.filterAdmission === "any" && (
                            <RollNumberGapWarning students={students} />
                        )}
                </>
            )}
            {statsQuery.isError && hasPermission(PERMISSIONS.STUDENTS_STATS) && (
                <p className="my-3 text-sm text-red-400" role="alert">
                    {statsQuery.error.message || "Unable to load student statistics."}
                </p>
            )}

            <section className="mt-3">
                {mainContent}
            </section>

            {isDetailModalOpen && (
                <StudentDetailsModal
                    onClose={closeStudentDetails}
                    studentId={selectedStudent}
                    phone={selectedPhone}
                />
            )}

            {feeDrawerOpen && (
                <FeeDrawer
                    feeDrawerStudent={feeDrawerStudent}
                    onClose={() => { setFeeDrawerOpen(false); }}
                    onSetupFeeSession={setFeeSessionSetup}
                    setTransactionModalOpen={openTransactionModal}
                />
            )}

            {isTransactionModalOpen &&
                <TransactionModal
                    transactionModalStudent={transactionModalStudent}
                    onClose={() => setTransactionModalOpen(false)}
                />
            }

            {feeSessionSetup && (
                <FeeSessionSetupModal
                    onClose={() => setFeeSessionSetup(null)}
                />
            )}
        </div>
    );
}
