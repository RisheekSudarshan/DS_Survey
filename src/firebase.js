// Minimal Firebase helper (Firestore) — fill firebaseConfig with your project values
import { initializeApp } from "firebase/app";
import { getFirestore, doc, setDoc, getDoc, collection, getDocs } from "firebase/firestore";

// TODO: Replace the below config with your Firebase project's config
const firebaseConfig = {
  apiKey: "AIzaSyBccZ379gH06e23WwRfv3Lly7E49FI_Uxk",
  authDomain: "ds-survey-40808.firebaseapp.com",
  projectId: "ds-survey-40808",
  storageBucket: "ds-survey-40808.firebasestorage.app",
  messagingSenderId: "555453514367",
  appId: "1:555453514367:web:5d913637cd481d77dc754a",
  measurementId: "G-KRTK8EFY13"
};

let db = null;
let _initialized = false;
try{
  const app = initializeApp(firebaseConfig);
  db = getFirestore(app);
  _initialized = true;
  console.log('Firebase initialized');
}catch(e){
  console.warn('Firebase not initialized — check src/firebase.js config and network.', e);
}

export function isFirebaseInitialized(){ return _initialized; }

// small connectivity test: write a ping field then read the document back
export async function cloudPing(sessionId){
  if(!db) throw new Error('Firestore not available');
  const ref = doc(db, 'sessions', sessionId || '__ping__');
  const payload = { _ping: Date.now() };
  await setDoc(ref, payload, { merge: true });
  const snap = await getDoc(ref);
  return snap.exists() ? snap.data() : null;
}

export async function logAnswer(sessionId, questionId, answer, trapAction = null){
  if(!db) return Promise.resolve();
  const ref = doc(db, 'sessions', sessionId);
  const timestamp = new Date().toISOString();
  const logEntry = {
    answer: answer,
    submittedAt: timestamp,
    trapAction: trapAction
  };
  // Use question ID as key to avoid overwriting
  const fieldKey = `log_q${questionId}`;
  const payload = {};
  payload[fieldKey] = logEntry;
  return setDoc(ref, payload, { merge: true });
}

export async function saveProgress(sessionId, data){
  if(!db) return Promise.resolve();
  const ref = doc(db, 'sessions', sessionId);
  return setDoc(ref, data, { merge: true });
}

export async function loadProgress(sessionId){
  if(!db) return Promise.resolve(null);
  const ref = doc(db, 'sessions', sessionId);
  const snap = await getDoc(ref);
  return snap.exists() ? snap.data() : null;
}

export async function getAllSessions(){
  if(!db) return [];
  const sessionsCollection = collection(db, 'sessions');
  const snap = await getDocs(sessionsCollection);
  const sessions = [];
  snap.forEach(doc => {
    sessions.push({ id: doc.id, ...doc.data() });
  });
  return sessions;
}

export default {
  saveProgress, loadProgress, getAllSessions
};

