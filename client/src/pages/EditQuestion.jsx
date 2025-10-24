// client/src/pages/EditQuestion.jsx

import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../services/api';
import { motion } from 'framer-motion';

export default function EditQuestion() {
  const [formData, setFormData] = useState({
    title: '',
    platform: '',
    difficulty: 'Medium',
    topic: '',
    timeTakenMinutes: '',
    notes: '',
    url: '',
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    const fetchQuestionData = async () => {
      try {
        const res = await api.get(`/questions/${id}`);
        setFormData({
          title: res.data.title || '',
          platform: res.data.platform || '',
          difficulty: res.data.difficulty || 'Medium',
          topic: res.data.topic || '',
          timeTakenMinutes: res.data.timeTakenMinutes || '',
          notes: res.data.notes || '',
          url: res.data.url || '',
        });
        setLoading(false);
      } catch (err) {
        console.error(err);
        setError('Failed to load question data.');
        setLoading(false);
      }
    };

    fetchQuestionData();
  }, [id]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      await api.patch(`/questions/${id}`, formData);
      navigate('/');
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'Failed to save changes.');
    }
  };

  const FormInput = ({ label, name, value, ...props }) => (
    <label className="flex flex-col">
      <p className="text-white text-base font-medium leading-normal pb-2">{label}</p>
      <input
        className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary/80 border border-[#3b4754] bg-[#101922] focus:border-primary h-12 placeholder:text-gray-500 px-4 text-base font-normal leading-normal"
        name={name}
        value={value}
        onChange={handleChange}
        {...props}
      />
    </label>
  );

  if (loading) {
    return <div className="text-center w-full">Loading question...</div>;
  }
  
  if (error) {
     return <div className="text-center text-tokyo-red w-full">{error}</div>;
  }

  return (
    <div className="flex w-full max-w-4xl flex-col">
      <div className="mb-8">
        <h1 className="text-white text-4xl font-bold leading-tight tracking-[-0.033em]">
          Edit Question
        </h1>
        <p className="text-gray-400 mt-2">
          Make your changes and click "Save" to update the problem.
        </p>
      </div>
      <div className="rounded-xl border border-gray-800 bg-[#1c2127]/50 p-6 sm:p-8">
        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          <FormInput label="LeetCode URL (Optional)" name="url" value={formData.url} placeholder="e.g., https://leetcode.com/problems/..." type="text" />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormInput label="Question Title" name="title" value={formData.title} placeholder="e.g., Two Sum" type="text" required />
            <FormInput label="Topic / Tags" name="topic" value={formData.topic} placeholder="e.g., Arrays, Hash Table" type="text" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <label className="flex flex-col">
              <p className="text-white text-base font-medium leading-normal pb-2">Difficulty</p>
              <select
                className="form-select appearance-none flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary/80 border border-[#3b4754] bg-[#101922] focus:border-primary h-12 bg-[url('data:image/svg+xml,%3csvg%20xmlns=%27http://www.w3.org/2000/svg%27%20fill=%27none%27%20viewBox=%270%200%2020%2020%27%3e%3cpath%20stroke=%27%236b7280%27%20stroke-linecap=%27round%27%20stroke-linejoin=%27round%27%20stroke-width=%271.5%27%20d=%27m6%208%204%204%204-4%27/%3e%3c/svg%3e')] bg-right-2.5 bg-no-repeat px-4 text-base font-normal leading-normal"
                name="difficulty"
                value={formData.difficulty}
                onChange={handleChange}
              >
                <option className="bg-background-dark text-white" value="Easy">Easy</option>
                <option className="bg-background-dark text-white" value="Medium">Medium</option>
                <option className="bg-background-dark text-white" value="Hard">Hard</option>
              </select>
            </label>
            <FormInput label="Platform" name="platform" value={formData.platform} placeholder="e.g., LeetCode" type="text" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormInput label="Time Taken (minutes)" name="timeTakenMinutes" value={formData.timeTakenMinutes} type="number" />
            <label className="flex flex-col md:col-span-2">
              <p className="text-white text-base font-medium leading-normal pb-2">Notes</p>
              <textarea
                className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary/80 border border-[#3b4754] bg-[#101922] focus:border-primary min-h-[120px] placeholder:text-gray-500 px-4 py-3 text-base font-normal leading-normal"
                name="notes"
                value={formData.notes}
                onChange={handleChange}
                placeholder="Enter any notes, a-ha moments, or optimal solutions here..."
              />
            </label>
          </div>

          {error && (
            <p className="mt-1 text-xs text-center text-red-400">{error}</p>
          )}

          <div className="mt-4 flex flex-col-reverse sm:flex-row items-center justify-end gap-3 pt-4 border-t border-gray-800">
            <button
              className="w-full sm:w-auto flex items-center justify-center rounded-lg px-6 py-2.5 text-sm font-semibold text-gray-300 hover:bg-gray-800/60 transition-colors"
              type="button"
              onClick={() => navigate(-1)}
            >
              Cancel
            </button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="w-full sm:w-auto flex items-center justify-center rounded-lg bg-primary px-6 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-primary/80 transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
              type="submit"
            >
              Save Changes
            </motion.button>
          </div>
        </form>
      </div>
    </div>
  );
}