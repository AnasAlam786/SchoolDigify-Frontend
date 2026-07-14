import React from 'react'


function LoadingStatus() {
  return (
    <div className="flex-1 overflow-y-auto animate-pulse">
      {/* Student */}
      <div className="flex flex-col items-center mb-6">
        <div className="w-20 h-20 rounded-full bg-gradient-to-br from-gray-700 to-gray-800 ring-2 ring-gray-700" />

        <div className="mt-4 h-6 w-52 rounded-full bg-gradient-to-r from-gray-700 via-gray-600 to-gray-700" />
        <div className="mt-3 h-4 w-32 rounded-full bg-gray-700" />
      </div>

      {/* Class Card */}
      <div className="mb-6 rounded-2xl border border-gray-700 bg-gray-800/70 p-5 shadow-lg">
        <div className="flex items-center justify-between border-b border-gray-700 pb-4">
          <div className="h-4 w-28 rounded-full bg-gray-700" />
          <div className="h-4 w-24 rounded-full bg-gray-700" />
        </div>

        <div className="mt-4 flex items-center justify-between">
          <div className="h-4 w-28 rounded-full bg-gray-700" />
          <div className="h-4 w-20 rounded-full bg-gray-700" />
        </div>
      </div>

      {/* Inputs */}
      <div className="space-y-5">
        {[...Array(5)].map((_, i) => (
          <div key={i}>
            <div className="mb-2 h-4 w-36 rounded-full bg-gray-700" />
            <div className="h-12 rounded-xl border border-gray-700 bg-gradient-to-r from-gray-800 via-gray-700 to-gray-800" />
          </div>
        ))}
      </div>

      {/* Buttons */}
      <div className="mt-8 flex gap-3">
        <div className="h-12 flex-1 rounded-xl bg-gradient-to-r from-gray-700 to-gray-800" />
        <div className="h-12 flex-1 rounded-xl bg-gradient-to-r from-gray-800 to-gray-700" />
      </div>
    </div>
  );
};



function ErrorStatus({ onRetry }) {
  return (
    <div className="flex-1 flex items-center justify-center px-6 py-8">
      <div className="w-full max-w-md rounded-2xl border border-red-500/20 bg-red-500/5 p-8 text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full border border-red-500/20 bg-red-500/10 text-3xl">
          ⚠️
        </div>

        <h2 className="mt-5 text-xl font-semibold text-white">
          Unable to Load Student
        </h2>

        <p className="mt-2 text-sm leading-6 text-gray-400">
          Something went wrong while loading the Transfer Certificate
          information.
        </p>

        <button
          onClick={onRetry}
          className="mt-7 rounded-xl bg-green-600 px-5 py-3 font-medium text-white transition hover:bg-green-500"
        >
          Try Again
        </button>
      </div>
    </div>
  );
};

export { LoadingStatus, ErrorStatus }
