import React, { useState } from 'react';
import { MedicalReport } from '../types';

interface ReportDetailProps {
  report: MedicalReport;
  onBack: () => void;
}

const ReportDetail: React.FC<ReportDetailProps> = ({ report, onBack }) => {
  const [language, setLanguage] = useState<'en' | 'ur'>('ur'); // Default to Urdu/Roman Urdu for "Sehat ka dost" feel

  if (!report.analysis) return null;

  return (
    <div className="bg-white min-h-[80vh] rounded-2xl shadow-lg flex flex-col md:flex-row overflow-hidden">
      
      {/* Left Side: Image & Basics */}
      <div className="md:w-1/3 bg-gray-50 p-6 border-r border-gray-200 flex flex-col">
        <button 
          onClick={onBack} 
          className="mb-4 flex items-center text-gray-500 hover:text-teal-600 transition-colors text-sm font-medium"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4 mr-1">
            <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
          </svg>
          Back to Dashboard
        </button>

        <h2 className="text-xl font-bold text-gray-900 mb-1">{report.title}</h2>
        <p className="text-sm text-gray-500 mb-4">{report.date}</p>

        <div className="flex-grow bg-white rounded-lg border border-gray-200 overflow-hidden p-2 flex items-center justify-center">
          <img 
            src={report.imageUri} 
            alt="Report" 
            className="max-w-full max-h-[400px] object-contain"
          />
        </div>
      </div>

      {/* Right Side: Analysis */}
      <div className="md:w-2/3 p-6 md:p-8 overflow-y-auto">
        
        {/* Language Toggle */}
        <div className="flex justify-end mb-6">
           <div className="bg-gray-100 p-1 rounded-lg flex">
             <button 
               onClick={() => setLanguage('en')}
               className={`px-4 py-1.5 text-sm font-medium rounded-md transition-all ${language === 'en' ? 'bg-white text-teal-700 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
             >
               English
             </button>
             <button 
               onClick={() => setLanguage('ur')}
               className={`px-4 py-1.5 text-sm font-medium rounded-md transition-all ${language === 'ur' ? 'bg-white text-teal-700 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
             >
               Roman Urdu
             </button>
           </div>
        </div>

        {/* AI Summary Block */}
        <div className="mb-8">
          <h3 className="flex items-center gap-2 text-lg font-bold text-teal-800 mb-3">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-teal-500">
              <path fillRule="evenodd" d="M9 4.5a.75.75 0 0 1 .721.544l.813 2.846a3.75 3.75 0 0 0 2.576 2.576l2.846.813a.75.75 0 0 1 0 1.442l-2.846.813a3.75 3.75 0 0 0-2.576 2.576l-.813 2.846a.75.75 0 0 1-1.442 0l-.813-2.846a3.75 3.75 0 0 0-2.576-2.576l-2.846-.813a.75.75 0 0 1 0-1.442l2.846-.813a3.75 3.75 0 0 0 2.576-2.576l.813-2.846A.75.75 0 0 1 9 4.5ZM9 15a.75.75 0 0 1 .75.75v1.5h1.5a.75.75 0 0 1 0 1.5h-1.5v1.5a.75.75 0 0 1-1.5 0v-1.5h-1.5a.75.75 0 0 1 0-1.5h1.5v-1.5A.75.75 0 0 1 9 15ZM15 9a.75.75 0 0 1 .75.75v1.5h1.5a.75.75 0 0 1 0 1.5h-1.5v1.5a.75.75 0 0 1-1.5 0v-1.5h-1.5a.75.75 0 0 1 0-1.5h1.5v-1.5A.75.75 0 0 1 15 9Z" clipRule="evenodd" />
            </svg>
            AI Summary
          </h3>
          <div className="bg-teal-50 p-5 rounded-xl border border-teal-100 text-gray-800 leading-relaxed">
            {language === 'en' ? report.analysis.summary_en : report.analysis.summary_ur}
          </div>
        </div>

        {/* Two Column Layout for details */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          
          {/* Abnormalities */}
          {report.analysis.abnormalities.length > 0 && (
            <div className="bg-red-50 p-5 rounded-xl border border-red-100">
              <h4 className="font-bold text-red-800 mb-3 flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
                  <path fillRule="evenodd" d="M18 10a8 8 0 1 1-16 0 8 8 0 0 1 16 0Zm-8-5a.75.75 0 0 1 .75.75v4.5a.75.75 0 0 1-1.5 0v-4.5A.75.75 0 0 1 10 5Zm0 10a1 1 0 1 0 0-2 1 1 0 0 0 0 2Z" clipRule="evenodd" />
                </svg>
                Attention Needed
              </h4>
              <ul className="space-y-2">
                {report.analysis.abnormalities.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-sm text-red-700">
                    <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-red-400 flex-shrink-0"></span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Doctor Questions */}
          <div className="bg-blue-50 p-5 rounded-xl border border-blue-100">
            <h4 className="font-bold text-blue-800 mb-3 flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
                <path fillRule="evenodd" d="M18 10a8 8 0 1 1-16 0 8 8 0 0 1 16 0Zm-7-4a1 1 0 1 1-2 0 1 1 0 0 1 2 0ZM9 9a.75.75 0 0 0 0 1.5h.253a.25.25 0 0 1 .244.304l-.459 2.066A1.75 1.75 0 0 0 10.747 15H11a.75.75 0 0 0 0-1.5h-.253a.25.25 0 0 1-.244-.304l.459-2.066A1.75 1.75 0 0 0 9.253 9H9Z" clipRule="evenodd" />
              </svg>
              Ask Your Doctor
            </h4>
            <ul className="space-y-2">
              {report.analysis.doctor_questions.map((q, idx) => (
                <li key={idx} className="flex items-start gap-2 text-sm text-blue-700">
                  <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-blue-400 flex-shrink-0"></span>
                  {q}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Lifestyle & Diet */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
            <div className="p-5 border border-gray-200 rounded-xl">
                <h4 className="font-bold text-gray-800 mb-2">Diet Advice</h4>
                <p className="text-sm text-gray-600">{report.analysis.diet_advice}</p>
            </div>
            <div className="p-5 border border-gray-200 rounded-xl">
                <h4 className="font-bold text-gray-800 mb-2">Home Remedies</h4>
                <p className="text-sm text-gray-600">{report.analysis.home_remedies}</p>
            </div>
        </div>

        {/* Disclaimer */}
        <div className="bg-yellow-50 p-4 rounded-lg border-l-4 border-yellow-400">
            <p className="text-sm text-yellow-800 italic">
                {report.analysis.disclaimer}
            </p>
        </div>

      </div>
    </div>
  );
};

export default ReportDetail;