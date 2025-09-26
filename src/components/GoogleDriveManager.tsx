import React from 'react';
import { useGoogleAuth } from '../hooks/useGoogleAuth';
import Spinner from './Spinner';
import GoogleDriveIcon from './icons/GoogleDriveIcon';

type GoogleDriveManagerProps = ReturnType<typeof useGoogleAuth>;

const GoogleDriveManager: React.FC<GoogleDriveManagerProps> = ({
  isReady,
  isSignedIn,
  driveFolder,
  signIn,
  signOut,
  showPicker,
  isConfigured
}) => {
    if (!isConfigured) {
        return (
            <div className="bg-gray-800 border border-yellow-600 rounded-lg p-6 mb-8 max-w-4xl mx-auto text-center">
                 <h2 className="text-xl font-semibold text-yellow-300 mb-2">Google Drive Not Configured</h2>
                 <p className="text-gray-400">Please provide your Google API Key and Client ID in the `config.ts` file to enable this feature.</p>
            </div>
        );
    }

  return (
    <div className="bg-gray-800 border border-gray-700 rounded-lg p-6 mb-8 max-w-4xl mx-auto">
      <h2 className="text-2xl font-semibold text-white mb-4">Google Drive Integration</h2>
      {!isReady ? (
        <div className="flex items-center justify-center space-x-2 text-gray-400">
            <Spinner />
            <span>Initializing Google Drive connection...</span>
        </div>
      ) : !isSignedIn ? (
        <div>
          <p className="text-gray-400 mb-4">Connect your Google account to save images directly to a Drive folder and get shareable links.</p>
          <button
            onClick={signIn}
            className="flex items-center justify-center gap-3 w-full sm:w-auto bg-white text-gray-800 font-semibold py-2 px-6 rounded-lg hover:bg-gray-200 transition-colors"
          >
            <GoogleDriveIcon />
            Connect to Google Drive
          </button>
        </div>
      ) : (
        <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                <p className="text-green-400 font-medium">Successfully connected to Google Drive.</p>
                <button onClick={signOut} className="text-sm text-indigo-400 hover:text-indigo-300 mt-2 sm:mt-0">Sign Out</button>
            </div>
          
            <div>
                {driveFolder ? (
                    <div className="bg-gray-900/50 p-4 rounded-md flex flex-col sm:flex-row sm:items-center sm:justify-between">
                        <div>
                            <p className="text-sm text-gray-400">Selected Folder:</p>
                            <p className="font-semibold text-white">{driveFolder.name}</p>
                        </div>
                        <button onClick={showPicker} className="mt-3 sm:mt-0 text-sm bg-gray-700 hover:bg-gray-600 text-white font-medium py-2 px-4 rounded-md transition-colors">
                            Change Folder
                        </button>
                    </div>
                ) : (
                    <div>
                        <p className="text-gray-400 mb-3">Please select a Google Drive folder to save your images into.</p>
                        <button
                            onClick={showPicker}
                            className="bg-indigo-600 text-white font-semibold py-2 px-5 rounded-lg hover:bg-indigo-700 transition-colors"
                        >
                           Select Folder
                        </button>
                    </div>
                )}
            </div>
        </div>
      )}
    </div>
  );
};

export default GoogleDriveManager;