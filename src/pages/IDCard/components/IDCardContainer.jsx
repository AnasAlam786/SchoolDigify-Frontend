import React, { useEffect } from 'react';
import IDCardPreview from "../components/IDCardPreview";


function IDCardContainer({ filteredStudents, selectedStudents, schoolData, setSelectedStudents }) {

    const toggleSelection = (studentId) => {
        setSelectedStudents(prev => {
            const updated = new Set(prev);

            if (updated.has(studentId)) {
                updated.delete(studentId);
            } else {
                updated.add(studentId);
            }

            return updated;
        });
    };

    return (
        <div className="flex flex-wrap justify-center gap-6 mt-5">
            {filteredStudents.map((student, index) => {

                const isSelected = selectedStudents.has(student.student_id);
                return (
                    <div key={student.student_id} onClick={() => toggleSelection(student.student_id)}
                        className={`relative bg-gray-800 rounded-xl overflow-hidden shadow-lg 
                        transition-all duration-300 hover:scale-105 cursor-pointer
                        ${isSelected ? "ring-4 ring-blue-500 bg-blue-900/20" : "bg-gray-800 hover:scale-105"}`}>

                        <IDCardPreview key={index} student={student} school={schoolData}/>
                        <div className='p-3 bg-gray-700 border-t border-gray-600'>
                            <div className="text-white font-semibold text-sm mb-1">{student.student_name}</div>
                            <div className="text-gray-400 text-xs">Class: {student.class+" - "+student.roll}</div>

                        </div>
                        {isSelected && (
                            <div className="absolute top-2 right-2 w-7 h-7 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold shadow-lg">
                                ✓
                            </div>
                        )}
                    </div>
                )
            })}
        </div>
    )
}
export default IDCardContainer
