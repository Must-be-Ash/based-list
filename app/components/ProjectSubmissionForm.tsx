'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { Textarea } from './ui/textarea'
import { Label } from './ui/label'
import { useAuth } from '@clerk/nextjs'
import { Upload, Link as LinkIcon, Github } from 'lucide-react'
import { toast } from 'sonner'
import type { Project } from '../types'
import { ProjectType, PROJECT_TYPE_COLORS } from '../types'

interface ProjectSubmissionFormProps {
  onSubmitSuccess?: (project: Project) => void
}

export function ProjectSubmissionForm({ onSubmitSuccess }: ProjectSubmissionFormProps) {
  const router = useRouter()
  const { userId } = useAuth()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [logoFile, setLogoFile] = useState<File | null>(null)
  const [logoPreview, setLogoPreview] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    websiteUrl: '',
    githubUrl: '',
  })
  const [selectedProjectTypes, setSelectedProjectTypes] = useState<ProjectType[]>([])

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      setLogoFile(file)
      
      // Create preview
      const reader = new FileReader()
      reader.onload = (event) => {
        setLogoPreview(event.target?.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!userId) {
      toast.error('You must be signed in to submit a project')
      return
    }

    setIsSubmitting(true)
    try {
      let logoUrl = ''
      
      // Upload logo to Vercel Blob if a file was selected
      if (logoFile) {
        const formData = new FormData()
        formData.append('file', logoFile)
        
        console.log('Uploading logo file:', logoFile.name, logoFile.type, logoFile.size)
        
        const uploadResponse = await fetch('/api/upload', {
          method: 'POST',
          body: formData,
        })
        
        if (!uploadResponse.ok) {
          const errorData = await uploadResponse.json()
          console.error('Upload error:', errorData)
          throw new Error(`Failed to upload logo: ${errorData.error || uploadResponse.statusText}`)
        }
        
        const data = await uploadResponse.json()
        logoUrl = data.url
        console.log('Logo uploaded successfully:', logoUrl)
      }

      // Submit project data
      const projectData = {
        ...formData,
        logo: logoUrl,
        projectTypes: selectedProjectTypes,
        userId,
      }

      const response = await fetch('/api/projects', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(projectData),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(`Failed to submit project: ${errorData.error || response.statusText}`)
      }

      const data = await response.json()
      toast.success('Project submitted successfully!')
      
      if (onSubmitSuccess) {
        onSubmitSuccess(data)
      } else {
        router.push(`/projects/${data._id}`)
        router.refresh()
      }
    } catch (error) {
      console.error('Error submitting project:', error)
      toast.error(error instanceof Error ? error.message : 'Failed to submit project')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target
    
    // Limit description to 80 characters
    if (name === 'description' && value.length > 80) {
      return
    }
    
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  // Add a function to handle project type selection
  const toggleProjectType = (type: ProjectType) => {
    setSelectedProjectTypes(prev => {
      if (prev.includes(type)) {
        return prev.filter(t => t !== type);
      } else {
        return [...prev, type];
      }
    });
  };

  // Common input class with rounded corners
  const inputClass = "mt-1 h-12 bg-white/80 dark:bg-zinc-800/80 border-gray-200 dark:border-gray-700 rounded-xl"
  const textareaClass = "mt-1 h-32 bg-white/80 dark:bg-zinc-800/80 border-gray-200 dark:border-gray-700 resize-none rounded-xl"

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <div>
          <Label htmlFor="name" className="text-base font-medium">Project Name</Label>
          <Input
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            placeholder="Enter your project name"
            className={inputClass}
          />
        </div>

        <div>
          <div className="flex justify-between items-center">
            <Label htmlFor="description" className="text-base font-medium">Description</Label>
            <span className="text-xs text-gray-500 dark:text-gray-400">
              {formData.description.length}/80 characters
            </span>
          </div>
          <Textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            required
            placeholder="Describe your project (max 80 characters)"
            className={textareaClass}
            maxLength={80}
          />
        </div>

        <div>
          <Label htmlFor="logo" className="text-base font-medium">Project Logo</Label>
          <div className="mt-1 flex items-center gap-4">
            <div className="relative w-24 h-24 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl flex items-center justify-center overflow-hidden bg-gray-50 dark:bg-zinc-800">
              {logoPreview ? (
                <div className="relative w-full h-full">
                  <Image 
                    src={logoPreview} 
                    alt="Logo preview" 
                    fill
                    className="object-cover"
                  />
                </div>
              ) : (
                <Upload className="w-8 h-8 text-gray-400" />
              )}
              <input
                id="logo"
                type="file"
                accept="image/*"
                onChange={handleLogoChange}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
            </div>
            <div className="text-sm text-gray-500 dark:text-gray-400">
              {logoPreview ? 'Click to change' : 'Click to upload'}
            </div>
          </div>
        </div>

        <div>
          <Label htmlFor="websiteUrl" className="text-base font-medium flex items-center gap-2">
            <LinkIcon className="w-4 h-4" /> Website URL
          </Label>
          <Input
            id="websiteUrl"
            name="websiteUrl"
            type="url"
            value={formData.websiteUrl}
            onChange={handleChange}
            placeholder="https://yourproject.com"
            required
            className={inputClass}
          />
        </div>

        <div>
          <Label htmlFor="githubUrl" className="text-base font-medium flex items-center gap-2">
            <Github className="w-4 h-4" /> GitHub URL (optional)
          </Label>
          <Input
            id="githubUrl"
            name="githubUrl"
            type="url"
            value={formData.githubUrl}
            onChange={handleChange}
            placeholder="https://github.com/yourusername/project"
            className={inputClass}
          />
        </div>

        <div className="mt-6">
          <Label className="text-base font-medium mb-2 block">
            Project Type (Select all that apply)
          </Label>
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
      </div>

      <Button 
        type="submit" 
        disabled={isSubmitting}
        className="w-full h-12 mt-6 bg-[#0052FF] hover:bg-[#0052FF]/90 text-white rounded-xl"
      >
        {isSubmitting ? 'Submitting...' : 'Submit Project'}
      </Button>
    </form>
  )
} 