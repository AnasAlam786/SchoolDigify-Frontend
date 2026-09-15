import SchoolDataSection from './schoolDetails/SchoolDataSection.jsx';
import SubjectSetup from './subjectSetup/SubjectSetup.jsx';
import ExamSetup from './examSetup/ExamSetup.jsx';

function SchoolSetup() {
    return (
        <>
            <SchoolDataSection />
            <SubjectSetup />
            <ExamSetup />
        </>
    )
}

export default SchoolSetup;