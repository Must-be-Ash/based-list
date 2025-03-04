import { connectToDatabase } from "@/lib/mongodb"
import { ProfileCard } from "./profile-card"
import { notFound } from "next/navigation"
import { Role } from "@/app/types"
import { DiscoverProjectCard } from "@/app/components/DiscoverProjectCard"
import type { Project } from "@/app/types"

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

async function getUserProjects(userId: string): Promise<Project[]> {
  const { db } = await connectToDatabase()
  const projects = await db
    .collection("projects")
    .find({ userId })
    .sort({ createdAt: -1 })
    .toArray()
  
  return projects.map(project => ({
    ...project,
    _id: project._id.toString(),
    createdAt: project.createdAt instanceof Date ? project.createdAt : new Date(project.createdAt),
    updatedAt: project.updatedAt instanceof Date ? project.updatedAt : new Date(project.updatedAt),
  })) as Project[]
}

export default async function ProfilePage({ params }: { params: { userId: string } }) {
  const profile = await getProfile(params.userId)
  const projects = await getUserProjects(params.userId)

  if (!profile) {
    return notFound()
  }

  return (
    <main className="min-h-screen pt-32 pb-24 px-4">
      <div className="max-w-4xl mx-auto">
        <ProfileCard profile={profile} />
        
        {projects.length > 0 && (
          <div className="mt-12">
            <h2 className="text-2xl font-bold mb-6">Projects</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {projects.map(project => (
                <DiscoverProjectCard key={project._id} project={project} />
              ))}
            </div>
          </div>
        )}
      </div>
    </main>
  )
} 
