# ENS Subgraph

This directory contains the GraphQL schema and configuration files for the ENS subgraph. These files can be used to set up a subgraph for querying ENS data from the Ethereum blockchain.

## Files

- `schema.graphql`: The GraphQL schema that defines the data model for the ENS subgraph.
- `subgraph.yaml`: The configuration file that defines the data sources and mappings for the subgraph.

## Using the Subgraph

To use the ENS subgraph for querying ENS data, you can:

1. Use the public ENS subgraph hosted on The Graph:
   - Mainnet: https://thegraph.com/explorer/subgraphs/GfHFdFmiSwW1PKxaBjxuBiNv9NyJyMCvXq5w4qfQEgQE
   - Sepolia: https://thegraph.com/explorer/subgraphs/5LJeAJxXmHJbTmZSrP9NNZXmh8WoMV3aNqJyP8DqJHyv

2. Deploy your own subgraph using these files:
   - Install The Graph CLI: `npm install -g @graphprotocol/graph-cli`
   - Initialize a new subgraph project
   - Copy these files into your project
   - Deploy the subgraph to a Graph node

## Example Queries

Here are some example queries you can use with the ENS subgraph:

### Get domains owned by an address

```graphql
query getDomainsForAccount {
  domains(where: { owner: "0xa508c16666c5b8981fa46eb32784fccc01942a71" }) {
    name
  }
}
```

### Get the top domain for an account based on the longest registry

```graphql
query getDomainForAccount {
  account(id: "0xa508c16666c5b8981fa46eb32784fccc01942a71") {
    registrations(first: 1, orderBy: expiryDate, orderDirection: desc) {
      domain {
        name
      }
    }
    id
  }
}
```

### Search for a subdomain

```graphql
query getSubDomains($Account: String = "base.eth") {
  domains(where: { name: "base.eth" }) {
    name
    id
    subdomains(first: 10) {
      name
    }
    subdomainCount
  }
}
```

### Get the expiry of an ENS domain

```graphql
query getDomainExp($Account: String = "name.base.eth") {
  registrations(
    where: { domain_: { name: $Account } }
    first: 1
    orderBy: expiryDate
    orderDirection: desc
  ) {
    expiryDate
  }
}
```

## Integration with the Lookup Feature

The ENS lookup feature in this application uses these subgraph files to understand the data structure of ENS domains. The API endpoint at `/api/ens/lookup` can be enhanced to query the ENS subgraph directly using the Graph API.

To enable subgraph queries, add your Graph API key to the `.env.local` file:

```
GRAPH_API_KEY=your_api_key_here
```

Then update the API endpoint to use the subgraph for more comprehensive ENS data. 