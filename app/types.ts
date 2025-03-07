export interface Link {
  name: string
  url: string
}

export interface Socials {
  telegram?: string
  discord?: string
  twitter?: string
  linkedin?: string
}

export enum Role {
  DEVELOPER = "Developer",
  DESIGNER = "Designer",
  PRODUCT_MANAGER = "Product Manager",
  MARKETER = "Marketer",
  INVESTOR = "VC/Angel",
  ARTIST = "Artist",
  BUSINESS_DEV = "Business Development",
  COMMUNITY_MANAGER = "Community Manager"
}

export enum ProjectType {
  AI = "AI",
  DEFI = "DeFi",
  DESCI = "DeSci",
  NFT = "NFT",
  DAO = "DAOs & Governance",
  DEX = "DEX",
  ANALYTICS = "Analytics",
  SECURITY = "Security",
  WALLETS = "Wallets",
  INFRA = "Infra",
  SDK_API = "SDKs & APIs",
  GAMING = "Gaming",
  IDENTITY = "Identity & Authentication",
  STABLECOINS = "Stablecoins",
  PREDICTION = "Prediction Markets",
  STORAGE = "Storage & Compute",
  MARKETPLACE = "Marketplaces",
  GRANTS = "Grants & Bounties",
  SOCIALFI = "SocialFi",
  ZK = "ZK",
  DATA = "Data"
}

export const ROLE_COLORS: Record<Role, string> = {
  [Role.DEVELOPER]: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300",
  [Role.DESIGNER]: "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300",
  [Role.PRODUCT_MANAGER]: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300",
  [Role.MARKETER]: "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300",
  [Role.INVESTOR]: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300",
  [Role.ARTIST]: "bg-pink-100 text-pink-800 dark:bg-pink-900/30 dark:text-pink-300",
  [Role.BUSINESS_DEV]: "bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-300",
  [Role.COMMUNITY_MANAGER]: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300"
}

export const PROJECT_TYPE_COLORS: Record<ProjectType, string> = {
  [ProjectType.AI]: "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300",
  [ProjectType.DEFI]: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300",
  [ProjectType.DESCI]: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300",
  [ProjectType.NFT]: "bg-pink-100 text-pink-800 dark:bg-pink-900/30 dark:text-pink-300",
  [ProjectType.DAO]: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300",
  [ProjectType.DEX]: "bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-300",
  [ProjectType.ANALYTICS]: "bg-cyan-100 text-cyan-800 dark:bg-cyan-900/30 dark:text-cyan-300",
  [ProjectType.SECURITY]: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300",
  [ProjectType.WALLETS]: "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300",
  [ProjectType.INFRA]: "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300",
  [ProjectType.SDK_API]: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300",
  [ProjectType.GAMING]: "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300",
  [ProjectType.IDENTITY]: "bg-violet-100 text-violet-800 dark:bg-violet-900/30 dark:text-violet-300",
  [ProjectType.STABLECOINS]: "bg-teal-100 text-teal-800 dark:bg-teal-900/30 dark:text-teal-300",
  [ProjectType.PREDICTION]: "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300",
  [ProjectType.STORAGE]: "bg-lime-100 text-lime-800 dark:bg-lime-900/30 dark:text-lime-300",
  [ProjectType.MARKETPLACE]: "bg-fuchsia-100 text-fuchsia-800 dark:bg-fuchsia-900/30 dark:text-fuchsia-300",
  [ProjectType.GRANTS]: "bg-rose-100 text-rose-800 dark:bg-rose-900/30 dark:text-rose-300",
  [ProjectType.SOCIALFI]: "bg-sky-100 text-sky-800 dark:bg-sky-900/30 dark:text-sky-300",
  [ProjectType.ZK]: "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300",
  [ProjectType.DATA]: "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300"
}

export const ROLE_ABBREVIATIONS: Record<Role, string> = {
  [Role.DEVELOPER]: "Dev",
  [Role.DESIGNER]: "Design",
  [Role.PRODUCT_MANAGER]: "PM",
  [Role.MARKETER]: "Mktg",
  [Role.INVESTOR]: "VC",
  [Role.ARTIST]: "Art",
  [Role.BUSINESS_DEV]: "BizDev",
  [Role.COMMUNITY_MANAGER]: "CM"
}

export interface Builder {
  _id: string
  name: string
  bio: string
  profileImage?: string
  links: Link[]
  socials?: Socials
  userId: string
  roles?: Role[]  // Users can select multiple roles
  skills?: string[] // Skills extracted from ENS profiles or set by users
  ensName?: string // ENS name if this is an ENS profile
  isENSProfile?: boolean // Flag to indicate if this is an ENS profile
  ethAddress?: string // Ethereum address if available
}

export interface Project {
  _id: string
  name: string
  description: string
  logo?: string
  websiteUrl?: string
  githubUrl?: string
  userId: string
  builderName: string
  builderImage?: string
  upvotes?: string[]  // Array of userIds who upvoted
  upvoteCount?: number // Total count of upvotes
  projectTypes?: ProjectType[] // Add project types
  createdAt: Date
  updatedAt: Date
} 
