import React, { useState } from 'react';
import { Printer, Loader2 } from 'lucide-react';
import { apiGet } from '../../../api/api';

function Header() {
  const [seatChitBTNLoading, setSeatChitBTNLoading] = useState(false);


  async function printSeatChits() {
    // 1. Open window immediately on click to bypass popup blockers
    const printWindow = window.open("", "_blank");

    if (!printWindow) {
      alert("Popup blocker prevented opening the print window. Please allow popups for this site.");
      return;
    }

    // Show loading state inside the print window
    printWindow.document.write(`
      <html>
        <head>
          <title>Preparing Seat Chits...</title>
          <style>
            body { font-family: system-ui, -apple-system, sans-serif; display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100vh; margin: 0; background: #f8fafc; color: #334155; }
            .spinner { width: 40px; height: 40px; border: 4px solid #cbd5e1; border-top-color: #2563eb; border-radius: 50%; animation: spin 0.8s linear infinite; margin-bottom: 16px; }
            @keyframes spin { to { transform: rotate(360deg); } }
          </style>
        </head>
        <body>
          <div class="spinner"></div>
          <h2>Generating Exam Seat Chits...</h2>
          <p>Please wait while we compile student records.</p>
        </body>
      </html>
    `);
    printWindow.document.close();

    setSeatChitBTNLoading(true);

    try {
      const response = await apiGet("/api/seat_chits");

      // Parse the JSON data from the fetch Response object
      const data = await response.json();

      if (!data?.html) {
        throw new Error("Failed to fetch seat chits HTML from server.");
      }

      // Inject the rendered HTML template string returned from Flask
      printWindow.document.open();
      printWindow.document.write(data.html);
      printWindow.document.close();

      // Trigger print once assets load
      printWindow.onload = () => {
        printWindow.focus();
        printWindow.print();
      };

    } catch (err) {
      console.error(err);
      printWindow.close(); // Close loading window on error
      showAlert(400, err.message || "An error occurred while printing.");
    } finally {
      setSeatChitBTNLoading(false);
    }
  }

  return (
    <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <div>
        <h1 className="text-3xl font-bold text-white">Admit Card Generator</h1>
        <p className="mt-2 text-gray-400">Generate and preview admit cards for your students</p>
      </div>

      <div className="flex items-center">
        <button
          onClick={printSeatChits}
          disabled={seatChitBTNLoading}
          className="group relative inline-flex items-center justify-center gap-2.5 rounded-xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-500/20 transition-all duration-300 hover:bg-indigo-500 hover:shadow-indigo-500/30 hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-75 disabled:cursor-not-allowed disabled:transform-none border border-indigo-500/30 overflow-hidden"
        >
          {/* Subtle sheen highlight animation on hover */}
          <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full duration-1000 bg-gradient-to-r from-transparent via-white/15 to-transparent transition-transform pointer-events-none"></div>

          {seatChitBTNLoading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin text-indigo-200" />
              <span>Printing...</span>
            </>
          ) : (
            <>
              <Printer className="h-4 w-4 transition-transform duration-300 group-hover:scale-110 text-indigo-200 group-hover:text-white" />
              <span>Print Seat Chits</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}

export default Header;