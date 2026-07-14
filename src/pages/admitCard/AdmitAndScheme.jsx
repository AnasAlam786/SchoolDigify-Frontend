import { useState, useEffect } from 'react';
import ControlPannel from './components/ControlPannel.jsx';
import AdmitCardPreview from './components/AdmitCardPreview.jsx';
import Header from './components/Header.jsx';

function AdmitAndScheme() {
  const [classes, setClasses] = useState([]);
  const [isClassesLoading, setIsClassesLoading] = useState(false);

  const [previewHtml, setPreviewHtml] = useState('');
  const [HTMLFetchError, setHTMLFetchError] = useState("");
  const [isHTMLloading, setHTMLloading] = useState(false);


  useEffect(() => {
    async function fetchClasses() {
      setIsClassesLoading(true);
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/api/get_classes`, {
          credentials: 'include'
        });
        if (!res.ok) throw new Error('Failed to fetch classes');
        const data = await res.json();
        setClasses(data.classes || data || []);
      } catch (err) {
        console.error('fetchClasses error', err);
      } finally {
        setIsClassesLoading(false);
      }
    }

    fetchClasses();
  }, []);


  async function fetchHTMLPreview(selectedClass, exam, year, outputType, examScheme) {
    if (!selectedClass) {
      setPreviewHtml("");
      return;
    }

    setHTMLloading(true);

    try {
      setHTMLFetchError("");

      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/admit_cards_api`,
        {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            class: selectedClass,
            exam: exam,
            year: year,
            outputType: outputType,
            examScheme: examScheme,
          }),
        }
      );

      if (!res.ok) {
        throw new Error("Failed to fetch students");
      }

      const students = await res.json();

      setPreviewHtml(students.html || "");
    } catch (err) {
      console.error(err);

      setHTMLFetchError(err.message);
      setPreviewHtml("");
    } finally {
      setHTMLloading(false);
    }
  }

  return (
    <>
      <Header />
      <ControlPannel
        classes={classes}
        isClassesLoading={isClassesLoading}

        fetchHTMLPreview={fetchHTMLPreview}
        isHTMLloading={isHTMLloading}
        HTMLFetchError={HTMLFetchError}
      />

      <div className="bg-[#1A1A1A] rounded-xl shadow-2xl p-4 sm:p-6 border border-gray-700">
        <AdmitCardPreview
          previewHtml={previewHtml}
          isHTMLloading={isHTMLloading}
        />
      </div>
    </>
  );
}

export default AdmitAndScheme;
