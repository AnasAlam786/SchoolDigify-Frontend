const SHOW_SERIAL_NO = true; // set to false to remove the "#" column

// [key, label, width %, optional formatter, nowrap?] - widths add up to 100
const columns = [
    ["STUDENTS_NAME", "STUDENT NAME", 11],
    ["CLASS", "CLASS", 4.5, null, true],
    ["ROLL", "ROLL", 3.5, null, true],
    ["DOB", "DOB", 7.5, null, true],
    ["AADHAAR", "AADHAAR", 11, formatAadhaar, true],
    ["FATHERS_NAME", "FATHER'S NAME", 10],
    ["MOTHERS_NAME", "MOTHER'S NAME", 10],
    ["PHONE", "PHONE", 8.5, null, true],
    ["ADMISSION_DATE", "ADMISSION DATE", 7.5, null, true],
    ["SR", "SR", 4, null, true],
    ["ADDRESS", "ADDRESS", 14.5],
    ["ADMISSION_CLASS", "ADMISSION CLASS", 5],
];

function escapeHtml(value) {
    return String(value ?? "").replace(/[&<>"']/g, (character) => ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;",
    })[character]);
}

// 123456789012 -> 1234 5678 9012 (leaves other values unchanged)
function formatAadhaar(value) {
    const digits = String(value ?? "").replace(/[\s-]/g, "");
    return /^\d{12}$/.test(digits)
        ? digits.replace(/(\d{4})(?=\d)/g, "$1 ")
        : String(value ?? "");
}

export function createStudentRegisterHtml(students) {
    const classes = new Map();
    students.forEach((student) => {
        const classKey = student.class_id ?? student.CLASS;
        if (!classes.has(classKey)) {
            classes.set(classKey, []);
        }
        classes.get(classKey).push(student);
    });

    const totalColumns = columns.length + (SHOW_SERIAL_NO ? 1 : 0);

    const colgroup = `<colgroup>${
        SHOW_SERIAL_NO ? `<col style="width:3%">` : ""
    }${columns.map(([, , width]) => `<col style="width:${width}%">`).join("")}</colgroup>`;

    const groups = Array.from(classes.values());
    const tables = groups.map((classStudents, index) => {
        const className = escapeHtml(classStudents[0].CLASS || "Unassigned class");
        const heading = `
            <thead>
                <tr class="title-row">
                    <th class="class-title" colspan="${totalColumns - 4}">Student Details Register &mdash; Class: ${className}</th>
                    <th class="class-count" colspan="4">Total students: ${classStudents.length}</th>
                </tr>
                <tr class="label-row">
                    ${SHOW_SERIAL_NO ? `<th class="center">#</th>` : ""}
                    ${columns.map(([, label]) => `<th>${label}</th>`).join("")}
                </tr>
            </thead>`;
        const rows = classStudents.map((student, rowIndex) => `
            <tr>
                ${SHOW_SERIAL_NO ? `<td class="center nowrap">${rowIndex + 1}</td>` : ""}
                ${columns.map(([key, , , format, nowrap]) => {
                    const raw = format ? format(student[key]) : student[key];
                    return `<td class="${nowrap ? "nowrap" : ""}">${escapeHtml(raw)}</td>`;
                }).join("")}
            </tr>
        `).join("");
        const lastClass = index === groups.length - 1;

        return `<table class="${lastClass ? "" : "class-section"}">${colgroup}${heading}<tbody>${rows}</tbody></table>`;
    }).join("");

    return `<!doctype html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Student Details Register</title>
    <style>
        @page {
            size: A4 landscape;
            margin: 10mm 8mm 12mm 8mm;
            @bottom-center {
                content: "Page " counter(page) " of " counter(pages);
                font-family: Arial, sans-serif;
                font-size: 8pt;
                color: #555;
            }
        }
        * { box-sizing: border-box; }
        body {
            margin: 0;
            color: #000;
            font-family: Arial, Helvetica, sans-serif;
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
        }
        table {
            width: 100%;
            border-collapse: collapse;
            table-layout: fixed;
        }
        thead { display: table-header-group; }
        tr { break-inside: avoid; page-break-inside: avoid; }

        th, td {
            border: 0.6pt solid #666;
            padding: 5px 5px;
            font-size: 9pt;
            line-height: 1.35;
            text-align: left;
            vertical-align: middle;
            white-space: normal;
            overflow-wrap: anywhere;
        }
        td.nowrap { white-space: nowrap; overflow-wrap: normal; }
        .center { text-align: center; }

        /* Title band */
        .title-row th {
            border: 0;
            border-bottom: 1.5pt solid #000;
            background: #fff;
            padding: 0 0 5px;
            font-size: 12pt;
            letter-spacing: 0.3px;
        }
        .class-count { text-align: right; font-size: 9.5pt; font-weight: 600; }

        /* Column labels */
        .label-row th {
            background: #dfe5ec;
            border-top: 0;
            border-bottom: 1.2pt solid #000;
            font-size: 8pt;
            font-weight: 700;
            text-transform: uppercase;
            letter-spacing: 0.2px;
            padding: 6px 5px;
        }

        /* Body rows */
        tbody td { font-variant-numeric: tabular-nums; }
        tbody tr:nth-child(even) td { background: #f3f5f8; }
        tbody td:first-child { border-left: 0.6pt solid #666; }

        .class-section { break-after: page; page-break-after: always; }

        @media screen {
            body { padding: 12mm; background: #fff; }
            table { margin-bottom: 20px; }
        }
    </style>
</head>
<body>${tables}</body>
</html>`;
}