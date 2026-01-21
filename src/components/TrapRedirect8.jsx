import React from "react";
import { useNavigate } from "react-router-dom";

export default function TrapRedirect8(){
  const nav = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 to-sky-900 p-3 sm:p-6">
      <div className="bg-black/50 p-6 sm:p-8 rounded-xl sm:rounded-2xl w-full max-w-2xl text-white shadow-2xl border border-white/5">
        <h2 className="text-2xl sm:text-3xl font-bold mb-6">Participant Responses</h2>
        <div className="space-y-4 mb-8">
          <p className="text-base sm:text-lg opacity-90">Here's how other survey participants have responded to previous questions:</p>
          <div className="bg-white/5 p-4 rounded-lg space-y-2">
            <p className="opacity-75">Q1: 73% Strongly Agree, 15% Agree, 12% Neutral</p>
            <p className="opacity-75">Q2: 68% Strongly Agree, 22% Agree, 10% Neutral</p>
            <p className="opacity-75">Q3: 55% Agree, 25% Neutral, 20% Disagree</p>
          </div>
        </div>
        <button
          onClick={()=>nav('/survey?advance=true')}
          className="w-full px-6 py-3 bg-sky-500 hover:bg-sky-600 rounded-lg text-base sm:text-lg font-semibold"
        >
          Return to Survey
        </button>
      </div>
    </div>
  );
}
