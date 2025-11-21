import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import Dashboard from './components/Dashboard';
import UploadReport from './components/UploadReport';
import ReportDetail from './components/ReportDetail';
import VitalsForm from './components/VitalsForm';
import { AppView, MedicalReport, VitalsData } from './types';

const App: React.FC = () => {
  const [currentView, setView] = useState<AppView>(AppView.DASHBOARD);
  
  // State for Data
  const [reports, setReports] = useState<MedicalReport[]>([]);
  const [vitals, setVitals] = useState<VitalsData[]>([]);
  const [selectedReport, setSelectedReport] = useState<MedicalReport | null>(null);

  // Load initial sample data if empty (Mocking persistence)
  useEffect(() => {
    const hasData = vitals.length > 0;
    if (!hasData) {
        setVitals([
            { id: '1', date: '2023-10-01', type: 'BP', value: '120/80', unit: 'mmHg' },
            { id: '2', date: '2023-10-05', type: 'Sugar', value: '95', unit: 'mg/dL' },
            { id: '3', date: '2023-10-10', type: 'BP', value: '130/85', unit: 'mmHg' },
            { id: '4', date: '2023-10-12', type: 'Sugar', value: '110', unit: 'mg/dL' },
        ]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleUploadComplete = (newReport: MedicalReport) => {
    setReports(prev => [newReport, ...prev]);
    setSelectedReport(newReport);
    setView(AppView.REPORT_DETAIL);
  };

  const handleAddVital = (newVital: VitalsData) => {
    setVitals(prev => [...prev, newVital]);
  };

  const handleSelectReport = (report: MedicalReport) => {
    setSelectedReport(report);
    setView(AppView.REPORT_DETAIL);
  };

  const renderContent = () => {
    switch (currentView) {
      case AppView.DASHBOARD:
        return (
          <Dashboard 
            reports={reports} 
            vitals={vitals} 
            setView={setView} 
            onSelectReport={handleSelectReport}
          />
        );
      case AppView.UPLOAD:
        return (
          <UploadReport 
            onUploadComplete={handleUploadComplete} 
            onCancel={() => setView(AppView.DASHBOARD)} 
          />
        );
      case AppView.REPORT_DETAIL:
        if (!selectedReport) return <div className="text-center mt-10">No Report Selected</div>;
        return (
          <ReportDetail 
            report={selectedReport} 
            onBack={() => setView(AppView.DASHBOARD)}
          />
        );
      case AppView.VITALS:
        return (
          <VitalsForm 
            onAddVital={handleAddVital} 
            vitalsList={vitals} 
            onBack={() => setView(AppView.DASHBOARD)}
          />
        );
      default:
        return <div>Not Found</div>;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 text-gray-900">
      <Header currentView={currentView} setView={setView} />
      
      <main className="flex-grow max-w-5xl mx-auto w-full p-4 md:p-6">
        {renderContent()}
      </main>

      <footer className="bg-white border-t border-gray-200 py-6 text-center">
        <p className="text-sm text-gray-500">© 2023 HealthMate. Made with ❤️ for Families.</p>
        <p className="text-xs text-gray-400 mt-1">Disclaimer: AI advice is for informational purposes only. Consult a doctor.</p>
      </footer>
    </div>
  );
};

export default App;