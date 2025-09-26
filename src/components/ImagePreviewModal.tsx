import React from 'react';
import CloseIcon from './icons/CloseIcon';
import DownloadIcon from './icons/DownloadIcon';

interface ImagePreviewModalProps {
  modalData: { image: string; name: string } | null;
  onClose: () => void;
}

const ImagePreviewModal: React.FC<ImagePreviewModalProps> = ({ modalData, onClose }) => {
  if (!modalData) {
    return null;
  }

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = `data:image/jpeg;base64,${modalData.image}`;
    const fileName = `${modalData.name.replace(/[^a-zA-Z0-9]/g, '_')}.jpeg`;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-80 backdrop-blur-sm"
      onClick={handleBackdropClick}
      aria-modal="true"
      role="dialog"
    >
      <div className="bg-gray-800 rounded-xl shadow-2xl p-4 relative max-w-3xl w-full max-h-[90vh] flex flex-col">
        <button
          onClick={onClose}
          className="absolute -top-3 -right-3 z-10 bg-gray-700 text-white rounded-full p-2 hover:bg-gray-600 transition-colors"
          aria-label="Close image preview"
        >
          <CloseIcon />
        </button>
        <div className="overflow-auto flex-grow mb-4">
          <img
            src={`data:image/jpeg;base64,${modalData.image}`}
            alt={`Preview of ${modalData.name}`}
            className="rounded-lg w-full h-auto object-contain"
          />
        </div>
        <div className="flex-shrink-0 flex justify-end items-center border-t border-gray-700 pt-3">
           <span className="text-gray-400 text-sm mr-auto pr-4 truncate" title={modalData.name}>{modalData.name}</span>
           <button
                onClick={handleDownload}
                className="flex items-center justify-center gap-2 bg-indigo-600 text-white font-semibold py-2 px-5 rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-indigo-500 transition-colors"
            >
                <DownloadIcon />
                Download
            </button>
        </div>
      </div>
    </div>
  );
};

export default ImagePreviewModal;