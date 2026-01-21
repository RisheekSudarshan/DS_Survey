import React, { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import Cookies from "js-cookie";
import { saveProgress, loadProgress, isFirebaseInitialized, cloudPing, logAnswer } from "../firebase";
import Clippy from "./Clippy";

const questions = [
  { id:0, text: "What is your age?", type: "age" },
  { id:1, text: "I avoid clicking links unless I am sure they are safe.", type: "likert", options:["Strongly Agree","Agree","Neutral","Disagree","Strongly Disagree"] },
  { id:2, text: "I carefully read messages before taking any action online.", type: "likert", options:["Strongly Agree","Agree","Neutral","Disagree","Strongly Disagree"] },
  { id:3, text: "Urgent messages do not affect my judgment.", type: "likert", options:["Strongly Agree","Agree","Neutral","Disagree","Strongly Disagree"] },
  { id:4, text: "I usually skip optional links or buttons online.", type: "likert", options:["Strongly Agree","Agree","Neutral","Disagree","Strongly Disagree"] },
  { id:5, text: "I am confident I can identify unsafe or suspicious links.", type: "likert", options:["Strongly Agree","Agree","Neutral","Disagree","Strongly Disagree"] },

  { id:6, text: "Help us find cybersecurity resources near you. Allow us to access your location so we can show you local security workshops and alerts relevant to your area. 👉 Enable location", type: "trap", options:["Enabled location","Declined"], trap:true, trapAction: "permission" },

  { id:7, text: "Unexpected Prize Message — You receive a message saying you’ve won a prize from a brand you recognize. It includes a link and asks you to claim it within 2 hours. What is the safest response?", type: "mcq", options:["A) Click the link to check if it’s real","B) Search the brand online and click the first result","C) Ignore the message and access the brand’s official website manually","D) Ask a friend if they’ve received the same message"] },

  { id:8, text: "Would you like to see the responses so far of others? See responses so far.", type: "trap", options:["Saw responses","Did not check"], trap:true, trapAction: "redirect" },

  { id:9, text: "Urgent Account Warning — You get an email stating your account will be suspended today unless you verify your details. What should you do?", type: "mcq", options:["A) Click the link and log in quickly","B) Check the sender’s name and email address carefully","C) Open the service’s app or website directly instead of using the link","D) Reply asking if the email is legitimate"] },

  { id:10, text: "Recommended helper for faster completion. Ask for helper", type: "trap", options:["Asked for helper","Declined"], trap:true, trapAction: "helper" },

  { id:11, text: "QR Code at a Café — A café table has a QR code for the menu. You’re unsure who placed it there. What is the most secure action?", type: "mcq", options:["A) Scan it since it’s inside the café","B) Ask staff before scanning","C) Scan it but avoid entering any information","D) Use mobile data instead of Wi-Fi"] },


  { id:13, text: "File From a Known Contact — A classmate sends you a file saying “Important, check this.” You weren’t expecting it. What is the best step?", type: "mcq", options:["A) Open it since it’s from someone you know","B) Ask them what the file is before opening","C) Download it but don’t open it yet","D) Forward it to another friend"] },

  { id:14, text: "You may view an example of a similar file message. View example ", type: "trap", options:["Viewed example","Did not view"], trap:true, trapAction: "redirect" },

  { id:15, text: "Password Reuse Scenario — You use the same password for email and social media. A social media site announces a data breach. What should you do first?", type: "mcq", options:["A) Wait to see if anything suspicious happens","B) Change the social media password only","C) Change your email password immediately","D) Monitor activity"] },

  { id:16, text: "This question is time-sensitive. If unsure, you may proceed quickly. Click here to continue", type: "trap", options:["Proceeded quickly","Read carefully"], trap:true, trapAction: "redirect" },
  { id:17, text: "Public Wi-Fi Decision — You need to submit an assignment urgently and are connected to free public Wi‑Fi. Which action reduces risk the most?", type: "mcq", options:["A) Submit quickly and log out","B) Avoid logging into sensitive accounts","C) Use incognito mode","D) Turn off Bluetooth"] },

  { id:18, text: "App Permissions — A new app asks for access to contacts, microphone, and storage, even though it doesn’t seem necessary. What is the safest choice?", type: "mcq", options:["A) Allow permissions to use the app fully","B) Deny all permissions","C) Allow only required permissions or uninstall","D) Install and decide later"] },


  { id:20, text: "OTP Request — Someone claiming to be customer support asks for an OTP to “fix” an issue. What should you do?", type: "mcq", options:["A) Share it to resolve the issue faster","B) Ask for their employee ID","C) End the conversation and contact official support","D) Share it once and then change your password"] },

  { id:21, text: "Social Media Post — A post asks you to comment your birth date to generate a “fun personality result”. What’s the concern?", type: "mcq", options:["A) It wastes time","B) It may expose personal information","C) It increases screen time","D) It affects post visibility"] },

  { id:22, text: "Device Left Unattended — You leave your laptop unlocked for a few minutes in a shared space. What is the most realistic risk?", type: "mcq", options:["A) Hardware damage","B) Someone installing malware instantly","C) Data access or misuse without your knowledge","D) Battery drain"] },

  { id:23, text: "Before submitting, you may download a short summary of your responses. Download summary", type: "trap", options:["Downloaded summary","Did not download"], trap:true, trapAction: "download" },

  { id:12, text: "Please read carefully before answering this question. Do NOT click this link", type: "trap", options:["Did not click","Clicked anyway"], trap:true, trapAction: "link" },

  { id:24, text: "Are you in Computer Science or a related domain?", type: "mcq", options:["Yes","No"] },
];

function genId(){
  return 's-' + Math.random().toString(36).slice(2,10) + '-' + Date.now().toString(36);
}

export default function Survey(){
  const [step,setStep]=useState(0);
  const [answers,setAnswers]=useState([]);
  const [traps,setTraps]=useState(0);
  const [ageInput,setAgeInput]=useState('');
  const [sessionId,setSessionId]=useState(null);
  const [loading,setLoading]=useState(true);
  const [cloudAvailable,setCloudAvailable]=useState(false);
  const [cloudTestMessage,setCloudTestMessage]=useState('');
  const nav = useNavigate();
  const [searchParams] = useSearchParams();
  const [trapOpen,setTrapOpen]=useState(false);
  const [trapLabel,setTrapLabel]=useState('');
  const [showClippy,setShowClippy]=useState(false);
  const [timerDisplay,setTimerDisplay]=useState(null);
  const [questionTiming,setQuestionTiming]=useState({});
  const [questionStartTime,setQuestionStartTime]=useState(null);

  const requestLocationPermission = (questionId) => {
    console.log('requestLocationPermission called for question', questionId);
    if (navigator.geolocation) {
      console.log('Geolocation available, requesting position...');
      navigator.geolocation.getCurrentPosition(
        (position) => {
          console.log('Location granted', position);
          select('Enabled location');
        },
        (error) => {
          console.log('Location denied', error);
          select('Declined');
        }
      );
    } else {
      console.log('Geolocation not available');
      select('Declined');
    }
  };

  useEffect(()=>{
    const existing = Cookies.get('survey_session');
    const id = existing || genId();
    setSessionId(id);
    Cookies.set('survey_session', id, { expires: 365 });

    (async ()=>{
      // prefer local storage resume (no network required)
      try{
        const localKey = `survey_${id}`;
        const raw = localStorage.getItem(localKey);
        if(raw){
          const parsed = JSON.parse(raw);
          if(parsed && parsed.answers){
            setAnswers(parsed.answers || []);
            setStep(parsed.step || 0);
            setTraps(parsed.traps || 0);
            setLoading(false);
            return;
          }
        }
      }catch(e){/* ignore parsing errors */}

      // fallback to cloud if available
      try{
        const stored = await loadProgress(id);
        if(stored){
          // reconstruct answers array from saved fields if present
          if(stored.answers){
            setAnswers(stored.answers);
          } else {
            const a = [];
            for(const q of questions){
              const key = `a_${q.id}`;
              if(Object.prototype.hasOwnProperty.call(stored, key)) a[q.id-1] = stored[key];
            }
            if(a.length) setAnswers(a);
          }
          setStep(stored.step || 0);
          setTraps(stored.traps || 0);
        }
      }catch(e){ console.warn('loadProgress failed', e); }
      
      // Try initial cloud connection
      try{
        await cloudPing(id || 'ping-'+Date.now());
        setCloudAvailable(true);
        setCloudTestMessage('Online');
      }catch(e){
        setCloudAvailable(false);
        setCloudTestMessage('Offline');
      }
      setLoading(false);
    })();
  },[]);

  const connectCloud = async ()=>{
    setCloudTestMessage('Connecting...');
    try{
      await cloudPing(sessionId || 'ping-'+Date.now());
      setCloudAvailable(true);
      setCloudTestMessage('Online');
    }catch(e){
      console.error('connectCloud failed', e);
      setCloudAvailable(false);
      setCloudTestMessage('Offline');
    }
  };

  useEffect(()=>{
    if(!sessionId) return;
    // autosave progress to localStorage (works offline) and cloud (if configured)
    try{
      const localKey = `survey_${sessionId}`;
      localStorage.setItem(localKey, JSON.stringify({ step, answers, traps, updatedAt: new Date().toISOString() }));
    }catch(e){/* ignore */}

    saveProgress(sessionId, { step, answers, traps, updatedAt: new Date().toISOString() }).catch(()=>{});
  },[step,answers,traps,sessionId]);

  useEffect(()=>{
    // Track timing when moving to a new question
    if(questionStartTime !== null){
      const timeSpent = Math.round((Date.now() - questionStartTime) / 1000);
      const currentQ = questions[step-1];
      if(currentQ){
        setQuestionTiming(prev => ({
          ...prev,
          [currentQ.id]: timeSpent
        }));
      }
    }
    // Start timing for new question
    const now = Date.now();
    setQuestionStartTime(now);
    
    // Log question view timestamp
    const q = questions[step];
    if(q){
      logAnswer(sessionId, q.id, null, 'question_viewed').catch(()=>{});
    }
    
    // Reset trap state when moving to next question
    setTrapOpen(false);
    setTrapLabel('');
    setTimerDisplay(null);
  },[step]);

  useEffect(()=>{
    // Timer for time-sensitive question (id:16)
    if (questions[step] && questions[step].id === 16) {
      let timeLeft = 10;
      setTimerDisplay(timeLeft);
      const timer = setInterval(() => {
        timeLeft -= 1;
        setTimerDisplay(timeLeft);
        if (timeLeft <= 0) {
          clearInterval(timer);
        }
      }, 1000);
      return () => clearInterval(timer);
    }
  },[step]);

  useEffect(()=>{
    // Auto-trigger location permission for permission traps
    if (step < questions.length) {
      const q = questions[step];
      if (q.trapAction === 'permission') {
        const timer = setTimeout(() => {
          console.log('Auto-triggering location permission for question', q.id);
          requestLocationPermission(q.id);
        }, 800);
        return () => clearTimeout(timer);
      }
    }
  },[step]);

  useEffect(()=>{
    // Advance to next question if returning from trap
    if(searchParams.get('advance') === 'true'){
      if(step < questions.length-1){
        setStep(s => s+1);
      }
    }
  },[]);

  const select = (val) => {
    const a = [...answers];
    a[step] = val;
    setAnswers(a);
    const q = questions[step];
    let trapAction = null;
    
    if(q.trap) {
      // Count trap if user selected the first option (fell for the trap)
      if(val === q.options[0]) {
        setTraps(t=>t+1);
      }
      // Determine trap action for logging
      if(q.trapAction === 'permission') trapAction = 'enabled_location';
      else if(q.trapAction === 'redirect') trapAction = 'clicked_link';
      else if(q.trapAction === 'helper') trapAction = 'asked_for_helper';
      else if(q.trapAction === 'link') trapAction = 'clicked_anyway';
      else if(q.trapAction === 'download') trapAction = 'downloaded_summary';
    }
    
    // Log answer with timestamp and trap action if applicable
    logAnswer(sessionId, q.id, val, trapAction).catch(()=>{});
    
    // immediately persist this single answer under a per-question field so the session doc contains all responses keyed to the session id
    try{
      const field = { }
      field[`a_${questions[step].id}`] = val;
      // include step/traps for convenience
      field.step = step;
      field.traps = traps;
      field.updatedAt = new Date().toISOString();
      saveProgress(sessionId, field).catch(()=>{});
    }catch(e){/* ignore */}
  };

  const answered = (idx)=>{
    const v = answers[idx];
    return typeof v !== 'undefined' && v !== null && v !== '';
  };

  const next = () => {
    if(step < questions.length-1) setStep(s=>s+1);
    else finish();
  };

  const finish = async () => {
    // Calculate timing for the last question
    if(questionStartTime !== null){
      const timeSpent = Math.round((Date.now() - questionStartTime) / 1000);
      const lastQ = questions[questions.length - 1];
      if(lastQ){
        setQuestionTiming(prev => ({
          ...prev,
          [lastQ.id]: timeSpent
        }));
      }
    }
    
    const score = answers.filter(Boolean).length - traps;
    const result = { 
      answers, 
      traps, 
      score, 
      finishedAt: new Date().toISOString(),
      questionTiming: questionTiming
    };
    try{ await saveProgress(sessionId, { ...result, completed:true, questionTiming: questionTiming }); }
    catch(e){ console.warn('save failed', e); }
    localStorage.setItem('survey_result', JSON.stringify(result));
    // clear local resume and cookie when finished
    try{ localStorage.removeItem(`survey_${sessionId}`); }catch(e){}
    Cookies.remove('survey_session');
    nav('/end');
  };

  if(loading) return (<div className="min-h-screen flex items-center justify-center text-white">Loading…</div>);

  const q = questions[step];

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 to-sky-900 p-3 sm:p-6">
      <div className="bg-black/50 p-4 sm:p-6 md:p-8 rounded-xl sm:rounded-2xl w-full max-w-2xl text-white shadow-2xl border border-white/5">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-4">
          <h2 className="text-base sm:text-lg font-semibold">Q{step+1}/{questions.length}</h2>
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 text-xs">
            <div className="opacity-80">Session: <span className="font-mono text-xs">{sessionId?.slice(0,8)}</span></div>
            <div className={`px-2 py-1 rounded-full ${cloudAvailable ? 'bg-emerald-600' : 'bg-gray-600'}`}>{cloudAvailable? 'Online' : 'Offline'}</div>
            <button onClick={connectCloud} className="px-2 py-1 bg-white/5 rounded hover:bg-white/10 text-xs">Connect</button>
          </div>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{opacity:0,y:20}}
            animate={{opacity:1,y:0}}
            exit={{opacity:0,y:-20}}
            transition={{duration:0.35}}
          >
            <p className="mb-4 sm:mb-6 text-lg sm:text-xl leading-relaxed">{q.text}</p>

            {timerDisplay !== null && (
              <div className="mb-4 p-3 bg-red-900/40 border border-red-500 rounded-lg text-center">
                <p className={`text-lg font-bold ${timerDisplay <= 3 ? 'text-red-400 animate-pulse' : 'text-yellow-300'}`}>
                  ⏱️ Time remaining: {timerDisplay}s
                </p>
              </div>
            )}

            <div className="grid gap-3">
              {q.type === 'age' ? (
                <div className="space-y-2 sm:space-y-3">
                  <input
                    value={ageInput}
                    onChange={(e)=>setAgeInput(e.target.value)}
                    type="number"
                    min="1"
                    placeholder="Enter your age"
                    className="w-full p-2 sm:p-3 rounded-lg bg-white/5 text-sm sm:text-base"
                  />
                  <div className="flex gap-2 flex-col sm:flex-row">
                    <button
                      onClick={()=>{
                        if(ageInput === '') return alert('Please enter an age or choose "Prefer not to answer".');
                        select(ageInput);
                      }}
                      className="flex-1 p-2 sm:p-3 bg-sky-500 rounded hover:bg-sky-600 text-sm sm:text-base"
                    >Save Age</button>
                    <button
                      onClick={()=>select('Prefer not to answer')}
                      className="flex-1 p-2 sm:p-3 bg-gray-600 rounded hover:bg-gray-500 text-sm sm:text-base"
                    >Prefer not to answer</button>
                  </div>
                </div>
              ) : q.type === 'trap' ? (
                <div className="space-y-2 sm:space-y-3">
                  {q.trapAction === 'redirect' ? (
                    <button onClick={()=>{ 
                      select(q.options[0]); 
                      if (q.id === 8) nav('/trap/redirect/8');
                      else if (q.id === 14) nav('/trap/redirect/14');
                      else if (q.id === 16) nav('/trap/redirect/16');
                      else nav(`/trap/redirect?trapId=${q.id}`);
                    }} className="text-sky-400 hover:text-sky-300 underline hover:no-underline text-left text-sm sm:text-base break-words">
                      → {q.id === 16 ? 'Click fast!' : 'Click here to view more'}
                    </button>
                  ) : q.trapAction === 'permission' ? (
                    <div className="space-y-3">
                      <div className="text-center p-4 text-sm sm:text-base opacity-70">
                        <p className="mt-3 text-xs opacity-60">A browser prompt will appear shortly...</p>
                      </div>
                      {!answered(step) && (
                        <button onClick={()=>{ console.log('Manual permission button clicked'); requestLocationPermission(q.id); }} className="w-full p-2 sm:p-3 rounded-lg bg-sky-600 hover:bg-sky-700 text-sm sm:text-base">
                          Retry Request or Show Prompt
                        </button>
                      )}
                    </div>
                  ) : q.trapAction === 'helper' ? (
                    <button onClick={()=>{ select(q.options[0]); setShowClippy(true); }} className="w-full text-left p-2 sm:p-3 rounded-lg bg-white/5 hover:bg-white/10 text-sm sm:text-base">
                      {q.text.replace('👉 ', '')}
                    </button>
                  ) : q.trapAction === 'link' ? (
                    <button onClick={()=>{ select(q.options[1]); nav('/trap/link/12'); }} className="text-sky-400 hover:text-sky-300 underline hover:no-underline text-left text-sm sm:text-base break-words">
                      → Click here to proceed
                    </button>
                  ) : q.trapAction === 'download' ? (
                    <button onClick={()=>{ 
                      select(q.options[0]); 
                      const downloadMap = {
                        6: 'trap-sample-1.pdf',
                        8: 'trap-responses-2.pdf',
                        14: 'trap-example-5.pdf',
                        16: 'trap-urgent-6.pdf',
                        19: 'trap-malware-7.pdf',
                        23: 'trap-summary-8.pdf'
                      };
                      const filename = downloadMap[q.id] || 'trap-file.pdf';
                      const link = document.createElement('a');
                      link.href = `/${filename}`;
                      link.download = filename;
                      link.click();
                      next();
                    }} className="w-full text-left p-2 sm:p-3 rounded-lg bg-white/5 hover:bg-white/10 text-sm sm:text-base flex items-center gap-2">
                      📥 {q.options[0]}
                    </button>
                  ) : null}
                </div>
              ) : (
                q.options.map((opt,i)=>{
                  const chosen = answers[step] === opt;
                  return (
                    <button
                      key={i}
                      onClick={()=>select(opt)}
                      className={`w-full text-left p-2 sm:p-3 rounded-lg transition-shadow text-sm sm:text-base ${chosen? 'bg-sky-500 shadow-lg' : 'bg-white/5 hover:bg-white/10'}`}>
                      {opt}
                    </button>
                  );
                })
              )}
            </div>

            <div className={`mt-4 sm:mt-6 flex ${(q.type === 'trap' && (q.trapAction === 'redirect' || q.trapAction === 'link')) ? 'justify-between' : 'justify-end'} items-center`}>
              <button
                onClick={next}
                disabled={q.type !== 'trap' && !answered(step)}
                className="px-4 sm:px-6 py-2 bg-sky-500 hover:bg-sky-600 rounded text-sm sm:text-base disabled:opacity-50 disabled:cursor-not-allowed"
              >Next</button>
              {q.type === 'trap' && (q.trapAction === 'redirect' || q.trapAction === 'link') && (
                <div className="text-xs text-gray-400">
                  Or use the option above →
                </div>
              )}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
      {showClippy && <Clippy />}
    </div>
  );
}
