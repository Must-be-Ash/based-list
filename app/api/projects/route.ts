import { NextResponse } from 'next/server'
import { currentUser } from '@clerk/nextjs/server'
import clientPromise from '@/lib/mongodb'
import type { Project } from '@/app/types'

export async function GET() {
  try {
    const client = await clientPromise
    const db = client.db('based-list')
    
    const projects = await db
      .collection('projects')
      .find({})
      .sort({ createdAt: -1 })
      .toArray()

    return NextResponse.json(projects)
  } catch (error) {
    console.error('Error fetching projects:', error)
    return NextResponse.json(
      { error: 'Failed to fetch projects' },
      { status: 500 }
    )
  }
}

export async function POST(req: Request) {
  try {
    const user = await currentUser()
    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const client = await clientPromise
    const db = client.db('based-list')
    
    // Get user info from profiles collection
    let profile = await db
      .collection('profiles')
      .findOne({ userId: user.id })

    // If profile doesn't exist, create a default one
    if (!profile) {
      const defaultProfile = {
        name: user.firstName && user.lastName 
          ? `${user.firstName} ${user.lastName}` 
          : user.firstName || user.username || 'Anonymous',
        bio: '',
        profileImage: user.imageUrl,
        links: [],
        userId: user.id,
        createdAt: new Date(),
        updatedAt: new Date()
      }
      
      // Insert the default profile
      const result = await db
        .collection('profiles')
        .insertOne(defaultProfile)
      
      profile = {
        ...defaultProfile,
        _id: result.insertedId
      }
      
      console.log('Created default profile for user:', user.id)
    }

    const data = await req.json()
    const projectData = {
      ...data,
      userId: user.id,
      builderName: profile.name,
      builderImage: profile.profileImage,
      upvotes: [],  // Initialize empty upvotes array
      upvoteCount: 0, // Initialize upvote count to zero
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    const result = await db
      .collection('projects')
      .insertOne(projectData)

    return NextResponse.json({
      ...projectData,
      _id: result.insertedId.toString(),
    } as Project)
  } catch (error) {
    console.error('Error creating project:', error)
    return NextResponse.json(
      { error: 'Failed to create project' },
      { status: 500 }
    )
  }
} 