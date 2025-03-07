import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';

export async function GET() {
  try {
    const { db } = await connectToDatabase();
    
    // Get collection names
    const collections = await db.listCollections().toArray();
    const collectionNames = collections.map(c => c.name);
    
    // Get counts for each collection
    const counts = await Promise.all(
      collectionNames.map(async (name) => {
        const count = await db.collection(name).countDocuments();
        return { name, count };
      })
    );
    
    // Get the latest profiles with more details
    const profiles = await db.collection('profiles').find().sort({ updatedAt: -1 }).limit(5).toArray();
    const ensProfiles = await db.collection('ens_profiles').find().sort({ updatedAt: -1 }).limit(5).toArray();
    
    return NextResponse.json({
      collections: counts,
      latestProfiles: profiles.map(p => ({ 
        _id: p._id.toString(),
        name: p.name,
        ensName: p.ensName,
        bio: p.bio,
        profileImage: p.profileImage,
        links: p.links,
        socials: p.socials,
        ethAddress: p.ethAddress,
        isENSProfile: p.isENSProfile,
        skills: p.skills,
        createdAt: p.createdAt,
        updatedAt: p.updatedAt
      })),
      latestENSProfiles: ensProfiles.map(p => ({ 
        _id: p._id.toString(),
        name: p.name,
        avatar: p.avatar,
        records: p.records,
        address: p.address,
        contentHash: p.contentHash,
        skills: p.skills,
        createdAt: p.createdAt,
        updatedAt: p.updatedAt
      }))
    }, {
      headers: {
        'Cache-Control': 'no-store, max-age=0, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0'
      }
    });
  } catch (error) {
    console.error('Error in debug API:', error);
    return NextResponse.json(
      { error: 'Failed to get debug info' },
      { 
        status: 500,
        headers: {
          'Cache-Control': 'no-store, max-age=0, must-revalidate',
          'Pragma': 'no-cache',
          'Expires': '0'
        }
      }
    );
  }
} 