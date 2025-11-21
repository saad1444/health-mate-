import React from 'react';
import { AppView, MedicalReport, VitalsData } from '../types';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface DashboardProps {
  reports: MedicalReport[];
  vitals: VitalsData[];
  setView: (view: AppView) => void;
  onSelectReport: (report: MedicalReport) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ reports, vitals, setView, onSelectReport }) => {
  
  // Process vitals for chart (simplified for demo: filtering just BP Systolic or Sugar)
  const chartData = vitals
    .filter(v => v.type === 'Sugar' || (v.type === 'BP' && v.value.includes('/')))
    .map(v => ({
      date: new Date(v.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      value: v.type === 'BP' ? parseInt(v.value.split('/')[0]) : parseInt(v.value),
      type: v.type
    }))
    .slice(-5); // Last 5 entries

  return (
    <div className="space-y-6">
      
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-teal-600 to-teal-500 rounded-2xl p-6 text-white shadow-lg">
        <h2 className="text-2xl font-bold mb-2">As-salamu alaykum! 👋</h2>
        <p className="opacity-90 mb-4">Let's manage your family's health records intelligently.</p>
        <div className="flex gap-3">
          <button 
            onClick={() => setView(AppView.UPLOAD)}
            className="bg-white text-teal-700 px-4 py-2 rounded-lg font-semibold text-sm shadow-sm hover:bg-teal-50 transition-colors flex items-center gap-2"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5m-13.5-9L12 3m0 0 4.5 4.5M12 3v13.5" />
            </svg>
            Upload Report
          </button>
          <button 
            onClick={() => setView(AppView.VITALS)}
            className="bg-teal-800 bg-opacity-30 text-white px-4 py-2 rounded-lg font-semibold text-sm hover:bg-opacity-40 transition-colors flex items-center gap-2"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
            Add Vitals
          </button>
        </div>
      </div>

      {/* Recent Reports Section */}
      <section>
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-bold text-gray-800">Recent Reports</h3>
          {reports.length > 0 && <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">{reports.length} Files</span>}
        </div>
        
        {reports.length === 0 ? (
          <div className="text-center py-10 bg-white rounded-xl border border-dashed border-gray-300">
            <p className="text-gray-500 mb-2">No reports uploaded yet.</p>
            <p className="text-sm text-gray-400">Upload lab reports to get AI summaries.</p>
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {reports.map((report) => (
              <div 
                key={report.id} 
                onClick={() => onSelectReport(report)}
                className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow cursor-pointer"
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="bg-blue-50 text-blue-600 p-2 rounded-lg">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
                    </svg>
                  </div>
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    report.status === 'completed' ? 'bg-green-100 text-green-700' : 
                    report.status === 'analyzing' ? 'bg-yellow-100 text-yellow-700' : 'bg-gray-100 text-gray-600'
                  }`}>
                    {report.status}
                  </span>
                </div>
                <h4 className="font-semibold text-gray-800 truncate">{report.title}</h4>
                <p className="text-xs text-gray-500 mb-3">{report.date}</p>
                {report.analysis && (
                  <p className="text-sm text-gray-600 line-clamp-2 border-t pt-2 border-gray-50">
                    {report.analysis.summary_en}
                  </p>
                )}
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Vitals Trend Section */}
      {vitals.length > 0 && (
        <section>
          <h3 className="text-lg font-bold text-gray-800 mb-4">Health Trends (Sugar/BP)</h3>
          <div className="bg-white p-4 rounded-xl shadow-sm h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="date" fontSize={12} stroke="#94a3b8" />
                <YAxis fontSize={12} stroke="#94a3b8" />
                <Tooltip 
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                />
                <Line type="monotone" dataKey="value" stroke="#0d9488" strokeWidth={3} activeDot={{ r: 6 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </section>
      )}
    </div>
  );
};

export default Dashboard;