import React from "react";

function SiblingsSection({ siblings = [], handleSiblingClick }) {
  if (!siblings || siblings.length === 0) return null;

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-white flex items-center gap-2">
          <div className="w-1 h-6 bg-indigo-500 rounded-full" />
          Siblings
        </h3>

        <span className="px-3 py-1 bg-indigo-500/20 text-indigo-300 text-sm rounded-full">
          {siblings.length} sibling{siblings.length > 1 ? "s" : ""}
        </span>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {siblings.map((sibling) => (
          <div
            key={sibling.id}
            className="group bg-gray-800/30 rounded-xl p-4 border border-gray-700/30 hover:border-blue-500/50 transition-all cursor-pointer"

            onClick={() => {
              handleSiblingClick(sibling.id, sibling.PHONE);
            }}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3 min-w-0">
                {/* Avatar */}
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500/20 to-purple-500/20 flex items-center justify-center">
                  <i className="fas fa-user text-blue-400" />
                </div>

                {/* Info */}
                <div className="min-w-0">
                  <h4 className="font-medium text-white group-hover:text-blue-300 truncate">
                    {sibling.STUDENTS_NAME}
                  </h4>

                  <div className="flex items-center gap-2 mt-1">
                    <span className="px-2 py-0.5 bg-gray-700/50 text-gray-300 rounded text-xs">
                      {sibling.CLASS}
                    </span>

                    <span className="text-gray-500 text-xs">•</span>

                    <span className="text-gray-400 text-xs">
                      Roll {sibling.ROLL}
                    </span>
                  </div>
                </div>
              </div>

              {/* Action */}
              <button
                className="opacity-0 group-hover:opacity-100 px-3 py-1.5 bg-blue-500/20 hover:bg-blue-500/30 text-blue-300 rounded-lg transition-all text-sm"
                onClick={() => {
                  handleSiblingClick(sibling.id, sibling.PHONE);
                }}>
                <i className="fas fa-eye mr-1" />
                View
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default SiblingsSection;