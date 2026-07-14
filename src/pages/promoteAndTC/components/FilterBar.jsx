import React, { useEffect, useState } from 'react';
import { fetchClasses } from '../../utils/fetchClasses';

export default function FilterBar(
    { searchTerm, setSearchTerm, fetchStudentsByClass, activeFilter, setActiveFilter, studentsStatusStats }
) {
    const [classes, setClasses] = useState([]);
    const [selectedClass, setSelectedClass] = useState('');

    useEffect(() => {
        const loadClasses = async () => {
            const classData = await fetchClasses();
            setClasses(classData);
        };
        loadClasses()
    }, [])

    const handleClassChange = async (classId) => {
        setSelectedClass(classId);
        fetchStudentsByClass(classId);
    };


    return (
        <div className="space-y-4">
            <div className="relative">
                <i className="fas fa-search absolute left-4 top-1/2 -translate-y-1/2 text-gray-500"></i>
                <input onChange={e => setSearchTerm(e.target.value)}  value={searchTerm}
                placeholder="Search by name, father name, roll no or PEN number..." 
                className="w-full bg-[#1e1e1e] border border-gray-800 rounded-xl py-3.5 pl-12 pr-12 text-white placeholder-gray-500 focus:outline-none" />
            </div>

            <div className="relative">
                <i className="fas fa-layer-group absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 z-10"></i>
                <select value={selectedClass}
                    className="w-full bg-[#1e1e1e] border border-gray-800 rounded-xl py-3.5 pl-12 pr-10 text-white appearance-none"
                    onChange={(e) => handleClassChange(e.target.value)}>
                    <option value="" disabled>Select a class</option>
                    {classes.map(c => <option key={c.id} value={c.id}>{c.class_name}</option>)}
                </select>
                <i className="fas fa-chevron-down absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"></i>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-4">

                <button onClick={() => setActiveFilter('ALL')}
                    className={`
                        filter-btn text-white rounded-xl px-4 py-3 flex items-center 
                        justify-between gap-2 transition-all duration-200 border border-transparent 
                        ${activeFilter === 'ALL' ? 'bg-blue-600 hover:bg-blue-500 border-blue-500' : 'hover:border-blue-600 bg-gray-800 hover:bg-gray-700'}  `}>
                    <span className="font-medium">All</span>
                    <span className="bg-blue-900/50 px-3 py-1 rounded-full text-sm tabular-nums text-amber-300" id="badge-all-count">
                        {studentsStatusStats.all || 0}
                    </span>
                </button>

                <button onClick={() => setActiveFilter('PROMOTED')}
                    className={`
                        filter-btn text-white rounded-xl px-4 py-3 flex items-center 
                        justify-between gap-2 transition-all duration-200 border border-transparent
                        ${activeFilter === 'PROMOTED' ? 'bg-green-600 hover:bg-green-500 border-green-500' : 'hover:border-green-600 bg-gray-800 hover:bg-gray-700'} `}>
                    <span className="font-medium">Promoted</span>
                    <span className="bg-green-900/50 px-3 py-1 rounded-full text-sm tabular-nums text-green-300" id="badge-promoted-count">
                        {studentsStatusStats.promoted || 0}
                    </span>
                </button>

                <button onClick={() => setActiveFilter('TC_ISSUED')}
                    className={`
                        filter-btntext-white rounded-xl px-4 py-3 flex items-center 
                        justify-between gap-2 transition-all duration-200 border border-transparent
                        ${activeFilter === 'TC_ISSUED' ? 'bg-amber-600 hover:bg-amber-500 border-amber-500' : 'hover:border-amber-600 bg-gray-800 hover:bg-gray-700'}
                        `}>
                    <span className="font-medium">TC Issued</span>
                    <span className="bg-amber-900/50 px-3 py-1 rounded-full text-sm tabular-nums text-amber-300" id="badge-tc-count">
                        {studentsStatusStats.tc_issued || 0}
                    </span>
                </button>

                <button onClick={() => setActiveFilter('NOT_PROMOTED_NOT_TC')}
                    className={`
                        filter-btn text-white rounded-xl px-4 py-3 flex items-center justify-between gap-2 transition-all 
                        duration-200 border border-transparent
                        ${activeFilter === 'NOT_PROMOTED_NOT_TC' ? 'bg-gray-600 hover:bg-gray-500 border-gray-500' : 'hover:border-gray-600 bg-gray-800 hover:bg-gray-700'}
                        `}>
                    <span className="font-medium">No Action</span>
                    <span className="bg-gray-900/50 px-3 py-1 rounded-full text-sm tabular-nums text-gray-300" id="badge-none-count">
                        {studentsStatusStats.no_action || 0}
                    </span>
                </button>

            </div>
        </div>
    );
}
