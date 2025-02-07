import { NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/mongodb"
import { normalizeUrl } from "@/lib/utils"

export async function GET(request: Request, { params }: { params: { userId: string } }) {
  try {
    const { db } = await connectToDatabase()
    const user = await db.collection("profiles").findOne({ userId: params.userId })

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    // Create a new object without the _id field
    const { name, bio, links, socials, profileImage, roles, userId } = user
    const safeUser = { name, bio, links, socials, profileImage, roles, userId }

    return NextResponse.json(safeUser)
  } catch (error) {
    console.error('Error fetching profile:', error)
    return NextResponse.json(
      { error: "Failed to fetch profile" },
      { status: 500 }
    )
  }
}

export async function PUT(request: Request, { params }: { params: { userId: string } }) {
  try {
    const { db } = await connectToDatabase()
    const data = await request.json()
    
    // Create update data without _id field
    const updateData = { ...data }
    delete updateData._id

    // Normalize URLs in links
    if (updateData.links) {
      updateData.links = updateData.links.map((link: { name: string, url: string }) => ({
        ...link,
        url: normalizeUrl(link.url)
      }))
    }

    // Normalize URLs in socials
    if (updateData.socials) {
      const normalizedSocials = { ...updateData.socials }
      for (const [key, value] of Object.entries(normalizedSocials)) {
        if (typeof value === 'string' && value) {
          normalizedSocials[key] = normalizeUrl(value)
        }
      }
      updateData.socials = normalizedSocials
    }

    const result = await db.collection("profiles").updateOne(
      { userId: params.userId }, 
      { 
        $set: { 
          ...updateData,
          userId: params.userId, // Ensure userId is set
          updatedAt: new Date() 
        } 
      }, 
      { upsert: true }
    )

    return NextResponse.json({ success: true, result })
  } catch (error) {
    console.error('Error updating profile:', error)
    return NextResponse.json(
      { error: "Failed to update profile" },
      { status: 500 }
    )
  }
}

