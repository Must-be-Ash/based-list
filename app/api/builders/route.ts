import { NextResponse } from "next/server"
import { getBuilders } from "@/lib/mongodb"

export async function GET() {
  try {
    const builders = await getBuilders()
    return NextResponse.json(builders)
  } catch (error) {
    console.error('Error fetching builders:', error)
    return NextResponse.json(
      { error: "Failed to fetch builders" },
      { status: 500 }
    )
  }
} 