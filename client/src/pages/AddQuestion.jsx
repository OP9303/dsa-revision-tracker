// client/src/pages/AddQuestion.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { motion } from 'framer-motion';

// --- FormInput Component (Moved Outside) ---
// This component is now defined once and will not be re-created on every render.
const FormInput = ({ label, name, value, onChange, ...props }) => (
  <label className="flex flex-col">
    <p className="font-mono text-sm font-medium leading-normal pb-2 text-slate-400">{label}</p>
    <input
      className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-md text-white border-slate-700 bg-slate-800/50 h-12 placeholder:text-slate-400/70 px-4 text-base font-normal leading-normal transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-neon-green/50 focus:border-neon-green"
      name={name}
      value={value}
      onChange={onChange}
      {...props}
    />
  </label>
);
// --- End FormInput Component ---


export default function AddQuestion() {
  const [url, setUrl] = useState('');
  const [formData, setFormData] = useState({
    title: '',
    platform: '',
    difficulty: '',
    topic: '',
    timeTakenMinutes: '',
    notes: '',
  });
  const [error, setError] = useState(null);
  const [lastParsedUrl, setLastParsedUrl] = useState('');
  const navigate = useNavigate();

  // URL Parser Effect - Auto-fills only when URL changes
  useEffect(() => {
    if (url.includes('leetcode.com/problems/') && url !== lastParsedUrl) {
      try {
        const slug = url.split('/problems/')[1].split('/')[0];
        if (slug && /^[a-z0-9-]+$/.test(slug)) {
          const title = slug.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');

          setFormData(prev => ({
            ...prev,
            title: title,
            platform: 'LeetCode'
          }));
          setLastParsedUrl(url);
        }
      } catch (err) {
        console.warn('Could not parse URL', err);
      }
    }
  }, [url, lastParsedUrl]);

  // Standard handler for all form inputs
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevFormData => ({
      ...prevFormData,
      [name]: value,
    }));
  };

  // NO applyUrlSuggestions function needed

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    if (!formData.difficulty) {
      setError("Please select a difficulty.");
      return;
    }
    try {
      await api.post('/questions', { ...formData, url });
      navigate('/');
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'Failed to add question.');
    }
  };

  return (
    <div className="flex w-full max-w-4xl flex-col">
      <div className="mb-8 flex items-center gap-4"> {/* ... Header ... */} </div>

      <motion.div
        initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}
        className="rounded-lg border border-slate-700 bg-slate-950/50 p-6 sm:p-8 shadow-2xl shadow-black/50 backdrop-blur-sm"
      >
        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          {/* --- URL Input Section --- */}
          <div className="flex flex-col gap-2">
            <label className="flex flex-col">
              <p className="font-mono text-sm font-medium leading-normal pb-2 text-slate-400">
                LeetCode URL <span className="text-slate-500">(Optional - Auto-fills Title/Platform)</span>
              </p>
              <input
                className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-md text-white border-slate-700 bg-slate-800/50 h-12 placeholder:text-slate-400/70 px-4 text-base font-normal leading-normal transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-neon-green/50 focus:border-neon-green"
                placeholder="Paste URL..." type="text" value={url}
                onChange={(e) => setUrl(e.target.value)}
              />
            </label>

            {/* The "Apply" button is GONE */}

          </div>
          {/* --- End URL Input Section --- */}


          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormInput
              label="Title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="e.g., Two Sum"
              type="text"
              required
            />
            <FormInput
              label="Topic"
              name="topic"
              value={formData.topic}
              onChange={handleChange}
              placeholder="e.g., Arrays, Hash Table"
              type="text"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <label className="flex flex-col">
              <p className="font-mono text-sm font-medium leading-normal pb-2 text-slate-400">Difficulty</p>
              <select
                className="form-select appearance-none flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-md text-white border-slate-700 bg-slate-800/50 h-12 bg-[url('...')] bg-right-2.5 bg-no-repeat px-4 text-base font-normal leading-normal transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-neon-green/50 focus:border-neon-green"
                name="difficulty" value={formData.difficulty} onChange={handleChange} required
              >
                <option className="bg-slate-950 text-slate-400" value="" disabled>Select Difficulty</option>
                <option className="bg-slate-950 text-white" value="Easy">Easy</option>
                <option className="bg-slate-950 text-white" value="Medium">Medium</option>
                <option className="bg-slate-950 text-white" value="Hard">Hard</option>
              </select>
            </label>
            <FormInput
              label="Platform"
              name="platform"
              value={formData.platform}
              onChange={handleChange}
              placeholder="e.g., LeetCode"
              type="text"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormInput
              label="Time Taken (minutes)"
              name="timeTakenMinutes"
              value={formData.timeTakenMinutes}
              onChange={handleChange}
              type="number"
              min="0"
            />
            <label className="flex flex-col md:col-span-2">
              <p className="font-mono text-sm font-medium leading-normal pb-2 text-slate-400">Notes</p>
              <textarea
                className="form-textarea flex w-full min-w-0 flex-1 resize-y overflow-hidden rounded-md text-white border-slate-700 bg-slate-800/50 min-h-[120px] placeholder:text-slate-400/70 p-4 text-base font-normal leading-normal transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-neon-green/50 focus:border-neon-green"
                name="notes"
                value={formData.notes}
                onChange={handleChange}
                placeholder="Your thoughts, approach, or solution..."
              />
            </label>
          </div>

          {error && <p className="text-center text-sm text-red-400">{error}</p>}

          <div className="mt-4 flex flex-col-reverse sm:flex-row items-center justify-end gap-3 pt-4 border-t border-slate-700">
            <button
              type="button"
              onClick={() => navigate('/')}
              className="h-11 w-full sm:w-auto px-6 rounded-md bg-slate-700 text-white font-medium text-sm hover:bg-slate-600 transition-colors duration-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="h-11 w-full sm:w-auto px-6 rounded-md bg-neon-green text-slate-950 font-medium text-sm hover:bg-opacity-90 transition-colors duration-200"
            >
              Add Question
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}