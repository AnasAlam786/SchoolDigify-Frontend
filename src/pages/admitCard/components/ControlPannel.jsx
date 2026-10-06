import { useState, useEffect } from 'react';
import ExamSchemeRow from './ExamSchemeRow.jsx';

function ControlPannel({
  classes,
  classError,
  isClassesLoading,

  fetchHTMLPreview,
  isHTMLloading,
}) {

  const [selectedClass, setSelectedClass] = useState("");
  const [admitHeading, setAdmitHeading] = useState("");
  const [schemeHeading, setSchemeHeading] = useState("");
  const [feeHeading, setFeeHeading] = useState("Fee Due Notice");

  const [selectedOutputs, setSelectedOutputs] = useState(['admit', 'scheme']);

  const [examScheme, setExamScheme] = useState(() => {
    try {
      const stored = localStorage.getItem('admitExamScheme');
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  const includesAdmit = selectedOutputs.includes('admit');
  const includesScheme = selectedOutputs.includes('scheme');
  const includesFee = selectedOutputs.includes('fee');


  useEffect(() => {
    try {
      localStorage.setItem('admitExamScheme', JSON.stringify(examScheme));
    } catch {
      // ignore
    }
  }, [examScheme]);

  const toggleOutput = (output) => {
    setSelectedOutputs((current) => {
      if (current.includes(output)) {
        return current.length === 1
          ? current
          : current.filter((item) => item !== output);
      }
      return current.length < 2 ? [...current, output] : current;
    });
  };

  const getOutputType = () => {
    const selected = new Set(selectedOutputs);
    if (selected.has('admit') && selected.has('scheme')) return 'admitScheme';
    if (selected.has('admit') && selected.has('fee')) return 'admitFee';
    if (selected.has('scheme') && selected.has('fee')) return 'schemeFee';
    if (selected.has('admit')) return 'admitOnly';
    if (selected.has('scheme')) return 'SchemeOnly';
    return 'feeOnly';
  };




  return (
    <div className="bg-[#1A1A1A] rounded-xl shadow-2xl p-4 sm:p-6 mb-6 border border-gray-700">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        <div>
          <label htmlFor="classSelect" className="block text-sm font-medium text-gray-300 mb-2">Select Class</label>
          <div>
            <select
              id="classSelect"
              value={selectedClass}
              onChange={(event) => setSelectedClass(event.target.value)}
              className={`w-full rounded-lg bg-gray-800/50 text-white py-3 px-4 shadow-sm focus:outline-none transition-all duration-200 backdrop-blur-sm 
                ${classError
                  ? 'border border-red-500 focus:border-red-500 focus:ring-2 focus:ring-red-500/30'
                  : 'border border-gray-600 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/30'
                }`}
            >
              <option value="" hidden className="bg-[#1b1a1b] text-gray-400">
                {isClassesLoading ? 'Loading classes...' : 'Select Class'}
              </option>

              {classes.map((item) => (
                <option
                  key={item.id}
                  value={item.id}
                  className="bg-[#1b1a1b] text-white"
                >
                  {item.class_name}
                </option>
              ))}
            </select>
          </div>
          <p
            className={`mt-2 text-xs ${classError
                ? "text-red-400 animate-pulse"
                : "text-gray-400"
              }`}
          >
            {classError
              ? classError
              : 'Select a class and click "Generate Preview"'}
          </p>
        </div>

        {includesAdmit && <div>
          <label htmlFor="admitHeading" className="block text-sm font-medium text-gray-300 mb-2">Admit Heading</label>
          <input
            id="admitHeading"
            value={admitHeading}
            onChange={(event) => setAdmitHeading(event.target.value)}
            className="w-full rounded-lg border border-gray-600 bg-gray-800/50 text-white py-3 px-4 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/30"
            placeholder="e.g. Half Yearly 2026"
          />
        </div>}

        {includesScheme && <div>
          <label htmlFor="schemeHeading" className="block text-sm font-medium text-gray-300 mb-2">Scheme Heading</label>
          <input
            id="schemeHeading"
            value={schemeHeading}
            onChange={(event) => setSchemeHeading(event.target.value)}
            className="w-full rounded-lg border border-gray-600 bg-gray-800/50 text-white py-3 px-4 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/30"
            placeholder="e.g. Timing:- 8:30 to 11:30"
          />
        </div>}

        {includesFee && <div>
          <label htmlFor="feeHeading" className="block text-sm font-medium text-gray-300 mb-2">Fee Notice Heading</label>
          <input
            id="feeHeading"
            value={feeHeading}
            onChange={(event) => setFeeHeading(event.target.value)}
            className="w-full rounded-lg border border-gray-600 bg-gray-800/50 text-white py-3 px-4 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/30"
            placeholder="e.g. Fee Due Notice"
          />
        </div>}
      </div>

      <div className="mb-6">
        <div className="mb-3">
          <h3 className="text-sm font-medium text-gray-300">What do you want to print?</h3>
          <p className="mt-1 text-xs text-gray-400">Choose one item, or choose two to print them together. Maximum: 2.</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {[
            { id: 'admit', label: 'Admit Card', description: 'Student exam entry card' },
            { id: 'scheme', label: 'Exam Scheme', description: 'Exam dates and subjects' },
            { id: 'fee', label: 'Fee Due Notice', description: 'Unpaid due months and terms' },
          ].map((option) => (
            <label
              key={option.id}
              htmlFor={`output-${option.id}`}
              className={`flex cursor-pointer items-start gap-3 rounded-lg border p-4 transition-colors ${
                selectedOutputs.includes(option.id)
                  ? 'border-indigo-400 bg-indigo-500/10'
                  : selectedOutputs.length === 2
                    ? 'border-gray-700 bg-gray-900/40 opacity-60'
                    : 'border-gray-600/50 bg-gray-800/30 hover:border-indigo-500/50'
              }`}
            >
              <input
                id={`output-${option.id}`}
                type="checkbox"
                checked={selectedOutputs.includes(option.id)}
                disabled={selectedOutputs.length === 2 && !selectedOutputs.includes(option.id)}
                onChange={() => toggleOutput(option.id)}
                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-600 bg-gray-700"
              />
              <span>
                <span className="block text-sm font-semibold text-gray-200">{option.label}</span>
                <span className="mt-1 block text-xs text-gray-400">{option.description}</span>
              </span>
            </label>
          ))}
        </div>
        <p className="mt-2 text-xs text-gray-400">Selected: {selectedOutputs.length} of 2</p>
      </div>

      {includesScheme && <div id="examSchemeContainer">
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
      </div>}

      <div className="mt-6 pt-6 border-t border-gray-700">
        <button
          type="button"
          onClick={() => fetchHTMLPreview(selectedClass, admitHeading, schemeHeading, getOutputType(), examScheme, feeHeading)}
          disabled={isHTMLloading || selectedOutputs.length === 0}
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
