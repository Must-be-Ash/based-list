import { MongoClient, ObjectId } from "mongodb"
import { Role } from "@/app/types"

interface Link {
  name: string
  url: string
}

interface Socials {
  telegram?: string
  discord?: string
  twitter?: string
  linkedin?: string
}

interface Builder {
  _id: string
  name: string
  bio: string
  profileImage?: string
  links: Link[]
  socials?: Socials
  userId: string  // Add userId since it's in the profiles collection
  roles?: Role[]
}

if (!process.env.MONGODB_URI) {
  throw new Error('Please add your Mongo URI to .env.local')
}

const uri = process.env.MONGODB_URI
const options = {}

let client: MongoClient
let clientPromise: Promise<MongoClient>

if (process.env.NODE_ENV === "development") {
  // In development mode, use a global variable so that the value
  // is preserved across module reloads caused by HMR (Hot Module Replacement).
  const globalWithMongo = global as typeof globalThis & {
    _mongoClientPromise?: Promise<MongoClient>
  }

  if (!globalWithMongo._mongoClientPromise) {
    client = new MongoClient(uri, options)
    globalWithMongo._mongoClientPromise = client.connect()
  }
  clientPromise = globalWithMongo._mongoClientPromise as Promise<MongoClient>
} else {
  // In production mode, it's best to not use a global variable.
  client = new MongoClient(uri, options)
  clientPromise = client.connect()
}

// Export a module-scoped MongoClient promise
export default clientPromise

export async function connectToDatabase() {
  const client = await clientPromise
  const db = client.db(process.env.MONGODB_DB || 'based-list')
  return { client, db }
}

export async function getBuilders(): Promise<Builder[]> {
  const client = await clientPromise
  const db = client.db(process.env.MONGODB_DB || 'based-list')
  try {
    const profiles = await db.collection("profiles").find({}).toArray()
    console.log('Fetched profiles:', profiles)
    return profiles.map(profile => ({
      _id: profile._id.toString(),
      name: profile.name || "",
      bio: profile.bio || "",
      profileImage: profile.profileImage,
      links: profile.links || [
        { name: "Site", url: profile.website || "" },
        { name: "GitHub", url: profile.github || "" }
      ],
      socials: profile.socials || {},
      userId: profile.userId,
      roles: profile.roles || []
    }))
  } catch (error) {
    console.error('Error fetching profiles:', error)
    return []
  }
}

export async function getBuilderById(id: string): Promise<Builder | null> {
  const client = await clientPromise
  const db = client.db(process.env.MONGODB_DB || 'based-list')
  try {
    const profile = await db.collection("profiles").findOne({ _id: new ObjectId(id) })
    if (!profile) return null
    
    return {
      _id: profile._id.toString(),
      name: profile.name || "",
      bio: profile.bio || "",
      profileImage: profile.profileImage,
      links: profile.links || [
        { name: "Site", url: profile.website || "" },
        { name: "GitHub", url: profile.github || "" }
      ],
      socials: profile.socials || {},
      userId: profile.userId,
      roles: profile.roles || []
    }
  } catch (error) {
    console.error('Error fetching profile:', error)
    return null
  }
}

