// client/src/pages/AddQuestion.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { motion } from 'framer-motion';

export default function AddQuestion() {
  const [url, setUrl] = useState('');
  const [formData, setFormData] = useState({
    title: '',
    platform: '',
    difficulty: '', // Default to empty string
    topic: '',
    timeTakenMinutes: '',
    notes: '',
  });
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // URL Parser Effect - only auto-fill if title is empty
    if (url.includes('leetcode.com/problems/') && !formData.title) {
      try {
        const slug = url.split('/problems/')[1].split('/')[0];
        const title = slug.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
        setFormData(prev => ({ ...prev, title, platform: 'LeetCode', url })); // Include URL here
      } catch (err) { console.warn('Could not parse URL', err); }
    }
  }, [url]);

  // Simplified handleChange
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevFormData => ({
      ...prevFormData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    if (!formData.difficulty) {
       setError("Please select a difficulty.");
       return;
    }
    try {
      await api.post('/questions', { ...formData, url }); // Include URL in the submitted data
      navigate('/');
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'Failed to add question.');
    }
  };

  // Reusable Input Component (except for Topic)
  const FormInput = ({ label, name, ...props }) => (
    <label className="flex flex-col">
      <p className="font-mono text-sm font-medium leading-normal pb-2 text-slate-400">{label}</p>
      <input
        className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-md text-white border-slate-700 bg-slate-800/50 h-12 placeholder:text-slate-400/70 px-4 text-base font-normal leading-normal transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-neon-green/50 focus:border-neon-green"
        name={name}
        value={formData[name]} // Ensure this uses formData state
        onChange={handleChange}
        {...props}
      />
    </label>
  );

  return (
    <div className="flex w-full max-w-4xl flex-col">
      <div className="mb-8 flex items-center gap-4">
         <span className="text-neon-green text-3xl font-mono relative -top-1">{'{'}</span>
         <div className="flex-grow">
           <h1 className="font-mono text-2xl md:text-3xl font-bold leading-tight text-white">
             <span className="text-neon-green">&gt;</span> Add New Problem
           </h1>
           <p className="text-slate-400 mt-2">Initialize a new entry in your revision database.</p>
         </div>
         <span className="text-neon-green text-3xl font-mono relative -top-1">{'}'}</span>
       </div>
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="rounded-lg border border-slate-700 bg-slate-950/50 p-6 sm:p-8 shadow-2xl shadow-black/50 backdrop-blur-sm"
      >
        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          <label className="flex flex-col">
            <p className="font-mono text-sm font-medium leading-normal pb-2 text-slate-400">
              LeetCode URL <span className="text-slate-500">(Optional - Auto-fills Title/Platform)</span>
            </p>
            <input
              className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-md text-white border-slate-700 bg-slate-800/50 h-12 placeholder:text-slate-400/70 px-4 text-base font-normal leading-normal transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-neon-green/50 focus:border-neon-green"
              placeholder="Paste URL..."
              type="text"
              value={url}
              onChange={(e) => setUrl(e.target.value)} // Controlled by separate 'url' state
            />
          </label>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormInput label="Title" name="title" placeholder="e.g., Two Sum" type="text" required />
            {/* --- Direct Input for Topic --- */}
            <label className="flex flex-col">
               <p className="font-mono text-sm font-medium leading-normal pb-2 text-slate-400">Topic</p>
               <input
                 className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-md text-white border-slate-700 bg-slate-800/50 h-12 placeholder:text-slate-400/70 px-4 text-base font-normal leading-normal transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-neon-green/50 focus:border-neon-green"
                 name="topic"
                 value={formData.topic}
                 onChange={handleChange}
                 placeholder="e.g., Arrays, Hash Table"
                 type="text"
               />
             </label>
             {/* --- End Direct Input --- */}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <label className="flex flex-col">
              <p className="font-mono text-sm font-medium leading-normal pb-2 text-slate-400">Difficulty</p>
              <select
                className="form-select appearance-none flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-md text-white border-slate-700 bg-slate-800/50 h-12 bg-[url('data:image/svg+xml,%3csvg%20xmlns=%27http://www.w3.org/2000/svg%27%20fill=%27none%27%20viewBox=%270%200%2020%2020%27%3e%3cpath%20stroke=%27%2394A3B8%27%20stroke-linecap=%27round%27%20stroke-linejoin=%27round%27%20stroke-width=%271.5%27%20d=%27m6%208%204%204%204-4%27/%3e%3c/svg%3e')] bg-right-2.5 bg-no-repeat px-4 text-base font-normal leading-normal transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-neon-green/50 focus:border-neon-green"
                name="difficulty"
                value={formData.difficulty} // Controlled by formData state
                onChange={handleChange}
                required
               >
                <option className="bg-slate-950 text-slate-400" value="" disabled>Select Difficulty</option>
                <option className="bg-slate-950 text-white" value="Easy">Easy</option>
                <option className="bg-slate-950 text-white" value="Medium">Medium</option>
                <option className="bg-slate-950 text-white" value="Hard">Hard</option>
              </select>
            </label>
            <FormInput label="Platform" name="platform" placeholder="e.g., LeetCode" type="text" />
          </div>

           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
             <FormInput label="Time Taken (minutes)" name="timeTakenMinutes" type="number" />
             <label className="flex flex-col md:col-span-2">
               <p className="font-mono text-sm font-medium leading-normal pb-2 text-slate-400">Notes</p>
               <textarea
                 className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-md text-white border-slate-700 bg-slate-800/50 min-h-[120px] placeholder:text-slate-400/70 px-4 py-3 text-base font-normal leading-normal transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-neon-green/50 focus:border-neon-green font-mono"
                 name="notes"
                 value={formData.notes} // Controlled by formData state
                 onChange={handleChange}
                 placeholder="// Add observations, complexities, alternative approaches..."
               />
             </label>
           </div>

           {error && <p className="text-center text-sm text-red-400">{error}</p>}

          <div className="mt-4 flex flex-col-reverse sm:flex-row items-center justify-end gap-3 pt-4 border-t border-slate-700">
            <button
              className="w-full sm:w-auto flex items-center justify-center rounded-md px-6 py-2.5 text-sm font-semibold text-slate-400 hover:bg-slate-800/60 hover:text-white transition-colors"
              type="button"
              onClick={() => navigate(-1)}
            >
              Cancel
            </button>
             <motion.button
               whileHover={{ scale: 1.03 }}
               whileTap={{ scale: 0.98 }}
               className="group relative w-full sm:w-auto flex items-center justify-center rounded-md bg-gradient-to-r from-slate-700 to-slate-800 px-6 py-2.5 text-sm font-semibold text-white shadow-lg transition-all duration-300 hover:from-slate-600 hover:to-slate-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neon-green"
               type="submit"
             >
               <span className="absolute -inset-0.5 rounded-md bg-gradient-to-r from-neon-green to-sky-400 opacity-0 transition-opacity duration-300 group-hover:opacity-100 blur"></span>
               <span className="relative">Submit</span>
             </motion.button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}