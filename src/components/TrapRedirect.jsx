import React, { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

export default function TrapRedirect(){
  const [searchParams] = useSearchParams();
  const nav = useNavigate();
  const trapId = searchParams.get('trapId');
  const [closed, setClosed] = useState(false);

  const trapInfo = {
    6: { title: "Survey Sample", message: "Here's a sample message related to the survey." },
    8: { title: "Participant Responses", message: "View how other participants have responded so far." },
    14: { title: "File Example", message: "Here's an example of what similar file messages look like." },
    16: { title: "Proceed to Question", message: "You can now proceed to the next question." },
    23: { title: "Download Summary", message: "Here's your response summary." }
  };

  const info = trapInfo[trapId] || { title: "Information", message: "Here's the requested information." };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 to-sky-900 p-3 sm:p-6">
      <div className="bg-black/50 p-4 sm:p-6 md:p-8 rounded-xl sm:rounded-2xl w-full max-w-2xl text-white shadow-2xl border border-white/5">
        <h1 className="text-2xl sm:text-3xl font-bold mb-4">{info.title}</h1>
        
        <div className="bg-white/10 border border-white/20 p-3 sm:p-4 rounded-lg mb-4 sm:mb-6">
          <p className="text-base sm:text-lg">{info.message}</p>
        </div>

        <div className="space-y-2 sm:space-y-3 text-xs sm:text-sm opacity-90 mb-6 sm:mb-8">
          <p>This page provides information related to your interaction with the survey.</p>
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
