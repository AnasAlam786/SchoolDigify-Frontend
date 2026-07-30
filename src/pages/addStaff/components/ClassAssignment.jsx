import { useMemo, useState } from "react";

export default function ClassAssignment({ classes, selectedClasses, onToggleClass }) {
  const [query, setQuery] = useState("");

  const filteredClasses = useMemo(() => {
    const searchText = query.trim().toLowerCase();
    if (!searchText) return classes;
    return classes.filter((cls) => String(cls.CLASS).toLowerCase().includes(searchText));
  }, [classes, query]);

  return (
    <div className="form-section bg-gray-dark/70 backdrop-blur-md rounded-xl p-6 mb-6 shadow-section">
      <div className="section-header flex items-center mb-6 pb-4">
        <div className="section-icon w-10 h-10 bg-primary/15 rounded-lg flex items-center justify-center mr-4 text-primary">
          <i className="fas fa-chalkboard text-base" />
        </div>
        <h2 className="section-title text-[1.4rem] font-semibold">Class Assignment</h2>
      </div>

      <div className="form-content">
        <p className="text-gray-lighter mb-4">Assign classes to this teacher. You can select multiple classes.</p>

        <div className="search-filter mb-4">
          <input
            type="text"
            id="classSearch"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search classes..."
            className="form-input w-full p-3 rounded-xl text-gray-light text-base transition-all duration-300 focus:outline-none focus:border-primary focus:shadow-[0_0_0_3px_rgba(67,97,238,0.2)]"
          />
        </div>

        <div className="selected-classes-preview mb-4">
          <div className="flex justify-between items-center mb-2">
            <span className="text-gray-light font-medium">Selected Classes:</span>
            <span className="text-primary text-sm">{selectedClasses.length} {selectedClasses.length === 1 ? "class" : "classes"}</span>
          </div>
          <div className="selected-classes-tags flex flex-wrap gap-2">
            {selectedClasses.map((cls) => (
              <span key={cls.id} className="class-tag px-3 py-2 rounded-full text-sm">
                {cls.CLASS}
              </span>
            ))}
          </div>
        </div>

        <div className="classes-grid grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 max-h-80 overflow-y-auto p-2">
          {filteredClasses.map((cls) => {
            const selected = selectedClasses.some((item) => String(item.id) === String(cls.id));
            return (
              <button
                key={cls.id}
                type="button"
                className={`checkbox-item p-4 rounded-xl text-left transition-all duration-300 ${selected ? "selected" : ""}`}
                onClick={() => onToggleClass(cls)}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium text-gray-light">{cls.CLASS}</div>
                    <div className="text-sm text-gray-lighter mt-1">Class Teacher: None</div>
                  </div>
                  <div className="checkbox-indicator">
                    <input
                      type="checkbox"
                      readOnly
                      checked={selected}
                      className="w-4 h-4 rounded-sm border border-gray-400 bg-gray-600 checked:bg-green-500 checked:border-green-500 text-green-500 focus:ring-2 focus:ring-green-400 appearance-none"
                    />
                  </div>
                </div>
              </button>
            );
          })}

          {filteredClasses.length === 0 ? (
            <div className="no-results text-center py-8 text-gray-lighter">
              <i className="fas fa-search text-3xl mb-2 opacity-50"></i>
              <p>No classes found matching your search</p>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
