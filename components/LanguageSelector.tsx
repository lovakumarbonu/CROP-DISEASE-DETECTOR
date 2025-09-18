import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { languages } from '../translations';
import { GlobeIcon } from './Icons';

const LanguageSelector: React.FC = () => {
  const { language, setLanguage } = useLanguage();

  const handleLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setLanguage(e.target.value);
  };

  return (
    <div className="relative inline-block text-left">
      <div className="group">
        <label htmlFor="language-select" className="sr-only">Select Language</label>
        <div className="flex items-center">
            <GlobeIcon className="w-5 h-5 text-slate-400 absolute left-3 z-10 pointer-events-none" />
            <select
            id="language-select"
            value={language}
            onChange={handleLanguageChange}
            className="appearance-none w-full bg-slate-800/80 border border-slate-700 text-slate-300 py-2 pl-10 pr-4 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 transition-colors cursor-pointer"
            >
            {languages.map((lang) => (
                <option key={lang.code} value={lang.code}>
                {lang.nativeName}
                </option>
            ))}
            </select>
        </div>
      </div>
    </div>
  );
};

export default LanguageSelector;
