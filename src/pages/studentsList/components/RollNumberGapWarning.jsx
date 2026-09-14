import { useMemo, useState } from "react";

function detectRollGaps(students) {
  const groupedRolls = new Map();

  students.forEach((student) => {
    const className = String(student.CLASS ?? "").trim();
    const rollNumber = Number.parseInt(student.ROLL, 10);

    if (!className || Number.isNaN(rollNumber)) {
      return;
    }

    if (!groupedRolls.has(className)) {
      groupedRolls.set(className, []);
    }

    groupedRolls.get(className).push(rollNumber);
  });

  return Array.from(groupedRolls.entries()).flatMap(([className, rollNumbers]) => {
    const uniqueRollNumbers = Array.from(new Set(rollNumbers.filter((roll) => roll >= 1)));

    if (uniqueRollNumbers.length === 0) {
      return [];
    }

    // Start checking from 1 to detect if Roll 1 is missing
    const minRoll = Math.min(1, ...uniqueRollNumbers);
    const maxRoll = Math.max(...uniqueRollNumbers);
    const assigned = new Set(uniqueRollNumbers);
    const missing = [];

    for (let currentRoll = minRoll; currentRoll <= maxRoll; currentRoll += 1) {
      if (!assigned.has(currentRoll)) {
        missing.push(currentRoll);
      }
    }

    if (!missing.length) {
      return [];
    }

    return [{
      className,
      missing,
    }];
  });
}

export default function RollNumberGapWarning({ students = [] }) {
  const [isDismissed, setIsDismissed] = useState(false);

  const gaps = useMemo(() => detectRollGaps(students), [students]);

  if (isDismissed || gaps.length === 0) {
    return null;
  }

  return (
    <div className="w-full my-4 rounded-xl border border-amber-200 bg-amber-50/70 p-4 shadow-sm backdrop-blur-sm transition-all dark:border-amber-900/50 dark:bg-amber-950/30">
      {/* Header */}
      <div className="flex items-center justify-between pb-2 border-b border-amber-200/60 dark:border-amber-900/40">
        <div className="flex items-center gap-2.5 text-amber-800 dark:text-amber-400">
          <i className="fas fa-exclamation-triangle text-amber-600 dark:text-amber-500 text-lg" />
          <h3 className="text-sm font-semibold tracking-wide uppercase">
            Roll Number Gap Detected
          </h3>
        </div>
        <button
          type="button"
          aria-label="Close roll number gap warning"
          onClick={() => setIsDismissed(true)}
          className="rounded-lg p-1 text-amber-700/70 hover:text-amber-900 hover:bg-amber-200/50 dark:text-amber-400/70 dark:hover:text-amber-200 dark:hover:bg-amber-900/40 transition-colors"
        >
          <i className="fas fa-xmark text-base block" />
        </button>
      </div>

      {/* Body List */}
      <div className="mt-3 space-y-2 text-sm text-amber-900 dark:text-amber-200">
        {gaps.map((group) => (
          <div key={group.className} className="flex items-start gap-2">
            <span className="inline-block mt-1.5 h-1.5 w-1.5 rounded-full bg-amber-500 shrink-0" />
            <p className="leading-relaxed">
              In class <strong className="font-semibold text-amber-950 dark:text-amber-100">{group.className}</strong>, 
              roll {group.missing.length > 1 ? "numbers" : "number"}{" "}
              <span className="font-mono font-medium bg-amber-100 dark:bg-amber-900/60 text-amber-900 dark:text-amber-200 px-1.5 py-0.5 rounded text-xs border border-amber-300/50 dark:border-amber-800">
                {group.missing.join(", ")}
              </span>{" "}
              {group.missing.length > 1 ? "are" : "is"} missing. Please review and assign them.
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}