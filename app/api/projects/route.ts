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
    
    // Get user info from builders collection
    const builder = await db
      .collection('builders')
      .findOne({ userId: user.id })

    if (!builder) {
      return NextResponse.json(
        { error: 'Builder profile not found' },
        { status: 404 }
      )
    }

    const data = await req.json()
    const projectData = {
      ...data,
      userId: user.id,
      builderName: builder.name,
      builderImage: builder.profileImage,
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