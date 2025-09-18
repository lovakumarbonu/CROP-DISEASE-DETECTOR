import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import LanguageSelector from './LanguageSelector';
import { ScanIcon, HistoryIcon } from './Icons';

interface HeaderProps {
    activeView: 'scanner' | 'history';
    setActiveView: (view: 'scanner' | 'history') => void;
}

const Header: React.FC<HeaderProps> = ({ activeView, setActiveView }) => {
  const { translations } = useLanguage();

  const navButtonClasses = (view: 'scanner' | 'history') => 
    `flex items-center gap-2 px-4 py-2 text-sm sm:text-base font-medium rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-green-400 ${
        activeView === view 
        ? 'bg-green-500/20 text-green-300' 
        : 'text-slate-400 hover:bg-slate-700/50 hover:text-slate-200'
    }`;

  return (
    <header className="text-center mb-8 relative pb-16">
      <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-green-300 via-emerald-400 to-teal-500">
        {translations.appTitle}
      </h1>
      <p className="mt-4 text-lg sm:text-xl text-slate-400 max-w-3xl mx-auto">
        {translations.appSubtitle}
      </p>

      <div className="mt-8 flex justify-center">
        <div className="flex space-x-2 bg-slate-800/80 border border-slate-700 p-1.5 rounded-lg">
            <button className={navButtonClasses('scanner')} onClick={() => setActiveView('scanner')}>
                <ScanIcon />
                {translations.scannerTab}
            </button>
            <button className={navButtonClasses('history')} onClick={() => setActiveView('history')}>
                <HistoryIcon />
                {translations.historyTab}
            </button>
        </div>
      </div>

      <div className="absolute bottom-0 right-0">
         <LanguageSelector />
      </div>
    </header>
  );
};

export default Header;
