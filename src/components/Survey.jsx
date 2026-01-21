import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import Cookies from "js-cookie";
import { saveProgress, loadProgress, isFirebaseInitialized, cloudPing } from "../firebase";

const questions = [
  { id:0, text: "What is your age? (optional)", type: "age" },
  { id:1, text: "I avoid clicking links unless I am sure they are safe.", type: "likert", options:["Strongly Agree","Agree","Neutral","Disagree","Strongly Disagree"] },
  { id:2, text: "I carefully read messages before taking any action online.", type: "likert", options:["Strongly Agree","Agree","Neutral","Disagree","Strongly Disagree"] },
  { id:3, text: "Urgent messages do not affect my judgment.", type: "likert", options:["Strongly Agree","Agree","Neutral","Disagree","Strongly Disagree"] },
  { id:4, text: "I usually skip optional links or buttons online.", type: "likert", options:["Strongly Agree","Agree","Neutral","Disagree","Strongly Disagree"] },
  { id:5, text: "I am confident I can identify unsafe or suspicious links.", type: "likert", options:["Strongly Agree","Agree","Neutral","Disagree","Strongly Disagree"] },

  { id:6, text: "You may view a sample message related to this survey. 👉 Click here to view (optional)", type: "trap", options:["I clicked the link","I did not click the link"], trap:true },

  { id:7, text: "Unexpected Prize Message — You receive a message saying you’ve won a prize from a brand you recognize. It includes a link and asks you to claim it within 2 hours. What is the safest response?", type: "mcq", options:["A) Click the link to check if it’s real","B) Search the brand online and click the first result","C) Ignore the message and access the brand’s official website manually","D) Ask a friend if they’ve received the same message"] },

  { id:8, text: "Some participants like to see how others answered the previous question. 👉 See responses so far (optional)", type: "trap", options:["I clicked","I did not click"], trap:true },

  { id:9, text: "Urgent Account Warning — You get an email stating your account will be suspended today unless you verify your details. What should you do?", type: "mcq", options:["A) Click the link and log in quickly","B) Check the sender’s name and email address carefully","C) Open the service’s app or website directly instead of using the link","D) Reply asking if the email is legitimate"] },

  { id:10, text: "Recommended helper for faster completion (optional). 👉 Open helper", type: "trap", options:["Opened","Ignored"], trap:true },

  { id:11, text: "QR Code at a Café — A café table has a QR code for the menu. You’re unsure who placed it there. What is the most secure action?", type: "mcq", options:["A) Scan it since it’s inside the café","B) Ask staff before scanning","C) Scan it but avoid entering any information","D) Use mobile data instead of Wi-Fi"] },

  { id:12, text: "Please read carefully before answering this question. 👉 Do NOT click this link", type: "trap", options:["I did not click","I clicked anyway"], trap:true },

  { id:13, text: "File From a Known Contact — A classmate sends you a file saying “Important, check this.” You weren’t expecting it. What is the best step?", type: "mcq", options:["A) Open it since it’s from someone you know","B) Ask them what the file is before opening","C) Download it but don’t open it yet","D) Forward it to another friend"] },

  { id:14, text: "Optional: You may view an example of a similar file message. 👉 View example (optional)", type: "trap", options:["I clicked","I did not click"], trap:true },

  { id:15, text: "Password Reuse Scenario — You use the same password for email and social media. A social media site announces a data breach. What should you do first?", type: "mcq", options:["A) Wait to see if anything suspicious happens","B) Change the social media password only","C) Change your email password immediately","D) Monitor activity"] },

  { id:16, text: "This question is time-sensitive. If unsure, you may proceed quickly. 👉 Click here to continue", type: "trap", options:["I clicked","I did not click"], trap:true },

  { id:17, text: "Public Wi-Fi Decision — You need to submit an assignment urgently and are connected to free public Wi‑Fi. Which action reduces risk the most?", type: "mcq", options:["A) Submit quickly and log out","B) Avoid logging into sensitive accounts","C) Use incognito mode","D) Turn off Bluetooth"] },

  { id:18, text: "App Permissions — A new app asks for access to contacts, microphone, and storage, even though it doesn’t seem necessary. What is the safest choice?", type: "mcq", options:["A) Allow permissions to use the app fully","B) Deny all permissions","C) Allow only required permissions or uninstall","D) Install and decide later"] },

  { id:19, text: "This link is safe and included only for demonstration purposes. 👉 Open demo link", type: "trap", options:["I opened it","I did not open it"], trap:true },

  { id:20, text: "OTP Request — Someone claiming to be customer support asks for an OTP to “fix” an issue. What should you do?", type: "mcq", options:["A) Share it to resolve the issue faster","B) Ask for their employee ID","C) End the conversation and contact official support","D) Share it once and then change your password"] },

  { id:21, text: "Social Media Post — A post asks you to comment your birth date to generate a “fun personality result”. What’s the concern?", type: "mcq", options:["A) It wastes time","B) It may expose personal information","C) It increases screen time","D) It affects post visibility"] },

  { id:22, text: "Device Left Unattended — You leave your laptop unlocked for a few minutes in a shared space. What is the most realistic risk?", type: "mcq", options:["A) Hardware damage","B) Someone installing malware instantly","C) Data access or misuse without your knowledge","D) Battery drain"] },

  { id:23, text: "Before submitting, you may download a short summary of your responses (optional). 👉 Download summary", type: "trap", options:["Downloaded","Skipped"], trap:true },
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
      // cloud availability
      try{ setCloudAvailable(!!isFirebaseInitialized()); }catch(e){}
      setLoading(false);
    })();
  },[]);

  const testCloud = async ()=>{
    setCloudTestMessage('Testing...');
    try{
      await cloudPing(sessionId || 'ping-'+Date.now());
      setCloudAvailable(true);
      setCloudTestMessage('Cloud write/read OK');
    }catch(e){
      console.error('cloudPing failed', e);
      setCloudAvailable(false);
      setCloudTestMessage('Cloud test failed: '+(e && e.message? e.message : String(e)));
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

  const select = (val) => {
    const a = [...answers];
    a[step] = val;
    setAnswers(a);
    if(questions[step].trap && /click|open|download|opened|i clicked|i opened/i.test(String(val))) setTraps(t=>t+1);
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
    const score = answers.filter(Boolean).length - traps;
    const result = { answers, traps, score, finishedAt: new Date().toISOString() };
    try{ await saveProgress(sessionId, { ...result, completed:true }); }
    catch(e){ console.warn('save failed', e); }
    localStorage.setItem('survey_result', JSON.stringify(result));
    // clear local resume and cookie when finished
    try{ localStorage.removeItem(`survey_${sessionId}`); }catch(e){}
    Cookies.remove('survey_session');
    nav('/end');
  };

  const copyResume = async () => {
    if(!sessionId) return;
    await navigator.clipboard.writeText(sessionId);
    alert('Resume code copied — you can paste this on another device to resume.');
  };

  if(loading) return (<div className="min-h-screen flex items-center justify-center text-white">Loading…</div>);

  const q = questions[step];

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 to-sky-900 p-6">
      <div className="bg-black/50 p-8 rounded-2xl max-w-2xl w-full text-white shadow-2xl border border-white/5">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">Question {step+1} / {questions.length}</h2>
          <div className="flex items-center gap-3">
            <div className="text-sm opacity-80">Session: <span className="font-mono">{sessionId?.slice(0,8)}</span></div>
            <div className={`text-xs px-2 py-1 rounded-full ${cloudAvailable ? 'bg-emerald-600' : 'bg-gray-600'}`}>{cloudAvailable? 'Cloud: Connected' : 'Cloud: Offline'}</div>
            <button onClick={testCloud} className="text-xs px-2 py-1 bg-white/5 rounded hover:bg-white/10">Test Cloud</button>
          </div>
        </div>
        {cloudTestMessage && <div className="text-sm mt-2 text-center text-gray-200">{cloudTestMessage}</div>}

        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{opacity:0,y:20}}
            animate={{opacity:1,y:0}}
            exit={{opacity:0,y:-20}}
            transition={{duration:0.35}}
          >
            <p className="mb-6 text-xl leading-relaxed">{q.text}</p>

            <div className="grid gap-3">
              {q.type === 'age' ? (
                <div className="space-y-3">
                  <input
                    value={ageInput}
                    onChange={(e)=>setAgeInput(e.target.value)}
                    type="number"
                    min="1"
                    placeholder="Enter your age"
                    className="w-full p-3 rounded-lg bg-white/5"
                  />
                  <div className="flex gap-2">
                    <button
                      onClick={()=>{
                        if(ageInput === '') return alert('Please enter an age or choose "Prefer not to answer".');
                        select(ageInput);
                      }}
                      className="flex-1 p-3 bg-sky-500 rounded hover:bg-sky-600"
                    >Save Age</button>
                    <button
                      onClick={()=>select('Prefer not to answer')}
                      className="flex-1 p-3 bg-gray-600 rounded hover:bg-gray-500"
                    >Prefer not to answer</button>
                  </div>
                </div>
              ) : (
                q.options.map((opt,i)=>{
                  const chosen = answers[step] === opt;
                  return (
                    <button
                      key={i}
                      onClick={()=>select(opt)}
                      className={`w-full text-left p-3 rounded-lg transition-shadow ${chosen? 'bg-sky-500 shadow-lg' : 'bg-white/5 hover:bg-white/10'}`}>
                      {opt}
                    </button>
                  );
                })
              )}
            </div>

            <div className="mt-6 flex justify-between items-center">
              <div className="space-x-2">
                <button onClick={()=>{ setStep(s=>Math.max(0,s-1)); }} className="px-4 py-2 bg-white/5 rounded">Back</button>
                <button onClick={copyResume} className="px-4 py-2 bg-emerald-600 rounded hover:bg-emerald-500">Copy Resume Code</button>
              </div>
              <div>
                <button
                  onClick={next}
                  disabled={!answered(step)}
                  className={`px-6 py-2 rounded ${answered(step)? 'bg-sky-500 hover:bg-sky-600' : 'bg-white/10 cursor-not-allowed'}`}
                >Next</button>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
