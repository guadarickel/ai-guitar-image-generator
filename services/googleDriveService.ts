// A utility function to convert base64 to Blob
const base64ToBlob = (base64: string, contentType: string = 'image/jpeg'): Blob => {
  const byteCharacters = atob(base64);
  const byteArrays = [];
  for (let offset = 0; offset < byteCharacters.length; offset += 512) {
    const slice = byteCharacters.slice(offset, offset + 512);
    const byteNumbers = new Array(slice.length);
    for (let i = 0; i < slice.length; i++) {
      byteNumbers[i] = slice.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    byteArrays.push(byteArray);
  }
  return new Blob(byteArrays, { type: contentType });
};

/**
 * Uploads a file to Google Drive and makes it public.
 * @param {string} base64Image - The base64 encoded image data.
 * @param {string} fileName - The desired file name in Google Drive.
 * @param {string} folderId - The ID of the folder to upload into.
 * @returns {Promise<string>} - The web view link of the uploaded file.
 */
export const uploadImageToDrive = async (
  base64Image: string,
  fileName: string,
  folderId: string
): Promise<string> => {
  try {
    // 1. Create file metadata
    const fileMetadata = {
      name: fileName,
      parents: [folderId],
      mimeType: 'image/jpeg',
    };

    // 2. Create a multipart request body
    const blob = base64ToBlob(base64Image);
    const form = new FormData();
    form.append('metadata', new Blob([JSON.stringify(fileMetadata)], { type: 'application/json' }));
    form.append('file', blob);

    // 3. Upload the file
    const uploadResponse = await gapi.client.request({
      path: '/upload/drive/v3/files',
      method: 'POST',
      params: { uploadType: 'multipart' },
      body: form,
    });
    
    const fileId = uploadResponse.result.id;
    if (!fileId) {
      throw new Error('File upload did not return a file ID.');
    }

    // 4. Set permissions to public (anyone with the link can view)
    await gapi.client.drive.permissions.create({
      fileId: fileId,
      resource: {
        role: 'reader',
        type: 'anyone',
      },
    });

    // 5. Get the file metadata to retrieve the web view link
    const fileGetResponse = await gapi.client.drive.files.get({
      fileId: fileId,
      fields: 'webViewLink',
    });

    if (!fileGetResponse.result.webViewLink) {
        throw new Error('Could not retrieve shareable link for the file.');
    }

    return fileGetResponse.result.webViewLink;
  } catch (error) {
    console.error('Error during Google Drive upload:', error);
    const errorMessage = error instanceof Error && 'result' in error ? JSON.stringify((error as any).result.error) : String(error);
    throw new Error(`Failed to upload to Google Drive: ${errorMessage}`);
  }
};
