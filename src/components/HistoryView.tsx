import React from 'react';
import { SessionRecord } from '../types';
import { Calendar, User, Activity, FileText } from 'lucide-react';
import { motion } from 'motion/react';

interface HistoryViewProps {
  history: SessionRecord[];
  onBack: () => void;
}

export default function HistoryView({ history, onBack }: HistoryViewProps) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-4xl mx-auto"
    >
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
            <Calendar className="text-blue-600" />
            Session History
          </h2>
          <p className="text-slate-500 mt-1">Review past clinical rehabilitation sessions.</p>
        </div>
        <button
          onClick={onBack}
          className="px-4 py-2 border-2 border-slate-200 text-slate-600 font-bold rounded-xl hover:bg-slate-50 transition-colors"
        >
          Back to Dashboard
        </button>
      </div>

      {history.length === 0 ? (
        <div className="bg-white p-12 rounded-3xl shadow-sm border border-slate-200 text-center">
          <div className="w-16 h-16 bg-slate-50 text-slate-300 rounded-full flex items-center justify-center mx-auto mb-4">
            <FileText size={24} />
          </div>
          <h3 className="text-lg font-bold text-slate-800 mb-2">No Records Found</h3>
          <p className="text-slate-500">Completed session summaries will appear here.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {history.map((record) => (
            <div key={record.id} className="bg-white p-6 rounded-3xl shadow-sm border border-slate-200 transition-shadow hover:shadow-md">
              <div className="flex justify-between items-start mb-4">
                <div>
                   <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                     {new Date(record.date).toLocaleString()}
                   </p>
                   <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                     <User size={16} className="text-slate-400" />
                     {record.data.patientName}
                   </h3>
                </div>
                <div className="px-3 py-1 bg-emerald-50 text-emerald-700 border border-emerald-100 rounded text-xs font-bold uppercase tracking-wider">
                  Completed
                </div>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">Condition Addressed</p>
                  <p className="text-sm font-semibold text-slate-800 truncate" title={record.data.condition}>
                    {record.data.condition}
                  </p>
                </div>
                <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">Performance Details</p>
                  <p className="text-sm font-semibold text-slate-800 flex items-center gap-1">
                    <Activity size={14} className="text-blue-500" />
                    {record.logs.filter(l => l.type === 'warning').length} AI Interventions
                  </p>
                </div>
              </div>
              
              <details className="group">
                <summary className="text-sm font-bold text-blue-600 cursor-pointer hover:text-blue-700 select-none flex items-center gap-1">
                  View Full Protocol Summary
                </summary>
                <div className="mt-4 p-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm text-slate-700 shadow-inner">
                  <p className="mb-2 italic">"{record.data.summary}"</p>
                  <ul className="list-disc pl-5 mt-2 space-y-1">
                    {record.data.exercises.map((ex, i) => (
                      <li key={i}>
                        <span className="font-semibold text-slate-900">{ex.name}</span> - {ex.duration}
                      </li>
                    ))}
                  </ul>
                </div>
              </details>
            </div>
          ))}
        </div>
      )}
    </motion.div>
  );
}
