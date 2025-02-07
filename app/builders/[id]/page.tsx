import { getBuilderById } from "@/lib/mongodb"
import Image from "next/image"
import { notFound } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/app/components/ui/card"
import { Button } from "@/app/components/ui/button"
import { ROLE_COLORS, Role } from "@/app/types"
import { FaDiscord, FaGithub, FaGlobe, FaLinkedin, FaTelegram, FaTwitter } from "react-icons/fa"

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

interface Builder {
  _id: string
  name: string
  bio: string
  profileImage?: string
  links: Link[]
  roles?: Role[]
  socials?: Socials
}

export default async function BuilderProfile({ params }: { params: { id: string } }) {
  const builder = await getBuilderById(params.id) as Builder | null

  if (!builder) {
    notFound()
  }

  // Ensure socials object exists with proper type checking
  const socials = builder.socials || {}
  const telegram = typeof socials.telegram === 'string' ? socials.telegram : ''
  const discord = typeof socials.discord === 'string' ? socials.discord : ''
  const twitter = typeof socials.twitter === 'string' ? socials.twitter : ''
  const linkedin = typeof socials.linkedin === 'string' ? socials.linkedin : ''

  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="bg-white/80 dark:bg-black/50 backdrop-blur-sm border-0">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-3xl font-bold">{builder.name}</CardTitle>
              {builder.roles && builder.roles.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {builder.roles.map((role) => (
                    <span
                      key={role}
                      className={`px-3 py-1 rounded-full text-sm font-medium ${ROLE_COLORS[role]}`}
                    >
                      {role}
                    </span>
                  ))}
                </div>
              )}
            </div>
            <div className="flex gap-3">
              {telegram && (
                <a
                  href={telegram.startsWith('http') ? telegram : `https://t.me/${telegram.replace('@', '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-lg hover:bg-[#0052FF]/10 transition-all text-gray-600 hover:text-[#0052FF] dark:text-gray-400"
                >
                  <FaTelegram className="w-5 h-5" />
                </a>
              )}
              {twitter && (
                <a
                  href={twitter.startsWith('http') ? twitter : `https://twitter.com/${twitter.replace('@', '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-lg hover:bg-[#0052FF]/10 transition-all text-gray-600 hover:text-[#0052FF] dark:text-gray-400"
                >
                  <FaTwitter className="w-5 h-5" />
                </a>
              )}
              {linkedin && (
                <a
                  href={linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-lg hover:bg-[#0052FF]/10 transition-all text-gray-600 hover:text-[#0052FF] dark:text-gray-400"
                >
                  <FaLinkedin className="w-5 h-5" />
                </a>
              )}
              {discord && (
                <a
                  href={discord.startsWith('http') ? discord : `discord://-/users/${discord}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-lg hover:bg-[#0052FF]/10 transition-all text-gray-600 hover:text-[#0052FF] dark:text-gray-400"
                >
                  <FaDiscord className="w-5 h-5" />
                </a>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-8">
            <div className="w-full md:w-1/3">
              <div className="relative w-full aspect-square rounded-full overflow-hidden bg-gray-100 dark:bg-gray-800 ring-2 ring-[#0052FF]/20">
                <Image
                  src={builder.profileImage || "/placeholder.png"}
                  alt={builder.name}
                  fill
                  className="object-cover"
                />
              </div>
            </div>
            <div className="w-full md:w-2/3">
              <h2 className="text-xl font-semibold mb-4">Bio</h2>
              <p className="mb-6 text-gray-600 dark:text-gray-400">{builder.bio}</p>
              <h2 className="text-xl font-semibold mb-4">Links</h2>
              <div className="flex flex-wrap gap-4">
                {builder.links.map((link: Link, index: number) => (
                  <Button key={index} className="bg-[#0052FF] text-white hover:bg-[#0052FF]/90 flex items-center gap-2" asChild>
                    <a href={link.url} target="_blank" rel="noopener noreferrer">
                      {index === 0 ? <FaGlobe className="w-4 h-4" /> : <FaGithub className="w-4 h-4" />}
                      {link.name}
                    </a>
                  </Button>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

