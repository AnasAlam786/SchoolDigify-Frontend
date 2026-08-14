import { useMemo, useState } from "react";

export default function ClassAssignment({ setFormData, allClasses = [], selectedClasses=[] }) {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredClasses = useMemo(() => {
    const searchText = searchQuery.trim().toLowerCase();
    if (!searchText) return allClasses;
    return allClasses.filter((cls) =>
      String(cls.class_name || cls.CLASS || "").toLowerCase().includes(searchText)
    );
  }, [allClasses, searchQuery]);

  const handleClassToggle = (classItem) => {
    setFormData((current) => {
      const normalizedId = String(classItem.id);
      const currentAssigned = (current.assigned_classes_id || []).map(String);
      const exists = currentAssigned.includes(normalizedId);

      const nextClasses = exists
        ? currentAssigned.filter((id) => id !== normalizedId)
        : [...currentAssigned, normalizedId];

      return { ...current, assigned_classes_id: nextClasses };
    });
  };

  // Check if school has zero classes created in total
  const hasNoSchoolClasses = allClasses.length === 0;

  return (
    <div className="form-section bg-gray-dark/70 backdrop-blur-md rounded-xl p-6 mb-6 shadow-section border border-gray-800">
      {/* Section Header */}
      <div className="section-header flex items-center mb-6 pb-4 border-b border-gray-800">
        <div className="section-icon w-10 h-10 bg-primary/15 rounded-lg flex items-center justify-center mr-4 text-primary">
          <i className="fas fa-chalkboard text-lg" />
        </div>
        <h2 className="section-title text-[1.4rem] font-semibold text-white">
          Class Assignment
        </h2>
      </div>

      <div className="form-content">
        {hasNoSchoolClasses ? (
          /* ================= 1. NO CLASSES IN SCHOOL AT ALL ================= */
          <div className="flex flex-col items-center justify-center py-12 px-6 rounded-2xl bg-[#1A1A1A] border border-dashed border-gray-700/80 text-center shadow-inner">
            <div className="w-16 h-16 rounded-full bg-amber-500/10 border border-amber-500/20 flex items-center justify-center mb-4 text-amber-400">
              <i className="fas fa-exclamation-triangle text-2xl" />
            </div>

            <h3 className="text-lg font-semibold text-gray-200 mb-2">
              No Classes Available in School
            </h3>

            <p className="text-gray-400 text-sm max-w-md leading-relaxed mb-6">
              No classes have been added to the school system yet. Please create classes first under School Setup / Class Management before assigning them to teachers.
            </p>

          </div>
        ) : (
          /* ================= 2. CLASSES EXIST IN SCHOOL ================= */
          <>
            <p className="text-gray-400 text-sm mb-5">
              Assign classes to this teacher. You can select multiple classes.
            </p>

            {/* Search Input */}
            <div className="search-filter mb-5 relative">
              <i className="fas fa-search absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 text-sm" />
              <input
                type="text"
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
                placeholder="Search classes..."
                className="form-input w-full pl-10 pr-4 py-3 bg-gray-800/50 border border-gray-700/60 rounded-xl text-gray-200 text-base transition-all duration-300 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 placeholder:text-gray-500"
              />
            </div>

            {/* Selected Preview Tags */}
            <div className="selected-classes-preview mb-5 p-4 rounded-xl bg-gray-800/30 border border-gray-800">
              <div className="flex justify-between items-center mb-3">
                <span className="text-gray-300 text-sm font-medium">Selected Classes:</span>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-primary/15 text-primary border border-primary/20">
                  {selectedClasses.length} {selectedClasses.length === 1 ? "class" : "classes"}
                </span>
              </div>

              <div className="selected-classes-tags flex flex-wrap gap-2 min-h-[32px] items-center">
                {selectedClasses.length > 0 ? (
                  selectedClasses.map((cls) => (
                    <span
                      key={cls.id}
                      className="class-tag inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium bg-primary/20 text-primary border border-primary/30"
                    >
                      {cls.class_name}
                      <button
                        type="button"
                        onClick={() => handleClassToggle(cls)}
                        className="hover:text-red-400 transition-colors"
                      >
                        <i className="fas fa-times text-[10px]" />
                      </button>
                    </span>
                  ))
                ) : (
                  <span className="text-xs text-gray-500 italic">No classes selected yet</span>
                )}
              </div>
            </div>

            {/* Grid vs Search Empty State */}
            <div className="classes-grid grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5 max-h-80 overflow-y-auto p-1 custom-scrollbar">
              {filteredClasses.length > 0 ? (
                filteredClasses.map((cls) => {
                  const selected = selectedClasses.some(
                    (item) => String(item.id) === String(cls.id)
                  );

                  return (
                    <button
                      key={cls.id}
                      type="button"
                      className={`checkbox-item p-4 rounded-xl text-left transition-all duration-200 border cursor-pointer ${selected
                          ? "bg-primary/10 border-primary shadow-sm"
                          : "bg-gray-800/40 border-gray-700/50 hover:border-gray-600 hover:bg-gray-800/70"
                        }`}
                      onClick={() => handleClassToggle(cls)}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-medium text-sm text-gray-200">
                          {cls.class_name}
                        </span>

                        <div className="checkbox-indicator">
                          <div
                            className={`w-5 h-5 rounded-md flex items-center justify-center transition-all ${selected
                                ? "bg-emerald-500 text-white"
                                : "border border-gray-600 bg-gray-700/50"
                              }`}
                          >
                            {selected && <i className="fas fa-check text-[10px]" />}
                          </div>
                        </div>
                      </div>
                    </button>
                  );
                })
              ) : (
                /* Search Filter Empty State */
                <div className="col-span-full flex flex-col items-center justify-center py-10 px-4 rounded-2xl bg-gray-800/20 border border-dashed border-gray-700/70 text-center">
                  <div className="w-12 h-12 rounded-full bg-gray-800 flex items-center justify-center mb-3 text-gray-500 border border-gray-700">
                    <i className="fas fa-search text-lg" />
                  </div>
                  <h4 className="text-gray-300 font-medium text-sm mb-1">No Search Matches</h4>
                  <p className="text-gray-500 text-xs max-w-xs">
                    No classes found matching <span className="text-gray-300">"{searchQuery}"</span>.
                  </p>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}