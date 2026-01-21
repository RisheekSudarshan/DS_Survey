import React, { useEffect, useState } from "react";
import Cookies from "js-cookie";

export default function End(){
  const [showThankYou, setShowThankYou] = useState(true);
  const [showShare, setShowShare] = useState(false);
  const [copied, setCopied] = useState(false);
  const [expandTiming, setExpandTiming] = useState(false);

  useEffect(()=>{ Cookies.remove('survey_session'); },[]);
  useEffect(()=>{ triggerConfetti(); },[]);

  const triggerConfetti = () => {
    if(typeof window !== 'undefined' && window.confetti) {
      window.confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });
    }
  };

  const data = JSON.parse(localStorage.getItem("survey_result")||"{}");
  const score = data.score || 0;
  const traps = data.traps || 0;
  const finishedAt = data.finishedAt ? new Date(data.finishedAt) : new Date();
  const startTime = data.startTime ? new Date(data.startTime) : finishedAt;
  const timeTaken = Math.round((finishedAt - startTime) / 1000 / 60) || 5;
  const questionTiming = data.questionTiming || {};

  let level = "Beginner";
  if(score > 15) level="Advanced";
  else if(score > 8) level="Intermediate";

  const shareUrl = 'https://risheek.co.in';

  const handleShare = () => {
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-900 to-green-900 text-white p-3 sm:p-6 relative">
      <script src="https://cdn.jsdelivr.net/npm/canvas-confetti@1.5.1/dist/confetti.browser.min.js"></script>

      {showThankYou && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-50">
          <div className="bg-gradient-to-br from-emerald-800 to-green-800 p-8 rounded-xl border-2 border-emerald-400 shadow-2xl max-w-md w-full">
            <p className="text-2xl sm:text-3xl font-bold text-emerald-200 text-center mb-4">
              🎉 Thank You! 🎉
            </p>
            <p className="text-lg text-emerald-100 text-center mb-2">
              You completed the survey!
            </p>
            <p className="text-base text-emerald-300 text-center mb-6">
              Share the survey to your freinds and family and see how they do!
            </p>
            <p className="text-sm text-emerald-200 text-center mb-8">
              Thank you for your time and hope you learned something valuable about cybersecurity awareness!
            </p>
            <button
              onClick={() => setShowThankYou(false)}
              className="w-full px-4 py-2 bg-emerald-500 hover:bg-emerald-600 rounded-lg text-white font-semibold"
            >
              View Results
            </button>
          </div>
        </div>
      )}

      <div className="bg-black/40 p-6 sm:p-8 md:p-10 rounded-xl max-w-xl w-full text-center shadow-2xl">
        <h1 className="text-2xl sm:text-3xl font-bold text-emerald-300">Survey Complete</h1>
        <div className="mt-4 space-y-2 sm:space-y-3 text-sm sm:text-base">
          <p>Score: <b className="text-lg sm:text-xl text-emerald-400">{score}</b></p>
          <p>Awareness Level: <b className="text-lg sm:text-xl text-emerald-400">{level}</b></p>
          <p>Trap links clicked: <b className="text-emerald-300">{traps}</b></p>
        </div>

        <p className="mt-6 sm:mt-8 text-xs sm:text-sm text-gray-200">
          Some optional links were intentionally placed to study online decision-making habits.<br/>
          No data was collected from these links. The purpose is awareness and education.
          
        </p>
        
        <p className="mt-6 sm:mt-8 text-xs sm:text-sm text-gray-200">
          Share the survey to your freinds and family and see how they do!
          
        </p>

        <div className="mt-6 sm:mt-8 relative">
          <button
            onClick={() => setShowShare(!showShare)}
            className="w-full px-6 py-3 bg-emerald-500 hover:bg-emerald-600 rounded-lg text-white font-semibold transition-all"
          >
            Share
          </button>

          {showShare && (
            <div className="absolute top-full mt-2 left-0 right-0 bg-emerald-900 border border-emerald-500 rounded-lg p-4 shadow-xl z-10">
              <p className="text-sm mb-3">Share this survey with others:</p>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={shareUrl}
                  readOnly
                  className="flex-1 p-2 bg-black/30 rounded text-sm text-white border border-emerald-500/50"
                />
                <button
                  onClick={handleShare}
                  className={`px-4 py-2 rounded text-sm font-semibold transition-all ${
                    copied
                      ? 'bg-green-600 text-white'
                      : 'bg-emerald-500 hover:bg-emerald-600 text-white'
                  }`}
                >
                  {copied ? '✓ Copied' : 'Copy'}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
