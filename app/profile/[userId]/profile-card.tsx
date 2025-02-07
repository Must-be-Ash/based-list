"use client"

import Image from "next/image"
import { Card, CardContent } from "@/app/components/ui/card"
import { UserCircle, Share as ShareIcon } from "lucide-react"
import { Button } from "@/app/components/ui/button"
import { toast } from "sonner"
import { FaDiscord, FaLinkedin, FaTelegram, FaTwitter } from "react-icons/fa"
import { Role, ROLE_COLORS } from "@/app/types"

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

interface ProfileCardProps {
  profile: Profile
}

export function ProfileCard({ profile }: ProfileCardProps) {
  const handleShare = async () => {
    const shareData = {
      title: `${profile.name}'s Profile`,
      text: profile.bio,
      url: window.location.href,
    }

    try {
      if (navigator.share) {
        await navigator.share(shareData)
      } else {
        await navigator.clipboard.writeText(window.location.href)
        toast.success('Profile link copied to clipboard!')
      }
    } catch (error) {
      console.error('Error sharing:', error)
      await navigator.clipboard.writeText(window.location.href)
      toast.success('Profile link copied to clipboard!')
    }
  }

  const socialIcons = {
    telegram: <FaTelegram className="w-5 h-5" />,
    discord: <FaDiscord className="w-5 h-5" />,
    twitter: <FaTwitter className="w-5 h-5" />,
    linkedin: <FaLinkedin className="w-5 h-5" />,
  }

  const hasSocials = profile.socials && Object.values(profile.socials).some(value => value)

  return (
    <Card className="bg-white/80 dark:bg-black/50 backdrop-blur-sm border-0 shadow-xl max-w-2xl mx-auto relative">
      <Button
        onClick={handleShare}
        size="icon"
        className="absolute top-4 right-4 rounded-full bg-white/50 dark:bg-gray-800/50 hover:bg-[#0052FF]/10 dark:hover:bg-[#0052FF]/20 transition-all"
      >
        <ShareIcon className="w-4 h-4" />
      </Button>

      <CardContent className="p-6 space-y-6">
        <div className="flex flex-row gap-6 items-start">
          <div className="relative w-24 h-24 rounded-full overflow-hidden bg-gray-100 dark:bg-gray-800 flex items-center justify-center ring-2 ring-[#0052FF]/20 flex-shrink-0">
            {profile.profileImage ? (
              <Image
                src={profile.profileImage}
                alt={profile.name}
                fill
                className="object-cover"
                sizes="96px"
                priority
              />
            ) : (
              <UserCircle className="w-14 h-14 text-gray-400" />
            )}
          </div>
          <div className="flex-1 pt-2">
            <h1 className="text-2xl font-bold mb-2">{profile.name}</h1>
            {profile.roles && profile.roles.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-3">
                {profile.roles.map((role) => (
                  <span
                    key={role}
                    className={`px-3 py-1 rounded-full text-sm font-medium ${ROLE_COLORS[role]}`}
                  >
                    {role}
                  </span>
                ))}
              </div>
            )}
            <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
              {profile.bio}
            </p>
          </div>
        </div>

        {hasSocials && (
          <div className="flex flex-wrap gap-2">
            {Object.entries(profile.socials!).map(([platform, url]) => (
              url ? (
                <a
                  key={platform}
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-full bg-white/50 dark:bg-gray-800/50 hover:bg-[#0052FF]/10 dark:hover:bg-[#0052FF]/20 transition-all duration-300 text-gray-600 hover:text-[#0052FF] dark:text-gray-400"
                >
                  {socialIcons[platform as keyof typeof socialIcons]}
                </a>
              ) : null
            ))}
          </div>
        )}

        {profile.links?.length > 0 && profile.links.some(link => link.name && link.url) && (
          <div className="grid grid-cols-1 gap-2">
            {profile.links.map((link: Link, index: number) => (
              link.name && link.url ? (
                <a
                  key={index}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex flex-col p-3 rounded-lg bg-white/50 dark:bg-gray-800/50 hover:bg-[#0052FF]/10 dark:hover:bg-[#0052FF]/20 transition-all duration-300 group"
                >
                  <span className="font-medium text-gray-800 dark:text-gray-200 group-hover:text-[#0052FF]">
                    {link.name}
                  </span>
                  <span className="text-sm text-gray-500 dark:text-gray-400 truncate">
                    {link.url}
                  </span>
                </a>
              ) : null
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
} 
