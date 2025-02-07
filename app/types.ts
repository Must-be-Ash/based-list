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

export interface Builder {
  _id: string
  name: string
  bio: string
  profileImage?: string
  links: Link[]
  socials?: Socials
  userId: string
  roles?: Role[]  // Users can select multiple roles
} 
