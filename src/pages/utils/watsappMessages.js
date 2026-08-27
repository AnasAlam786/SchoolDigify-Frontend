export function transactionWhatsappMessage(data) {
    let message = "✅ *Fee Payment Confirmation*\n\n";

    message += `📅 Payment Date: ${data.payment_date}\n`;
    message += `💳 Payment Mode: ${data.payment_mode.charAt(0).toUpperCase() +
        data.payment_mode.slice(1).toLowerCase()
        }\n`;
    message += `💰 Total Paid Amount: ₹${data.paid_amount}\n`;
    message += `🧾 Transaction No.: ${data.transaction_no}\n\n`;
    message += "👨‍👩‍👧‍👦 *Student Details:*\n";

    for (const sibling of data.siblings) {
        message += `\n🔹 Name: ${sibling.studentName}\n`;
        message += `   🏫 Class: ${sibling.className}\n`;
        message += `   🎓 Roll No.: ${sibling.rollNo}\n`;
        message += `   📌 ${sibling.fees.monthly.label}: ${sibling.fees.monthly.months.join(", ")} (₹${sibling.fees.monthly.total})\n`;

        for (const otFee of sibling.fees.oneTime || []) {
            message += `   📌 ${otFee.name}: ₹${otFee.amount}\n`;
        }
    }

    message += "\nThank you for your timely payment!";

    return message;
}


export function feeDemandMessage(data) {
    const student = data[0];

    const today = new Date().toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "long",
        year: "numeric",
    });

    const { name, class: className, rollNo, phone, total_due_amount: totalDue,
        total_due_terms: totalTerms,
    } = student;

    const dueMonths = student.monthlyFees
        .filter((fee) => fee.status === "due")
        .map((fee) => fee.period_name);

    const otherDueFees = student.otherFees.filter(
        (fee) => fee.status === "due"
    );

    let message = `📌 *Fee Due Notice*

        📅 *Date:* ${today}

        Dear Parent/Guardian,

        This is to inform you regarding the *pending school fee* for your ward:

        👦 *Student Name:* ${name}
        🏫 *Class:* ${className}
        🎓 *Roll No:* ${rollNo}
        📞 *Registered Mobile:* ${phone}

        ────────────────────

        💰 *Fee Summary (Academic Session 2025–26)*

        🔴 *Total Due Amount:* ₹${totalDue}/-
        📆 *Total Pending Months / Terms:* ${totalTerms}

        ────────────────────

        📚 *Monthly Tuition Fee (₹300 per month) – Due*
        `;

    for (const month of dueMonths) {
        message += `• ${month}\n`;
    }

    message += `\n🧾 *Other Due Fees*\n`;

    for (const fee of otherDueFees) {
        message += `• ${fee.fee_type} – ${fee.period_name}: ₹${fee.amount} (Due Date: ${fee.dueDate})\n`;
    }

    message += `
        ────────────────────

        ⚠️ *Important Note:*
        Kindly clear the pending dues at the earliest to avoid inconvenience related to examinations, results, or other academic activities.

        For any clarification, please contact the school office.

        🙏 Thank you for your cooperation.

        Warm regards,
        🏫 *School Administration*
        `;

    return message.trim();
}

