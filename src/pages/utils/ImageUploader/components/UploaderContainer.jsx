import { useRef } from "react";
import { FaCloudUploadAlt, FaUpload, FaCamera, } from "react-icons/fa";
import { IoClose } from "react-icons/io5";

const UploadContainer = ({
    image, setImage, onOpenChoice, onUpload, onCapture,
}) => {

    const removeImage = () => {
        setImage("")
    };

    return (
        <div className="flex-1 rounded-xl bg-[#1A1A1A]/70 backdrop-blur-md shadow-lg">
            <div
                className="relative cursor-pointer rounded-xl border-2 border-dashed border-white/10 bg-[#1C1C1C] p-6 text-center transition-all duration-300"
                onClick={onOpenChoice}
            >


                {/* Upload Placeholder */}
                {!image && (
                    <div className="flex flex-col items-center">
                        <div className="mb-4 text-[3rem] text-[#4361ee]">
                            <FaCloudUploadAlt />
                        </div>

                        <div className="mb-4 text-gray-300">"Click to upload the image"</div>
                    </div>
                )}

                {/* Uploaded Image */}
                {image && (
                    <div className="relative w-full">
                        <img
                            src={image}
                            alt="Uploaded"
                            className="mx-auto max-h-96 w-auto rounded-lg border border-white/25 object-contain shadow-md transition-all duration-300"
                        />

                        <button
                            type="button"
                            onClick={(e) => {
                                e.stopPropagation();
                                removeImage();
                            }}
                            className="absolute right-2 top-2 inline-flex h-8 w-8 items-center justify-center rounded-full bg-black/70 text-white transition hover:bg-black/85 focus:outline-none focus:ring-2 focus:ring-white/70"
                        >
                            <IoClose className="h-4 w-4" />
                        </button>

                        <p className="mt-2 text-center text-gray-300">
                            Image uploaded successfully. Click to change.
                        </p>
                    </div>
                )}

                {/* Buttons */}
                <div className="mt-4 flex gap-3">
                    <button
                        type="button"
                        onClick={(e) => {
                            e.stopPropagation();
                            onUpload();
                        }}
                        className="flex-1 rounded-lg border border-white/10 bg-[rgba(30,30,30,0.9)] p-3 text-gray-300 transition-all duration-300 hover:border-[#4361ee] hover:bg-[rgba(67,97,238,0.2)]"
                    >
                        <FaUpload className="mr-2 inline" />
                        Upload
                    </button>

                    <button
                        type="button"
                        onClick={(e) => {
                            e.stopPropagation();
                            onCapture();
                        }}
                        className="flex-1 rounded-lg border border-white/10 bg-[rgba(30,30,30,0.9)] p-3 text-gray-300 transition-all duration-300 hover:border-[#4361ee] hover:bg-[rgba(67,97,238,0.2)]"
                    >
                        <FaCamera className="mr-2 inline" />
                        Capture
                    </button>
                </div>
            </div>
        </div>
    );
};

export default UploadContainer;