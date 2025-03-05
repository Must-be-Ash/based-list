import { NextResponse } from 'next/server'
import { currentUser } from '@clerk/nextjs/server'
import clientPromise from '@/lib/mongodb'
import { ObjectId } from 'mongodb'

// Define a type for the project document
interface ProjectDocument {
  _id: ObjectId;
  name: string;
  description: string;
  logo?: string;
  websiteUrl?: string;
  githubUrl?: string;
  userId: string;
  builderName: string;
  builderImage?: string;
  upvotes: string[];
  upvoteCount: number;
  createdAt: Date;
  updatedAt: Date;
}

// POST to upvote a project
export async function POST(
  request: Request,
  { params }: { params: { projectId: string } }
) {
  try {
    // Check authentication
    const user = await currentUser()
    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const client = await clientPromise
    const db = client.db('based-list')
    
    // Check if project exists
    const project = await db
      .collection<ProjectDocument>('projects')
      .findOne({ _id: new ObjectId(params.projectId) })
    
    if (!project) {
      return NextResponse.json(
        { error: 'Project not found' },
        { status: 404 }
      )
    }
    
    // Check if user has already upvoted
    const upvotes = project.upvotes || []
    const hasUpvoted = upvotes.includes(user.id)
    
    if (hasUpvoted) {
      // Remove upvote if already upvoted (toggle behavior)
      await db
        .collection<ProjectDocument>('projects')
        .updateOne(
          { _id: new ObjectId(params.projectId) },
          { 
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            $pull: { upvotes: user.id as any },
            $inc: { upvoteCount: -1 }
          }
        )
      
      return NextResponse.json({ 
        success: true, 
        upvoted: false,
        upvoteCount: (project.upvoteCount || 1) - 1
      })
    } else {
      // Add upvote
      await db
        .collection<ProjectDocument>('projects')
        .updateOne(
          { _id: new ObjectId(params.projectId) },
          { 
            $addToSet: { upvotes: user.id },
            $inc: { upvoteCount: 1 }
          }
        )
      
      return NextResponse.json({ 
        success: true, 
        upvoted: true,
        upvoteCount: (project.upvoteCount || 0) + 1
      })
    }
  } catch (error) {
    console.error('Error upvoting project:', error)
    return NextResponse.json(
      { error: 'Failed to upvote project' },
      { status: 500 }
    )
  }
}

// GET to check if user has upvoted
export async function GET(
  request: Request,
  { params }: { params: { projectId: string } }
) {
  try {
    // Check authentication
    const user = await currentUser()
    if (!user) {
      return NextResponse.json(
        { upvoted: false, upvoteCount: 0 },
        { status: 200 }
      )
    }

    const client = await clientPromise
    const db = client.db('based-list')
    
    // Get project
    const project = await db
      .collection<ProjectDocument>('projects')
      .findOne({ _id: new ObjectId(params.projectId) })
    
    if (!project) {
      return NextResponse.json(
        { error: 'Project not found' },
        { status: 404 }
      )
    }
    
    // Check if user has upvoted
    const upvotes = project.upvotes || []
    const hasUpvoted = upvotes.includes(user.id)
    
    return NextResponse.json({ 
      upvoted: hasUpvoted,
      upvoteCount: project.upvoteCount || 0
    })
  } catch (error) {
    console.error('Error checking upvote status:', error)
    return NextResponse.json(
      { error: 'Failed to check upvote status' },
      { status: 500 }
    )
  }
} 