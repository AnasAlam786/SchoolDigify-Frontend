export default function ImageUploader(
  { value, onChange, onRemove, label = 'Upload or capture photo' }
) {
  const handleFileChange = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    onChange(file);
  };

  return (
    <div className="space-y-4">
      <div className="relative border border-dashed border-gray-700 rounded-3xl p-6 bg-gray-900/70 text-center">
        <input
          type="file"
          id="studentPhotoUpload"
          accept="image/*"
          className="hidden"
          onChange={handleFileChange}
        />
        <label htmlFor="studentPhotoUpload" className="cursor-pointer flex flex-col items-center justify-center gap-4 py-12 px-4 rounded-3xl bg-[#111827] hover:bg-[#111827]/95 transition text-gray-300">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg">
            <i className="fas fa-cloud-upload-alt text-white text-2xl"></i>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-white">{label}</h3>
            <p className="text-sm text-gray-400">PNG, JPG or JPEG</p>
          </div>
        </label>
      </div>

      {value ? (
        <div className="rounded-3xl overflow-hidden border border-gray-700 bg-gray-900/70">
          <img loading="lazy" src={value} alt="Student preview" className="w-full h-auto object-cover" />
          <div className="p-3 bg-gray-950/80 text-right">
            <button
              type="button"
              onClick={onRemove}
              className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg border border-gray-700 text-sm text-gray-300 hover:bg-gray-800 transition"
            >
              <i className="fas fa-trash-alt"></i>
              Remove photo
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
}
