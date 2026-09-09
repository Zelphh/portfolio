import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,

  // Trim the client bundle: only the icons actually imported get emitted.
  experimental: {
    optimizePackageImports: ['react', 'react-dom'],
  },

  // Every asset is local, so the image pipeline only ever handles our own SVGs.
  images: {
    formats: ['image/avif', 'image/webp'],
  },

  async headers() {
    return [
      {
        // Artwork is replaced in place under a stable name, so it must never be
        // marked immutable: a swapped cover has to reach browsers that already
        // hold the old one. Revalidating keeps that correct while still serving
        // a 304 for the common case where the file has not changed.
        source: '/projects/:path*',
        headers: [{ key: 'Cache-Control', value: 'public, no-cache' }],
      },
      {
        // Fonts and icons are content-addressed or immutable — cache them hard.
        source: '/icons/:path*',
        headers: [
          { key: 'Cache-Control', value: 'public, max-age=31536000, immutable' },
        ],
      },
    ]
  },
}

export default nextConfig
