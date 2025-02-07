import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';

export async function POST(request: Request) {
  try {
    const { title, description, link } = await request.json();

    // Validate the input
    if (!title || !description || !link) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Connect to MongoDB
    const { db } = await connectToDatabase();

    // Insert the new resource
    const result = await db.collection('submitted_resources').insertOne({
      title,
      description,
      link,
      status: 'pending', // Add a status field to manage approvals if needed
      createdAt: new Date(),
    });

    return NextResponse.json(
      { message: 'Resource submitted successfully', id: result.insertedId },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error submitting resource:', error);
    return NextResponse.json(
      { error: 'Failed to submit resource' },
      { status: 500 }
    );
  }
} 