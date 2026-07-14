export const QUESTION_TYPE_LABELS = {
  mcq: 'Multiple Choice Questions',
  fillUp: 'Fill In The Blanks',
  match: 'Match the Following',
  QnA: 'Question & Answers',
  TF: 'True or False',
  singleWord: 'Single Word/Term',
};

export function generateQuestionId() {
  return `q_${Date.now()}_${Math.random().toString(36).slice(2, 11)}`;
}

export function getDefaultItems(type) {
  switch (type) {
    case 'mcq':
      return [{ text: '', options: ['', '', '', ''] }];
    case 'match':
      return [{ left: '', right: '' }];
    default:
      return [''];
  }
}

export function createDefaultSection(type = 'mcq', overrides = {}) {
  return {
    id: generateQuestionId(),
    type,
    qText: QUESTION_TYPE_LABELS[type] || 'Question Section',
    marks: '',
    items: getDefaultItems(type),
    ...overrides,
  };
}

export function normalizeSection(section) {
  const type = section?.type || 'mcq';
  const subQuestion = section?.subQuestion || [];
  const options = section?.options || [];

  switch (type) {
    case 'mcq':
      return {
        ...createDefaultSection(type, {
          id: section?.id || generateQuestionId(),
          qText: section?.qText || QUESTION_TYPE_LABELS[type],
          marks: section?.marks || '',
          items: (subQuestion || []).map((item) => ({
            text: item?.text || '',
            options: item?.options || ['', '', '', ''],
          })),
        }),
      };
    case 'match':
      return {
        ...createDefaultSection(type, {
          id: section?.id || generateQuestionId(),
          qText: section?.qText || QUESTION_TYPE_LABELS[type],
          marks: section?.marks || '',
          items: (subQuestion || []).map((left, index) => ({
            left: left || '',
            right: options[index] || '',
          })),
        }),
      };
    default:
      return {
        ...createDefaultSection(type, {
          id: section?.id || generateQuestionId(),
          qText: section?.qText || QUESTION_TYPE_LABELS[type],
          marks: section?.marks || '',
          items: (subQuestion || []).map((item) => item || ''),
        }),
      };
  }
}

export function serializeSections(sections) {
  return sections.map((section) => {
    let subQuestion = [];
    let options = [];

    switch (section.type) {
      case 'mcq':
        subQuestion = section.items.map((item) => ({
          text: item?.text || '',
          options: item?.options || ['', '', '', ''],
        }));
        break;
      case 'match':
        subQuestion = section.items.map((item) => item?.left || '');
        options = section.items.map((item) => item?.right || '');
        break;
      default:
        subQuestion = section.items.map((item) => item || '');
    }

    return {
      type: section.type,
      qText: section.qText || '',
      marks: section.marks || '',
      subQuestion,
      ...(section.type === 'match' && { options }),
    };
  });
}

export function buildPaperPayload(meta, sections) {
  return {
    event: meta.event,
    subject: meta.subject,
    class_name: meta.std,
    marks: meta.MM,
    duration: meta.hrs,
    questions: serializeSections(sections),
  };
}
