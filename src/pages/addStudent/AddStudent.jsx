import { useEffect, useMemo, useState } from 'react';
import './style/AddStudent.css';
import { apiGet, apiPost } from '../../api/api.js';

import Header from './components/Header.jsx';
import FormField from './components/FormField.jsx';
import ImageUploader from '../utils/ImageUploader/ImageUploader.jsx';
import BulkImportModal from './components/BulkImportModal.jsx';
import SuccessModal from './modals/SuccessModal.jsx';
import StudentDetailsModal from '../utils/StudentsDetailsModal.jsx/StudentDetailsModal.jsx';

import PersonalInfo from './formSections/PersonalInfo.jsx';
import AcedamicInfo from './formSections/AcedamicInfo.jsx';
import GuardianInfo from './formSections/GuardianInfo.jsx';
import AdditionalInfo from './formSections/AdditionalInfo.jsx';

const defaultFormState = {
  STUDENTS_NAME: '',
  DOB: '',
  GENDER: '',
  AADHAAR: '',
  Caste: '',
  Caste_Type: '',
  RELIGION: '',
  Height: '',
  Weight: '',
  BLOOD_GROUP: '',
  admitted_as_new: true,
  admission_session_id: '',
  admission_class_id: '', // id of admission class
  Admission_Class: '',   //name of admission class will not update in db
  class_id: '',        // id of class
  CLASS: '',          //name of class will not update in db
  ROLL: '',
  SR: '',
  ADMISSION_NO: '',
  ADMISSION_DATE: '',
  PEN: '',
  APAAR: '',
  FATHERS_NAME: '',
  FATHERS_AADHAR: '',
  FATHERS_EDUCATION: '',
  FATHERS_OCCUPATION: '',
  MOTHERS_NAME: '',
  MOTHERS_AADHAR: '',
  MOTHERS_EDUCATION: '',
  MOTHERS_OCCUPATION: '',
  PHONE: '',
  ALT_MOBILE: '',
  EMAIL: '',
  ADDRESS: '',
  PIN: '',
  Home_Distance: '',
  Previous_School_Name: '',
  Previous_School_Marks: '',
  Previous_School_Attendance: '',
  is_RTE: false,
  registration_no: '',
  account_number: '',
  ifsc: '',
  bank_name: '',
  bank_branch: '',
  account_holder: '',
  RTE_registered_year: '',
};

function AddStudent() {
  const [form, setForm] = useState(defaultFormState);
  const [reviewedData, setReviewedData] = useState(null);
  const [studentImage, setStudentImage] = useState('');
  const [errors, setErrors] = useState({});

  const [classes, setClasses] = useState([])
  const [sessionYears, setSessionYears] = useState([])

  const [genderOptions, setGenderOptions] = useState([])
  const [casteTypeOptions, setCasteTypeOptions] = useState([])
  const [religionOptions, setReligionOptions] = useState([])
  const [bloodGroupOptions, setBloodGroupOptions] = useState([])
  const [educationOptions, setEducationOptions] = useState([])
  const [fatherOccupationOptions, setFatherOccupationOptions] = useState([])
  const [motherOccupationOptions, setMotherOccupationOptions] = useState([])
  const [homeDistanceOptions, setHomeDistanceOptions] = useState([])

  const [reviewSubmitBtn, setReviewSubmitBtn] = useState(false);
  const [finalSubmitBtn, setFinalSubmitBtn] = useState(false);


  const [validationModalOpen, setValidationModalOpen] = useState(false);
  const [successState, setSuccessState] = useState({ open: false, studentID: null, message: '' });

  useEffect(() => {
    const fetchAdmissionData = async () => {
      try {
        const response = await apiGet("/api/admission");
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || "Failed to load admission data. Please refresh the page!");
        }
        setClasses(data.classes)
        setSessionYears(data.admission_sessions)

        setCasteTypeOptions(data.caste_type_options)
        setHomeDistanceOptions(data.home_distance_options)
        setFatherOccupationOptions(data.fathers_occupation_options)
        setMotherOccupationOptions(data.mothers_occupation_options)
        setEducationOptions(data.education_options)
        setBloodGroupOptions(data.blood_group_options)
        setReligionOptions(data.religion_options)
        setGenderOptions(data.gender_options)

        setForm(prev => ({
          ...prev,
          admission_session_id: data.current_session,
          SR: data.default_sr,
          ADMISSION_NO: data.default_admission_no,
          ADMISSION_DATE: data.default_admission_date,
        }));


      } catch (error) {
        console.error("Error fetching admission data:", error);
      }
    };

    fetchAdmissionData();
  }, []);

  const scrollToField = (field) => {
    requestAnimationFrame(() => {
      const element = document.getElementById(field);
      if (!element) return;

      element.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });

      element.focus({ preventScroll: true });
    });
  };

  const handleInputChange = (field, value) => {
    setForm(prev => ({
      ...prev,
      [field]: value,
    }));

    if (field === "is_RTE" && !value) {
      setForm(prev => ({
        ...prev,
        registration_no: "",
        account_number: "",
        ifsc: "",
        bank_name: "",
        bank_branch: "",
        account_holder: "",
        RTE_registered_year: "",
      }));
    }
  };

  const handleAadharChange = (field) => (event) => {
    const raw = event.target.value.replace(/\D/g, '').slice(0, 12);
    const formatted = raw.replace(/(\d{4})(\d{1,4})?(\d{1,4})?/, (_, a, b, c) => {
      let result = a;
      if (b) result += `-${b}`;
      if (c) result += `-${c}`;
      return result;
    });
    setForm((state) => ({ ...state, [field]: formatted }));
  };

  const runValidation = () => {
    const newErrors = {};
    const requiredFields = [
      'STUDENTS_NAME', 'DOB', 'GENDER', 'FATHERS_NAME',
      'Caste_Type', 'RELIGION', 'class_id', 'MOTHERS_NAME',
      'ROLL', 'SR', 'ADMISSION_NO', 'admission_session_id',
      'admission_class_id',
      'ADMISSION_DATE', 'PHONE', 'ADDRESS', 'PIN',
    ];
    requiredFields.forEach((field) => {
      if (!form[field]) newErrors[field] = 'This field is required.';
    });

    if (form.PHONE && !/^\d{10}$/.test(form.PHONE)) {
      newErrors.PHONE = 'Enter a valid 10-digit mobile number.';
    }
    if (form.PIN && !/^\d{6}$/.test(form.PIN)) {
      newErrors.PIN = 'Enter a valid 6-digit PIN code.';
    }

    const firstErrorField = Object.keys(newErrors)[0];
    if (firstErrorField) {
      scrollToField(firstErrorField);
    }
    return newErrors;
  };

  const handleSubmit = async (event) => {
    console.log(form, studentImage)
    event.preventDefault();
    setErrors({});


    const validationErrors = runValidation();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    try {
      setReviewSubmitBtn(true)
      const resp = await apiPost("/api/pydantic_verification", form);
      const data = await resp.json();

      if (!resp.ok) {

        setErrors(data.errors);
        if (data.errors?.length) {
          scrollToField(data.errors[0].field);
        }

        throw new Error(Object.values(errors)[0] || "Failed to validate data.");
      }

      const verifiedData = data.verifiedData

      const className = classes.find(c => String(c.id) === String(verifiedData.class_id))?.class_name ?? "";
      const AdmissionClassName = classes.find(c => String(c.id) === String(verifiedData.admission_class_id))?.class_name ?? "";

      setReviewedData(
        {
          ...verifiedData,
          'image_blob': studentImage,
          CLASS: className,
          Admission_Class: AdmissionClassName
        }
      );

      setValidationModalOpen(true);
    } catch (err) {
      console.error("Error:", err);
      showAlert(404, err);
    } finally {
      setReviewSubmitBtn(false)
    }
  };

  const handleConfirmSubmit = async () => {
    // if (finalSubmitBtn) return;

    setFinalSubmitBtn(true);

    try {
      const formData = new FormData();
      // Student data
      formData.append(
        "verifiedData",
        JSON.stringify(reviewedData)
      );

      // Actual image file
      if (studentImage instanceof Blob) {
        formData.append(
          "image_blob",
          studentImage,
          "student_image.jpg"
        );
      }

      const response = await apiPostFormData("/api/add_student", formData);
      const data = await response.json();

      if (!response.ok) {
        if (data.errors) {
          setErrors(data.errors);

          const firstField = Object.keys(data.errors)[0];
          if (firstField) {
            scrollToField(firstField);
          }
          setValidationModalOpen(false)

          showAlert(404, data.error);
          return;
        }

        throw new Error(Object.values(errors)[0] || "Failed to add student.");
      }

      setValidationModalOpen(false);

      setSuccessState({
        open: true,
        studentID: data.student_id,
        message: data.message,
      });

      setForm({
        ...defaultFormState,
        admission_session_id: String(sessionYears[0]?.id ?? ""),
        SR: form.SR + 1,
        ADMISSION_NO: form.ADMISSION_NO + 1,
        ADMISSION_DATE: new Date()
          .toLocaleDateString("en-GB")
          .replace(/\//g, "-"),
      });

      setErrors({});
      setReviewedData(null);
      setStudentImage("");

    } catch (err) {
      console.error(err);
      showAlert(404, err.message || "Something went wrong.");
    } finally {
      setFinalSubmitBtn(false);
    }
  };


  const getClassName = (id) =>
    classes.find(c => c.id === Number(id))?.class_name ?? "";


  return (
    <div className="max-w-6xl mx-auto sm:px-6 py-4">
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#181818] via-[#141414] to-[#0f0f0f] border border-gray-800 shadow-xl">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_15%_25%,rgba(255,255,255,0.04),transparent_45%)]"></div>
        </div>

        <Header onOpenBulkImport={() => { alert("Implenet the bulk implement!") }} />

      </div>

      <div className="max-w-6xl mx-auto sm:px-6 mb-6">
        <div className="hidden rounded-xl border border-red-500/30 bg-gradient-to-r from-red-900/20 to-red-800/10 p-4 sm:p-5 backdrop-blur-sm transition-all duration-300" />
      </div>

      <form id="DataForm" className="space-y-6" onSubmit={handleSubmit}>
        <PersonalInfo
          form={form}
          setForm={setForm}
          handleInputChange={handleInputChange}
          handleAadharChange={handleAadharChange}
          errors={errors}
          bloodGroupOptions={bloodGroupOptions}
          religionOptions={religionOptions}
          casteTypeOptions={casteTypeOptions}
          genderOptions={genderOptions}
        />

        <AcedamicInfo
          form={form}
          setForm={setForm}
          classes={classes}
          errors={errors}
          sessionYears={sessionYears}
          handleInputChange={handleInputChange}

        />
        <GuardianInfo
          form={form}
          errors={errors}
          educationOptions={educationOptions}
          fatherOccupationOptions={fatherOccupationOptions}
          motherOccupationOptions={motherOccupationOptions}
          handleInputChange={handleInputChange}
          handleAadharChange={handleAadharChange}
        />

        <AdditionalInfo
          form={form}
          errors={errors}
          handleInputChange={handleInputChange}
          homeDistanceOptions={homeDistanceOptions}
        />

        <div className="section-card gradient-border rounded-2xl p-4 sm:p-6 bg-gray-900/50 backdrop-blur-sm">
          <div className="flex items-center gap-3 sm:gap-4 mb-6 sm:mb-8">
            <div className="relative">
              <div className="w-10 h-10 sm:w-14 sm:h-14 rounded-lg sm:rounded-xl bg-gradient-to-br from-rose-600 to-pink-700 flex items-center justify-center shadow-lg">
                <i className="fas fa-camera text-white text-base sm:text-xl"></i>
              </div>
              <div className="absolute -top-1 -right-1 w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-rose-500 border-2 border-gray-900 flex items-center justify-center">
                <span className="text-xs font-bold text-white">5</span>
              </div>
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-white">Profile Photo</h2>
              <p className="text-gray-400 text-sm">Upload student's profile picture</p>
            </div>
          </div>
          <div className="max-w-lg mx-auto">
            <ImageUploader
              image={studentImage}
              setImage={setStudentImage}
            />
          </div>
        </div>

        <div className="fixed bottom-0 left-0 right-0 md:left-auto md:right-6 md:bottom-6">
          <div className="max-w-6xl mx-auto md:mx-0 px-4 sm:px-6 md:px-0">
            <div className="bg-[#161616] border-t border-gray-800 md:border md:border-gray-700 shadow-[0_-6px_20px_rgba(0,0,0,0.6)] md:shadow-2xl rounded-t-xl md:rounded-xl px-4 py-3">
              <div className="flex flex-col items-center gap-2 md:items-stretch md:min-w-[240px]">
                <p className="text-xs text-gray-400 text-center md:text-left leading-snug">Review all details, then submit the form to continue.</p>
                <button
                  type="submit"
                  id="FormSubmit"
                  disabled={reviewSubmitBtn}
                  className={`w-full md:w-full px-6 py-2.5 rounded-lg text-white font-semibold text-sm transition shadow-md flex items-center justify-center gap-2 ${reviewSubmitBtn
                    ? "bg-green-500 cursor-not-allowed opacity-80"
                    : "bg-green-600 hover:bg-green-500"
                    }`}
                >
                  {reviewSubmitBtn && (
                    <svg
                      className="animate-spin w-4 h-4"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                      />
                    </svg>
                  )}

                  <span>
                    {reviewSubmitBtn ? "Saving..." : "Save & Review"}
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </form>

      {validationModalOpen && (
        <StudentDetailsModal
          onClose={() => setValidationModalOpen(false)}
          student={reviewedData}
          onSubmit={handleConfirmSubmit}
          finalSubmitBtn={finalSubmitBtn}
        />)}

      {successState.open && (
        <SuccessModal
          mode='add'
          message={successState.message}
          studentID={successState.studentID}
          onClose={() => setSuccessState({ ...successState, open: false })}
        />)}

    </div>
  );
}

export default AddStudent;
