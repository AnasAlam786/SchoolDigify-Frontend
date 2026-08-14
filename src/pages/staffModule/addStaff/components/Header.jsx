import React from 'react';
import { useNavigate } from 'react-router-dom';

function Header({ handleSaveClick, isSubmitting }) {
  const navigate = useNavigate();

  return (
    <>
      {/* Top Header Banner */}
      <header className="relative flex flex-col sm:flex-row sm:items-center justify-between gap-6 py-6 px-8 mb-8 bg-slate-900/60 backdrop-blur-md rounded-2xl border border-emerald-900/40 shadow-xl overflow-hidden">
        {/* Background Accent Glows (Green / Emerald) */}
        <div className="absolute -top-10 -left-10 w-40 h-40 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-green-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Left Section: Back Button + Title Info */}
        <div className="flex items-center gap-4 z-10">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="flex items-center justify-center w-10 h-10 rounded-xl bg-slate-800/80 hover:bg-emerald-950/60 text-slate-300 hover:text-emerald-400 border border-slate-700/60 hover:border-emerald-500/40 transition-all duration-200 shrink-0"
            title="Go back"
          >
            <i className="fas fa-arrow-left text-sm" />
          </button>

          <div>
            <div className="flex items-center gap-3 mb-1">
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight bg-gradient-to-r from-white via-emerald-100 to-emerald-400 bg-clip-text text-transparent">
                Add New Staff Member
              </h1>
              <span className="hidden sm:inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                Add Mode
              </span>
            </div>
            <p className="text-slate-400 text-sm sm:text-base max-w-xl">
              Fill in all required details to add a new staff member to your organization
            </p>
          </div>
        </div>
      </header>

      {/* Sticky Bottom Floating Action Bar */}
      <div className="fixed bottom-0 left-0 right-0 md:left-auto md:right-6 md:bottom-6 z-50">
        <div className="max-w-6xl mx-auto md:mx-0 px-4 sm:px-6 md:px-0">
          <div className="bg-[#161616] border-t border-gray-800 md:border md:border-gray-700 shadow-[0_-6px_20px_rgba(0,0,0,0.6)] md:shadow-2xl rounded-t-xl md:rounded-xl px-4 py-3">
            <div className="flex flex-col items-center gap-2 md:items-stretch md:min-w-[240px]">
              <p className="text-xs text-gray-400 text-center md:text-left leading-snug">
                Review all details, then submit the form to continue.
              </p>
              <button
                type="button"
                id="FormSubmit"
                disabled={isSubmitting}
                onClick={handleSaveClick}
                className={`w-full md:w-full px-6 py-2.5 rounded-lg text-white font-semibold text-sm transition shadow-md flex items-center justify-center gap-2 ${
                  isSubmitting
                    ? "bg-green-700/60 cursor-not-allowed opacity-80"
                    : "bg-green-600 hover:bg-green-500 cursor-pointer shadow-green-900/30"
                }`}
              >
                {isSubmitting ? (
                  <>
                    <i className="fas fa-circle-notch fa-spin text-sm" />
                    <span>Adding Staff...</span>
                  </>
                ) : (
                  <>
                    <i className="fas fa-user-plus text-sm" />
                    <span>Add Staff</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Header;