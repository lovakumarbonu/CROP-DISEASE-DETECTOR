import React, { useState, useEffect, useRef } from 'react';
import type { AnalysisResult } from '../types';
import { useLanguage } from '../contexts/LanguageContext';
import {
  CheckCircleIcon, ExclamationTriangleIcon, LeafIcon, PillIcon, CloseIcon,
  SpeakerIcon, StopIcon, MicroscopeIcon, OrganicIcon, SunCloudIcon, FlagIcon
} from './Icons';

interface ResultDisplayProps {
  results: AnalysisResult[];
  imagePreviewUrl: string;
  onReset: () => void;
}

const BoundingBoxColors = [
  '#facc15', // amber-400
  '#4ade80', // green-400
  '#fb923c', // orange-400
  '#60a5fa', // blue-400
  '#f472b6', // pink-400
];

const ResultDisplay: React.FC<ResultDisplayProps> = ({ results, imagePreviewUrl, onReset }) => {
  const { translations, currentLanguageDetails } = useLanguage();
  const [isZoomed, setIsZoomed] = useState(false);
  const [feedbackSent, setFeedbackSent] = useState<number[]>([]);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsZoomed(false);
      }
    };

    if (isZoomed) {
      document.addEventListener('keydown', handleKeyDown);
      // Auto-focus the close button for accessibility
      closeButtonRef.current?.focus();
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isZoomed]);
  
  // This effect handles cleanup for speech synthesis on component unmount.
  useEffect(() => {
    return () => {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []); // Empty dependency array ensures it runs only on mount and unmount.


  const speakAnalysis = () => {
    if (!('speechSynthesis' in window)) return;

    if (isSpeaking) {
      window.speechSynthesis.cancel();
      // The `onend` event of the utterance will handle setting isSpeaking to false
      return;
    }

    let fullText = '';
    results.forEach((result, index) => {
      // Announce each issue number for clarity using translated string
      fullText += `${translations.speakIssue.replace('{number}', String(index + 1))}. `;
      
      const title = result.is_healthy 
        ? translations.resultHealthy 
        : `${translations.resultDiseaseDetected}: ${result.disease_name}`;
      fullText += `${title}. `;
      
      fullText += `${translations.resultDescription}: ${result.description}. `;

      if (result.early_stress_signs.length > 0) {
        fullText += `${translations.earlyStress}: ${result.early_stress_signs.join('. ')}. `;
      }
      
      if (result.treatment_plan_organic.length > 0) {
          fullText += `${translations.organicTreatments}: ${result.treatment_plan_organic.join('. ')}. `;
      }

      if (result.treatment_plan_chemical.length > 0) {
          fullText += `${translations.chemicalTreatments}: ${result.treatment_plan_chemical.join('. ')}. `;
      }
      
      if (result.climate_advisory) {
            fullText += `${translations.climateAdvisory}: ${result.climate_advisory}. `;
      }
    });

    const utterance = new SpeechSynthesisUtterance(fullText);
    utterance.lang = currentLanguageDetails.code;
    
    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = (event) => {
        console.error('Speech synthesis error:', event);
        setIsSpeaking(false);
    };
    
    // Clear any previous speech that might be lingering in the queue before speaking.
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utterance);
  };
  
  const BoundingBoxes = ({ isZoomedView = false }) => (
    <>
      {results.map((result, index) => {
        if (!result.disease_location) return null;
        const color = BoundingBoxColors[index % BoundingBoxColors.length];
        const style = {
          position: 'absolute' as const,
          left: `${result.disease_location.x * 100}%`,
          top: `${result.disease_location.y * 100}%`,
          width: `${result.disease_location.width * 100}%`,
          height: `${result.disease_location.height * 100}%`,
          border: isZoomedView ? `4px solid ${color}` : `3px solid ${color}`,
          boxShadow: `0 0 15px 3px ${color}60`,
          borderRadius: '8px',
          pointerEvents: 'none' as const,
          animationDelay: isZoomedView ? '0ms' : `${index * 150}ms`,
        };
        const numberStyle = {
            position: 'absolute' as const,
            top: '-10px',
            left: '-10px',
            backgroundColor: color,
            color: '#0f172a', // slate-900
            borderRadius: '50%',
            width: '24px',
            height: '24px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: 'bold',
            fontSize: '14px',
        };
        return (
          <div key={index} style={style} className={isZoomedView ? '' : 'animate-bounce-in'}>
            <div style={numberStyle}>{index + 1}</div>
          </div>
        );
      })}
    </>
  );

  return (
    <>
      <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-4 sm:p-6 w-full animate-fade-in space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="lg:col-span-1 space-y-4">
            <div
              className="relative cursor-zoom-in group"
              onClick={() => setIsZoomed(true)}
              role="button"
              aria-label={translations.zoomInLabel}
              tabIndex={0}
              onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && setIsZoomed(true)}
            >
              <img src={imagePreviewUrl} alt={translations.analyzedImageAlt} className="rounded-lg object-cover w-full h-auto transition-transform group-hover:scale-105" />
              <BoundingBoxes />
            </div>
            <div className="flex flex-col sm:flex-row gap-4">
                 <button
                  onClick={speakAnalysis}
                  className="flex-1 flex justify-center items-center gap-2 px-4 py-2 font-semibold text-slate-200 bg-slate-700 rounded-lg hover:bg-slate-600 focus:outline-none focus:ring-2 focus:ring-slate-500 transition-colors"
                >
                  {isSpeaking ? (
                      <>
                          <StopIcon />
                          {translations.stopSpeaking}
                      </>
                  ) : (
                      <>
                          <SpeakerIcon />
                          {translations.speakResults}
                      </>
                  )}
                </button>
                 <button
                  onClick={onReset}
                  className="flex-1 flex justify-center items-center px-4 py-2 font-semibold text-white bg-green-600 rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-400 transition-colors"
                >
                  {translations.analyzeAnotherButton}
              </button>
            </div>
          </div>
          <div className="lg:col-span-1 space-y-4 max-h-[70vh] overflow-y-auto pr-2">
            {results.map((result, index) => {
              const color = BoundingBoxColors[index % BoundingBoxColors.length];
              const hasSentFeedback = feedbackSent.includes(index);

              return (
                <div key={index} className="bg-slate-900/50 p-4 rounded-lg border-l-4" style={{ borderColor: color }}>
                    <div className="flex items-center gap-3">
                        <div className="flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-slate-900 font-bold" style={{ backgroundColor: color}}>{index + 1}</div>
                        {result.is_healthy ? (
                          <CheckCircleIcon className="text-green-400" />
                        ) : (
                          <ExclamationTriangleIcon className="text-amber-400" />
                        )}
                        <h2 className="text-xl font-bold text-slate-100">
                          {result.is_healthy ? translations.resultHealthy : result.disease_name}
                        </h2>
                    </div>

                    <div className="mt-4 space-y-4">
                        <p className="text-slate-300">{result.description}</p>
                        
                        {result.early_stress_signs.length > 0 && (
                            <div>
                                <h3 className="text-md font-semibold text-green-400 flex items-center gap-2 mb-2"><MicroscopeIcon />{translations.earlyStress}</h3>
                                <ul className="list-disc list-inside text-sm text-slate-300">
                                    {result.early_stress_signs.map((sign, i) => <li key={i}>{sign}</li>)}
                                </ul>
                            </div>
                        )}
                        
                        {result.treatment_plan_organic.length > 0 && (
                            <div>
                                <h3 className="text-md font-semibold text-green-400 flex items-center gap-2 mb-2"><OrganicIcon />{translations.organicTreatments}</h3>
                                <ul className="list-disc list-inside text-sm text-slate-300">
                                    {result.treatment_plan_organic.map((step, i) => <li key={i}>{step}</li>)}
                                </ul>
                            </div>
                        )}

                        {result.treatment_plan_chemical.length > 0 && (
                            <div>
                                <h3 className="text-md font-semibold text-green-400 flex items-center gap-2 mb-2"><PillIcon />{translations.chemicalTreatments}</h3>
                                <ul className="list-disc list-inside text-sm text-slate-300">
                                    {result.treatment_plan_chemical.map((step, i) => <li key={i}>{step}</li>)}
                                </ul>
                            </div>
                        )}
                        
                        {result.climate_advisory && (
                             <div>
                                <h3 className="text-md font-semibold text-green-400 flex items-center gap-2 mb-2"><SunCloudIcon />{translations.climateAdvisory}</h3>
                                <p className="text-sm text-slate-300">{result.climate_advisory}</p>
                            </div>
                        )}
                    </div>

                     <div className="mt-4 pt-3 border-t border-slate-700/50">
                        <button
                            onClick={() => {
                                if (!hasSentFeedback) {
                                    setFeedbackSent(prev => [...prev, index]);
                                    // In a real application, this is where you would send feedback to a server.
                                }
                            }}
                            disabled={hasSentFeedback}
                            className={`w-full flex items-center justify-center gap-2 px-3 py-1.5 text-xs rounded-md transition-colors ${
                                hasSentFeedback 
                                    ? 'bg-green-500/20 text-green-300 cursor-default' 
                                    : 'bg-slate-700/50 text-slate-400 hover:bg-slate-700 hover:text-slate-200'
                            }`}
                            aria-live="polite"
                        >
                            {hasSentFeedback ? (
                                <>
                                    <CheckCircleIcon className="w-4 h-4" />
                                    {translations.feedbackSent}
                                </>
            
                            ) : (
                                <>
                                    <FlagIcon className="w-4 h-4" />
                                    {translations.reportIncorrectDiagnosis}
                                </>
                            )}
                        </button>
                    </div>

                </div>
              );
            })}
          </div>
        </div>
      </div>

      {isZoomed && (
        <div
          className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex justify-center items-center p-4 animate-fade-in"
          onClick={() => setIsZoomed(false)}
          role="dialog"
          aria-modal="true"
          aria-labelledby="zoom-modal-title"
        >
          <div
            className="relative max-w-4xl max-h-[90vh]"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 id="zoom-modal-title" className="sr-only">{translations.zoomedImageAlt}</h2>
            <img src={imagePreviewUrl} alt={translations.zoomedImageAlt} className="rounded-lg object-contain w-full h-full max-h-[90vh]" />
            <BoundingBoxes isZoomedView={true} />
            <button
              ref={closeButtonRef}
              onClick={() => setIsZoomed(false)}
              className="absolute -top-3 -right-3 bg-slate-700 hover:bg-slate-600 text-white rounded-full p-2 focus:outline-none focus:ring-2 focus:ring-white transition-transform transform hover:scale-110"
              aria-label={translations.closeZoomLabel}
            >
              <CloseIcon />
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default ResultDisplay;