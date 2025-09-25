// IMPORTANT: Replace with your own Google Cloud credentials.
// See the instructions in the Google Cloud Console for how to create these.
export const GOOGLE_API_KEY = 'YOUR_GOOGLE_API_KEY_HERE';
export const GOOGLE_CLIENT_ID = 'YOUR_GOOGLE_CLIENT_ID_HERE';

// Scopes required for the application
export const GOOGLE_DRIVE_SCOPES = 'https://www.googleapis.com/auth/drive.file';

// A check to remind the user to add their credentials
if (GOOGLE_API_KEY === 'YOUR_GOOGLE_API_KEY_HERE' || GOOGLE_CLIENT_ID === 'YOUR_GOOGLE_CLIENT_ID_HERE') {
  // This warning will be shown in the browser's developer console.
  // The UI will also display a message.
  console.warn('Please configure your Google API Key and Client ID in config.ts');
}
