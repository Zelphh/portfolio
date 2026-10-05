import type { NextConfig } from 'next'
import { PHASE_DEVELOPMENT_SERVER } from 'next/constants'

const baseConfig: NextConfig = {
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
    // The only root layouts live under `[locale]`, so a plain `not-found`
    // has no layout to render in. This one brings its own <html> and is
    // exported as `404.html`, which static hosts serve for unknown paths.
    globalNotFound: true,
  },

  // Every asset is local, so this only ever served our own SVGs — none of
  // which needed the resizing/reencoding a live optimizer provides. Static
  // export can't run that optimizer at all, so the images are served as-is.
  images: {
    unoptimized: true,
  },
}

// In the exported site the host serves `public/index.html` at `/`, and that
// page picks the language. `next dev` only maps public files to their exact
// path, so `/` would 404 there; point it at the same file while developing.
// Dev-only because rewrites need a server and can't be exported.
export default function nextConfig(phase: string): NextConfig {
  if (phase !== PHASE_DEVELOPMENT_SERVER) return baseConfig

  return {
    ...baseConfig,
    async rewrites() {
      return [{ source: '/', destination: '/index.html' }]
    },
  }
}
