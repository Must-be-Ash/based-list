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