
import React from 'react';
import type { Prompt } from '../types';
import { PlusIcon } from './icons/PlusIcon';
import { TrashIcon } from './icons/TrashIcon';

interface PromptListProps {
  prompts: Prompt[];
  setPrompts: React.Dispatch<React.SetStateAction<Prompt[]>>;
  disabled: boolean;
}

export const PromptList: React.FC<PromptListProps> = ({ prompts, setPrompts, disabled }) => {
  const addPrompt = () => {
    setPrompts([...prompts, { id: crypto.randomUUID(), value: '' }]);
  };

  const updatePrompt = (id: string, value: string) => {
    setPrompts(prompts.map(p => (p.id === id ? { ...p, value } : p)));
  };

  const removePrompt = (id: string) => {
    if (prompts.length > 1) {
      setPrompts(prompts.filter(p => p.id !== id));
    }
  };

  return (
    <div className="space-y-4">
      {prompts.map((prompt, index) => (
        <div key={prompt.id} className="flex items-center space-x-3">
          <input
            type="text"
            value={prompt.value}
            onChange={(e) => updatePrompt(prompt.id, e.target.value)}
            placeholder={`e.g., in the style of vaporwave`}
            disabled={disabled}
            className="flex-grow bg-gray-800 border border-gray-700 rounded-md py-2 px-4 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition duration-200 disabled:opacity-50"
          />
          <button
            onClick={() => removePrompt(prompt.id)}
            disabled={prompts.length <= 1 || disabled}
            className="p-2 text-gray-400 hover:text-red-500 disabled:text-gray-600 disabled:cursor-not-allowed transition-colors"
            aria-label="Remove prompt"
          >
            <TrashIcon />
          </button>
        </div>
      ))}
      <button
        onClick={addPrompt}
        disabled={disabled}
        className="flex items-center space-x-2 text-indigo-400 hover:text-indigo-300 disabled:text-gray-500 disabled:cursor-not-allowed transition-colors font-medium"
      >
        <PlusIcon />
        <span>Add another variation</span>
      </button>
    </div>
  );
};