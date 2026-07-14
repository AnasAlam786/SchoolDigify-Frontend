import React, { useState, useEffect } from 'react'
import { apiPost } from '../../../api/api';

function DepromotionModal({ oldStudentSessionID, promotedStudentId, onUpdateLocal, onClose }) {

    const [studentData, setStudentData] = useState(null);
    const [isLoadingStudent, setLoadingStudent] = useState(false);
    const [isLoadingButton, setLoadingButton] = useState(false);

    const [checkboxConfirmed, setCheckboxConfirmed] = useState(false);


    // Open / close based on data prop
    useEffect(() => {
        if (promotedStudentId) {
            fetchStudentData(promotedStudentId);
        } else {
            showAlert(400, "Student is not valid please try again!")
            closeModal();
        }
    }, [promotedStudentId]);

    // ---------- Data fetching ----------
    async function fetchStudentData(promotedStudentId) {
        setLoadingStudent(true);
        setStudentData(null)
        try {
            const res = await apiPost('/api/get_promoted_student_data',
                { promoted_student_id: promotedStudentId });
            const json = await res.json();
            if (!res.ok) {
                showAlert(400, json.error || 'Failed to fetch student data');
                closeModal();
                return;
            }
            const student = json.student_data
            setStudentData(student);
        } catch (err) {
            showAlert(400, err || 'Unable to load student data.');
            closeModal();
        } finally {
            setLoadingStudent(false);
        }
    }


    function closeModal() {
        setStudentData(null);
        setCheckboxConfirmed(false)
        onClose && onClose();
    }

    async function handleDepromote(PromotedSessionId) {
        setLoadingButton(true);
        try {

            const resp = await apiPost('/api/depromote-student', {
                promoted_student_id: PromotedSessionId,
            });

            const result = await resp.json();
            if (!resp.ok) {
                throw new Error(result.error || result.message || 'Error depromoting student');
            }
            // Update parent state with the original student ID
            onUpdateLocal &&
                onUpdateLocal(oldStudentSessionID, {
                    state: result.state,
                    new_roll: null,
                    new_class: null,
                    promoted_date: null,
                    promoted_student_id: null
                });
            closeModal();
        } catch (err) {
            console.error('Error depromoting student:', err);
            showAlert(400, err.message || 'Unable to depromote student.');
        } finally {
            setLoadingButton(false);
        }
    }


    return (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
    {/* Modal container: flex column, max height to fit within viewport */}
    <div className="w-full max-w-2xl flex flex-col max-h-[90vh] overflow-hidden rounded-3xl border border-gray-700 bg-gray-900 shadow-[0_20px_80px_rgba(0,0,0,0.6)]">
      
      {/* Header – fixed, never scrolls */}
      <div className="flex-shrink-0 flex items-center justify-between bg-gradient-to-r from-red-600 via-red-500 to-orange-500 px-6 py-5">
        <div>
          <h2 className="text-2xl font-bold text-white">Depromote Student</h2>
          <p className="mt-1 text-sm text-red-100">
            Review the details before confirming the de-promotion.
          </p>
        </div>
        <button
          onClick={closeModal}
          className="rounded-full p-2 text-white transition hover:bg-white/20"
        >
          <i className="fas fa-times text-lg"></i>
        </button>
      </div>

      {/* Content area – conditionally loading, body, or empty */}
      {isLoadingStudent ? (
        // Loading state: centered spinner, fills available space, no footer
        <div className="flex-1 flex items-center justify-center">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-red-500 border-t-transparent"></div>
        </div>
      ) : studentData ? (
        <>
          {/* Scrollable body */}
          <div className="flex-1 overflow-y-auto">
            <div className="space-y-6 p-6">
              {/* Student Profile */}
              <div className="rounded-2xl border border-gray-700 bg-gradient-to-br from-gray-800 to-gray-900 p-6">
                <div className="flex flex-col items-center">
                  <img
                    src={studentData.image || "/static/images/default-user.png"}
                    alt=""
                    className="h-28 w-28 rounded-full border-4 border-red-500 object-cover shadow-xl"
                  />
                  <h3 className="mt-4 text-2xl font-bold text-white">
                    {studentData.student_name}
                  </h3>
                  <p className="mt-1 text-gray-300">Father : {studentData.father_name}</p>
                  <p className="text-gray-400">{studentData.phone}</p>
                </div>
              </div>

              {/* Current & Previous */}
              <div className="grid gap-5 md:grid-cols-2">
                {/* Current */}
                <div className="rounded-2xl border border-blue-500/30 bg-blue-500/10 p-5">
                  <div className="mb-4 flex items-center gap-2">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-500/20">
                      <i className="fas fa-arrow-up text-blue-400"></i>
                    </div>
                    <div>
                      <h4 className="font-semibold text-blue-300">Current Session</h4>
                      <p className="text-xs text-gray-400">Student is currently studying in</p>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Class</span>
                      <span className="font-semibold text-white">{studentData.promoted_class}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Roll Number</span>
                      <span className="font-semibold text-white">{studentData.promoted_roll}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Promotion Date</span>
                      <span className="font-semibold text-white">{studentData.promoted_date}</span>
                    </div>
                  </div>
                </div>

                {/* Previous */}
                <div className="rounded-2xl border border-green-500/30 bg-green-500/10 p-5">
                  <div className="mb-4 flex items-center gap-2">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-500/20">
                      <i className="fas fa-history text-green-400"></i>
                    </div>
                    <div>
                      <h4 className="font-semibold text-green-300">Will Restore To</h4>
                      <p className="text-xs text-gray-400">Previous academic session</p>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Class</span>
                      <span className="font-semibold text-white">{studentData.previous_class}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Roll Number</span>
                      <span className="font-semibold text-white">{studentData.previous_roll}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Warning */}
              <div className="rounded-2xl border border-yellow-500/40 bg-yellow-500/10 p-5">
                <div className="mb-3 flex items-center gap-3">
                  <i className="fas fa-exclamation-triangle text-xl text-yellow-400"></i>
                  <h4 className="font-semibold text-yellow-300">What will happen after depromotion?</h4>
                </div>
                <ul className="space-y-2 text-sm text-gray-300">
                  <li>• Current promotion record will be removed.</li>
                  <li>• Student will be restored to <b>{studentData.previous_class}</b>.</li>
                  <li>• Roll number will become <b>{studentData.previous_roll}</b>.</li>
                  <li className="font-medium text-red-300">• This action cannot be undone.</li>
                </ul>
              </div>

              {/* Confirmation checkbox */}
              <label className="flex cursor-pointer items-start gap-4 rounded-2xl border border-red-500/40 bg-red-500/10 p-5">
                <input
                  type="checkbox"
                  checked={checkboxConfirmed}
                  onChange={(e) => setCheckboxConfirmed(e.target.checked)}
                  className="mt-1 h-5 w-5 accent-red-500"
                />
                <div>
                  <p className="font-semibold text-white">I understand the consequences.</p>
                  <p className="mt-1 text-sm text-gray-400">
                    I confirm that I want to depromote this student and restore the previous academic session.
                  </p>
                </div>
              </label>
            </div>
          </div>

          {/* Footer – fixed, never scrolls */}
          <div className="flex-shrink-0 flex items-center justify-end gap-3 border-t border-gray-700 bg-gray-900 px-6 py-5">
            <button
              onClick={closeModal}
              className="rounded-xl border border-gray-600 px-6 py-3 font-medium text-gray-300 transition hover:bg-gray-800"
            >
              Cancel
            </button>
            <button
              disabled={!checkboxConfirmed || isLoadingButton}
              onClick={() => handleDepromote(studentData.promoted_student_id)}
              className="rounded-xl bg-gradient-to-r from-red-600 to-red-500 px-8 py-3 font-semibold text-white transition hover:scale-105 disabled:cursor-not-allowed disabled:opacity-40"
            >
              {isLoadingButton ? (
                <>
                  <i className="fas fa-spinner mr-2 animate-spin"></i>
                  Depromoting...
                </>
              ) : (
                <>
                  <i className="fas fa-trash-alt mr-2"></i>
                  Depromote Student
                </>
              )}
            </button>
          </div>
        </>
      ) : (
        // Fallback when no student data is available
        <div className="flex-1 flex items-center justify-center text-gray-400 py-24">
          No student data available.
        </div>
      )}
    </div>
  </div>
);
}

export default DepromotionModal
