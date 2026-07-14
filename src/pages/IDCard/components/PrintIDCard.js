import cardTemplate from "../designs/hangingIDCard/hangingIDCard.html?raw";
import cardStyles from "../designs/hangingIDCard/hangingIDCard.css?inline";

export function PrintIDCard(data) {
    if (!Array.isArray(data) || data.length === 0) {
        alert("No data available for printing.");
        return;
    }

    // Function to replace data-bind attributes with actual values
    const applyStudentData = (template, student) => {
        let html = template;
        // Replace data-bind attributes with textContent
        html = html.replace(/data-bind="([^"]+)"/g, (match, key) => {
            return `data-value="${student[key] || ''}"`;
        });

        // Now replace the text content
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, 'text/html');
        doc.querySelectorAll('[data-value]').forEach(el => {
            const key = el.getAttribute('data-value');
            if (el.tagName === 'IMG') {
                el.src = key;
            } else if (el.tagName === 'TEXTPATH') {
                el.textContent = key;
            } else {
                el.textContent = `${el.textContent}${key}`;
            }
            el.removeAttribute('data-value');
        });

        return doc.body.innerHTML;
    };

    // Create card HTML for each student
    const createCardHtml = (student) => {
        const cardHtml = applyStudentData(cardTemplate, student);
        return `<div class="print-card">${cardHtml}</div>`;
    };

    const cardsHtml = data.map(student => createCardHtml(student)).join("");

    const printLayoutCss = `

    @font-face { 
        font-family: 'League Spartan'; 
        src: url('/static/LeagueSpartan-Regular.ttf') format('truetype'); 
    }
    /* ---------- PRINT LAYOUT ONLY ---------- */
    .print-page {
        width: 210mm; height: 297mm;
        display: grid; grid-template-columns: repeat(3, max-content); grid-template-rows: repeat(3, max-content);
        column-gap: 3mm; row-gap: 3mm; justify-content: center; align-content: center;
        box-sizing: border-box; page-break-after: always;
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
    @page { size: A4; margin: 0mm; }
    `;

    const html = `
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="UTF-8">
            <title>Print ID Cards</title>
            <style>
                ${cardStyles}
                ${printLayoutCss}
            </style>
        </head>
        <body>
            <div class="print-page">
                ${cardsHtml}
            </div>

            <script>
                window.onload = () => {
                    (function() {
                        function waitForImagesAndFonts() {
                            const imgs = Array.from(document.images);
                            const imgPromises = imgs.map(img => 
                                img.complete ? Promise.resolve() : new Promise(r => { 
                                    img.addEventListener('load', r); 
                                    img.addEventListener('error', r); 
                                }));
                            const fontsReady = (document.fonts && document.fonts.ready) 
                                ? document.fonts.ready 
                                : Promise.resolve();
                            return Promise.all([...imgPromises, fontsReady]);
                        }

                        function kickPrint() {
                            setTimeout(() => { 
                                try { 
                                    window.focus(); 
                                    window.print(); 
                                } catch(e) { 
                                    console.error(e); 
                                } 
                            }, 500);
                        }

                        if (document.readyState === 'complete') {
                            waitForImagesAndFonts().then(kickPrint);
                        } else {
                            window.addEventListener('load', () => waitForImagesAndFonts().then(kickPrint));
                        }
                    })();
                };
            </script>
        </body>
        </html>
    `;

    const printWindow = window.open("", "_blank");

    if (!printWindow) {
        alert("Popup blocked.");
        return;
    }

    printWindow.document.open();
    printWindow.document.write(html);
    printWindow.document.close();
}