export default function BulkImportModal({
  open,
  onClose,
  onDownloadTemplate,
  fileInfo,
  onFileSelect,
  onRemoveFile,
  onValidate,
  currentSection,
  validationState,
  onBackToUpload,
  onProceedToPreview,
  onRetryValidation,
  onBackToValidation,
  onImport,
}) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
      <div className="w-full max-w-4xl max-h-[90vh] modal-entrance">
        <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl overflow-hidden">
          <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center space-x-3">
              <div className="bg-gradient-to-br from-blue-500 to-indigo-600 p-3 rounded-xl shadow-md">
                <i className="fas fa-users text-white text-xl"></i>
              </div>
              <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Bulk Student Import</h2>
            </div>
            <button onClick={onClose} className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition">
              <i className="fas fa-times text-2xl"></i>
            </button>
          </div>

          <div className="p-6 space-y-6">
            <div className="flex justify-end">
              <button
                type="button"
                onClick={onDownloadTemplate}
                className="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition"
              >
                <i className="fas fa-download mr-2"></i>Download Template
              </button>
            </div>

            <div id="uploadSection" className={currentSection === 'upload' ? 'space-y-4' : 'hidden'}>
              <div
                id="uploadArea"
                className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl p-8 text-center hover:border-blue-500 dark:hover:border-blue-400 transition cursor-pointer"
                onDragOver={(event) => event.preventDefault()}
                onDrop={(event) => {
                  event.preventDefault();
                  const droppedFile = event.dataTransfer.files?.[0];
                  if (droppedFile) onFileSelect(droppedFile);
                }}
              >
                <div className="space-y-3">
                  <div className="flex justify-center">
                    <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-full">
                      <i className="fas fa-cloud-upload-alt text-4xl text-blue-600 dark:text-blue-400"></i>
                    </div>
                  </div>
                  <div>
                    <p className="text-gray-700 dark:text-gray-300 font-medium">Click to browse or drag & drop</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Excel files only (.xlsx)</p>
                  </div>
                  <input type="file" id="excelFileInput" accept=".xlsx" className="hidden" onChange={(event) => onFileSelect(event.target.files?.[0])} />
                </div>
              </div>

              <div className={fileInfo ? 'bg-gray-50 dark:bg-gray-800 rounded-lg p-4 flex items-center justify-between' : 'hidden'}>
                <div className="flex items-center space-x-3">
                  <i className="fas fa-file-excel text-green-600 text-2xl"></i>
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">{fileInfo?.name}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{fileInfo?.size}</p>
                  </div>
                </div>
                <button type="button" onClick={onRemoveFile} className="text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300">
                  <i className="fas fa-times-circle"></i>
                </button>
              </div>

              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={onValidate}
                  className="px-6 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-medium rounded-lg shadow-md hover:shadow-lg focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition"
                  disabled={!fileInfo}
                >
                  Validate Data
                </button>
              </div>
            </div>

            <div id="validationSection" className={currentSection === 'validation' ? 'space-y-4' : 'hidden'}>
              <div className={validationState?.loading ? 'text-center py-8' : 'hidden'}>
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                <p className="mt-2 text-gray-600 dark:text-gray-400">Validating your data...</p>
              </div>

              <div id="validationResults" className={validationState?.loaded ? 'space-y-4' : 'hidden'}>
                <div id="validationSuccess" className={validationState?.success ? 'p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg' : 'hidden'}>
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <i className="fas fa-check-circle text-green-600 dark:text-green-400"></i>
                    </div>
                    <div className="ml-3">
                      <h3 className="text-sm font-medium text-green-800 dark:text-green-300">Validation Successful</h3>
                      <p className="text-sm text-green-700 dark:text-green-400 mt-1">All records are valid. You can now preview the data.</p>
                    </div>
                  </div>
                </div>

                <div id="validationErrors" className={validationState?.success === false ? 'p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg' : 'hidden'}>
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <i className="fas fa-exclamation-triangle text-red-600 dark:text-red-400"></i>
                    </div>
                    <div className="ml-3">
                      <h3 className="text-sm font-medium text-red-800 dark:text-red-300">Validation Errors</h3>
                      <p className="text-sm text-red-700 dark:text-red-400 mt-1">Please fix the errors below and upload again.</p>
                    </div>
                  </div>
                </div>

                <div id="errorContainer" className={validationState?.errors?.length ? 'space-y-3 max-h-80 overflow-y-auto pr-2' : 'hidden'}>
                  {validationState.errors?.map((error, index) => (
                    <div key={index} className="error-card">
                      <p className="text-sm text-red-700 dark:text-red-200">{error}</p>
                    </div>
                  ))}
                </div>

                <div className="flex justify-end space-x-3">
                  <button type="button" id="backToUploadFromValidation" onClick={onBackToUpload} className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 transition">
                    Upload Again
                  </button>
                  <button type="button" id="proceedToPreview" onClick={onProceedToPreview} className={validationState?.success ? 'px-6 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-medium rounded-lg shadow-md hover:shadow-lg transition' : 'hidden'}>
                    Preview Data
                  </button>
                  <button type="button" id="retryValidation" onClick={onRetryValidation} className={validationState?.success === false ? 'px-6 py-2 bg-gradient-to-r from-yellow-500 to-orange-500 text-white font-medium rounded-lg shadow-md hover:shadow-lg transition' : 'hidden'}>
                    Retry Validation
                  </button>
                </div>
              </div>
            </div>

            <div id="previewSection" className={currentSection === 'preview' ? 'space-y-4' : 'hidden'}>
              <div id="previewLoading" className={validationState?.previewLoading ? 'text-center py-8' : 'hidden'}>
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                <p className="mt-2 text-gray-600 dark:text-gray-400">Loading preview...</p>
              </div>

              <div id="previewContent" className={validationState?.previewLoaded ? 'space-y-4' : 'hidden'}>
                <div className="p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <i className="fas fa-info-circle text-blue-600 dark:text-blue-400"></i>
                    </div>
                    <div className="ml-3">
                      <p id="previewSummary" className="text-sm text-blue-800 dark:text-blue-300">{validationState.previewSummary}</p>
                    </div>
                  </div>
                </div>

                <div className="overflow-x-auto max-h-80 border border-gray-200 dark:border-gray-700 rounded-lg">
                  <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                    <thead className="bg-gray-50 dark:bg-gray-800 sticky top-0">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">SR No</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Student Name</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Class</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Admission No</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Father Name</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Phone</th>
                      </tr>
                    </thead>
                    <tbody id="previewTableBody" className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
                      {validationState.previewRows?.map((row, index) => (
                        <tr key={row.id || index} className="odd:bg-white even:bg-gray-50 dark:odd:bg-gray-900 dark:even:bg-gray-950">
                          <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-300">{row.sr}</td>
                          <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-300">{row.name}</td>
                          <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-300">{row.className}</td>
                          <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-300">{row.admissionNo}</td>
                          <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-300">{row.fatherName}</td>
                          <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-300">{row.phone}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="flex justify-end space-x-3">
                  <button type="button" id="backToValidation" onClick={onBackToValidation} className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 transition">
                    Back
                  </button>
                  <button type="button" id="importStudentsBtn" onClick={onImport} className="px-6 py-2 bg-gradient-to-r from-green-600 to-emerald-600 text-white font-medium rounded-lg shadow-md hover:shadow-lg transition">
                    Import Students
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
