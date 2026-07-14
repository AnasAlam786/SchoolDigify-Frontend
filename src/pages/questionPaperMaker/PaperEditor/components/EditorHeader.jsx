import { Link } from 'react-router-dom';

export default function EditorHeader({ onAddSection }) {
  return (
    <div className="pb-6 border-b border-gray-400/40 mb-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-3">
          <Link
            to="/question-papers"
            className="group p-2 bg-navbg/50 backdrop-blur-sm border border-gray-700 rounded-xl hover:border-primary transition-all duration-300"
          >
            <i className="fas fa-arrow-left text-gray-400 group-hover:text-primary" />
          </Link>
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
              Edit Question Paper
            </h1>
            <p className="text-gray-400 text-sm mt-1">Edit and customize your question paper</p>
          </div>
        </div>
        <button
          type="button"
          onClick={onAddSection}
          className="group relative overflow-hidden bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 text-white font-semibold py-2.5 px-5 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 flex items-center justify-center gap-2 text-sm sm:text-base"
        >
          <div className="absolute inset-0 bg-white/10 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
          <i className="fas fa-plus" />
          Add Section
        </button>
      </div>
    </div>
  );
}
