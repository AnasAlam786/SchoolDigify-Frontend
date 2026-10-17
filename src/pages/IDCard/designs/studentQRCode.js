import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { QRCodeSVG } from "qrcode.react";

export function createStudentQRCode(qrValue) {
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
        style: { display: "block", width: "21mm", height: "26mm" },
        title: "ID card QR code",
    }));
}
