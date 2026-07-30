export default function RadioCardGroup({ name, options, selectedValue, onSelect, label, required, error }) {
  return (
    <div className="form-group radio-group-container mb-4 mt-2 mb-5 col-span-full">
      <label className={`form-label block mb-2 font-medium text-gray-light ${required ? "required" : ""}`}>{label}</label>
      <div className="radio-group grid grid-cols-1 sm:grid-cols-2 gap-4">
        {options.map((option) => {
          const selected = String(option.value) === String(selectedValue);
          return (
            <button
              type="button"
              key={option.value}
              className={`radio-card p-4 rounded-xl text-center cursor-pointer transition-all duration-300 relative ${selected ? "selected" : ""}`}
              onClick={() => onSelect(option.value)}
            >
              <input type="radio" name={name} value={option.value} className="absolute opacity-0 w-0 h-0" readOnly />
              <i className={`${option.icon} text-[1.8rem] mb-2 ${option.color || "text-white"}`}></i>
              <div>{option.label}</div>
            </button>
          );
        })}
      </div>
      {error ? <div className="error-message text-danger text-sm mt-1">{error}</div> : null}
    </div>
  );
}
