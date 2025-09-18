import React from 'react';
import type { HistoryItem } from '../types';
import { useLanguage } from '../contexts/LanguageContext';
import { CheckCircleIcon, ExclamationTriangleIcon, TrashIcon } from './Icons';

interface HistoryProps {
  history: HistoryItem[];
  onSelect: (item: HistoryItem) => void;
  onDelete: (id: string) => void;
  onClearAll: () => void;
}

const History: React.FC<HistoryProps> = ({ history, onSelect, onDelete, onClearAll }) => {
  const { translations } = useLanguage();

  const handleClearAllClick = () => {
    if (window.confirm(translations.confirmClearHistory)) {
      onClearAll();
    }
  };

  if (history.length === 0) {
    return (
      <div className="text-center py-16 text-slate-500 animate-fade-in">
        <p className="text-xl">{translations.noHistory}</p>
      </div>
    );
  }

  return (
    <div className="animate-fade-in">
      <div className="flex justify-end mb-4">
        <button
          onClick={handleClearAllClick}
          className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-red-400 bg-red-900/20 border border-red-500/30 rounded-lg hover:bg-red-900/40 focus:outline-none focus:ring-2 focus:ring-red-500 transition-colors"
          aria-label={translations.clearHistory}
        >
          <TrashIcon className="w-4 h-4" />
          <span>{translations.clearHistory}</span>
        </button>
      </div>
      <div className="space-y-4">
        {history.map((item) => {
          const healthyCount = item.results.filter(r => r.is_healthy).length;
          const diseaseCount = item.results.length - healthyCount;

          return (
            <div 
              key={item.id} 
              className="bg-slate-800/50 border border-slate-700 rounded-lg p-4 flex items-center gap-4 transform transition-all duration-300 ease-in-out hover:bg-slate-800 hover:border-green-500/30 hover:-translate-y-1 hover:shadow-xl hover:shadow-green-500/10"
            >
              <img 
                  src={item.imagePreviewUrl} 
                  alt="Analysis thumbnail" 
                  className="w-20 h-20 sm:w-24 sm:h-24 object-cover rounded-md cursor-pointer"
                  onClick={() => onSelect(item)}
              />
              <div className="flex-grow cursor-pointer" onClick={() => onSelect(item)}>
                <p className="font-bold text-slate-200">{translations.historyCardTitle} {new Date(item.id).toLocaleDateString()}</p>
                <p className="text-sm text-slate-400">{new Date(item.id).toLocaleTimeString()}</p>
                <div className="flex items-center gap-4 mt-2">
                  {healthyCount > 0 && (
                      <span className="flex items-center gap-1 text-xs text-green-400">
                          <CheckCircleIcon className="w-4 h-4" /> {healthyCount} {translations.historyHealthy}
                      </span>
                  )}
                  {diseaseCount > 0 && (
                      <span className="flex items-center gap-1 text-xs text-amber-400">
                          <ExclamationTriangleIcon className="w-4 h-4" /> {diseaseCount} {translations.historyIssues}
                      </span>
                  )}
                </div>
              </div>
              <button
                onClick={(e) => {
                    e.stopPropagation();
                    onDelete(item.id);
                }}
                aria-label={translations.deleteEntry}
                className="p-2 text-slate-500 hover:text-red-400 hover:bg-red-900/50 rounded-full transition-colors"
              >
                <TrashIcon />
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default History;