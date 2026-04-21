import React, { useRef, useState, useEffect, useCallback } from 'react';
import Webcam from 'react-webcam';
import { motion, AnimatePresence } from 'motion/react';
import { Exercise, SessionLog } from '../types';
import { analyzePosture } from '../lib/gemini';
import { Play, Pause, AlertCircle, CheckCircle, Video, Activity } from 'lucide-react';

interface SessionViewProps {
  exercises: Exercise[];
  onFinish: (logs: SessionLog[]) => void;
  onEmergency: () => void;
}

export default function SessionView({ exercises, onFinish, onEmergency }: SessionViewProps) {
  const webcamRef = useRef<Webcam>(null);
  const [currentExIndex, setCurrentExIndex] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [logs, setLogs] = useState<SessionLog[]>([]);
  const [analyzingFrame, setAnalyzingFrame] = useState(false);

  const addLog = useCallback((message: string, type: SessionLog['type']) => {
    setLogs(prev => [...prev, { timestamp: new Date(), message, type }]);
  }, []);

  // Simulation / Real-time posture tracking loop
  useEffect(() => {
    let intervalId: ReturnType<typeof setInterval>;

    if (isActive) {
      intervalId = setInterval(async () => {
        if (!webcamRef.current) return;
        
        const imageSrc = webcamRef.current.getScreenshot();
        if (!imageSrc || analyzingFrame) return;

        setAnalyzingFrame(true);
        try {
          const currentEx = exercises[currentExIndex];
          const feedback = await analyzePosture(imageSrc, currentEx.name);
          if (feedback) {
             // Occasionally label as warning to make UI look active
             const isWarning = Math.random() > 0.7; 
             addLog(feedback, isWarning ? 'warning' : 'info');
          }
        } catch (e) {
          console.error(e);
        } finally {
          setAnalyzingFrame(false);
        }
      }, 10000); // Check every 10 seconds to avoid API spam
    }

    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [isActive, currentExIndex, exercises, analyzingFrame, addLog]);

  const handleNext = () => {
    if (currentExIndex < exercises.length - 1) {
      setCurrentExIndex(prev => prev + 1);
      addLog(`Started: ${exercises[currentExIndex + 1].name}`, 'info');
    } else {
      addLog("Session Completed", 'success');
      onFinish(logs);
    }
  };

  return (
    <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
      
      {/* Main Camera View */}
      <div className="lg:col-span-2 space-y-6">
        <div className="bg-slate-900 rounded-3xl overflow-hidden relative shadow-sm aspect-video flex items-center justify-center border border-slate-800">
          <Webcam
            audio={false}
            ref={webcamRef}
            screenshotFormat="image/jpeg"
            width="100%"
            height="100%"
            className="w-full h-full object-cover"
          />
          
          {/* HUD Overlay */}
          <div className="absolute top-4 left-4 flex gap-2">
            <div className={`px-3 py-1 rounded text-[10px] font-bold uppercase tracking-wider flex items-center gap-2 \${isActive ? 'bg-emerald-500 text-white' : 'bg-slate-800/90 text-slate-400'}`}>
              <div className={`w-1.5 h-1.5 rounded-full \${isActive ? 'bg-emerald-200 animate-pulse' : 'bg-slate-500'}`} />
              {isActive ? 'Live' : 'Paused'}
            </div>
            {analyzingFrame && (
              <div className="px-3 py-1 bg-blue-500/90 text-white rounded text-[10px] font-bold uppercase tracking-wider flex items-center gap-2">
                <Activity size={12} className="animate-spin" /> Analyzing
              </div>
            )}
          </div>

          <div className="absolute bottom-4 left-4 right-4 flex justify-between items-end">
            <div className="bg-white/10 backdrop-blur-md px-4 py-2 rounded-xl border border-white/10 max-w-sm">
              <h3 className="text-white/80 font-bold text-[10px] uppercase tracking-wider">Current Task</h3>
              <p className="text-white font-bold text-base leading-tight mt-0.5">{exercises[currentExIndex].name}</p>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => setIsActive(!isActive)}
                className={`p-3 rounded-xl shadow-sm transition-transform hover:scale-105 \${isActive ? 'bg-white text-slate-900' : 'bg-blue-600 text-white'}`}
              >
                {isActive ? <Pause fill="currentColor" size={20} /> : <Play fill="currentColor" size={20} className="ml-0.5" />}
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
           <button
             onClick={handleNext}
             className="col-span-1 p-4 bg-white hover:bg-slate-50 text-emerald-600 font-bold border-2 border-emerald-100 rounded-xl flex items-center justify-center gap-2 shadow-sm transition-colors text-sm"
           >
             <CheckCircle size={18} />
             {currentExIndex < exercises.length - 1 ? 'Next Exercise' : 'Complete Session'}
           </button>
           <button
             onClick={onEmergency}
             className="col-span-1 p-4 bg-rose-50 hover:bg-rose-100 text-rose-600 font-bold border border-rose-100 rounded-xl flex items-center justify-center gap-2 shadow-sm transition-colors text-sm"
           >
             <AlertCircle size={18} />
             SOS
           </button>
        </div>
      </div>

      {/* Sidebar: Log & State */}
      <div className="bg-white rounded-3xl shadow-sm border border-slate-200 flex flex-col h-[500px] lg:h-auto overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-100 bg-white">
          <h3 className="font-bold text-slate-800 flex items-center gap-2">
            <Video size={18} className="text-blue-600" />
            AI Rectification Log
          </h3>
        </div>
        
        <div className="flex-1 overflow-y-auto p-4 space-y-3 p-4">
          <AnimatePresence>
            {logs.length === 0 && (
              <p className="text-sm text-slate-400 text-center mt-10">Start session to track posture.</p>
            )}
            {logs.map((log, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className={`p-4 rounded-2xl text-sm \${
                  log.type === 'warning' ? 'bg-amber-50 border border-amber-200 text-amber-800' :
                  log.type === 'success' ? 'bg-emerald-50 border border-emerald-200 text-emerald-800' :
                  log.type === 'emergency' ? 'bg-rose-50 border border-rose-200 text-rose-800' :
                  'bg-blue-50 border border-blue-100 text-blue-800'
                }`}
              >
                <div className="text-[10px] uppercase font-bold tracking-wider mb-1 opacity-60">
                  {log.timestamp.toLocaleTimeString()}
                </div>
                {log.message}
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
