import hangingHTML from "./hangingIDCard/hangingIDCard.html?raw";
import hangingCSS from "./hangingIDCard/hangingIDCard.css?raw";
import "./hangingIDCard/hangingIDCard.js";

import kidsHTML from "./kidsIDCard/kidsIDCard.html?raw";
import kidsCSS from "./kidsIDCard/kidsIDCard.css?raw";
import "./kidsIDCard/kidsIDCard.js";
import signatureFontUrl from "../../../assets/Bastliga One.ttf?url";


export const ID_CARD_DESIGNS = {
    hanging: {
        id: "hanging",
        name: "Hanging ID Card",
        componentTag: "hanging-image-icard",
        description: "Classic hanging format with a premium school identity look.",
        html: hangingHTML,
        css: hangingCSS.replaceAll("__SIGNATURE_FONT_URL__", signatureFontUrl),
    },

    kidsIDCard: {
        id: "kidsIDCard",
        name: "Kids ID Card",
        componentTag: "kids-id-card",
        description: "Classic ID card for kids with a premium school identity look.",
        html: kidsHTML,
        css: kidsCSS.replaceAll("__SIGNATURE_FONT_URL__", signatureFontUrl),
    },
};

export const DESIGN_OPTIONS = Object.values(ID_CARD_DESIGNS);