import { useMemo, useState, useEffect } from 'react';
import QuestionPaperCard from './components/QuestionPaperCard.jsx';
import { apiGet } from '../../../api/api.js';
import { NoPaperStatus, LoadingSkeleton } from './components/PageStatus.jsx';
import { ErrorState } from '../../utils/GlobalPageStatus.jsx';
import CreatePaperModal from './modal/CreatePaperModal.jsx';
import Header from './components/Header.jsx';
import usePermission from '../../../hooks/usePermission.js';

const sortOptions = [
  { value: 'newest', label: 'Newest First' },
  { value: 'oldest', label: 'Oldest First' },
  { value: 'event', label: 'Event (A-Z)' },
  { value: 'event_desc', label: 'Event (Z-A)' },
  { value: 'subject', label: 'Subject (A-Z)' },
  { value: 'subject_desc', label: 'Subject (Z-A)' }
];

const defaultFilters = {
  search: '',
  sort: 'newest',
  tab: 'my'
};

export default function Dashboard() {

  const {hasPermission, PERMISSIONS} = usePermission()

  const [myPapers, setMyPapers] = useState([]);
  const [staffPaper, setStaffPaper] = useState([]);

  const [isPaperLoading, setPaperLoading] = useState(false);
  const [paperError, setPaperError] = useState("");


  const [filters, setFilters] = useState(defaultFilters);
  const [menuOpenId, setMenuOpenId] = useState(null);
  const [isCreateModalOpen, setCreateModalOpen] = useState(false);


  useEffect(() => {
    const fetchPapers = async () => {
      setPaperLoading(true);
      setPaperError("");
      try {
        const response = await apiGet("/api/question-papers-list")

        if (!response.ok) {
          throw new Error("Failed to fetch papers.");
        }

        const data = await response.json();

        setMyPapers(data.user_papers ?? []);
        setStaffPaper(data.session_papers ?? []);
      } catch (err) {
        console.error(err);
        setPaperError(err.message);
      } finally {
        setPaperLoading(false);
      }
    };

    fetchPapers();
  }, []);

  const visiblePapers = useMemo(() => {

    // In source it will select the papers which user have selected (my paper or staff paper)
    const source = filters.tab === "my" ? myPapers : staffPaper;
    const search = filters.search.trim().toLowerCase();

    const filteredPapers = source.filter((paper) => {
      if (!search) return true;

      return [
        paper.event,
        paper.subject,
        paper.class_name,
        paper.teacher_name,
      ].some(value =>
        value?.toLowerCase().includes(search)
      );
    });

    filteredPapers.sort((a, b) => {
      switch (filters.sort) {
        case "oldest":
          return new Date(a.created_at) - new Date(b.created_at);

        case "event":
          return a.event.localeCompare(b.event);

        case "event_desc":
          return b.event.localeCompare(a.event);

        case "subject":
          return a.subject.localeCompare(b.subject);

        case "subject_desc":
          return b.subject.localeCompare(a.subject);

        default:
          return new Date(b.created_at) - new Date(a.created_at);
      }
    });

    return filteredPapers;
  }, [filters, myPapers, staffPaper]);


  const removePaperFromState = (paperId) => {
    setMyPapers(prev => prev.filter(paper => paper.id !== paperId));
    setStaffPaper(prev => prev.filter(paper => paper.id !== paperId));
  };

  const myPapersCount = myPapers.length;
  const staffPapersCount = staffPaper.length;


  let mainContent;
  if (isPaperLoading) { mainContent = <LoadingSkeleton /> }
  else if (paperError) { mainContent = <ErrorState message={paperError} /> }
  else if (visiblePapers.length === 0) { mainContent = <NoPaperStatus setCreateModalOpen={setCreateModalOpen} /> }
  else {
    mainContent = (
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 p-10">
        {visiblePapers.map((paper) => (
          <QuestionPaperCard
            key={paper.id}
            paper={paper}
            isMyPaper={filters.tab === "my"}

            removePaperFromState={removePaperFromState}

            menuOpenId={menuOpenId}
            setMenuOpenId={setMenuOpenId}
          />
        ))}
      </div>
    )
  }

  return (
    <>
      <Header setCreateModalOpen={setCreateModalOpen} />

      <div className="mb-8">
        <div className="bg-navbg/50 backdrop-blur-sm border border-gray-700 rounded-2xl p-4">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1 relative">
              <i className="fas fa-search absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                value={filters.search}
                onChange={(e) => setFilters((prev) => ({ ...prev, search: e.target.value }))}
                type="text"
                placeholder="Search by event, subject, class, or teacher..."
                className="w-full pl-12 pr-4 py-3 bg-darkbg/50 border border-gray-600 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
              />
            </div>
            <div className="w-full lg:w-56">
              <select
                value={filters.sort}
                onChange={(e) => setFilters((prev) => ({ ...prev, sort: e.target.value }))}
                className="w-full px-4 py-3 bg-darkbg/50 border border-gray-600 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
              >
                {sortOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-center">
        <div className="inline-flex p-1 bg-navbg/50 backdrop-blur-sm border border-gray-700 rounded-full">
          <button
            type="button"
            onClick={() => setFilters((prev) => ({ ...prev, tab: 'my' }))}
            className={`tab-btn px-6 py-2.5 text-sm font-medium rounded-full transition-all duration-200 flex items-center gap-2 ${filters.tab === 'my' ? 'bg-gradient-to-r from-primary to-secondary text-white shadow-lg' : 'text-gray-400 hover:text-white'}`}
          >
            <i className="fas fa-user" />
            My Papers
            <span className="text-xs bg-gray-700 px-2 py-0.5 rounded-full">{myPapersCount}</span>
          </button>

          {hasPermission(PERMISSIONS.VIEW_ALL_PAPERS) && (
            <button
              type="button"
              onClick={() => setFilters((prev) => ({ ...prev, tab: 'staff' }))}
              className={`tab-btn px-6 py-2.5 text-sm font-medium rounded-full transition-all duration-200 flex items-center gap-2 
                ${filters.tab === 'staff' ? 'bg-gradient-to-r from-primary to-secondary text-white shadow-lg' : 'text-gray-400 hover:text-white'}`}>
              
              <i className="fas fa-users" />

              Staff Papers
              <span className="text-xs bg-gray-700 px-2 py-0.5 rounded-full">{staffPapersCount}</span>
            </button>
          )}
        </div>
      </div>


      {mainContent}


      {isCreateModalOpen && (<CreatePaperModal setCreateModalOpen={setCreateModalOpen} />)}

    </>
  );
}
