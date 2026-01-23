import React, { useEffect, useState } from "react";
import { getAllSessions } from "../firebase";

export default function Download(){
  const [loading, setLoading] = useState(true);
  const [sessions, setSessions] = useState([]);
  const [downloadReady, setDownloadReady] = useState(false);

  useEffect(() => {
    const fetchSessions = async () => {
      try {
        const data = await getAllSessions();
        setSessions(data);
        setDownloadReady(true);
      } catch (e) {
        console.error('Error fetching sessions:', e);
      }
      setLoading(false);
    };
    fetchSessions();
  }, []);

  const handleDownload = () => {
    const jsonData = JSON.stringify(sessions, null, 2);
    const blob = new Blob([jsonData], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `survey_database_${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 to-indigo-900 text-white p-3 sm:p-6">
      <div className="bg-black/40 p-6 sm:p-8 md:p-10 rounded-xl max-w-2xl w-full shadow-2xl">
        <h1 className="text-2xl sm:text-3xl font-bold text-sky-300 mb-6">Download Database</h1>
        
        {loading ? (
          <p className="text-center text-gray-300">Loading sessions...</p>
        ) : (
          <>
            <div className="bg-black/30 p-4 rounded-lg mb-6">
              <p className="text-sm text-gray-200 mb-4">
                <span className="font-bold text-sky-400">{sessions.length}</span> session(s) found in the database.
              </p>
            </div>


            <button
              onClick={handleDownload}
              disabled={!downloadReady || sessions.length === 0}
              className="w-full px-6 py-3 bg-emerald-500 hover:bg-emerald-600 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg text-white font-semibold transition-all"
            >
              📥 Download as JSON
            </button>

            <p className="mt-4 text-xs text-gray-400 text-center">
              File format: survey_database_YYYY-MM-DD.json
            </p>
          </>
        )}
      </div>
    </div>
  );
}
