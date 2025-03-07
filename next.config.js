/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '*.public.blob.vercel-storage.com',
      },
      {
        protocol: 'https',
        hostname: 'img.clerk.com',
      },
      {
        protocol: 'https',
        hostname: 'images.clerk.dev',
      },
      {
        protocol: 'https',
        hostname: 'clerk.basedlist.dev',
      },
      {
        protocol: 'https',
        hostname: 'basedlist.dev',
      },
      {
        protocol: 'https',
        hostname: 'api.clerk.com',
      },
      {
        protocol: 'https',
        hostname: 'www.basedlist.dev',
      },
      // ENS and IPFS related domains
      {
        protocol: 'https',
        hostname: 'metadata.ens.domains',
      },
      {
        protocol: 'https',
        hostname: 'ipfs.io',
      },
      {
        protocol: 'https',
        hostname: '*.ipfs.dweb.link',
      },
      {
        protocol: 'https',
        hostname: '*.ipfs.cf-ipfs.com',
      },
      {
        protocol: 'https',
        hostname: 'gateway.ipfs.io',
      },
      {
        protocol: 'https',
        hostname: 'cloudflare-ipfs.com',
      },
      {
        protocol: 'https',
        hostname: 'gateway.pinata.cloud',
      },
      {
        protocol: 'https',
        hostname: '*.eth.limo',
      }
    ],
  },
  webpack: (config) => {
    config.resolve.fallback = {
      ...config.resolve.fallback,
      net: false,
      tls: false,
      fs: false,
      dns: false,
      child_process: false,
      'fs/promises': false,
      'timers/promises': false,
      'util/types': false,
      util: false,
      kerberos: false,
      '@mongodb-js/zstd': false,
      '@aws-sdk/credential-providers': false,
      'gcp-metadata': false,
      snappy: false,
      socks: false,
      aws4: false,
      'mongodb-client-encryption': false,
    }
    return config
  },
}

module.exports = nextConfig 