import { useState, useEffect } from 'react';
import ControlPannel from './components/ControlPannel.jsx';
import AdmitCardPreview from './components/AdmitCardPreview.jsx';
import Header from './components/Header.jsx';
import { useClasses } from '../../hooks/useClasses';

function AdmitAndScheme() {

  const [previewHtml, setPreviewHtml] = useState('');
  const [HTMLFetchError, setHTMLFetchError] = useState("");
  const [isHTMLloading, setHTMLloading] = useState(false);


    const { 
        data: classes = [], isPending: isClassesLoading, error: classError
    } = useClasses();


  async function fetchHTMLPreview(selectedClass, admitHeading, schemeHeading, outputType, examScheme, feeHeading) {
    if (!selectedClass) {
      setPreviewHtml("");
      setHTMLFetchError("Please select a class first.");

      document.querySelector(".main-content")?.scrollTo({
        top: 0,
        behavior: "smooth",
      });

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
            admitHeading: admitHeading,
            schemeHeading: schemeHeading,
            outputType: outputType,
            examScheme: examScheme,
            feeHeading: feeHeading,
          }),
        }
      );

      const responseData = await res.json();
      if (!res.ok) {
        throw new Error(responseData.message || responseData.error || 'Failed to generate print preview.');
      }
      setPreviewHtml(responseData.html || "");
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
        classError={classError}
        isClassesLoading={isClassesLoading}

        fetchHTMLPreview={fetchHTMLPreview}
        isHTMLloading={isHTMLloading}
        HTMLFetchError={HTMLFetchError}
      />

      <div className="bg-[#1A1A1A] rounded-xl shadow-2xl p-4 sm:p-6 border border-gray-700">
        <AdmitCardPreview
          previewHtml={previewHtml}
          isHTMLloading={isHTMLloading}
          error={HTMLFetchError}
        />
      </div>
    </>
  );
}

export default AdmitAndScheme;
