import React, { useEffect, useState } from 'react';
import { apiPost } from '../../../api/api';
import {LoadingStatus, ErrorStatus} from './ModalStatus';

export default function TCModal({ studentId, onUpdateLocal, onClose }) {

  // Student data fetched on open
  const [student, setStudent] = useState(null);

  const [hasCancelled, setHasCancelled] = useState(false);
  const [cancelledInfo, setCancelledInfo] = useState(null);

  // Form fields for generate mode
  const [tcNumber, setTcNumber] = useState('');
  const [leavingReason, setLeavingReason] = useState('');
  const [leavingDate, setLeavingDate] = useState('');
  const [generalConduct, setGeneralConduct] = useState('');
  const [otherRemark, setOtherRemark] = useState('');

  // UI states
  const [loadingData, setLoadingData] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

  // Open / close based on data prop
  useEffect(() => {
    if (studentId) {
      fetchStudentData(studentId);
    } else {
      closeModal();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [studentId]);

  // ---------- Data fetching ----------
  async function fetchStudentData(studentId) {
    setLoadingData(true);
    setErrors({});
    try {
      const res = await apiPost('/api/get_issue_tc_student_data', { student_id: studentId });
      const json = await res.json();
      if (!res.ok) {
        showAlert(400, json.error || 'Failed to fetch student data');
        closeModal();
        return;
      }
      setStudent(json);
      setHasCancelled(!!json.has_cancelled_tc);

      if (json.has_cancelled_tc) {
        setCancelledInfo({
          tc_number: json.cancelled_tc_number || '-',
          tc_date: json.cancelled_tc_date || '-',
          reason: json.cancelled_tc_reason || '-',
        });
        setLeavingReason(json.cancelled_tc_reason || '');
        setLeavingDate(json.cancelled_tc_date || '');
        setGeneralConduct(json.cancelled_tc_general_conduct || '');
        setOtherRemark(json.cancelled_tc_remarks || '');
      } else {
        setCancelledInfo(null);
        // Pre-fill leaving date from promotion data
        setLeavingDate(json.promoted_date || '');
        // Fetch next TC number
        fetchNextTcNumber();
      }
    } catch (err) {
      showAlert(400, err || 'Unable to load student data.');
      closeModal();
    } finally {
      setLoadingData(false);
    }
  }

  async function fetchNextTcNumber() {
    try {
      const res = await apiPost('/api/get-next-tc-number');
      const json = await res.json();
      if (res.ok && json.next_tc_number) {
        setTcNumber(json.next_tc_number);
      } else {
        setTcNumber('');
        if (json.message) showAlert(400, json.message);
      }
    } catch (err) {
      showAlert(400, err || 'Unable to fetch default TC number. Please enter manually.');
      setTcNumber('');
    }
  }

  function resetForm() {
    setTcNumber('');
    setLeavingReason('');
    setLeavingDate('');
    setGeneralConduct('');
    setOtherRemark('');
    setErrors({});
  }

  function closeModal() {
    setStudent(null);
    setHasCancelled(false);
    setCancelledInfo(null);
    setTcNumber('');
    resetForm();
    onClose && onClose();
  }

  // ---------- Submissions ----------
  function validateGenerateForm() {
    const newErrors = {};

    // console.log('Validating form:', { tcNumber, leavingReason, leavingDate, generalConduct });
    if (!tcNumber) newErrors.tcNumber = 'TC number is required.';
    if (!leavingReason) newErrors.leavingReason = 'Leaving reason is required.';
    if (!leavingDate) newErrors.leavingDate = 'Leaving date is required.';
    if (!generalConduct) newErrors.generalConduct = 'General conduct is required.';
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return false;
    }
    setErrors({});
    return true;
  }

  async function handleGenerate() {
    if (!validateGenerateForm()) return;


    setSubmitting(true);
    try {

      const resp = await apiPost('/api/issue_or_restore_tc', {
        student_session_id: student.student_session_id,
        tc_number: tcNumber,
        leaving_reason: leavingReason,
        leaving_date: leavingDate,
        general_conduct: generalConduct,
        other_remarks: otherRemark,
        is_restore: false,
      });

      const result = await resp.json();
      if (!resp.ok) {
        console.error('Error generating TC:', result.error || result.message);
        showAlert(400, result.error || result.message || 'Error generating TC');
        return;
      }
      // Update parent state
      onUpdateLocal &&
        onUpdateLocal(student.student_session_id, {
          state: 'TC_ISSUED',
          tc_date: result.tc_date,
          tc_number: result.tc_number,
        });
      closeModal();
      openPrintWindow(result.html);
    } catch (err) {
      console.error('Error generating TC:', err);
      showAlert(400, err || 'Unable to generate TC.');
    } finally {
      setSubmitting(false);
    }
  }

  async function handleRestore() {
    setSubmitting(true);
    try {
      const resp = await apiPost('/api/issue_or_restore_tc', {
        student_session_id: student.student_session_id,
        leaving_reason: leavingReason,
        leaving_date: leavingDate,
        general_conduct: generalConduct,
        other_remarks: otherRemark,
        restore_tc: true,
      });
      const result = await resp.json();
      if (!resp.ok) {
        showAlert(400, result.message || 'Error restoring TC');
        return;
      }
      onUpdateLocal &&
        onUpdateLocal(student.student_session_id, {
          state: 'TC_ISSUED',
          has_cancelled_tc: false,
          tc_date: result.tc_date,
          tc_number: result.tc_number,
        });
      closeModal();
      if (result.html) openPrintWindow(result.html);
    } catch (err) {
      console.error('Error restoring TC:', err);
      showAlert(400, err || 'Unable to restore TC.');
    } finally {
      setSubmitting(false);
    }
  }

  function openPrintWindow(html) {
    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      showAlert(400, 'Unable to open print window. Please allow pop-ups.');
      return;
    }
    printWindow.document.open();
    printWindow.document.write(html);
    printWindow.document.close();
    printWindow.onload = () => {
      printWindow.focus();
      printWindow.print();
    };
  }

  // ---------- Render ----------

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm transition-all z-50 flex items-center justify-center p-4">
      <div className="bg-gray-800 rounded-2xl w-full max-w-md shadow-2xl max-h-[90vh] flex flex-col border border-gray-700">
        {/* Header */}
        <div className="relative bg-gradient-to-r from-blue-600 to-blue-500 p-5 rounded-t-2xl flex items-center">
          <i className="fas fa-file-alt text-white text-xl mr-3" />
          <h5 className="text-white text-xl font-bold">
            {hasCancelled ? 'Restore Cancelled TC' : 'Generate TC'}
          </h5>
          <button
            onClick={closeModal}
            className="absolute right-5 top-1/2 -translate-y-1/2 text-white/80 hover:text-white text-xl"
          >
            <i className="fas fa-times" />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-6 py-5 custom-scrollbar">

          {/* {loadingData && <LoadingStatus />} */}
          {loadingData ? (<LoadingStatus />) : 
          student ? (
            <>
              {/* Student image & name */}
              <div className="flex flex-col items-center mb-4">
                <img
                  src={
                    student.IMAGE
                      ? `https://lh3.googleusercontent.com/d/${student.IMAGE}=s200`
                      : 'https://cdn.pixabay.com/photo/2016/04/22/04/57/graduation-1345143_1280.png'
                  }
                  alt="Student"
                  className="w-20 h-20 rounded-full mb-3 object-cover"
                />
                <h3 className="text-2xl font-bold text-white text-center">
                  {student.STUDENTS_NAME}
                </h3>
                <p className="text-gray-400 text-center">{student.FATHERS_NAME}</p>
              </div>

              {/* Details card */}
              <div className="bg-gray-700/50 rounded-xl p-4 mb-5 border border-gray-600">
                <div className="flex justify-between items-center">
                  <span className="text-gray-300">Current Class</span>
                  <span className="text-white font-semibold">
                    {student.CLASS} | Roll: {student.ROLL}
                  </span>
                </div>
              </div>

              {hasCancelled ? (
                /* Cancelled TC info */
                <div className="mb-5 bg-amber-900/10 border border-amber-500/20 rounded-2xl p-4">
                  <div className="text-sm text-amber-200 font-semibold mb-3">
                    This TC was previously cancelled.
                  </div>

                  <p className="text-gray-300 mb-2">
                    TC number{" "}
                    <span className="font-semibold text-white">
                      {cancelledInfo.tc_number}
                    </span>{" "}
                    was cancelled on{" "}
                    <span className="font-semibold text-white">
                      {cancelledInfo.tc_date}
                    </span>.
                  </p>

                  <p className="text-gray-300 mb-4">
                    Reason:{" "}
                    <span className="font-medium text-white">
                      {cancelledInfo.reason}
                    </span>
                  </p>

                  <p className="text-sm text-gray-200 leading-relaxed">
                    By restoring this record, the original TC will be re-issued with the
                    same number and cancellation details will be reversed. The student
                    status will move back to <strong>TC</strong>.
                  </p>
                </div>
              ) : (
                <>
                  {/* TC Number */ }
                  <div className="mb-5">
                    <label className="block text-gray-300 mb-2 font-medium">
                      TC Number <span className="text-red-400">*</span>
                    </label>

                    <input
                      type="text"
                      value={tcNumber}
                      onChange={(e) => setTcNumber(e.target.value)}
                      placeholder="Enter TC Number"
                      className={`w-full bg-gray-700 rounded-xl py-3 px-4 text-white focus:outline-none focus:ring-2 focus:ring-green-500 ${errors.tcNumber ? "border border-red-400" : ""
                        }`} />

                    {errors.tcNumber && (
                      <p className="mt-1 text-sm text-red-400">
                        {errors.tcNumber}
                      </p>
                    )}
                  </div>
                </>
              )}
              {/* Other fields */}
              <div className="space-y-4">
                <div>
                  <label className="block text-gray-300 mb-2 font-medium">
                    Leaving Reason <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="text"
                    value={leavingReason}
                    onChange={(e) => setLeavingReason(e.target.value)}
                    list="leavingReasonList"
                    className={`w-full bg-gray-700 rounded-xl py-3 px-4 text-white focus:outline-none focus:ring-2 focus:ring-green-500 ${errors.leavingReason ? 'border border-red-400' : ''
                      }`}
                    placeholder="Select or type reason"
                  />
                  <datalist id="leavingReasonList">
                    <option value="Completed the studies" />
                    <option value="Parent's Wish" />
                    <option value="Transfer to another school" />
                    <option value="Due to Relocation" />
                    <option value="Due to Financial reasons" />
                  </datalist>
                  {errors.leavingReason && (
                    <p className="mt-1 text-sm text-red-400">
                      {errors.leavingReason}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-gray-300 mb-2 font-medium">
                    General Conduct <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="text"
                    value={generalConduct}
                    onChange={(e) => setGeneralConduct(e.target.value)}
                    list="generalConductList"
                    className={`w-full bg-gray-700 rounded-xl py-3 px-4 text-white focus:outline-none focus:ring-2 focus:ring-green-500 ${errors.generalConduct ? 'border border-red-400' : ''
                      }`}
                  />
                  <datalist id="generalConductList">
                    <option value="Very Good" />
                    <option value="Excellent" />
                    <option value="Good" />
                    <option value="Satisfactory" />
                    <option value="Needs Improvement" />
                  </datalist>
                  {errors.generalConduct && (
                    <p className="mt-1 text-sm text-red-400">
                      {errors.generalConduct}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-gray-300 mb-2 font-medium">
                    Leaving Date <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="date"
                    value={leavingDate}
                    onChange={(e) => setLeavingDate(e.target.value)}
                    className={`w-full bg-gray-700 rounded-xl py-3 px-4 text-white focus:outline-none focus:ring-2 focus:ring-green-500 ${errors.leavingDate ? 'border border-red-400' : ''
                      }`}
                  />
                  {errors.leavingDate && (
                    <p className="mt-1 text-sm text-red-400">
                      {errors.leavingDate}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-gray-300 mb-2 font-medium">
                    Any Remarks? (optional)
                  </label>
                  <input
                    type="text"
                    value={otherRemark}
                    onChange={(e) => setOtherRemark(e.target.value)}
                    className="w-full bg-gray-700 rounded-xl py-3 px-4 text-white focus:outline-none focus:ring-2 focus:ring-green-500"
                    placeholder="Additional remarks"
                  />
                </div>
              </div>
            </>
              
        ) : ( <ErrorStatus onRetry={() => fetchStudentData(studentId)} /> )
      }
      </div>

      {/* Footer */}
      <div className="bg-gray-750 rounded-b-2xl border-t border-gray-700 px-6 py-4 flex flex-wrap gap-3 justify-between">
        <button
          type="button"
          onClick={closeModal}
          disabled={submitting}
          className="px-4 py-2.5 bg-gray-700 hover:bg-gray-600 text-white rounded-xl font-medium transition-colors disabled:opacity-50"
        >
          <i className="fas fa-times mr-2" /> Close
        </button>
        <div className="flex gap-2">
          {!loadingData && student && (
            hasCancelled ? (
              <button
                onClick={handleRestore}
                disabled={submitting}
                className="px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-medium transition-colors disabled:opacity-50"
              >
                <i className="fas fa-undo mr-2" />{' '}
                {submitting ? 'Restoring…' : 'Restore TC'}
              </button>
            ) : (
              <button
                onClick={handleGenerate}
                disabled={submitting}
                className="px-5 py-2.5 bg-green-600 hover:bg-green-500 text-white rounded-xl font-medium transition-colors disabled:opacity-50"
              >
                <i className="fas fa-file-pdf mr-2" />{' '}
                {submitting ? 'Generating…' : 'Generate TC'}
              </button>
            )
          )}
        </div>
      </div>
    </div>
    </div >
  );
}