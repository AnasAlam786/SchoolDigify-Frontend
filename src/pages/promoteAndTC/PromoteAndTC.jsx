import React, { useEffect, useState, useRef } from 'react';
import FilterBar from './components/FilterBar';
import StudentCard from './components/StudentCard';
import PromotionModal from './Modals/PromotionModal';
import UpdatePromotionModal from './Modals/UpdatePromotionModal';
import TCModal from './Modals/TCModal';
import TCCancelModal from './Modals/TCCancelModal';
import DepromotionModal from './Modals/DepromotionModal';
import { LoadingSkeleton, InitialState } from './components/PageStatus';
import { ErrorState, NoStudentsState } from "../utils/GlobalPageStatus"
import { apiPost } from '../../api/api';
import "./style/PromoteAndTC.css"

export default function PromoteAndTC() {
    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [currentClassId, setCurrentClassId] = useState(null);
    const [activeFilter, setActiveFilter] = useState('ALL');
    const [searchTerm, setSearchTerm] = useState('');

    const [selectedStudentID, setSelectedStudentID] = useState(null);
    const [selectedPromotedStudentID, SetSelectedPromotedStudentID] = useState(null);


    const [isDepromotionModalOpen, setDepromotionModalOpen] = useState(null);
    const [isPromotionModalOpen, setPromotionModalOpen] = useState(null);
    const [isUpdatePromotionModalOpen, setUpdatePromotionModalOpen] = useState(null);
    const [isTcModalOpen, setTcModalOpen] = useState(null);
    const [isTCCancelModalOpen, setTCCancelModalOpen] = useState(null);

    const [studentsStatusStats, setStudentsStatusStats] = useState(
        { all: 0, promoted: 0, tc_issued: 0, no_action: 0 }
    );

    useEffect(() => {
        let stats = { all: 0, promoted: 0, tc_issued: 0, no_action: 0 };
        students.forEach(student => {
            stats.all++;
            if (student.state === 'PROMOTED') {
                stats.promoted++;
            } else if (student.state === 'TC_ISSUED') {
                stats.tc_issued++;
            } else {
                stats.no_action++;
            }
        });
        setStudentsStatusStats(stats);
    }, [students]);

    async function fetchStudentsByClass(classId) {
        setLoading(true);
        setError(null);
        setCurrentClassId(classId);
        try {
            const res = await apiPost('/api/promote-and-tc-data', { class_id: classId });
            const data = await res.json();
            if (res.ok) {
                const studentsData = data.students || [];
                const studentsStatusStats = data.students_status_stats || [];
                setStudents(studentsData || []);
                setStudentsStatusStats(studentsStatusStats);
                setSearchTerm('');
            } else {
                setStudents([]);
                setError(data.message || 'Unable to load students');
            }
        } catch (err) {
            console.error(err);
            setStudents([]);
            setError('Network error. Please check your connection.');
        } finally { setLoading(false); }
    }

    function updateStudentInLocalState(studentSessionId, payload) {
        setStudents((previousStudents) => {
            const updatedStudents = previousStudents.map((student) => {
                const isTargetStudent =
                    String(student.student_session_id) === String(studentSessionId) ||
                    String(student.id) === String(studentSessionId);

                if (isTargetStudent) {
                    const updatedStudent = {
                        ...student,
                        ...payload,
                    };

                    console.log("Updated Student:", updatedStudent);

                    return updatedStudent;
                }
                return student;
            });

            return updatedStudents;
        });
    }

    const filteredStudents = students.filter(s => {
        const matchesFilter = activeFilter === 'ALL' || s.state === activeFilter;
        const matchesSearch = (
            searchTerm === '' || 
            s.STUDENTS_NAME.toLowerCase().includes(searchTerm) || 
            s.FATHERS_NAME.toLowerCase().includes(searchTerm) || 
            (s.PEN && String(s.PEN).toLowerCase().startsWith(searchTerm)) ||
            (s.previous_roll && String(s.previous_roll).toLowerCase().startsWith(searchTerm))
        );
        return matchesFilter && matchesSearch;
    });

    return (
        <>
            <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
                <div>
                    <h1 className="text-2xl md:text-3xl font-bold text-green-400">Student Promotion Portal</h1>
                    <p className="text-gray-400 mt-1 text-sm md:text-base max-w-2xl">Manage promotions, issue TCs, and track student progress across academic sessions.</p>
                </div>
            </div>

            <div className="space-y-4 mb-8">
                <FilterBar

                    searchTerm={searchTerm}
                    setSearchTerm={setSearchTerm}
                    fetchStudentsByClass={fetchStudentsByClass}

                    activeFilter={activeFilter}
                    setActiveFilter={setActiveFilter}

                    studentsStatusStats={studentsStatusStats}
                />
            </div>

            <div >
                {!currentClassId && (<InitialState />)}

                {currentClassId && loading && <LoadingSkeleton />}

                {currentClassId && error && (<ErrorState onRetry={() => fetchStudentsByClass(currentClassId)} />)}

                {currentClassId && !loading && !error && filteredStudents.length === 0 && (<NoStudentsState />)}

                {currentClassId && !loading && !error && filteredStudents.length > 0 && (
                    <div className="promotion-cards">
                        {filteredStudents.map(s => (
                            <StudentCard
                                key={s.student_session_id || s.id}
                                student={s}

                                onOpenPromotion={(studentId) => {
                                    setPromotionModalOpen(true)
                                    setSelectedStudentID(studentId)
                                }}
                                onOpenDepromotion={(oldStudentSessionID, promotedStudentId) => {
                                    setDepromotionModalOpen(true)
                                    SetSelectedPromotedStudentID(promotedStudentId)
                                    setSelectedStudentID(oldStudentSessionID)
                                }}
                                onOpenUpdatePromotion={(oldStudentSessionID, promotedStudentId) => {
                                    setUpdatePromotionModalOpen(true)
                                    SetSelectedPromotedStudentID(promotedStudentId)
                                    setSelectedStudentID(oldStudentSessionID)
                                }}
                                onOpenTC={(studentId) => {
                                    setTcModalOpen(true)
                                    setSelectedStudentID(studentId)
                                }}
                                onOpenTCCancel={(studentId) => {
                                    setTCCancelModalOpen(true)
                                    setSelectedStudentID(studentId)
                                }}
                            />
                        ))}
                    </div>
                )}
            </div>

            {/* Handle Promote Student and updating promoted student data. */}
            {selectedStudentID && isPromotionModalOpen && (
                <PromotionModal
                    studentId={selectedStudentID}
                    onUpdateLocal={updateStudentInLocalState}
                    onClose={() => {
                        setPromotionModalOpen(false);
                        setSelectedStudentID(null);
                    }}
                />
            )}

            {/* Handle updating the already promoted studnt details*/}
            {selectedStudentID && isUpdatePromotionModalOpen && (
                <UpdatePromotionModal
                    oldStudentSessionID={selectedStudentID}
                    promotedStudentId={selectedPromotedStudentID}
                    onUpdateLocal={updateStudentInLocalState}
                    onClose={() => {
                        setUpdatePromotionModalOpen(false);
                        setSelectedStudentID(null);
                    }} />
            )}

            {/* Handle TC Generationa and reverting cancelled tc. */}
            {selectedStudentID && isTcModalOpen && (
                <TCModal
                    studentId={selectedStudentID}
                    onUpdateLocal={updateStudentInLocalState}
                    onClose={() => {
                        setTcModalOpen(false)
                        setSelectedStudentID(null)
                    }}
                />
            )}

            {/* Handle Depromoting Student and deletinf new session record*/}
            {selectedStudentID && isDepromotionModalOpen && (
                <DepromotionModal
                    oldStudentSessionID={selectedStudentID}
                    promotedStudentId={selectedPromotedStudentID}
                    onUpdateLocal={updateStudentInLocalState}
                    onClose={() => {
                        setDepromotionModalOpen(false)
                        setSelectedStudentID(null)
                    }}
                />
            )}

            {/* Soft deleting and cancelling the tc */}
            {selectedStudentID && isTCCancelModalOpen && (
                <TCCancelModal
                    studentId={selectedStudentID}
                    onUpdateLocal={updateStudentInLocalState}
                    onClose={() => {
                        setTCCancelModalOpen(false)
                        setSelectedStudentID(null)
                    }}
                />
            )}
        </>
    );
}
