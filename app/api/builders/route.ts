import { NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/mongodb"

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET() {
  try {
    const { db } = await connectToDatabase();
    
    console.log('Fetching builders...');
    
    // Get all profiles
    const profiles = await db.collection('profiles').find().sort({ updatedAt: -1 }).toArray();
    
    console.log('Fetched profiles:', profiles);
    console.log('Builders fetched:', profiles.length, 'results');
    
    // Return the profiles with cache control headers to prevent caching
    return NextResponse.json(profiles, {
      headers: {
        'Cache-Control': 'no-store, max-age=0, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0'
      }
    });
  } catch (error) {
    console.error('Error fetching builders:', error);
    return NextResponse.json({ error: 'Failed to fetch builders' }, { status: 500 });
  }
} 