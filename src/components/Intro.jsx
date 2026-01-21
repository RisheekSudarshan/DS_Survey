import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import { loadProgress } from "../firebase";

export default function Intro(){
  const nav = useNavigate();
  const [code,setCode] = useState('');
  const [hasActiveSurvey, setHasActiveSurvey] = useState(false);

  useEffect(() => {
    const sessionCookie = Cookies.get('survey_session');
    const completedSurvey = localStorage.getItem('survey_result');
    
    if(sessionCookie){
      setHasActiveSurvey(true);
      nav('/survey');
    } else if(completedSurvey){
      setHasActiveSurvey(true);
      nav('/end');
    }
  }, [nav]);

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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 to-indigo-900 text-white p-3 sm:p-6">
      {hasActiveSurvey ? (
        <div className="bg-black/40 p-6 sm:p-8 md:p-10 rounded-xl max-w-xl w-full shadow-2xl text-center">
          <p className="text-sm text-sky-300">Redirecting to your survey...</p>
        </div>
      ) : (
        <div className="bg-black/40 p-6 sm:p-8 md:p-10 rounded-xl max-w-xl w-full shadow-2xl text-center">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-sky-300">Cyber Safety Awareness Survey</h1>
          <p className="mt-4 text-xs sm:text-sm md:text-base text-gray-200">
            This survey studies everyday online decision-making.<br/>
            Some questions may include optional actions. No personal data is collected.
          </p>
          <button onClick={()=>nav('/survey')} className="mt-6 px-4 sm:px-6 py-2 sm:py-3 bg-sky-500 hover:bg-sky-600 rounded-lg text-base sm:text-lg w-full sm:w-auto">
            Start Survey
          </button>
        </div>
      )}
    </div>
  );
}
