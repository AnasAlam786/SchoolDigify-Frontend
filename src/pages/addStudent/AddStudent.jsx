import { useEffect, useMemo, useState } from 'react';
import './style/AddStudent.css';
import FormField from './components/FormField.jsx';
// import ImageUploader from './components/ImageUploader.jsx';
import ImageUploader from '../utils/ImageUploader/ImageUploader.jsx';
import BulkImportModal from './components/BulkImportModal.jsx';
import ValidationModal from './modals/ValidationModal.jsx';
import SuccessModal from './modals/SuccessModal.jsx';

const genderOptions = ['Male', 'Female', 'Other'];
const casteTypeOptions = ['General', 'OBC', 'SC', 'ST'];
const religionOptions = ['Hindu', 'Muslim', 'Christian', 'Sikh', 'Other'];
const bloodGroupOptions = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];
const educationOptions = ['High School', 'Graduation', 'Post Graduation', 'Other'];
const occupationOptions = ['Employed', 'Business', 'Farmer', 'Housewife', 'Retired', 'Other'];
const homeDistanceOptions = ['0-1 km', '1-3 km', '3-5 km', '5+ km'];
const classOptions = [
  { id: 'nursery', name: 'Nursery' },
  { id: 'lkg', name: 'LKG' },
  { id: 'ukg', name: 'UKG' },
  { id: '1', name: '1st' },
  { id: '2', name: '2nd' },
  { id: '3', name: '3rd' },
  { id: '4', name: '4th' },
  { id: '5', name: '5th' },
  { id: '6', name: '6th' },
  { id: '7', name: '7th' },
  { id: '8', name: '8th' },
  { id: '9', name: '9th' },
  { id: '10', name: '10th' },
  { id: '11', name: '11th' },
  { id: '12', name: '12th' },
];

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
  student_status: 'new',
  admission_session_id: '',
  Admission_Class: '',
  CLASS: '',
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
  const [errors, setErrors] = useState({});
  const [imagePreview, setImagePreview] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [showBulkImport, setShowBulkImport] = useState(false);
  const [bulkImportState, setBulkImportState] = useState({
    currentSection: 'upload',
    fileInfo: null,
    file: null,
    validationState: null,
  });
  const [validationModalOpen, setValidationModalOpen] = useState(false);
  const [reviewData, setReviewData] = useState(null);
  const [successState, setSuccessState] = useState({ open: false, mode: 'add', message: '' });

  const sessionOptions = useMemo(
    () => [
      { id: '2024-2025', label: '2024-2025' },
      { id: '2025-2026', label: '2025-2026' },
      { id: '2026-2027', label: '2026-2027' },
    ],
    [],
  );

  useEffect(() => {
    const currentSession = sessionOptions[0]?.id || '';
    setForm((state) => ({ ...state, admission_session_id: currentSession }));
  }, [sessionOptions]);

  const classSuggestion = useMemo(() => {
    if (!form.DOB.match(/^\d{2}-\d{2}-\d{4}$/)) return '';
    const [day, month, year] = form.DOB.split('-').map(Number);
    const birthDate = new Date(year, month - 1, day);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age -= 1;
    }
    if (age === 3) return 'Nursery or Pre-Nursery';
    if (age === 4) return 'Nursery';
    if (age === 5) return 'LKG';
    if (age === 6) return 'UKG';
    if (age === 7) return '1st';
    if (age === 8) return '2nd';
    if (age === 9) return '3rd';
    if (age === 10) return '4th';
    if (age === 11) return '5th';
    if (age === 12) return '6th';
    if (age === 13) return '7th';
    if (age === 14) return '8th';
    if (age === 15) return '9th';
    if (age === 16) return '10th';
    if (age === 17) return '11th';
    if (age > 17) return 'Above 12th';
    if (age < 3) return 'Too young for admission';
    return 'Age not suitable';
  }, [form.DOB]);

  const handleInputChange = (field) => (event) => {
    const value = event.target.type === 'checkbox' ? event.target.checked : event.target.value;
    setForm((state) => ({ ...state, [field]: value }));

    if (field === 'Admission_Class') {
      setForm((state) => ({ ...state, CLASS: value }));
    }

    if (field === 'is_RTE' && !event.target.checked) {
      setForm((state) => ({
        ...state,
        registration_no: '',
        account_number: '',
        ifsc: '',
        bank_name: '',
        bank_branch: '',
        account_holder: '',
        RTE_registered_year: '',
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

  const handleImageChange = (file) => {
    setImageFile(file);
    const reader = new FileReader();
    reader.onload = () => setImagePreview(reader.result);
    reader.readAsDataURL(file);
  };

  const handleImageRemove = () => {
    setImageFile(null);
    setImagePreview('');
  };

  const clearErrors = () => setErrors({});

  const runValidation = () => {
    const newErrors = {};
    const requiredFields = [
      'STUDENTS_NAME',
      'DOB',
      'GENDER',
      'Caste_Type',
      'RELIGION',
      'CLASS',
      'ROLL',
      'SR',
      'ADMISSION_NO',
      'ADMISSION_DATE',
      'PHONE',
      'ADDRESS',
      'PIN',
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
    return newErrors;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    clearErrors();
    const validationErrors = runValidation();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    setReviewData({ ...form, imagePreview });
    setValidationModalOpen(true);
  };

  const handleConfirmSubmit = async () => {
    setValidationModalOpen(false);
    setSuccessState({ open: true, mode: 'add', message: 'Student has been added to the system successfully.' });
  };

  const handlePrint = () => {
    console.log('Print admission form');
  };

  const handleWhatsApp = () => {
    console.log('Send WhatsApp');
  };

  const uploadFile = (file) => {
    if (!file) return;
    setBulkImportState((state) => ({
      ...state,
      file,
      fileInfo: {
        name: file.name,
        size: `${Math.round(file.size / 1024)} KB`,
      },
    }));
  };

  const resetBulkImport = () => {
    setBulkImportState({ currentSection: 'upload', fileInfo: null, file: null, validationState: null });
  };

  const handleDownloadTemplate = () => {
    console.log('Download template');
  };

  const handleValidateBulk = () => {
    if (!bulkImportState.file) return;
    setBulkImportState((state) => ({
      ...state,
      currentSection: 'validation',
      validationState: {
        loaded: true,
        success: true,
        errors: [],
        previewLoading: false,
        previewLoaded: false,
        previewSummary: '',
        previewRows: [],
      },
    }));
    setTimeout(() => {
      setBulkImportState((state) => ({
        ...state,
        validationState: {
          ...state.validationState,
          success: true,
          previewSummary: 'All records look good. Preview student data before import.',
          previewRows: [
            { id: '1', sr: '1', name: 'Aarav Sharma', className: '5th', admissionNo: '1001', fatherName: 'Raj Sharma', phone: '9876543210' },
            { id: '2', sr: '2', name: 'Nia Patel', className: '4th', admissionNo: '1002', fatherName: 'Suresh Patel', phone: '9123456780' },
          ],
        },
      }));
    }, 700);
  };

  const handleProceedToPreview = () => {
    setBulkImportState((state) => ({
      ...state,
      currentSection: 'preview',
      validationState: {
        ...state.validationState,
        previewLoaded: true,
      },
    }));
  };

  const handleImportStudents = () => {
    console.log('Import students');
  };

  return (
    <div className="max-w-6xl mx-auto sm:px-6 py-4">
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#181818] via-[#141414] to-[#0f0f0f] border border-gray-800 shadow-xl">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_15%_25%,rgba(255,255,255,0.04),transparent_45%)]"></div>
        </div>

        <div className="relative z-10 p-6 md:p-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div className="flex items-start gap-4 lg:gap-5">
              <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center shadow-lg">
                <i className="fas fa-user-plus text-white text-xl"></i>
              </div>
              <div className="flex flex-col gap-1">
                <div className="flex items-center gap-3">
                  <h1 className="text-xl sm:text-2xl lg:text-3xl font-semibold text-white">Add New Student</h1>
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-700/60 text-gray-200 border border-gray-600">New</span>
                </div>
                <p className="text-gray-400 text-sm max-w-xl">Fill in the student details to add them to the system</p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row lg:flex-row gap-3">
              <button
                type="button"
                onClick={() => { setShowBulkImport(true); resetBulkImport(); }}
                className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg bg-gradient-to-r from-green-500 to-emerald-700 hover:opacity-90 text-white text-sm font-medium transition"
              >
                <i className="fas fa-upload"></i>
                Bulk Import
              </button>
              <a href="/student_list" className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg bg-gray-800 hover:bg-gray-700 border border-gray-700 text-gray-300 hover:text-white transition text-sm">
                <i className="fas fa-arrow-left text-xs"></i>
                Back to Students
              </a>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto sm:px-6 mb-6">
        <div className="hidden rounded-xl border border-red-500/30 bg-gradient-to-r from-red-900/20 to-red-800/10 p-4 sm:p-5 backdrop-blur-sm transition-all duration-300" />
      </div>

      <form id="DataForm" className="space-y-6" onSubmit={handleSubmit}>
        <div className="section-card gradient-border rounded-2xl p-4 sm:p-6 bg-gray-900/50 backdrop-blur-sm">
          <div className="flex items-center gap-3 sm:gap-4 mb-6 sm:mb-8">
            <div className="relative">
              <div className="w-10 h-10 sm:w-14 sm:h-14 rounded-lg sm:rounded-xl bg-gradient-to-br from-indigo-600 to-purple-700 flex items-center justify-center shadow-lg">
                <i className="fas fa-user text-white text-base sm:text-xl"></i>
              </div>
              <div className="absolute -top-1 -right-1 w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-indigo-500 border-2 border-gray-900 flex items-center justify-center">
                <span className="text-xs font-bold text-white">1</span>
              </div>
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-white">Personal Information</h2>
              <p className="text-gray-400 text-sm">Basic details and personal information</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            <FormField id="STUDENTS_NAME" label="Student's Name" required error={errors.STUDENTS_NAME}>
              <div className="relative">
                <input
                  type="text"
                  id="STUDENTS_NAME"
                  name="STUDENTS_NAME"
                  value={form.STUDENTS_NAME}
                  onChange={handleInputChange('STUDENTS_NAME')}
                  placeholder="Enter full name"
                  className="w-full px-4 py-3 sm:py-3.5 bg-gray-800/70 border border-gray-700 rounded-lg sm:rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all duration-300"
                />
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                  <i className="fas fa-user"></i>
                </div>
              </div>
            </FormField>

            <FormField id="DOB" label="Date of Birth" required error={errors.DOB}>
              <div className="relative">
                <input
                  type="text"
                  id="DOB"
                  name="DOB"
                  value={form.DOB}
                  onChange={(event) => {
                    let value = event.target.value.replace(/\D/g, '').slice(0, 8);
                    if (value.length >= 5) value = `${value.slice(0, 2)}-${value.slice(2, 4)}-${value.slice(4)}`;
                    else if (value.length >= 3) value = `${value.slice(0, 2)}-${value.slice(2)}`;
                    setForm((state) => ({ ...state, DOB: value }));
                  }}
                  placeholder="DD-MM-YYYY"
                  className="w-full px-4 py-3 sm:py-3.5 bg-gray-800/70 border border-gray-700 rounded-lg sm:rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all duration-300"
                />
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                  <i className="fas fa-calendar"></i>
                </div>
              </div>
            </FormField>

            <FormField id="GENDER" label="Gender" required error={errors.GENDER}>
              <div className="relative">
                <select
                  id="GENDER"
                  name="GENDER"
                  value={form.GENDER}
                  onChange={handleInputChange('GENDER')}
                  className="w-full px-4 py-3 sm:py-3.5 bg-gray-800/70 border border-gray-700 rounded-lg sm:rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all duration-300 appearance-none"
                >
                  <option value="" className="bg-gray-800">Select Gender</option>
                  {genderOptions.map((option) => (
                    <option key={option} value={option} className="bg-gray-800">{option}</option>
                  ))}
                </select>
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
                  <i className="fas fa-chevron-down text-gray-500"></i>
                </div>
              </div>
            </FormField>

            <FormField id="AADHAAR" label="Aadhar Number" error={errors.AADHAAR}>
              <div className="relative">
                <input
                  type="text"
                  id="AADHAAR"
                  name="AADHAAR"
                  value={form.AADHAAR}
                  onChange={handleAadharChange('AADHAAR')}
                  placeholder="XXXX XXXX XXXX"
                  maxLength={14}
                  className="w-full px-4 py-3 sm:py-3.5 bg-gray-800/70 border border-gray-700 rounded-lg sm:rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all duration-300"
                />
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                  <i className="fas fa-id-card"></i>
                </div>
              </div>
            </FormField>

            <FormField id="Caste" label="Student's Caste" error={errors.Caste}>
              <div className="relative">
                <input
                  type="text"
                  id="Caste"
                  name="Caste"
                  value={form.Caste}
                  onChange={(event) => setForm((state) => ({ ...state, Caste: event.target.value }))}
                  placeholder="Enter caste"
                  className="w-full px-4 py-3 sm:py-3.5 bg-gray-800/70 border border-gray-700 rounded-lg sm:rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all duration-300"
                />
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                  <i className="fas fa-users"></i>
                </div>
              </div>
            </FormField>

            <FormField id="Caste_Type" label="Caste Type" required error={errors.Caste_Type}>
              <div className="relative">
                <select
                  id="Caste_Type"
                  name="Caste_Type"
                  value={form.Caste_Type}
                  onChange={handleInputChange('Caste_Type')}
                  className="w-full px-4 py-3 sm:py-3.5 bg-gray-800/70 border border-gray-700 rounded-lg sm:rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all duration-300 appearance-none"
                >
                  <option value="" className="bg-gray-800">Select Caste Type</option>
                  {casteTypeOptions.map((option) => (
                    <option key={option} value={option} className="bg-gray-800">{option}</option>
                  ))}
                </select>
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
                  <i className="fas fa-chevron-down text-gray-500"></i>
                </div>
              </div>
            </FormField>

            <FormField id="RELIGION" label="Religion" required error={errors.RELIGION}>
              <div className="relative">
                <select
                  id="RELIGION"
                  name="RELIGION"
                  value={form.RELIGION}
                  onChange={handleInputChange('RELIGION')}
                  className="w-full px-4 py-3 sm:py-3.5 bg-gray-800/70 border border-gray-700 rounded-lg sm:rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all duration-300 appearance-none"
                >
                  <option value="" className="bg-gray-800">Select Religion</option>
                  {religionOptions.map((option) => (
                    <option key={option} value={option} className="bg-gray-800">{option}</option>
                  ))}
                </select>
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
                  <i className="fas fa-chevron-down text-gray-500"></i>
                </div>
              </div>
            </FormField>

            <FormField id="Height" label="Height (cm)" error={errors.Height}>
              <div className="relative">
                <input
                  type="number"
                  id="Height"
                  name="Height"
                  value={form.Height}
                  onChange={handleInputChange('Height')}
                  placeholder="Enter height"
                  className="w-full px-4 py-3 sm:py-3.5 bg-gray-800/70 border border-gray-700 rounded-lg sm:rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all duration-300"
                />
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                  <span className="text-sm">cm</span>
                </div>
              </div>
            </FormField>

            <FormField id="Weight" label="Weight (kg)" error={errors.Weight}>
              <div className="relative">
                <input
                  type="number"
                  id="Weight"
                  name="Weight"
                  value={form.Weight}
                  onChange={handleInputChange('Weight')}
                  placeholder="Enter weight"
                  className="w-full px-4 py-3 sm:py-3.5 bg-gray-800/70 border border-gray-700 rounded-lg sm:rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all duration-300"
                />
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                  <span className="text-sm">kg</span>
                </div>
              </div>
            </FormField>

            <FormField id="BLOOD_GROUP" label="Blood Group" error={errors.BLOOD_GROUP}>
              <div className="relative">
                <select
                  id="BLOOD_GROUP"
                  name="BLOOD_GROUP"
                  value={form.BLOOD_GROUP}
                  onChange={handleInputChange('BLOOD_GROUP')}
                  className="w-full px-4 py-3 sm:py-3.5 bg-gray-800/70 border border-gray-700 rounded-lg sm:rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all duration-300 appearance-none"
                >
                  <option value="" className="bg-gray-800">Select Blood Group</option>
                  {bloodGroupOptions.map((option) => (
                    <option key={option} value={option} className="bg-gray-800">{option}</option>
                  ))}
                </select>
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
                  <i className="fas fa-tint text-gray-500"></i>
                </div>
              </div>
            </FormField>
          </div>
        </div>

        <div className="section-card gradient-border rounded-2xl p-4 sm:p-6 bg-gray-900/50 backdrop-blur-sm">
          <div className="flex items-center gap-3 sm:gap-4 mb-6 sm:mb-8">
            <div className="relative">
              <div className="w-10 h-10 sm:w-14 sm:h-14 rounded-lg sm:rounded-xl bg-gradient-to-br from-blue-600 to-cyan-700 flex items-center justify-center shadow-lg">
                <i className="fas fa-graduation-cap text-white text-base sm:text-xl"></i>
              </div>
              <div className="absolute -top-1 -right-1 w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-blue-500 border-2 border-gray-900 flex items-center justify-center">
                <span className="text-xs font-bold text-white">2</span>
              </div>
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-white">Academic Details</h2>
              <p className="text-gray-400 text-sm">Academic and enrollment information</p>
            </div>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-300 mb-4 required">Student Status</label>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
              <label className="radio-card cursor-pointer flex-1">
                <input
                  type="radio"
                  name="student_status"
                  value="new"
                  checked={form.student_status === 'new'}
                  onChange={() => setForm((state) => ({ ...state, student_status: 'new', CLASS: state.Admission_Class }))}
                  className="peer hidden"
                />
                <div className="peer-checked:bg-gradient-to-r peer-checked:from-blue-600/20 peer-checked:to-cyan-600/20 peer-checked:border-blue-500/50 peer-checked:text-blue-400 p-4 sm:p-5 rounded-xl border-2 border-gray-800 hover:border-gray-700 transition-all duration-300">
                  <div className="flex flex-col sm:flex-row items-center justify-center sm:justify-start gap-3 mb-2 sm:mb-3">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-gradient-to-br from-blue-500 to-cyan-600 flex items-center justify-center">
                      <i className="fas fa-user-plus text-white text-sm sm:text-lg"></i>
                    </div>
                    <div className="text-center sm:text-left">
                      <div className="font-semibold text-white mb-1 text-sm sm:text-base">New Admission</div>
                      <p className="text-xs sm:text-sm text-gray-400">First time enrollment</p>
                    </div>
                  </div>
                </div>
              </label>

              <label className="radio-card cursor-pointer flex-1">
                <input
                  type="radio"
                  name="student_status"
                  value="old"
                  checked={form.student_status === 'old'}
                  onChange={() => setForm((state) => ({ ...state, student_status: 'old' }))}
                  className="peer hidden"
                />
                <div className="peer-checked:bg-gradient-to-r peer-checked:from-emerald-600/20 peer-checked:to-green-600/20 peer-checked:border-emerald-500/50 peer-checked:text-emerald-400 p-4 sm:p-5 rounded-xl border-2 border-gray-800 hover:border-gray-700 transition-all duration-300">
                  <div className="flex flex-col sm:flex-row items-center justify-center sm:justify-start gap-3 mb-2 sm:mb-3">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-gradient-to-br from-emerald-500 to-green-600 flex items-center justify-center">
                      <i className="fas fa-user-graduate text-white text-sm sm:text-lg"></i>
                    </div>
                    <div className="text-center sm:text-left">
                      <div className="font-semibold text-white mb-1 text-sm sm:text-base">Continuing Student</div>
                      <p className="text-xs sm:text-sm text-gray-400">Previously enrolled</p>
                    </div>
                  </div>
                </div>
              </label>
            </div>
          </div>

          <div className="mb-4 p-4 rounded-xl border border-gray-800 bg-gradient-to-r from-gray-900/40 to-gray-900/10 text-xs sm:text-sm text-gray-300 leading-relaxed">
            <div>
              <span className="font-semibold text-blue-400">New Admission:</span>
              <ul className="list-disc ml-5 space-y-1 text-gray-400">
                <li>For students joining your school for the first time.</li>
                <li><span className="text-white">Admission Class</span> and <span className="text-white">Current Class</span> will be the same.</li>
                <li><span className="text-white">Admission Session</span> will be set to the current session automatically.</li>
                <li>You cannot change the admission session.</li>
              </ul>
            </div>

            <div className="mt-2">
              <span className="font-semibold text-emerald-400">Continuing Student:</span>
              <ul className="list-disc ml-5 space-y-1 text-gray-400">
                <li>For students who studied in previous years and are being added now.</li>
                <li>You can select <span className="text-white">Admission Session</span>, <span className="text-white">Admission Class</span>, and <span className="text-white">Current Class</span> separately.</li>
              </ul>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            <FormField id="admission_session_id" label="Admission Session" required error={errors.admission_session_id}>
              <div className="relative">
                <select
                  id="admission_session_id"
                  name="admission_session_id"
                  value={form.admission_session_id}
                  onChange={handleInputChange('admission_session_id')}
                  disabled={form.student_status === 'new'}
                  className="w-full px-4 py-3 sm:py-3.5 bg-gray-800/70 border border-gray-700 rounded-lg sm:rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all duration-300 appearance-none"
                >
                  <option value="" className="bg-gray-800">Select Session</option>
                  {sessionOptions.map((option) => (
                    <option key={option.id} value={option.id} className="bg-gray-800">{option.label}</option>
                  ))}
                </select>
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
                  <i className="fas fa-calendar-alt text-gray-500"></i>
                </div>
              </div>
            </FormField>

            <FormField id="Admission_Class" label="Admission Class" required error={errors.Admission_Class}>
              <div className="relative">
                <select
                  id="Admission_Class"
                  name="Admission_Class"
                  value={form.Admission_Class}
                  onChange={handleInputChange('Admission_Class')}
                  className="w-full px-4 py-3 sm:py-3.5 bg-gray-800/70 border border-gray-700 rounded-lg sm:rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all duration-300 appearance-none"
                >
                  <option value="" className="bg-gray-800">Select Class</option>
                  {classOptions.map((option) => (
                    <option key={option.id} value={option.id} className="bg-gray-800">{option.name}</option>
                  ))}
                </select>
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
                  <i className="fas fa-chalkboard-teacher text-gray-500"></i>
                </div>
              </div>
            </FormField>

            <FormField id="CLASS" label="Current Class" required error={errors.CLASS}>
              <div className="relative">
                <select
                  id="CLASS"
                  name="CLASS"
                  value={form.CLASS}
                  onChange={handleInputChange('CLASS')}
                  disabled={form.student_status === 'new'}
                  className="w-full px-4 py-3 sm:py-3.5 bg-gray-800/70 border border-gray-700 rounded-lg sm:rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all duration-300 appearance-none"
                >
                  <option value="" className="bg-gray-800">Select Class</option>
                  {classOptions.map((option) => (
                    <option key={option.id} value={option.id} className="bg-gray-800">{option.name}</option>
                  ))}
                </select>
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
                  <i className="fas fa-school text-gray-500"></i>
                </div>
              </div>
              {form.CLASS && <div className="class-suggestion text-sm text-blue-400 mt-1">Suggested class: {classSuggestion}</div>}
            </FormField>

            <FormField id="ROLL" label="Roll No" required error={errors.ROLL}>
              <div className="relative">
                <input
                  type="number"
                  id="ROLL"
                  name="ROLL"
                  value={form.ROLL}
                  onChange={handleInputChange('ROLL')}
                  placeholder="Enter roll number"
                  className="w-full px-4 py-3 sm:py-3.5 bg-gray-800/70 border border-gray-700 rounded-lg sm:rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all duration-300"
                />
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                  <i className="fas fa-hashtag"></i>
                </div>
              </div>
              <div id="rollHint" className="text-sm text-gray-500 mt-2">Available rolls will appear after selecting class.</div>
            </FormField>

            <FormField id="SR" label="SR No." required error={errors.SR}>
              <div className="relative">
                <input
                  type="number"
                  id="SR"
                  name="SR"
                  value={form.SR}
                  onChange={handleInputChange('SR')}
                  placeholder="Enter SR number"
                  className="w-full px-4 py-3 sm:py-3.5 bg-gray-800/70 border border-gray-700 rounded-lg sm:rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all duration-300"
                />
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                  <i className="fas fa-file-alt"></i>
                </div>
              </div>
            </FormField>

            <FormField id="ADMISSION_NO" label="Admission No." required error={errors.ADMISSION_NO}>
              <div className="relative">
                <input
                  type="number"
                  id="ADMISSION_NO"
                  name="ADMISSION_NO"
                  value={form.ADMISSION_NO}
                  onChange={handleInputChange('ADMISSION_NO')}
                  placeholder="Enter admission number"
                  className="w-full px-4 py-3 sm:py-3.5 bg-gray-800/70 border border-gray-700 rounded-lg sm:rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all duration-300"
                />
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                  <i className="fas fa-id-badge"></i>
                </div>
              </div>
            </FormField>

            <FormField id="ADMISSION_DATE" label="Admission Date" required error={errors.ADMISSION_DATE}>
              <div className="relative">
                <input
                  type="text"
                  id="ADMISSION_DATE"
                  name="ADMISSION_DATE"
                  value={form.ADMISSION_DATE}
                  onChange={(event) => {
                    let value = event.target.value.replace(/\D/g, '').slice(0, 8);
                    if (value.length >= 5) value = `${value.slice(0, 2)}-${value.slice(2, 4)}-${value.slice(4)}`;
                    else if (value.length >= 3) value = `${value.slice(0, 2)}-${value.slice(2)}`;
                    setForm((state) => ({ ...state, ADMISSION_DATE: value }));
                  }}
                  placeholder="DD-MM-YYYY"
                  className="w-full px-4 py-3 sm:py-3.5 bg-gray-800/70 border border-gray-700 rounded-lg sm:rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all duration-300"
                />
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                  <i className="fas fa-calendar-check"></i>
                </div>
              </div>
            </FormField>

            <FormField id="PEN" label="PEN No." error={errors.PEN}>
              <div className="relative">
                <input
                  type="number"
                  id="PEN"
                  name="PEN"
                  value={form.PEN}
                  onChange={handleInputChange('PEN')}
                  placeholder="Enter PEN number"
                  maxLength={11}
                  className="w-full px-4 py-3 sm:py-3.5 bg-gray-800/70 border border-gray-700 rounded-lg sm:rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all duration-300"
                />
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                  <i className="fas fa-passport"></i>
                </div>
              </div>
            </FormField>

            <FormField id="APAAR" label="APAAR No." error={errors.APAAR}>
              <div className="relative">
                <input
                  type="number"
                  id="APAAR"
                  name="APAAR"
                  value={form.APAAR}
                  onChange={handleInputChange('APAAR')}
                  placeholder="Enter APAAR number"
                  maxLength={12}
                  className="w-full px-4 py-3 sm:py-3.5 bg-gray-800/70 border border-gray-700 rounded-lg sm:rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all duration-300"
                />
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                  <i className="fas fa-qrcode"></i>
                </div>
              </div>
            </FormField>
          </div>
        </div>

        <div className="section-card gradient-border rounded-2xl p-4 sm:p-6 bg-gray-900/50 backdrop-blur-sm">
          <div className="flex items-center gap-3 sm:gap-4 mb-6 sm:mb-8">
            <div className="relative">
              <div className="w-10 h-10 sm:w-14 sm:h-14 rounded-lg sm:rounded-xl bg-gradient-to-br from-amber-600 to-orange-700 flex items-center justify-center shadow-lg">
                <i className="fas fa-users text-white text-base sm:text-xl"></i>
              </div>
              <div className="absolute -top-1 -right-1 w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-amber-500 border-2 border-gray-900 flex items-center justify-center">
                <span className="text-xs font-bold text-white">3</span>
              </div>
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-white">Guardian Information</h2>
              <p className="text-gray-400 text-sm">Parent or guardian details</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            <div className="lg:col-span-1 md:col-span-2">
              <div className="p-4 rounded-xl bg-gray-800/30 border border-gray-800">
                <h3 className="text-base sm:text-lg font-semibold text-amber-400 mb-4 flex items-center gap-2">
                  <i className="fas fa-male"></i>
                  Father Details
                </h3>
                <div className="space-y-4">
                  <FormField id="FATHERS_NAME" label="Name" required error={errors.FATHERS_NAME}>
                    <div className="relative">
                      <input
                        type="text"
                        id="FATHERS_NAME"
                        name="FATHERS_NAME"
                        value={form.FATHERS_NAME}
                        onChange={handleInputChange('FATHERS_NAME')}
                        placeholder="Father's name"
                        className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500 transition-all duration-300"
                      />
                      <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                        <i className="fas fa-user-tie"></i>
                      </div>
                    </div>
                  </FormField>

                  <FormField id="FATHERS_AADHAR" label="Aadhar Number" error={errors.FATHERS_AADHAR}>
                    <div className="relative">
                      <input
                        type="text"
                        id="FATHERS_AADHAR"
                        name="FATHERS_AADHAR"
                        value={form.FATHERS_AADHAR}
                        onChange={handleAadharChange('FATHERS_AADHAR')}
                        placeholder="XXXX XXXX XXXX"
                        maxLength={14}
                        className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500 transition-all duration-300"
                      />
                      <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                        <i className="fas fa-fingerprint"></i>
                      </div>
                    </div>
                  </FormField>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <FormField id="FATHERS_EDUCATION" label="Qualification" error={errors.FATHERS_EDUCATION}>
                      <select
                        id="FATHERS_EDUCATION"
                        name="FATHERS_EDUCATION"
                        value={form.FATHERS_EDUCATION}
                        onChange={handleInputChange('FATHERS_EDUCATION')}
                        className="w-full px-3 py-2.5 bg-gray-800/50 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500 transition-all duration-300 text-sm"
                      >
                        <option value="" className="bg-gray-800">Select</option>
                        {educationOptions.map((option) => (
                          <option key={option} value={option} className="bg-gray-800">{option}</option>
                        ))}
                      </select>
                    </FormField>

                    <FormField id="FATHERS_OCCUPATION" label="Occupation" error={errors.FATHERS_OCCUPATION}>
                      <select
                        id="FATHERS_OCCUPATION"
                        name="FATHERS_OCCUPATION"
                        value={form.FATHERS_OCCUPATION}
                        onChange={handleInputChange('FATHERS_OCCUPATION')}
                        className="w-full px-3 py-2.5 bg-gray-800/50 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500 transition-all duration-300 text-sm"
                      >
                        <option value="" className="bg-gray-800">Select</option>
                        {occupationOptions.map((option) => (
                          <option key={option} value={option} className="bg-gray-800">{option}</option>
                        ))}
                      </select>
                    </FormField>
                  </div>
                </div>
              </div>
            </div>

            <div className="lg:col-span-1 md:col-span-2">
              <div className="p-4 rounded-xl bg-gray-800/30 border border-gray-800">
                <h3 className="text-base sm:text-lg font-semibold text-pink-400 mb-4 flex items-center gap-2">
                  <i className="fas fa-female"></i>
                  Mother Details
                </h3>
                <div className="space-y-4">
                  <FormField id="MOTHERS_NAME" label="Name" required error={errors.MOTHERS_NAME}>
                    <div className="relative">
                      <input
                        type="text"
                        id="MOTHERS_NAME"
                        name="MOTHERS_NAME"
                        value={form.MOTHERS_NAME}
                        onChange={handleInputChange('MOTHERS_NAME')}
                        placeholder="Mother's name"
                        className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-pink-500/50 focus:border-pink-500 transition-all duration-300"
                      />
                      <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                        <i className="fas fa-female"></i>
                      </div>
                    </div>
                  </FormField>

                  <FormField id="MOTHERS_AADHAR" label="Aadhar Number" error={errors.MOTHERS_AADHAR}>
                    <div className="relative">
                      <input
                        type="text"
                        id="MOTHERS_AADHAR"
                        name="MOTHERS_AADHAR"
                        value={form.MOTHERS_AADHAR}
                        onChange={handleAadharChange('MOTHERS_AADHAR')}
                        placeholder="XXXX XXXX XXXX"
                        maxLength={14}
                        className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-pink-500/50 focus:border-pink-500 transition-all duration-300"
                      />
                      <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                        <i className="fas fa-fingerprint"></i>
                      </div>
                    </div>
                  </FormField>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <FormField id="MOTHERS_EDUCATION" label="Qualification" error={errors.MOTHERS_EDUCATION}>
                      <select
                        id="MOTHERS_EDUCATION"
                        name="MOTHERS_EDUCATION"
                        value={form.MOTHERS_EDUCATION}
                        onChange={handleInputChange('MOTHERS_EDUCATION')}
                        className="w-full px-3 py-2.5 bg-gray-800/50 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-pink-500/50 focus:border-pink-500 transition-all duration-300 text-sm"
                      >
                        <option value="" className="bg-gray-800">Select</option>
                        {educationOptions.map((option) => (
                          <option key={option} value={option} className="bg-gray-800">{option}</option>
                        ))}
                      </select>
                    </FormField>

                    <FormField id="MOTHERS_OCCUPATION" label="Occupation" error={errors.MOTHERS_OCCUPATION}>
                      <select
                        id="MOTHERS_OCCUPATION"
                        name="MOTHERS_OCCUPATION"
                        value={form.MOTHERS_OCCUPATION}
                        onChange={handleInputChange('MOTHERS_OCCUPATION')}
                        className="w-full px-3 py-2.5 bg-gray-800/50 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-pink-500/50 focus:border-pink-500 transition-all duration-300 text-sm"
                      >
                        <option value="" className="bg-gray-800">Select</option>
                        {occupationOptions.map((option) => (
                          <option key={option} value={option} className="bg-gray-800">{option}</option>
                        ))}
                      </select>
                    </FormField>
                  </div>
                </div>
              </div>
            </div>

            <div className="lg:col-span-1 md:col-span-2">
              <div className="p-4 rounded-xl bg-gray-800/30 border border-gray-800">
                <h3 className="text-base sm:text-lg font-semibold text-emerald-400 mb-4 flex items-center gap-2">
                  <i className="fas fa-phone"></i>
                  Contact Details
                </h3>
                <div className="space-y-4">
                  <FormField id="PHONE" label="Phone Number" required error={errors.PHONE}>
                    <div className="relative">
                      <input
                        type="tel"
                        id="PHONE"
                        name="PHONE"
                        value={form.PHONE}
                        onChange={handleInputChange('PHONE')}
                        placeholder="10-digit mobile number"
                        maxLength={10}
                        className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all duration-300"
                      />
                      <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                        <i className="fas fa-mobile-alt"></i>
                      </div>
                    </div>
                  </FormField>

                  <FormField id="ALT_MOBILE" label="Alternate Mobile" error={errors.ALT_MOBILE}>
                    <div className="relative">
                      <input
                        type="tel"
                        id="ALT_MOBILE"
                        name="ALT_MOBILE"
                        value={form.ALT_MOBILE}
                        onChange={handleInputChange('ALT_MOBILE')}
                        placeholder="Alternate mobile number"
                        maxLength={10}
                        className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all duration-300"
                      />
                      <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                        <i className="fas fa-phone-alt"></i>
                      </div>
                    </div>
                  </FormField>

                  <FormField id="EMAIL" label="Email ID" error={errors.EMAIL}>
                    <div className="relative">
                      <input
                        type="email"
                        id="EMAIL"
                        name="EMAIL"
                        value={form.EMAIL}
                        onChange={handleInputChange('EMAIL')}
                        placeholder="Email address"
                        className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all duration-300"
                      />
                      <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                        <i className="fas fa-envelope"></i>
                      </div>
                    </div>
                  </FormField>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="section-card gradient-border rounded-2xl p-4 sm:p-6 bg-gray-900/50 backdrop-blur-sm">
          <div className="flex items-center gap-3 sm:gap-4 mb-6 sm:mb-8">
            <div className="relative">
              <div className="w-10 h-10 sm:w-14 sm:h-14 rounded-lg sm:rounded-xl bg-gradient-to-br from-emerald-600 to-teal-700 flex items-center justify-center shadow-lg">
                <i className="fas fa-home text-white text-base sm:text-xl"></i>
              </div>
              <div className="absolute -top-1 -right-1 w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-emerald-500 border-2 border-gray-900 flex items-center justify-center">
                <span className="text-xs font-bold text-white">4</span>
              </div>
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-white">Address & Additional Information</h2>
              <p className="text-gray-400 text-sm">Residential address and other details</p>
            </div>
          </div>

          <div className="space-y-6">
            <FormField id="ADDRESS" label="Home Address" required error={errors.ADDRESS}>
              <div className="relative">
                <textarea
                  id="ADDRESS"
                  name="ADDRESS"
                  value={form.ADDRESS}
                  onChange={handleInputChange('ADDRESS')}
                  rows={3}
                  placeholder="Enter complete home address"
                  className="w-full px-4 py-3 sm:py-3.5 bg-gray-800/70 border border-gray-700 rounded-lg sm:rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all duration-300 resize-none"
                />
                <div className="absolute right-3 top-3 text-gray-500">
                  <i className="fas fa-map-marker-alt"></i>
                </div>
              </div>
            </FormField>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4 sm:gap-6">
              <FormField id="PIN" label="PIN Code" required error={errors.PIN}>
                <div className="relative">
                  <input
                    type="number"
                    id="PIN"
                    name="PIN"
                    value={form.PIN}
                    onChange={handleInputChange('PIN')}
                    placeholder="6-digit PIN"
                    maxLength={6}
                    className="w-full px-4 py-3 sm:py-3.5 bg-gray-800/70 border border-gray-700 rounded-lg sm:rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all duration-300"
                  />
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                    <i className="fas fa-map-pin"></i>
                  </div>
                </div>
              </FormField>

              <FormField id="Home_Distance" label="Home Distance" error={errors.Home_Distance}>
                <div className="relative">
                  <select
                    id="Home_Distance"
                    name="Home_Distance"
                    value={form.Home_Distance}
                    onChange={handleInputChange('Home_Distance')}
                    className="w-full px-4 py-3 sm:py-3.5 bg-gray-800/70 border border-gray-700 rounded-lg sm:rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all duration-300 appearance-none"
                  >
                    <option value="" className="bg-gray-800">Select Distance</option>
                    {homeDistanceOptions.map((option) => (
                      <option key={option} value={option} className="bg-gray-800">{option}</option>
                    ))}
                  </select>
                </div>
              </FormField>
            </div>

            <div className="mt-4 pt-6 border-t border-gray-800">
              <h3 className="text-base sm:text-lg font-semibold text-gray-300 mb-4">Previous School Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
                <FormField id="Previous_School_Name" label="School Name" error={errors.Previous_School_Name}>
                  <div className="relative">
                    <input
                      type="text"
                      id="Previous_School_Name"
                      name="Previous_School_Name"
                      value={form.Previous_School_Name}
                      onChange={handleInputChange('Previous_School_Name')}
                      placeholder="Previous school name"
                      className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all duration-300"
                    />
                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                      <i className="fas fa-school"></i>
                    </div>
                  </div>
                </FormField>

                <FormField id="Previous_School_Marks" label="Marks (%)" error={errors.Previous_School_Marks}>
                  <div className="relative">
                    <input
                      type="number"
                      id="Previous_School_Marks"
                      name="Previous_School_Marks"
                      value={form.Previous_School_Marks}
                      onChange={handleInputChange('Previous_School_Marks')}
                      placeholder="Percentage"
                      className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all duration-300"
                    />
                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                      <span className="text-sm">%</span>
                    </div>
                  </div>
                </FormField>

                <FormField id="Previous_School_Attendance" label="Attendance (days)" error={errors.Previous_School_Attendance}>
                  <div className="relative">
                    <input
                      type="number"
                      id="Previous_School_Attendance"
                      name="Previous_School_Attendance"
                      value={form.Previous_School_Attendance}
                      onChange={handleInputChange('Previous_School_Attendance')}
                      placeholder="Attendance"
                      className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all duration-300"
                    />
                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                      <i className="fas fa-clipboard-check"></i>
                    </div>
                  </div>
                </FormField>
              </div>
            </div>

            <div className="mt-6 pt-6 border-t border-gray-800">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 gap-4 mobile-section-header">
                <div className="flex items-center gap-3 w-full sm:w-auto">
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-violet-600 to-purple-700 flex items-center justify-center flex-shrink-0">
                    <i className="fas fa-hand-holding-heart text-white"></i>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-base sm:text-lg font-semibold text-white">RTE (Right to Education)</h3>
                    <p className="text-gray-400 text-xs sm:text-sm">Scholarship and financial aid information</p>
                  </div>
                </div>
                <label className="custom-checkbox flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    id="is_RTE"
                    name="is_RTE"
                    checked={form.is_RTE}
                    onChange={handleInputChange('is_RTE')}
                    className="hidden"
                  />
                  <span className="checkmark"></span>
                  <span className="text-gray-300 text-sm sm:text-base">Student is under RTE?</span>
                </label>
              </div>

              <div id="rteFields" className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mt-6 ${!form.is_RTE ? 'hidden' : ''}`}>
                <div className="md:col-span-2 lg:col-span-3">
                  <h4 className="text-sm sm:text-md font-semibold text-violet-400 mb-4">Bank Account Details</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                    <FormField id="registration_no" label="RTE Registration No" error={errors.registration_no}>
                      <input
                        type="number"
                        id="registration_no"
                        name="registration_no"
                        value={form.registration_no}
                        onChange={handleInputChange('registration_no')}
                        placeholder="Reg. No (6 digits)"
                        className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-violet-500/50 focus:border-violet-500 transition-all duration-300"
                      />
                    </FormField>

                    <FormField id="account_number" label="Account Number" error={errors.account_number}>
                      <input
                        type="number"
                        id="account_number"
                        name="account_number"
                        value={form.account_number}
                        onChange={handleInputChange('account_number')}
                        placeholder="Bank account number"
                        className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-violet-500/50 focus:border-violet-500 transition-all duration-300"
                      />
                    </FormField>

                    <FormField id="ifsc" label="IFSC Code" error={errors.ifsc}>
                      <input
                        type="text"
                        id="ifsc"
                        name="ifsc"
                        value={form.ifsc}
                        onChange={(event) => setForm((state) => ({ ...state, ifsc: event.target.value.toUpperCase() }))}
                        placeholder="IFSC code"
                        className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-violet-500/50 focus:border-violet-500 transition-all duration-300"
                      />
                    </FormField>

                    <FormField id="bank_name" label="Bank Name" error={errors.bank_name}>
                      <input
                        type="text"
                        id="bank_name"
                        name="bank_name"
                        value={form.bank_name}
                        onChange={handleInputChange('bank_name')}
                        placeholder="Bank name"
                        className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-violet-500/50 focus:border-violet-500 transition-all duration-300"
                      />
                    </FormField>

                    <FormField id="bank_branch" label="Bank Branch" error={errors.bank_branch}>
                      <input
                        type="text"
                        id="bank_branch"
                        name="bank_branch"
                        value={form.bank_branch}
                        onChange={handleInputChange('bank_branch')}
                        placeholder="Branch name"
                        className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-violet-500/50 focus:border-violet-500 transition-all duration-300"
                      />
                    </FormField>

                    <FormField id="account_holder" label="Account Holder" error={errors.account_holder}>
                      <input
                        type="text"
                        id="account_holder"
                        name="account_holder"
                        value={form.account_holder}
                        onChange={handleInputChange('account_holder')}
                        placeholder="Account holder name"
                        className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-violet-500/50 focus:border-violet-500 transition-all duration-300"
                      />
                    </FormField>

                    <FormField id="RTE_registered_year" label="RTE Registered Year" error={errors.RTE_registered_year}>
                      <input
                        type="number"
                        id="RTE_registered_year"
                        name="RTE_registered_year"
                        value={form.RTE_registered_year}
                        onChange={handleInputChange('RTE_registered_year')}
                        placeholder="YYYY"
                        className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-violet-500/50 focus:border-violet-500 transition-all duration-300"
                      />
                    </FormField>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

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
            label="Hello"
              value={imagePreview} 
              onChange={handleImageChange} 
              onRemove={handleImageRemove} />
          </div>
        </div>

        <div className="fixed bottom-0 left-0 right-0 md:left-auto md:right-6 md:bottom-6">
          <div className="max-w-6xl mx-auto md:mx-0 px-4 sm:px-6 md:px-0">
            <div className="bg-[#161616] border-t border-gray-800 md:border md:border-gray-700 shadow-[0_-6px_20px_rgba(0,0,0,0.6)] md:shadow-2xl rounded-t-xl md:rounded-xl px-4 py-3">
              <div className="flex flex-col items-center gap-2 md:items-stretch md:min-w-[240px]">
                <p className="text-xs text-gray-400 text-center md:text-left leading-snug">Review all details, then submit the form to continue.</p>
                <button type="submit" id="FormSubmit" className="w-full md:w-full px-6 py-2.5 rounded-lg bg-green-600 hover:bg-green-500 text-white font-semibold text-sm transition shadow-md flex items-center justify-center gap-2">
                  <svg id="btn-spinner" className="hidden animate-spin w-4 h-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0 C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  <span id="btn-text">Save & Review</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </form>

      <ValidationModal
        open={validationModalOpen}
        data={reviewData}
        onClose={() => setValidationModalOpen(false)}
        onConfirm={handleConfirmSubmit}
      />

      <SuccessModal
        open={successState.open}
        mode={successState.mode}
        message={successState.message}
        onClose={() => setSuccessState({ ...successState, open: false })}
        onPrint={handlePrint}
        onWhatsApp={handleWhatsApp}
      />

      <BulkImportModal
        open={showBulkImport}
        onClose={() => setShowBulkImport(false)}
        onDownloadTemplate={handleDownloadTemplate}
        onFileSelect={uploadFile}
        onRemoveFile={() => uploadFile(null)}
        onValidate={handleValidateBulk}
        currentSection={bulkImportState.currentSection}
        fileInfo={bulkImportState.fileInfo}
        validationState={bulkImportState.validationState}
        onBackToUpload={() => setBulkImportState((state) => ({ ...state, currentSection: 'upload' }))}
        onProceedToPreview={handleProceedToPreview}
        onRetryValidation={handleValidateBulk}
        onBackToValidation={() => setBulkImportState((state) => ({ ...state, currentSection: 'validation' }))}
        onImport={handleImportStudents}
      />
    </div>
  );
}

export default AddStudent;
