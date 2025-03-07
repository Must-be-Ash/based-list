import { connectToDatabase } from '@/lib/mongodb';

interface ENSRecord {
  key: string;
  value: string;
  type: string;
}

interface ENSProfileData {
  name: string;
  address?: string;
  avatar?: string;
  records: ENSRecord[];
  contentHash?: string | null;
}

interface BuilderProfileData {
  name: string;
  ensName: string;
  bio: string;
  profileImage?: string | null;
  links: { name: string; url: string; }[];
  socials: { twitter: string; github: string; };
  ethAddress?: string;
  isENSProfile: boolean;
  updatedAt: Date;
  createdAt?: Date;
}

/**
 * Saves an ENS profile to MongoDB
 * @param profile The ENS profile data to save
 * @returns The saved profile with cleaned avatar URL
 */
export async function saveENSProfile(profile: ENSProfileData): Promise<ENSProfileData> {
  try {
    // Connect to the database
    const { db } = await connectToDatabase();
    console.log('Connected to database');
    
    // Get the cleaned avatar URL directly from the records array
    const avatarRecord = profile.records.find(r => r.key === 'avatar');
    const cleanedAvatarUrl = avatarRecord?.value || null;
    
    console.log('Using avatar URL from records:', cleanedAvatarUrl);
    
    // Check if the profile already exists in the ENS profiles collection
    const existingENSProfile = await db.collection("ens_profiles").findOne({ name: profile.name });
    
    // Save to ENS profiles collection
    if (existingENSProfile) {
      console.log(`ENS Profile for ${profile.name} already exists, updating...`);
      await db.collection("ens_profiles").updateOne(
        { name: profile.name },
        { 
          $set: {
            address: profile.address,
            avatar: cleanedAvatarUrl,
            records: profile.records,
            contentHash: profile.contentHash,
            updatedAt: new Date()
          }
        }
      );
    } else {
      console.log(`Creating new ENS Profile for ${profile.name}`);
      await db.collection("ens_profiles").insertOne({
        name: profile.name,
        address: profile.address,
        avatar: cleanedAvatarUrl,
        records: profile.records,
        contentHash: profile.contentHash,
        createdAt: new Date(),
        updatedAt: new Date()
      });
    }
    
    // Now, also save to the profiles collection (used by builders)
    // Extract relevant information from ENS records
    const twitterRecord = profile.records.find(r => r.key === 'com.twitter');
    const githubRecord = profile.records.find(r => r.key === 'com.github');
    const websiteRecord = profile.records.find(r => r.key === 'url' || r.key === 'website');
    const descriptionRecord = profile.records.find(r => r.key === 'description');
    
    // Check if the profile already exists in the profiles collection
    const existingProfile = await db.collection("profiles").findOne({ 
      $or: [
        { name: profile.name },
        { ensName: profile.name }
      ]
    });
    
    // Create builder profile data
    const builderProfileData: BuilderProfileData = {
      name: profile.name.replace('.base.eth', ''), // Remove .base.eth suffix
      ensName: profile.name,
      bio: descriptionRecord?.value || `${profile.name} ENS profile`,
      profileImage: cleanedAvatarUrl,
      links: [
        { name: "Site", url: websiteRecord?.value || "" },
        { name: "GitHub", url: githubRecord?.value || "" }
      ],
      socials: {
        twitter: twitterRecord?.value || "",
        github: githubRecord?.value || ""
      },
      ethAddress: profile.address,
      isENSProfile: true,
      updatedAt: new Date()
    };
    
    if (existingProfile) {
      console.log(`Builder profile for ${profile.name} already exists, updating...`);
      await db.collection("profiles").updateOne(
        { _id: existingProfile._id },
        { $set: builderProfileData }
      );
    } else {
      console.log(`Creating new builder profile for ${profile.name}`);
      builderProfileData.createdAt = new Date();
      await db.collection("profiles").insertOne(builderProfileData);
    }
    
    // Return the profile with the cleaned avatar URL
    return {
      ...profile,
      avatar: cleanedAvatarUrl || undefined
    };
  } catch (error) {
    console.error('Error saving ENS profile to database:', error);
    return profile;
  }
} 