import React from 'react'
import usePermission from '../../../hooks/usePermission'

function MarksTable(
  { students, selectedIds, setSelectedIds, handlePrintCertificate, handlePrintResult }) {

  const { hasPermission, PERMISSIONS } = usePermission()

  const renderHeaderCell = (examName, examData) => {
    const isGrandTotal = examName.includes('G. Total') || examName.includes('Grand')
    const isSummary = !isGrandTotal && (examName.includes('Total') || examName.includes('Grades'))

    if (isGrandTotal) {
      return (
        <th
          key={examName}
          className="py-4 px-2 text-center text-sm md:text-base font-bold uppercase tracking-wider 
            bg-gradient-to-b from-amber-950/80 to-amber-900/60 border-b-2 border-amber-700">
          <div className="flex flex-col items-center">
            <span className="text-amber-200">{examName}</span>
            <span className="text-xs px-2 py-1 mt-1 bg-amber-950/80 text-amber-300 rounded-full border 
                border-amber-700/60">
              {examData?.weightage ?? ''}
            </span>
          </div>
        </th>
      )
    }

    if (isSummary) {
      return (
        <th
          key={examName}
          className="py-4 px-2 text-center text-sm md:text-base font-bold uppercase tracking-wider 
          bg-gradient-to-b from-teal-950/70 to-teal-900/50 border-b-2 border-teal-700" >
          <div className="flex flex-col items-center">
            <span className="text-teal-100">{examName}</span>
            <span className="text-xs px-2 py-1 mt-1 bg-teal-950/60 text-teal-300 rounded-full border 
                border-teal-800/60">
              {examData?.weightage ?? ''}
            </span>
          </div>
        </th>
      )
    }

    return (
      <th
        key={examName}
        className="py-4 px-2 text-center text-sm md:text-base font-semibold uppercase tracking-wider border-b 
            border-gray-700" >
        <div className="flex flex-col items-center">
          <span>{examName}</span>
          <span className="text-xs px-3 py-1 mt-1 bg-blue-950/70 text-blue-300 rounded-full border border-blue-800/50">
            {examData?.weightage ?? ''}
          </span>
        </div>
      </th>
    )
  }


  const onToggleSelection = (studentId) => {
    setSelectedIds((prev) => {
      const next = new Set(prev)
      if (next.has(studentId)) {
        next.delete(studentId)
      } else {
        next.add(studentId)
      }
      return next
    })
  }

  return (
    <div className="space-y-6">
      {students.map((student) => {
        const marks = student.marks || {}
        const examNames = Object.keys(marks)
        const firstExam = marks[examNames[0]]
        const subjects = firstExam?.subject_marks_dict ? Object.keys(firstExam.subject_marks_dict) : []
        const gTotal = marks['G. Total'] || marks['Grand Total'] || null
        const percentageValue = gTotal?.percentage ?? ''
        const isSelected = selectedIds.has(student.student_id)

        return (
          <div
            key={student.student_id}
            className="marks-card bg-[#1A1A1A] backdrop-blur-sm mt-6 border border-gray-800 shadow-xl 
                hover:shadow-2xl transition-all duration-300 rounded-2xl overflow-hidden">
            {/* <!-- Student Header - Modern Design --> */}
            <div className="p-5 flex flex-col lg:flex-row lg:items-start justify-between gap-1 bg-[#1A1A1A]">
              <div className="flex-1">
                {/* <!-- Student Info Row --> */}
                <div className="flex items-start gap-4 mb-4">


                  {/* <!-- Profile Icon --> */}
                  {hasPermission(PERMISSIONS.GET_RESULT) && (
                    <div className="relative mt-1">
                      <input
                        type="checkbox"
                        className="student-checkbox absolute opacity-0 w-6 h-6 cursor-pointer z-10"
                        value={student.student_id}
                        id={`student-${student.student_id}`}
                        checked={isSelected}
                        onChange={() => onToggleSelection(student.student_id)}
                      />

                      <div className="w-6 h-6 md:w-7 md:h-7 rounded-lg border-2 border-gray-600 bg-[#1A1A1A]/70 
                          flex items-center justify-center transition-all duration-200 checkbox-ui group 
                          hover:border-blue-500">
                        <svg
                          className="w-4 h-4 text-white hidden check-icon"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24" >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7">

                          </path>
                        </svg>
                      </div>
                    </div>
                  )}

                  <div className="flex-1">
                    <div className="mb-2">
                      <h3 className="text-xl md:text-2xl font-bold text-white mb-1">{student.STUDENTS_NAME}</h3>
                      <p className="text-gray-300 text-sm md:text-base">
                        <i className="fas fa-user-friends mr-2"></i>
                        Father: {student.FATHERS_NAME}
                      </p>
                    </div>

                    <div className="flex flex-wrap gap-3 mt-4">
                      <div className="px-4 py-2.5 bg-gradient-to-r from-[#1A1A1A]/90 to-[#232323]/70 rounded-xl 
                      border border-gray-700/60">
                        <p className="text-xs text-gray-300 mb-1">Roll</p>
                        <p className="text-sm md:text-base font-semibold text-white">{student.ROLL}</p>
                      </div>

                      <div className="px-4 py-2.5 bg-gradient-to-r from-[#1A1A1A]/90 to-[#232323]/70 rounded-xl 
                      border border-gray-700/60">
                        <p className="text-xs text-gray-300 mb-1">Class</p>
                        <p className="text-sm md:text-base font-semibold text-white">{student.CLASS}</p>
                      </div>

                      <div className="px-4 py-2.5 bg-gradient-to-r from-blue-950/60 to-blue-900/50 rounded-xl border border-blue-800/50">
                        <p className="text-xs text-blue-300 mb-1">Rank</p>
                        <p className="text-sm md:text-base font-bold text-blue-200">#{student.overall_rank}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>


              {hasPermission(PERMISSIONS.GET_RESULT) && (
                <div className="flex flex-col sm:flex-row gap-3">
                  <button
                    type="button"
                    className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white py-3 
                      px-5 md:px-6 rounded-xl text-sm md:text-base font-medium flex items-center justify-center gap-3 transition-all 
                      duration-200 shadow-lg hover:shadow-xl group"
                    onClick={() => handlePrintResult(new Set([student.student_id]))}
                  >
                    <i className="fas fa-print text-sm group-hover:scale-110 transition-transform"></i>
                    <span>Print Result</span>
                  </button>

                  <button
                    type="button"
                    className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white 
                      py-3 px-5 md:px-6 rounded-xl text-sm md:text-base font-medium flex items-center justify-center gap-3 
                      transition-all duration-200 shadow-lg hover:shadow-xl group"
                    onClick={() => handlePrintCertificate(new Set([student.student_id]))}
                  >
                    <i className="fas fa-certificate text-sm group-hover:scale-110 transition-transform"></i>
                    <span>Print Certificate</span>
                  </button>
                </div>
              )}

            </div>

            <div className="overflow-hidden border-t border-gray-800 bg-[#1A1A1A]">
              {examNames.length > 0 && subjects.length > 0 ? (
                <>
                  <div className="overflow-x-auto">
                    <table className="min-w-full text-gray-200 border-collapse">
                      <thead>
                        <tr className="bg-[#1F1F1F] text-gray-200">
                          <th className="py-4 px-4 md:px-6 text-left text-sm md:text-base font-semibold uppercase tracking-wider 
                              border-b border-gray-700">
                            <div className="flex items-center gap-2">
                              <i className="fas fa-book text-gray-300"></i>
                              <span>Subject</span>
                            </div>
                          </th>
                          {examNames.map((examName) => renderHeaderCell(examName, marks[examName]))}
                        </tr>
                      </thead>

                      <tbody>
                        {subjects.map((subject, index) => (
                          <tr
                            key={subject}
                            className={`${index % 2 === 0 ? 'bg-[#202020]' : 'bg-[#1A1A1A]'} 
                                hover:bg-[#2A2A2A] transition-colors duration-150`} >
                            <td className="py-4 px-2 lg:px-4 border-b border-gray-800 text-sm md:text-base font-medium">
                              <div className="flex items-center gap-3">
                                <div className="w-2 h-2 rounded-full bg-blue-400"></div>
                                {subject}
                              </div>
                            </td>
                            {examNames.map((examName) => {
                              const examData = marks[examName]
                              const mark = examData?.subject_marks_dict?.[subject] ?? ''
                              const isGrandTotal = examName.includes('G. Total') || examName.includes('Grand')
                              const isSummary = !isGrandTotal && (examName.includes('Total') || examName.includes('Grades'))
                              if (isGrandTotal) {
                                return (
                                  <td key={`${subject}-${examName}`} className="py-4 px-2 border-b border-gray-800 text-center text-sm md:text-base font-bold bg-amber-950/40">
                                    <span className="text-lg text-amber-300 font-black">{mark}</span>
                                  </td>
                                )
                              }
                              if (isSummary) {
                                return (
                                  <td key={`${subject}-${examName}`} className="py-4 px-2 border-b border-gray-800 text-center text-sm md:text-base font-bold bg-teal-950/30">
                                    <span className="text-lg text-teal-200 font-bold">{mark}</span>
                                  </td>
                                )
                              }
                              return (
                                <td key={`${subject}-${examName}`} className="py-4 px-2 border-b border-gray-800 text-center text-sm md:text-base font-semibold">
                                  <span className="text-lg text-green-300">{mark}</span>
                                </td>
                              )
                            })}
                          </tr>
                        ))}

                        <tr className="bg-gradient-to-r from-amber-950/80 to-orange-950/70 border-t-2 border-amber-700">
                          <td className="py-4 px-2 text-sm md:text-base font-black text-amber-100">
                            <div className="flex items-center gap-2">
                              <i className="fas fa-crown text-amber-300"></i>
                              <span className="uppercase tracking-wider">G.Total</span>
                            </div>
                          </td>
                          {examNames.map((examName) => {
                            const examData = marks[examName]
                            const isGrandTotal = examName.includes('G. Total') || examName.includes('Grand')
                            const isSummary = !isGrandTotal && (examName.includes('Total') || examName.includes('Grades'))
                            const totalValue = examData?.exam_total ?? ''
                            if (isGrandTotal) {
                              return (
                                <td key={`grand-total-${examName}`} className="py-4 px-2 text-center text-sm md:text-base font-black border-l border-amber-700/70 bg-amber-950/80">
                                  <div className="inline-flex items-center gap-2 bg-amber-950 px-3 py-2 rounded-lg border-2 border-amber-600 shadow-lg">
                                    <span className="text-amber-100 text-xl">{totalValue}</span>
                                  </div>
                                </td>
                              )
                            }
                            if (isSummary) {
                              return (
                                <td key={`grand-total-${examName}`} className="py-4 px-2 text-center text-sm md:text-base font-bold border-l border-teal-700/60 bg-teal-950/50">
                                  <div className="inline-flex items-center gap-2 bg-teal-950/60 px-3 py-2 rounded-lg border border-teal-700">
                                    <span className="text-teal-200 text-lg">{totalValue}</span>
                                  </div>
                                </td>
                              )
                            }
                            return (
                              <td key={`grand-total-${examName}`} className="py-4 px-2 text-center text-sm md:text-base font-bold">
                                <div className="inline-flex items-center gap-2 bg-green-950/50 px-3 py-2 rounded-lg border border-green-800">
                                  <span className="text-green-200 text-lg">{totalValue}</span>
                                </div>
                              </td>
                            )
                          })}
                        </tr>

                        <tr className="bg-gradient-to-r from-blue-950/70 to-indigo-950/60 border-t border-blue-800">
                          <td className="py-4 px-2 text-sm md:text-base font-bold text-blue-100">
                            <div className="flex items-center gap-3">
                              <i className="fas fa-chart-pie text-blue-300"></i>
                              <span className="tracking-wider">%age</span>
                            </div>
                          </td>
                          {examNames.map((examName) => {
                            const examData = marks[examName]
                            const isGrandTotal = examName.includes('G. Total') || examName.includes('Grand')
                            const isSummary = !isGrandTotal && (examName.includes('Total') || examName.includes('Grades'))
                            const percentage = examData?.percentage ?? ''
                            if (isGrandTotal) {
                              return (
                                <td key={`percentage-${examName}`} className="py-4 px-2 text-center text-sm md:text-base font-bold border-l border-amber-700/60 bg-amber-950/50">
                                  <div className="inline-flex items-center gap-2 bg-amber-950/60 px-3 py-2 rounded-lg border border-amber-700">
                                    <span className="text-amber-200 text-lg">{percentage}%</span>
                                  </div>
                                </td>
                              )
                            }
                            if (isSummary) {
                              return (
                                <td key={`percentage-${examName}`} className="py-4 px-2 text-center text-sm md:text-base font-bold border-l border-teal-800/50 bg-teal-950/40">
                                  <div className="inline-flex items-center gap-2 bg-teal-950/50 px-3 py-2 rounded-lg border border-teal-800">
                                    <span className="text-teal-200 text-lg">{percentage}%</span>
                                  </div>
                                </td>
                              )
                            }
                            return (
                              <td key={`percentage-${examName}`} className="py-4 px-2 text-center text-sm md:text-base font-bold">
                                <div className="inline-flex items-center gap-2 bg-blue-950/50 px-3 py-2 rounded-lg border border-blue-800">
                                  <span className="text-blue-200 text-lg">{percentage}%</span>
                                </div>
                              </td>
                            )
                          })}
                        </tr>
                      </tbody>
                    </table>
                  </div>

                  <div className="px-4 py-3 border-t border-gray-800 bg-[#1A1A1A]/80 text-gray-300 text-sm flex justify-between items-center">
                    <span>
                      <i className="fas fa-info-circle mr-2"></i>
                      {subjects.length} subjects
                    </span>
                    <span className="text-gray-400">Marks are out of respective exam totals</span>
                  </div>
                </>
              ) : (
                <div className="py-12 text-center bg-[#1A1A1A]">
                  <div className="inline-block p-6 bg-[#1A1A1A]/50 rounded-2xl border border-gray-700/50 mb-4">
                    <i className="fas fa-chart-bar text-4xl text-gray-500"></i>
                  </div>
                  <h4 className="text-lg font-bold text-white mb-2">No marks data available</h4>
                  <p className="text-gray-300">This student doesn't have any marks recorded yet.</p>
                </div>
              )}
            </div>
          </div>
        )
      })}
    </div>
  )
}

export default MarksTable
