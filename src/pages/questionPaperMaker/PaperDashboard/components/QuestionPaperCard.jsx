import { memo, useState } from 'react';
import { apiGet, apiPost } from '../../../../api/api';
import { useNavigate } from 'react-router-dom';

export default memo(function QuestionPaperCard({
  paper,
  isMyPaper,
  removePaperFromState,
  menuOpenId,
  setMenuOpenId,
}) {
  const navigate = useNavigate();
  console.log(paper)

  const [loading, setLoading] = useState({
    downloadPDF: false,
    duplicatePaper: false,
    deletePaper: false,
  });

  // Font size state for the slider (default 20px)
  const [fontSize, setFontSize] = useState(20);

  const isBusy =
    loading.downloadPDF ||
    loading.duplicatePaper ||
    loading.deletePaper;

  const handleEdit = (paperId) => {
    if (isBusy) return;
    navigate(`/question-papers/${paperId}`)
  };

  const handleDownload = async (paperId) => {
    if (isBusy) return;

    setLoading((prev) => ({ ...prev, downloadPDF: true }));

    try {
      // Include font size as a query parameter
      const response = await apiGet(
        `/api/question-paper-PDF/${paperId}?fontSize=${fontSize}`
      );

      if (!response.ok) {
        throw new Error('Failed to fetch paper.');
      }

      const data = await response.json();
      const paperHTML = data.html;

      const newWindow = window.open('', '_blank');
      if (!newWindow) throw new Error('Popup blocked');

      newWindow.document.open();
      newWindow.document.write(paperHTML);

      newWindow.onload = () => {
        newWindow.print();
      };

      newWindow.document.close();
    } catch (err) {
      console.error(err);
      showAlert(500, err.message);
    } finally {
      setLoading((prev) => ({ ...prev, downloadPDF: false }));
    }
  };

  const handleDuplicate = async (paperId) => {
    if (isBusy) return;

    setLoading((prev) => ({ ...prev, duplicatePaper: true }));

    try {
      const response = await apiPost(`/api/duplicate-paper/${paperId}`);
      const data = await response.json();

      if (!response.ok) {
        showAlert(data.error || 'Failed to clone paper.');
        throw new Error('Failed to fetch paper.');
      }

      navigate(`/question-papers/${data.paper_id}`);
    } catch (err) {
      console.error(err);
      showAlert(500, err.message);
    } finally {
      setMenuOpenId(null);
      setLoading((prev) => ({ ...prev, duplicatePaper: false }));
    }
  };

  const handleDelete = async (paperId) => {
    if (isBusy) return;

    setLoading((prev) => ({ ...prev, deletePaper: true }));

    try {
      const response = await apiPost(`/api/delete-paper/${paperId}`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to delete paper.');
      }

      removePaperFromState(paperId);
      showAlert(200, data.message || 'Paper deleted successfully.');
    } catch (err) {
      showAlert(500, err.message);
      console.error(err);
    } finally {
      setMenuOpenId(null);
      setLoading((prev) => ({ ...prev, deletePaper: false }));
    }
  };

  const handleToggleMenu = (event, paperId) => {
    if (isBusy) return;
    event.stopPropagation();
    setMenuOpenId((current) => (current === paperId ? null : paperId));
  };

  // Helper to format dates like "Jul 2, 2026"
  const formatDate = (dateString) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <div
      className="paper-card transform transition-all duration-300 hover:scale-[1.02]"
      id={`paper-card-${paper.id}`}
    >
      <div className="group bg-navbg/50 backdrop-blur-sm border border-gray-700 rounded-2xl overflow-hidden hover:border-primary hover:shadow-xl hover:shadow-primary/10 transition-all duration-300 h-full flex flex-col">
        {/* Gradient line + three-dot menu */}
        <div className="relative">
          <div className="h-2 bg-gradient-to-r from-primary to-secondary"></div>

          {/* Three-dot menu (same logic, new styling) */}
          <div className="absolute top-3 right-3">
            <div className="relative">
              <button
                onClick={(e) => handleToggleMenu(e, paper.id)}
                disabled={isBusy}
                className="p-2 hover:bg-gray-700/50 rounded-lg transition group"
                title="More options"
              >
                <i className="fas fa-ellipsis-v text-gray-400 group-hover:text-white"></i>
              </button>

              {menuOpenId === paper.id && (
                <div className="absolute right-0 mt-2 w-48 bg-navbg border border-gray-700 rounded-xl shadow-2xl z-20">
                  <button
                    onClick={() => handleDuplicate(paper.id)}
                    className="w-full text-left px-4 py-3 text-gray-300 hover:bg-gray-700/50 hover:text-white transition text-sm flex items-center gap-2"
                  >
                    {loading.duplicatePaper ? (
                      <>
                        <i className="fas fa-spinner fa-spin" /> Cloning...
                      </>
                    ) : (
                      <>
                        <i className="fas fa-copy" /> Duplicate
                      </>
                    )}
                  </button>

                  <button
                    onClick={() => handleDelete(paper.id)}
                    className="w-full text-left px-4 py-3 text-danger hover:bg-red-900/50 hover:text-red-300 transition text-sm flex items-center gap-2 border-t border-gray-700"
                  >
                    {loading.deletePaper ? (
                      <>
                        <i className="fas fa-spinner fa-spin" /> Deleting...
                      </>
                    ) : (
                      <>
                        <i className="fas fa-trash" /> Delete
                      </>
                    )}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Card Body */}
        <div className="p-6 flex-1">
          {/* Title & Teacher */}
          <div className="flex items-start justify-between mb-5">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <i className="fas fa-file-alt text-primary text-sm"></i>
                <h2
                  className="text-lg font-bold text-white truncate"
                  title={paper.event}
                >
                  {paper.event}
                </h2>
              </div>
              <p className="text-xs text-gray-400 flex items-center gap-1">
                <i className="fas fa-user-graduate text-gray-500"></i>
                <span className="truncate">{paper.teacher_name || '—'}</span>
              </p>
            </div>
          </div>

          {/* Stats: Class & Subject */}
          <div className="grid grid-cols-2 gap-3 mb-5">
            <div className="bg-darkbg/30 rounded-xl p-3 border border-gray-700/50">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center">
                  <i className="fas fa-layer-group text-primary text-sm"></i>
                </div>
                <div>
                  <p className="text-xs text-gray-400">Class</p>
                  <p className="text-white font-semibold text-sm leading-tight">
                    {paper.class_name}
                  </p>
                </div>
              </div>
            </div>
            <div className="bg-darkbg/30 rounded-xl p-3 border border-gray-700/50">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-secondary/10 flex items-center justify-center">
                  <i className="fas fa-book-open text-secondary text-sm"></i>
                </div>
                <div>
                  <p className="text-xs text-gray-400">Subject</p>
                  <p className="text-white font-semibold text-sm leading-tight">
                    {paper.subject}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Dates */}
          <div className="space-y-2 text-xs">
            <div className="flex items-center gap-2 text-gray-400">
              <i className="fas fa-calendar-plus w-4 text-center"></i>
              <span>
                Created:{' '}
                <span className="text-gray-300">
                  {formatDate(paper.created_at) || '—'}
                </span>
              </span>
            </div>
            <div className="flex items-center gap-2 text-gray-400">
              <i className="fas fa-pen w-4 text-center"></i>
              <span>
                Updated:{' '}
                <span className="text-gray-300">
                  {formatDate(paper.updated_at) || '—'}
                </span>
              </span>
            </div>
          </div>

          {/* Questions & Words count */}
          <div className="flex justify-between text-xs text-gray-400 mt-2">
            <span>Questions: {paper.num_questions ?? '—'}</span>
            <span>Words: {paper.num_words ?? '—'}</span>
          </div>
        </div>

        {/* Card Footer */}
        <div className="px-6 py-4 bg-darkbg/30 border-t border-gray-700">
          <div className="flex flex-col gap-2">
            {/* Font size slider */}
            <div className="flex items-center gap-3">
              <i className="fas fa-text-height text-gray-400 text-sm"></i>
              <div className="flex items-center gap-3 w-full">
                <input
                  type="range"
                  min="10"
                  max="40"
                  value={fontSize}
                  id={`fontSize-${paper.id}`}
                  className="w-full h-1.5 bg-gray-600 rounded-lg appearance-none cursor-pointer accent-primary"
                  onChange={(e) => setFontSize(Number(e.target.value))}
                  disabled={isBusy}
                />
                <span
                  className="text-xs text-gray-300 w-10 text-right font-medium"
                  id={`fontSizeValue-${paper.id}`}
                >
                  {fontSize}px
                </span>
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex gap-3">
              {/* PDF Download */}
              <button
                onClick={() => handleDownload(paper.id)}
                disabled={loading.downloadPDF || isBusy}
                className="flex-1 group relative overflow-hidden bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 text-white font-semibold py-2 px-3 rounded-lg transition duration-300 text-sm flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
              >
                <div className="absolute inset-0 bg-white/10 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-500"></div>
                {loading.downloadPDF ? (
                  <>
                    <i className="fas fa-spinner fa-spin" />
                    Downloading...
                  </>
                ) : (
                  <>
                    <i className="fas fa-download"></i> PDF
                  </>
                )}
              </button>

              {/* Edit / Clone button */}
              {isMyPaper ? (
                <button
                  onClick={() => handleEdit(paper.id)}
                  disabled={isBusy}
                  className="flex-1 group relative overflow-hidden bg-gray-700/50 hover:bg-gray-600 text-white font-semibold py-2 px-3 rounded-lg transition duration-300 text-sm flex items-center justify-center gap-2 border border-gray-600 disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  <div className="absolute inset-0 bg-white/5 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-500"></div>
                  <i className="fas fa-edit"></i> Edit
                </button>
              ) : (
                <button
                  onClick={() => handleDuplicate(paper.id)}
                  disabled={loading.duplicatePaper || isBusy}
                  className="flex-1 group relative overflow-hidden bg-gray-700/50 hover:bg-gray-600 text-white font-semibold py-2 px-3 rounded-lg transition duration-300 text-sm flex items-center justify-center gap-2 border border-gray-600 disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  <div className="absolute inset-0 bg-white/5 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-500"></div>
                  {loading.duplicatePaper ? (
                    <>
                      <i className="fas fa-spinner fa-spin" />
                      Cloning...
                    </>
                  ) : (
                    <>
                      <i className="fas fa-copy"></i> Clone
                    </>
                  )}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});