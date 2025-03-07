# Base.eth Directory Lookup

This directory contains the code for the Base.eth Directory Lookup feature, which allows users to search for ENS profiles associated with base.eth subdomains.

## Features

- Search for ENS profiles by name (e.g., "ash" will search for "ash.base.eth")
- Search for ENS profiles by Ethereum address (reverse lookup)
- View ENS profile information including:
  - Avatar
  - Ethereum address
  - Contact information
  - Social media links
  - Other ENS records

## Implementation Details

### Components

- `page.tsx`: The main page component for the lookup feature
- `ens-profile-card.tsx`: Component for displaying ENS profile information
- `search-form.tsx`: Component for the search form with name/address toggle

### API

- `/api/ens/lookup`: API endpoint for looking up ENS profiles by name or address

### Utils

- `utils/ens.ts`: Utility functions for working with ENS

## How It Works

1. User enters a name or Ethereum address in the search form
2. The app formats the query and sends it to the API endpoint
3. The API endpoint uses the ENS.js library to fetch profile information
4. The profile information is displayed in the ENS profile card

## ENS Records

The lookup feature fetches the following ENS text records:

- email
- url
- avatar
- description
- name
- location
- com.discord
- com.github
- com.reddit
- com.twitter
- org.telegram
- eth.ens.delegate
- com.linkedin
- website

## Dependencies

- wagmi: For interacting with Ethereum
- viem: For Ethereum data types and utilities
- @ensdomains/ensjs: For ENS-specific functionality 