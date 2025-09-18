
import React from 'react';
import type { Section } from '../types';

interface SectionCardProps {
  section: Section;
}

const SectionCard: React.FC<SectionCardProps> = ({ section }) => {
  return (
    <div className="flex flex-col bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl overflow-hidden h-full transition-shadow hover:shadow-2xl hover:shadow-green-500/10">
      <div className="p-6">
        <div className="flex items-center mb-4">
          <div className="text-green-400 mr-4">{React.cloneElement(section.icon, { className: 'w-8 h-8' })}</div>
          <h3 className="text-xl font-bold text-slate-100">{section.title}</h3>
        </div>
      </div>
      <div className="px-6 pb-6 space-y-6 flex-grow">
        {section.categories.map((cat, index) => (
          <div key={`${cat.category}-${index}`}>
            <h4 className="font-semibold text-green-400 mb-2">{cat.category}</h4>
            <ul className="space-y-2">
              {cat.items.map((item) => (
                <li key={item.name} className="flex items-start">
                  <span className="text-green-500 mr-2 mt-1">▪</span>
                  <div>
                    <span className="font-medium text-slate-200">{item.name}</span>
                    <span className="text-slate-400 text-sm"> - {item.description}</span>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SectionCard;
