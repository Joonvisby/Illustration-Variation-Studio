import React, { useState, useCallback, useRef } from 'react';

interface ImageUploaderProps {
  onImageUpload: (file: File) => void;
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({ onImageUpload }) => {
  const [preview, setPreview] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFile = useCallback((file: File | undefined | null) => {
    if (file && file.type.startsWith('image/')) {
        onImageUpload(file);
        const reader = new FileReader();
        reader.onloadend = () => {
            setPreview(reader.result as string);
        };
        reader.readAsDataURL(file);
    }
  }, [onImageUpload]);

  const handleFileChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      handleFile(file);
    },
    [handleFile]
  );

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const handleDragOver = useCallback((event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
  }, []);

  const handleDragEnter = useCallback((event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback(
    (event: React.DragEvent<HTMLDivElement>) => {
        event.preventDefault();
        event.stopPropagation();
        setIsDragging(false);
        const file = event.dataTransfer.files?.[0];
        handleFile(file);
    },
    [handleFile]
  );
  
  const baseClasses = "border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-all duration-300 bg-gray-800/50";
  const inactiveClasses = "border-gray-600 hover:border-indigo-500";
  const activeClasses = "border-indigo-500 ring-4 ring-indigo-500/30 scale-105";

  return (
    <div
      className={`${baseClasses} ${isDragging ? activeClasses : inactiveClasses}`}
      onClick={handleClick}
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
      role="button"
      tabIndex={0}
      aria-label="Image upload drop zone"
    >
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        className="hidden"
        accept="image/png, image/jpeg, image/webp"
      />
      {preview ? (
        <div className="relative group pointer-events-none">
           <img src={preview} alt="Preview" className="mx-auto max-h-64 rounded-lg shadow-md" />
           <div className={`absolute inset-0 bg-black bg-opacity-60 flex items-center justify-center transition-opacity rounded-lg ${isDragging ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}>
                <p className="text-white text-lg font-semibold">{isDragging ? 'Drop to Replace' : 'Click or drag to change'}</p>
           </div>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center space-y-2 text-gray-400 pointer-events-none">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
          </svg>
          <p className="font-semibold">{isDragging ? 'Drop to Upload' : 'Click to upload or drag & drop'}</p>
          <p className="text-sm">PNG, JPG, or WEBP</p>
        </div>
      )}
    </div>
  );
};
