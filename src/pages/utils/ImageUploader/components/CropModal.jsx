import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import Cropper from "cropperjs";
import "cropperjs/dist/cropper.css";

export default function CropperModal({
    cropSrc,
    setImage,
    setShowCropper,
}) {
    const imageRef = useRef(null);
    const cropperRef = useRef(null);

    const [zoom, setZoom] = useState(1);

    useEffect(() => {
        if (!imageRef.current) return;

        const cropper = new Cropper(imageRef.current, {
            aspectRatio: 1,
            viewMode: 1,
            dragMode: "move",

            autoCropArea: 1,

            movable: true,
            zoomable: true,
            scalable: false,
            rotatable: false,

            cropBoxMovable: true,
            cropBoxResizable: true,

            guides: false,
            center: true,
            highlight: false,

            background: false,

            responsive: true,

            checkOrientation: false,
        });

        cropperRef.current = cropper;

        return () => {
            cropper.destroy();
        };
    }, []);

    const handleZoom = (value) => {
        setZoom(value);

        cropperRef.current?.zoomTo(value);
    };

    const cropSave = () => {
        const canvas = cropperRef.current?.getCroppedCanvas({
            width: 500,
            height: 500,
            imageSmoothingQuality: "high",
        });

        if (!canvas) return;

        setImage(canvas.toDataURL("image/png"));
        setShowCropper(false);
    };

    return createPortal(
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60">

            <div className="w-full max-w-2xl rounded-xl bg-neutral-900 shadow-xl border border-neutral-700">

                {/* Cropper */}

                <div className="p-4">

                    <div className="rounded-lg overflow-hidden bg-neutral-800">

                        <img
                            ref={imageRef}
                            src={cropSrc}
                            alt=""
                            className="max-w-full max-h-[70vh] cropper-hidden"
                        />

                    </div>

                </div>

                {/* Zoom */}

                <div className="border-t border-neutral-700 p-4">

                    <div className="flex items-center gap-4">

                        <span className="text-sm text-gray-300 w-14">
                            Zoom
                        </span>

                        <input
                            type="range"
                            min={1}
                            max={3}
                            step={0.01}
                            value={zoom}
                            onChange={(e) =>
                                handleZoom(Number(e.target.value))
                            }
                            className="w-full accent-blue-600"
                        />

                        <span className="text-sm text-gray-300 w-12 text-right">
                            {(zoom * 100).toFixed(0)}%
                        </span>

                    </div>

                </div>

                {/* Footer */}

                <div className="flex justify-end gap-3 border-t border-neutral-700 p-4">

                    <button
                        onClick={() => setShowCropper(false)}
                        className="rounded-lg border border-neutral-700 px-4 py-2 text-gray-200 hover:border-neutral-500 hover:text-white"
                    >
                        Cancel
                    </button>

                    <button
                        onClick={cropSave}
                        className="rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
                    >
                        Crop & Save
                    </button>

                </div>

            </div>

        </div>, 
        document.body
    );
}