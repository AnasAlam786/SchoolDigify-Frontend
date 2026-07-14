export default function QuestionTypeModal({ onClose, onSelectType }) {
  const options = [
    { type: 'mcq', title: 'Multiple Choice', subtitle: 'MCQ Questions', icon: 'fas fa-list-ul', accent: 'primary' },
    { type: 'QnA', title: 'Q&A', subtitle: 'Question & Answer', icon: 'fas fa-question', accent: 'secondary' },
    { type: 'fillUp', title: 'Fill in Blanks', subtitle: 'Fill in the blanks', icon: 'fas fa-pencil-alt', accent: 'success' },
    { type: 'TF', title: 'True/False', subtitle: 'True or False statements', icon: 'fas fa-check-double', accent: 'warning' },
    { type: 'match', title: 'Matching', subtitle: 'Match columns', icon: 'fas fa-exchange-alt', accent: 'purple-400' },
    { type: 'singleWord', title: 'Single Word', subtitle: 'One word answers', icon: 'fas fa-font', accent: 'blue-400' },
  ];

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-navbg border border-gray-700 rounded-2xl shadow-2xl max-w-2xl w-full transform transition-all duration-300">
        <div className="bg-gradient-to-r from-primary/20 to-secondary/20 border-b border-gray-700 px-6 py-4 flex items-center justify-between">
          <h2 className="text-xl font-bold text-white flex items-center gap-3">
            <i className="fas fa-plus-circle text-primary" />
            Add Question Type
          </h2>
          <button type="button" onClick={onClose} className="text-gray-400 hover:text-white transition">
            <i className="fas fa-times text-xl" />
          </button>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {options.map((option) => (
              <button
                key={option.type}
                type="button"
                onClick={() => onSelectType(option.type)}
                className="p-4 bg-darkbg/50 border border-gray-600 rounded-xl hover:border-primary transition group text-center"
              >
                <div className={`w-12 h-12 mx-auto mb-3 bg-${option.accent}/20 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform`}>
                  <i className={`${option.icon} text-${option.accent} text-xl`} />
                </div>
                <h4 className="font-semibold text-white mb-1">{option.title}</h4>
                <p className="text-gray-400 text-sm">{option.subtitle}</p>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
