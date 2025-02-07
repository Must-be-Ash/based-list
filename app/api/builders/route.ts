import { NextResponse } from "next/server"
import { getBuilders } from "@/lib/mongodb"

export async function GET() {
  try {
    console.log('Fetching builders...')
    const builders = await getBuilders()
    console.log('Builders fetched:', builders.length, 'results')
    return NextResponse.json(builders)
  } catch (error) {
    console.error('Error fetching builders:', error)
    return NextResponse.json(
      { error: "Failed to fetch builders" },
      { status: 500 }
    )
  }
} 