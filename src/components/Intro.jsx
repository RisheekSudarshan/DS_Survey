import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import { loadProgress } from "../firebase";

export default function Intro(){
  const nav = useNavigate();
  const [code,setCode] = useState('');

  const resume = async () => {
    if(!code) return alert('Enter a resume code');
    const stored = await loadProgress(code);
    if(stored){
      Cookies.set('survey_session', code, { expires: 365 });
      nav('/survey');
    }else{
      alert('No session found for that code.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 to-indigo-900 text-white">
      <div className="bg-black/40 p-10 rounded-xl max-w-xl shadow-2xl text-center">
        <h1 className="text-4xl font-bold text-sky-300">Cyber Safety Awareness Survey</h1>
        <p className="mt-4 text-gray-200">
          This survey studies everyday online decision-making.<br/>
          Some questions may include optional actions. No personal data is collected.
        </p>
        <button onClick={()=>nav('/survey')} className="mt-6 px-6 py-3 bg-sky-500 hover:bg-sky-600 rounded-lg text-lg">
          Start Survey
        </button>

        <div className="mt-6">
          <p className="text-sm text-gray-300">Have a resume code from another device? Paste it here to continue.</p>
          <div className="mt-2 flex gap-2 justify-center">
            <input value={code} onChange={(e)=>setCode(e.target.value)} placeholder="Paste resume code" className="px-3 py-2 rounded bg-white/5"/>
            <button onClick={resume} className="px-3 py-2 bg-emerald-600 rounded hover:bg-emerald-500">Resume</button>
          </div>
        </div>
      </div>
    </div>
  );
}
