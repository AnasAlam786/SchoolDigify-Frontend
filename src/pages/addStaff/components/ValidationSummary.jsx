export default function ValidationSummary({ errors }) {
  if (!errors || errors.length === 0) return null;

  return (
    <div className="validation-summary bg-danger/10 rounded-xl p-4 mb-5">
      <h4 className="text-danger mb-2 flex items-center gap-2">
        <i className="fas fa-exclamation-circle" /> Please fix the following errors:
      </h4>
      <ul className="pl-5 text-[#ff9f9f] list-disc space-y-1">
        {errors.map((error, index) => (
          <li key={index}>{error}</li>
        ))}
      </ul>
    </div>
  );
}
