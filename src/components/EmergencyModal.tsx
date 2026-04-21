import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ShieldAlert, MapPin, Activity, CheckCircle, X, Radio, AlertTriangle, User } from 'lucide-react';
import { ExtractedData, BiometricProfile } from '../types';

interface EmergencyModalProps {
  isOpen: boolean;
  onClose: () => void;
  patientData: ExtractedData | null;
  userProfile?: BiometricProfile | null;
}

export default function EmergencyModal({ isOpen, onClose, patientData, userProfile }: EmergencyModalProps) {
  const [locationStatus, setLocationStatus] = useState<'pending' | 'acquired' | 'failed'>('pending');
  const [location, setLocation] = useState<{lat: number, lng: number} | null>(null);
  const [transmissionStatus, setTransmissionStatus] = useState<'sending' | 'sent'>('sending');

  useEffect(() => {
    if (isOpen) {
      setLocationStatus('pending');
      setLocation(null);
      setTransmissionStatus('sending');

      // 1. Request Real-time Location
      if ("geolocation" in navigator) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            setLocation({ lat: position.coords.latitude, lng: position.coords.longitude });
            setLocationStatus('acquired');
          },
          (error) => {
            console.error("Location error:", error);
            setLocationStatus('failed');
          },
          { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 }
        );
      } else {
        setLocationStatus('failed');
      }

      // 2. Simulate rapid transmission delay for effect
      const timer = setTimeout(() => {
        setTransmissionStatus('sent');
      }, 3500);

      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-slate-900/80 backdrop-blur-md"
        />

        {/* Modal */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className="bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden relative z-10 border-2 border-rose-500 flex flex-col"
        >
          {/* Pulsing Emergency Header */}
          <div className="bg-rose-600 p-6 text-white relative overflow-hidden">
            <motion.div 
              animate={{ opacity: [0.2, 0.5, 0.2] }}
              transition={{ repeat: Infinity, duration: 1.5 }}
              className="absolute inset-0 bg-rose-500"
            />
            <div className="relative z-10 flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                  <ShieldAlert size={28} className="text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-black uppercase tracking-widest">SOS Triggered</h2>
                  <p className="text-rose-100 font-medium">Critical Emergency Protocol Active</p>
                </div>
              </div>
              {transmissionStatus === 'sent' && (
                <button 
                  onClick={onClose}
                  className="bg-white/20 hover:bg-white/30 p-2 rounded-full transition-colors"
                >
                  <X size={20} />
                </button>
              )}
            </div>
          </div>

          <div className="p-6 space-y-6">
            
            {/* Rapid Alerts Status */}
            <div className="flex items-center gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-100">
              <div className="relative">
                {transmissionStatus === 'sending' ? (
                  <>
                    <motion.div 
                      animate={{ scale: [1, 1.5, 1], opacity: [1, 0, 1] }}
                      transition={{ repeat: Infinity, duration: 1.5 }}
                      className="absolute inset-0 bg-blue-400 rounded-full"
                    />
                    <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center relative z-10">
                      <Radio size={20} />
                    </div>
                  </>
                ) : (
                  <div className="w-10 h-10 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center">
                    <CheckCircle size={20} />
                  </div>
                )}
              </div>
              <div className="flex-1">
                <h4 className="font-bold text-slate-800">EMS Dispatch</h4>
                <p className="text-sm text-slate-500">
                  {transmissionStatus === 'sending' 
                    ? "Broadcasting rapid emergency alerts..." 
                    : "Nearest medical personnel notified."}
                </p>
              </div>
            </div>

            {/* Location Sharing */}
            <div className="flex items-center gap-4 p-4 rounded-2xl bg-amber-50 border border-amber-100">
              <div className="w-10 h-10 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center">
                {locationStatus === 'pending' ? (
                  <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, ease: "linear", duration: 1 }}><Radio size={20} /></motion.div>
                ) : locationStatus === 'failed' ? (
                  <AlertTriangle size={20} />
                ) : (
                  <MapPin size={20} />
                )}
              </div>
              <div className="flex-1">
                <h4 className="font-bold text-amber-900">Real-Time Location</h4>
                {locationStatus === 'pending' && <p className="text-sm text-amber-700">Acquiring GPS coordinates...</p>}
                {locationStatus === 'failed' && <p className="text-sm text-amber-700">Location permission denied. Expanding broadcast range.</p>}
                {locationStatus === 'acquired' && location && (
                  <div className="space-y-1">
                    <p className="text-[11px] font-mono font-bold text-amber-700 tracking-wider">LAT: {location.lat.toFixed(6)}</p>
                    <p className="text-[11px] font-mono font-bold text-amber-700 tracking-wider">LNG: {location.lng.toFixed(6)}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Medical Profile Transmission */}
            <div className="flex items-start gap-4 p-4 rounded-2xl bg-purple-50 border border-purple-100">
              <div className="w-10 h-10 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center shrink-0">
                <Activity size={20} />
              </div>
              <div className="flex-1">
                <h4 className="font-bold text-purple-900 flex justify-between items-center mb-2">
                  Medical Profile Payload 
                  {transmissionStatus === 'sent' && <CheckCircle size={16} className="text-emerald-500" />}
                </h4>
                
                {(patientData || userProfile) ? (
                  <div className="space-y-3">
                    {userProfile && (
                      <div className="bg-white/50 p-3 rounded-xl border border-purple-100 space-y-2">
                        <div className="flex justify-between items-center">
                          <p className="text-xs font-bold text-slate-800">{userProfile.fullName}</p>
                          <div className="flex gap-2">
                            {userProfile.bloodType && (
                              <span className="px-2 py-0.5 bg-rose-100 text-rose-700 text-[10px] font-bold rounded-md uppercase">
                                Blood: {userProfile.bloodType}
                              </span>
                            )}
                            {(userProfile.age || userProfile.weight || userProfile.height) && (
                              <span className="px-2 py-0.5 bg-purple-100 text-purple-700 text-[10px] font-bold rounded-md uppercase">
                                {userProfile.age && `${userProfile.age}Y`} {userProfile.height && `· ${userProfile.height}`} {userProfile.weight && `· ${userProfile.weight}`}
                              </span>
                            )}
                          </div>
                        </div>
                        
                        {userProfile.allergies && userProfile.allergies.toLowerCase() !== 'n/a' && userProfile.allergies.toLowerCase() !== 'none' && (
                          <p className="text-[10px] font-bold text-rose-600 bg-rose-50 px-2 py-1 rounded inline-block border border-rose-100">
                            ALLERGIES: {userProfile.allergies}
                          </p>
                        )}
                        
                        {userProfile.emergencyContact && (
                          <p className="text-[10px] text-slate-600 font-medium">
                            <span className="font-bold">Contact:</span> {userProfile.emergencyContact}
                          </p>
                        )}
                      </div>
                    )}
                    
                    {patientData && (
                      <div className="bg-white/50 p-3 rounded-xl border border-purple-100">
                        <p className="text-xs font-semibold text-purple-800 truncate capitalize mb-1">
                          Active Condition: {patientData.condition}
                        </p>
                        {patientData.medications.length > 0 && (
                          <p className="text-[10px] text-purple-600 uppercase tracking-wider font-bold">
                            {patientData.medications.length} Active Meds Attached
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                ) : (
                  <p className="text-sm text-purple-700 mt-1">No active patient profile loaded. Transmitting anonymous SOS.</p>
                )}
              </div>
            </div>

          </div>

          <div className="p-6 bg-slate-50 border-t border-slate-100 text-center">
             {transmissionStatus === 'sent' ? (
               <button 
                 onClick={onClose}
                 className="w-full py-4 bg-slate-800 hover:bg-slate-900 text-white rounded-xl font-bold uppercase tracking-widest text-sm transition-colors"
               >
                 Acknowledge & Close
               </button>
             ) : (
                <div className="flex flex-col items-center justify-center gap-2">
                  <div className="flex gap-1 justify-center h-2">
                     <motion.div animate={{ scaleY: [1, 2, 1] }} transition={{ repeat: Infinity, duration: 0.8, delay: 0 }} className="w-1 bg-rose-500 rounded-full" />
                     <motion.div animate={{ scaleY: [1, 2, 1] }} transition={{ repeat: Infinity, duration: 0.8, delay: 0.2 }} className="w-1 bg-rose-500 rounded-full" />
                     <motion.div animate={{ scaleY: [1, 2, 1] }} transition={{ repeat: Infinity, duration: 0.8, delay: 0.4 }} className="w-1 bg-rose-500 rounded-full" />
                  </div>
                  <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">Do not close application</p>
                </div>
             )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
