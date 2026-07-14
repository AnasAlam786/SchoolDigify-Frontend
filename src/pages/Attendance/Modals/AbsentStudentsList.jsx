import React, { useState, useEffect, useRef } from 'react';
import { apiGet } from '../../../api/api';


function AbsentStudentsList({ classID, date, onClose }) {
  // ---------- state ----------
  const [loading, setLoading] = useState(false);
  const [currentData, setCurrentData] = useState(null); // { absent_students, unmarked_students, class_name, date, total_students }
  const [textContent, setTextContent] = useState('');
  const [currentFormat, setCurrentFormat] = useState('table'); // 'table' | 'list' | 'compact'

  // ref for textarea (not strictly needed, but for potential future use)
  const textareaRef = useRef(null);

  // ---------- helper functions (formatting) ----------
  const formatTable = (students, className, date) => {
    let formatted = `📋 Students Attendance List\n\n`;
    formatted += `🏫 Class: ${className}\n`;
    formatted += `📅 Date: ${date}\n`;
    formatted += `┌────────┬─────────────────┐\n`;
    formatted += `│  Roll  │  Student Name   │\n`;
    formatted += `├────────┼─────────────────┤\n`;
    students.forEach((student) => {
      const rollContent = student.ROLL?.toString().substring(0, 6).padEnd(6);
      const nameContent = (student.STUDENTS_NAME || '').substring(0, 15).padEnd(15);
      formatted += `│ ${rollContent} │ ${nameContent} │\n`;
    });
    formatted += `└────────┴─────────────────┘`;
    return formatted;
  };

  const formatList = (students, className, date) => {
    let formatted = `🏫 Attendance Report for ${className}\n`;
    formatted += `📅 Date: ${date}\n\n`;
    if (!students || students.length === 0) {
      formatted += `✅ All students present\n`;
    } else {
      students.forEach((student) => {
        const label = student._type || '';
        if (label === 'unmarked') {
          formatted += `⏱ [Unmarked] ${student.STUDENTS_NAME} (Roll: ${student.ROLL})\n`;
        } else {
          formatted += `${student.STUDENTS_NAME} (Roll: ${student.ROLL})\n`;
        }
      });
    }
    return formatted;
  };

  const formatCompact = (students, className, date) => {
    let formatted = `📅 ${className} - ${date}\n\n`;
    if (!students || students.length === 0) {
      formatted += `✅ All students present`;
    } else {
      formatted += students
        .map((s) => {
          if (s._type === 'unmarked') return `• ⏱ ${s.STUDENTS_NAME} #${s.ROLL}`;
          return `• ${s.STUDENTS_NAME} #${s.ROLL}`;
        })
        .join('\n');
    }
    return formatted;
  };

  const formatEmptyList = (className, date) => {
    return (
      `🎉 Perfect Attendance\n\n` +
      `🏫 ${className}\n` +
      `📅 ${date}\n\n` +
      `✅ All students are present today.\n` +
      `📊 100% attendance achieved.`
    );
  };

  const formatPerfectAttendance = (className, date) => formatEmptyList(className, date);

  const formatNoAttendanceMarked = (className, date) => {
    return (
      `⚠️ No attendance has been recorded yet for this date.\n\n` +
      `🏫 ${className}\n` +
      `📅 ${date}\n\n` +
      `➤ Please mark attendance for students before viewing the list.`
    );
  };

  const formatOnlyUnmarked = (unmarked, className, date) => {
    let formatted = `⏱ Students With Unmarked Attendance\n\n`;
    formatted += `🏫 ${className}\n`;
    formatted += `📅 ${date}\n\n`;
    unmarked.forEach((s) => {
      formatted += `• ${s.STUDENTS_NAME} (Roll: ${s.ROLL})\n`;
    });
    return formatted;
  };

  const formatCombined = (absent, unmarked, className, date) => {
    let formatted = `📋 Absent & Unmarked Students\n\n`;
    formatted += `🏫 ${className}\n`;
    formatted += `📅 ${date}\n\n`;
    if (absent.length > 0) {
      formatted += `❌ Absent (${absent.length})\n`;
      absent.forEach((s) => {
        formatted += `• ${s.STUDENTS_NAME} (Roll: ${s.ROLL})\n`;
      });
      formatted += `\n`;
    }
    if (unmarked.length > 0) {
      formatted += `⏱ Unmarked (${unmarked.length})\n`;
      unmarked.forEach((s) => {
        formatted += `• ${s.STUDENTS_NAME} (Roll: ${s.ROLL})\n`;
      });
    }
    return formatted;
  };

  // ---------- generate text based on current data and format ----------
  const generateTextContent = (data, format) => {
    if (!data) return '';
    const absent = data.absent_students || [];
    const unmarked = data.unmarked_students || [];
    const className = data.class_name || '';
    const dateStr = data.date || '';
    const total = data.total_students || 0;

    // Build combined array for list/compact views (with _type marker)
    const combined = [];
    absent.forEach((s) => combined.push({ ...s, _type: 'absent' }));
    unmarked.forEach((s) => combined.push({ ...s, _type: 'unmarked' }));

    // Determine which formatting function to use
    switch (format) {
      case 'list':
        return formatList(combined, className, dateStr);
      case 'compact':
        return formatCompact(combined, className, dateStr);
      case 'table':
      default:
        // If no absent and no unmarked => perfect attendance
        if (absent.length === 0 && unmarked.length === 0) {
          return formatPerfectAttendance(className, dateStr);
        }
        // If no absent but some unmarked
        if (absent.length === 0 && unmarked.length > 0) {
          if (unmarked.length === total) {
            return formatNoAttendanceMarked(className, dateStr);
          } else {
            return formatOnlyUnmarked(unmarked, className, dateStr);
          }
        }
        // If absent > 0 and unmarked === 0
        if (absent.length > 0 && unmarked.length === 0) {
          return formatTable(absent, className, dateStr);
        }
        // Mixed: absent and unmarked
        return formatCombined(absent, unmarked, className, dateStr);
    }
  };

  // ---------- fetch data ----------
  const fetchAbsentStudents = async () => {
    if (!classID || !date) {
      alert('Please select class and date first');
      return;
    }

    setLoading(true);
    try {
      const response = await apiGet(
        `/api/get_absent_students?classID=${classID}&date=${date}`
      );
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch absent students');
      }
      setCurrentData(data);
      const text = generateTextContent(data, currentFormat);
      setTextContent(text);
    } catch (error) {
      console.error('Error fetching absent students:', error);
      alert('Failed to load absent students list');
    } finally {
      setLoading(false);
    }
  };

  // ---------- effects ----------
  // Fetch data when modal opens and classID/date are available
  useEffect(() => {
    if (classID && date) {
      fetchAbsentStudents();
      setCurrentFormat('table');
    }
  }, [classID, date]);


  // Update text content when format changes (but only if data exists)
  useEffect(() => {
    if (currentData) {
      const text = generateTextContent(currentData, currentFormat);
      setTextContent(text);
    }
  }, [currentFormat, currentData]);

  // ---------- handlers ----------
  const handleClose = () => {
    onClose();
    // reset states (optional)
    setCurrentData(null);
    setTextContent('');
  };

  const handleRefresh = async () => {
    await fetchAbsentStudents();
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(textContent);
      // Visual feedback: we can show a temporary message, but for simplicity we'll use the original method
      const copyBtn = document.getElementById('copyAbsentListBtn');
      if (copyBtn) {
        const originalHTML = copyBtn.innerHTML;
        copyBtn.innerHTML = '<i class="fas fa-check mr-2"></i>Copied';
        copyBtn.classList.add('bg-green-500');
        setTimeout(() => {
          copyBtn.innerHTML = originalHTML;
          copyBtn.classList.remove('bg-green-500');
        }, 1500);
      }
    } catch (err) {
      console.error('Failed to copy:', err);
      alert('Failed to copy to clipboard');
    }
  };

  const handleClear = () => {
    if (window.confirm('Clear the list?')) {
      setTextContent('');
    }
  };

  const handleToggleFormat = () => {
    const formats = ['table', 'list', 'compact'];
    const currentIndex = formats.indexOf(currentFormat);
    const nextIndex = (currentIndex + 1) % formats.length;
    const nextFormat = formats[nextIndex];
    setCurrentFormat(nextFormat);
    // Update button icon/text? We'll do it in JSX based on currentFormat.
  };


  // Determine format button label and icon
  const formatButtonLabel = {
    table: 'Table',
    list: 'List',
    compact: 'Compact',
  }[currentFormat];
  const formatIcon = {
    table: 'fa-table',
    list: 'fa-list',
    compact: 'fa-compress-alt',
  }[currentFormat];

  // Show loading state in textarea
  const displayText = loading ? 'Loading list...' : textContent;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={(e) => {
        if (e.target === e.currentTarget) handleClose();
      }}
    >
      <div className="absolute inset-0 bg-black/70"></div>

      <div
        className="relative bg-[#1A1A1A] rounded-2xl w-full max-w-4xl shadow-2xl border border-[#2A2A2A]
          flex flex-col max-h-[90vh] overflow-hidden"
      >
        {/* Header */}
        <div className="p-5 border-b border-[#2A2A2A] flex justify-between items-center">
          <div>
            <h3 className="text-lg font-semibold text-white">Absent Students List</h3>
            <p className="text-sm text-gray-400 mt-1" id="absentListDate">
              Date: {date || 'Loading...'}
            </p>
          </div>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-white transition"
          >
            <i className="fas fa-times text-xl"></i>
          </button>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-hidden flex flex-col">
          <div className="flex-1 overflow-hidden p-5">
            {/* Toolbar */}
            <div className="flex items-center justify-between mb-3">
              <label className="block text-sm font-medium text-gray-300">
                Premium Absent Report
              </label>
              <div className="flex items-center gap-2">
                <button
                  onClick={handleToggleFormat}
                  className="px-3 py-1.5 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 
                    text-white rounded-lg text-sm transition-all duration-300 shadow-lg shadow-purple-500/20 
                    hover:shadow-purple-500/30 flex items-center"
                >
                  <i className={`fas ${formatIcon} mr-1`}></i>
                  {formatButtonLabel}
                </button>
                <button
                  onClick={handleClear}
                  className="px-3 py-1.5 bg-gradient-to-r from-gray-700 to-gray-600 hover:from-gray-600 hover:to-gray-500 
                    text-white rounded-lg text-sm transition-all duration-300 shadow-lg shadow-gray-700/20 
                    hover:shadow-gray-700/30 flex items-center"
                >
                  <i className="fas fa-eraser mr-1"></i>
                  Clear
                </button>
              </div>
            </div>

            <textarea
              ref={textareaRef}
              id="absentStudentsTextArea"
              className={`w-full h-full min-h-[300px] bg-[#2A2A2A] border border-[#3A3A3A] text-white 
                rounded-xl p-4 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all 
                resize-none overflow-y-auto font-mono text-sm ${loading ? 'opacity-50' : ''}`}
              value={displayText}
              readOnly
              placeholder="Loading absent students list..."
            />
          </div>
        </div>

        {/* Footer */}
        <div className="p-5 border-t border-[#2A2A2A] flex flex-col sm:flex-row gap-3">
          <button
            id="copyAbsentListBtn"
            onClick={handleCopy}
            className="flex-1 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 
              text-white font-medium py-3.5 px-4 rounded-xl transition shadow-lg flex items-center justify-center gap-2"
          >
            <i className="far fa-copy"></i>
            <span>Copy to Clipboard</span>
          </button>
          <button
            id="refreshAbsentListBtn"
            onClick={handleRefresh}
            disabled={loading}
            className="flex-1 bg-white/5 hover:bg-white/10 text-white font-medium py-3.5 px-4 rounded-xl transition 
              flex items-center justify-center gap-2 disabled:opacity-50"
          >
            <i className={`fas ${loading ? 'fa-spinner fa-spin' : 'fa-sync-alt'}`}></i>
            <span>{loading ? 'Loading...' : 'Refresh List'}</span>
          </button>
        </div>
      </div>
    </div>
  );
}

export default AbsentStudentsList;