function ExamSchemeRow({
  examScheme,
  setExamScheme,
  layout,
}) {

  const canRemove = examScheme.length > 1
  const blankExamRow = { date: '', day: '', examName: ''};


  // Exam Form Button Handler
  const handleChange = (index, field, value) => {
    setExamScheme((rows) => {
      const next = [...rows];
      next[index] = { ...next[index], [field]: value };
      return next;
    });
  };

  const onAddRow = () => {
    setExamScheme((rows) => [...rows, { ...blankExamRow }]);
  };

  const onMoveUp = (index) => {
    if (index === 0) return;
    setExamScheme((rows) => {
      const next = [...rows];
      [next[index - 1], next[index]] = [next[index], next[index - 1]];
      return next;
    });
  };

  const onMoveDown = (index) => {
    setExamScheme((rows) => {
      if (index === rows.length - 1) return rows;
      const next = [...rows];
      [next[index + 1], next[index]] = [next[index], next[index + 1]];
      return next;
    });
  };

  const onRemove = (index) => {
    setExamScheme((rows) => {
      if (rows.length === 1) return rows;
      return rows.filter((_, rowIndex) => rowIndex !== index);
    });
  };


  const desktopRow = (
    <>
      <div className="bg-gray-800/50 rounded-t-lg border border-gray-600/50 p-4 grid grid-cols-12 gap-4 mb-2">
        <div className="col-span-1 text-xs font-medium text-gray-400 uppercase tracking-wider text-center">Order</div>
        <div className="col-span-3 text-xs font-medium text-gray-400 uppercase tracking-wider">Date</div>
        <div className="col-span-3 text-xs font-medium text-gray-400 uppercase tracking-wider">Day</div>
        <div className="col-span-3 text-xs font-medium text-gray-400 uppercase tracking-wider">Subject</div>
        <div className="col-span-2 text-xs font-medium text-gray-400 uppercase tracking-wider text-center">Actions</div>
      </div>

      <div className="space-y-3">
        {examScheme.map((row, index) => (
          < div key={index} className="exam-row bg-gray-800/30 rounded-lg border border-gray-600/30 p-4 grid grid-cols-12 gap-4 items-center transition-all duration-200 hover:border-gray-500/50 hover:bg-gray-800/40" >
            <div className="col-span-1 flex justify-center">
              <span className="text-sm font-medium text-gray-300">{index + 1}</span>
            </div>
            <div className="col-span-3">
              <input
                type="text"
                value={row.date}
                onChange={(e) => handleChange(index, 'date', e.target.value)}
                className="exam-date w-full rounded-lg border border-gray-600 bg-gray-800/50 text-white py-2.5 px-3 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 transition-all duration-200"
                placeholder="DD/MM/YYYY"
              />
            </div>
            <div className="col-span-3">
              <input
                type="text"
                value={row.day}
                onChange={(e) => handleChange(index, 'day', e.target.value)}
                className="exam-day w-full rounded-lg border border-gray-600 bg-gray-800/50 text-white py-2.5 px-3 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 transition-all duration-200"
                placeholder="e.g. Monday"
              />
            </div>
            <div className="col-span-3">
              <input
                type="text"
                value={row.examName}
                onChange={(e) => handleChange('index', 'examName', e.target.value )}
                className="exam-name w-full rounded-lg border border-gray-600 bg-gray-800/50 text-white py-2.5 px-3 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 transition-all duration-200"
                placeholder="e.g. English"
              />
            </div>
            <div className="col-span-2 flex justify-center space-x-2">
              <button
                type="button"
                onClick={() => onMoveUp(index)}
                disabled={index === 0}
                className="move-up inline-flex items-center p-2 border border-transparent rounded-lg text-white bg-blue-600/80 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 focus:ring-offset-gray-900 transition-all duration-200 shadow-sm disabled:opacity-50"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 15l7-7 7 7" />
                </svg>
              </button>
              <button
                type="button"
                onClick={() => onMoveDown(index)}
                disabled={index === examScheme.length - 1}
                className="move-down inline-flex items-center p-2 border border-transparent rounded-lg text-white bg-blue-600/80 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 focus:ring-offset-gray-900 transition-all duration-200 shadow-sm disabled:opacity-50"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              <button
                type="button"
                onClick={() => onRemove(index)}
                disabled={!canRemove}
                className="remove-exam-row inline-flex items-center p-2 border border-transparent rounded-lg text-white bg-red-600/80 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 focus:ring-offset-gray-900 transition-all duration-200 shadow-sm disabled:opacity-50"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>

        ))
        }
      </div >


      <div className="flex justify-center mt-4">
        <button
          type="button"
          onClick={onAddRow}
          className="inline-flex items-center px-4 py-2.5 border border-transparent text-sm font-medium rounded-lg text-white bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 focus:ring-offset-gray-900 shadow-md transition-all duration-200 w-full sm:w-auto"
        >
          Add Exam
        </button>
      </div>

    </>
  );

  const mobileRow = (
    <>
      <div className="space-y-4">
        {examScheme.map((row, index) => (
          <div key={index} className="exam-row-mobile bg-gray-800/30 rounded-xl border border-gray-600/30 p-4 transition-all duration-200 hover:border-gray-500/50 hover:bg-gray-800/40">
            <div className="flex items-center justify-between mb-3 pb-3 border-b border-gray-600/30">
              <div className="flex items-center space-x-3">
                <span className="text-sm font-medium text-gray-300">Exam {index + 1}</span>
              </div>
              <div className="flex space-x-2">
                <button
                  type="button"
                  onClick={() => onMoveUp(index)}
                  disabled={index === 0}
                  className="move-up inline-flex items-center p-1.5 border border-transparent rounded-lg text-white bg-blue-600/80 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 focus:ring-offset-gray-900 transition-all duration-200 shadow-sm disabled:opacity-50"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 15l7-7 7 7" />
                  </svg>
                </button>
                <button
                  type="button"
                  onClick={() => onMoveDown(index)}
                  disabled={index === examScheme.length - 1}
                  className="move-down inline-flex items-center p-1.5 border border-transparent rounded-lg text-white bg-blue-600/80 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 focus:ring-offset-gray-900 transition-all duration-200 shadow-sm disabled:opacity-50"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                <button
                  type="button"
                  onClick={() => onRemove(index)}
                  disabled={!canRemove}
                  className="remove-exam-row inline-flex items-center p-1.5 border border-transparent rounded-lg text-white bg-red-600/80 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 focus:ring-offset-gray-900 transition-all duration-200 shadow-sm disabled:opacity-50"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-gray-400 mb-2">Date</label>
                <input
                  type="text"
                  value={row.date}
                  onChange={(e) => handleChange(index, 'date', e.target.value)}
                  className="exam-date w-full rounded-lg border border-gray-600 bg-gray-800/50 text-white py-2.5 px-3 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 transition-all duration-200"
                  placeholder="DD/MM/YYYY"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-400 mb-2">Day</label>
                <input
                  type="text"
                  value={row.day}
                  onChange={(e) => handleChange(index, 'day', e.target.value)}
                  className="exam-day w-full rounded-lg border border-gray-600 bg-gray-800/50 text-white py-2.5 px-3 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 transition-all duration-200"
                  placeholder="e.g. Monday"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-400 mb-2">Subject</label>
                <input
                  type="text"
                  value={row.examName}
                  onChange={(e) => handleChange(index, 'examName', e.target.value)}
                  className="exam-name w-full rounded-lg border border-gray-600 bg-gray-800/50 text-white py-2.5 px-3 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 transition-all duration-200"
                  placeholder="e.g. English"
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="flex justify-center mt-4">
        <button
          type="button"
          onClick={onAddRow}
          className="inline-flex items-center px-4 py-2.5 border border-transparent text-sm font-medium rounded-lg text-white bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 focus:ring-offset-gray-900 shadow-md transition-all duration-200 w-full sm:w-auto"
        >
          Add Exam
        </button>
      </div>

    </>
  );



  return layout === 'mobile' ? mobileRow : desktopRow;
}

export default ExamSchemeRow;
