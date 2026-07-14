export default function FormField({ id, label, required, children, error, className }) {
  return (
    <div className={`form-field ${className || ''}`}>
      <label htmlFor={id} className={`block text-sm font-medium text-gray-300 mb-2 ${required ? 'required' : ''}`}>
        {label}
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
