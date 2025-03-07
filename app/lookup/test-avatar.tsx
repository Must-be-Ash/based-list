'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { Button } from '@/app/components/ui/button';
import { Card, CardContent } from '@/app/components/ui/card';
import { cleanEnsRecordValue } from '@/app/lookup/utils/ens';

export default function TestAvatar() {
  const [avatarUrl, setAvatarUrl] = useState('');
  const [avatarError, setAvatarError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  const testAvatarUrl = 'https://zku9gdedgba48lmr.public.blob.vercel-storage.com/basenames/avatar/jesse.base.eth/1722020142962/cryptopunk-diuDROjlL5OLY6EcC5keHTsNAiWMSL.png';
  
  useEffect(() => {
    // Clean the URL on component mount
    setAvatarUrl(cleanEnsRecordValue(testAvatarUrl));
  }, []);
  
  const handleFetchAvatar = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/ens/lookup?name=jesse&type=name');
      const data = await response.json();
      
      console.log('API Response:', data);
      
      const avatarRecord = data.records.find((r: { key: string; value: string; type: string }) => r.key === 'avatar');
      if (avatarRecord) {
        const cleanedUrl = cleanEnsRecordValue(avatarRecord.value);
        console.log('Cleaned URL:', cleanedUrl);
        setAvatarUrl(cleanedUrl);
      }
    } catch (error) {
      console.error('Error fetching avatar:', error);
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Avatar Test</h1>
      
      <Card className="mb-8">
        <CardContent className="p-6">
          <h2 className="text-xl font-semibold mb-4">Current Avatar URL:</h2>
          <pre className="bg-gray-100 dark:bg-gray-800 p-4 rounded-md overflow-x-auto mb-4">
            {avatarUrl || 'No URL set'}
          </pre>
          
          <Button onClick={handleFetchAvatar} disabled={isLoading}>
            {isLoading ? 'Loading...' : 'Fetch from API'}
          </Button>
        </CardContent>
      </Card>
      
      <Card>
        <CardContent className="p-6">
          <h2 className="text-xl font-semibold mb-4">Avatar Preview:</h2>
          
          {avatarUrl ? (
            <div className="relative w-32 h-32 rounded-full overflow-hidden border-4 border-white dark:border-[#121212] shadow-lg">
              <Image 
                src={avatarUrl} 
                alt="Avatar preview"
                fill
                className="object-cover"
                onError={() => {
                  console.error('Error loading avatar image');
                  setAvatarError(true);
                }}
                unoptimized={true}
              />
            </div>
          ) : (
            <div className="w-32 h-32 rounded-full bg-gradient-to-br from-[#0052FF] to-[#0052FF]/70 flex items-center justify-center text-white text-2xl font-bold">
              JE
            </div>
          )}
          
          {avatarError && (
            <p className="text-red-500 mt-4">
              Error loading avatar image. Please check the URL.
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
} 