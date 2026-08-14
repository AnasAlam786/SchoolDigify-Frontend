import React from "react";

const SkeletonBlock = ({ className = "" }) => (
  <div className={`animate-pulse bg-gray-800/60 rounded-lg ${className}`} />
);

export function FormSkeletonLoader() {
  return (
    <div className="mx-auto max-w-7xl animate-pulse space-y-6">
      {/* Header Skeleton */}
      <div className="flex items-center justify-between pb-6 border-b border-gray-800">
        <div className="flex items-center gap-4">
          <SkeletonBlock className="w-12 h-12 rounded-xl" />
          <div className="space-y-2">
            <SkeletonBlock className="w-48 h-6" />
            <SkeletonBlock className="w-32 h-4" />
          </div>
        </div>
        <SkeletonBlock className="w-28 h-10 rounded-xl" />
      </div>

      <div className="form-container flex flex-col gap-[30px] flex-wrap">
        <div className="main-form flex-1 min-w-[300px] space-y-6">
          
          {/* Section 1: Personal Info Skeleton */}
          <div className="bg-gray-dark/70 backdrop-blur-md rounded-xl p-6 border border-gray-800/50">
            <div className="flex items-center mb-6 pb-4 border-b border-gray-800/80">
              <SkeletonBlock className="w-10 h-10 rounded-lg mr-4" />
              <SkeletonBlock className="w-40 h-6" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {[...Array(6)].map((_, idx) => (
                <div key={idx} className="space-y-2">
                  <SkeletonBlock className="w-24 h-4" />
                  <SkeletonBlock className="w-full h-11 rounded-xl" />
                </div>
              ))}
            </div>
          </div>

          {/* Section 2: Account Credentials Skeleton */}
          <div className="bg-gray-dark/70 backdrop-blur-md rounded-xl p-6 border border-gray-800/50">
            <div className="flex items-center mb-6 pb-4 border-b border-gray-800/80">
              <SkeletonBlock className="w-10 h-10 rounded-lg mr-4" />
              <SkeletonBlock className="w-44 h-6" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {[...Array(3)].map((_, idx) => (
                <div key={idx} className="space-y-2">
                  <SkeletonBlock className="w-24 h-4" />
                  <SkeletonBlock className="w-full h-11 rounded-xl" />
                </div>
              ))}
            </div>
          </div>

          {/* Section 3: Professional Info Skeleton */}
          <div className="bg-gray-dark/70 backdrop-blur-md rounded-xl p-6 border border-gray-800/50">
            <div className="flex items-center mb-6 pb-4 border-b border-gray-800/80">
              <SkeletonBlock className="w-10 h-10 rounded-lg mr-4" />
              <SkeletonBlock className="w-48 h-6" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {[...Array(3)].map((_, idx) => (
                <div key={idx} className="space-y-2">
                  <SkeletonBlock className="w-28 h-4" />
                  <SkeletonBlock className="w-full h-11 rounded-xl" />
                </div>
              ))}
            </div>
          </div>

          {/* Section 4: Permissions Overview Skeleton */}
          <div className="bg-gray-dark/70 backdrop-blur-md rounded-xl p-6 border border-gray-800/50">
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-800/80">
              <div className="flex items-center">
                <SkeletonBlock className="w-10 h-10 rounded-lg mr-4" />
                <SkeletonBlock className="w-36 h-6" />
              </div>
              <SkeletonBlock className="w-28 h-9 rounded-lg" />
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
              {[...Array(8)].map((_, idx) => (
                <SkeletonBlock key={idx} className="h-10 rounded-lg" />
              ))}
            </div>
          </div>

          {/* Section 5: Profile Photo Uploader Skeleton */}
          <div className="bg-gray-dark/70 backdrop-blur-md rounded-xl p-6 border border-gray-800/50">
            <div className="flex items-center mb-6 pb-4 border-b border-gray-800/80">
              <SkeletonBlock className="w-10 h-10 rounded-lg mr-4" />
              <div className="space-y-1">
                <SkeletonBlock className="w-32 h-5" />
                <SkeletonBlock className="w-64 h-3" />
              </div>
            </div>
            <div className="max-w-lg mx-auto flex flex-col items-center gap-4">
              <SkeletonBlock className="w-32 h-32 rounded-full" />
              <SkeletonBlock className="w-40 h-9 rounded-lg" />
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

export default FormSkeletonLoader;