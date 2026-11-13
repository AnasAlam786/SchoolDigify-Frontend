export const REPORT_STYLES = `
.attendance-report-page{margin:0 auto 1.5rem;max-width:1280px;overflow:hidden;border:1px solid rgba(255,255,255,.12);border-radius:8px;background:#fff;color:#17211d;box-shadow:0 12px 32px rgba(0,0,0,.2)}
.report-heading{display:flex;flex-direction:row;align-items:flex-start;justify-content:space-between;gap:1rem;padding:1.4rem 1.5rem 1rem;border-bottom:2px solid #19734e}
.report-heading>div:first-child{min-width:0;flex:1 1 auto}
.report-kicker{margin:0 0 .3rem;color:#19734e;font-size:.68rem;font-weight:700;text-transform:uppercase}
.report-heading h3{margin:0;color:#17211d!important;font-size:1.45rem;font-weight:700}
.report-period{margin:.3rem 0 0;color:#66736d;font-size:.8rem}
.report-class-summary{display:flex;flex:0 0 auto;flex-wrap:nowrap;justify-content:flex-end;gap:.4rem 1rem;color:#59665f;font-size:.75rem}
.report-class-summary span{white-space:nowrap}
.report-class-summary strong{color:#17211d}
.report-table-wrap{overflow-x:auto;padding:.75rem 1rem 1rem}
.report-table{width:100%;min-width:1200px;table-layout:fixed;border-collapse:collapse;font-size:.82rem;text-align:center}
.report-table th,.report-table td{border:1px solid #dce3df;padding:.45rem .35rem;white-space:nowrap}
.report-table th{background:#edf4f0;color:#294438;font-weight:700;white-space:normal;overflow-wrap:anywhere;line-height:1.2}
.report-table th:nth-child(2),.report-table td:nth-child(2),.report-table th:nth-child(3),.report-table td:nth-child(3){text-align:left;white-space:normal;overflow-wrap:anywhere}
.report-table tbody tr:nth-child(even){background:#f8faf9}
.report-student-name{display:block;font-weight:600}
.report-empty{padding:2.5rem 1rem;color:#66736d;text-align:center}
.report-footer{display:flex;justify-content:space-between;border-top:1px solid #e1e7e3;padding:.55rem 1.5rem;color:#78847e;font-size:.65rem}
@media(max-width:640px){.report-heading{align-items:flex-start;flex-direction:column;padding:1rem}.report-class-summary{justify-content:flex-start}.report-table-wrap{padding:.5rem}}
@page{size:A4 landscape;margin:8mm}
@media print{body{margin:0}.attendance-report-print{padding:0!important}.attendance-report-page{width:100%;max-width:none;margin:0;overflow:visible;border:0;border-radius:0;box-shadow:none;break-after:page;page-break-after:always}.attendance-report-page:last-child{break-after:auto;page-break-after:auto}.report-heading{display:flex!important;flex-direction:row!important;align-items:flex-start!important;justify-content:space-between!important;padding:0 0 5mm}.report-class-summary{display:flex!important;flex:0 0 auto!important;flex-direction:row!important;flex-wrap:nowrap!important;white-space:nowrap}.report-table-wrap{overflow:visible;padding:3mm 0}.report-table{min-width:0;font-size:10pt}.report-table th,.report-table td{padding:2mm 1.2mm;white-space:normal;overflow-wrap:anywhere;line-height:1.25}.report-table th:first-child,.report-table td:first-child{white-space:nowrap}.report-table tr{break-inside:avoid;page-break-inside:avoid}.report-footer{padding:2mm 0}}
`

export function getLocalToday() {
    const date = new Date()
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
}

export function formatReportDate(value) {
    const [year, month, day] = value.split('-')
    return `${day}/${month}/${year}`
}