import { NextRequest, NextResponse } from 'next/server';
import { createPublicClient, http, isAddress, keccak256, stringToHex, concat, Address } from 'viem';
import { base } from 'viem/chains';
import { normalize } from 'viem/ens';
import { cleanEnsRecordValue } from '@/app/lookup/utils/ens';
import { saveENSProfile } from '@/app/lookup/utils/db';

// Base ENS contract addresses
const BASE_REGISTRY_ADDRESS = '0xb94704422c2a1e396835a571837aa5ae53285a95';

// Create a public client for Base
const baseClient = createPublicClient({
  chain: base,
  transport: http(process.env.BASE_RPC_URL || 'https://mainnet.base.org'),
});

// ABI fragments for the ENS contracts
const registryABI = [
  {
    inputs: [{ internalType: 'bytes32', name: 'node', type: 'bytes32' }],
    name: 'resolver',
    outputs: [{ internalType: 'address', name: '', type: 'address' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'bytes32', name: 'node', type: 'bytes32' }],
    name: 'owner',
    outputs: [{ internalType: 'address', name: '', type: 'address' }],
    stateMutability: 'view',
    type: 'function',
  },
];

const resolverABI = [
  {
    inputs: [{ internalType: 'bytes32', name: 'node', type: 'bytes32' }],
    name: 'addr',
    outputs: [{ internalType: 'address', name: '', type: 'address' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'bytes32', name: 'node', type: 'bytes32' },
      { internalType: 'string', name: 'key', type: 'string' },
    ],
    name: 'text',
    outputs: [{ internalType: 'string', name: '', type: 'string' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'bytes32', name: 'node', type: 'bytes32' }],
    name: 'contenthash',
    outputs: [{ internalType: 'bytes', name: '', type: 'bytes' }],
    stateMutability: 'view',
    type: 'function',
  },
];

// Function to convert a name to a namehash
function namehash(name: string): `0x${string}` {
  let result = '0x0000000000000000000000000000000000000000000000000000000000000000' as `0x${string}`;
  if (!name) return result;

  const labels = name.split('.');
  for (let i = labels.length - 1; i >= 0; i--) {
    const labelHash = keccak256(stringToHex(labels[i]));
    result = keccak256(concat([result, labelHash]));
  }
  return result;
}

// Function to get the reverse node for an address
function getReverseNode(address: string): `0x${string}` {
  const normalizedAddress = address.toLowerCase().substring(2);
  const name = `${normalizedAddress}.addr.reverse`;
  return namehash(name);
}

// Interface for text records
interface TextRecord {
  key: string;
  value: string;
  type: string;
}

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const name = searchParams.get('name') || '';
    const address = searchParams.get('address');
    const type = searchParams.get('type');

    console.log('ENS lookup request:', { name, address, type });

    // Validate parameters
    if (type === 'name' && name) {
      // Format the name to ensure it's a valid base.eth subdomain
      let formattedName = name.toLowerCase().trim();
      
      if (!formattedName.endsWith('.base.eth')) {
        formattedName = `${formattedName}.base.eth`;
      }
      
      try {
        // Normalize the name according to ENS standards
        const normalizedName = normalize(formattedName);
        console.log(`Normalized name: ${normalizedName}`);
        
        // Get the namehash
        const node = namehash(normalizedName);
        console.log(`Namehash for ${normalizedName}:`, node);
        
        // Query the registry for the resolver address
        const resolverAddress = await baseClient.readContract({
          address: BASE_REGISTRY_ADDRESS as Address,
          abi: registryABI,
          functionName: 'resolver',
          args: [node],
        }) as Address;
        
        console.log(`Resolver address for ${normalizedName}:`, resolverAddress);
        
        if (!resolverAddress || resolverAddress === '0x0000000000000000000000000000000000000000') {
          console.log(`No resolver found for: ${normalizedName}`);
          return NextResponse.json(
            { 
              message: `Domain not found: ${normalizedName}`,
              error: 'DOMAIN_NOT_FOUND',
              details: 'The requested ENS domain was not found on Base.'
            },
            { status: 404 }
          );
        }
        
        // Query the resolver for the address
        const ownerAddress = await baseClient.readContract({
          address: resolverAddress,
          abi: resolverABI,
          functionName: 'addr',
          args: [node],
        }) as Address;
        
        console.log(`Owner address for ${normalizedName}:`, ownerAddress);
        
        // Get common text records
        const textKeys = [
          'name', 
          'description', 
          'url', 
          'email', 
          'avatar', 
          'com.twitter', 
          'com.github', 
          'com.discord',
          'com.reddit',
          'org.telegram',
          'eth.ens.delegate',
          'com.linkedin',
          'website',
          'location',
          'keywords' // Changed from 'skills' to 'keywords'
        ];
        
        const textRecords = await Promise.all(
          textKeys.map(async (key) => {
            try {
              const value = await baseClient.readContract({
                address: resolverAddress,
                abi: resolverABI,
                functionName: 'text',
                args: [node, key],
              }) as string;
              
              if (value) {
                return { key, value, type: 'text' } as TextRecord;
              }
              return null;
            } catch (error) {
              console.error(`Error fetching text record ${key}:`, error);
              return null;
            }
          })
        );
        
        // Try to get content hash
        let contentHash = null;
        try {
          const contentHashBytes = await baseClient.readContract({
            address: resolverAddress,
            abi: resolverABI,
            functionName: 'contenthash',
            args: [node],
          }) as `0x${string}`;
          
          if (contentHashBytes && contentHashBytes !== '0x') {
            contentHash = contentHashBytes;
          }
        } catch (error) {
          console.error('Error fetching content hash:', error);
        }
        
        // Filter out null records
        const validRecords = textRecords.filter((record): record is TextRecord => record !== null);
        
        // Clean record values (remove newlines, trim whitespace)
        const cleanedRecords = validRecords.map(record => {
          if (record.value && typeof record.value === 'string') {
            // Use the utility function to clean the record value
            const cleanedValue = cleanEnsRecordValue(record.value);
            console.log(`Cleaned record ${record.key}: "${record.value}" -> "${cleanedValue}"`);
            return {
              ...record,
              value: cleanedValue
            };
          }
          return record;
        });
        
        // Process keywords specifically if they exist
        const keywordsRecord = validRecords.find(record => record.key === 'keywords');
        console.log('Keywords record:', keywordsRecord); // Log the found keywords record
        const skills = keywordsRecord ? keywordsRecord.value.split(',').map((s: string) => s.trim()) : [];

        // Format the response
        const response = {
          name: normalizedName,
          address: ownerAddress,
          records: cleanedRecords,
          contentHash: contentHash,
          skills: skills // Keep as 'skills' in the response for compatibility
        };
        
        // Save the profile to MongoDB and get the updated profile with local avatar
        const savedProfile = await saveENSProfile(response);
        
        // Convert to JSON and back to ensure all strings are properly cleaned
        const jsonString = JSON.stringify(savedProfile);
        const cleanedResponse = JSON.parse(jsonString);
        
        // Return the response with cache control headers to prevent caching
        return NextResponse.json(cleanedResponse, {
          headers: {
            'Cache-Control': 'no-store, max-age=0, must-revalidate',
            'Pragma': 'no-cache',
            'Expires': '0'
          }
        });
      } catch (error) {
        console.error('Error processing ENS name lookup:', error);
        return NextResponse.json(
          { 
            message: `Error processing ENS name lookup: ${error instanceof Error ? error.message : 'Unknown error'}`,
            error: 'PROCESSING_ERROR',
            details: error instanceof Error ? error.stack : 'No stack trace available'
          },
          { 
            status: 500,
            headers: {
              'Cache-Control': 'no-store, max-age=0, must-revalidate',
              'Pragma': 'no-cache',
              'Expires': '0'
            }
          }
        );
      }
    } else if (type === 'address' && address) {
      try {
        // Validate the address format
        if (!isAddress(address)) {
          return NextResponse.json(
            { 
              message: 'Invalid Ethereum address format',
              error: 'INVALID_ADDRESS',
              details: 'The provided address is not a valid Ethereum address.'
            },
            { status: 400 }
          );
        }
        
        // Get the reverse node for the address
        const reverseNode = getReverseNode(address);
        console.log(`Reverse node for ${address}:`, reverseNode);
        
        // Query the registry for the resolver address
        const resolverAddress = await baseClient.readContract({
          address: BASE_REGISTRY_ADDRESS as Address,
          abi: registryABI,
          functionName: 'resolver',
          args: [reverseNode],
        }) as Address;
        
        console.log(`Resolver address for reverse lookup of ${address}:`, resolverAddress);
        
        if (!resolverAddress || resolverAddress === '0x0000000000000000000000000000000000000000') {
          console.log(`No reverse resolver found for: ${address}`);
          return NextResponse.json(
            { 
              message: `No ENS name found for address: ${address}`,
              error: 'ADDRESS_NOT_FOUND',
              details: 'The provided Ethereum address does not have an associated ENS name on Base.'
            },
            { status: 404 }
          );
        }
        
        // Query the resolver for the name
        const name = await baseClient.readContract({
          address: resolverAddress,
          abi: resolverABI,
          functionName: 'text',
          args: [reverseNode, 'name'],
        }) as string;
        
        console.log(`Name for ${address}:`, name);
        
        if (!name) {
          return NextResponse.json(
            { 
              message: `No ENS name found for address: ${address}`,
              error: 'ADDRESS_NOT_FOUND',
              details: 'The provided Ethereum address does not have an associated ENS name on Base.'
            },
            { status: 404 }
          );
        }
        
        // Now that we have the name, we can get all the details
        const normalizedName = normalize(name);
        const node = namehash(normalizedName);
        
        // Get the domain resolver
        const domainResolverAddress = await baseClient.readContract({
          address: BASE_REGISTRY_ADDRESS as Address,
          abi: registryABI,
          functionName: 'resolver',
          args: [node],
        }) as Address;
        
        // Get text records
        const textKeys = [
          'name', 
          'description', 
          'url', 
          'email', 
          'avatar', 
          'com.twitter', 
          'com.github', 
          'com.discord',
          'com.reddit',
          'org.telegram',
          'eth.ens.delegate',
          'com.linkedin',
          'website',
          'location',
          'keywords' // Changed from 'skills' to 'keywords'
        ];
        
        const textRecords = await Promise.all(
          textKeys.map(async (key) => {
            try {
              const value = await baseClient.readContract({
                address: domainResolverAddress,
                abi: resolverABI,
                functionName: 'text',
                args: [node, key],
              }) as string;
              
              if (value) {
                return { key, value, type: 'text' } as TextRecord;
              }
              return null;
            } catch (error) {
              console.error(`Error fetching text record ${key}:`, error);
              return null;
            }
          })
        );
        
        // Filter out null records
        const validRecords = textRecords.filter((record): record is TextRecord => record !== null);
        
        // Clean record values (remove newlines, trim whitespace)
        const cleanedRecords = validRecords.map(record => {
          if (record.value && typeof record.value === 'string') {
            // Use the utility function to clean the record value
            const cleanedValue = cleanEnsRecordValue(record.value);
            console.log(`Cleaned record ${record.key}: "${record.value}" -> "${cleanedValue}"`);
            return {
              ...record,
              value: cleanedValue
            };
          }
          return record;
        });
        
        // Process keywords specifically if they exist
        const keywordsRecord = validRecords.find(record => record.key === 'keywords');
        console.log('Keywords record:', keywordsRecord); // Log the found keywords record
        const skills = keywordsRecord ? keywordsRecord.value.split(',').map((s: string) => s.trim()) : [];

        // Format the response
        const response = {
          name: normalizedName,
          address: address,
          records: cleanedRecords,
          skills: skills // Keep as 'skills' in the response for compatibility
        };
        
        return NextResponse.json(response, {
          headers: {
            'Cache-Control': 'no-store, max-age=0, must-revalidate',
            'Pragma': 'no-cache',
            'Expires': '0'
          }
        });
      } catch (error) {
        console.error('Error processing ENS address lookup:', error);
        return NextResponse.json(
          { 
            message: `Error processing ENS address lookup: ${error instanceof Error ? error.message : 'Unknown error'}`,
            error: 'PROCESSING_ERROR',
            details: error instanceof Error ? error.stack : 'No stack trace available'
          },
          { 
            status: 500,
            headers: {
              'Cache-Control': 'no-store, max-age=0, must-revalidate',
              'Pragma': 'no-cache',
              'Expires': '0'
            }
          }
        );
      }
    }

    return NextResponse.json(
      { 
        message: 'Invalid request parameters',
        error: 'INVALID_PARAMETERS',
        details: 'The request must include either a name or an address parameter, along with the corresponding type parameter.'
      },
      { status: 400 }
    );
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Failed to lookup ENS name';
    console.error('ENS lookup error:', error);
    return NextResponse.json(
      { 
        message: errorMessage,
        error: 'UNEXPECTED_ERROR',
        details: error instanceof Error ? error.stack : 'No stack trace available'
      },
      { 
        status: 500,
        headers: {
          'Cache-Control': 'no-store, max-age=0, must-revalidate',
          'Pragma': 'no-cache',
          'Expires': '0'
        }
      }
    );
  }
}