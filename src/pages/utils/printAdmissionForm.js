import { apiGet } from "../../api/api";

export async function printAdmissionForm(studentId) {

    if(!studentId){ showAlert(400, "Student not found!")}
    try {
        const response = await apiGet(
            `/create_admission_form_api?student_id=${encodeURIComponent(studentId)}`
        );

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message);
        }

        const printWindow = window.open("", "_blank");

        if (!printWindow) {
            throw new Error("Popup blocked. Please allow popups for this site.");
        }

        printWindow.document.open();
        printWindow.document.write(data.html);
        printWindow.document.close();

        printWindow.onload = () => {
            printWindow.focus();
            printWindow.print();
        };
    } catch (err) {
        console.error(err);
        showAlert?.("error", err.message);
    }
}