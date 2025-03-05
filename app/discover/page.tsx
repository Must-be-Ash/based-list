'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@clerk/nextjs'
import { Button } from '../components/ui/button'
import { Input } from '../components/ui/input'
import Link from 'next/link'
import { DiscoverProjectCard } from '../components/DiscoverProjectCard'
import { PlusCircle, Search, ChevronDown, ChevronUp } from 'lucide-react'
import { Project, ProjectType } from '../types'
import { LoadingSpinner } from '../components/ui/loading-spinner'

// Define abbreviations for project types to save space
const PROJECT_TYPE_ABBREVIATIONS: Record<ProjectType, string> = {
  [ProjectType.AI]: "AI",
  [ProjectType.DEFI]: "DeFi",
  [ProjectType.DESCI]: "DeSci",
  [ProjectType.NFT]: "NFT",
  [ProjectType.DAO]: "DAOs",
  [ProjectType.DEX]: "DEX",
  [ProjectType.ANALYTICS]: "Analytics",
  [ProjectType.SECURITY]: "Security",
  [ProjectType.WALLETS]: "Wallets",
  [ProjectType.INFRA]: "Infra",
  [ProjectType.SDK_API]: "SDKs",
  [ProjectType.GAMING]: "Gaming",
  [ProjectType.IDENTITY]: "Identity",
  [ProjectType.STABLECOINS]: "Stables",
  [ProjectType.PREDICTION]: "Prediction",
  [ProjectType.STORAGE]: "Storage",
  [ProjectType.MARKETPLACE]: "Marketplaces",
  [ProjectType.GRANTS]: "Grants",
  [ProjectType.SOCIALFI]: "SocialFi",
  [ProjectType.ZK]: "ZK",
  [ProjectType.DATA]: "Data"
}

export default function DiscoverPage() {
  const { userId } = useAuth()
  const [projects, setProjects] = useState<Project[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedProjectTypes, setSelectedProjectTypes] = useState<ProjectType[]>([])
  const [showAllFilters, setShowAllFilters] = useState(false)

  // Fetch projects when the component mounts
  useEffect(() => {
    setIsLoading(true)
    fetch('/api/projects')
      .then((res) => res.json())
      .then((data) => {
        setProjects(data)
        setIsLoading(false)
      })
      .catch((error) => {
        console.error('Error fetching projects:', error)
        setIsLoading(false)
      })
  }, [])

  // Filter projects based on search query and selected project types
  const filteredProjects = projects.filter(project => {
    const matchesSearch = searchQuery === "" || 
      project.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.description.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesProjectTypes = selectedProjectTypes.length === 0 ||
      project.projectTypes?.some(type => selectedProjectTypes.includes(type as ProjectType));

    return matchesSearch && matchesProjectTypes;
  });

  // Determine which project types to show
  const initialVisibleCount = 10;
  const projectTypeValues = Object.values(ProjectType);
  const visibleProjectTypes = showAllFilters 
    ? projectTypeValues 
    : projectTypeValues.slice(0, initialVisibleCount);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8 pt-20">
        <h1 className="text-3xl font-bold hidden sm:block">Discover Projects</h1>
        <div className="sm:hidden w-full"></div> {/* Spacer for mobile layout */}
        {userId && (
          <div className="fixed bottom-20 left-4 z-50 sm:static sm:z-auto">
            <Button 
              asChild 
              size="lg"
              className="bg-[#0052FF] hover:bg-[#0052FF]/90 text-white font-medium rounded-xl shadow-lg sm:shadow-md transition-all hover:shadow-xl flex items-center gap-2 animate-in slide-in-from-bottom-4 sm:animate-none duration-300"
            >
              <Link href="/discover/submit">
                <PlusCircle className="w-5 h-5" />
                <span className="hidden sm:inline">Submit Your Project</span>
                <span className="sm:hidden">Submit</span>
              </Link>
            </Button>
          </div>
        )}
      </div>

      {/* Search and Filter Section */}
      <div className="mb-12 space-y-6 pt-0 sm:pt-0">
        {/* Search Bar */}
        <div className="relative max-w-xl mx-auto">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
          <Input 
            placeholder="Search projects by name or description..."
            className="pl-10 h-12 rounded-xl bg-white/80 dark:bg-black/50 backdrop-blur-sm border-gray-200 dark:border-gray-800 focus:ring-2 focus:ring-[#0052FF] transition-all"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* Project Type Filters */}
        <div className="flex flex-wrap justify-center gap-2 max-h-[300px] overflow-y-auto px-2 py-1">
          {visibleProjectTypes.map((type) => {
            const isSelected = selectedProjectTypes.includes(type);
            return (
              <button
                key={type}
                onClick={() => {
                  if (isSelected) {
                    setSelectedProjectTypes(selectedProjectTypes.filter(t => t !== type));
                  } else {
                    setSelectedProjectTypes([...selectedProjectTypes, type]);
                  }
                }}
                className={`px-3 py-1.5 text-xs sm:text-sm sm:px-4 sm:py-2 rounded-full font-medium transition-all mb-1 ${
                  isSelected
                    ? "bg-[#0052FF] text-white"
                    : "bg-white/50 dark:bg-gray-800/50 hover:bg-[#0052FF]/10 dark:hover:bg-[#0052FF]/20"
                }`}
                title={type} // Show full name on hover
              >
                {PROJECT_TYPE_ABBREVIATIONS[type]}
              </button>
            );
          })}
          
          {projectTypeValues.length > initialVisibleCount && (
            <button
              onClick={() => setShowAllFilters(!showAllFilters)}
              className="px-3 py-1.5 text-xs sm:text-sm sm:px-4 sm:py-2 rounded-full font-medium bg-white/50 dark:bg-gray-800/50 hover:bg-[#0052FF]/10 dark:hover:bg-[#0052FF]/20 flex items-center gap-1 mb-1"
            >
              {showAllFilters ? (
                <>Less <ChevronUp className="h-3 w-3 sm:h-4 sm:w-4" /></>
              ) : (
                <>More <ChevronDown className="h-3 w-3 sm:h-4 sm:w-4" /></>
              )}
            </button>
          )}
          
          {/* Clear All Filters Button */}
          {(selectedProjectTypes.length > 0 || searchQuery) && (
            <button
              onClick={() => {
                setSelectedProjectTypes([]);
                setSearchQuery("");
              }}
              className="px-3 py-1.5 text-xs sm:text-sm sm:px-4 sm:py-2 rounded-full font-medium bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300 hover:bg-red-200 dark:hover:bg-red-800/40 flex items-center gap-1 mb-1"
            >
              Clear All Filters
            </button>
          )}
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center py-20">
          <LoadingSpinner size="lg" />
        </div>
      ) : filteredProjects.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            {projects.length === 0 
              ? "No projects have been submitted yet. Be the first to share your project!"
              : "No projects match your search criteria."
            }
          </p>
          {userId && projects.length === 0 && (
            <Button 
              asChild 
              size="lg"
              className="bg-[#0052FF] hover:bg-[#0052FF]/90 text-white font-medium rounded-xl shadow-md transition-all hover:shadow-lg flex items-center gap-2 relative z-[60]"
            >
              <Link href="/discover/submit">
                <PlusCircle className="w-5 h-5" />
                Submit a Project
              </Link>
            </Button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pb-24 sm:pb-20">
          {filteredProjects.map((project) => (
            <DiscoverProjectCard key={project._id} project={project} />
          ))}
        </div>
      )}
    </div>
  )
} 