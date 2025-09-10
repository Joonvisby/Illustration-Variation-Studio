
import React, { useState, useCallback } from 'react';
import { Header } from './components/Header';
import { ImageUploader } from './components/ImageUploader';
import { PromptList } from './components/PromptList';
import { ResultsGrid } from './components/ResultsGrid';
import { generateImageVariation } from './services/geminiService';
import type { Prompt, VariationResult } from './types';

const App: React.FC = () => {
  const [originalImage, setOriginalImage] = useState<File | null>(null);
  const [prompts, setPrompts] = useState<Prompt[]>([{ id: crypto.randomUUID(), value: 'A vibrant, pop-art version' }]);
  const [variations, setVariations] = useState<VariationResult[]>([]);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [globalError, setGlobalError] = useState<string | null>(null);

  // Debug: Check environment variables
  React.useEffect(() => {
    console.log('Environment check:', {
      API_KEY: process.env.API_KEY ? 'Set' : 'Not set',
      GEMINI_API_KEY: process.env.GEMINI_API_KEY ? 'Set' : 'Not set',
      NODE_ENV: process.env.NODE_ENV
    });
  }, []);

  const handleImageUpload = useCallback((file: File) => {
    setOriginalImage(file);
    setVariations([]);
    setGlobalError(null);
  }, []);

  const handleGenerate = async () => {
    if (!originalImage || prompts.every(p => !p.value.trim())) return;

    setIsGenerating(true);
    setGlobalError(null);
    setVariations(
      prompts.map(p => ({
        id: p.id,
        prompt: p.value,
        imageUrl: null,
        isLoading: true,
        error: null,
      }))
    );

    const validPrompts = prompts.filter(p => p.value.trim());

    for (const prompt of validPrompts) {
      try {
        const imageUrl = await generateImageVariation(originalImage, prompt.value);
        setVariations(prev =>
          prev.map(v => (v.id === prompt.id ? { ...v, imageUrl, isLoading: false } : v))
        );
      } catch (error) {
        console.error(`Failed to generate variation for prompt: "${prompt.value}"`, error);
        const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred.';
        setVariations(prev =>
          prev.map(v =>
            v.id === prompt.id ? { ...v, error: errorMessage, isLoading: false } : v
          )
        );
      }
    }

    setIsGenerating(false);
  };
  
  const isGenerateButtonDisabled = !originalImage || prompts.every(p => !p.value.trim()) || isGenerating;

  // Check if API key is available
  const apiKey = process.env.API_KEY || process.env.GEMINI_API_KEY;
  
  if (!apiKey) {
    return (
      <div className="min-h-screen bg-gray-900 font-sans flex items-center justify-center">
        <div className="text-center text-white">
          <h1 className="text-2xl font-bold mb-4">Configuration Error</h1>
          <p className="text-red-400 mb-4">API key not found. Please check your environment variables.</p>
          <p className="text-sm text-gray-400">Check the browser console for more details.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 font-sans">
      <Header />
      <main className="container mx-auto px-4 py-8 max-w-5xl">
        <div className="space-y-12">
          <section id="uploader-section">
            <h2 className="text-2xl font-bold text-gray-100 mb-4">1. Upload Your Illustration</h2>
            <ImageUploader onImageUpload={handleImageUpload} />
          </section>

          {originalImage && (
            <section id="prompts-section">
              <h2 className="text-2xl font-bold text-gray-100 mb-4">2. Describe Your Variations</h2>
              <PromptList prompts={prompts} setPrompts={setPrompts} disabled={isGenerating} />
            </section>
          )}

          {originalImage && (
             <section id="generate-section" className="text-center">
              <button
                onClick={handleGenerate}
                disabled={isGenerateButtonDisabled}
                className="bg-indigo-600 text-white font-bold py-3 px-12 rounded-lg shadow-lg hover:bg-indigo-700 disabled:bg-gray-500 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-indigo-500 focus:ring-opacity-50"
              >
                {isGenerating ? 'Generating...' : 'Generate Variations'}
              </button>
               {globalError && <p className="text-red-400 mt-4">{globalError}</p>}
            </section>
          )}

          {variations.length > 0 && (
            <section id="results-section">
               <h2 className="text-2xl font-bold text-gray-100 mb-4">3. Your Generated Variations</h2>
               <ResultsGrid variations={variations} />
            </section>
          )}
        </div>
      </main>
    </div>
  );
};

export default App;
