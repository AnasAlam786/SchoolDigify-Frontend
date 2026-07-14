import { useState, useEffect } from 'react';
import ExamSchemeRow from './ExamSchemeRow.jsx';

function ControlPannel({
  classes,
  isClassesLoading,

  fetchHTMLPreview,
  isHTMLloading,
  HTMLFetchError,
}) {

  const [selectedClass, setSelectedClass] = useState("");
  const [exam, setExam] = useState("");
  const [year, setYear] = useState("");
  const [outputType, setOutputType] = useState('both');
  const [examScheme, setExamScheme] = useState(() => {
    try {
      const stored = localStorage.getItem('admitExamScheme');
      return stored ? JSON.parse(stored) : [];
    } catch (e) {
      return [];
    }
  });


  useEffect(() => {
    try {
      localStorage.setItem('admitExamScheme', JSON.stringify(examScheme));
    } catch (e) {
      // ignore
    }
  }, [examScheme]);



  return (
    <div className="bg-[#1A1A1A] rounded-xl shadow-2xl p-4 sm:p-6 mb-6 border border-gray-700">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        <div>
          <label htmlFor="classSelect" className="block text-sm font-medium text-gray-300 mb-2">Select Class</label>
          <select
            id="classSelect"
            value={selectedClass}
            onChange={(event) => setSelectedClass(event.target.value)}
            className="w-full rounded-lg border border-gray-600 bg-gray-800/50 text-white py-3 px-4 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 transition-all duration-200 backdrop-blur-sm"
          >
            <option value="" hidden>
              {isClassesLoading ? 'Loading classes...' : 'Select Class'}
            </option>
            {classes.map((item) => (
              <option key={item.id} value={item.id}>
                {item.class_name}
              </option>
            ))}
          </select>
          <p
            className={`mt-2 text-xs ${HTMLFetchError ? "text-red-400" : "text-gray-400"
              }`}
          >
            {HTMLFetchError
              ? HTMLFetchError
              : 'Select a class and click "Generate Preview"'}
          </p>
        </div>

        <div>
          <label htmlFor="examInput" className="block text-sm font-medium text-gray-300 mb-2">Exam</label>
          <input
            id="examInput"
            value={exam}
            onChange={(event) => setExam(event.target.value)}
            className="w-full rounded-lg border border-gray-600 bg-gray-800/50 text-white py-3 px-4 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 transition-all duration-200 backdrop-blur-sm"
            placeholder="e.g. Half Yearly"
          />
        </div>

        <div>
          <label htmlFor="yearInput" className="block text-sm font-medium text-gray-300 mb-2">Year</label>
          <input
            id="yearInput"
            value={year}
            onChange={(event) => setYear(event.target.value)}
            className="w-full rounded-lg border border-gray-600 bg-gray-800/50 text-white py-3 px-4 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 transition-all duration-200 backdrop-blur-sm"
            placeholder="e.g. 2025"
          />
        </div>
      </div>

      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-300 mb-3">Select Output Type</label>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {[
            { id: 'examSchemeOnly', label: 'Exam Scheme Only', value: 'SchemeOnly' },
            { id: 'admitCardOnly', label: 'Admit Card Only', value: 'admitOnly' },
            { id: 'both', label: 'Both', value: 'both' }
          ].map((option) => (
            <div
              key={option.id}
              className="flex items-center bg-gray-800/30 rounded-lg p-3 border border-gray-600/50 hover:border-indigo-500/30 transition-colors duration-200"
            >
              <input
                id={option.id}
                type="radio"
                name="outputType"
                value={option.value}
                checked={outputType === option.value}
                onChange={(event) => setOutputType(event.target.value)}
                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-600 bg-gray-700"
              />
              <label htmlFor={option.id} className="ml-3 block text-sm text-gray-300">
                {option.label}
              </label>
            </div>
          ))}
        </div>
      </div>

      <div className={outputType === 'admitOnly' ? 'hidden' : ''} id="examSchemeContainer">
        <div className="flex flex-col mb-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
            <div>
              <h3 className="text-lg font-medium text-gray-300">Exam Schedule</h3>
              <p className="text-sm text-gray-400 mt-1">Add exam dates and subjects in order</p>
            </div>
          </div>

          <div className="hidden lg:block">
            <ExamSchemeRow
              examScheme={examScheme}
              setExamScheme={setExamScheme}
              layout="desktop"
            />
          </div>

          <div className="lg:hidden">
            <ExamSchemeRow
              examScheme={examScheme}
              setExamScheme={setExamScheme}
              layout="mobile"
            />
          </div>
        </div>
      </div>

      <div className="mt-6 pt-6 border-t border-gray-700">
        <button
          type="button"
          onClick={() => fetchHTMLPreview(selectedClass, exam, year, outputType, examScheme)}
          disabled={isHTMLloading}
          className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-medium py-3.5 px-4 rounded-lg transition-all duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 focus:ring-offset-gray-900 shadow-lg hover:shadow-indigo-500/20 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
          </svg>
          Generate Preview
        </button>
      </div>
    </div>
  );
}

export default ControlPannel;
