import { useContext } from "react";
import { AuthContext } from "../../../../auth/authProvider";

export function usePrintableTransaction() {
  const { sessionData } = useContext(AuthContext);
  

  const printTransaction = (transaction) => {
    const schoolName = sessionData?.school_name || "School Name";

    const students = transaction.siblings
      .map(
        (student) => `
          <div class="student">
            <div class="student-header">
              <div>
                <div class="student-name">${student.studentName}</div>
                <div class="muted">${student.className} • Roll No. ${student.rollNo}</div>
              </div>
            </div>

            <table>
              <thead>
                <tr>
                  <th>Fee</th>
                  <th>Period</th>
                  <th class="amount">Amount</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>${student.fees.monthly.label}</td>
                  <td>${student.fees.monthly.months.join(", ")}</td>
                  <td class="amount">₹${student.fees.monthly.total}</td>
                </tr>

                ${student.fees.oneTime
                  .map(
                    (fee) => `
                      <tr>
                        <td>${fee.name}</td>
                        <td>One Time</td>
                        <td class="amount">₹${fee.amount}</td>
                      </tr>
                    `
                  )
                  .join("")}
              </tbody>
            </table>
          </div>
        `
      )
      .join("");

    const totalFees = transaction.siblings.reduce((total, student) => {
      const monthly = student.fees.monthly?.total || 0;

      const oneTime = (student.fees.oneTime || []).reduce(
        (sum, fee) => sum + (fee.amount || 0),
        0
      );

      return total + monthly + oneTime;
    }, 0);



    const printWindowHTML = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Fee Receipt - ${transaction.transaction_no}</title>

        <style>
          @page {
            size: A4;
            margin: 15mm;
          }

          * {
            box-sizing: border-box;
          }

          body {
            margin: 0;
            background: #fff;
            color: #172033;
            font-family: Arial, Helvetica, sans-serif;
            font-size: 13px;
          }

          .receipt {
            width: 100%;
            max-width: 780px;
            margin: auto;
          }

          .header {
            text-align: center;
            padding-bottom: 18px;
            border-bottom: 2px solid #172033;
          }

          .school-name {
            font-size: 25px;
            font-weight: 800;
            letter-spacing: .3px;
            margin-bottom: 5px;
          }

          .receipt-title {
            font-size: 14px;
            font-weight: 700;
            text-transform: uppercase;
            letter-spacing: 2px;
            color: #64748b;
          }

          .meta {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 10px 30px;
            margin: 20px 0;
            padding: 14px 16px;
            background: #f8fafc;
            border: 1px solid #e2e8f0;
            border-radius: 8px;
          }

          .meta-item {
            display: flex;
            justify-content: space-between;
            gap: 15px;
          }

          .label {
            color: #64748b;
          }

          .value {
            font-weight: 700;
          }

          .student {
            margin-top: 18px;
            page-break-inside: avoid;
          }

          .student-header {
            padding: 11px 14px;
            background: #f1f5f9;
            border: 1px solid #e2e8f0;
            border-bottom: 0;
            border-radius: 8px 8px 0 0;
          }

          .student-name {
            font-size: 15px;
            font-weight: 700;
          }

          .muted {
            margin-top: 3px;
            color: #64748b;
            font-size: 12px;
          }

          table {
            width: 100%;
            border-collapse: collapse;
          }

          th,
          td {
            padding: 9px 10px;
            border: 1px solid #e2e8f0;
            text-align: left;
          }

          th {
            background: #f8fafc;
            font-size: 11px;
            text-transform: uppercase;
            color: #64748b;
          }

          .amount {
            text-align: right;
            white-space: nowrap;
          }

          .summary {
            margin-top: 25px;
            margin-left: auto;
            width: 300px;
          }

          .summary-row {
            display: flex;
            justify-content: space-between;
            padding: 7px 0;
          }

          .discount {
            color: #059669;
          }

          .total {
            margin-top: 5px;
            padding: 12px 0;
            border-top: 2px solid #172033;
            font-size: 17px;
            font-weight: 800;
          }

          .transaction {
            margin-top: 25px;
            padding: 12px 14px;
            border: 1px dashed #94a3b8;
            border-radius: 7px;
          }

          .footer {
            margin-top: 35px;
            padding-top: 12px;
            border-top: 1px solid #e2e8f0;
            display: flex;
            justify-content: space-between;
            color: #64748b;
            font-size: 11px;
          }

          @media print {
            body {
              print-color-adjust: exact;
              -webkit-print-color-adjust: exact;
            }
          }
        </style>
      </head>

      <body>
        <div class="receipt">

          <div class="header">
            <div class="school-name">${schoolName}</div>
            <div class="receipt-title">Fee Payment Receipt</div>
          </div>

          <div class="meta">
            <div class="meta-item">
              <span class="label">Receipt No.</span>
              <span class="value">${transaction.transaction_no}</span>
            </div>

            <div class="meta-item">
              <span class="label">Payment Date</span>
              <span class="value">${transaction.payment_date}</span>
            </div>

            <div class="meta-item">
              <span class="label">Payment Mode</span>
              <span class="value">${transaction.payment_mode
                .charAt(0)
                .toUpperCase()}${transaction.payment_mode.slice(1)}</span>
            </div>

            <div class="meta-item">
              <span class="label">Mobile</span>
              <span class="value">${transaction.phone}</span>
            </div>
          </div>

          ${students}

          <div class="summary">
            <div class="summary-row">
              <span>Total Fees</span>
              <strong>₹${totalFees}</strong>
            </div>

            <div class="summary-row discount">
              <span>Discount</span>
              <strong>- ₹${transaction.discount || 0}</strong>
            </div>

            <div class="summary-row total">
              <span>Amount Paid</span>
              <span>₹${((totalFees ?? 0) - (transaction.discount ?? 0))}</span>
            </div>
          </div>

          ${
            transaction.remark
              ? `
                <div class="transaction">
                  <strong>Remark:</strong> ${transaction.remark}
                </div>
              `
              : ""
          }

          <div class="footer">
            <span>Thank you for your payment.</span>
            <span>Computer Generated Receipt</span>
          </div>

        </div>
      </body>
      </html>
    `;

    return printWindowHTML;

  };

  return printTransaction;
  
}