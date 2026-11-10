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

    const schoolRollGapsQuery = useQuery({
        queryKey: ["schoolRollGaps"],
        enabled: hasPermission(PERMISSIONS.STUDENTS_STATS),
        queryFn: async ({ signal }) => {
            const response = await apiGet("/api/get_school_roll_gaps", { signal });
            const data = await response.json();
            if (!response.ok) {
                throw new Error(data?.error || "Failed to load school roll gaps.");
            }
            return data.gaps;
        },
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
                    <div ref={loadMoreRef} className="flex justify-center py-8" role="status" aria-live="polite">
                        <div className="flex items-center gap-3 rounded-full border border-gray-200/80 bg-white px-5 py-3 shadow-sm dark:border-gray-700 dark:bg-gray-900">
                            {studentsQuery.isFetchingNextPage ? (
                                <>
                                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-gray-200 border-t-blue-600 dark:border-gray-600 dark:border-t-blue-400"></div>
                                    <span className="text-sm font-medium text-gray-600 dark:text-gray-300">
                                        Loading more students
                                    </span>
                                </>
                            ) : (
                                <>
                                    <span className="h-2 w-2 animate-pulse rounded-full bg-blue-500"></span>
                                    <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
                                        Scroll to discover more students
                                    </span>
                                    <svg className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                                    </svg>
                                </>
                            )}
                        </div>
                    </div>
                )}

                {!studentsQuery.hasNextPage && !studentsQuery.isFetchNextPageError && students.length > 0 && (
                    <div className="flex justify-center py-10" role="status">
                        <div className="flex items-center gap-3">
                            <div className="h-px w-10 bg-gradient-to-r from-transparent to-gray-300 dark:to-gray-700"></div>
                            <div className="flex items-center gap-2 rounded-full border border-gray-200/80 bg-gray-50/80 px-4 py-2 dark:border-gray-700 dark:bg-gray-900/60">
                                <svg className="h-4 w-4 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                </svg>
                                <span className="text-xs font-medium tracking-wide text-gray-500 dark:text-gray-400">
                                    You've reached the end
                                </span>
                            </div>
                            <div className="h-px w-10 bg-gradient-to-l from-transparent to-gray-300 dark:to-gray-700"></div>
                        </div>
                    </div>
                )}

                {studentsQuery.isFetchNextPageError && (
                    <div className="flex justify-center px-4 py-8" role="alert">
                        <div className="flex w-full max-w-md items-center justify-between gap-4 rounded-2xl border border-red-200/80 bg-red-50/70 p-4 dark:border-red-900/50 dark:bg-red-950/20">
                            <div className="flex min-w-0 items-start gap-3">
                                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-red-100 text-red-600 dark:bg-red-900/40 dark:text-red-400">
                                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v4m0 4h.01M10.3 3.86L1.82 18a2 2 0 001.7 3h16.96a2 2 0 001.7-3L13.7 3.86a2 2 0 00-3.4 0z" />
                                    </svg>
                                </div>
                                <div className="min-w-0">
                                    <p className="text-sm font-semibold text-red-700 dark:text-red-400">
                                        Couldn't load students
                                    </p>
                                    <p className="mt-0.5 break-words text-xs text-red-600/80 dark:text-red-400/70">
                                        {studentsQuery.error?.message || "Something went wrong. Please try again."}
                                    </p>
                                </div>
                            </div>
                            <button
                                type="button"
                                onClick={() => studentsQuery.fetchNextPage()}
                                disabled={studentsQuery.isFetchingNextPage}
                                className="inline-flex shrink-0 items-center gap-2 rounded-xl bg-red-600 px-4 py-2 text-xs font-semibold text-white shadow-sm transition-all hover:bg-red-700 active:scale-95 disabled:cursor-not-allowed disabled:opacity-50"
                            >
                                <svg className={`h-3.5 w-3.5 ${studentsQuery.isFetchingNextPage ? "animate-spin" : ""}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M20 11a8.1 8.1 0 00-14.9-4M4 4v4h4m-4 5a8.1 8.1 0 0014.9 4M20 20v-4h-4" />
                                </svg>
                                Retry
                            </button>
                        </div>
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
                classes={classes}
                isClassesLoading={isClassesLoading}
                classError={classError} />



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
                            schoolRollGapsQuery.data && (
                                <RollNumberGapWarning gaps={schoolRollGapsQuery.data} />
                            )
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
