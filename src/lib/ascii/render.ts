/**
 * Shared character-grid → HTML step for every ASCII component.
 *
 * The grids are redrawn dozens of times a second, so this never allocates
 * per cell: callers fill two flat arrays they own and reuse, and colour runs
 * collapse into a single `<span>` instead of one per character. The result
 * is written straight to `innerHTML` on a ref — it deliberately does not go
 * through React, which would diff thousands of nodes every frame.
 */

/** Density ramp shared by the 3D logos, dark to bright. */
export const LOGO_RAMP = ' .:;+=xX$&#@'

/** Density ramp used by the bonfire, matched to its 10-step grey palette. */
export const FIRE_RAMP = ' .:-=+*#%@'

const HTML_ESCAPES: Readonly<Record<string, string>> = {
  '<': '&lt;',
  '>': '&gt;',
  '&': '&amp;',
}

const escapeChar = (char: string): string => HTML_ESCAPES[char] ?? char

/** Escapes a whole run of ASCII art at once. */
export const escapeHtml = (text: string): string =>
  text.replace(/[<>&]/g, (char) => HTML_ESCAPES[char] as string)

/**
 * Builds markup for art whose colour varies per row rather than per cell —
 * one `<span>` per line instead of one per colour run.
 */
export function rowsToHtml(
  lines: readonly string[],
  colorForRow: (row: number) => string,
): string {
  return lines
    .map((line, row) => `<span style="color:${colorForRow(row)}">${escapeHtml(line)}</span>`)
    .join('\n')
}

/**
 * @param chars  Row-major grid of single characters, `width * height` long.
 * @param colors Matching grid of CSS colours; `null` renders uncoloured.
 */
export function gridToHtml(
  chars: ArrayLike<string>,
  colors: ArrayLike<string | null>,
  width: number,
  height: number,
): string {
  let html = ''

  for (let row = 0; row < height; row++) {
    let openColor: string | null = null
    let line = ''

    for (let col = 0; col < width; col++) {
      const index = row * width + col
      const char = chars[index] ?? ' '
      const color = char === ' ' ? null : (colors[index] ?? null)

      if (color !== openColor) {
        if (openColor !== null) line += '</span>'
        if (color !== null) line += `<span style="color:${color}">`
        openColor = color
      }

      line += escapeChar(char)
    }

    if (openColor !== null) line += '</span>'
    html += line + '\n'
  }

  return html
}

/** Pre-computes a 256-entry colour ramp so frames only do array lookups. */
export function buildPalette(
  toColor: (t: number) => string,
): readonly string[] {
  return Array.from({ length: 256 }, (_, i) => toColor(i / 255))
}

export const rgb = (r: number, g: number, b: number): string =>
  `rgb(${Math.round(r)},${Math.round(g)},${Math.round(b)})`
