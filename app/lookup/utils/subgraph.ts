/**
 * Utility functions for querying the ENS subgraph
 */

// The Graph API endpoint for the ENS subgraph
const ENS_SUBGRAPH_URL = 'https://api.thegraph.com/subgraphs/name/ensdomains/ens';

// The Graph API key from environment variables
const GRAPH_API_KEY = process.env.GRAPH_API_KEY || '';

/**
 * Execute a GraphQL query against the ENS subgraph
 * @param query The GraphQL query to execute
 * @param variables The variables for the GraphQL query
 * @returns The query result
 */
export async function querySubgraph<T>(
  query: string, 
  variables: Record<string, unknown> = {}
): Promise<T> {
  try {
    const response = await fetch(ENS_SUBGRAPH_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(GRAPH_API_KEY ? { 'Authorization': `Bearer ${GRAPH_API_KEY}` } : {}),
      },
      body: JSON.stringify({
        query,
        variables,
      }),
    });

    const result = await response.json();

    if (result.errors) {
      throw new Error(result.errors[0].message);
    }

    return result.data as T;
  } catch (error) {
    console.error('Error querying subgraph:', error);
    throw error;
  }
}

// Define types for the domain data
interface Domain {
  name: string;
  id: string;
  labelName?: string;
  labelhash?: string;
  parent?: { name: string };
  subdomainCount: number;
  resolvedAddress?: { id: string };
  resolver?: {
    addr?: { id: string };
    texts?: string[];
    contentHash?: string;
  };
  ttl?: string;
  isMigrated: boolean;
  createdAt: string;
  expiryDate?: string;
  owner?: { id: string };
  registration?: {
    registrationDate: string;
    expiryDate: string;
    registrant: { id: string };
  };
}

/**
 * Get domains owned by an address
 * @param address The Ethereum address to query
 * @returns The domains owned by the address
 */
export async function getDomainsForAccount(address: string) {
  const query = `
    query getDomainsForAccount($address: String!) {
      domains(where: { owner: $address }) {
        name
        id
        labelName
        labelhash
        parent {
          name
        }
        subdomainCount
        resolvedAddress {
          id
        }
        resolver {
          addr {
            id
          }
          texts
          contentHash
        }
        ttl
        isMigrated
        createdAt
        expiryDate
      }
    }
  `;

  return querySubgraph<{ domains: Domain[] }>(query, { address: address.toLowerCase() });
}

/**
 * Get a domain by name
 * @param name The domain name to query
 * @returns The domain with the given name
 */
export async function getDomainByName(name: string) {
  const query = `
    query getDomainByName($name: String!) {
      domains(where: { name: $name }) {
        name
        id
        labelName
        labelhash
        parent {
          name
        }
        subdomainCount
        resolvedAddress {
          id
        }
        resolver {
          addr {
            id
          }
          texts
          contentHash
        }
        ttl
        isMigrated
        createdAt
        expiryDate
        owner {
          id
        }
        registration {
          registrationDate
          expiryDate
          registrant {
            id
          }
        }
      }
    }
  `;

  return querySubgraph<{ domains: Domain[] }>(query, { name });
}

/**
 * Get subdomains of a domain
 * @param name The domain name to query
 * @returns The subdomains of the domain
 */
export async function getSubdomains(name: string) {
  const query = `
    query getSubdomains($name: String!) {
      domains(where: { name: $name }) {
        name
        id
        subdomains {
          name
          id
          labelName
          owner {
            id
          }
          resolver {
            texts
          }
        }
        subdomainCount
      }
    }
  `;

  return querySubgraph<{ domains: Domain[] }>(query, { name });
}

/**
 * Get text records for a domain
 * @param name The domain name to query
 * @returns The text records for the domain
 */
export async function getTextRecords(name: string) {
  const query = `
    query getTextRecords($name: String!) {
      domains(where: { name: $name }) {
        name
        resolver {
          texts
          events(where: { eventType: "TextChanged" }, orderBy: blockNumber, orderDirection: desc) {
            ... on TextChanged {
              key
              value
            }
          }
        }
      }
    }
  `;

  return querySubgraph<{ domains: Domain[] }>(query, { name });
}

/**
 * Get the expiry date of a domain
 * @param name The domain name to query
 * @returns The expiry date of the domain
 */
export async function getDomainExpiry(name: string) {
  const query = `
    query getDomainExpiry($name: String!) {
      registrations(
        where: { domain_: { name: $name } }
        first: 1
        orderBy: expiryDate
        orderDirection: desc
      ) {
        expiryDate
      }
    }
  `;

  return querySubgraph<{ registrations: { expiryDate: string }[] }>(query, { name });
} 