import { NextResponse, NextRequest } from "next/server"
import { put } from "@vercel/blob"
import { getAuth } from "@clerk/nextjs/server"

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const { userId } = getAuth(request)
    
    if (!userId) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    const form = await request.formData()
    const file = form.get("file") as File
    
    if (!file) {
      return NextResponse.json(
        { error: "No file provided" },
        { status: 400 }
      )
    }

    // Only allow images
    if (!file.type.startsWith("image/")) {
      return NextResponse.json(
        { error: "File must be an image" },
        { status: 400 }
      )
    }

    // Upload to Vercel Blob
    const blob = await put(file.name, file, {
      access: 'public',
      token: process.env.NEXT_PUBLIC_VERCEL_BLOB_RW_TOKEN!
    })

    return NextResponse.json(blob)
  } catch (error) {
    console.error('Error uploading file:', error)
    return NextResponse.json(
      { error: "Error uploading file" },
      { status: 500 }
    )
  }
} 