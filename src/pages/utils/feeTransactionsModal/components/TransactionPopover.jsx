
import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';

function TransactionPopover({ months, anchorElement, onClose }) {
  const popoverRef = useRef(null);
  const [position, setPosition] = useState(null);

  useLayoutEffect(() => {
    if (!anchorElement) return undefined;

    const updatePosition = () => {
      const anchorRect = anchorElement.getBoundingClientRect();
      const width = Math.min(288, window.innerWidth - 24);
      const left = Math.min(
        Math.max(12, anchorRect.left),
        window.innerWidth - width - 12
      );
      const spaceBelow = window.innerHeight - anchorRect.bottom - 12;
      const showAbove = spaceBelow < 240 && anchorRect.top > spaceBelow;

      setPosition({
        left,
        top: showAbove ? Math.max(12, anchorRect.top - 8) : anchorRect.bottom + 8,
        transform: showAbove ? 'translateY(-100%)' : 'none',
        width,
      });
    };

    updatePosition();
    window.addEventListener('resize', updatePosition);
    document.addEventListener('scroll', updatePosition, true);

    return () => {
      window.removeEventListener('resize', updatePosition);
      document.removeEventListener('scroll', updatePosition, true);
    };
  }, [anchorElement]);

  useEffect(() => {
    const handlePointerDown = (event) => {
      if (!popoverRef.current?.contains(event.target)) {
        onClose();
      }
    };

    document.addEventListener('pointerdown', handlePointerDown);
    return () => document.removeEventListener('pointerdown', handlePointerDown);
  }, [onClose]);

  if (!position) return null;

  return createPortal(
    <div ref={popoverRef} className="fixed z-[10000] max-w-[calc(100vw-24px)] rounded-xl border border-indigo-600 bg-[#0f1a2c] shadow-2xl shadow-indigo-900/30" style={{ ...position, animation: 'popoverFadeIn 0.2s ease-out' }}>
      <div className="p-4">
        <div className="mb-3 flex items-center justify-between">
          <h4 className="text-sm font-semibold text-indigo-200">Months Covered</h4>
          <button type="button" className="flex h-6 w-6 items-center justify-center rounded-full text-indigo-400 transition-colors hover:bg-indigo-800 hover:text-white focus:outline-none" onClick={onClose}>
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div className="max-h-48 space-y-1.5 overflow-y-auto pr-1 custom-scrollbar">
          {months.map((month) => (
            <div key={month} className="flex items-center gap-2 rounded-lg border border-indigo-700/50 bg-[#182438] px-2.5 py-2">
              <svg className="h-4 w-4 shrink-0 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
              </svg>
              <span className="text-sm text-indigo-200">{month}</span>
            </div>
          ))}
        </div>
      </div>
    </div>,
    document.body
  );
}

export default TransactionPopover