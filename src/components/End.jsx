import React, { useEffect } from "react";
import Cookies from "js-cookie";

export default function End(){
  useEffect(()=>{ Cookies.remove('survey_session'); },[]);

  const data = JSON.parse(localStorage.getItem("survey_result")||"{}");
  const score = data.score || 0;
  const traps = data.traps || 0;

  let level = "Beginner";
  if(score > 15) level="Advanced";
  else if(score > 8) level="Intermediate";

  const downloadCSV = () => {
    const csv = `Score,Level,TrapClicks\n${score},${level},${traps}`;
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = "survey_results.csv"; a.click();
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-900 to-green-900 text-white">
      <div className="bg-black/40 p-10 rounded-xl max-w-xl text-center shadow-2xl">
        <h1 className="text-3xl font-bold text-emerald-300">Survey Complete</h1>
        <p className="mt-4">Score: <b>{score}</b></p>
        <p>Awareness Level: <b>{level}</b></p>
        <p className="mt-2 text-sm">Trap links clicked: {traps}</p>

        <button onClick={downloadCSV} className="mt-6 px-6 py-3 bg-sky-500 hover:bg-sky-600 rounded">
          Download Results (CSV)
        </button>

        <p className="mt-6 text-sm text-gray-200">
          Some optional links were intentionally placed to study online decision-making habits.<br/>
          No data was collected from these links. The purpose is awareness and education.
        </p>
      </div>
    </div>
  );
}
