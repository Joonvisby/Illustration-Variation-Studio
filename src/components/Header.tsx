
import React from 'react';

export const Header: React.FC = () => {
  return (
    <header className="bg-gray-900/80 backdrop-blur-sm shadow-lg sticky top-0 z-10">
      <div className="container mx-auto px-4 py-4 max-w-5xl">
        <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-indigo-500">
          Illustration Variation Studio
        </h1>
        <p className="text-gray-400 mt-1">Bring your illustrations to life with AI-powered variations.</p>
      </div>
    </header>
  );
};