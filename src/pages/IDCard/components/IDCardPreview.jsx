import { useEffect, useRef } from "react";
import "../designs/hangingIDCard/hangingIDCard.js"

function IDCardPreview({ student, school}) {
  const cardRef = useRef(null);

  useEffect(() => {
    const card = cardRef.current;

    if (!card) return;

    const imageBaseUrl = "https://lh3.googleusercontent.com/d/";

    card.setAttribute("school-name", school.name || "");

    card.setAttribute(
      "school-udise",
      `UDISE: ${school.udise || ""}`
    );

    card.setAttribute(
      "school-logo",
      school.logo || ""
    );

    card.setAttribute(
      "session-year",
      student.session_year || ""
    );

    card.setAttribute(
      "student-image",
      student.image
        ? `${imageBaseUrl}${student.image}=s220`
        : "static/no-student-boy-image.png"
    );

    card.setAttribute(
      "student-name",
      student.student_name || ""
    );

    card.setAttribute(
      "student-father",
      `C/O ${student.father_name || ""}`
    );

    card.setAttribute(
      "student-class-roll",
      student.class_roll || ""
    );

    card.setAttribute(
      "student-dob",
      student.dob || ""
    );

    card.setAttribute(
      "student-phone",
      student.phone || "N/A"
    );

    card.setAttribute(
      "student-address",
      student.address || "N/A"
    );

    card.setAttribute(
      "teacher-sign",
      student.teacher_sign
        ? `${imageBaseUrl}${student.teacher_sign}=s200`
        : ""
    );

    card.setAttribute(
      "principal-sign",
      school.principal_sign
        ? `${imageBaseUrl}${school.principal_sign}=s200`
        : ""
    );

    card.setAttribute(
      "school-address",
      school.address || ""
    );

    card.setAttribute(
      "school-phone",
      school.phone || ""
    );
  }, [student, school]);

  return (
    <hanging-image-icard ref={cardRef} />
  );
}

export default IDCardPreview;