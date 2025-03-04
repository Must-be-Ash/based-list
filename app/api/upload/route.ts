import { NextResponse } from 'next/server'
import { put } from '@vercel/blob'
import { currentUser } from '@clerk/nextjs/server'
import { nanoid } from 'nanoid'

export async function POST(request: Request) {
  try {
    // Check authentication
    const user = await currentUser()
    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Get the form data
    const formData = await request.formData()
    const file = formData.get('file') as File
    
    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      )
    }

    // Validate file type
    if (!file.type.startsWith('image/')) {
      return NextResponse.json(
        { error: 'Only image files are allowed' },
        { status: 400 }
      )
    }

    // Generate a unique filename
    const fileExtension = file.name.split('.').pop()
    const fileName = `${nanoid()}.${fileExtension}`
    
    // Log token for debugging (will be removed in production)
    console.log('Using Blob token:', process.env.NEXT_PUBLIC_VERCEL_BLOB_RW_TOKEN ? 'Token exists' : 'Token missing')
    
    // Upload to Vercel Blob
    const blob = await put(`projects/${fileName}`, file, {
      access: 'public',
      contentType: file.type,
      token: process.env.NEXT_PUBLIC_VERCEL_BLOB_RW_TOKEN
    })

    return NextResponse.json(blob)
  } catch (error) {
    console.error('Error uploading file:', error)
    return NextResponse.json(
      { error: 'Failed to upload file' },
      { status: 500 }
    )
  }
} 