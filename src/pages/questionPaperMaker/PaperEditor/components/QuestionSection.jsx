import { QUESTION_TYPE_LABELS } from '../utils/questionEditorUtils.js';

function autoResizeTextarea(event) {
  const target = event.currentTarget;
  target.style.height = 'auto';
  target.style.height = `${Math.min(target.scrollHeight, 200)}px`;
}

export default function QuestionSection({
  section,
  index,
  onSectionChange,
  onQuestionChange,
  onQuestionOptionChange,
  onAddQuestion,
  onRemoveQuestion,
  onRemoveSection,
  onMoveSectionUp,
  onMoveSectionDown,
  onAddSectionAfter,
  onSectionTypeChange,
}) {
  const sectionNumber = index + 1;

  const renderQuestionBody = () => {
    switch (section.type) {
      case 'mcq':
        return section.items.map((item, itemIndex) => (
          <div key={`${section.id}-${itemIndex}`} className="question-item">
            <div className="bg-darkbg/20 pl-4 pr-0 pt-4 pb-4">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 flex items-center justify-center bg-primary/20 rounded-lg flex-shrink-0 border border-primary/30">
                    <span className="text-primary font-bold text-sm">{itemIndex + 1}</span>
                  </div>
                  <h4 className="text-white font-bold">Question {itemIndex + 1}</h4>
                </div>
                <div className="flex gap-2">
                  <button type="button" className="p-2 bg-success/20 hover:bg-success/30 border border-success/30 hover:border-success/50 rounded-lg transition" onClick={() => onAddQuestion(index)} title="Add another question">
                    <i className="fas fa-plus text-success text-xs" />
                  </button>
                  <button type="button" className="p-2 bg-danger/20 hover:bg-danger/30 border border-danger/30 hover:border-danger/50 rounded-lg transition" onClick={() => onRemoveQuestion(index, itemIndex)} title="Remove question">
                    <i className="fas fa-minus text-danger text-xs" />
                  </button>
                </div>
              </div>

              <div className="mb-4">
                <textarea
                  className="question-text w-full bg-darkbg/50 text-white border border-gray-700 hover:border-gray-600 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition resize-none"
                  placeholder="Enter your MCQ question..."
                  value={item.text || ''}
                  onInput={autoResizeTextarea}
                  onChange={(e) => onQuestionChange(index, itemIndex, 'text', e.target.value)}
                  aria-label={`Question ${itemIndex + 1}`}
                />
              </div>

              <div className="space-y-2">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {['A', 'B', 'C', 'D'].map((letter, optionIndex) => (
                    <div key={`${section.id}-${itemIndex}-${letter}`} className="flex items-center gap-3 p-3 bg-darkbg/30 rounded-lg border border-gray-700 hover:border-gray-600 transition">
                      <div className="w-8 h-8 flex items-center justify-center bg-primary/20 rounded border border-primary/30 flex-shrink-0">
                        <span className="text-primary font-bold text-xs">{letter}</span>
                      </div>
                      <input
                        type="text"
                        className="flex-1 bg-transparent text-white placeholder-gray-500 focus:outline-none"
                        placeholder={`Option ${letter}`}
                        value={item.options?.[optionIndex] || ''}
                        onChange={(e) => onQuestionOptionChange(index, itemIndex, optionIndex, e.target.value)}
                        aria-label={`Question ${itemIndex + 1} option ${letter}`}
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ));

      case 'QnA':
      case 'fillUp':
      case 'TF':
      case 'singleWord':
        return section.items.map((item, itemIndex) => (
          <div key={`${section.id}-${itemIndex}`} className="question-item">
            <div className="bg-darkbg/20 pl-4 pr-0 pt-4 pb-4">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 flex items-center justify-center ${section.type === 'QnA' ? 'bg-secondary/20 border-secondary/30' : section.type === 'fillUp' ? 'bg-success/20 border-success/30' : section.type === 'TF' ? 'bg-warning/20 border-warning/30' : 'bg-blue-500/20 border-blue-500/30'} rounded-lg flex-shrink-0 border`}>
                    <span className={section.type === 'QnA' ? 'text-secondary' : section.type === 'fillUp' ? 'text-success' : section.type === 'TF' ? 'text-warning' : 'text-blue-400'} style={{ fontWeight: 700, fontSize: '0.875rem' }}>{itemIndex + 1}</span>
                  </div>
                  <h4 className="text-white font-bold">Question {itemIndex + 1}</h4>
                </div>
                <div className="flex gap-2">
                  <button type="button" className="p-2 bg-success/20 hover:bg-success/30 border border-success/30 hover:border-success/50 rounded-lg transition" onClick={() => onAddQuestion(index)} title="Add another question">
                    <i className="fas fa-plus text-success text-xs" />
                  </button>
                  <button type="button" className="p-2 bg-danger/20 hover:bg-danger/30 border border-danger/30 hover:border-danger/50 rounded-lg transition" onClick={() => onRemoveQuestion(index, itemIndex)} title="Remove question">
                    <i className="fas fa-minus text-danger text-xs" />
                  </button>
                </div>
              </div>

              {section.type === 'singleWord' ? (
                <input
                  type="text"
                  className="question-text w-full bg-darkbg/50 text-white border border-gray-700 hover:border-gray-600 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition"
                  placeholder="Enter the word/term..."
                  value={item || ''}
                  onChange={(e) => onQuestionChange(index, itemIndex, 'value', e.target.value)}
                />
              ) : (
                <textarea
                  className="question-text w-full bg-darkbg/50 text-white border border-gray-700 hover:border-gray-600 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition resize-none"
                  placeholder={section.type === 'QnA' ? 'Enter your question and answer...' : section.type === 'fillUp' ? 'Enter sentence with blank (use _____ for blank)...' : 'Enter true/false statement...'}
                  value={item || ''}
                  onInput={autoResizeTextarea}
                  onChange={(e) => onQuestionChange(index, itemIndex, 'value', e.target.value)}
                />
              )}
            </div>
          </div>
        ));

      case 'match':
        return section.items.map((item, itemIndex) => (
          <div key={`${section.id}-${itemIndex}`} className="question-item">
            <div className="bg-darkbg/20 pl-4 pr-0 pt-4 pb-4">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 flex items-center justify-center bg-purple-500/20 rounded-lg flex-shrink-0 border border-purple-500/30">
                    <span className="text-purple-400 font-bold text-sm">{itemIndex + 1}</span>
                  </div>
                  <h4 className="text-white font-bold">Pair {itemIndex + 1}</h4>
                </div>
                <div className="flex gap-2">
                  <button type="button" className="p-2 bg-success/20 hover:bg-success/30 border border-success/30 hover:border-success/50 rounded-lg transition" onClick={() => onAddQuestion(index)} title="Add another pair">
                    <i className="fas fa-plus text-success text-xs" />
                  </button>
                  <button type="button" className="p-2 bg-danger/20 hover:bg-danger/30 border border-danger/30 hover:border-danger/50 rounded-lg transition" onClick={() => onRemoveQuestion(index, itemIndex)} title="Remove pair">
                    <i className="fas fa-minus text-danger text-xs" />
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-300 mb-2">Column A (Left)</label>
                  <input
                    type="text"
                    className="match-left w-full bg-darkbg/50 text-white border border-gray-700 hover:border-gray-600 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition"
                    placeholder="Enter item from Column A"
                    value={item.left || ''}
                    onChange={(e) => onQuestionChange(index, itemIndex, 'left', e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-300 mb-2">Column B (Right)</label>
                  <input
                    type="text"
                    className="match-right w-full bg-darkbg/50 text-white border border-gray-700 hover:border-gray-600 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition"
                    placeholder="Enter matching item from Column B"
                    value={item.right || ''}
                    onChange={(e) => onQuestionChange(index, itemIndex, 'right', e.target.value)}
                  />
                </div>
              </div>
            </div>
          </div>
        ));

      default:
        return null;
    }
  };

  return (
    <div className="question-section" data-id={section.id} data-type={section.type}>
      <div className="bg-navbg/50 backdrop-blur-sm border border-gray-700 rounded-2xl overflow-hidden transition-all duration-300 hover:border-primary">
        <div className="bg-gradient-to-r from-primary/10 to-secondary/10 border-b border-gray-700 px-4 sm:px-6 py-3 sm:py-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 flex items-center justify-center bg-primary/20 rounded-lg flex-shrink-0">
                <span className="text-primary font-bold">{sectionNumber}</span>
              </div>
              <div className="min-w-0">
                <h3 className="text-base sm:text-lg font-bold text-white truncate">Section {sectionNumber}: {section.qText}</h3>
                <p className="text-gray-400 text-xs sm:text-sm">{QUESTION_TYPE_LABELS[section.type] || 'Question Section'}</p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <div className="relative flex-1 sm:flex-none min-w-[140px]">
                <select
                  value={section.type}
                  className="question-type-select w-full bg-gray-800 text-white border border-gray-600 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition hover:bg-gray-700"
                  onChange={(e) => onSectionTypeChange(index, e.target.value)}
                >
                  <option value="mcq">MCQ</option>
                  <option value="QnA">Q&A</option>
                  <option value="fillUp">Fill Ups</option>
                  <option value="TF">True/False</option>
                  <option value="match">Matching</option>
                  <option value="singleWord">Single Word</option>
                </select>
              </div>
              <button type="button" onClick={() => onAddSectionAfter(index)} className="p-2 bg-success/20 hover:bg-success/30 border border-success/30 hover:border-success/50 rounded-lg transition group" title="Add Section After">
                <i className="fas fa-plus text-success text-sm" />
              </button>
              <button type="button" onClick={() => onRemoveSection(index)} className="p-2 bg-danger/20 hover:bg-danger/30 rounded-lg transition group" title="Remove Section">
                <i className="fas fa-trash text-danger text-sm" />
              </button>
              <div className="flex gap-1">
                <button type="button" onClick={() => onMoveSectionUp(index)} className="p-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition" title="Move Up">
                  <i className="fas fa-arrow-up text-gray-300 text-sm" />
                </button>
                <button type="button" onClick={() => onMoveSectionDown(index)} className="p-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition" title="Move Down">
                  <i className="fas fa-arrow-down text-gray-300 text-sm" />
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="p-4 sm:p-6">
          <div className="flex gap-2 mb-6 items-end">
            <div className="flex-[9]">
              <label className="block text-sm font-semibold text-white mb-2">Section Title</label>
              <input
                type="text"
                className="section-title w-full bg-darkbg/50 text-white border border-gray-600 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition"
                value={section.qText}
                placeholder="Enter section title"
                onChange={(e) => onSectionChange(index, 'qText', e.target.value)}
              />
            </div>
            <div className="flex-[1] min-w-[60px]">
              <label className="block text-sm font-semibold text-white mb-2">Marks</label>
              <input
                type="number"
                className="section-marks w-full bg-darkbg/50 text-white border border-gray-600 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition"
                value={section.marks}
                placeholder="0"
                min="0"
                onChange={(e) => onSectionChange(index, 'marks', e.target.value)}
              />
            </div>
          </div>

          <div className="border-t border-gray-700/40 questions-container">
            {renderQuestionBody()}
          </div>
        </div>
      </div>
    </div>
  );
}
