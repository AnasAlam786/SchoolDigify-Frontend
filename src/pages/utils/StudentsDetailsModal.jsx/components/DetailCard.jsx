import React from "react";

const colorClasses = {
  blue: {
    icon: "bg-blue-500/20 text-blue-400",
    border: "hover:border-blue-500/30",
  },
  purple: {
    icon: "bg-purple-500/20 text-purple-400",
    border: "hover:border-purple-500/30",
  },
  green: {
    icon: "bg-green-500/20 text-green-400",
    border: "hover:border-green-500/30",
  },
  pink: {
    icon: "bg-pink-500/20 text-pink-400",
    border: "hover:border-pink-500/30",
  },
  yellow: {
    icon: "bg-yellow-500/20 text-yellow-400",
    border: "hover:border-yellow-500/30",
  },
  red: {
    icon: "bg-red-500/20 text-red-400",
    border: "hover:border-red-500/30",
  },
  orange: {
    icon: "bg-orange-500/20 text-orange-400",
    border: "hover:border-orange-500/30",
  },
  indigo: {
    icon: "bg-indigo-500/20 text-indigo-400",
    border: "hover:border-indigo-500/30",
  },
  teal: {
    icon: "bg-teal-500/20 text-teal-400",
    border: "hover:border-teal-500/30",
  },
  gray: {
    icon: "bg-gray-500/20 text-gray-400",
    border: "hover:border-gray-500/30",
  },
  amber: {
    icon: "bg-amber-500/20 text-amber-400",
    border: "hover:border-amber-500/30",
  },
  emerald: {
    icon: "bg-emerald-500/20 text-emerald-400",
    border: "hover:border-emerald-500/30",
  },
};


const bgMap = {
  green: "bg-green-500/10",
  red: "bg-red-500/10",
  blue: "bg-blue-500/10",
  yellow: "bg-yellow-500/10",
};

const textMap = {
  green: "text-green-400",
  red: "text-red-400",
  blue: "text-blue-400",
  yellow: "text-yellow-400",
};

export default function DetailCard({
  icon, label, value, color, fillColour = null
}) {
  const classes = colorClasses[color] || colorClasses.blue;

  const hasValue = value && value !== "N/A";

  const bgColour = bgMap[fillColour] || "bg-gray-800/30";
  const valueColor = fillColour ? (textMap[fillColour] || "text-white") : "text-white";

  return (
    <div
      className={`${bgColour} rounded-xl p-4 border border-gray-700/30 transition-colors 
      ${hasValue ? classes.border : "opacity-70"}`}
    >
      <div className="flex items-center gap-3">
        <div
          className={`p-2 rounded-lg flex-shrink-0 ${
            hasValue ? classes.icon : "bg-gray-500/20 text-gray-400"
          }`}
        >
          <i className={`${icon} text-lg`} />
        </div>

        <div className="min-w-0">
          <p className="text-sm text-gray-400 mb-1">{label}</p>

          <p
            className={`font-medium truncate ${
              hasValue ? valueColor : "text-gray-400"
            }`}
          >
            {hasValue ? value : "Not Provided"}
          </p>
        </div>
      </div>
    </div>
  );
}