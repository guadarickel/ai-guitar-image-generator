import React, { useState, useCallback, useEffect } from 'react';
import { GUITAR_DATA } from './constants';
import { GuitarAttribute } from './types';
import { generateGuitarImages } from './services/geminiService';
import { uploadImageToDrive } from './services/googleDriveService';
import Header from './components/Header';
import Instructions from './components/Instructions';
import GuitarColumn from './components/GuitarColumn';
import AddGuitarForm from './components/AddGuitarForm';
import ImagePreviewModal from './components/ImagePreviewModal';
import GoogleDriveManager from './components/GoogleDriveManager';
import { useGoogleAuth } from './hooks/useGoogleAuth';

const App: React.FC = () => {
  const [guitarAttributes, setGuitarAttributes] = useState<GuitarAttribute[]>(GUITAR_DATA);
  const [globalError, setGlobalError] = useState<string | null>(null);
  const [modalState, setModalState] = useState<{ image: string; name: string } | null>(null);

  const googleAuth = useGoogleAuth();

  // Display Google Auth errors or configuration warnings
  useEffect(() => {
    if (googleAuth.error) {
      setGlobalError(`Google Drive Error: ${googleAuth.error}`);
    } else if (googleAuth.isReady && !googleAuth.isConfigured) {
      setGlobalError('Google Drive integration is not configured. Please add your credentials to config.ts.');
    } else if (globalError && !googleAuth.error) {
       // Clear previous auth errors if resolved
       if(globalError.startsWith('Google Drive Error')) setGlobalError(null);
    }
  }, [googleAuth.error, googleAuth.isConfigured, googleAuth.isReady, globalError]);

  const handleGenerateImages = useCallback(async (id: string) => {
    setGlobalError(null);
    try {
      const attributeToUpdate = guitarAttributes.find(attr => attr.id === id);
      if (!attributeToUpdate) return;

      const newImages = await generateGuitarImages(attributeToUpdate.description);

      setGuitarAttributes(currentAttributes =>
        currentAttributes.map(attr =>
          attr.id === id ? { ...attr, images: newImages, driveLinks: new Array(newImages.length).fill(null) } : attr
        )
      );
    } catch (error) {
      console.error(error);
      const errorMessage = error instanceof Error ? error.message : "An unexpected error occurred.";
      setGlobalError(errorMessage);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [guitarAttributes]);

  const handleSaveToDrive = useCallback(async (guitarId: string, imageIndex: number) => {
    if (!googleAuth.isSignedIn || !googleAuth.driveFolder) {
        setGlobalError("Please connect to Google Drive and select a folder first.");
        window.scrollTo({ top: 0, behavior: 'smooth' });
        return;
    }
    
    setGlobalError(null);
    const guitar = guitarAttributes.find(g => g.id === guitarId);
    if (!guitar || !guitar.images || !guitar.images[imageIndex]) {
        setGlobalError("Could not find the image to upload.");
        window.scrollTo({ top: 0, behavior: 'smooth' });
        return;
    }

    try {
        const base64Image = guitar.images[imageIndex];
        const safeName = guitar.name.replace(/[^a-zA-Z0-9]/g, '_');
        const fileName = `${safeName}_${Date.now()}.jpeg`;
        
        const link = await uploadImageToDrive(base64Image, fileName, googleAuth.driveFolder.id);

        setGuitarAttributes(current => current.map(attr => {
            if (attr.id === guitarId) {
                const newDriveLinks = [...(attr.driveLinks || [])];
                newDriveLinks[imageIndex] = link;
                return { ...attr, driveLinks: newDriveLinks };
            }
            return attr;
        }));

    } catch (error) {
        console.error(error);
        const errorMessage = error instanceof Error ? error.message : "An unexpected error occurred while saving to Drive.";
        setGlobalError(errorMessage);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [guitarAttributes, googleAuth.isSignedIn, googleAuth.driveFolder]);
  
  const handleAddGuitar = useCallback(({ brand, model, description }: { brand: string; model: string; description: string }) => {
    setGlobalError(null);
    const newName = `${brand} - ${model}`;

    if (guitarAttributes.some(attr => attr.name.toLowerCase() === newName.toLowerCase())) {
        setGlobalError(`A guitar with the name "${newName}" already exists.`);
        window.scrollTo({ top: 0, behavior: 'smooth' });
        return;
    }

    const newAttribute: GuitarAttribute = {
        id: Date.now().toString(),
        name: newName,
        description: description,
        driveLinks: [],
    };

    setGuitarAttributes(prev => [...prev, newAttribute]);
  }, [guitarAttributes]);

  const handleDeleteGuitar = useCallback((id: string) => {
    setGuitarAttributes(prev => prev.filter(attr => attr.id !== id));
  }, []);

  const handleMoveGuitar = useCallback((index: number, direction: 'up' | 'down') => {
    setGuitarAttributes(current => {
      const newAttributes = [...current];
      const item = newAttributes[index];
      const swapIndex = direction === 'up' ? index - 1 : index + 1;

      if (swapIndex < 0 || swapIndex >= newAttributes.length) {
          return newAttributes;
      }

      newAttributes[index] = newAttributes[swapIndex];
      newAttributes[swapIndex] = item;
      return newAttributes;
    });
  }, []);

  const handleImageClick = useCallback((image: string, name: string) => {
    setModalState({ image, name });
  }, []);

  const handleCloseModal = useCallback(() => {
    setModalState(null);
  }, []);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        handleCloseModal();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleCloseModal]);

  return (
    <>
      <div className="min-h-screen bg-gray-900 text-gray-200 font-sans">
        <main className="container mx-auto px-4 py-8">
          <Header />
          <Instructions />
          
          <GoogleDriveManager {...googleAuth} />
          
          {globalError && (
            <div className="bg-red-900 border border-red-700 text-red-200 px-4 py-3 rounded-lg relative my-6 max-w-4xl mx-auto" role="alert">
              <strong className="font-bold">Error: </strong>
              <span className="block sm:inline">{globalError}</span>
            </div>
          )}

          <AddGuitarForm onAddGuitar={handleAddGuitar} />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 mt-8">
            {guitarAttributes.map((attribute, index) => (
              <GuitarColumn
                key={attribute.id}
                attribute={attribute}
                onGenerate={handleGenerateImages}
                onDelete={handleDeleteGuitar}
                onMove={handleMoveGuitar}
                onImageClick={handleImageClick}
                onSaveToDrive={handleSaveToDrive}
                isDriveReady={googleAuth.isSignedIn && !!googleAuth.driveFolder}
                index={index}
                isFirst={index === 0}
                isLast={index === guitarAttributes.length - 1}
              />
            ))}
          </div>
        </main>
      </div>
      <ImagePreviewModal modalData={modalState} onClose={handleCloseModal} />
    </>
  );
};

export default App;