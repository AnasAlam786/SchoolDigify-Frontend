import cardTemplate from "../designs/hangingIDCard/hangingIDCard.html?raw";
import IDCardCss from "../designs/hangingIDCard/hangingIDCard.css?raw";
import leagueSpartanFont from "../../../assets/LeagueSpartanFont.ttf";

const imageBaseUrl = "https://lh3.googleusercontent.com/d/";

const safeText = (value) => {
    if (value === null || value === undefined) return "";
    return String(value).trim();
};

function applyCardData(cardNode, student, school) {
    const fields = {
        "school-name": school?.name || "School Name",
        "school-UDISE": `UDISE: ${school?.udise || ""}`,
        "session-year": student?.session_year || "2025-26",
        "student-image": student?.image
            ? `${imageBaseUrl}${student.image}=s220`
            : "/static/no-student-boy-image.png",
        "student-name": student?.student_name || "Student Name",
        "student-father": `C/O ${student?.father_name || student?.student_father || "Father Name"}`,
        "student-class-roll": student?.class_roll || "Class - Roll",
        "student-DOB": student?.dob || "DOB",
        "student-phone": student?.phone || "N/A",
        "student-address": student?.address || "N/A",
        "teacher-sign": student?.teacher_sign
            ? `${imageBaseUrl}${student.teacher_sign}=s200`
            : "",
        "principal-sign": school?.principal_sign
            ? `${imageBaseUrl}${school.principal_sign}=s200`
            : "",
        "school-address": school?.address || "School Address",
        "school-phone": school?.phone || "School Phone",
        "school-logo": school?.logo || "",
    };

    Object.entries(fields).forEach(([id, value]) => {
        const element = cardNode.querySelector(`#${id}`);

        if (!element) return;

        if (element.tagName === "IMG") {
            element.src = value || "";
            element.alt = id;
            element.style.display = value ? "block" : "none";
            return;
        }

        element.textContent = safeText(value);
    });

    const teacherSign = cardNode.querySelector("#teacher-sign");
    const principalSign = cardNode.querySelector("#principal-sign");

    if (teacherSign) {
        teacherSign.style.display = teacherSign.getAttribute("src") ? "block" : "none";
    }

    if (principalSign) {
        principalSign.style.display = principalSign.getAttribute("src") ? "block" : "none";
    }
}

function makePrintableCard(student, school) {
    const printDoc = document.implementation.createHTMLDocument("ID Card Print");
    const template = printDoc.createElement("template");
    template.innerHTML = cardTemplate;

    const cardNode = template.content.firstElementChild?.cloneNode(true);
    if (!cardNode) {
        return null;
    }

    applyCardData(cardNode, student, school);
    return cardNode;
}

export function PrintIDCard(studentsData, schoolData) {
    if (!Array.isArray(studentsData) || studentsData.length === 0) {
        alert("No data available for printing.");
        return;
    }

    const printWindow = window.open("", "_blank");

    if (!printWindow) {
        alert("Popup blocked.");
        return;
    }

    const doc = printWindow.document;
    doc.open();
    doc.write(`<!DOCTYPE html><html><head><meta charset="UTF-8" /><title>ID Cards</title>

        <style>
        ${IDCardCss}

                /* ---------- PRINT LAYOUT ONLY ---------- */
                            @font-face {
                font-family: "League Spartan";
                src: url("${leagueSpartanFont}") format("truetype");
                font-weight: 400;
                font-style: normal;
                font-display: block;
            }
                
                .print-page {
                    display: grid; 

                    width: calc(210mm - 10mm);
                    height: calc(297mm - 10mm);
                    margin: 5mm;

                    grid-template-columns: repeat(3, max-content); 
                    grid-template-rows: repeat(3, max-content);

                    column-gap: 5mm; row-gap: 5mm; 
                    

                    justify-content:center;   /* horizontal center */
                    align-content:start;      /* top */

                    box-sizing: border-box; 
                    page-break-after: always;
                }
                .print-page:last-child { page-break-after: auto; }
                .print-card {
                    display: block;

                    width: fit-content;
                    height: fit-content;

                    break-inside: avoid;
                    page-break-inside: avoid;
                }
                @media print {
                    body { margin:0; padding:0; }
                    .print-card { position:relative; }
                }
                @page { size: A4; margin: 0mm;}
            </style>


            </head><body></body></html>`);

    const waitPrintScript = (`
            <script>
            (function() {
                function waitForImagesAndFonts() {
                    const imgs = Array.from(document.images);
                    const imgPromises = imgs.map(img => img.complete ? Promise.resolve() : new Promise(r => { img.addEventListener('load', r); img.addEventListener('error', r); }));
                    const fontsReady = (document.fonts && document.fonts.ready) ? document.fonts.ready : Promise.resolve();
                    return Promise.all([...imgPromises, fontsReady]);
                }

                function kickPrint() {
                    setTimeout(() => { try { window.focus(); window.print(); } catch(e) { console.error(e); } }, 200);
                }

                if (document.readyState === 'complete') {
                    waitForImagesAndFonts().then(kickPrint);
                } else {
                    window.addEventListener('load', () => waitForImagesAndFonts().then(kickPrint));
                }
            })();
            <\/script>
            `);


    doc.close();

    const page = doc.createElement("div");
    page.className = "print-page";

    studentsData.forEach((student) => {
        const card = makePrintableCard(student, schoolData);
        if (!card) return;

        const cardWrap = doc.createElement("div");
        cardWrap.className = "print-card";
        cardWrap.appendChild(card);
        page.appendChild(cardWrap);
    });

    doc.body.appendChild(page);

    const images = Array.from(doc.images);
    const fontReady = doc.fonts && doc.fonts.ready ? doc.fonts.ready : Promise.resolve();
    const imageLoads = images.map((img) =>
        img.complete
            ? Promise.resolve()
            : new Promise((resolve) => {
                img.addEventListener("load", resolve, { once: true });
                img.addEventListener("error", resolve, { once: true });
            })
    );

    Promise.all([...imageLoads, fontReady]).finally(() => {
        setTimeout(() => {
            try {
                printWindow.focus();
                printWindow.print();
            } catch (error) {
                console.error("Print failed:", error);
            }
        }, 300);
    });
}