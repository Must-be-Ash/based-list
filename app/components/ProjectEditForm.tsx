'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { Textarea } from './ui/textarea'
import { Label } from './ui/label'
import { useAuth } from '@clerk/nextjs'
import { Upload, Link as LinkIcon, Github, Trash2 } from 'lucide-react'
import { toast } from 'sonner'
import { ConfirmationDialog } from './ui/confirmation-dialog'
import type { Project } from '../types'
import { ProjectType, PROJECT_TYPE_COLORS } from '../types'

interface ProjectEditFormProps {
  project: Project
  onUpdateSuccess?: (project: Project) => void
  onDeleteSuccess?: () => void
}

export function ProjectEditForm({ 
  project, 
  onUpdateSuccess, 
  onDeleteSuccess 
}: ProjectEditFormProps) {
  const router = useRouter()
  const { userId } = useAuth()
  
  const [formData, setFormData] = useState({
    name: project.name,
    description: project.description,
    websiteUrl: project.websiteUrl || '',
    githubUrl: project.githubUrl || '',
  })
  
  const [logo, setLogo] = useState<File | null>(null)
  const [logoPreview, setLogoPreview] = useState<string | null>(project.logo || null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false)
  const [selectedProjectTypes, setSelectedProjectTypes] = useState<ProjectType[]>(
    project.projectTypes || []
  )
  
  // Ensure the user is the owner of the project
  useEffect(() => {
    if (userId && project.userId !== userId) {
      toast.error("You don't have permission to edit this project")
      router.push('/discover')
    }
  }, [userId, project.userId, router])
  
  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setLogo(file)
      const reader = new FileReader()
      reader.onloadend = () => {
        setLogoPreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }
  
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target
    
    // Add character limit for description
    if (name === 'description' && value.length > 80) {
      return
    }
    
    setFormData((prev) => ({ ...prev, [name]: value }))
  }
  
  // Function to handle discarding changes - navigate back to project page
  const handleDiscard = () => {
    // Navigate back to the project page without saving changes
    router.push(`/projects/${project._id}`)
    toast.info('Changes discarded')
  }
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!userId) {
      toast.error('You must be logged in to update a project')
      return
    }
    
    try {
      setIsSubmitting(true)
      
      // Upload logo if changed
      let logoUrl = project.logo
      if (logo) {
        const formData = new FormData()
        formData.append('file', logo)
        
        const uploadResponse = await fetch('/api/upload', {
          method: 'POST',
          body: formData,
        })
        
        if (!uploadResponse.ok) {
          const errorData = await uploadResponse.json()
          throw new Error(errorData.error || 'Failed to upload logo')
        }
        
        const uploadData = await uploadResponse.json()
        logoUrl = uploadData.url
      }
      
      // Update project data
      const projectData = {
        ...formData,
        logo: logoUrl,
        projectTypes: selectedProjectTypes,
      }
      
      const response = await fetch(`/api/projects/${project._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(projectData),
      })
      
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to update project')
      }
      
      const updatedProject = await response.json()
      
      toast.success('Project updated successfully!')
      
      if (onUpdateSuccess) {
        onUpdateSuccess(updatedProject)
      }
    } catch (error) {
      console.error('Error updating project:', error)
      toast.error(`Failed to update project: ${error instanceof Error ? error.message : 'Unknown error'}`)
    } finally {
      setIsSubmitting(false)
    }
  }
  
  const handleDelete = async () => {
    try {
      setIsDeleting(true)
      
      const response = await fetch(`/api/projects/${project._id}`, {
        method: 'DELETE',
      })
      
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to delete project')
      }
      
      toast.success('Project deleted successfully!')
      
      if (onDeleteSuccess) {
        onDeleteSuccess()
      } else {
        router.push('/discover')
      }
    } catch (error) {
      console.error('Error deleting project:', error)
      toast.error(`Failed to delete project: ${error instanceof Error ? error.message : 'Unknown error'}`)
    } finally {
      setIsDeleting(false)
    }
  }
  
  // Common classes for styling
  const inputClass = "mt-1 h-12 bg-white/80 dark:bg-zinc-800/80 border-gray-200 dark:border-gray-700 rounded-xl"
  const textareaClass = "mt-1 h-32 bg-white/80 dark:bg-zinc-800/80 border-gray-200 dark:border-gray-700 resize-none rounded-xl"
  
  const toggleProjectType = (type: ProjectType) => {
    setSelectedProjectTypes(prev => {
      if (prev.includes(type)) {
        return prev.filter(t => t !== type);
      } else {
        return [...prev, type];
      }
    });
  };
  
  return (
    <>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <Label htmlFor="logo">Project Logo</Label>
          <div className="mt-1 flex items-center space-x-6">
            <div className="w-24 h-24 rounded-xl overflow-hidden bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
              {logoPreview ? (
                <Image
                  src={logoPreview}
                  alt="Project logo preview"
                  width={96}
                  height={96}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="text-gray-400 flex flex-col items-center justify-center w-full h-full">
                  <Upload className="w-8 h-8 mb-1" />
                  <span className="text-xs">No logo</span>
                </div>
              )}
            </div>
            
            <div>
              <Button
                type="button"
                variant="outline"
                onClick={() => document.getElementById('logo-upload')?.click()}
                className="relative rounded-xl"
              >
                Change Logo
                <input
                  id="logo-upload"
                  type="file"
                  accept="image/*"
                  className="sr-only"
                  onChange={handleLogoChange}
                />
              </Button>
              <p className="text-xs text-gray-500 mt-2">
                Recommended: Square image, at least 200x200px
              </p>
            </div>
          </div>
        </div>
        
        <div>
          <Label htmlFor="name">Project Name</Label>
          <Input
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            className={inputClass}
          />
        </div>
        
        <div>
          <Label htmlFor="description">
            Description 
            <span className="text-xs text-gray-500 ml-2">
              ({formData.description.length}/80 characters)
            </span>
          </Label>
          <Textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            required
            maxLength={80}
            className={textareaClass}
          />
        </div>
        
        <div>
          <Label htmlFor="websiteUrl">Website URL</Label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <LinkIcon className="w-5 h-5 text-gray-400" />
            </div>
            <Input
              id="websiteUrl"
              name="websiteUrl"
              type="url"
              placeholder="https://yourproject.com"
              value={formData.websiteUrl}
              onChange={handleChange}
              required
              className={`${inputClass} pl-10`}
            />
          </div>
        </div>
        
        <div>
          <Label htmlFor="githubUrl">GitHub URL (optional)</Label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <Github className="w-5 h-5 text-gray-400" />
            </div>
            <Input
              id="githubUrl"
              name="githubUrl"
              type="url"
              placeholder="https://github.com/username/repo"
              value={formData.githubUrl}
              onChange={handleChange}
              className={`${inputClass} pl-10`}
            />
          </div>
        </div>
        
        <div className="mt-6">
          <Label className="block mb-2">Project Type (Select all that apply)</Label>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mt-2">
            {Object.values(ProjectType).map((type) => (
              <div 
                key={type}
                onClick={() => toggleProjectType(type)}
                className={`
                  px-3 py-2 rounded-xl cursor-pointer border transition-colors
                  ${selectedProjectTypes.includes(type) 
                    ? PROJECT_TYPE_COLORS[type] + ' border-transparent' 
                    : 'border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800'}
                `}
              >
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    checked={selectedProjectTypes.includes(type)}
                    onChange={() => {}}
                    className="mr-2 h-4 w-4 rounded border-gray-300 text-[#0052FF] focus:ring-[#0052FF]"
                  />
                  <span className="text-sm font-medium">{type}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        <div className="flex justify-between pt-4">
          <Button
            type="button"
            variant="destructive"
            onClick={() => setShowDeleteConfirmation(true)}
            disabled={isDeleting || isSubmitting}
            className="gap-2"
          >
            <Trash2 className="w-4 h-4" />
            {isDeleting ? 'Deleting...' : 'Delete Project'}
          </Button>
          
          <div className="flex gap-3">
            <Button
              type="button"
              onClick={handleDiscard}
              disabled={isSubmitting || isDeleting}
              className="rounded-xl"
            >
              Discard Changes
            </Button>
            
            <Button
              type="submit"
              variant="outline"
              disabled={isSubmitting || isDeleting}
              className="rounded-xl"
            >
              {isSubmitting ? 'Saving...' : 'Save Changes'}
            </Button>
          </div>
        </div>
      </form>
      
      <ConfirmationDialog
        open={showDeleteConfirmation}
        onOpenChange={setShowDeleteConfirmation}
        title="Delete Project"
        description="Are you sure you want to delete this project? This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
        onConfirm={handleDelete}
        variant="destructive"
      />
    </>
  )
} 