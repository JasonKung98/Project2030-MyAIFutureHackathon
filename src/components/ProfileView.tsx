import React, { useState } from 'react';
import { motion } from 'motion/react';
import { BiometricProfile } from '../types';
import { User, Activity, Save, X, HeartPulse } from 'lucide-react';

interface ProfileViewProps {
  profile: BiometricProfile | null;
  onSave: (p: BiometricProfile) => void;
  onCancel: () => void;
}

export default function ProfileView({ profile, onSave, onCancel }: ProfileViewProps) {
  const [formData, setFormData] = useState<BiometricProfile>(profile || {
    fullName: '',
    age: '',
    bloodType: '',
    height: '',
    weight: '',
    allergies: '',
    emergencyContact: '',
    medicalNotes: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-3xl mx-auto"
    >
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
            <HeartPulse className="text-blue-600" />
            Medical Profile & Biometrics
          </h2>
          <p className="text-slate-500 mt-1">This information is vital for configuring your AI routines and emergency medical dispatch payloads.</p>
        </div>
        <button
          onClick={onCancel}
          className="p-2 text-slate-400 hover:text-slate-600 hover:bg-white rounded-full transition-colors"
        >
          <X size={24} />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-3xl shadow-sm border border-slate-200">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <h3 className="font-bold text-slate-800 border-b border-slate-100 pb-2">Personal Details</h3>
            
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Full Name</label>
              <input 
                type="text" required name="fullName" value={formData.fullName} onChange={handleChange}
                className="w-full bg-slate-50 border border-slate-200 text-slate-800 rounded-xl px-4 py-2.5 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all font-medium"
                placeholder="John Doe"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Age</label>
                <input 
                  type="number" name="age" value={formData.age} onChange={handleChange}
                  className="w-full bg-slate-50 border border-slate-200 text-slate-800 rounded-xl px-4 py-2.5 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all font-medium"
                  placeholder="e.g. 45"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Blood Type</label>
                <input 
                  type="text" name="bloodType" value={formData.bloodType} onChange={handleChange}
                  className="w-full bg-slate-50 border border-slate-200 text-slate-800 rounded-xl px-4 py-2.5 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all font-medium"
                  placeholder="e.g. O+"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Height</label>
                <input 
                  type="text" name="height" value={formData.height} onChange={handleChange}
                  className="w-full bg-slate-50 border border-slate-200 text-slate-800 rounded-xl px-4 py-2.5 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all font-medium"
                  placeholder="e.g. 175cm"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Weight</label>
                <input 
                  type="text" name="weight" value={formData.weight} onChange={handleChange}
                  className="w-full bg-slate-50 border border-slate-200 text-slate-800 rounded-xl px-4 py-2.5 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all font-medium"
                  placeholder="e.g. 70kg"
                />
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="font-bold text-slate-800 border-b border-slate-100 pb-2">Emergency & Medical</h3>
            
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Emergency Contact (Name & Phone)</label>
              <input 
                type="text" required name="emergencyContact" value={formData.emergencyContact} onChange={handleChange}
                className="w-full bg-slate-50 border border-slate-200 text-slate-800 rounded-xl px-4 py-2.5 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all font-medium"
                placeholder="Jane Doe - (555) 012-3456"
              />
            </div>
            
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Known Allergies</label>
              <input 
                type="text" name="allergies" value={formData.allergies} onChange={handleChange}
                className="w-full bg-slate-50 border border-slate-200 text-slate-800 rounded-xl px-4 py-2.5 outline-none focus:border-rose-500 focus:ring-2 focus:ring-rose-100 transition-all font-medium"
                placeholder="Penicillin, Peanuts (N/A if none)"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Baseline Medical Notes</label>
              <textarea 
                name="medicalNotes" value={formData.medicalNotes} onChange={handleChange}
                className="w-full bg-slate-50 border border-slate-200 text-slate-800 rounded-xl px-4 py-2.5 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all font-medium min-h-[96px] resize-none"
                placeholder="Relevant chronic conditions, pacemaker, past surgeries..."
              />
            </div>
          </div>
        </div>
        
        <div className="mt-8 pt-6 border-t border-slate-100 flex justify-end gap-3">
          <button 
            type="button"
            onClick={onCancel}
            className="px-6 py-2.5 text-slate-600 font-bold hover:bg-slate-50 rounded-xl transition-colors"
          >
            Cancel
          </button>
          <button 
            type="submit"
            className="px-8 py-2.5 bg-blue-600 shadow-lg shadow-blue-200 hover:bg-blue-700 text-white rounded-xl font-bold transition-colors flex items-center gap-2"
          >
            <Save size={18} />
            Save Profile
          </button>
        </div>
      </form>
    </motion.div>
  );
}
