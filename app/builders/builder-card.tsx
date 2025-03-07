"use client"

import Link from "next/link"
import { Card, CardContent, CardHeader } from "@/app/components/ui/card"
import Image from "next/image"
import { UserCircle } from "lucide-react"
import { FaDiscord, FaGithub, FaGlobe, FaLinkedin, FaTelegram, FaTwitter } from "react-icons/fa"
import { Builder, ROLE_COLORS, ROLE_ABBREVIATIONS } from "@/app/types"
import { formatIpfsUrl } from "@/app/lookup/utils/ens"

export function BuilderCard({ builder }: { builder: Builder }) {
  // Ensure links array exists and has the required structure
  const links = builder.links || [
    { name: "Site", url: "" },
    { name: "GitHub", url: "" }
  ]

  // Ensure socials object exists with proper type checking
  const socials = builder.socials || {}
  const telegram = typeof socials.telegram === 'string' ? socials.telegram : ''
  const discord = typeof socials.discord === 'string' ? socials.discord : ''
  const twitter = typeof socials.twitter === 'string' ? socials.twitter : ''
  const linkedin = typeof socials.linkedin === 'string' ? socials.linkedin : ''

  // Format the profile image URL if it's an IPFS URL
  const profileImageUrl = builder.profileImage ? formatIpfsUrl(builder.profileImage) : null;

  // Function to ensure URLs have proper protocol
  const formatUrl = (url: string, type: 'website' | 'github'): string => {
    if (!url) return '';
    
    // If URL already has a protocol, return it as is
    if (url.startsWith('http://') || url.startsWith('https://')) {
      return url;
    }
    
    // Add appropriate protocol based on link type
    if (type === 'website') {
      return `https://${url}`;
    } else if (type === 'github') {
      return `https://github.com/${url}`;
    }
    
    return url;
  };

  return (
    <Link href={builder.userId ? `/profile/${builder.userId}` : (builder.ensName ? `/lookup?name=${builder.ensName.split('.')[0]}` : '#')}>
      <Card className="bg-white/80 dark:bg-black/50 backdrop-blur-sm hover:shadow-xl transition-all duration-300 border-0 h-[260px] flex flex-col">
        <CardHeader className="flex flex-row items-start gap-4 flex-shrink-0 pb-0">
          <div className="relative w-16 h-16 rounded-full overflow-hidden bg-gray-100 dark:bg-gray-800 flex items-center justify-center ring-2 ring-[#0052FF]/20">
            {profileImageUrl ? (
              <Image
                src={profileImageUrl}
                alt={builder.name || "Profile"}
                fill
                className="object-cover"
                sizes="64px"
              />
            ) : (
              <UserCircle className="w-8 h-8 text-gray-400" />
            )}
          </div>
          <div className="flex-1 min-w-0">
            <h2 className="text-xl font-semibold truncate">{builder.name || "Anonymous Builder"}</h2>
            {builder.roles && builder.roles.length > 0 && (
              <div className="flex flex-wrap gap-1.5 my-1">
                {builder.roles.slice(0, 3).map((role) => (
                  <span
                    key={role}
                    className={`px-2 py-0.5 rounded-full text-xs font-medium ${ROLE_COLORS[role]}`}
                    title={role}
                  >
                    {ROLE_ABBREVIATIONS[role]}
                  </span>
                ))}
                {builder.roles.length > 3 && (
                  <span
                    className="px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200"
                    title={builder.roles.slice(3).join(", ")}
                  >
                    +{builder.roles.length - 3}
                  </span>
                )}
              </div>
            )}
            <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2 mt-1">
              {builder.bio || "No bio yet"}
            </p>
            
            {/* Display skills if available */}
            {builder.skills && builder.skills.length > 0 && (
              <div className="flex flex-wrap gap-1 mt-2">
                {builder.skills.slice(0, 3).map((skill) => (
                  <span
                    key={skill}
                    className="px-2 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300"
                  >
                    {skill}
                  </span>
                ))}
                {builder.skills.length > 3 && (
                  <span
                    className="px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200"
                    title={builder.skills.slice(3).join(", ")}
                  >
                    +{builder.skills.length - 3}
                  </span>
                )}
              </div>
            )}
          </div>
        </CardHeader>
        <CardContent className="flex-1 flex flex-col justify-end pt-2 space-y-3">
          {/* Default Links */}
          <div className="grid grid-cols-2 gap-2 mb-2">
            {links.slice(0, 2).map((link, index) => (
              link?.url ? (
                <a
                  key={index}
                  href={formatUrl(link.url, index === 0 ? 'website' : 'github')}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 py-2 px-3 rounded-xl bg-white/50 dark:bg-gray-800/50 hover:bg-[#0052FF]/10 dark:hover:bg-[#0052FF]/20 transition-all group border border-gray-200 dark:border-gray-700"
                  onClick={(e) => {
                    e.preventDefault()
                    e.stopPropagation()
                    window.open(formatUrl(link.url, index === 0 ? 'website' : 'github'), '_blank')
                  }}
                >
                  {index === 0 ? <FaGlobe className="w-4 h-4 text-[#0052FF]" /> : <FaGithub className="w-4 h-4 text-[#0052FF]" />}
                  <span className="text-sm font-medium text-gray-800 dark:text-gray-200 group-hover:text-[#0052FF] truncate">
                    {link.name || (index === 0 ? "Site" : "GitHub")}
                  </span>
                </a>
              ) : null
            ))}
          </div>

          {/* Social Links */}
          {Object.values(socials).some(value => value) && (
            <div className="flex justify-center gap-4 mb-2">
              {telegram && (
                <a
                  href={telegram.startsWith('http') ? telegram : `https://t.me/${telegram.replace('@', '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-xl bg-white/50 dark:bg-gray-800/50 hover:bg-[#0052FF]/10 dark:hover:bg-[#0052FF]/20 transition-all text-gray-600 hover:text-[#0052FF] dark:text-gray-400"
                  onClick={(e) => {
                    e.preventDefault()
                    e.stopPropagation()
                    window.open(telegram.startsWith('http') ? telegram : `https://t.me/${telegram.replace('@', '')}`, '_blank')
                  }}
                >
                  <FaTelegram className="w-5 h-5" />
                </a>
              )}
              {discord && (
                <a
                  href={discord.startsWith('http') ? discord : `discord://-/users/${discord}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-xl bg-white/50 dark:bg-gray-800/50 hover:bg-[#0052FF]/10 dark:hover:bg-[#0052FF]/20 transition-all text-gray-600 hover:text-[#0052FF] dark:text-gray-400"
                  onClick={(e) => {
                    e.preventDefault()
                    e.stopPropagation()
                    window.open(discord.startsWith('http') ? discord : `discord://-/users/${discord}`, '_blank')
                  }}
                >
                  <FaDiscord className="w-5 h-5" />
                </a>
              )}
              {twitter && (
                <a
                  href={twitter.startsWith('http') ? twitter : `https://twitter.com/${twitter.replace('@', '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-xl bg-white/50 dark:bg-gray-800/50 hover:bg-[#0052FF]/10 dark:hover:bg-[#0052FF]/20 transition-all text-gray-600 hover:text-[#0052FF] dark:text-gray-400"
                  onClick={(e) => {
                    e.preventDefault()
                    e.stopPropagation()
                    window.open(twitter.startsWith('http') ? twitter : `https://twitter.com/${twitter.replace('@', '')}`, '_blank')
                  }}
                >
                  <FaTwitter className="w-5 h-5" />
                </a>
              )}
              {linkedin && (
                <a
                  href={linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-xl bg-white/50 dark:bg-gray-800/50 hover:bg-[#0052FF]/10 dark:hover:bg-[#0052FF]/20 transition-all text-gray-600 hover:text-[#0052FF] dark:text-gray-400"
                  onClick={(e) => {
                    e.preventDefault()
                    e.stopPropagation()
                    window.open(linkedin, '_blank')
                  }}
                >
                  <FaLinkedin className="w-5 h-5" />
                </a>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </Link>
  )
} 