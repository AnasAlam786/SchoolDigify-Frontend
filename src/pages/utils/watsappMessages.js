


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

        if (dueMonthlyFees.length > 0) {
            feeDetails += `\n📚 *Tuition Fee*\n${dueMonthlyFees
                .map((fee) => {
                    const period = fee?.period_name || "Fee";
                    const amount = formatAmount(fee?.amount);

                    return `• ${period} — ₹${amount}/-`;
                })
                .join("\n")}`;
        }

        if (dueOtherFees.length > 0) {
            feeDetails += `\n\n🧾 *Other Fee*\n${dueOtherFees
                .map((fee) => {
                    const feeType = fee?.fee_type || "Other Fee";
                    const period = fee?.period_name
                        ? ` (${fee.period_name})`
                        : "";

                    const amount = formatAmount(fee?.amount);

                    return `• ${feeType}${period} — ₹${amount}/-`;
                })
                .join("\n")}`;
        }

        return `*${index + 1}. ${name}*

🏫 Class: ${className}  |  🎓 Roll No.: ${rollNo}

💰 *Pending Fee: ₹${formatAmount(
            student?.total_due_amount
        )}/-*

📆 *Pending: ${student?.total_due_terms || 0} Month/Term*
${feeDetails}`;
    });

    // ---------------------------------------------------------
    // 6. Final WhatsApp message
    // ---------------------------------------------------------

    const message = `🏫 *${schoolName}*
💰 *FEE PAYMENT REMINDER*

📅 ${today}

आपके बच्चे की कुछ *Fee अभी Pending* है।

━━━━━━━━━━━━━━━━━━

${studentSections.join(
        "\n\n━━━━━━━━━━━━━━━━━━\n\n"
    )}

━━━━━━━━━━━━━━━━━━
💰 *Total Pending Fee: ₹${formatAmount(totalOutstanding)}/-*
📆 *Total Pending: ${totalPendingTerms} Month/Term*

━━━━━━━━━━━━━━━━━━

कृपया Pending Fee जल्द जमा कर दें। 🙏

अगर Fee पहले ही जमा कर दी है, तो कृपया *Payment Receipt/Details* School Office में भेज दें।

धन्यवाद।

🏫 *${schoolName}*`;

    return message.trim();
}
