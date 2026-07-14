import React, { useEffect, useState } from 'react';
import { LoadingStatus } from './ModalStatus';
import { apiPost } from '../../../api/api';
import { sendWhatsAppMessage } from '../../utils/sendWhatsAppMessage';

const defaultFormValues = {
  promotionClassId: '',
  newRoll: '',
  promotionDate: ''
};


export default function PromotionModal({ studentId, onUpdateLocal, onClose }) {
  const [loadingData, setLoadingData] = useState(false);
  const [studentData, setStudentData] = useState(null);
  const [formValues, setFormValues] = useState(defaultFormValues);

  const [submittingPromotion, setSubmittingPromotion] = useState(false);
  const [isPromotionSuccessfull, setPromotionSuccessfull] = useState(false);
  

  const [availableRollNo, setAvailableRollNo] = useState('Available rolls: select a class');
  const [availableClasses, setAvailableClasses] = useState([]);

  // Fetch student promotion data on mount / when studentId changes
  useEffect(() => {
    if (studentId) {
      fetchStudentData();
    } else {
      showAlert(400, 'Student is not valid, please try again!');
      closeModal();
    }
  }, [studentId]);

  async function fetchStudentData() {
    setLoadingData(true);
    setStudentData(null);
    setFormValues(defaultFormValues);
    setAvailableRollNo('Available rolls: select a class');
    setAvailableClasses([]);

    try {
      const res = await apiPost('/api/get_student_promotion_data', { student_id: studentId });
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to fetch student data');
      }
      const defaultFormValues = data.default_form_values

      setStudentData(data.student_data);
      setAvailableClasses(data.available_classes || []);     
      
      const rollsStr = data.available_rolls.join(', ');
      setAvailableRollNo(`Available rolls: ${rollsStr}`);

      setFormValues({
        promotionClassId: defaultFormValues.next_class_id, 
        newRoll: defaultFormValues.next_roll_no, 
        promotionDate: defaultFormValues.today_date
      })

    } catch (err) {
      showAlert(400, err.message || 'Failed to fetch student data');
      console.error(err);
    } finally {
      setLoadingData(false);
    }
  }

  function closeModal() {
    setStudentData(null);
    onClose && onClose();
  }

  // Fetch available roll numbers for the selected class
  async function updateRollForClass(classId) {
    if (!classId) {
      setAvailableRollNo('Available rolls: select a class first');
      return;
    }
    setAvailableRollNo('Loading available rolls...');
    try {
      const res = await apiPost('/api/get-available-rolls', { class_id: classId });
      const data = await res.json();

      if (res.ok && data.available_rolls) {

        const rollsStr = data.available_rolls.join(', ');
        setAvailableRollNo(`Available rolls: ${rollsStr}`);
        setFormValues(v => ({ ...v, newRoll: data.next_roll || '' }));

      } else {
        setAvailableRollNo('Available rolls: Error loading');
      }
    } catch (err) {
      setAvailableRollNo('Available rolls: Error loading');
      console.error(err);
    }
  }

  async function submitPromotion() {
    // Basic validation
    if (!formValues.promotionClassId) {
      showAlert(400, 'Please select a class to promote to.');
      return;
    }
    if (!formValues.newRoll) {
      showAlert(400, 'Please enter a new roll number.');
      return;
    }

    setSubmittingPromotion(true);
    try {
      const payload = {
        student_id: studentId,
        promoted_class_id: formValues.promotionClassId,
        promoted_roll: formValues.newRoll,
        promoted_date: formValues.promotionDate
      };

      const res = await apiPost('/api/promote_student', payload);
      const data = await res.json();

      if (!res.ok) throw new Error(data.error || 'Failed to promote the student');

      // Update parent component with the new state
      onUpdateLocal && onUpdateLocal(studentId, {
        state: data.state,
        promoted_student_id: data.promoted_student_id,
        new_class: data.new_class,
        new_roll: data.new_roll,
        promoted_date: data.promoted_date
      });
      showAlert(200, data.message || 'Student promoted successfully!');
      setPromotionSuccessfull(true);
    } catch (err) {
      showAlert(400, err.message || 'An unexpected error occurred.');
      console.error(err);
    } finally {
      setSubmittingPromotion(false);
    }
  }

  // Placeholder for sending WhatsApp – implement according to your actual logic
  async function sendWhatsAppAfterPromotion() {
    try {
      // Replace with your actual WhatsApp API call
      const res = await apiPost('/api/promoted-message', { student_id: studentId });
      const data = await res.json();

      if (!res.ok) throw new Error(data.error || 'Failed to send watsapp message');

      sendWhatsAppMessage(data.phone, data.whatsappMessage)

      showAlert(200, 'WhatsApp message sent!');
    } catch (err) {
      showAlert(400, err.message || 'Failed to send WhatsApp message');
    }
  }

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-gray-800 rounded-2xl w-full max-w-md shadow-2xl max-h-[90vh] flex flex-col border border-gray-700">
        {/* Header */}
        <div className="relative bg-gradient-to-r from-blue-600 to-blue-500 p-5 rounded-t-2xl flex items-center">
          <i className="fas fa-school text-white text-xl mr-3"></i>
          <h5 className="text-white text-xl font-bold">Promote Student</h5>
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
          {loadingData ? (<LoadingStatus/>) : (
            <form onSubmit={e => e.preventDefault()}>
              {/* Student info */}
              <div className="flex flex-col items-center mb-4">
                <img
                  src={"https://lh3.googleusercontent.com/d/"+studentData?.IMAGE+"=s200"}
                  alt="Student"
                  className="w-20 h-20 rounded-full object-cover mb-3 bg-gray-600"
                  loading="lazy"
                />
                <h3 className="text-2xl font-bold text-white text-center">
                  {studentData?.STUDENTS_NAME}
                </h3>
                <p className="text-gray-400 text-center">{studentData?.FATHERS_NAME}</p>
              </div>

              {/* Current details card */}
              <div className="bg-gray-700/50 rounded-xl p-4 mb-5 border border-gray-600">
                <div className="flex justify-between items-center">
                  <span className="text-gray-300 font-medium">Current Class</span>
                  <span className="text-white font-semibold">
                    {studentData?.CLASS} | Roll: {studentData?.ROLL}
                  </span>
                </div>
              </div>

              {/* Promotion form */}
              <div className="space-y-4">
                <div>
                  <label className="block text-gray-300 mb-2 font-medium">
                    Promote To Class <span className="text-red-400">*</span>
                  </label>
                  <select
                    required
                    value={formValues.promotionClassId}
                    onChange={e => {
                      setFormValues(v => ({ ...v, promotionClassId: e.target.value }));
                      updateRollForClass(e.target.value);
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
                  <label className="block text-gray-300 mb-2 font-medium">
                    New Roll Number <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="number"
                    required
                    value={formValues.newRoll}
                    onChange={e => setFormValues(v => ({ ...v, newRoll: e.target.value }))}
                    className="w-full bg-gray-700 rounded-xl py-3 px-4 text-white focus:outline-none focus:ring-2 focus:ring-green-500"
                    placeholder="Enter roll number"
                  />
                  <p className="text-sm text-gray-400 mt-1">{availableRollNo}</p>
                </div>

                <div>
                  <label className="block text-gray-300 mb-2 font-medium">
                    Promotion Date <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="date"
                    required
                    value={formValues.promotionDate}
                    onChange={e => setFormValues(v => ({ ...v, promotionDate: e.target.value }))}
                    className="w-full bg-gray-700 rounded-xl py-3 px-4 text-white focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                </div>
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

          <div className="flex gap-2">
            {!isPromotionSuccessfull ? (
              <button
                type="button"
                onClick={submitPromotion}
                disabled={submittingPromotion}
                className={`px-5 py-2.5 rounded-xl font-medium inline-flex items-center transition-colors ${submittingPromotion
                    ? 'bg-green-600 opacity-70 cursor-not-allowed'
                    : 'bg-green-600 hover:bg-green-500'
                  } text-white`}
              >
                {submittingPromotion && (
                  <span className="h-4 w-4 mr-2 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                )}
                <i className="fas fa-check-circle mr-2"></i>
                {submittingPromotion ? 'Promoting...' : 'Promote'}
              </button>
            ) : (
              <button
                type="button"
                className="px-5 py-2.5 bg-green-600 hover:bg-green-500 text-white rounded-xl font-medium inline-flex items-center"
                onClick={sendWhatsAppAfterPromotion}
              >
                <i className="fab fa-whatsapp mr-2"></i>
                Send WhatsApp
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}