# Based List

A directory of people building on Base.

## Setup

### Environment Variables

Make sure to set up the following environment variables:

```
MONGODB_URI=your_mongodb_connection_string
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
CLERK_SECRET_KEY=your_clerk_secret_key
NEXT_PUBLIC_VERCEL_BLOB_RW_TOKEN=your_vercel_blob_token
```

### Setting up Vercel Blob

To use the image upload functionality, you need to set up Vercel Blob:

1. Install the Vercel CLI if you haven't already:
   ```
   npm i -g vercel
   ```

2. Log in to Vercel:
   ```
   vercel login
   ```

3. Link your project to Vercel:
   ```
   vercel link
   ```

4. Create a new Vercel Blob store:
   ```
   vercel blob create
   ```

5. Get your Vercel Blob token:
   ```
   vercel blob tokens create --read --write
   ```

6. Add the token to your `.env.local` file:
   ```
   NEXT_PUBLIC_VERCEL_BLOB_RW_TOKEN=your_token_here
   ```

7. Make sure to also add this token to your Vercel project settings if deploying.

## Development

```
npm run dev
```

## Build

```
npm run build
```

## Features

- Builder profiles
- Project discovery
- Resource sharing
- Community building

This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
