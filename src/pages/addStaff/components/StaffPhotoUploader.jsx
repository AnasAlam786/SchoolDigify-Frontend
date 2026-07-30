import { useRef } from "react";

export default function StaffPhotoUploader({ value, onChange, onRemove, label }) {
  const fileInputRef = useRef(null);

  const openFilePicker = (capture = false) => {
    if (!fileInputRef.current) return;
    if (capture) {
      fileInputRef.current.setAttribute("capture", "environment");
    } else {
      fileInputRef.current.removeAttribute("capture");
    }
    fileInputRef.current.click();
  };

  const handleFileChange = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      onChange(file, reader.result);
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="form-section custom-bg-gray-darker backdrop-blur-md rounded-xl custom-border p-3 mb-6 pb-6 shadow-[0_4px_15px_rgba(0,0,0,1)]">
      <div className="section-header flex items-center gap-4 mb-8 pb-4 bottom-border">
        <div className="section-icon w-12 h-12 bg-primary/15 rounded-xl flex items-center justify-center text-primary shadow-sm">
          <i className="fas fa-camera text-lg" />
        </div>
        <div>
          <h2 className="section-title text-xl font-semibold leading-tight">Profile Photo</h2>
          <p className="text-gray-500 text-sm mt-1">Upload or capture the photo of staff</p>
        </div>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFileChange}
      />

      <div className="w-full lg:w-1/2 mx-auto">
        <div className="relative border border-dashed border-gray-700 rounded-3xl p-6 bg-[#0f172a] text-center transition-all duration-300">
          {value ? (
            <>
              <img src={value} alt="Staff preview" className="mx-auto max-h-96 w-auto rounded-3xl border border-white/10 object-contain shadow-md" />
              <div className="mt-4 flex justify-center gap-3">
                <button
                  type="button"
                  onClick={() => openFilePicker(false)}
                  className="btn-upload px-4 py-3 rounded-xl border border-white/10 text-gray-300 hover:bg-[#4361ee]/10"
                >
                  Change Image
                </button>
                <button
                  type="button"
                  onClick={onRemove}
                  className="btn-upload px-4 py-3 rounded-xl border border-white/10 text-gray-300 hover:bg-[#ff6b6b]/10"
                >
                  Remove
                </button>
              </div>
            </>
          ) : (
            <div className="rounded-3xl border border-dashed border-white/10 bg-[#111827] p-10 cursor-pointer" onClick={() => openFilePicker(false)}>
              <div className="flex flex-col items-center gap-4">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg">
                  <i className="fas fa-cloud-upload-alt text-white text-2xl" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white">{label || "Click to upload the image of staff"}</h3>
                  <p className="text-sm text-gray-400">PNG, JPG or JPEG</p>
                </div>
              </div>
            </div>
          )}

          {!value ? (
            <div className="mt-4 flex flex-wrap justify-center gap-3">
              <button
                type="button"
                onClick={() => openFilePicker(false)}
                className="btn-upload px-4 py-3 rounded-xl border border-white/10 text-gray-300 hover:bg-[#4361ee]/10"
              >
                Upload
              </button>
              <button
                type="button"
                onClick={() => openFilePicker(true)}
                className="btn-upload px-4 py-3 rounded-xl border border-white/10 text-gray-300 hover:bg-[#4361ee]/10"
              >
                Capture
              </button>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
