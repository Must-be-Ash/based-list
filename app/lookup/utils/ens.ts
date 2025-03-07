import { createPublicClient, http } from 'viem';
import { mainnet } from 'viem/chains';
import { normalize } from 'viem/ens';

// Create a public client for Ethereum mainnet (where ENS is deployed)
export const publicClient = createPublicClient({
  chain: mainnet,
  transport: http('https://eth.llamarpc.com'),
});

// Since we're having issues with the ENS client types, we'll use simpler functions
// that don't rely on the ENS client directly

/**
 * Format a name to ensure it's a valid base.eth subdomain
 */
export function formatBaseEthName(name: string): string {
  name = name.toLowerCase().trim();
  
  if (!name.endsWith('.base.eth')) {
    name = `${name}.base.eth`;
  }
  
  return normalize(name);
}

/**
 * Check if a name is a valid base.eth subdomain
 */
export function isValidBaseEthSubdomain(name: string): boolean {
  name = name.toLowerCase().trim();
  
  // Must end with .base.eth
  if (!name.endsWith('.base.eth')) {
    return false;
  }
  
  // Must have at least one character before .base.eth
  const subdomain = name.replace('.base.eth', '');
  if (!subdomain || subdomain.length === 0) {
    return false;
  }
  
  return true;
}

/**
 * Mock function to get the ENS avatar URL for a name
 * In a real implementation, this would use the ENS client
 */
export async function getEnsAvatarUrl(name: string): Promise<string | null> {
  try {
    // This is a mock implementation
    // In a real app, you would use the ENS client to fetch the avatar
    console.log(`Getting avatar for ${name}`);
    return null;
  } catch (error) {
    console.error('Error fetching ENS avatar:', error);
    return null;
  }
}

/**
 * Mock function to get all text records for a name
 * In a real implementation, this would use the ENS client
 */
export async function getAllTextRecords(name: string, keys: string[]): Promise<Record<string, string>> {
  // This is a mock implementation
  // In a real app, you would use the ENS client to fetch text records
  console.log(`Getting text records for ${name}: ${keys.join(', ')}`);
  return {};
}

/**
 * Mock function to get the Ethereum address for a name
 * In a real implementation, this would use the ENS client
 */
export async function getAddress(name: string): Promise<string | null> {
  try {
    // This is a mock implementation
    // In a real app, you would use the ENS client to fetch the address
    console.log(`Getting address for ${name}`);
    return null;
  } catch (error) {
    console.error('Error fetching ENS address:', error);
    return null;
  }
}

/**
 * Cleans ENS record values by removing newlines and extra whitespace
 * @param value The record value to clean
 * @returns The cleaned record value
 */
export function cleanEnsRecordValue(value: string): string {
  if (!value) return '';
  
  // Replace all whitespace (including newlines, tabs, etc.) with a single space
  // Then trim any leading/trailing spaces
  return value.replace(/\s+/g, ' ').trim();
}

/**
 * Formats an IPFS URL to use the IPFS gateway
 * @param url The IPFS URL to format (e.g., ipfs://bafkreifde5bqt2gcourzk4u7uexvegzqbmcfhmj7psle6hyllhlvwwlzhe)
 * @returns The formatted URL (e.g., https://ipfs.io/ipfs/bafkreifde5bqt2gcourzk4u7uexvegzqbmcfhmj7psle6hyllhlvwwlzhe)
 */
export function formatIpfsUrl(url: string): string {
  if (!url) return '';
  
  try {
    // Clean the URL first
    url = cleanEnsRecordValue(url);
    
    // Handle IPFS URLs
    if (url.startsWith('ipfs://')) {
      return url.replace('ipfs://', 'https://ipfs.io/ipfs/');
    }
    
    // Handle Arweave URLs
    if (url.startsWith('ar://')) {
      return url.replace('ar://', 'https://arweave.net/');
    }
    
    // Handle EIP155 URLs (NFTs)
    if (url.startsWith('eip155:')) {
      console.log('EIP155 avatar format detected, this may not display correctly');
      // For EIP155, we would need to resolve the NFT image URL
      // This is a complex process that would require additional API calls
      // For now, we'll just return a placeholder or the original URL
      return url;
    }
    
    // Check if the URL is already a valid HTTP URL
    if (url.startsWith('http://') || url.startsWith('https://')) {
      return url;
    }
    
    // If it's just a CID without the ipfs:// prefix, add the IPFS gateway
    if (url.match(/^[a-zA-Z0-9]{46,59}$/)) {
      return `https://ipfs.io/ipfs/${url}`;
    }
    
    // Return the original URL if it doesn't match any known format
    return url;
  } catch (error) {
    console.error('Error formatting IPFS URL:', error);
    return url;
  }
} 