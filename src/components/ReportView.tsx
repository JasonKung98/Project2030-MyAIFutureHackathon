import React, { useRef, useState } from 'react';
import SignaturePad, { SignaturePadRef } from './SignaturePad';
import { ExtractedData, SessionLog } from '../types';
import { CheckCircle, FileText, Calendar, User, Activity, Eye, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface ReportViewProps {
  data: ExtractedData;
  logs: SessionLog[];
  onComplete: () => void;
}

export default function ReportView({ data, logs, onComplete }: ReportViewProps) {
  const sigCanvas = useRef<SignaturePadRef>(null);
  const [signed, setSigned] = useState(false);
  const [showPreview, setShowPreview] = useState(false);

  const clearSignature = () => sigCanvas.current?.clear();

  const handleSign = () => {
    if (sigCanvas.current?.isEmpty()) {
      alert('Please provide a signature first.');
      return;
    }
    setSigned(true);
  };

  const getLogSummary = () => {
    const warnings = logs.filter(l => l.type === 'warning').length;
    if (warnings > 5) return "Patient struggled with several postures and needed consistent correction.";
    if (warnings > 0) return "Patient performed reasonably well, with minor posture corrections needed.";
    return "Patient performed routines perfectly with no AI corrections triggered.";
  };

  const generateMarkdown = () => {
    const durationMins = Math.max(1, Math.round(logs.length * 10 / 60));
    const interventions = logs.filter(l => l.type === 'warning').length;
    
    return `# 光星AI Clinical Report
**Post-Session Analysis & Verification**
*Date: ${new Date().toLocaleDateString()}*

---

## Patient Information
- **Patient Name:** ${data.patientName}
- **Condition:** ${data.condition}

---

## AI Session Summary
${data.summary}

### Performance Overview
> ${getLogSummary()}

- **Session Duration:** ~${durationMins} Mins
- **AI Interventions:** ${interventions}
- **Verification ID:** ${Math.random().toString(36).substr(2, 9).toUpperCase()}

---

## Completed Protocol
${data.exercises.map(ex => `- **${ex.name}** (${ex.duration})`).join('\n')}

---

## Patient Acknowledgment
The patient has verified the details of this clinical session and digitally signed via the 光星AI interface.

- **Digitally Signed By:** ${data.patientName}
- **Verified At:** ${new Date().toLocaleTimeString()}
- **Attending Physician/Practitioner:** ___________________________
`;
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-4xl mx-auto"
    >
      <div 
        className="bg-white p-8 sm:p-12 rounded-3xl shadow-sm border border-slate-200 mb-6 relative"
      >
        {/* Document Header */}
        <div className="flex justify-between items-start border-b-2 border-slate-800 pb-6 mb-8 mt-2">
          <div>
            <div className="flex items-center gap-2 text-slate-800 font-bold text-2xl mb-1">
              <div className="w-8 h-8 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center">
                <Activity size={18} />
              </div>
              光星AI Clinical Report
            </div>
            <p className="text-slate-500 text-sm">Post-Session Analysis & Verification</p>
          </div>
          <div className="text-right text-sm text-slate-600">
            <p className="flex items-center justify-end gap-2"><Calendar size={14} /> {new Date().toLocaleDateString()}</p>
            <p className="mt-1">ID: {Math.random().toString(36).substr(2, 9).toUpperCase()}</p>
          </div>
        </div>

        {/* Patient Info */}
        <div className="grid grid-cols-2 gap-6 mb-8">
          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">Patient Name</p>
            <p className="text-lg font-semibold text-slate-800 flex items-center gap-2"><User size={18} className="text-slate-400" /> {data.patientName}</p>
          </div>
          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">Condition</p>
            <p className="text-lg font-semibold text-slate-800 flex items-center gap-2"><Activity size={18} className="text-slate-400" /> {data.condition}</p>
          </div>
        </div>

        {/* Session Summary */}
        <div className="mb-8">
          <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2 border-b border-slate-100 pb-2">
            <div className="w-6 h-6 bg-slate-100 text-slate-500 rounded flex items-center justify-center">
              <FileText size={14} />
            </div>
            AI Session Summary
          </h3>
          <p className="text-slate-700 mb-4 text-sm leading-relaxed">{data.summary}</p>
          
          <div className="bg-blue-50 border border-blue-100 p-5 rounded-2xl">
            <h4 className="font-bold text-blue-900 text-[10px] uppercase tracking-wider mb-2">Performance Overview</h4>
            <p className="text-blue-800 text-sm">{getLogSummary()}</p>
            <div className="mt-4 text-[10px] text-blue-600 font-bold uppercase tracking-wider">
              Duration: ~{Math.max(1, Math.round(logs.length * 10 / 60))} Mins &nbsp;•&nbsp; AI Interventions: {logs.filter(l => l.type === 'warning').length}
            </div>
          </div>
        </div>

        {/* Exercises Addressed */}
        <div className="mb-12">
           <h3 className="text-lg font-bold text-slate-800 mb-4 border-b border-slate-100 pb-2">Completed Protocol</h3>
           <ul className="list-disc pl-5 space-y-1 text-slate-700 text-sm">
             {data.exercises.map((ex, i) => (
               <li key={i}><span className="font-semibold text-slate-900">{ex.name}</span> - {ex.duration}</li>
             ))}
           </ul>
        </div>

        {/* Signature Area */}
        <div className="border-t border-slate-200 pt-8 mt-12 grid grid-cols-2 gap-8">
           <div className="col-span-1">
             <p className="text-sm font-bold text-slate-800 mb-4">Patient Acknowledgment</p>
             
             {!signed ? (
               <div className="space-y-3">
                 <div className="border-2 border-dashed border-slate-300 rounded-2xl bg-slate-50 relative pointer-events-auto h-32">
                   <SignaturePad 
                     ref={sigCanvas} 
                     className="w-full h-full rounded-2xl cursor-crosshair" 
                   />
                   <button 
                     onClick={clearSignature}
                     className="absolute top-2 right-2 text-xs text-slate-400 hover:text-slate-700 font-medium"
                   >
                     Clear
                   </button>
                 </div>
                 <button 
                   onClick={handleSign}
                   className="w-full py-2 bg-slate-800 text-white rounded-xl text-sm font-bold hover:bg-slate-900 transition-colors shadow-sm"
                 >
                   Apply Signature
                 </button>
               </div>
             ) : (
               <div className="space-y-4">
                 <div className="h-32 border-b-2 border-slate-800 flex items-center justify-center bg-slate-50 pointer-events-none relative">
                    <img 
                      src={sigCanvas.current?.getTrimmedCanvas().toDataURL('image/png')} 
                      alt="Signature"
                      className="max-h-full opacity-80" 
                    />
                    <div className="absolute inset-0 flex items-center justify-center opacity-10 pointer-events-none data-ignore-pdf">
                       <FileText size={64} />
                    </div>
                 </div>
                 <div>
                   <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Digitally Signed By</p>
                   <p className="font-bold text-slate-800">{data.patientName}</p>
                   <p className="text-[10px] font-bold text-emerald-600 uppercase tracking-wider flex items-center gap-1 mt-1">
                     <CheckCircle size={12} /> Verified at {new Date().toLocaleTimeString()}
                   </p>
                 </div>
               </div>
             )}
           </div>

           <div className="col-span-1 flex flex-col justify-end">
              <div className="h-32 border-b-2 border-slate-300 mb-4 flex items-end pb-2">
                 <span className="text-slate-400 font-medium italic">Attending Physician/Practitioner</span>
              </div>
           </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex justify-end gap-4 mt-6">
        <button
          onClick={() => setShowPreview(true)}
          className="px-6 py-3 bg-white border-2 border-slate-200 hover:bg-slate-50 text-slate-700 rounded-xl font-bold transition-colors flex items-center gap-2"
        >
          <Eye size={20} />
          Preview Summary
        </button>
        <button
          disabled={!signed}
          onClick={() => onComplete()}
          className="px-6 py-3 bg-blue-600 shadow-lg shadow-blue-200 hover:bg-blue-700 disabled:bg-blue-400 disabled:shadow-none disabled:cursor-not-allowed text-white rounded-xl font-bold transition-colors flex items-center gap-2"
        >
          <CheckCircle size={20} />
          Complete & Submit
        </button>
      </div>

      <AnimatePresence>
        {showPreview && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-3xl shadow-xl w-full max-w-4xl h-[85vh] flex flex-col overflow-hidden"
            >
              <div className="flex justify-between items-center p-5 border-b border-slate-100 bg-white">
                <h3 className="font-bold text-slate-800 text-lg flex items-center gap-2">
                  <FileText className="text-blue-600" />
                  Structured Summary Preview
                </h3>
                <button onClick={() => setShowPreview(false)} className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors">
                  <X size={20} />
                </button>
              </div>
              <div className="flex-1 bg-slate-100/50 overflow-y-auto relative p-4 lg:p-8">
                <div className="bg-white max-w-3xl mx-auto rounded-2xl shadow-sm border border-slate-200 p-8 min-h-full">
                   <pre className="font-mono text-sm text-slate-700 whitespace-pre-wrap leading-relaxed">
                     {generateMarkdown()}
                   </pre>
                </div>
              </div>
              <div className="p-5 bg-white border-t border-slate-100 flex justify-end gap-3 relative z-10">
                <button 
                  onClick={() => setShowPreview(false)} 
                  className="px-6 py-2.5 text-slate-600 font-bold hover:bg-slate-100 rounded-xl transition-colors"
                >
                  Close Preview
                </button>
                <button 
                  disabled={!signed}
                  onClick={() => {
                    setShowPreview(false);
                    onComplete();
                  }}
                  className="px-6 py-2.5 bg-blue-600 shadow-lg shadow-blue-200 hover:bg-blue-700 disabled:bg-blue-400 text-white rounded-xl font-bold transition-colors flex items-center gap-2"
                >
                  <CheckCircle size={18} />
                  Confirm & Submit
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
