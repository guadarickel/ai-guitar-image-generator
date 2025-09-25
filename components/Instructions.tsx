import React from 'react';

const Instructions: React.FC = () => {
  return (
    <div className="bg-gray-800 border border-gray-700 rounded-lg p-6 mb-8 max-w-4xl mx-auto">
      <h2 className="text-2xl font-semibold text-white mb-4">How to Use</h2>
      <ol className="list-decimal list-inside space-y-2 text-gray-300 mb-6">
        <li>Connect your Google Account and select a destination folder using the <span className="font-semibold text-indigo-400">Google Drive Integration</span> section. (Requires one-time setup below).</li>
        <li>Click <span className="font-semibold text-indigo-400">Generate Images</span> for any guitar type below.</li>
        <li>Wait for the AI to create three unique images.</li>
        <li>Click on any image to open a larger preview. From the preview, you can <span className="font-semibold text-indigo-400">Download</span> it directly to your computer.</li>
        <li>Alternatively, for each image you like, click <span className="font-semibold text-indigo-400">Save to Drive</span> to upload it and get a shareable link.</li>
        <li>Click the <span className="font-semibold text-indigo-400">Copy</span> button next to the link and paste it into your spreadsheet.</li>
      </ol>

      <details className="bg-gray-900/50 rounded-lg p-4 border border-gray-600 transition-all duration-300 open:pb-4">
        <summary className="font-semibold text-lg text-indigo-400 cursor-pointer list-none flex justify-between items-center">
          First-Time Setup: Google Drive Integration Guide
          <svg className="w-5 h-5 transition-transform transform details-arrow" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </summary>
        <div className="mt-4 space-y-3 text-gray-300">
          <p>To save images to Google Drive, you need to provide your own Google API credentials. Follow these steps:</p>
          <ol className="list-decimal list-inside space-y-2 pl-4">
            <li>
              Go to the <a href="https://console.cloud.google.com/" target="_blank" rel="noopener noreferrer" className="text-indigo-400 hover:underline">Google Cloud Console</a> and create a new project (or select an existing one).
            </li>
            <li>
              Enable the required APIs: In the sidebar, navigate to "APIs &amp; Services" &rarr; "Library". Search for and enable both the <strong>Google Drive API</strong> and the <strong>Google Picker API</strong>.
            </li>
            <li>
              Create an <strong>API Key</strong>:
              <ul className="list-disc list-inside pl-4 mt-1 text-gray-400">
                <li>Go to "APIs &amp; Services" &rarr; "Credentials".</li>
                <li>Click "+ CREATE CREDENTIALS" and select "API key".</li>
                <li>Copy the generated key. You will need it in the last step.</li>
              </ul>
            </li>
            <li>
              Create an <strong>OAuth 2.0 Client ID</strong>:
              <ul className="list-disc list-inside pl-4 mt-1 text-gray-400">
                <li>In "Credentials", click "+ CREATE CREDENTIALS" again and select "OAuth client ID".</li>
                <li>Choose "Web application" as the application type.</li>
                <li>Under "Authorized JavaScript origins", click "+ ADD URI" and enter the URL where this app is running (e.g., <code className="bg-gray-700 px-1 py-0.5 rounded text-sm">http://localhost:3000</code> for local development).</li>
                <li>Click "Create" and copy the generated "Client ID".</li>
              </ul>
            </li>
            <li>
              Add your credentials to the app: Open the <code className="bg-gray-700 px-1 py-0.5 rounded text-sm">config.ts</code> file in the project and paste your <strong>API Key</strong> and <strong>Client ID</strong> into the corresponding variables.
            </li>
          </ol>
          <p className="pt-2 text-sm text-gray-400">Once the <code className="bg-gray-700 px-1 py-0.5 rounded text-sm">config.ts</code> file is updated, refresh this page, and the Google Drive integration will be fully enabled.</p>
        </div>
      </details>
      <style>{`
        details > summary { -webkit-appearance: none; }
        details[open] > summary .details-arrow { transform: rotate(180deg); }
      `}</style>
    </div>
  );
};

export default Instructions;
