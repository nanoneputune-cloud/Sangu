import React, { useState } from 'react';
import CameraCapture from './components/CameraCapture';
import EmotionAnalysis from './components/EmotionAnalysis';
import Loader from './components/Loader';
import { analyzeImageForSongSuggestion, getSongSuggestionForEmotion } from './services/geminiService';
import type { AnalysisResult } from './types';

const App: React.FC = () => {
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedEmoji, setSelectedEmoji] = useState<string | null>(null);

  const handleCapture = async (capturedImageSrc: string) => {
    setImageSrc(capturedImageSrc);
    setIsLoading(true);
    setError(null);
    setAnalysisResult(null);
    setSelectedEmoji(null);

    try {
      const result = await analyzeImageForSongSuggestion(capturedImageSrc);
      setAnalysisResult(result);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unexpected error occurred.';
      setError(errorMessage);
      // Reset image so user can try again from capture screen
      setImageSrc(null);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEmotionSelect = async (emotion: string, emoji: string) => {
    setIsLoading(true);
    setError(null);
    setAnalysisResult(null);
    setImageSrc(null);
    setSelectedEmoji(emoji);

    try {
      const result = await getSongSuggestionForEmotion(emotion);
      setAnalysisResult(result);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unexpected error occurred.';
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };


  const handleRetry = () => {
    setImageSrc(null);
    setAnalysisResult(null);
    setError(null);
    setSelectedEmoji(null);
  };

  return (
    <div className="min-h-screen text-gray-800 flex flex-col items-center justify-center p-4">
      <header className="text-center mb-8 w-full">
        <img 
            src="https://ik.imagekit.io/y5m3udqts/Photoroom-20251005_030736517%20(1).png?updatedAt=1759614032227" 
            alt="Mood Melody Title" 
            className="w-full max-w-lg mx-auto h-auto object-contain"
        />
        <p className="text-gray-600 mt-2">Let AI find the perfect soundtrack for your emotions.</p>
      </header>
      
      <main className="w-full flex-grow flex items-center justify-center">
        {isLoading && <Loader />}
        
        {error && !isLoading && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg relative max-w-md text-center" role="alert">
            <strong className="font-bold">Oops! Something went wrong.</strong>
            <span className="block sm:inline ml-2">{error}</span>
            <button
              onClick={handleRetry}
              className="mt-4 bg-red-500 text-white font-bold py-2 px-4 rounded hover:bg-red-600 transition-colors"
            >
              Try Again
            </button>
          </div>
        )}

        {!analysisResult && !isLoading && !error && (
            <CameraCapture onCapture={handleCapture} onEmotionSelect={handleEmotionSelect} />
        )}

        {analysisResult && !isLoading && !error && (
            <EmotionAnalysis 
              imageSrc={imageSrc ?? undefined} 
              emoji={selectedEmoji ?? undefined}
              analysis={analysisResult} 
              onRetry={handleRetry} 
            />
        )}
      </main>

       <footer className="text-center text-gray-600 text-sm mt-8">
          <p>Created by Srushti</p>
        </footer>
    </div>
  );
};

export default App;
