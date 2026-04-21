export type Exercise = {
  name: string;
  description: string;
  duration: string;
};

export type ExtractedData = {
  patientName: string;
  condition: string;
  medications: string[];
  exercises: Exercise[];
  summary: string;
};

export type SessionLog = {
  timestamp: Date;
  message: string;
  type: 'info' | 'warning' | 'success' | 'emergency';
};

export type SessionRecord = {
  id: string;
  date: Date;
  data: ExtractedData;
  logs: SessionLog[];
};

export type BiometricProfile = {
  fullName: string;
  age: string;
  bloodType: string;
  height: string;
  weight: string;
  allergies: string;
  emergencyContact: string;
  medicalNotes: string;
};
