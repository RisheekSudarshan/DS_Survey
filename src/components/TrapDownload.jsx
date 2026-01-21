import React from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

export default function TrapDownload(){
  const [searchParams] = useSearchParams();
  const nav = useNavigate();
  const downloaded = searchParams.get('downloaded') === 'true';

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 to-sky-900 p-6">
      <div className="bg-black/50 p-8 rounded-2xl max-w-2xl w-full text-white shadow-2xl border border-white/5">
        <h1 className={`text-3xl font-bold mb-4 ${downloaded ? 'text-red-400' : 'text-emerald-400'}`}>
          {downloaded ? '⚠️ File Downloaded!' : '✅ Download Skipped'}
        </h1>
        
        <div className={`${downloaded ? 'bg-red-600/20 border border-red-400' : 'bg-emerald-600/20 border border-emerald-400'} p-4 rounded-lg mb-6`}>
          <h2 className="text-xl font-bold mb-2">{downloaded ? 'Potentially Malicious File' : 'Safe Choice'}</h2>
          <p className="text-lg">
            {downloaded 
              ? 'You downloaded a file from an unverified source.' 
              : 'You wisely skipped the suspicious download.'}
          </p>
        </div>

        <div className="space-y-3 text-sm opacity-90">
          {downloaded ? (
            <>
              <p>📌 <strong>What happened:</strong> You downloaded a file from a suspicious source. This file could contain malware, ransomware, or spyware.</p>
              <p>⚠️ <strong>Real-world risk:</strong> Malicious downloads are a primary vector for cybercriminals. They can compromise your entire system.</p>
              <p>💡 <strong>The trap:</strong> The file appeared legitimate and was offered as a "helpful resource".</p>
              <p>✅ <strong>Best practice:</strong> Only download files from official sources. Use antivirus software. Be skeptical of unexpected file offers.</p>
            </>
          ) : (
            <>
              <p>📌 <strong>What you did right:</strong> You refused to download a file from an untrusted source.</p>
              <p>✅ <strong>Best practice:</strong> Always verify the source before downloading. Check the URL, use HTTPS, and verify file integrity when possible.</p>
            </>
          )}
        </div>

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
