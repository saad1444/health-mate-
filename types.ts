export interface VitalsData {
  id: string;
  date: string;
  type: 'BP' | 'Sugar' | 'Weight' | 'HeartRate' | 'Temp';
  value: string; // e.g. "120/80", "95", "75"
  unit: string; // e.g. "mmHg", "mg/dL", "kg"
  notes?: string;
}

export interface AIAnalysisResult {
  summary_en: string;
  summary_ur: string;
  abnormalities: string[];
  doctor_questions: string[];
  diet_advice: string;
  home_remedies: string;
  disclaimer: string;
}

export interface MedicalReport {
  id: string;
  title: string;
  date: string;
  imageUri: string; // Base64 string
  analysis: AIAnalysisResult | null;
  status: 'pending' | 'analyzing' | 'completed' | 'failed';
}

export enum AppView {
  DASHBOARD = 'DASHBOARD',
  UPLOAD = 'UPLOAD',
  VITALS = 'VITALS',
  REPORT_DETAIL = 'REPORT_DETAIL',
}