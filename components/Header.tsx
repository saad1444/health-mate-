import React from 'react';
import { AppView } from '../types';

interface HeaderProps {
  currentView: AppView;
  setView: (view: AppView) => void;
}

const Header: React.FC<HeaderProps> = ({ currentView, setView }) => {
  return (
    <header className="bg-teal-700 text-white shadow-md sticky top-0 z-50">
      <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
        <div 
          className="flex items-center gap-2 cursor-pointer" 
          onClick={() => setView(AppView.DASHBOARD)}
        >
          <div className="bg-white text-teal-700 p-1.5 rounded-full">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" />
            </svg>
          </div>
          <div>
            <h1 className="font-bold text-lg leading-none">HealthMate</h1>
            <p className="text-xs text-teal-100">Sehat ka Smart Dost</p>
          </div>
        </div>

        <nav className="flex gap-4">
          <button 
            onClick={() => setView(AppView.DASHBOARD)}
            className={`text-sm font-medium transition-colors ${currentView === AppView.DASHBOARD ? 'text-white border-b-2 border-white pb-0.5' : 'text-teal-100 hover:text-white'}`}
          >
            Home
          </button>
          <button 
            onClick={() => setView(AppView.VITALS)}
            className={`text-sm font-medium transition-colors ${currentView === AppView.VITALS ? 'text-white border-b-2 border-white pb-0.5' : 'text-teal-100 hover:text-white'}`}
          >
            Vitals
          </button>
        </nav>
      </div>
    </header>
  );
};

export default Header;