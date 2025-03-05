import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { Button } from '@/app/components/ui/button'
import clientPromise from '@/lib/mongodb'
import { ObjectId } from 'mongodb'
import { FaGlobe, FaGithub } from 'react-icons/fa'
import { currentUser } from '@clerk/nextjs/server'
import { Edit } from 'lucide-react'
import { UpvoteButton } from '@/app/components/UpvoteButton'
import type { Project } from '@/app/types'

async function getProject(projectId: string): Promise<Project | null> {
  try {
    const client = await clientPromise
    const db = client.db('based-list')
    
    const project = await db
      .collection('projects')
      .findOne({ _id: new ObjectId(projectId) })
    
    if (!project) return null
    
    return {
      ...project,
      _id: project._id.toString(),
      createdAt: project.createdAt instanceof Date ? project.createdAt : new Date(project.createdAt),
      updatedAt: project.updatedAt instanceof Date ? project.updatedAt : new Date(project.updatedAt),
    } as Project
  } catch (error) {
    console.error('Error fetching project:', error)
    return null
  }
}

export default async function ProjectPage({ params }: { params: { projectId: string } }) {
  const project = await getProject(params.projectId)
  const user = await currentUser()
  
  if (!project) {
    return notFound()
  }
  
  // Check if the current user is the owner of the project
  const isOwner = user && user.id === project.userId
  
  // Check if the current user has upvoted the project
  const hasUpvoted = user && project.upvotes?.includes(user.id) || false
  
  return (
    <main className="min-h-screen pt-32 pb-24 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white dark:bg-zinc-900 rounded-xl shadow-sm overflow-hidden">
          <div className="p-8">
            <div className="flex flex-col md:flex-row gap-6 items-start">
              <div className="w-24 h-24 rounded-xl overflow-hidden bg-gray-100 dark:bg-gray-800 flex-shrink-0">
                {project.logo ? (
                  <Image
                    src={project.logo}
                    alt={project.name}
                    width={96}
                    height={96}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-blue-50 dark:bg-blue-900/20">
                    <span className="text-3xl font-bold text-blue-500">{project.name[0]}</span>
                  </div>
                )}
              </div>
              
              <div className="flex-1">
                <div className="flex justify-between items-start">
                  <h1 className="text-3xl font-bold mb-2">{project.name}</h1>
                  
                  <div className="flex gap-2">
                    <UpvoteButton 
                      projectId={project._id} 
                      initialUpvoteCount={project.upvoteCount || 0}
                      initialUpvoted={hasUpvoted}
                      size="default"
                      className="rounded-xl shadow-sm hover:shadow hover:bg-blue-50 dark:hover:bg-blue-900/10 transition-all"
                    />
                    
                    {isOwner && (
                      <Button asChild variant="outline" className="gap-1 rounded-xl shadow-sm hover:shadow hover:bg-gray-50 dark:hover:bg-zinc-800 transition-all">
                        <Link href={`/projects/${project._id}/edit`}>
                          <Edit className="w-4 h-4" />
                          Edit
                        </Link>
                      </Button>
                    )}
                  </div>
                </div>
                
                <p className="text-gray-600 dark:text-gray-300 mb-6 text-lg">
                  {project.description}
                </p>
                
                <div className="flex items-center gap-4">
                  {project.websiteUrl && (
                    <Button 
                      asChild 
                      variant="outline" 
                      className="gap-2 rounded-xl shadow-sm hover:shadow hover:bg-gray-50 dark:hover:bg-zinc-800 transition-all border-blue-200 dark:border-blue-900/30 text-blue-600 dark:text-blue-400"
                    >
                      <a href={project.websiteUrl} target="_blank" rel="noopener noreferrer">
                        <FaGlobe className="w-4 h-4 text-blue-500" />
                        Visit Website
                      </a>
                    </Button>
                  )}
                  
                  {project.githubUrl && (
                    <Button 
                      asChild 
                      variant="outline" 
                      className="gap-2 rounded-xl shadow-sm hover:shadow hover:bg-gray-50 dark:hover:bg-zinc-800 transition-all"
                    >
                      <a href={project.githubUrl} target="_blank" rel="noopener noreferrer">
                        <FaGithub className="w-4 h-4 text-gray-700 dark:text-gray-300" />
                        View on GitHub
                      </a>
                    </Button>
                  )}
                </div>
              </div>
            </div>
            
            <div className="mt-8 pt-6 border-t border-gray-100 dark:border-gray-800">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-100 dark:bg-gray-800">
                  {project.builderImage ? (
                    <Image
                      src={project.builderImage}
                      alt={project.builderName}
                      width={40}
                      height={40}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gray-200 dark:bg-gray-700">
                      <span className="text-sm font-bold text-gray-500">{project.builderName[0]}</span>
                    </div>
                  )}
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Created by</p>
                  <Link 
                    href={`/profile/${project.userId}`}
                    className="font-medium text-blue-600 dark:text-blue-400 hover:underline"
                  >
                    {project.builderName}
                  </Link>
                </div>
                <div className="ml-auto text-sm text-gray-500 dark:text-gray-400">
                  {new Date(project.createdAt).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric'
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
} 