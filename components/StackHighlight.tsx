
import React from 'react';
import type { StackItem } from '../types';

interface StackHighlightProps {
  stack: StackItem[];
}

const StackHighlight: React.FC<StackHighlightProps> = ({ stack }) => {
  return (
    <div className="relative p-8 rounded-xl bg-slate-800/50 backdrop-blur-sm border border-slate-700 overflow-hidden">
        <div className="absolute -top-px left-20 right-11 h-px bg-gradient-to-r from-green-300/0 via-green-300/70 to-green-300/0"></div>
        <div className="absolute -bottom-px left-11 right-20 h-px bg-gradient-to-r from-emerald-400/0 via-emerald-400 to-emerald-400/0"></div>
      <h2 className="text-center text-2xl sm:text-3xl font-bold text-slate-100 mb-8">
        <span role="img" aria-label="lightning bolt">⚡️</span> Suggested Hackathon Stack
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
        {stack.map((item) => (
          <div key={item.category} className="flex flex-col items-center text-center p-4 bg-slate-800 rounded-lg transition-transform transform hover:-translate-y-1">
            <div className="mb-3">{item.icon}</div>
            <h3 className="font-semibold text-green-400">{item.category}</h3>
            <p className="text-sm text-slate-400 mt-1">{item.tool}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default StackHighlight;
