import React, { useEffect, useState } from "react";
import { getAllSessions } from "../firebase";

export default function Stats(){
  const [loading, setLoading] = useState(true);
  const [sessions, setSessions] = useState([]);
  const [stats, setStats] = useState({
    total: 0,
    completed: 0,
    inProgress: 0,
    avgScore: 0,
    avgTraps: 0,
    deviceBreakdown: {},
    levelBreakdown: {},
    questionStats: {},
    trapStats: {}
  });

  useEffect(() => {
    const fetchAndAnalyze = async () => {
      try {
        const data = await getAllSessions();
        setSessions(data);

        // Calculate stats
        const completed = data.filter(s => s.completed).length;
        const inProgress = data.length - completed;
        
        let totalScore = 0;
        let totalTraps = 0;
        let scoreCount = 0;
        const devices = {};
        const levels = {};
        const questionStats = {};
        const trapStats = {
          q6: { name: 'Location Permission (Q6)', clicked: 0 },
          q8: { name: 'View Responses (Q8)', clicked: 0 },
          q10: { name: 'Ask Helper (Q10)', clicked: 0 },
          q12: { name: 'Click Link (Q12)', clicked: 0 },
          q14: { name: 'View Example (Q14)', clicked: 0 },
          q16: { name: 'Click Fast (Q16)', clicked: 0 },
          q23: { name: 'Download Summary (Q23)', clicked: 0 }
        };

        data.forEach(session => {
          if(session.score !== undefined) {
            totalScore += session.score;
            scoreCount++;
          }
          if(session.traps !== undefined) totalTraps += session.traps;
          
          // Device breakdown
          if(session.log_q25?.answer) {
            devices[session.log_q25.answer] = (devices[session.log_q25.answer] || 0) + 1;
          }
          
          // Level breakdown
          if(session.score !== undefined) {
            let level = "Beginner";
            if(session.score > 15) level = "Advanced";
            else if(session.score > 8) level = "Intermediate";
            levels[level] = (levels[level] || 0) + 1;
          }

          // Question answered stats
          for(let i = 0; i <= 25; i++) {
            const key = `log_q${i}`;
            if(!questionStats[i]) {
              questionStats[i] = { answered: 0, total: data.length };
            }
            if(session[key]) {
              questionStats[i].answered++;
            }
          }

          // Trap effectiveness
          if(session.log_q6?.trapAction === 'enabled_location') trapStats.q6.clicked++;
          if(session.log_q8?.trapAction === 'clicked_link') trapStats.q8.clicked++;
          if(session.log_q10?.trapAction === 'asked_for_helper') trapStats.q10.clicked++;
          if(session.log_q12?.trapAction === 'clicked_anyway') trapStats.q12.clicked++;
          if(session.log_q14?.trapAction === 'clicked_link') trapStats.q14.clicked++;
          if(session.log_q16?.trapAction === 'clicked_link') trapStats.q16.clicked++;
          if(session.log_q23?.trapAction === 'downloaded_summary') trapStats.q23.clicked++;
        });

        setStats({
          total: data.length,
          completed,
          inProgress,
          avgScore: scoreCount > 0 ? (totalScore / scoreCount).toFixed(2) : 0,
          avgTraps: completed > 0 ? (totalTraps / completed).toFixed(2) : 0,
          deviceBreakdown: devices,
          levelBreakdown: levels,
          questionStats,
          trapStats
        });
      } catch (e) {
        console.error('Error fetching sessions:', e);
      }
      setLoading(false);
    };
    fetchAndAnalyze();
  }, []);

  const SimpleBarChart = ({ data, title, colors }) => {
    if(!data || Object.keys(data).length === 0) return null;
    
    const entries = Object.entries(data);
    const max = Math.max(...entries.map(e => e[1]));
    const width = 300;
    const height = 200;

    return (
      <div className="bg-black/30 p-4 rounded-lg">
        <h3 className="text-sm font-semibold text-sky-300 mb-4">{title}</h3>
        <svg width={width} height={height} className="w-full">
          {entries.map((entry, idx) => {
            const barHeight = (entry[1] / max) * 120;
            const x = (idx * (width - 40)) / entries.length + 20;
            const y = height - barHeight - 30;
            
            return (
              <g key={idx}>
                <rect x={x} y={y} width="30" height={barHeight} fill={colors[idx % colors.length]} opacity="0.8" />
                <text x={x + 15} y={height - 10} textAnchor="middle" fill="#e5e7eb" fontSize="12">
                  {entry[1]}
                </text>
                <text x={x + 15} y={height - 5} textAnchor="middle" fill="#9ca3af" fontSize="10">
                  {entry[0].slice(0, 8)}
                </text>
              </g>
            );
          })}
        </svg>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-indigo-900 text-white p-3 sm:p-6">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-2xl sm:text-3xl font-bold text-sky-300 mb-8">Survey Analytics Dashboard</h1>

        {loading ? (
          <p className="text-center text-gray-300">Loading analytics...</p>
        ) : (
          <>
            {/* Key Metrics */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              <div className="bg-black/40 p-4 rounded-lg">
                <p className="text-gray-400 text-sm">Total Sessions</p>
                <p className="text-2xl font-bold text-sky-400">{stats.total}</p>
              </div>
              <div className="bg-black/40 p-4 rounded-lg">
                <p className="text-gray-400 text-sm">Completed</p>
                <p className="text-2xl font-bold text-emerald-400">{stats.completed}</p>
              </div>
              <div className="bg-black/40 p-4 rounded-lg">
                <p className="text-gray-400 text-sm">Avg Score</p>
                <p className="text-2xl font-bold text-yellow-400">{stats.avgScore}</p>
              </div>
              <div className="bg-black/40 p-4 rounded-lg">
                <p className="text-gray-400 text-sm">Avg Traps Clicked</p>
                <p className="text-2xl font-bold text-red-400">{stats.avgTraps}</p>
              </div>
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <SimpleBarChart 
                data={stats.deviceBreakdown} 
                title="Device Breakdown" 
                colors={['#3b82f6', '#8b5cf6', '#ec4899', '#f59e0b']}
              />
              <SimpleBarChart 
                data={stats.levelBreakdown} 
                title="Awareness Levels" 
                colors={['#ef4444', '#f59e0b', '#10b981']}
              />
            </div>

            {/* Questions Answered */}
            <div className="bg-black/40 p-6 rounded-lg mb-8">
              <h2 className="text-lg font-bold text-sky-300 mb-4">Questions Answered</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-96 overflow-y-auto">
                {Object.entries(stats.questionStats).map(([qId, qStat]) => (
                  <div key={qId} className="bg-black/30 p-3 rounded">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-semibold text-sky-300">Q{parseInt(qId) + 1}</span>
                      <span className="text-xs text-gray-400">{qStat.answered}/{qStat.total}</span>
                    </div>
                    <div className="w-full bg-gray-700 rounded h-2">
                      <div 
                        className="bg-emerald-500 h-2 rounded" 
                        style={{width: `${(qStat.answered / qStat.total) * 100}%`}}
                      />
                    </div>
                    <p className="text-xs text-gray-400 mt-1">{((qStat.answered / qStat.total) * 100).toFixed(1)}% answered</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Trap Effectiveness */}
            <div className="bg-black/40 p-6 rounded-lg mb-8">
              <h2 className="text-lg font-bold text-sky-300 mb-4">Trap Effectiveness</h2>
              <div className="space-y-3">
                {Object.entries(stats.trapStats).map(([trapKey, trapData]) => {
                  const totalAnswered = stats.total;
                  const percentage = totalAnswered > 0 ? ((trapData.clicked / totalAnswered) * 100).toFixed(1) : 0;
                  return (
                    <div key={trapKey} className="bg-black/30 p-3 rounded">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-semibold text-red-300">{trapData.name}</span>
                        <span className="text-sm font-bold text-red-400">{trapData.clicked} clicked</span>
                      </div>
                      <div className="w-full bg-gray-700 rounded h-2">
                        <div 
                          className="bg-red-500 h-2 rounded" 
                          style={{width: `${percentage}%`}}
                        />
                      </div>
                      <p className="text-xs text-gray-400 mt-1">{percentage}% fall for trap</p>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Detailed Stats */}
            <div className="bg-black/40 p-6 rounded-lg">
              <h2 className="text-lg font-bold text-sky-300 mb-4">Summary</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
                <div>
                  <h3 className="font-semibold text-sky-300 mb-2">Completion Status</h3>
                  <p className="text-gray-300">Completed: <span className="text-emerald-400 font-bold">{stats.completed}</span></p>
                  <p className="text-gray-300">In Progress: <span className="text-yellow-400 font-bold">{stats.inProgress}</span></p>
                  <p className="text-gray-300 mt-2">Completion Rate: <span className="text-sky-400 font-bold">{stats.total > 0 ? ((stats.completed / stats.total) * 100).toFixed(1) : 0}%</span></p>
                </div>
                <div>
                  <h3 className="font-semibold text-sky-300 mb-2">Performance Metrics</h3>
                  <p className="text-gray-300">Average Score: <span className="text-yellow-400 font-bold">{stats.avgScore}</span></p>
                  <p className="text-gray-300">Average Traps Clicked: <span className="text-red-400 font-bold">{stats.avgTraps}</span></p>
                  <p className="text-gray-300 mt-2">Total Sessions: <span className="text-sky-400 font-bold">{stats.total}</span></p>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
