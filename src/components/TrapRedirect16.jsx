import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function TrapRedirect16(){
  const nav = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      nav('/survey?advance=true');
    }, 200);
    return () => clearTimeout(timer);
  }, [nav]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 to-sky-900 p-3 sm:p-6">
      <div className="bg-black/50 p-6 sm:p-8 rounded-xl sm:rounded-2xl w-full max-w-2xl text-white shadow-2xl border border-white/5">
        <h2 className="text-2xl sm:text-3xl font-bold mb-6">Continuing Survey...</h2>
        <div className="space-y-4 mb-8">
          <p className="text-base sm:text-lg opacity-90">You clicked the urgent link under time pressure and fell for the trap!</p>
          <div className="bg-white/5 p-4 rounded-lg space-y-2">
            <p className="text-sm opacity-80">This is a common social engineering tactic used in cybersecurity attacks:</p>
            <ul className="text-sm opacity-75 space-y-1 ml-4">
              <li>• Creating artificial urgency to bypass your judgment</li>
              <li>• Using time pressure to increase mistakes</li>
              <li>• Exploiting panic responses</li>
            </ul>
          </div>
          <p className="text-xs opacity-60 animate-pulse">Redirecting in 0.2 seconds...</p>
        </div>
      </div>
    </div>
  );
}
