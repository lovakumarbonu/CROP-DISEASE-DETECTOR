import React, { useState, useEffect } from 'react';
import { LeafSpinnerIcon } from './Icons';
import { useLanguage } from '../contexts/LanguageContext';

const Spinner: React.FC = () => {
  const { translations } = useLanguage();
  
  const messages = [
    translations.spinnerAnalyzing,
    translations.spinnerMessage1,
    translations.spinnerMessage2,
    translations.spinnerMessage3,
  ].filter(Boolean); // Filter out any potentially undefined translations during initial load

  const [currentMessage, setCurrentMessage] = useState(messages[0] || translations.spinnerAnalyzing);
  const [key, setKey] = useState(0);

  useEffect(() => {
    const validMessages = messages.length > 0 ? messages : [translations.spinnerAnalyzing];
    let index = 0;
    
    const interval = setInterval(() => {
      index = (index + 1) % validMessages.length;
      setCurrentMessage(validMessages[index]);
      setKey(prevKey => prevKey + 1); // Reset animation
    }, 2500);

    return () => clearInterval(interval);
  }, [messages, translations.spinnerAnalyzing]);


  return (
    <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-sm flex flex-col justify-center items-center z-50 animate-fade-in">
        <LeafSpinnerIcon />
        <p key={key} className="text-green-400 text-lg font-semibold mt-4 text-center px-4 animate-fade-in">{currentMessage}</p>
        <p className="text-slate-400 text-sm mt-1">{translations.spinnerWait}</p>
    </div>
  );
};

export default Spinner;