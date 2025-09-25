import React, { useState, useEffect, useCallback } from 'react';
import { GOOGLE_API_KEY, GOOGLE_CLIENT_ID, GOOGLE_DRIVE_SCOPES } from '../config';

interface DriveFolder {
  id: string;
  name: string;
}

// Global gapi and google variables from the script tags
declare global {
    var gapi: any;
    var google: any;
}

export const useGoogleAuth = () => {
  const [gapiReady, setGapiReady] = useState(false);
  const [gisReady, setGisReady] = useState(false);
  const [tokenClient, setTokenClient] = useState<any>(null);
  const [driveFolder, setDriveFolder] = useState<DriveFolder | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isSignedIn, setIsSignedIn] = useState(false);

  const isConfigured = GOOGLE_API_KEY !== 'YOUR_GOOGLE_API_KEY_HERE' && GOOGLE_CLIENT_ID !== 'YOUR_GOOGLE_CLIENT_ID_HERE';

  const handleGapiLoad = useCallback(() => {
    gapi.load('client:picker', () => setGapiReady(true));
  }, []);

  const handleGisLoad = useCallback(() => {
    setGisReady(true);
  }, []);

  useEffect(() => {
    const gapiScript = document.querySelector('script[src="https://apis.google.com/js/api.js"]');
    gapiScript?.addEventListener('load', handleGapiLoad);
    const gisScript = document.querySelector('script[src="https://accounts.google.com/gsi/client"]');
    gisScript?.addEventListener('load', handleGisLoad);

    return () => {
        gapiScript?.removeEventListener('load', handleGapiLoad);
        gisScript?.removeEventListener('load', handleGisLoad);
    }
  }, [handleGapiLoad, handleGisLoad]);

  useEffect(() => {
    if (!gapiReady || !isConfigured) return;

    gapi.client.init({
        apiKey: GOOGLE_API_KEY,
        discoveryDocs: ['https://www.googleapis.com/discovery/v1/apis/drive/v3/rest'],
    });
  }, [gapiReady, isConfigured]);

  useEffect(() => {
    if (!gisReady || !isConfigured) return;

    const client = google.accounts.oauth2.initTokenClient({
      client_id: GOOGLE_CLIENT_ID,
      scope: GOOGLE_DRIVE_SCOPES,
      callback: (tokenResponse: any) => {
        if (tokenResponse.error) {
          setError(tokenResponse.error);
          setIsSignedIn(false);
        } else {
          setIsSignedIn(true);
        }
      },
    });
    setTokenClient(client);
  }, [gisReady, isConfigured]);

  const signIn = useCallback(() => {
    setError(null);
    if (!tokenClient) {
      setError("Google Auth client is not ready.");
      return;
    }
    tokenClient.requestAccessToken({ prompt: 'consent' });
  }, [tokenClient]);

  const signOut = useCallback(() => {
    const token = gapi.client.getToken();
    if (token !== null) {
      google.accounts.oauth2.revoke(token.access_token, () => {
        gapi.client.setToken(null);
        setDriveFolder(null);
        setIsSignedIn(false);
      });
    }
  }, []);

  const showPicker = useCallback(() => {
    if (!gapiReady || !isSignedIn) return;

    const view = new google.picker.View(google.picker.ViewId.FOLDERS);
    view.setMimeTypes("application/vnd.google-apps.folder");

    const picker = new google.picker.PickerBuilder()
      .enableFeature(google.picker.Feature.NAV_HIDDEN)
      .setAppId(GOOGLE_CLIENT_ID.split('-')[0])
      .setOAuthToken(gapi.client.getToken().access_token)
      .addView(view)
      .setDeveloperKey(GOOGLE_API_KEY)
      .setCallback((data: any) => {
        if (data.action === google.picker.Action.PICKED) {
          const doc = data.docs[0];
          setDriveFolder({ id: doc.id, name: doc.name });
        }
      })
      .build();
    picker.setVisible(true);
  }, [gapiReady, isSignedIn]);

  return {
    isReady: gapiReady && gisReady && !!tokenClient,
    isSignedIn,
    driveFolder,
    signIn,
    signOut,
    showPicker,
    error,
    isConfigured
  };
};
