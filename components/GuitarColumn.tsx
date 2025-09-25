import React, { useState } from 'react';
import { GuitarAttribute } from '../types';
import Spinner from './Spinner';
import TrashIcon from './icons/TrashIcon';
import ArrowUpIcon from './icons/ArrowUpIcon';
import ArrowDownIcon from './icons/ArrowDownIcon';
import GoogleDriveIcon from './icons/GoogleDriveIcon';
import ClipboardIcon from './icons/ClipboardIcon';

interface GuitarColumnProps {
  attribute: GuitarAttribute;
  onGenerate: (id: string) => Promise<void>;
  onDelete: (id: string) => void;
  onMove: (index: number, direction: 'up' | 'down') => void;
  onImageClick: (image: string, name: string) => void;
  onSaveToDrive: (guitarId: string, imageIndex: number) => Promise<void>;
  isDriveReady: boolean;
  index: number;
  isFirst: boolean;
  isLast: boolean;
}

const GuitarColumn: React.FC<GuitarColumnProps> = ({ attribute, onGenerate, onDelete, onMove, onImageClick, onSaveToDrive, isDriveReady, index, isFirst, isLast }) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [uploadingState, setUploadingState] = useState<{ [key: number]: boolean }>({});
  const [copiedState, setCopiedState] = useState<{ [key: number]: boolean }>({});

  const handleGenerateClick = async () => {
    setIsGenerating(true);
    await onGenerate(attribute.id);
    setIsGenerating(false);
  };

  const handleSaveClick = async (imageIndex: number) => {
    setUploadingState(prev => ({ ...prev, [imageIndex]: true }));
    await onSaveToDrive(attribute.id, imageIndex);
    setUploadingState(prev => ({ ...prev, [imageIndex]: false }));
  };

  const handleCopyClick = (link: string, index: number) => {
    navigator.clipboard.writeText(link);
    setCopiedState({ [index]: true });
    setTimeout(() => setCopiedState(prevState => ({...prevState, [index]: false })), 2000);
  };

  return (
    <div className="bg-gray-800 border border-gray-700 rounded-xl p-4 flex flex-col h-full shadow-lg hover:shadow-indigo-500/20 transition-shadow duration-300">
      <div className="flex-grow">
        <div className="flex justify-between items-start mb-2">
            <h3 className="text-xl font-bold text-white pr-2">{attribute.name}</h3>
            <div className="flex items-center space-x-1 flex-shrink-0">
                <div className="flex flex-col space-y-1">
                    <button onClick={() => onMove(index, 'up')} disabled={isFirst} className="p-1 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"><ArrowUpIcon /></button>
                    <button onClick={() => onMove(index, 'down')} disabled={isLast} className="p-1 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"><ArrowDownIcon /></button>
                </div>
                <button onClick={() => onDelete(attribute.id)} className="p-1.5 rounded-md text-gray-400 hover:text-red-400 hover:bg-gray-700 transition-colors" aria-label={`Delete ${attribute.name}`}><TrashIcon /></button>
            </div>
        </div>
        <p className="text-gray-400 mt-2 text-sm">{attribute.description}</p>
      </div>

      <div className="mt-6">
        {isGenerating ? (
          <div className="flex flex-col items-center justify-center h-64 bg-gray-900/50 rounded-lg">
            <Spinner />
            <p className="text-gray-400 mt-4">Generating images...</p>
          </div>
        ) : attribute.images && attribute.images.length > 0 ? (
          <div className="space-y-4">
            {attribute.images.map((img, idx) => (
              <div key={idx} className="bg-gray-900/50 rounded-lg p-2">
                <div className="relative group cursor-pointer" onClick={() => onImageClick(img, `${attribute.name}_${idx + 1}`)}>
                  <img
                    src={`data:image/jpeg;base64,${img}`}
                    alt={`${attribute.name} - generated image ${idx + 1}`}
                    className="rounded-md w-full h-auto object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-black/70 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-md">
                    <p className="text-white font-semibold">Click to Preview</p>
                  </div>
                </div>
                <div className="mt-2">
                  {attribute.driveLinks?.[idx] ? (
                    <div className="flex items-center space-x-2">
                        <input type="text" readOnly value={attribute.driveLinks[idx]!} className="text-xs bg-gray-700 text-gray-300 rounded-md px-2 py-1 w-full border-gray-600 focus:ring-0 focus:outline-none" />
                        <button onClick={() => handleCopyClick(attribute.driveLinks![idx]!, idx)} className="relative p-1.5 bg-gray-600 hover:bg-gray-500 rounded-md text-white transition-colors flex-shrink-0">
                            <span className={`transition-opacity duration-300 ${copiedState[idx] ? 'opacity-100' : 'opacity-0'}`}>Copied!</span>
                            <span className={`absolute inset-0 flex items-center justify-center transition-opacity duration-300 ${copiedState[idx] ? 'opacity-0' : 'opacity-100'}`}><ClipboardIcon /></span>
                        </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => handleSaveClick(idx)}
                      disabled={!isDriveReady || uploadingState[idx]}
                      className="w-full flex items-center justify-center gap-2 text-sm bg-gray-700 text-white font-semibold py-2 px-3 rounded-lg hover:bg-gray-600 focus:outline-none transition-colors disabled:bg-gray-600/50 disabled:text-gray-400 disabled:cursor-not-allowed"
                    >
                      {uploadingState[idx] ? (
                        <>
                          <Spinner /> Saving...
                        </>
                      ) : (
                        <>
                         <GoogleDriveIcon /> Save to Drive
                        </>
                      )}
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex items-center justify-center h-64 bg-gray-900/50 rounded-lg">
            <p className="text-gray-500">Images will appear here</p>
          </div>
        )}
      </div>

      <button
        onClick={handleGenerateClick}
        disabled={isGenerating}
        className="w-full mt-6 bg-indigo-600 text-white font-semibold py-3 px-4 rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-indigo-500 transition-all duration-200 disabled:bg-gray-600 disabled:cursor-not-allowed"
      >
        {isGenerating ? 'Generating...' : attribute.images ? 'Re-generate Images' : 'Generate Images'}
      </button>
    </div>
  );
};

export default GuitarColumn;