import React from "react";
import { useNavigate } from "react-router-dom";

export default function TrapRedirect14(){
  const nav = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 to-sky-900 p-3 sm:p-6">
      <div className="bg-black/50 p-6 sm:p-8 rounded-xl sm:rounded-2xl w-full max-w-3xl text-white shadow-2xl border border-white/5 max-h-[90vh] overflow-y-auto">
        <h2 className="text-2xl sm:text-3xl font-bold mb-4 text-center">🎬 You've Been Rickrolled! 🎬</h2>
        
        <div className="space-y-6">
          <div className="bg-white/5 p-4 rounded-lg space-y-3">
            <p className="text-base sm:text-lg opacity-90">You clicked on a suspicious link and fell victim to a <span className="font-bold text-yellow-400">rickroll</span> — a classic internet prank!</p>
            
            <div className="bg-white/10 p-3 rounded space-y-2">
              <p className="font-semibold text-sm">What is a Rickroll?</p>
              <p className="text-sm opacity-80">A rickroll is an internet meme where users are tricked into clicking a link that plays Rick Astley's 1987 hit song "Never Gonna Give You Up." While usually harmless fun, this demonstrates an important security lesson:</p>
            </div>

            <div className="bg-red-900/20 border border-red-500/30 p-3 rounded space-y-2">
              <p className="font-semibold text-sm text-red-300">⚠️ Security Awareness:</p>
              <ul className="text-sm opacity-75 space-y-1 ml-4">
                <li>• Attackers use deceptive links to trick you into clicking</li>
                <li>• Unknown links can lead to malware, phishing, or scams</li>
                <li>• Hover over links before clicking to see the real URL</li>
                <li>• Be skeptical of "too good to be true" offers or intriguing content</li>
                <li>• Rickrolls are harmless, but real attacks can steal your data or money</li>
              </ul>
            </div>
          </div>

          <div className="space-y-2">
            <p className="text-sm font-semibold">Now enjoy the classic rickroll experience:</p>
            <div className="relative w-full bg-black rounded-lg overflow-hidden" style={{ paddingBottom: '56.25%' }}>
              <iframe
                className="absolute top-0 left-0 w-full h-full"
                src="https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=1"
                title="Never Gonna Give You Up"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
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
    </div>
  );
}
