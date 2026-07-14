import React, { useEffect, useState } from 'react';
import { LoadingStatus } from './ModalStatus';
import { apiPost } from '../../../api/api';

const defaultFormValues = {
  promotedClassId: '',
  promotedRoll: '',
  promotedDate: ''
};

export default function UpdatePromotionModal({ oldStudentSessionID, promotedStudentId, onUpdateLocal, onClose }) {
  const [loadingData, setLoadingData] = useState(false);
  const [studentData, setStudentData] = useState(null);

  const [formValues, setFormValues] = useState(defaultFormValues);

  const [availableRollNo, setAvailableRollNo] = useState('Available rolls: select a class');
  const [availableClasses, setAvailableClasses] = useState([]);

  const [checkedUndo, setCheckedUndo] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (promotedStudentId) {
      fetchStudentData();
    } else {
      showAlert(400, 'Student is not valid');
      onClose();
    }
  }, [promotedStudentId]);

  async function fetchStudentData() {
    setLoadingData(true);
    try {

      const res = await apiPost('/api/get_promoted_student_data', { 
        promoted_student_id: promotedStudentId 
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to fetch data');
      }

      setAvailableClasses(data.available_classes || []);

      let student = data.student_data
      setStudentData(student);

      setFormValues({
        promotedClassId: student.promoted_class_id || '',
        promotedRoll: student.promoted_roll || '',
        promotedDate: student.promoted_date || ''
      });

      // Fetch available rolls for the pre‑selected class to show the hint
      if (student.promoted_class_id) {
        fetchAvailableRollsForClass(student.promoted_class_id);
      } else {
        setAvailableRollNo('Available rolls: select a class');
      }
    } catch (err) {
      showAlert(400, err.message || 'Failed to load student data');
      console.error(err);
      closeModal();
    } finally {
      setLoadingData(false);
    }
  }

  async function fetchAvailableRollsForClass(classId) {
    if (!classId) {
      setAvailableRollNo('Available rolls: select a class first');
      return;
    }
    setAvailableRollNo('Loading available rolls...');
    try {
      const res = await apiPost('/api/get-available-rolls', { class_id: classId });
      const data = await res.json();

      if (!res.ok && !data.available_rolls) {
        throw new Error('Available rolls: Error loading');
      }

      const rollsStr = data.available_rolls.join(', ');
      setAvailableRollNo(`Available rolls: ${rollsStr} `);
      setFormValues(v => ({ ...v, promotedRoll: data.next_roll || '' }));

    } catch (err) {
      console.error(err)
      setAvailableRollNo(err);
    }
  }

  async function handleUpdate() {
    if (!formValues.promotedClassId) {
      showAlert(400, 'Please select a class to promote to.');
      return;
    }
    if (!formValues.promotedRoll) {
      showAlert(400, 'Please enter a new roll number.');
      return;
    }
    if (!checkedUndo) {
      showAlert(400, 'Please acknowledge that this action cannot be undone.');
      return;
    }

    setSubmitting(true);
    try {
      const payload = {
        student_session_id: promotedStudentId,
        promoted_class_id: formValues.promotedClassId,
        promoted_roll: formValues.promotedRoll,
        promoted_date: formValues.promotedDate
      };

      const res = await apiPost('/api/update_promoted', payload);
      const data = await res.json();

      if (!res.ok) throw new Error(data.error || 'Failed to update promotion');
      
      // Use originalStudentId to match the student in the list
      onUpdateLocal && onUpdateLocal(oldStudentSessionID, {
        state: 'PROMOTED',
        promoted_date: data.promoted_date,
        new_class: data.new_class,
        new_roll: data.new_roll
      });

      showAlert(200, data.message || 'Promotion updated successfully!');
      closeModal();
    } catch (err) {
      showAlert(400, err.message);
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  }

  function closeModal() {
    onClose && onClose();
  }

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-gray-800 rounded-2xl w-full max-w-md shadow-2xl max-h-[90vh] flex flex-col border border-gray-700">
        {/* Header – using a yellow/amber gradient to distinguish from the promotion modal */}
        <div className="relative bg-gradient-to-r from-yellow-600 to-yellow-500 p-5 rounded-t-2xl flex items-center">
          <i className="fas fa-edit text-white text-xl mr-3"></i>
          <h5 className="text-white text-xl font-bold">Update Promotion</h5>
          <button
            className="absolute right-5 top-1/2 -translate-y-1/2 text-white/80 hover:text-white text-xl"
            onClick={closeModal}
            type="button"
          >
            <i className="fas fa-times"></i>
          </button>
        </div>

        {/* Scrollable body */}
        <div className="flex-1 overflow-y-auto px-6 py-5 custom-scrollbar">
          {loadingData ? (
            <LoadingStatus />
          ) : (
            <form onSubmit={e => e.preventDefault()}>
              {/* Student info */}
              <div className="flex flex-col items-center mb-4">
                <img
                  src={"https://lh3.googleusercontent.com/d/" + studentData?.image + "=s200"}
                  alt="Student"
                  className="w-20 h-20 rounded-full object-cover mb-3 bg-gray-600"
                  loading="lazy"
                />
                <h3 className="text-2xl font-bold text-white text-center">
                  {studentData?.student_name}
                </h3>
                <p className="text-gray-400 text-center">{studentData?.father_name}</p>
              </div>

              {/* Previous class (read‑only) */}
              <div className="bg-gray-700/50 rounded-xl p-4 mb-4 border border-gray-600">
                <div className="flex justify-between items-center">
                  <span className="text-gray-300 font-medium">Previous Class</span>
                  <span className="text-white font-semibold">
                    {studentData?.previous_class} | Roll: {studentData?.previous_roll}
                  </span>
                </div>
              </div>

              {/* Current promotion (editable) */}
              <div className="bg-gray-700/50 rounded-xl p-4 mb-5 border border-gray-600">
                <h4 className="text-gray-200 font-medium mb-3">Current Promotion Details</h4>
                <div className="space-y-4">
                  <div>
                    <label className="block text-gray-300 mb-1 font-medium">
                      Class <span className="text-red-400">*</span>
                    </label>
                    <select
                      required
                      value={formValues.promotedClassId}
                      onChange={e => {
                        setFormValues(v => ({ ...v, promotedClassId: e.target.value }));
                        fetchAvailableRollsForClass(e.target.value);
                      }}
                      className="w-full bg-gray-700 rounded-xl py-3 px-4 text-white focus:outline-none focus:ring-2 focus:ring-green-500 appearance-none cursor-pointer"
                    >
                      <option value="">Select class</option>
                      {availableClasses.map(cls => (
                        <option key={cls.id} value={cls.id}>
                          {cls.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-gray-300 mb-1 font-medium">
                      Roll Number <span className="text-red-400">*</span>
                    </label>
                    <input
                      type="number"
                      required
                      value={formValues.promotedRoll}
                      onChange={e => setFormValues(v => ({ ...v, promotedRoll: e.target.value }))}
                      className="w-full bg-gray-700 rounded-xl py-3 px-4 text-white focus:outline-none focus:ring-2 focus:ring-green-500"
                      placeholder="Enter roll number"
                    />
                    <p className="text-sm text-gray-400 mt-1">{availableRollNo}</p>
                  </div>

                  <div>
                    <label className="block text-gray-300 mb-1 font-medium">
                      Promotion Date <span className="text-red-400">*</span>
                    </label>
                    <input
                      type="date"
                      required
                      value={formValues.promotedDate}
                      onChange={e => setFormValues(v => ({ ...v, promotedDate: e.target.value }))}
                      className="w-full bg-gray-700 rounded-xl py-3 px-4 text-white focus:outline-none focus:ring-2 focus:ring-green-500"
                    />
                  </div>
                </div>
              </div>

              {/* Undo confirmation checkbox */}
              <div className="flex items-center mb-4">
                <input
                  id="undo-check"
                  type="checkbox"
                  checked={checkedUndo}
                  onChange={e => setCheckedUndo(e.target.checked)}
                  className="w-5 h-5 text-green-500 bg-gray-700 border-gray-600 rounded focus:ring-green-500 focus:ring-2"
                />
                <label htmlFor="undo-check" className="ml-2 text-sm text-gray-300">
                  I understand that this action cannot be undone.
                </label>
              </div>
            </form>
          )}
        </div>

        {/* Footer */}
        <div className="bg-gray-800 rounded-b-2xl border-t border-gray-700 px-6 py-4 flex flex-wrap gap-3 justify-between">
          <button
            className="px-4 py-2.5 bg-gray-700 hover:bg-gray-600 text-white rounded-xl font-medium transition-colors"
            onClick={closeModal}
            type="button"
          >
            <i className="fas fa-times mr-2"></i> Close
          </button>

          <button
            type="button"
            onClick={handleUpdate}
            disabled={submitting || !checkedUndo}
            className={`px-5 py-2.5 rounded-xl font-medium inline-flex items-center transition-colors ${submitting || !checkedUndo
              ? 'bg-yellow-600 opacity-70 cursor-not-allowed'
              : 'bg-yellow-600 hover:bg-yellow-500'
              } text-white`}
          >
            {submitting && (
              <span className="h-4 w-4 mr-2 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
            )}
            <i className="fas fa-save mr-2"></i>
            {submitting ? 'Updating...' : 'Update Promotion'}
          </button>
        </div>
      </div>
    </div>
  );
}