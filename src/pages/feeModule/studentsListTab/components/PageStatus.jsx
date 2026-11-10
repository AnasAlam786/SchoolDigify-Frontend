import FeeSessionSetupModal from "../../../utils/feeSessionSetup/FeeSessionSetupModal";
import { useState } from 'react';


function NoFeeSessionStatus({ onFeeSessionCreated }) {
  const [isFeeSessionSetupModalOpen, setFeeSessionSetupModalOpen] = useState(false);

  const handleModalSuccess = (data) => {
    // 1. Close the modal
    setFeeSessionSetupModalOpen(false);
    
    // 2. Trigger the grandparent refetch callback if provided
    if (onFeeSessionCreated) {
      onFeeSessionCreated(data);
    }
  };

  return (
    <>
      <div className=" m-8 relative overflow-hidden flex flex-col items-center justify-center py-16 px-4 text-center glass-card rounded-2xl border border-white/5">
        {/* Ambient Glow Background Effect */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Animated Icon Badge */}
        <div className="relative w-24 h-24 mb-6 rounded-full bg-gradient-to-br from-emerald-500/20 to-teal-500/20 flex items-center justify-center animate-gentle-bounce ring-1 ring-white/10">
          <i className="fas fa-file-invoice-dollar text-4xl text-emerald-300"></i>
        </div>

        {/* Content Hierarchy */}
        <h3 className="text-2xl font-bold text-white mb-2 tracking-tight">
          No Fee Session Configured
        </h3>

        <p className="text-gray-400 mb-8 max-w-md text-sm leading-relaxed">
          Set up a fee structure for the current academic session to begin managing payments, dues, and financial records for your students.
        </p>

        {/* Action Button */}
        <button
          onClick={() => setFeeSessionSetupModalOpen(true)}
          className="inline-flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-semibold rounded-xl transition-all duration-300 shadow-lg hover:shadow-emerald-500/25 transform hover:-translate-y-0.5 active:translate-y-0"
        >
          <i className="fas fa-sliders-h text-sm"></i>
          <span>Setup Fee Structure</span>
          <i className="fas fa-arrow-right text-sm"></i>
        </button>
      </div>

      {/* Modal Trigger */}
      {isFeeSessionSetupModalOpen && (
        <FeeSessionSetupModal
          onClose={() => setFeeSessionSetupModalOpen(false)}
          onSetupComplete={handleModalSuccess}
        />
      )}
    </>
  );
}


function SkeletonLoader() {
  return (
    <div className="grid gap-5 pb-5 animate-pulse md:grid-cols-2 xl:grid-cols-3">
      {[1, 2, 3, 4, 5, 6].map((card) => (
        <div key={card} className="space-y-4 rounded-2xl border border-[#2A2A2A] bg-[#1A1A1A] p-5">
          <div className="flex items-start justify-between">
            <div className="flex-1 space-y-2">
              <div className="h-5 w-32 rounded bg-gray-700 opacity-30" />
              <div className="h-4 w-24 rounded bg-gray-700 opacity-30" />
            </div>
            <div className="h-10 w-10 rounded-lg bg-gray-700 opacity-30" />
          </div>
          <div className="h-px bg-gray-700 opacity-20" />
          <div className="space-y-3">
            {[1, 2, 3, 4].map((row) => (
              <div key={row} className="flex items-center justify-between">
                <div className="h-4 w-20 rounded bg-gray-700 opacity-30" />
                <div className="h-4 w-24 rounded bg-gray-700 opacity-30" />
              </div>
            ))}
          </div>
          <div className="flex gap-2 pt-3">
            <div className="h-9 flex-1 rounded-lg bg-gray-700 opacity-30" />
            <div className="h-9 flex-1 rounded-lg bg-gray-700 opacity-30" />
            <div className="h-9 flex-1 rounded-lg bg-gray-700 opacity-30" />
          </div>
        </div>
      ))}
    </div>
  );
}


export {NoFeeSessionStatus, SkeletonLoader}