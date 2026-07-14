import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import EditorHeader from './components/EditorHeader.jsx';
import PaperInfoCard from './components/PaperInfoCard.jsx';
import QuestionSection from './components/QuestionSection.jsx';
import QuestionTypeModal from './components/QuestionTypeModal.jsx';
import { buildPaperPayload, createDefaultSection, normalizeSection, QUESTION_TYPE_LABELS } from './utils/questionEditorUtils.js';
import { apiGet, apiPost } from '../../../api/api.js';

const initialMeta = {
    event: '',
    subject: '',
    std: '',
    hrs: '',
    MM: '',
};

export default function Editor() {
    const { paperId } = useParams();
    const navigate = useNavigate();
    const [meta, setMeta] = useState(initialMeta);
    const [sections, setSections] = useState([]);
    const [fontSize, setFontSize] = useState(20);
    const [loading, setLoading] = useState(true);
    const [showTypeModal, setShowTypeModal] = useState(false);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        const loadPaper = async () => {
            setLoading(true);
            try {
                const response = await apiGet(`/api/paper-data/${paperId}`);
                const data = await response.json();

                if (data?.paper_data?.meta) {
                    setMeta({
                        event: data.paper_data.meta.event || '',
                        subject: data.paper_data.meta.subject || '',
                        std: data.paper_data.meta.std || '',
                        hrs: data.paper_data.meta.hrs || '',
                        MM: data.paper_data.meta.MM || '',
                    });
                    setFontSize(data.paper_data.meta.fontSize || 20);
                }

                if (data?.paper_data?.questions?.length) {
                    setSections(data.paper_data.questions.map((section) => normalizeSection(section)));
                } else {
                    setSections([createDefaultSection('mcq')]);
                }
            } catch (error) {
                console.error('Error loading paper:', error);
            } finally {
                setLoading(false);
            }
        };

        loadPaper();
    }, [paperId]);

    const totals = useMemo(() => ({
        totalSections: sections.length,
        totalQuestions: sections.reduce((sum, section) => sum + (section.items?.length || 0), 0),
    }), [sections]);

    const updateMeta = (key, value) => {
        setMeta((prev) => ({ ...prev, [key]: value }));
    };

    const updateSection = (index, key, value) => {
        setSections((prev) => prev.map((section, sectionIndex) => sectionIndex === index ? { ...section, [key]: value } : section));
    };

    const updateQuestion = (sectionIndex, questionIndex, field, value) => {
        setSections((prev) => prev.map((section, index) => {
            if (index !== sectionIndex) return section;
            const nextItems = [...section.items];
            if (section.type === 'mcq') {
                if (field === 'text') {
                    nextItems[questionIndex] = { ...nextItems[questionIndex], text: value };
                } else {
                    nextItems[questionIndex] = {
                        ...nextItems[questionIndex],
                        options: nextItems[questionIndex].options.map((option, optionIndex) => optionIndex === field ? value : option),
                    };
                }
            } else if (section.type === 'match') {
                nextItems[questionIndex] = { ...nextItems[questionIndex], [field]: value };
            } else {
                nextItems[questionIndex] = value;
            }
            return { ...section, items: nextItems };
        }));
    };

    const updateQuestionOption = (sectionIndex, questionIndex, optionIndex, value) => {
        setSections((prev) => prev.map((section, index) => {
            if (index !== sectionIndex) return section;
            const nextItems = [...section.items];
            nextItems[questionIndex] = {
                ...nextItems[questionIndex],
                options: nextItems[questionIndex].options.map((option, currentOptionIndex) => currentOptionIndex === optionIndex ? value : option),
            };
            return { ...section, items: nextItems };
        }));
    };

    const addSection = (type = 'mcq') => {
        setSections((prev) => [...prev, createDefaultSection(type)]);
        setShowTypeModal(false);
    };

    const addSectionAfter = (index) => {
        setSections((prev) => {
            const next = [...prev];
            next.splice(index + 1, 0, createDefaultSection('mcq'));
            return next;
        });
    };

    const removeSection = (index) => {
        if (sections.length <= 1) {
            return;
        }
        setSections((prev) => prev.filter((_, sectionIndex) => sectionIndex !== index));
    };

    const moveSection = (index, direction) => {
        if ((direction === 'up' && index === 0) || (direction === 'down' && index === sections.length - 1)) {
            return;
        }
        setSections((prev) => {
            const next = [...prev];
            const [item] = next.splice(index, 1);
            next.splice(direction === 'up' ? index - 1 : index + 1, 0, item);
            return next;
        });
    };

    const changeSectionType = (index, nextType) => {
        setSections((prev) => prev.map((section, sectionIndex) => {
            if (sectionIndex !== index) return section;
            return {
                ...section,
                type: nextType,
                qText: QUESTION_TYPE_LABELS[nextType] || 'Question Section',
                items: section.items?.length ? section.items : createDefaultSection(nextType).items,
            };
        }));
    };

    const addQuestion = (sectionIndex) => {
        setSections((prev) => prev.map((section, index) => {
            if (index !== sectionIndex) return section;
            const nextItem = section.type === 'mcq' ? { text: '', options: ['', '', '', ''] } : section.type === 'match' ? { left: '', right: '' } : '';
            return { ...section, items: [...section.items, nextItem] };
        }));
    };

    const removeQuestion = (sectionIndex, questionIndex) => {
        setSections((prev) => prev.map((section, index) => {
            if (index !== sectionIndex) return section;
            if ((section.items?.length || 0) <= 1) return section;
            return { ...section, items: section.items.filter((_, itemIndex) => itemIndex !== questionIndex) };
        }));
    };

    const handleSave = async () => {
        setSaving(true);
        try {
            const response = await apiPost(`/api/update-paper/${paperId}/`, buildPaperPayload(meta, sections));

            const data = await response.json();
            if (!data.success) {
                throw new Error(data.error || 'Unknown error');
            }
            showAlert(200, "Paper Saved Successfully!")
        } catch (error) {
            showAlert(400, error)
            console.error('Save failed:', error);
        } finally {
            setSaving(false);
        }
    };

    const handlePdf = async () => {
        try {
            const response = await apiPost('/api/question_paper_PDF',
                {
                    questions: buildPaperPayload(meta, sections).questions,
                    eventName: meta.event,
                    subject: meta.subject,
                    std: meta.std,
                    hrs: meta.hrs,
                    MM: meta.MM,
                    fontSize,
                }
            );

            const data = await response.json();
            const html = data.html;
            const newWindow = window.open('', '_blank');
            newWindow.document.write(html);
            newWindow.document.close();
        } catch (error) {
            console.error('PDF generation failed:', error);
        }
    };

    return (
        <div className="min-h-screen">
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-20 left-10 w-64 h-64 bg-primary/10 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse" />
                <div className="absolute bottom-20 right-10 w-64 h-64 bg-secondary/10 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse animation-delay-2000" />
            </div>

            <div className="max-w-6xl mx-auto sm:px-6 mb-6">
                <EditorHeader onAddSection={() => setShowTypeModal(true)} />

                <div className="space-y-8">
                    <PaperInfoCard meta={meta} onMetaChange={updateMeta} totals={totals} />

                    <div className="border-t border-gray-500/40 pt-8">
                        <div className="space-y-6">
                            {loading ? (
                                <div className="text-center text-gray-400 py-8">Loading paper...</div>
                            ) : (
                                sections.map((section, index) => (
                                    <QuestionSection
                                        key={section.id}
                                        section={section}
                                        index={index}
                                        onSectionChange={updateSection}
                                        onQuestionChange={updateQuestion}
                                        onQuestionOptionChange={updateQuestionOption}
                                        onAddQuestion={addQuestion}
                                        onRemoveQuestion={removeQuestion}
                                        onRemoveSection={removeSection}
                                        onMoveSectionUp={() => moveSection(index, 'up')}
                                        onMoveSectionDown={() => moveSection(index, 'down')}
                                        onAddSectionAfter={addSectionAfter}
                                        onSectionTypeChange={changeSectionType}
                                    />
                                ))
                            )}
                        </div>
                    </div>

                    <div className="border-t border-gray-400/40 pt-8">
                        <div className="mb-6">
                            <div className="flex justify-between items-center mb-2">
                                <label className="text-sm font-semibold text-white">Font Size</label>
                                <span className="bg-primary/20 text-primary font-bold px-3 py-1 rounded-lg text-sm">{fontSize}px</span>
                            </div>
                            <input
                                type="range"
                                min="10"
                                max="30"
                                step="1"
                                value={fontSize}
                                className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
                                onChange={(e) => setFontSize(Number(e.target.value))}
                            />
                        </div>

                        <div className="flex flex-col sm:flex-row gap-4">
                            <button
                                type="button"
                                onClick={handlePdf}
                                className="group relative overflow-hidden bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 flex-1 flex items-center justify-center gap-2"
                            >
                                <div className="absolute inset-0 bg-white/10 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
                                <i className="fas fa-file-pdf" />
                                Generate PDF
                            </button>
                            <button
                                type="button"
                                onClick={handleSave}
                                className="group relative overflow-hidden bg-gradient-to-r from-success to-emerald-600 hover:from-success/90 hover:to-emerald-500 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 flex-1 flex items-center justify-center gap-2"
                            >
                                <div className="absolute inset-0 bg-white/10 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
                                <i className={`fas ${saving ? 'fa-spinner fa-spin' : 'fa-save'}`} />
                                {saving ? 'Saving...' : 'Save Paper'}
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {showTypeModal && <QuestionTypeModal onClose={() => setShowTypeModal(false)} onSelectType={addSection} />}
        </div>
    );
}
