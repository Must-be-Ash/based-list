import { NextRequest, NextResponse } from 'next/server';
import { handleUpload } from '@vercel/blob/client';

export async function POST(request: NextRequest): Promise<NextResponse> {
  const body = await request.json();
  
  try {
    const jsonResponse = await handleUpload({
      body,
      request,
      token: process.env.NEXT_PUBLIC_VERCEL_BLOB_RW_TOKEN,
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      onBeforeGenerateToken: async (pathname, clientPayload) => {
        // Check if the user is allowed to upload
        return {
          allowedContentTypes: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
          maximumSizeInBytes: 10 * 1024 * 1024, // 10MB
          tokenPayload: JSON.stringify({
            // Add any additional payload here
            pathname,
          }),
        };
      },
      onUploadCompleted: async ({ blob, tokenPayload }) => {
        // This is called after the upload is complete
        console.log('Upload complete for', blob.url);
        
        try {
          // You can store the blob URL in your database here
          if (tokenPayload) {
            const parsedPayload = JSON.parse(tokenPayload);
            console.log('Token payload:', parsedPayload);
          }
        } catch (error) {
          console.error('Error in onUploadCompleted:', error);
        }
      },
    });
    
    return NextResponse.json(jsonResponse);
  } catch (error) {
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 400 }
    );
  }
} 