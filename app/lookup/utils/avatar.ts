import { put } from '@vercel/blob';
import fs from 'fs';
import path from 'path';

/**
 * Downloads an avatar from a URL and saves it locally for development
 * @param avatarUrl The URL of the avatar to download
 * @param ensName The ENS name associated with the avatar
 * @returns The URL of the saved avatar
 */
export async function downloadAndSaveAvatarLocally(avatarUrl: string, ensName: string): Promise<string | null> {
  try {
    console.log('Original avatar URL:', avatarUrl);
    
    // Clean the avatar URL - remove ALL whitespace including newlines
    const cleanedUrl = avatarUrl.replace(/\s+/g, '');
    console.log(`Downloading avatar for ${ensName} from cleaned URL: ${cleanedUrl}`);
    
    // Fetch the avatar
    console.log('Fetching avatar...');
    const response = await fetch(cleanedUrl);
    
    if (!response.ok) {
      console.error(`Failed to download avatar: ${response.status} ${response.statusText}`);
      return null;
    }
    
    console.log('Avatar fetched successfully, content type:', response.headers.get('content-type'));
    
    // Get the image data
    const imageData = await response.arrayBuffer();
    console.log('Image data size:', imageData.byteLength, 'bytes');
    
    // Determine the file extension based on content type
    const contentType = response.headers.get('content-type') || 'image/png';
    const fileExtension = contentType.split('/')[1] || 'png';
    
    // Create the public directory if it doesn't exist
    const publicDir = path.join(process.cwd(), 'public');
    const avatarsDir = path.join(publicDir, 'avatars');
    
    if (!fs.existsSync(publicDir)) {
      fs.mkdirSync(publicDir);
    }
    
    if (!fs.existsSync(avatarsDir)) {
      fs.mkdirSync(avatarsDir);
    }
    
    // Create a unique filename
    const filename = `${ensName.replace(/\./g, '-')}.${fileExtension}`;
    const filePath = path.join(avatarsDir, filename);
    
    // Save the file
    fs.writeFileSync(filePath, Buffer.from(imageData));
    console.log(`Avatar saved to: ${filePath}`);
    
    // Return the URL
    return `/avatars/${filename}`;
  } catch (error) {
    console.error('Error in downloadAndSaveAvatarLocally:', error);
    return null;
  }
}

/**
 * Downloads an avatar from a URL and uploads it to Vercel Blob
 * @param avatarUrl The URL of the avatar to download
 * @param ensName The ENS name associated with the avatar
 * @returns The URL of the uploaded avatar in Vercel Blob
 */
export async function downloadAndUploadAvatar(avatarUrl: string, ensName: string): Promise<string | null> {
  // For development, save the avatar locally
  if (process.env.NODE_ENV === 'development') {
    return downloadAndSaveAvatarLocally(avatarUrl, ensName);
  }
  
  try {
    console.log('Original avatar URL:', avatarUrl);
    
    // Clean the avatar URL - remove ALL whitespace including newlines
    const cleanedUrl = avatarUrl.replace(/\s+/g, '');
    console.log(`Downloading avatar for ${ensName} from cleaned URL: ${cleanedUrl}`);
    
    // Check if we have a Vercel Blob token
    if (!process.env.NEXT_PUBLIC_VERCEL_BLOB_RW_TOKEN) {
      console.error('Missing NEXT_PUBLIC_VERCEL_BLOB_RW_TOKEN environment variable');
      return null;
    }
    
    // Fetch the avatar
    console.log('Fetching avatar...');
    const response = await fetch(cleanedUrl);
    
    if (!response.ok) {
      console.error(`Failed to download avatar: ${response.status} ${response.statusText}`);
      return null;
    }
    
    console.log('Avatar fetched successfully, content type:', response.headers.get('content-type'));
    
    // Get the image data
    const imageData = await response.arrayBuffer();
    console.log('Image data size:', imageData.byteLength, 'bytes');
    
    // Determine the file extension based on content type
    const contentType = response.headers.get('content-type') || 'image/png';
    const fileExtension = contentType.split('/')[1] || 'png';
    
    // Create a unique filename
    const filename = `ens-avatars/${ensName.replace(/\./g, '-')}.${fileExtension}`;
    console.log('Uploading to Vercel Blob with filename:', filename);
    
    // Upload to Vercel Blob
    try {
      const blob = await put(
        filename,
        new Blob([imageData], { type: contentType }),
        {
          access: 'public',
          addRandomSuffix: false, // Use consistent naming
        }
      );
      
      console.log(`Avatar uploaded to Vercel Blob: ${blob.url}`);
      return blob.url;
    } catch (uploadError) {
      console.error('Error uploading to Vercel Blob:', uploadError);
      return null;
    }
  } catch (error) {
    console.error('Error in downloadAndUploadAvatar:', error);
    return null;
  }
} 