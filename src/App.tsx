import React, { useState } from 'react';
import { extractPrescriptionInfo } from './lib/gemini';
import { ExtractedData, SessionLog, SessionRecord, BiometricProfile } from './types';
import UploadView from './components/UploadView';
import ExtractionView from './components/ExtractionView';
import SessionView from './components/SessionView';
import ReportView from './components/ReportView';
import HistoryView from './components/HistoryView';
import ProfileView from './components/ProfileView';
import EmergencyModal from './components/EmergencyModal';
import { Activity, ShieldAlert, ArrowLeft, History, HeartPulse } from 'lucide-react';

type AppStep = 'upload' | 'extracting' | 'extraction-result' | 'session' | 'report' | 'done' | 'history' | 'profile';

export default function App() {
  const [step, setStep] = useState<AppStep>('upload');
  const [extractedData, setExtractedData] = useState<ExtractedData | null>(null);
  const [sessionLogs, setSessionLogs] = useState<SessionLog[]>([]);
  const [sessionHistory, setSessionHistory] = useState<SessionRecord[]>([]);
  const [userProfile, setUserProfile] = useState<BiometricProfile | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showEmergency, setShowEmergency] = useState(false);

  const handleImageCaptured = async (dataUrl: string) => {
    setStep('extracting');
    setError(null);
    try {
      const data = await extractPrescriptionInfo(dataUrl);
      setExtractedData(data);
      setStep('extraction-result');
    } catch (err) {
      console.error(err);
      setError("Failed to extract data. Please try a clearer image.");
      setStep('upload');
    }
  };

  const reset = () => {
    setStep('upload');
    setExtractedData(null);
    setSessionLogs([]);
  };

  const handleCompleteSession = () => {
    if (extractedData) {
      const newRecord: SessionRecord = {
        id: Math.random().toString(36).substr(2, 9),
        date: new Date(),
        data: extractedData,
        logs: sessionLogs
      };
      setSessionHistory(prev => [newRecord, ...prev]);
    }
    setStep('done');
  };

  const triggerEmergency = () => {
    setShowEmergency(true);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-blue-100">
      <EmergencyModal 
        isOpen={showEmergency} 
        onClose={() => setShowEmergency(false)} 
        patientData={extractedData}
        userProfile={userProfile}
      />
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => step === 'done' && reset()}>
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <div className="w-4 h-1 bg-white rounded-full"></div>
            </div>
            <span className="font-bold text-xl tracking-tight text-slate-900">光星AI</span>
          </div>
          
          <div className="flex items-center gap-4">
            {step === 'upload' && (
              <>
                <button 
                  onClick={() => setStep('profile')}
                  className="text-slate-600 bg-white px-3 py-1.5 rounded-lg flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider transition-colors border border-slate-200 hover:bg-slate-50 shadow-sm"
                >
                  <HeartPulse size={16} />
                  <span className="hidden sm:inline">Profile</span>
                </button>
                <button 
                  onClick={() => setStep('history')}
                  className="text-slate-600 bg-white px-3 py-1.5 rounded-lg flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider transition-colors border border-slate-200 hover:bg-slate-50 shadow-sm"
                >
                  <History size={16} />
                  <span className="hidden sm:inline">History</span>
                </button>
              </>
            )}
            <button 
              onClick={triggerEmergency}
              className="text-rose-600 bg-rose-50 px-3 py-1.5 rounded-lg flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider transition-colors border border-rose-100 hover:bg-rose-100 shadow-sm"
            >
              <ShieldAlert size={16} />
              <span className="hidden sm:inline">SOS</span>
            </button>
            {step !== 'upload' && step !== 'done' && step !== 'history' && step !== 'profile' && (
              <button onClick={reset} className="text-slate-500 hover:text-slate-800 text-sm font-medium">
                Cancel
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {error && (
          <div className="max-w-2xl mx-auto mb-6 p-4 bg-rose-50 border-l-4 border-rose-500 text-rose-700 rounded-r-lg shadow-sm">
            <p className="font-semibold">Error</p>
            <p className="text-sm">{error}</p>
          </div>
        )}

        {step === 'upload' && (
          <UploadView onImageCaptured={handleImageCaptured} />
        )}

        {step === 'extracting' && (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="w-16 h-16 border-4 border-blue-100 border-t-blue-600 rounded-full animate-spin mb-6"></div>
            <h2 className="text-2xl font-semibold text-slate-800">Analyzing Document</h2>
            <p className="text-slate-500 mt-2 text-center max-w-md">Our AI is extracting medical information and formulating a personalized physical rehabilitation plan...</p>
          </div>
        )}

        {step === 'extraction-result' && extractedData && (
          <ExtractionView 
            data={extractedData} 
            onApprove={() => setStep('session')} 
          />
        )}

        {step === 'session' && extractedData && (
          <SessionView 
            exercises={extractedData.exercises} 
            onFinish={(logs) => {
              setSessionLogs(logs);
              setStep('report');
            }}
            onEmergency={triggerEmergency}
          />
        )}

        {step === 'report' && extractedData && (
          <ReportView 
            data={extractedData} 
            logs={sessionLogs} 
            onComplete={handleCompleteSession} 
          />
        )}

        {step === 'history' && (
          <HistoryView 
            history={sessionHistory} 
            onBack={() => setStep('upload')} 
          />
        )}

        {step === 'profile' && (
          <ProfileView 
            profile={userProfile} 
            onSave={(p) => {
              setUserProfile(p);
              setStep('upload');
            }}
            onCancel={() => setStep('upload')} 
          />
        )}

        {step === 'done' && (
          <div className="max-w-2xl mx-auto text-center py-20 bg-white rounded-3xl shadow-sm border border-slate-200 p-8">
            <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="text-3xl font-bold text-slate-800 mb-4">Session Complete!</h2>
            <p className="text-slate-600 mb-8 max-w-lg mx-auto">
              Your report has been securely exported and added to your patient records. Your medical practitioner has been notified.
            </p>
            <button
              onClick={reset}
              className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-lg shadow-blue-200 font-bold transition-colors text-sm"
            >
              Return to Dashboard
            </button>
          </div>
        )}
      </main>
    </div>
  );
}
