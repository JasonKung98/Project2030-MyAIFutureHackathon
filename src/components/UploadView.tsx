import React, { useRef, useState, useCallback } from 'react';
import Webcam from 'react-webcam';
import { Camera, Upload, X, FileText } from 'lucide-react';
import { motion } from 'motion/react';

interface UploadViewProps {
  onImageCaptured: (dataUrl: string) => void;
}

export default function UploadView({ onImageCaptured }: UploadViewProps) {
  const [useCamera, setUseCamera] = useState(false);
  const webcamRef = useRef<Webcam>(null);

  const handleCapture = useCallback(() => {
    if (webcamRef.current) {
      const imageSrc = webcamRef.current.getScreenshot();
      if (imageSrc) {
        onImageCaptured(imageSrc);
      }
    }
  }, [webcamRef, onImageCaptured]);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          onImageCaptured(reader.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-2xl mx-auto p-8 bg-white rounded-3xl shadow-sm border border-slate-200"
    >
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <FileText size={32} />
        </div>
        <h2 className="text-2xl font-semibold text-slate-800">Upload Prescription</h2>
        <p className="text-slate-500 mt-2">
          Upload or capture a photo of your medical document to generate a personalized rehabilitation plan.
        </p>
      </div>

      {!useCamera ? (
        <div className="space-y-6">
          <label className="flex flex-col items-center justify-center w-full h-64 border-2 border-slate-300 border-dashed rounded-2xl cursor-pointer bg-slate-50 hover:bg-slate-100 transition-colors group">
            <div className="flex flex-col items-center justify-center pt-5 pb-6">
              <Upload className="w-10 h-10 text-slate-400 group-hover:text-blue-500 mb-3" />
              <p className="mb-2 text-sm text-slate-500"><span className="font-semibold text-blue-600">Click to upload</span> or drag and drop</p>
              <p className="text-xs text-slate-400">PDF, JPG or PNG (MAX. 800x400px)</p>
            </div>
            <input type="file" className="hidden" accept="image/*" onChange={handleFileUpload} />
          </label>
          
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">Or</span>
            </div>
          </div>

          <button
            onClick={() => setUseCamera(true)}
            className="w-full py-3 px-4 flex items-center justify-center gap-2 border-2 border-blue-100 text-blue-600 bg-white hover:bg-blue-50 rounded-xl transition-colors font-bold text-sm shadow-sm"
          >
            <Camera size={20} />
            Use Camera to Scan
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="relative rounded-2xl overflow-hidden bg-slate-900 aspect-video flex items-center justify-center">
            <Webcam
              audio={false}
              ref={webcamRef}
              screenshotFormat="image/jpeg"
              width="100%"
              className="object-cover"
              videoConstraints={{ facingMode: "environment" }}
            />
            <button 
              onClick={() => setUseCamera(false)}
              className="absolute top-4 right-4 p-2 bg-black/50 text-white rounded-full hover:bg-black/70 transition"
            >
              <X size={20} />
            </button>
          </div>
          <button
            onClick={handleCapture}
            className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-lg shadow-blue-200 transition-colors font-bold text-sm"
          >
            Capture Document
          </button>
        </div>
      )}
    </motion.div>
  );
}
