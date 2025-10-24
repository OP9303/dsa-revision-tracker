// client/src/pages/Stats.jsx

import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title } from 'chart.js';
import { Doughnut, Bar } from 'react-chartjs-2';
import ChartDataLabels from 'chartjs-plugin-datalabels';

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title, ChartDataLabels);

export default function Stats() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [difficultyData, setDifficultyData] = useState(null);
  const [topicData, setTopicData] = useState(null);
  const [maxTopicCount, setMaxTopicCount] = useState(5);

  useEffect(() => {
    const fetchQuestions = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await api.get('/questions');
        if (!res.data) {
           throw new Error("No data received from server.");
        }

        // --- Process Difficulty Data ---
        setDifficultyData({
          labels: ['Easy', 'Medium', 'Hard'],
          datasets: [
            {
              label: '# of Questions',
              data: [
                res.data.filter(q => q.difficulty === 'Easy').length,
                res.data.filter(q => q.difficulty === 'Medium').length,
                res.data.filter(q => q.difficulty === 'Hard').length,
              ],
              backgroundColor: [
                'rgba(156, 204, 101, 0.7)', // tokyo-green
                'rgba(255, 158, 100, 0.7)', // tokyo-orange
                'rgba(247, 118, 142, 0.7)', // tokyo-red
              ],
              borderColor: ['#9ECE6A', '#FF9E64', '#F7768E'],
              borderWidth: 1,
            },
          ],
        });

        // --- Process Topic Data ---
        const topicMap = new Map();
        res.data.forEach(q => {
          const topic = q.topic || 'General';
          topicMap.set(topic, (topicMap.get(topic) || 0) + 1);
        });
        const sortedTopics = [...topicMap.entries()].sort((a, b) => b[1] - a[1]).slice(0, 10);
        const counts = sortedTopics.map(t => t[1]);
        const maxCount = Math.max(0, ...counts);
        setMaxTopicCount(Math.max(5, maxCount));
        
        setTopicData({
          labels: sortedTopics.map(t => t[0]),
          datasets: [
            {
              label: 'Questions per Topic',
              data: counts,
              backgroundColor: 'rgba(121, 230, 243, 0.7)', // tokyo-cyan
              borderColor: '#79E6F3',
              borderWidth: 1,
              maxBarThickness: 50,
            },
          ],
        });

      } catch (err) {
        console.error("Error fetching or processing stats data:", err);
        setError(`Failed to load stats: ${err.message}`);
      } finally {
        setLoading(false);
      }
    };
    fetchQuestions();
  }, []);

  // --- Chart Options ---
  const commonPluginOptions = { /* ... keep same ... */ };
  const doughnutOptions = { /* ... keep same ... */ };
  const barOptions = { /* ... keep same ... */ };


  if (loading) {
    return <div className="text-center w-full text-tokyo-cyan">Calculating Stats...</div>;
  }
  if (error) {
     return <div className="text-center w-full text-tokyo-red">{error}</div>;
  }

  return (
    <div className="flex w-full max-w-6xl flex-col">
      <div className="mb-8">
        <h1 className="text-white text-4xl font-bold leading-tight tracking-[-0.033em]">
          Your Progress
        </h1>
        <p className="text-gray-400 mt-2">
          Here's a visual breakdown of your revision history.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Difficulty Chart */}
        <div className="rounded-xl border border-gray-800 bg-[#1c2127]/50 p-6 sm:p-8 h-[400px]">
          <h2 className="text-2xl font-bold text-white text-center mb-4">Questions by Difficulty</h2>
          {/* --- FIX IS HERE --- */}
          <div className="relative h-[calc(100%-40px)] w-full flex justify-center items-center">
            {difficultyData ? (
              <Doughnut data={difficultyData} options={doughnutOptions} />
            ) : (
              <p className="text-center text-tokyo-text-dark">No difficulty data available.</p>
            )}
          </div>
        </div>

        {/* Topic Chart */}
        <div className="rounded-xl border border-gray-800 bg-[#1c2127]/50 p-6 sm:p-8 h-[400px]">
           <h2 className="text-2xl font-bold text-white text-center mb-4">Top Topics</h2>
           <div className="relative h-[calc(100%-40px)] w-full">
             {topicData ? (
               <Bar data={topicData} options={barOptions} />
             ) : (
               <p className="text-center text-tokyo-text-dark">No topic data available.</p>
             )}
           </div>
        </div>
      </div>
    </div>
  );
}