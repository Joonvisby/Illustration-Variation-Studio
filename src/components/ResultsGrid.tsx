
import React from 'react';
import type { VariationResult } from '../types';
import { Spinner } from './Spinner';

interface ResultsGridProps {
  variations: VariationResult[];
}

const ResultCard: React.FC<{ variation: VariationResult }> = ({ variation }) => {
  return (
    <div className="bg-gray-800 rounded-lg overflow-hidden shadow-xl transform transition-all duration-300 hover:scale-105 hover:shadow-indigo-500/30">
      <div className="aspect-square w-full flex items-center justify-center bg-gray-900">
        {variation.isLoading && <Spinner />}
        {variation.error && (
            <div className="p-4 text-center text-red-400">
                <p className="font-semibold">Generation Failed</p>
                <p className="text-sm">{variation.error}</p>
            </div>
        )}
        {variation.imageUrl && (
          <img src={variation.imageUrl} alt={variation.prompt} className="w-full h-full object-cover" />
        )}
      </div>
      <div className="p-4">
        <p className="text-gray-300 text-sm truncate">{variation.prompt}</p>
      </div>
    </div>
  );
}


export const ResultsGrid: React.FC<ResultsGridProps> = ({ variations }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {variations.map(variation => (
        <ResultCard key={variation.id} variation={variation} />
      ))}
    </div>
  );
};