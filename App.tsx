import React, { useState, useCallback, useEffect } from 'react';
import { GoogleGenAI } from "@google/genai";
import Header from './components/Header';
import Footer from './components/Footer';
import ImageUploader from './components/ImageUploader';
import ResultDisplay from './components/ResultDisplay';
import History from './components/History';
import Spinner from './components/Spinner';
import { getGeminiPrompt, GEMINI_SCHEMA } from './constants';
import type { AnalysisResult, HistoryItem } from './types';
import { useLanguage } from './contexts/LanguageContext';

type View = 'scanner' | 'history';

const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });
};

const App: React.FC = () => {
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult[] | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [activeView, setActiveView] = useState<View>('scanner');
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [resultImagePreviewUrl, setResultImagePreviewUrl] = useState<string>('');

  const { currentLanguageDetails, translations } = useLanguage();

  useEffect(() => {
    try {
      const storedHistory = localStorage.getItem('cropHistory');
      if (storedHistory) {
        setHistory(JSON.parse(storedHistory));
      }
    } catch (e) {
      console.error("Failed to load history from localStorage", e);
      setHistory([]);
    }
  }, []);

  const updateHistory = (newHistory: HistoryItem[]) => {
    setHistory(newHistory);
    try {
      localStorage.setItem('cropHistory', JSON.stringify(newHistory));
    } catch (e) {
      console.error("Failed to save history to localStorage", e);
    }
  };

  const handleImageSelect = (file: File | null) => {
    setImageFile(file);
    setAnalysisResult(null);
    setResultImagePreviewUrl('');
    setError(null);
  };

  const handleAnalyze = useCallback(async () => {
    if (!imageFile) {
      setError(translations.errorSelectImage);
      return;
    }

    setLoading(true);
    setError(null);
    setAnalysisResult(null);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });
      const imageBase64 = (await fileToBase64(imageFile)).split(',')[1];
      const imagePart = {
        inlineData: { data: imageBase64, mimeType: imageFile.type },
      };
      
      const prompt = getGeminiPrompt(currentLanguageDetails.name);

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: {
          parts: [{ text: prompt }, imagePart],
        },
        config: {
          responseMimeType: 'application/json',
          responseSchema: GEMINI_SCHEMA,
        },
      });

      const results: AnalysisResult[] = JSON.parse(response.text);

      if (results.length === 0) {
        setError(translations.errorNoPlant);
      } else {
        setAnalysisResult(results);
        const imageUrl = URL.createObjectURL(imageFile);
        setResultImagePreviewUrl(imageUrl);

        // Add to history
        const newHistoryItem: HistoryItem = {
            id: new Date().toISOString(),
            date: new Date().toLocaleString(),
            imagePreviewUrl: await fileToBase64(imageFile),
            results,
        };
        updateHistory([newHistoryItem, ...history]);
      }

    } catch (e) {
      console.error(e);
      setError(translations.errorAnalysis);
    } finally {
      setLoading(false);
    }
  }, [imageFile, currentLanguageDetails, translations, history]);
  
  const handleReset = () => {
      setImageFile(null);
      setAnalysisResult(null);
      setResultImagePreviewUrl('');
      setError(null);
      setLoading(false);
  }

  const handleDeleteHistoryItem = (id: string) => {
      const newHistory = history.filter(item => item.id !== id);
      updateHistory(newHistory);
  }
  
  const handleClearHistory = () => {
      updateHistory([]);
  }

  const handleSelectHistoryItem = (item: HistoryItem) => {
      setAnalysisResult(item.results);
      setResultImagePreviewUrl(item.imagePreviewUrl);
      setActiveView('scanner');
  }

  return (
    <div className="min-h-screen bg-slate-900 text-slate-300 font-sans antialiased flex flex-col">
      <div className="relative z-10 flex-grow">
        <div 
          className="absolute top-0 left-0 -translate-x-1/4 -translate-y-1/2 w-96 h-96 bg-green-500/10 rounded-full blur-3xl animate-pulse"
          style={{ animationDuration: '6s' }}
        ></div>
        <div 
          className="absolute bottom-0 right-0 translate-x-1/4 translate-y-1/2 w-[32rem] h-[32rem] bg-emerald-500/10 rounded-full blur-3xl animate-pulse"
          style={{ animationDuration: '8s' }}
        ></div>
      </div>
      
      <main className="relative z-20 container mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 flex-grow flex flex-col">
        <Header activeView={activeView} setActiveView={setActiveView} />
        
        <div className="w-full max-w-4xl mx-auto flex-grow flex flex-col justify-center mt-8">
            {activeView === 'scanner' && (
                <>
                    {!analysisResult && (
                        <ImageUploader 
                        onImageSelect={handleImageSelect}
                        onAnalyze={handleAnalyze}
                        imageFile={imageFile}
                        isDisabled={loading}
                        />
                    )}

                    {error && <div className="mt-4 text-center text-red-400 bg-red-900/50 p-3 rounded-lg">{error}</div>}

                    {analysisResult && (
                        <ResultDisplay results={analysisResult} imagePreviewUrl={resultImagePreviewUrl} onReset={handleReset} />
                    )}
                </>
            )}

            {activeView === 'history' && (
                <History 
                    history={history} 
                    onSelect={handleSelectHistoryItem}
                    onDelete={handleDeleteHistoryItem} 
                    onClearAll={handleClearHistory}
                />
            )}
        </div>
      </main>
      
      {loading && <Spinner />}

      <Footer />
    </div>
  );
};

export default App;