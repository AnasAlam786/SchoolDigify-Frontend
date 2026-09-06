export function transactionWhatsappMessage(data) {
    const paymentModeMap = {
        cash: "Cash",
        upi: "UPI",
        online: "Online",
        card: "Card",
        cheque: "Cheque",
        bank: "Bank Transfer",
    };

    const paymentMode =
        paymentModeMap[String(data.payment_mode || "").toLowerCase()] ||
        data.payment_mode ||
        "—";

    let message = "✅ *Fee Payment Confirmation*\n\n";

    message += `📅 Payment Date: ${data.payment_date}\n`;
    message += `💳 Payment Mode: ${paymentMode}\n`;
    message += `🧾 Transaction No.: ${data.transaction_no}\n\n`;

    // Main payment information
    message += `💰 *AMOUNT PAID: *\n`;
    message += `_*₹${data.paid_amount} की फीस का भुगतान सफलतापूर्वक प्राप्त हो गया है।*_\n\n`;
    message += "👨‍👩‍👧‍👦 *Student Details*\n";

    for (const [index, sibling] of data.siblings.entries()) {
        message += `\n━━━━━━━━━━━━━━━━━━\n`;
        message += `*${index + 1}. ${sibling.studentName}*\n\n`;

        message += `🏫 Class: *${sibling.className}*\n`;
        message += `🎓 Roll No.: *${sibling.rollNo}*\n`;

        // Monthly Fee
        if (sibling.fees?.monthly) {
            const monthly = sibling.fees.monthly;

            message += `\n📚 *${monthly.label}*\n`;
            message += `• Months: _${monthly.months.join(", ")}_\n`;
            message += `• Amount Paid: *₹${monthly.total}*\n`;
        }

        // One-time Fees
        for (const otFee of sibling.fees?.oneTime || []) {
            message += `\n🧾 *${otFee.name}*\n`;
            message += `• Amount Paid: *₹${otFee.amount}*\n`;
        }
    }

    message += "\n━━━━━━━━━━━━━━━━━━\n";
    message += `💰 *Total Amount Paid: ₹${data.paid_amount}*\n\n`;
    message += "🙏 *Thank you for your payment.*\n";
    message += "आपके सहयोग के लिए धन्यवाद।";

    return message.trim();
}


export function feeDemandMessage(
    data,
    schoolName = "School Administration"
) {
    // ---------------------------------------------------------
    // 1. Validate input
    // ---------------------------------------------------------

    if (!Array.isArray(data) || data.length === 0) {
        return null;
    }

    const isDue = (fee) =>
        String(fee?.status || "").toUpperCase() === "DUE";

    const formatAmount = (value) =>
        Number(value || 0).toLocaleString("en-IN");

    // ---------------------------------------------------------
    // 2. Students with pending fees
    // ---------------------------------------------------------

    const studentsWithDue = data.filter(
        (student) => Number(student?.total_due_amount || 0) > 0
    );

    if (studentsWithDue.length === 0) {
        return null;
    }

    // ---------------------------------------------------------
    // 3. Date
    // ---------------------------------------------------------

    const today = new Date().toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "long",
        year: "numeric",
    });

    // ---------------------------------------------------------
    // 4. Family totals
    // ---------------------------------------------------------

    const totalOutstanding = studentsWithDue.reduce(
        (sum, student) =>
            sum + Number(student?.total_due_amount || 0),
        0
    );

    const totalPendingTerms = studentsWithDue.reduce(
        (sum, student) =>
            sum + Number(student?.total_due_terms || 0),
        0
    );

    // ---------------------------------------------------------
    // 5. Student sections
    // ---------------------------------------------------------

    const studentSections = studentsWithDue.map((student, index) => {
        const name = student?.name || "Student";
        const className = student?.class || "—";
        const rollNo = student?.rollNo || "—";

        const monthlyFees = Array.isArray(student?.monthlyFees)
            ? student.monthlyFees
            : [];

        const otherFees = Array.isArray(student?.otherFees)
            ? student.otherFees
            : [];

        const dueMonthlyFees = monthlyFees.filter(isDue);
        const dueOtherFees = otherFees.filter(isDue);

        let feeDetails = "";

        // Tuition Fee
        if (dueMonthlyFees.length > 0) {
            feeDetails += `
📚 *Tuition Fee*
_${student?.total_due_terms || 0} Month(s) Pending_

${dueMonthlyFees
    .map((fee) => {
        const period = fee?.period_name || "Fee";
        const amount = formatAmount(fee?.amount);

        return `• ${period}  →  ₹${amount}`;
    })
    .join("\n")}
`;
        }

        // Other Fees
        if (dueOtherFees.length > 0) {
            feeDetails += `
🧾 *Other Fee*

${dueOtherFees
    .map((fee) => {
        const feeType = fee?.fee_type || "Other Fee";

        const period = fee?.period_name
            ? ` (${fee.period_name})`
            : "";

        const amount = formatAmount(fee?.amount);

        return `• ${feeType}${period}  →  ₹${amount}`;
    })
    .join("\n")}
`;
        }

        return `*${index + 1}. ${name}*

🏫 Class: *${className}*
🎫 Roll No: *${rollNo}*
${feeDetails}
💰 *Pending Fee: ₹${formatAmount(
    student?.total_due_amount
)}*`;
    });

    // ---------------------------------------------------------
    // 6. Final WhatsApp message
    // ---------------------------------------------------------

    const message = `🏫 *${schoolName}*

💰 *FEE REMINDER*
📌 ${today}

Dear Parent,

कृपया ध्यान दें, आपके बच्चे की फीस अभी बकाया है।

━━━━━━━━━━━━━━━━━━

${studentSections.join(
    "\n\n━━━━━━━━━━━━━━━━━━\n\n"
)}

━━━━━━━━━━━━━━━━━━

📊 *FAMILY FEE SUMMARY*

👨‍👩‍👧‍👦 Students: *${studentsWithDue.length}*
📌 Pending Months: *${totalPendingTerms}*
💰 *TOTAL PENDING: ₹${formatAmount(totalOutstanding)}*

━━━━━━━━━━━━━━━━━━

⚠️ आपसे अनुरोध है कि कृपया अपने बच्चे की बाकी फीस जल्द से जल्द जमा करने का कष्ट करें।

🙏 आपके सहयोग के लिए धन्यवाद।`;

    return message.trim();
}