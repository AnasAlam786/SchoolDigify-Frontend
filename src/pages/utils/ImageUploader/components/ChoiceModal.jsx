import { createPortal } from "react-dom";

export default function ChoiceModal({
    onClose,
    onUpload,
    onCamera,
}) {
    return createPortal(
        <div
            className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50"
            onClick={onClose}
        >
            <div
                className="w-80 rounded-xl bg-neutral-900 p-6"
                onClick={(e) => e.stopPropagation()}
            >
                <h2 className="mb-4 text-xl text-white">
                    Upload Photo
                </h2>

                <div className="space-y-3">
                    <button
                        onClick={onCamera}
                        className="w-full rounded bg-blue-600 p-3 text-white hover:bg-blue-700"
                    >
                        Take Photo
                    </button>

                    <button
                        onClick={onUpload}
                        className="w-full rounded border border-neutral-700 p-3 text-white hover:bg-neutral-800"
                    >
                        Upload Image
                    </button>

                    <button
                        onClick={onClose}
                        className="w-full rounded border border-neutral-700 p-3 text-white hover:bg-neutral-800"
                    >
                        Cancel
                    </button>
                </div>
            </div>
        </div>,
        document.body
    );
}