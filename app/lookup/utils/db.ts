import { connectToDatabase } from '@/lib/mongodb';
import { formatIpfsUrl } from './ens';

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
  skills?: string[];
}

/**
 * Extract skills from ENS profile records
 * @param records The ENS profile records
 * @returns Array of skills
 */
function extractSkillsFromRecords(records: ENSRecord[]): string[] {
  const skills: string[] = [];
  
  // Look for records with keys that might contain skills
  const skillRecords = records.filter(r => 
    r.key.includes('skill') || 
    r.key.includes('expertise') || 
    r.key.includes('technology')
  );
  
  console.log('Found skill-specific records:', skillRecords.length > 0 ? skillRecords : 'None');
  
  // Extract skills from these records
  skillRecords.forEach(record => {
    // If the value is a comma-separated list, split it
    if (record.value.includes(',')) {
      const skillList = record.value.split(',').map(s => s.trim());
      skills.push(...skillList);
    } else {
      skills.push(record.value.trim());
    }
  });
  
  // Get all text from relevant records for skill inference
  const description = records.find(r => r.key === 'description')?.value || '';
  const github = records.find(r => r.key === 'com.github')?.value || '';
  const twitter = records.find(r => r.key === 'com.twitter')?.value || '';
  const allText = `${description} ${github} ${twitter}`.toLowerCase();
  
  console.log('Text for skill inference:', { description, github, twitter });
  
  // Official approved skills list
  const approvedSkills = [
    'Solidity',
    'Rust',
    'Security',
    'Javascript',
    'Typescript',
    'Go',
    'Game development',
    'Data',
    'UI/UX',
    'Prototyping',
    'Research',
    'Music',
    'Illustration',
    'Writing',
    'Video',
    'Graphic design',
    'Animation',
    'Visual design',
    'Design',
    'Digital art',
    'Photography',
    'Community',
    'Product management',
    'Strategy',
    'Business development',
    'Legal',
    'Marketing'
  ];
  
  const keywordMatches: string[] = [];
  
  // Check if any of these skills are mentioned in the text
  approvedSkills.forEach(skill => {
    const lowerSkill = skill.toLowerCase();
    
    // Check for exact matches or word boundaries
    if (
      allText.includes(` ${lowerSkill} `) || 
      allText.includes(`${lowerSkill},`) || 
      allText.includes(`${lowerSkill}.`) || 
      allText.includes(`${lowerSkill}!`) || 
      allText.includes(`${lowerSkill}:`) || 
      allText.includes(`${lowerSkill};`) || 
      allText.startsWith(lowerSkill) || 
      allText.endsWith(lowerSkill) ||
      allText.includes(lowerSkill)
    ) {
      skills.push(skill);
      keywordMatches.push(skill);
    }
  });
  
  console.log('Skills matched from keywords:', keywordMatches.length > 0 ? keywordMatches : 'None');
  
  const specialCaseSkills: string[] = [];
  
  // Special case for "idea guy" in the description
  if (description.toLowerCase().includes('idea guy')) {
    // Only add if they're in the approved list
    if (approvedSkills.includes('Product management')) {
      skills.push('Product management');
      specialCaseSkills.push('Product management');
    }
    if (approvedSkills.includes('Strategy')) {
      skills.push('Strategy');
      specialCaseSkills.push('Strategy');
    }
  }
  
  // Special case for "makes things" in the description
  if (description.toLowerCase().includes('makes things')) {
    // Only add if they're in the approved list
    if (approvedSkills.includes('Prototyping')) {
      skills.push('Prototyping');
      specialCaseSkills.push('Prototyping');
    }
  }
  
  console.log('Skills added from special cases:', specialCaseSkills.length > 0 ? specialCaseSkills : 'None');
  
  // Filter to ensure only approved skills are included
  const filteredSkills = skills.filter(skill => approvedSkills.includes(skill));
  
  // Remove duplicates and return
  const uniqueSkills = Array.from(new Set(filteredSkills));
  console.log('Final unique skills:', uniqueSkills);
  return uniqueSkills;
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
    const rawAvatarUrl = avatarRecord?.value || null;
    
    // Format the avatar URL for IPFS if needed
    const formattedAvatarUrl = rawAvatarUrl ? formatIpfsUrl(rawAvatarUrl) : null;
    
    console.log('Raw avatar URL from records:', rawAvatarUrl);
    console.log('Formatted avatar URL:', formattedAvatarUrl);
    
    // Extract skills from the profile records
    const skills = extractSkillsFromRecords(profile.records);
    console.log('Extracted skills:', skills);
    
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
            avatar: formattedAvatarUrl,
            records: profile.records,
            contentHash: profile.contentHash,
            skills: skills,
            updatedAt: new Date()
          }
        }
      );
    } else {
      console.log(`Creating new ENS Profile for ${profile.name}`);
      await db.collection("ens_profiles").insertOne({
        name: profile.name,
        address: profile.address,
        avatar: formattedAvatarUrl,
        records: profile.records,
        contentHash: profile.contentHash,
        skills: skills,
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
      profileImage: formattedAvatarUrl,
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
      skills: skills,
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
      avatar: formattedAvatarUrl || undefined
    };
  } catch (error) {
    console.error('Error saving ENS profile to database:', error);
    return profile;
  }
} 