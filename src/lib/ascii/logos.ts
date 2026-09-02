import { buildPalette, LOGO_RAMP, rgb } from './render'
import { toGroup, type CloudPoint, type PointCloudSpec } from './point-cloud'

/**
 * Geometry for the three animated logos. Every point set is built once at
 * module load and shared by all instances — the data never changes, only the
 * rotation angle does.
 */

const GRID = { width: 119, height: 57, cellAspect: 0.55 } as const
const RAMP_LAST = LOGO_RAMP.length - 1

const point = (x: number, y: number, z: number, lum: number): CloudPoint => ({
  x,
  y,
  z,
  lum,
})

/* -------------------------------------------------------------------------- */
/* react — a nucleus wrapped in three tilted electron orbits                  */
/* -------------------------------------------------------------------------- */

const REACT_PALETTE = buildPalette((t) => rgb(60 + t * 100, 180 + t * 75, 200 + t * 55))

const NUCLEUS_RADIUS = 0.18
const ORBIT_RX = 1
const ORBIT_RY = 0.28
const ORBIT_STEPS = 800

function nucleus(radius: number, rings: number, segments: number): CloudPoint[] {
  const points: CloudPoint[] = []

  for (let i = 0; i < rings; i++) {
    const theta = (Math.PI * i) / (rings / 2)
    const sinTheta = Math.sin(theta)
    const cosTheta = Math.cos(theta)

    for (let j = 0; j < segments; j++) {
      const phi = (2 * Math.PI * j) / segments
      points.push(
        point(
          radius * sinTheta * Math.cos(phi),
          radius * sinTheta * Math.sin(phi),
          radius * cosTheta,
          1,
        ),
      )
    }
  }

  return points
}

function orbit(azimuth: number): CloudPoint[] {
  const cos = Math.cos(azimuth)
  const sin = Math.sin(azimuth)

  return Array.from({ length: ORBIT_STEPS }, (_, i) => {
    const t = (2 * Math.PI * i) / ORBIT_STEPS
    const ex = ORBIT_RX * Math.cos(t)
    const ey = ORBIT_RY * Math.sin(t)
    return point(ex * cos - ey * sin, ex * sin + ey * cos, 0, 1)
  })
}

export const REACT_LOGO: PointCloudSpec = {
  ...GRID,
  scale: 30,
  groups: [
    toGroup(nucleus(NUCLEUS_RADIUS, 60, 60), REACT_PALETTE, {
      mode: 'depth',
      range: NUCLEUS_RADIUS,
      charBase: RAMP_LAST,
      charSpan: 0,
    }),
    toGroup(
      [0, Math.PI / 3, (2 * Math.PI) / 3].flatMap(orbit),
      REACT_PALETTE,
      { mode: 'depth', range: ORBIT_RX, charBase: 3, charSpan: RAMP_LAST - 3 },
    ),
  ],
}

/* -------------------------------------------------------------------------- */
/* node.js — a hexagonal prism with an N floating inside                      */
/* -------------------------------------------------------------------------- */

const NODE_PALETTE = buildPalette((t) => rgb(80 + t * 100, 180 + t * 75, 40 + t * 60))
const NODE_LETTER_PALETTE = buildPalette((t) => {
  const v = 80 + t * 175
  return rgb(v, v, v)
})

/** Edges of a regular n-gon prism: both caps plus the vertical corners. */
function prismEdges(
  vertices: readonly (readonly [number, number])[],
  depth: number,
  steps: number,
  faceLum: number,
  sideLum: (x: number, y: number) => number,
  sideSteps = steps,
): CloudPoint[] {
  const points: CloudPoint[] = []

  for (let i = 0; i < vertices.length; i++) {
    const [x0, y0] = vertices[i] as readonly [number, number]
    const next = vertices[(i + 1) % vertices.length] as readonly [number, number]
    const [x1, y1] = next

    for (let s = 0; s <= steps; s++) {
      const t = s / steps
      const x = x0 * (1 - t) + x1 * t
      const y = y0 * (1 - t) + y1 * t
      points.push(point(x, y, depth, faceLum), point(x, y, -depth, faceLum))
    }

    // Vertical corner, shaded by how much the face turns toward the light.
    const lum = sideLum(x0, y0)
    for (let s = 0; s <= sideSteps; s++) {
      const t = s / sideSteps
      points.push(point(x0, y0, depth * (1 - 2 * t), lum))
    }
  }

  return points
}

function hexagonVertices(radius: number): Array<[number, number]> {
  return Array.from({ length: 6 }, (_, i) => {
    const angle = Math.PI / 2 + (Math.PI / 3) * i
    return [radius * Math.cos(angle), radius * Math.sin(angle)]
  })
}

/** The letter N: two uprights and the diagonal between them. */
function letterN(size: number, z: number, steps: number): CloudPoint[] {
  const points: CloudPoint[] = []
  const stroke = (
    x0: number,
    y0: number,
    x1: number,
    y1: number,
    count: number,
  ) => {
    for (let i = 0; i < count; i++) {
      const t = i / (count - 1)
      points.push(point(x0 + (x1 - x0) * t, y0 + (y1 - y0) * t, z, 1))
    }
  }

  stroke(-size, -size, -size, size, steps)
  stroke(size, -size, size, size, steps)
  stroke(-size, size, size, -size, steps * 2)

  return points
}

export const NODE_LOGO: PointCloudSpec = {
  ...GRID,
  scale: 22,
  groups: [
    toGroup(
      prismEdges(
        hexagonVertices(1),
        0.001,
        50,
        0.9,
        (x) => 0.8 + 0.15 * (x / 1),
      ),
      NODE_PALETTE,
      { mode: 'flat' },
    ),
    toGroup(letterN(0.52, 0.002, 35), NODE_LETTER_PALETTE, { mode: 'flat' }),
  ],
}

/* -------------------------------------------------------------------------- */
/* git — a diamond prism carrying the commit-graph glyph                      */
/* -------------------------------------------------------------------------- */

const GIT_PALETTE = buildPalette((t) => rgb(180 + t * 75, 60 + t * 80, 40 + t * 60))
const GIT_SYMBOL_PALETTE = buildPalette((t) => {
  const v = 100 + t * 155
  return rgb(v, v, v)
})

const DIAMOND_VERTICES: Array<[number, number]> = [
  [0, 1],
  [1, 0],
  [0, -1],
  [-1, 0],
]

/** Three nodes joined to a fork point — the git logo, drawn as outlines. */
function gitSymbol(size: number, z: number, steps: number): CloudPoint[] {
  const points: CloudPoint[] = []
  const nodeRadius = 0.12

  const circle = (cx: number, cy: number) => {
    for (let i = 0; i < steps; i++) {
      const angle = (2 * Math.PI * i) / steps
      points.push(
        point(
          cx + nodeRadius * Math.cos(angle),
          cy + nodeRadius * Math.sin(angle),
          z,
          1,
        ),
      )
    }
  }

  const line = (x0: number, y0: number, x1: number, y1: number) => {
    for (let i = 0; i < steps; i++) {
      const t = i / (steps - 1)
      points.push(point(x0 + (x1 - x0) * t, y0 + (y1 - y0) * t, z, 1))
    }
  }

  const top = size * 0.55
  const branchY = -size * 0.45
  const branchX = size * 0.5

  circle(0, top)
  circle(-branchX, branchY)
  circle(branchX, branchY)
  line(0, top - nodeRadius, 0, 0)
  line(0, 0, -branchX, branchY + nodeRadius)
  line(0, 0, branchX, branchY + nodeRadius)

  return points
}

export const GIT_LOGO: PointCloudSpec = {
  ...GRID,
  scale: 22,
  groups: [
    toGroup(
      prismEdges(
        DIAMOND_VERTICES,
        0.001,
        60,
        0.92,
        (x, y) => {
          // Side brightness follows the outward normal of the edge midpoint.
          const length = Math.hypot(x, y) || 1
          return 0.75 + 0.2 * (x / length)
        },
        20,
      ),
      GIT_PALETTE,
      { mode: 'flat' },
    ),
    toGroup(gitSymbol(0.62, 0.002, 30), GIT_SYMBOL_PALETTE, { mode: 'flat' }),
  ],
}

export const LOGO_SPECS = {
  react: REACT_LOGO,
  node: NODE_LOGO,
  git: GIT_LOGO,
} as const
