// StudentDetailsModal.jsx

import { useEffect, useState, useCallback } from "react";

import ProfileHeader from "./components/ProfileHeader";
import RTEDetails from "./components/RTEDetails";
import SiblingsSection from "./components/SiblingsSection";
import AdditionalInfo from "./components/AdditionalInfo";
import DetailCard from "./components/DetailCard";

import "./style/StudentDetailsModal.css";

import { ModalSkeleton, ModalError } from "./components/ModalStatus";
import { apiPost } from "../../../api/api";
import { sendWhatsAppMessage } from "../sendWhatsAppMessage";

function StudentContent({ student, siblings, handleSiblingClick }) {
  return (
    <div
      style={{
        opacity: 1,
        transform: "translateY(0px)",
        transition: "opacity .3s, transform .3s",
      }}
    >
      <ProfileHeader student={student} />

      <div className="p-4 md:p-6 space-y-6">

        {/* Personal Information */}
        <Section title="Personal Information" color="blue">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

            <DetailCard icon="fas fa-birthday-cake" color="green" label="Date of Birth" value={student.DOB} />

            <DetailCard icon="fas fa-venus-mars" color="pink" label="Gender" value={student.GENDER} />

            <DetailCard icon="fas fa-id-card" color="yellow" label="Aadhaar No." value={student.AADHAAR} />

            <DetailCard icon="fas fa-tint" color="red" label="Blood Group" value={student.BLOOD_GROUP} />

            <DetailCard
              icon="fas fa-user-tag"
              color="orange"
              label="Caste"
              value={`${student.Caste ?? "-"} (${student.Caste_Type ?? "-"})`}
            />

            <DetailCard icon="fas fa-praying-hands" color="pink" label="Religion" value={student.RELIGION} />

            <DetailCard icon="fas fa-ruler-vertical" color="teal" label="Height" value={student.Height} />

            <DetailCard icon="fas fa-weight-scale" color="indigo" label="Weight" value={student.Weight} />

          </div>
        </Section>

        {/* Academic Information */}
        <Section title="Academic Information" color="purple">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

            <DetailCard icon="fas fa-hashtag" label="SR No." value={student.SR} color="indigo" />

            <DetailCard icon="fas fa-graduation-cap" label="Admission No" value={student.ADMISSION_NO} color="blue" />

            <DetailCard icon="fas fa-calendar-alt" label="Admission Date" value={student.ADMISSION_DATE} color="teal" />

            <DetailCard
              icon="fas fa-layer-group"
              label="Admission Class (Session)"
              value={`${student.Admission_Class ?? ""} (${student.admission_session_id ?? ""})`}
              color="purple"
            />

            <DetailCard icon="fas fa-id-card" label="PEN No" value={student.PEN} color="green" />

            <DetailCard icon="fas fa-id-card" label="APAAR No" value={student.APAAR} color="orange" />

          </div>
        </Section>

        {/* Guardian Information */}
        <Section title="Guardian Information" color="blue">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

            <DetailCard icon="fas fa-user-tie" label="Father Name" value={student.FATHERS_NAME} color="blue" />

            <DetailCard icon="fas fa-female" label="Mother Name" value={student.MOTHERS_NAME} color="purple" />

            <DetailCard icon="fas fa-fingerprint" label="Father Aadhaar" value={student.FATHERS_AADHAR} color="blue" />

            <DetailCard icon="fas fa-fingerprint" label="Mother Aadhaar" value={student.MOTHERS_AADHAR} color="purple" />

            <DetailCard icon="fas fa-graduation-cap" label="Father Education" value={student.FATHERS_EDUCATION} color="blue" />

            <DetailCard icon="fas fa-graduation-cap" label="Mother Education" value={student.MOTHERS_EDUCATION} color="purple" />

            <DetailCard icon="fas fa-briefcase" label="Father Occupation" value={student.FATHERS_OCCUPATION} color="blue" />

            <DetailCard icon="fas fa-briefcase" label="Mother Occupation" value={student.MOTHERS_OCCUPATION} color="purple" />

          </div>
        </Section>

        {/* Contact */}
        <Section title="Contact & Address" color="green">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

            <DetailCard icon="fas fa-phone" label="Phone No." value={student.PHONE} color="green" />

            <DetailCard icon="fas fa-phone" label="Alternate Mobile" value={student.ALT_MOBILE} color="blue" />

            <DetailCard icon="fas fa-map-pin" label="PIN Code" value={student.PIN} color="red" />

            <DetailCard icon="fas fa-envelope" label="Email" value={student.EMAIL} color="mailto" />

            <DetailCard icon="fas fa-road" label="Distance" value={student.Home_Distance} color="orange" />

          </div>
        </Section>

        <RTEDetails student={student} />
        <SiblingsSection siblings={siblings} handleSiblingClick={handleSiblingClick} />
        <AdditionalInfo student={student} />

      </div>
    </div>
  );
}

function Section({ title, color, children }) {
  const colors = {
    blue: "bg-blue-500",
    purple: "bg-purple-500",
    green: "bg-green-500",
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-white flex items-center gap-2">
        <div className={`w-1 h-6 rounded-full ${colors[color] || "bg-gray-500"}`} />
        {title}
      </h3>
      {children}
    </div>
  );
}

export default function StudentDetailsModal({
  isOpen, onClose, studentId, phone,
}) {
  const [status, setStatus] = useState("loading");
  const [studentData, setStudentData] = useState({
    student: null,
    siblings: [],
  });

  // Reusable fetch function
  const fetchStudentData = useCallback(async (params) => {
    const response = await apiPost("/api/student_modal_data", params);
    if (!response.ok) {
      throw new Error("Failed to fetch student details");
    }
    const json = await response.json();
    const [mainStudent, ...siblings] = json.students || [];
    return { student: mainStudent || null, siblings: siblings };
  }, []);

  useEffect(() => {
    if (!isOpen) return;

    setStudentData({ student: null, siblings: [] });
    setStatus("loading");

    if (!studentId && !phone) {
      setStatus("error");
      return;
    }

    let ignore = false;

    (async () => {
      try {
        const data = await fetchStudentData({ student_id: studentId, phone });
        if (!ignore) {
          setStudentData(data);
          setStatus("success");
        }
      } catch (err) {
        if (!ignore) setStatus("error");
      }
    })();

    return () => {
      ignore = true;
    };
  }, [isOpen, studentId, phone, fetchStudentData]);


  useEffect(() => {
    if (!isOpen) {
      setStatus("loading");
      setStudentData({ student: null, siblings: [] });
    }
  }, [isOpen]);


  // Handler for sibling click
  const handleSiblingClick = useCallback(
    async (siblingId, phone) => {

      if (status === "loading") return;
      setStatus("loading");

      try {
        const data = await fetchStudentData({ student_id: siblingId, phone:phone });
        setStudentData(data);
        setStatus("success");
      } catch (err) {
          setStatus("error");
      }
    },
    [status, fetchStudentData]
  );

  if (!isOpen) return null;

  const handleWhatsAppClick = () => {
    const number = studentData.student?.PHONE || phone;

    if (!number) {
      alert("No phone number available.");
      return;
    }

    try {
      sendWhatsAppMessage(number, "");
    } catch (err) {
      alert(err.message || "Failed to open WhatsApp.");
    }
  };

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-0 m-0">

      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative w-full h-full md:h-auto md:max-h-[90vh] md:max-w-3xl md:mx-4 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 md:rounded-2xl shadow-2xl border border-gray-700/30 overflow-hidden flex flex-col">

        {/* Header */}
        <div className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-600 to-purple-600 border-b border-white/10">
          <h2 className="text-white font-bold text-lg">Student Profile</h2>

          <button
            onClick={onClose}
            className="p-2 text-white/80 hover:text-white"
          >
            ✕
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto min-h-0">

          {status === "loading" && <ModalSkeleton />}

          {status === "error" && (
            <ModalError error="Unable to load student details." />
          )}

          {status === "success" && studentData.student && (
            <StudentContent
              student={studentData.student}
              siblings={studentData.siblings}
              handleSiblingClick={handleSiblingClick}
            />
          )}

        </div>

        {/* Footer */}
        <div className="p-4 bg-gray-900/95 border-t border-gray-700/30">
          <button
            onClick={onClose}
            className="w-full px-6 py-3 bg-gradient-to-r from-gray-700 to-gray-800 text-white rounded-xl"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
}