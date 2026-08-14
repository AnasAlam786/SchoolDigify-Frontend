export default function FormField({ id, label, required, children, error, className, labelHint }) {
  return (
    <div className={`form-field ${className || ''}`}>
      <label htmlFor={id} className={`block text-sm font-medium text-gray-300 mb-2`}>
        {label}

        {required && (
          <span className="text-red-400 ml-1">*</span>
        )}

        {labelHint && (
          <span className="ml-2 px-2 py-0.5 text-xs rounded bg-amber-500/20 text-amber-300">
            {labelHint}
          </span>
        )}

      </label>
      {children}
      {error ? (
        <div className="error-message show text-red-400 text-sm mt-2 flex items-center gap-2">
          <i className="fas fa-exclamation-circle"></i>
          <span>{error}</span>
        </div>
      ) : null}
    </div>
  );
}
