import React from "react";
import { useNavigate } from "react-router-dom";

export default function TrapLink(){
  const nav = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 to-sky-900 p-3 sm:p-6">
      <div className="bg-black/50 p-4 sm:p-6 md:p-8 rounded-xl sm:rounded-2xl w-full max-w-2xl text-white shadow-2xl border border-white/5">
        <h1 className="text-2xl sm:text-3xl font-bold mb-4">More Information</h1>
        
        <div className="bg-white/10 border border-white/20 p-3 sm:p-4 rounded-lg mb-4 sm:mb-6">
          <p className="text-base sm:text-lg">This page contains additional information you requested.</p>
        </div>

        <div className="space-y-2 sm:space-y-3 text-xs sm:text-sm opacity-90 mb-6 sm:mb-8">
          <p>Here's the detailed information about the topic you were interested in.</p>
        </div>

        <button 
          onClick={()=>nav('/survey?advance=true')}
          className="w-full p-3 sm:p-4 bg-sky-500 hover:bg-sky-600 rounded-lg font-semibold text-base sm:text-lg"
        >
          Return to Survey
        </button>
      </div>
    </div>
  );
}
