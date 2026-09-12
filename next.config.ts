import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,

  // No server behind this site: `next build` emits static HTML/CSS/JS to
  // `out/`, deployable to any static host (Cloudflare Pages, Netlify, GitHub
  // Pages, ...) with no Node process to run. That rules out `headers()` and
  // the on-demand image optimizer below — both need a server per request.
  output: 'export',

  // Exports `/pt/index.html` instead of `/pt.html`. The flat form only
  // resolves on hosts that specifically rewrite extensionless URLs to their
  // `.html` file (Netlify, Cloudflare Pages do; a bare file server or GitHub
  // Pages won't); a real folder with an `index.html` is what every static
  // host, CDN, and plain file server already knows how to serve.
  trailingSlash: true,

  // Trim the client bundle: only the icons actually imported get emitted.
  experimental: {
    optimizePackageImports: ['react', 'react-dom'],
  },

  // Every asset is local, so this only ever served our own SVGs — none of
  // which needed the resizing/reencoding a live optimizer provides. Static
  // export can't run that optimizer at all, so the images are served as-is.
  images: {
    unoptimized: true,
  },
}

export default nextConfig
