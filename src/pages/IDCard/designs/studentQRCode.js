import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { QRCodeSVG } from "qrcode.react";

export function createStudentQRCode(qrValue, width = "21mm", height = "26mm") {
    const value = qrValue === null || qrValue === undefined
        ? ""
        : String(qrValue).trim();

    if (!value) return "";

    return renderToStaticMarkup(createElement(QRCodeSVG, {
        value,
        size: 512,
        level: "M",
        includeMargin: true,
        bgColor: "#ffffff",
        fgColor: "#17324d",
        style: { display: "block", width, height },
        title: "ID card QR code",
    }));
}
