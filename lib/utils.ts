import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function normalizeUrl(url: string): string {
  if (!url) return url;
  
  // Remove leading/trailing whitespace
  url = url.trim();
  
  // If URL doesn't start with a protocol, add https://
  if (!url.match(/^[a-zA-Z]+:\/\//)) {
    // If it starts with www., add https:// only
    if (url.startsWith('www.')) {
      url = 'https://' + url;
    } else {
      // If no www., add https:// and check if we need www.
      url = 'https://' + url;
    }
  }
  
  return url;
}
