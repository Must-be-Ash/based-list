// Simple script to test the avatar URL
const fs = require('fs');
const https = require('https');

// The problematic URL with newlines
const rawUrl = `https://zku9gdedgba48lmr.public.blob.vercel-storage.com/basenames/avatar/jesse.base.eth/1722
020142962/cryptopunk-diuDROjlL5OLY6EcC5keHTsNAiWMSL.png`;

// Clean the URL by removing all whitespace
const cleanUrl = rawUrl.replace(/\s+/g, '');

console.log('Original URL:', rawUrl);
console.log('Cleaned URL:', cleanUrl);

// Try to fetch the image
https.get(cleanUrl, (res) => {
  console.log('Response status code:', res.statusCode);
  console.log('Response headers:', res.headers);
  
  // Create a write stream to save the image
  const fileStream = fs.createWriteStream('avatar.png');
  res.pipe(fileStream);
  
  fileStream.on('finish', () => {
    console.log('Image downloaded successfully to avatar.png');
  });
  
  fileStream.on('error', (err) => {
    console.error('Error saving image:', err);
  });
}).on('error', (err) => {
  console.error('Error fetching image:', err);
}); 