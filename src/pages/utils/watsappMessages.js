


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
    data, schoolName = "School Administration"
) {
    // ---------------------------------------------------------
    // 1. Validate input
    // ---------------------------------------------------------

    if (!Array.isArray(data) || data.length === 0) {
        return null;
    }

    // Safely determine whether a fee is due.
    const isDue = (fee) =>
        String(fee?.status || "").toUpperCase() === "DUE";

    // Safely format INR amounts.
    const formatAmount = (value) =>
        Number(value || 0).toLocaleString("en-IN");

    // ---------------------------------------------------------
    // 2. Keep only students who actually have outstanding dues
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
    // 5. Generate each student's section
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

        // -------------------------
        // Monthly tuition dues
        // -------------------------

        const dueMonthlyFees = monthlyFees.filter(isDue);

        let monthlySection = "";

        if (dueMonthlyFees.length > 0) {
            monthlySection = `
📚 *Tuition Fee Due*
${dueMonthlyFees
                    .map((fee) => {
                        const period = fee?.period_name || "Fee Period";
                        const amount = formatAmount(fee?.amount);

                        return `• ${period} — ₹${amount}/-`;
                    })
                    .join("\n")}`;
        }

        // -------------------------
        // Other fee dues
        // -------------------------

        const dueOtherFees = otherFees.filter(isDue);

        let otherFeesSection = "";

        if (dueOtherFees.length > 0) {
            otherFeesSection = `
🧾 *Other Fees Due*
${dueOtherFees
                    .map((fee) => {
                        const feeType = fee?.fee_type || "Other Fee";
                        const period = fee?.period_name
                            ? ` — ${fee.period_name}`
                            : "";

                        const amount = formatAmount(fee?.amount);

                        const dueDate = fee?.dueDate
                            ? `\n  Due Date: ${fee.dueDate}`
                            : "";

                        return `• ${feeType}${period} — ₹${amount}/-${dueDate}`;
                    })
                    .join("\n")}`;
        }

        // -------------------------
        // Student block
        // -------------------------

        return `*${index + 1}. ${name}*

🏫 Class: ${className}
🎓 Roll No.: ${rollNo}

💰 *Outstanding: ₹${formatAmount(
            student?.total_due_amount
        )}/-*

📆 Pending Months / Terms: ${student?.total_due_terms || 0
            }
${monthlySection}
${otherFeesSection}`;
    });

    // ---------------------------------------------------------
    // 6. Build final WhatsApp message
    // ---------------------------------------------------------

    const message = `🏫 *FEE DUE REMINDER*

📅 *Date:* ${today}

Dear Parent/Guardian,

Greetings from the *${schoolName}*.

This is a courteous reminder regarding the outstanding school fee dues for your ward${studentsWithDue.length > 1 ? "s" : ""}.

━━━━━━━━━━━━━━━━━━━━

${studentSections.join(
        "\n\n━━━━━━━━━━━━━━━━━━━━\n\n"
    )}

━━━━━━━━━━━━━━━━━━━━
💰 *TOTAL OUTSTANDING*
*₹${formatAmount(totalOutstanding)}/-*

📆 *TOTAL PENDING MONTHS / TERMS*
*${totalPendingTerms}*

━━━━━━━━━━━━━━━━━━━━

⚠️ *Important*

Kindly clear the outstanding dues at your earliest convenience so that the fee account remains up to date.

If you have already made the payment, please disregard this reminder and share the payment receipt/details with the school office for verification.

For any fee-related assistance, please contact the school office.

Thank you for your cooperation.

Warm regards,  
🏫 *${schoolName}*`;

    return message.trim();
}
