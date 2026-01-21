import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { saveProgress } from "../firebase";
import Cookies from "js-cookie";

export default function TrapPermission(){
  const [searchParams] = useSearchParams();
  const nav = useNavigate();
  const [status, setStatus] = useState("requesting");
  const [location, setLocation] = useState(null);
  const [error, setError] = useState(null);
  const trapId = searchParams.get('trapId');
  const sessionId = Cookies.get('survey_session');

  useEffect(() => {
    // Request actual geolocation from browser
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setLocation({ latitude, longitude });
          setStatus("granted");
          
          // Save to database that permission was granted
          if(sessionId) {
            saveProgress(sessionId, { 
              trap_permission_granted: true,
              trap_location: { latitude, longitude },
              updatedAt: new Date().toISOString()
            }).catch(e => console.error('Failed to save', e));
          }
        },
        (err) => {
          setError(err.message);
          setStatus("denied");
          
          // Save to database that permission was denied
          if(sessionId) {
            saveProgress(sessionId, { 
              trap_permission_granted: false,
              trap_permission_denied_reason: err.message,
              updatedAt: new Date().toISOString()
            }).catch(e => console.error('Failed to save', e));
          }
        }
      );
    } else {
      setError("Geolocation not supported");
      setStatus("denied");
    }
  }, [sessionId]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 to-sky-900 p-6">
      <div className="bg-black/50 p-8 rounded-2xl max-w-2xl w-full text-white shadow-2xl border border-white/5">
        {status === "requesting" && (
          <>
            <h1 className="text-3xl font-bold mb-4">📍 Permission Request</h1>
            <div className="bg-blue-600/20 border border-blue-400 p-4 rounded-lg mb-6">
              <p className="text-lg">The Helper Tool is requesting access to your location and device sensors...</p>
            </div>
            <div className="flex justify-center my-8">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-sky-400"></div>
            </div>
          </>
        )}

        {status === "granted" && (
          <>
            <h1 className="text-3xl font-bold mb-4 text-red-400">⚠️ Permission Granted!</h1>
            <div className="bg-red-600/20 border border-red-400 p-4 rounded-lg mb-6">
              <h2 className="text-xl font-bold mb-2">You've Been Compromised</h2>
              <p className="mb-3">You granted access to:</p>
              <ul className="space-y-2 ml-4 text-sm">
                <li>✓ Your precise location: {location?.latitude.toFixed(4)}, {location?.longitude.toFixed(4)}</li>
                <li>✓ Device sensors (accelerometer, gyroscope)</li>
                <li>✓ Potential device identifiers</li>
              </ul>
            </div>

            <div className="space-y-3 text-sm opacity-90">
              <p>📌 <strong>What happened:</strong> Apps and websites can request sensitive permissions. Once granted, they have persistent access.</p>
              <p>⚠️ <strong>Real-world risk:</strong> Location data can be used for tracking, harassment, and targeted attacks. Sensor data can extract keystrokes and passwords.</p>
              <p>✅ <strong>Best practice:</strong> Only grant permissions to apps you trust. Review app permissions regularly. Disable location when not needed.</p>
            </div>
          </>
        )}

        {status === "denied" && (
          <>
            <h1 className="text-3xl font-bold mb-4 text-emerald-400">✅ Permission Denied!</h1>
            <div className="bg-emerald-600/20 border border-emerald-400 p-4 rounded-lg mb-6">
              <h2 className="text-xl font-bold mb-2">Good Decision</h2>
              <p className="mb-3">You prevented unauthorized access. Reason:</p>
              <p className="text-sm font-mono bg-black/30 p-2 rounded">{error}</p>
            </div>

            <div className="space-y-3 text-sm opacity-90">
              <p>📌 <strong>What you did right:</strong> You refused the permission request. This is the safest choice.</p>
              <p>✅ <strong>Best practice:</strong> Always deny permissions you don't need. Be skeptical of permission requests from unfamiliar apps.</p>
            </div>
          </>
        )}

        <button 
          onClick={()=>nav('/survey?advance=true')}
          className="mt-8 w-full p-4 bg-sky-500 hover:bg-sky-600 rounded-lg font-semibold text-lg"
        >
          Return to Survey
        </button>
      </div>
    </div>
  );
}
