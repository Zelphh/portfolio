/** Single source of truth for identity, URLs and analytics-free metadata. */
export const SITE = {
  name: 'zelph',
  email: 'ola@exemplo.dev',
  /** Absolute origin, used for canonical URLs and Open Graph tags. */
  url: 'https://zelph.dev',
  location: 'joinville — sc',
  startYear: 2026,
} as const

/** ASCII mark used in the header, kept out of JSX so it stays readable. */
export const LOGO_MARK = `  /\\
 /  \\
/____\\`
