import { useState, useRef } from "react";
import { createPortal } from "react-dom";

import CropModal from "./components/CropModal"
import ChoiceModal from "./components/ChoiceModal";
import UploadContainer from "./components/UploaderContainer"

import "./style/ImageUploader.css"

export default function ImageUploader({
    image = "", setImage
}) {

    const [cropSrc, setCropSrc] = useState(null);

    const [showChoice, setShowChoice] = useState(false);
    const [showCropper, setShowCropper] = useState(false);


    const fileInputRef = useRef(null);

    const openFilePicker = (camera = false) => {
        if (camera) {
            fileInputRef.current.setAttribute("capture", "environment");
        } else {
            fileInputRef.current.removeAttribute("capture");
        }

        fileInputRef.current.click();
        setShowChoice(false);
    };

    const handleFileChange = (e) => {
        const file = e.target.files?.[0];

        if (!file) return;

        const reader = new FileReader();

        reader.onload = () => {
            setCropSrc(reader.result);
            setShowCropper(true);
        };

        reader.readAsDataURL(file);
    };


    return (
        <>

            <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleFileChange}
            />
            <UploadContainer
                image={image}
                setImage={setImage}
                onOpenChoice={() => setShowChoice(true)}
                onUpload={() => openFilePicker(false)}
                onCapture={() => openFilePicker(true)}
            />


            {showChoice && (
                <ChoiceModal
                    onClose={() => setShowChoice(false)}
                    onUpload={() => openFilePicker(false)}
                    onCamera={() => openFilePicker(true)}
                />
            )}

            {showCropper && (
                <CropModal
                    cropSrc={cropSrc}
                    setImage={setImage}
                    setShowCropper={setShowCropper}
                />
            )}
        </>
    );
}