import React, { useState } from 'react';
import { apiPost } from '../../../api/api';

export default function TCCancelModal({ studentId, onUpdateLocal, onClose }) {

  const [confirmed, setConfirmed] = useState(false);
  const [loading, setLoading] = useState(false);

  if (!studentId) return null;

  async function confirmTCCancel() {
    setLoading(true);
    try {
      const res = await apiPost('/api/cancel-tc', { student_session_id: studentId });
      const d = await res.json();
      if (!res.ok) {
        throw new Error(d.error || 'Failed to cancel TC');
      }
      onUpdateLocal && onUpdateLocal(
        studentId,
        {
          state: 'NOT_PROMOTED_NOT_TC', 
          tc_date: null, 
          tc_number: null,
          has_cancelled_tc: true, 
          cancelled_tc_number: d.cancelled_tc_number
        }
      );
      showAlert(200, d.message || 'TC cancelled successfully!');
      onClose && onClose();
    } catch (err) {
      console.error(err);
      showAlert(400, err.message || 'Unable to cancel TC.');
    } finally {
      setLoading(false);
    }
  }

  return (
    // <!-- TC Revert Confirmation Modal -->
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm transition-all z-50 flex items-center justify-center p-4" role="dialog" aria-labelledby="tcRevertTitle" aria-modal="true">
      <div className="bg-gray-900 rounded-2xl w-full max-w-lg shadow-2xl border border-gray-700 overflow-hidden">
        <div className="px-6 py-4 bg-gradient-to-r from-purple-700 to-indigo-600 text-white flex items-center justify-between">
          <h3 className="text-lg font-bold" id="tcRevertTitle">Confirm Cancel TC</h3>
          <button className="text-white hover:text-gray-200" type="button" onClick={onClose}>
            <i className="fas fa-times"></i>
          </button>
        </div>
        <div className="p-6 space-y-4 text-gray-100">
          <div className="flex items-start gap-3">
            <span className="text-xl text-amber-300 mt-1"><i className="fas fa-exclamation-triangle"></i></span>
            <p className="leading-relaxed">
              After cancelling the TC, the TC number will be marked cancelled and the student will become active.
              This TC number cannot be assigned to anyone else.
            </p>
          </div>
          <div className="bg-gray-800 rounded-xl p-4 border border-purple-500/40">
            <label className="inline-flex items-center gap-3">
              <input type="checkbox" className="form-checkbox h-5 w-5 text-purple-500 focus:ring-purple-400 border-gray-600 rounded" checked={confirmed} onChange={(e) => setConfirmed(e.target.checked)} />
              <span className="text-sm text-gray-200">
                I understand this action is final and cannot be undone.
              </span>
            </label>
          </div>
          <p className="text-xs text-gray-400">
            This confirms you want to remove the generated TC and allow the student to re-enter the promotion workflow.
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3 p-4 bg-gray-950 border-t border-gray-700">

          <button className="w-full sm:w-auto px-5 py-2 rounded-xl bg-gray-700 hover:bg-gray-600 text-white font-semibold"
            type="button" onClick={onClose}>
            Cancel
          </button>

          <button
            type="button"
            onClick={confirmTCCancel}
            disabled={!confirmed || loading}
            className="w-full sm:w-auto px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-gray-900 font-semibold disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <i className="fas fa-spinner fa-spin"></i>
                Cancelling...
              </>
            ) : (
              <>
                <i className="fas fa-ban"></i>
                Confirm Cancel TC
              </>
            )}
          </button>

        </div>
      </div>
    </div>
  );
}
