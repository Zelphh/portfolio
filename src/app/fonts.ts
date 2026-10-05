import { Archivo, JetBrains_Mono } from 'next/font/google'

/**
 * Shared by every root layout — the locale layout and the global 404 — so
 * both pages load the same font files instead of declaring them twice.
 */
export const display = Archivo({
  subsets: ['latin'],
  weight: ['600', '800'],
  variable: '--font-archivo',
  display: 'swap',
})

export const mono = JetBrains_Mono({
  subsets: ['latin'],
  weight: ['400', '500', '700'],
  variable: '--font-jetbrains-mono',
  display: 'swap',
})
