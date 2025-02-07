import { connectToDatabase } from "@/lib/mongodb"
import { ProfileCard } from "./profile-card"
import { notFound } from "next/navigation"
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

interface Profile {
  _id: string
  name: string
  bio: string
  profileImage?: string
  links: Link[]
  socials?: Socials
  github?: string
  website?: string
  userId: string
  roles?: Role[]
}

const DEFAULT_LINKS = [
  { name: "Site", url: "" },
  { name: "GitHub", url: "" }
]

async function getProfile(userId: string): Promise<Profile | null> {
  const { db } = await connectToDatabase()
  const profile = await db.collection("profiles").findOne({ userId })
  if (!profile) return null
  
  return {
    _id: profile._id.toString(),
    name: profile.name || "",
    bio: profile.bio || "",
    profileImage: profile.profileImage,
    links: profile.links || DEFAULT_LINKS,
    socials: profile.socials || {},
    github: profile.github || "",
    website: profile.website || "",
    userId: profile.userId,
    roles: profile.roles || []
  }
}

export default async function ProfilePage({ params }: { params: { userId: string } }) {
  const profile = await getProfile(params.userId)

  if (!profile) {
    return notFound()
  }

  return (
    <main className="min-h-screen pt-32 pb-4 px-4">
      <ProfileCard profile={profile} />
    </main>
  )
} 
