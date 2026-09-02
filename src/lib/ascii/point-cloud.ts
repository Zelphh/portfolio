import { clamp } from '@/lib/utils'
import { gridToHtml, LOGO_RAMP } from './render'

/**
 * A tiny point-cloud rasteriser with a z-buffer, shared by the three
 * animated logos (react, node, git). Each logo only supplies geometry and a
 * palette; the projection, hidden-surface removal and HTML assembly are
 * identical and live here once.
 */

export interface CloudPoint {
  readonly x: number
  readonly y: number
  readonly z: number
  /** 0-1 brightness. Ignored by depth-shaded groups. */
  readonly lum: number
}

/** How a group of points turns depth into colour and glyph density. */
export type Shading =
  /** Brightness is baked per point — used for flat-shaded solid faces. */
  | { readonly mode: 'flat' }
  /**
   * Brightness follows the rotated z, so the geometry reads as 3D even
   * though every point carries the same source brightness.
   */
  | {
      readonly mode: 'depth'
      readonly range: number
      /** Lowest ramp index a point can use. */
      readonly charBase: number
      /** Extra ramp indices available at full brightness. 0 pins the glyph. */
      readonly charSpan: number
    }

export interface CloudGroup {
  /** 256-entry colour ramp; see `buildPalette`. */
  readonly palette: readonly string[]
  readonly shading: Shading
  /** Interleaved x, y, z triples. Flat arrays keep the frame loop alloc-free. */
  readonly coords: Float32Array
  readonly lums: Float32Array
}

export interface PointCloudSpec {
  readonly width: number
  readonly height: number
  /** Character cells are taller than they are wide; corrects the aspect. */
  readonly cellAspect: number
  readonly scale: number
  readonly groups: readonly CloudGroup[]
}

/** Packs plain points into the flat arrays the renderer iterates. */
export function toGroup(
  points: readonly CloudPoint[],
  palette: readonly string[],
  shading: Shading,
): CloudGroup {
  const coords = new Float32Array(points.length * 3)
  const lums = new Float32Array(points.length)

  points.forEach((point, i) => {
    coords[i * 3] = point.x
    coords[i * 3 + 1] = point.y
    coords[i * 3 + 2] = point.z
    lums[i] = point.lum
  })

  return { palette, shading, coords, lums }
}

const LAST_RAMP_INDEX = LOGO_RAMP.length - 1

/**
 * Owns the per-frame buffers. One instance per mounted logo, reused across
 * every frame so a 60 s animation allocates nothing after the first render.
 */
export class PointCloudRenderer {
  private readonly depth: Float32Array
  private readonly chars: string[]
  private readonly colors: (string | null)[]

  constructor(private readonly spec: PointCloudSpec) {
    const cells = spec.width * spec.height
    this.depth = new Float32Array(cells)
    this.chars = new Array<string>(cells).fill(' ')
    this.colors = new Array<string | null>(cells).fill(null)
  }

  /** Rasterises the cloud rotated `angleY` radians and returns markup. */
  render(angleY: number): string {
    const { width, height, scale, cellAspect, groups } = this.spec
    const { depth, chars, colors } = this

    depth.fill(-Infinity)
    chars.fill(' ')
    colors.fill(null)

    const cos = Math.cos(angleY)
    const sin = Math.sin(angleY)
    const centerX = width >> 1
    const centerY = height >> 1
    const horizontal = scale / cellAspect

    for (const group of groups) {
      const { coords, lums, palette, shading } = group
      const count = lums.length

      for (let i = 0; i < count; i++) {
        const px = coords[i * 3] as number
        const py = coords[i * 3 + 1] as number
        const pz = coords[i * 3 + 2] as number

        // Rotation about the Y axis, inlined to avoid a per-point object.
        const x = px * cos + pz * sin
        const z = -px * sin + pz * cos

        const col = Math.round(centerX + x * horizontal)
        const row = Math.round(centerY - py * scale)
        if (col < 0 || col >= width || row < 0 || row >= height) continue

        const index = row * width + col
        if (z <= (depth[index] as number)) continue
        depth[index] = z

        let paletteIndex: number
        let charIndex: number

        if (shading.mode === 'flat') {
          const lum = lums[i] as number
          paletteIndex = Math.min(Math.round(lum * 255), 255)
          charIndex = Math.max(2, Math.round(lum * LAST_RAMP_INDEX))
        } else {
          const t = clamp((z / shading.range + 1) / 2, 0, 1)
          paletteIndex = Math.min(Math.round(t * 255), 255)
          charIndex = shading.charBase + Math.round(t * shading.charSpan)
        }

        chars[index] = LOGO_RAMP[clamp(charIndex, 0, LAST_RAMP_INDEX)] as string
        colors[index] = palette[paletteIndex] ?? null
      }
    }

    return gridToHtml(chars, colors, width, height)
  }
}
