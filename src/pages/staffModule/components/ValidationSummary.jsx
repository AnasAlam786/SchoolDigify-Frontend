import React from "react";

export default function ValidationSummary({ errors = {} }) {
  // Extract error values whether errors is an object or an array
  const errorList = Array.isArray(errors)
    ? errors.filter(Boolean)
    : Object.values(errors).filter(Boolean);

  if (errorList.length === 0) return null;

  return (
    <div className="validation-summary bg-danger/10 rounded-xl p-4 mb-5">
      <h4 className="text-danger mb-2 flex items-center gap-2">
        <i className="fas fa-exclamation-circle" /> Please fix the following errors:
      </h4>
      <ul className="pl-5 text-[#ff9f9f] list-disc space-y-1">
        {errorList.map((error, index) => (
          <li key={index}>{error}</li>
        ))}
      </ul>
    </div>
  );
}