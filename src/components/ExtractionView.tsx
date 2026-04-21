import React, { useState } from 'react';
import { ExtractedData } from '../types';
import { motion } from 'motion/react';
import { CheckCircle, Activity, Pill, User, Send, Clock, ShieldCheck } from 'lucide-react';

interface ExtractionViewProps {
  data: ExtractedData;
  onApprove: () => void;
}

export default function ExtractionView({ data, onApprove }: ExtractionViewProps) {
  const [isApproving, setIsApproving] = useState(false);
  const [approved, setApproved] = useState(false);

  const handleSendToDoctor = () => {
    setIsApproving(true);
    // Simulate network request to medical practitioner
    setTimeout(() => {
      setIsApproving(false);
      setApproved(true);
    }, 2000);
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-4xl mx-auto space-y-6"
    >
      <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-200">
        <h2 className="text-2xl font-bold text-slate-800 mb-6 flex items-center gap-2">
          <div className="w-8 h-8 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center">
            <Activity size={18} />
          </div>
          Extraction Analysis
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 space-y-4">
            <div className="flex items-center gap-3 text-slate-700">
              <User className="text-slate-400" size={20} />
              <div>
                <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Patient</p>
                <p className="font-semibold text-sm">{data.patientName}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 text-slate-700">
              <Activity className="text-slate-400" size={20} />
              <div>
                <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Condition / Diagnosis</p>
                <p className="font-semibold text-sm bg-rose-100 text-rose-700 px-2 py-0.5 rounded inline-block mt-1">{data.condition}</p>
              </div>
            </div>
          </div>
          
          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
            <div className="flex items-start gap-3 text-slate-700">
              <Pill className="text-slate-400 mt-1" size={20} />
              <div>
                <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">Medications</p>
                <ul className="space-y-1">
                  {data.medications.map((med, i) => (
                    <li key={i} className="text-sm font-medium">&bull; {med}</li>
                  ))}
                  {data.medications.length === 0 && <span className="text-sm text-slate-400">None detected.</span>}
                </ul>
              </div>
            </div>
          </div>
        </div>

        <div className="mb-8">
          <h3 className="text-lg font-bold text-slate-800 mb-4 border-b border-slate-100 pb-2">Recommended Rehabilitation Exercises</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {data.exercises.map((ex, i) => (
              <div key={i} className="border border-blue-100 bg-blue-50/50 p-4 rounded-2xl">
                <h4 className="font-bold text-blue-900 mb-1">{ex.name}</h4>
                <p className="text-xs text-slate-600 mb-3">{ex.description}</p>
                <div className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-blue-700 bg-blue-100/50 px-2 py-1 rounded w-fit">
                  <Clock size={12} />
                  {ex.duration}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-slate-50 border border-slate-100 rounded-2xl p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <ShieldCheck className="text-blue-500 flex-shrink-0" size={24} />
            <p className="text-sm font-medium text-slate-700">
              Exercises must be approved by a medical practitioner before starting the session.
            </p>
          </div>
          
          {!approved ? (
            <button
              onClick={handleSendToDoctor}
              disabled={isApproving}
              className="whitespace-nowrap px-6 py-2.5 bg-blue-600 shadow-lg shadow-blue-200 hover:bg-blue-700 disabled:bg-blue-400 text-white rounded-xl font-bold text-sm transition-colors flex items-center justify-center gap-2 w-full sm:w-auto"
            >
              {isApproving ? (
                <div className="w-5 h-5 border-2 border-white/50 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <Send size={18} />
                  Request Approval
                </>
              )}
            </button>
          ) : (
            <button
              onClick={onApprove}
              className="whitespace-nowrap px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg shadow-emerald-200 rounded-xl font-bold text-sm transition-colors flex items-center justify-center gap-2 w-full sm:w-auto"
            >
              <CheckCircle size={18} />
              Start Session
            </button>
          )}
        </div>
      </div>
    </motion.div>
  );
}
