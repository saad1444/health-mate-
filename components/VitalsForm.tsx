import React, { useState } from 'react';
import { VitalsData, AppView } from '../types';

interface VitalsFormProps {
  onAddVital: (vital: VitalsData) => void;
  vitalsList: VitalsData[];
  onBack: () => void;
}

const VitalsForm: React.FC<VitalsFormProps> = ({ onAddVital, vitalsList, onBack }) => {
  const [type, setType] = useState<VitalsData['type']>('BP');
  const [value, setValue] = useState('');
  const [date, setDate] = useState(new Date().toISOString().substring(0, 10));

  const getUnit = (t: string) => {
    switch (t) {
      case 'BP': return 'mmHg';
      case 'Sugar': return 'mg/dL';
      case 'Weight': return 'kg';
      case 'HeartRate': return 'bpm';
      case 'Temp': return '°F';
      default: return '';
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!value) return;

    const newVital: VitalsData = {
      id: Date.now().toString(),
      date: date,
      type,
      value,
      unit: getUnit(type)
    };

    onAddVital(newVital);
    setValue('');
  };

  return (
    <div className="grid md:grid-cols-3 gap-6">
      
      {/* Form Column */}
      <div className="md:col-span-1 bg-white p-6 rounded-xl shadow-sm h-fit">
        <h3 className="text-lg font-bold text-gray-800 mb-4">Add Vital Reading</h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
            <select 
              value={type} 
              onChange={(e) => {
                  setType(e.target.value as any);
                  setValue('');
              }}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-teal-500 focus:border-teal-500"
            >
              <option value="BP">Blood Pressure (BP)</option>
              <option value="Sugar">Blood Sugar</option>
              <option value="Weight">Weight</option>
              <option value="HeartRate">Heart Rate</option>
              <option value="Temp">Temperature</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
            <input 
              type="date" 
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-teal-500 focus:border-teal-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Value ({getUnit(type)})
            </label>
            <input 
              type="text" 
              value={value}
              onChange={(e) => setValue(e.target.value)}
              placeholder={type === 'BP' ? '120/80' : 'e.g. 98'}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-teal-500 focus:border-teal-500"
            />
          </div>

          <button 
            type="submit"
            className="w-full bg-teal-600 text-white font-medium py-2 rounded-lg hover:bg-teal-700 transition-colors"
          >
            Save Entry
          </button>
        </form>
      </div>

      {/* History Column */}
      <div className="md:col-span-2">
         <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-bold text-gray-800">History</h3>
            <button onClick={onBack} className="text-sm text-teal-600 hover:underline">
                Back to Dashboard
            </button>
         </div>

         <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Value</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {vitalsList.length === 0 ? (
                  <tr>
                    <td colSpan={3} className="px-6 py-10 text-center text-gray-400 text-sm">
                      No vitals recorded yet.
                    </td>
                  </tr>
                ) : (
                  vitalsList.sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime()).map((vital) => (
                    <tr key={vital.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{vital.date}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{vital.type}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{vital.value} <span className="text-xs text-gray-400">{vital.unit}</span></td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
         </div>
      </div>
    </div>
  );
};

export default VitalsForm;