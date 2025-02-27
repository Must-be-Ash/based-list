'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { Textarea } from './ui/textarea'
import { Label } from './ui/label'
import { useAuth } from '@clerk/nextjs'

export function ProjectSubmissionForm() {
  const router = useRouter()
  const { userId } = useAuth()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    logo: '',
    websiteUrl: '',
    githubUrl: '',
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!userId) {
      return
    }

    setIsSubmitting(true)
    try {
      const response = await fetch('/api/projects', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          userId,
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to submit project')
      }

      const data = await response.json()
      router.push(`/projects/${data._id}`)
      router.refresh()
    } catch (error) {
      console.error('Error submitting project:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <Label htmlFor="name">Project Name</Label>
        <Input
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
          placeholder="Enter your project name"
        />
      </div>

      <div>
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          required
          placeholder="Describe your project"
          className="h-24"
        />
      </div>

      <div>
        <Label htmlFor="logo">Logo URL</Label>
        <Input
          id="logo"
          name="logo"
          type="url"
          value={formData.logo}
          onChange={handleChange}
          placeholder="https://example.com/logo.png"
        />
      </div>

      <div>
        <Label htmlFor="websiteUrl">Website URL</Label>
        <Input
          id="websiteUrl"
          name="websiteUrl"
          type="url"
          value={formData.websiteUrl}
          onChange={handleChange}
          placeholder="https://yourproject.com"
        />
      </div>

      <div>
        <Label htmlFor="githubUrl">GitHub URL</Label>
        <Input
          id="githubUrl"
          name="githubUrl"
          type="url"
          value={formData.githubUrl}
          onChange={handleChange}
          placeholder="https://github.com/yourusername/project"
        />
      </div>

      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? 'Submitting...' : 'Submit Project'}
      </Button>
    </form>
  )
} 