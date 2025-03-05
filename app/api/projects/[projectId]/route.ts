import { NextResponse } from 'next/server'
import { currentUser } from '@clerk/nextjs/server'
import clientPromise from '@/lib/mongodb'
import { ObjectId } from 'mongodb'
import type { Project } from '@/app/types'

// Get a specific project
export async function GET(
  request: Request,
  { params }: { params: { projectId: string } }
) {
  try {
    const client = await clientPromise
    const db = client.db('based-list')
    
    const project = await db
      .collection('projects')
      .findOne({ _id: new ObjectId(params.projectId) })
    
    if (!project) {
      return NextResponse.json(
        { error: 'Project not found' },
        { status: 404 }
      )
    }
    
    return NextResponse.json({
      ...project,
      _id: project._id.toString(),
    })
  } catch (error) {
    console.error('Error fetching project:', error)
    return NextResponse.json(
      { error: 'Failed to fetch project' },
      { status: 500 }
    )
  }
}

// Update a project
export async function PUT(
  request: Request,
  { params }: { params: { projectId: string } }
) {
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
    
    // Check if project exists and belongs to the user
    const existingProject = await db
      .collection('projects')
      .findOne({ 
        _id: new ObjectId(params.projectId),
      })
    
    if (!existingProject) {
      return NextResponse.json(
        { error: 'Project not found' },
        { status: 404 }
      )
    }
    
    // Verify ownership
    if (existingProject.userId !== user.id) {
      return NextResponse.json(
        { error: 'You do not have permission to update this project' },
        { status: 403 }
      )
    }
    
    const data = await request.json()
    
    // Update only allowed fields
    const updateData = {
      name: data.name,
      description: data.description,
      logo: data.logo,
      websiteUrl: data.websiteUrl,
      githubUrl: data.githubUrl,
      projectTypes: data.projectTypes,
      updatedAt: new Date(),
    }
    
    const result = await db
      .collection('projects')
      .updateOne(
        { _id: new ObjectId(params.projectId) },
        { $set: updateData }
      )
    
    if (result.matchedCount === 0) {
      return NextResponse.json(
        { error: 'Project not found' },
        { status: 404 }
      )
    }
    
    return NextResponse.json({
      ...existingProject,
      ...updateData,
      _id: existingProject._id.toString(),
    } as Project)
  } catch (error) {
    console.error('Error updating project:', error)
    return NextResponse.json(
      { error: 'Failed to update project' },
      { status: 500 }
    )
  }
}

// Delete a project
export async function DELETE(
  request: Request,
  { params }: { params: { projectId: string } }
) {
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
    
    // Check if project exists and belongs to the user
    const existingProject = await db
      .collection('projects')
      .findOne({ 
        _id: new ObjectId(params.projectId),
      })
    
    if (!existingProject) {
      return NextResponse.json(
        { error: 'Project not found' },
        { status: 404 }
      )
    }
    
    // Verify ownership
    if (existingProject.userId !== user.id) {
      return NextResponse.json(
        { error: 'You do not have permission to delete this project' },
        { status: 403 }
      )
    }
    
    const result = await db
      .collection('projects')
      .deleteOne({ _id: new ObjectId(params.projectId) })
    
    if (result.deletedCount === 0) {
      return NextResponse.json(
        { error: 'Project not found' },
        { status: 404 }
      )
    }
    
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting project:', error)
    return NextResponse.json(
      { error: 'Failed to delete project' },
      { status: 500 }
    )
  }
} 