function AdmitCardPreview({ previewHtml, isHTMLloading }) {

  const handleOpen = () => {
    if (!previewHtml) {
      alert('Generate preview before opening in a new window.');
      return;
    }

    const newWindow = window.open('', '_blank');
    if (!newWindow) {
      alert('Unable to open new window.');
      return;
    }

    newWindow.document.open();
    newWindow.document.write(previewHtml);
    newWindow.document.close();
  };

  const handlePrint = () => {
    if (!previewHtml) {
      alert('Generate preview before printing.');
      return;
    }

    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      alert('Unable to open new window for printing.');
      return;
    }

    printWindow.document.open();
    printWindow.document.write(previewHtml);
    printWindow.document.close();
    printWindow.onload = () => {
      printWindow.focus();
      printWindow.print();
    };
  };


  return (
    <>
      <h2 className="text-lg font-medium text-white mb-4">Preview</h2>
      <div className="flex flex-col gap-3 md:flex-row justify-between items-start md:items-center mb-4">
        <div className="text-sm text-gray-400">{isHTMLloading}</div>
        <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
          <button
            type="button"
            onClick={handlePrint}
            className="inline-flex items-center justify-center px-5 py-2.5 border border-transparent text-sm font-medium rounded-lg text-white bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 focus:ring-offset-gray-900 shadow-md disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 w-full sm:w-auto"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
            </svg>
            Print All Pages
          </button>
          <button
            type="button"
            onClick={handleOpen}
            className="inline-flex items-center justify-center px-5 py-2.5 border border-gray-600 text-sm font-medium rounded-lg text-gray-300 bg-gray-800/50 hover:bg-gray-800/50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 focus:ring-offset-gray-900 shadow-md disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 w-full sm:w-auto"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2v-8m-6-4l4 4m0 0l4-4m-4 4V2" />
            </svg>
            Open in New Window
          </button>
        </div>
      </div>
      <div className="border-2 border-dashed border-gray-600 rounded-xl p-4 min-h-[300px] bg-gray-900/50 max-h-[600px] overflow-y-auto">
        {previewHtml ? (
          <div dangerouslySetInnerHTML={{ __html: previewHtml }} />
        ) : (
          <div className="text-gray-500">Select a class and click "Generate Preview" to see admit cards here.</div>
        )}
      </div>
    </>
  );
}

export default AdmitCardPreview;
