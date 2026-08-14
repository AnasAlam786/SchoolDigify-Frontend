import React from "react";

export default function SectionHeader({ icon, title, subtitle }) {
  return (
    <div className="section-header flex items-center mb-6 pb-4">
      <div className="section-icon w-10 h-10 bg-primary/15 rounded-lg flex items-center justify-center mr-4 text-primary">
        <i className={icon} />
      </div>
      <div>
        <h2 className="section-title text-[1.4rem] font-semibold">{title}</h2>
        {subtitle ? <p className="text-gray-lighter text-sm mt-1 max-w-2xl">{subtitle}</p> : null}
      </div>
    </div>
  );
}
