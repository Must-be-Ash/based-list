"use client"

import { useState, useEffect } from "react"
import { BuilderCard } from "./builder-card"
import { Input } from "@/app/components/ui/input"
import { Role } from "@/app/types"
import { Search } from "lucide-react"
import { Builder } from "@/app/types"
import { LoadingSpinner } from "@/app/components/ui/loading-spinner"

export default function BuildersPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedRoles, setSelectedRoles] = useState<Role[]>([])
  const [builders, setBuilders] = useState<Builder[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function fetchBuilders() {
      setIsLoading(true)
      try {
        // Add cache-busting query parameter
        const response = await fetch(`/api/builders?t=${Date.now()}`)
        if (!response.ok) throw new Error('Failed to fetch builders')
        const data = await response.json()
        setBuilders(data)
      } catch (error) {
        console.error('Error fetching builders:', error)
      } finally {
        setIsLoading(false)
      }
    }
    fetchBuilders()
  }, [])

  // Filter builders based on search query and selected roles
  const filteredBuilders = builders.filter(builder => {
    const matchesSearch = searchQuery === "" || 
      builder.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      builder.bio.toLowerCase().includes(searchQuery.toLowerCase()) ||
      builder.roles?.some(role => role.toLowerCase().includes(searchQuery.toLowerCase()))

    const matchesRoles = selectedRoles.length === 0 ||
      builder.roles?.some(role => selectedRoles.includes(role))

    return matchesSearch && matchesRoles
  })

  return (
    <div className="min-h-screen pt-32 pb-32 bg-gradient-to-b from-white to-gray-50 dark:from-gray-900 dark:to-black">
      <div className="container mx-auto px-4 mb-20">
        {/* Search and Filter Section */}
        <div className="mb-12 space-y-6">
          {/* Search Bar */}
          <div className="relative max-w-xl mx-auto">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <Input 
              placeholder="Search builders by name or role..."
              className="pl-10 h-12 rounded-full bg-white/80 dark:bg-black/50 backdrop-blur-sm border-gray-200 dark:border-gray-800 focus:ring-2 focus:ring-[#0052FF] transition-all"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          {/* Role Filters */}
          <div className="flex flex-wrap justify-center gap-2">
            {Object.values(Role).map((role) => {
              const isSelected = selectedRoles.includes(role)
              return (
                <button
                  key={role}
                  onClick={() => {
                    if (isSelected) {
                      setSelectedRoles(selectedRoles.filter(r => r !== role))
                    } else {
                      setSelectedRoles([...selectedRoles, role])
                    }
                  }}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                    isSelected
                      ? "bg-[#0052FF] text-white"
                      : "bg-white/50 dark:bg-gray-800/50 hover:bg-[#0052FF]/10 dark:hover:bg-[#0052FF]/20"
                  }`}
                >
                  {role}
                </button>
              )
            })}
          </div>
        </div>

        {/* Builders Grid */}
        {isLoading ? (
          <div className="flex justify-center items-center py-20">
            <LoadingSpinner size="lg" />
          </div>
        ) : filteredBuilders.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600 dark:text-gray-400">
              {builders.length === 0 
                ? "No profiles found yet. Add your profile to be the first!"
                : "No builders match your search criteria."
              }
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredBuilders.map((builder) => (
              <BuilderCard key={builder._id} builder={builder} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

