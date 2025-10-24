// client/src/pages/Dashboard.jsx

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import { motion } from 'framer-motion'; // <-- 1. Import motion

// Helper function to format dates
function formatDate(dateString) {
  if (!dateString) return 'N/A';
  return new Date(dateString).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

export default function Dashboard() {
  const [questions, setQuestions] = useState([]);
  const [selectedQuestion, setSelectedQuestion] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState(''); // <-- State for search

  const fetchQuestions = async () => {
    try {
      const res = await api.get('/questions?sort=nextRevisionDate');
      setQuestions(res.data);
      if (res.data.length > 0) {
        setSelectedQuestion(res.data[0]);
      }
      setError(null);
    } catch (err) {
      console.error(err);
      setError('Failed to fetch questions.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQuestions();
  }, []);

  const handleRevise = async (e, id) => {
    e.stopPropagation();
    try {
      const res = await api.post(`/questions/${id}/revise`);
      const updatedQuestions = questions.map(q => 
        q._id === id ? res.data : q
      );
      setQuestions(updatedQuestions);
      if (selectedQuestion?._id === id) {
        setSelectedQuestion(res.data);
      }
    } catch (err) {
      console.error(err);
      alert('Failed to mark as revised.');
    }
  };

  const handleDelete = async (e, id) => {
    e.stopPropagation();
    if (window.confirm('Are you sure you want to delete this question?')) {
      try {
        await api.delete(`/questions/${id}`);
        const remainingQuestions = questions.filter((q) => q._id !== id);
        setQuestions(remainingQuestions);
        if (selectedQuestion?._id === id) {
          setSelectedQuestion(remainingQuestions.length > 0 ? remainingQuestions[0] : null);
        }
      } catch (err) {
        console.error(err);
        alert('Failed to delete question.');
      }
    }
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty?.toLowerCase()) {
      case 'easy': return 'bg-tokyo-green text-[#1A1B26]';
      case 'medium': return 'bg-tokyo-orange text-[#1A1B26]';
      case 'hard': return 'bg-tokyo-red text-white';
      default: return 'bg-tokyo-text-dark/20 text-tokyo-text-dark';
    }
  };

  // Filter questions based on search term
  const filteredQuestions = questions.filter(
    (q) =>
      (q.title && q.title.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (q.topic && q.topic.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  if (loading) {
    return <div className="text-center w-full">Loading questions...</div>;
  }
  
  if (error) {
     return <div className="text-center text-tokyo-red w-full">{error}</div>;
  }

  return (
    <div className="flex h-[calc(100vh-120px)] w-full flex-col md:flex-row overflow-hidden rounded-xl border border-gray-800">
      {/* Left Pane: Question List */}
      <aside className="flex h-full w-full flex-col border-r border-[#24283B] bg-[#1A1B26] md:w-2/5 lg:w-1/3">
        <div className="flex flex-col p-6">
          <p className="text-tokyo-text tracking-light text-2xl font-bold">
            Your Questions
          </p>
          <p className="text-tokyo-text-dark text-sm mt-1">
            {filteredQuestions.length} questions found
          </p>
        </div>
        <div className="px-6 pb-4">
          <div className="relative">
            <span className="material-symbols-outlined pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-tokyo-text-dark">
              search
            </span>
            <input
              className="form-input w-full rounded-lg border-none bg-[#24283B] py-2.5 pl-10 pr-4 text-sm text-tokyo-text placeholder:text-tokyo-text-dark focus:outline-none focus:ring-2 focus:ring-tokyo-cyan"
              placeholder="Filter questions..."
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
        <nav className="flex-1 overflow-y-auto">
          <ul className="flex flex-col">
            {filteredQuestions.map((q, index) => {
              const isActive = selectedQuestion?._id === q._id;
              const isDue = new Date(q.nextRevisionDate) <= new Date();
              
              return (
                <motion.li
                  key={q._id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                >
                  <a
                    className={`group relative flex items-start gap-4 p-4 cursor-pointer border-l-2 ${
                      isActive
                        ? 'bg-tokyo-cyan/10 border-tokyo-cyan'
                        : 'border-transparent hover:bg-tokyo-cyan/10'
                    }`}
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      setSelectedQuestion(q);
                    }}
                  >
                    <span className={`material-symbols-outlined mt-0.5 ${isDue ? 'text-tokyo-orange' : 'text-tokyo-text-dark'}`}>
                      {isDue ? 'radio_button_unchecked' : 'check_circle'}
                    </span>
                    <div className="flex-grow">
                      <p className="text-tokyo-text text-base font-medium">
                        {q.title}
                      </p>
                      <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                        <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${getDifficultyColor(q.difficulty)}`}>
                          {q.difficulty || 'N/A'}
                        </span>
                        <span className="text-xs font-medium text-tokyo-text-dark bg-tokyo-text-dark/20 px-2 py-0.5 rounded-full">
                          {q.topic || 'General'}
                        </span>
                      </div>
                    </div>
                    <div className="absolute right-2 top-1/2 -translate-y-1/2 hidden group-hover:flex items-center gap-1 bg-[#24283B] p-1 rounded-md">
                      <button onClick={(e) => handleRevise(e, q._id)} className="p-1.5 rounded-md hover:bg-white/10" title="Mark as revised">
                        <span className="material-symbols-outlined text-tokyo-green text-lg leading-none">task_alt</span>
                      </button>
                      <button onClick={(e) => handleDelete(e, q._id)} className="p-1.5 rounded-md hover:bg-white/10" title="Delete question">
                        <span className="material-symbols-outlined text-tokyo-red text-lg leading-none">delete</span>
                      </button>
                    </div>
                  </a>
                </motion.li>
              );
            })}
          </ul>
        </nav>
      </aside>

      {/* Right Pane: Detailed View */}
      <main className="h-full flex-1 bg-[#24283B] overflow-y-auto">
        {selectedQuestion ? (
          <motion.div
            key={selectedQuestion._id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-8 lg:p-12"
          >
            <header className="flex flex-col gap-4">
              <div className="flex items-center justify-between gap-3">
                <h1 className="text-3xl font-bold text-white">{selectedQuestion.title}</h1>
                <Link
                  to={`/edit/${selectedQuestion._id}`}
                  className="flex items-center gap-2 rounded-lg bg-tokyo-text-dark/20 px-4 py-2 text-sm font-semibold text-tokyo-text hover:bg-tokyo-text-dark/40 transition-colors"
                >
                  <span className="material-symbols-outlined text-lg">edit</span>
                  Edit
                </Link>
              </div>
              <div className="flex items-center gap-3 flex-wrap">
                <span className={`text-sm font-semibold px-2.5 py-1 rounded-full ${getDifficultyColor(selectedQuestion.difficulty)}`}>
                  {selectedQuestion.difficulty || 'N/A'}
                </span>
                <span className="text-sm font-medium text-tokyo-text bg-tokyo-text-dark/30 px-2.5 py-1 rounded-full">
                  {selectedQuestion.topic || 'General'}
                </span>
                <span className="text-sm font-medium text-tokyo-text-dark">
                  from {selectedQuestion.platform || 'N/A'}
                </span>
              </div>
              <div className="flex items-center gap-6 flex-wrap mt-2">
                 <p className="text-sm text-tokyo-text-dark">Solved: <span className="text-tokyo-text">{formatDate(selectedQuestion.dateSolved)}</span></p>
                 <p className="text-sm text-tokyo-text-dark">Revisions: <span className="text-tokyo-text">{selectedQuestion.revisionCount}</span></p>
                 <p className="text-sm text-tokyo-text-dark">Next Due: <span className="text-tokyo-text">{formatDate(selectedQuestion.nextRevisionDate)}</span></p>
              </div>
            </header>
            <hr className="border-tokyo-text-dark/50 my-8" />
            <article className="prose prose-invert max-w-none prose-p:text-tokyo-text prose-strong:text-white prose-code:text-tokyo-orange prose-code:bg-tokyo-bg prose-code:p-1 prose-code:rounded-md prose-pre:bg-tokyo-bg prose-pre:p-4 prose-pre:rounded-lg">
              <h3 className="text-white">Notes</h3>
              {selectedQuestion.notes ? (
                <p className="font-mono whitespace-pre-wrap">{selectedQuestion.notes}</p>
              ) : (
                <p className="text-tokyo-text-dark">No notes added for this question.</p>
              )}
            </article>
          </motion.div>
        ) : (
          <div className="p-8 lg:p-12 flex items-center justify-center h-full">
            <p className="text-tokyo-text-dark">
              {filteredQuestions.length === 0 ? "No questions match your filter." : "Select a question from the list to view details."}
            </p>
          </div>
        )}
      </main>
    </div>
  );
}