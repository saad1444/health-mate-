import React, { useState, useRef } from 'react';
import { MedicalReport, AIAnalysisResult } from '../types';
import { analyzeMedicalReport } from '../services/geminiService';

interface UploadReportProps {
  onUploadComplete: (report: MedicalReport) => void;
  onCancel: () => void;
}

const UploadReport: React.FC<UploadReportProps> = ({ onUploadComplete, onCancel }) => {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [reportTitle, setReportTitle] = useState("");
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      setFile(selectedFile);
      setReportTitle(selectedFile.name.split('.')[0]);
      setError(null);

      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(selectedFile);
    }
  };

  const handleAnalyze = async () => {
    if (!file || !preview) {
      setError("Please select a file first.");
      return;
    }

    setIsAnalyzing(true);
    setError(null);

    try {
      const analysis = await analyzeMedicalReport(preview);
      
      const newReport: MedicalReport = {
        id: Date.now().toString(),
        title: reportTitle || "Medical Report",
        date: new Date().toLocaleDateString(),
        imageUri: preview,
        analysis: analysis,
        status: 'completed'
      };

      onUploadComplete(newReport);
    } catch (err) {
      console.error(err);
      setError("Failed to analyze report. Please try again. Ensure the image is clear.");
    } else {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-lg overflow-hidden">
      <div className="p-6 border-b border-gray-100 flex justify-between items-center">
        <h2 className="text-xl font-bold text-gray-800">Upload & Analyze</h2>
        <button onClick={onCancel} className="text-gray-400 hover:text-gray-600">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <div className="p-6 space-y-6">
        {/* File Input Area */}
        <div 
          className={`border-2 border-dashed rounded-xl p-8 text-center transition-colors cursor-pointer ${
            file ? 'border-teal-500 bg-teal-50' : 'border-gray-300 hover:border-teal-400'
          }`}
          onClick={() => fileInputRef.current?.click()}
        >
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleFileChange} 
            accept="image/*"
            className="hidden" 
          />
          
          {preview ? (
            <div className="relative">
               <img src={preview} alt="Preview" className="max-h-64 mx-auto rounded-lg shadow-sm object-contain" />
               <div className="mt-4 text-teal-700 font-medium text-sm">Click to change image</div>
            </div>
          ) : (
            <div className="space-y-2">
              <div className="mx-auto w-12 h-12 bg-teal-100 text-teal-600 rounded-full flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5m-13.5-9L12 3m0 0 4.5 4.5M12 3v13.5" />
                </svg>
              </div>
              <p className="text-gray-700 font-medium">Tap to upload Lab Report / Prescription</p>
              <p className="text-xs text-gray-400">Supports: JPG, PNG</p>
            </div>
          )}
        </div>

        {/* Name Input */}
        {file && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Report Name</label>
            <input 
              type="text" 
              value={reportTitle}
              onChange={(e) => setReportTitle(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none"
              placeholder="e.g., CBC Blood Test"
            />
          </div>
        )}

        {error && (
          <div className="p-3 bg-red-50 text-red-600 text-sm rounded-lg flex items-center gap-2">
             <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
                <path fillRule="evenodd" d="M18 10a8 8 0 1 1-16 0 8 8 0 0 1 16 0Zm-8-5a.75.75 0 0 1 .75.75v4.5a.75.75 0 0 1-1.5 0v-4.5A.75.75 0 0 1 10 5Zm0 10a1 1 0 1 0 0-2 1 1 0 0 0 0 2Z" clipRule="evenodd" />
              </svg>
             {error}
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-3">
          <button 
            onClick={onCancel}
            disabled={isAnalyzing}
            className="flex-1 px-4 py-3 text-gray-700 font-medium bg-gray-100 rounded-xl hover:bg-gray-200 transition-colors disabled:opacity-50"
          >
            Cancel
          </button>
          <button 
            onClick={handleAnalyze}
            disabled={!file || isAnalyzing}
            className="flex-1 px-4 py-3 text-white font-medium bg-teal-600 rounded-xl shadow-md hover:bg-teal-700 transition-colors disabled:opacity-50 flex justify-center items-center gap-2"
          >
            {isAnalyzing ? (
              <>
                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Reading Report...
              </>
            ) : (
              <>
                 <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09ZM18.259 8.715 18 9.75l-.259-1.035a3.375 3.375 0 0 0-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 0 0 2.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 0 0 2.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 0 0-2.456 2.456ZM16.894 20.567 16.5 21.75l-.394-1.183a2.25 2.25 0 0 0-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 0 0 1.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 0 0 1.423 1.423l1.183.394-1.183.394a2.25 2.25 0 0 0-1.423 1.423Z" />
                </svg>
                Ask AI to Explain
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default UploadReport;