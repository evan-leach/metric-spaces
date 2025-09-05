import React, { useMemo } from 'react'
import polygonClipping from 'polygon-clipping'
import { useTransformContext, vec } from 'mafs'
import { colors } from '../../config/colors'
import { generateHarmonics } from './Blob'
import { useFrameBasedOpacity } from '../../hooks/useFrameBasedOpacity'
import { sampleParametricAdaptive } from '../../utils/parametricSampling'
import { ADAPTIVE_TOLERANCE_PX, ADAPTIVE_MIN_DEPTH, ADAPTIVE_MAX_DEPTH } from '../../constants/sampling'

/**
 * Shape descriptor types supported by BooleanRegion
 * - Circle: { type: 'circle', center: [x, y], radius: number, samplingDepth? }
 * - Blob: {
 *     type: 'blob', center: [x, y], size: number,
 *     harmonics?: object,
 *     harmonicsConfig?: { scale: number, seed: number },
 *     samplingDepth?
 *   }
 * - Polygon: { type: 'polygon', vertices: [[x1, y1], [x2, y2], ...] }
 */

function BooleanRegion({
  operation = 'union', // 'union' | 'intersection'
  shapes = [], // array of shape descriptors
  // styling
  color = colors.blue,
  fillOpacity = 0.3,
  strokeOpacity = 0.8,
  weight = 2,
  style = 'solid', // 'solid' | 'dashed'
  // sampling controls
  minSamplingDepth = 12,
  maxSamplingDepth = 16,
  invert = false,
  // animation/visibility
  startFrame = null,
  endFrame = null,
  stepIndex = 0
}) {
  const { viewTransform } = useTransformContext()
  const pixelsPerSquare = -vec.det(viewTransform)
  const pixelsPerUnit = Math.sqrt(Math.max(pixelsPerSquare, 0.000001))

  const currentOpacity = useFrameBasedOpacity(startFrame, endFrame, stepIndex)

  // Decide sampling depth based on zoom to keep edges smooth without oversampling at low zoom
  const effectiveSamplingDepth = useMemo(() => {
    // Heuristic: add ~log2 of scale, clamped
    const zoomBoost = Math.max(0, Math.floor(Math.log2(Math.max(pixelsPerUnit, 1))))
    return Math.max(minSamplingDepth, Math.min(maxSamplingDepth, minSamplingDepth + zoomBoost))
  }, [pixelsPerUnit, minSamplingDepth, maxSamplingDepth])

  // Build a polygon ring from a parametric function xy(t) over [0, 2π], using adaptive sampler
  const sampleParametricRing = (xy, tMin, tMax) => {
    const { points } = sampleParametricAdaptive(xy, tMin, tMax, {
      pixelsPerUnit,
      // Coarse settings for debugging visible edges/vertices
      tolerancePx: ADAPTIVE_TOLERANCE_PX,
      minDepth: ADAPTIVE_MIN_DEPTH,
      maxDepth: ADAPTIVE_MAX_DEPTH
    })
    return points
  }

  // Convert descriptors to MultiPolygon (array-of-polygons), each polygon is [ring]
  const inputPolygons = useMemo(() => {
    return shapes
      .map((shape) => {
        if (shape.type === 'circle') {
          const { center, radius } = shape
          const xy = (t) => [center[0] + radius * Math.cos(t), center[1] + radius * Math.sin(t)]
          const ring = sampleParametricRing(xy, 0, 2 * Math.PI)
          return [ring]
        }
        if (shape.type === 'blob') {
          const { center, size } = shape
          // harmonics priority: explicit over config
          const harmonics = shape.harmonics ?? generateHarmonics(shape.harmonicsConfig?.scale ?? 0.5, shape.harmonicsConfig?.seed ?? 42, size)
          const xy = (t) => {
            const angle = t
            const names = ['first', 'second', 'third', 'fourth', 'fifth', 'sixth', 'seventh', 'eighth']
            let radiusVariation = 0
            for (const name of names) {
              if (harmonics[name]) {
                radiusVariation += harmonics[name].amplitude * Math.sin(harmonics[name].frequency * angle + harmonics[name].phase)
              }
            }
            const r = size * (1 + radiusVariation)
            return [r * Math.cos(angle) + center[0], r * Math.sin(angle) + center[1]]
          }
          const ring = sampleParametricRing(xy, 0, 2 * Math.PI)
          return [ring]
        }
        if (shape.type === 'polygon') {
          const { vertices } = shape
          // Ensure polygon is closed by adding first vertex at end if needed
          const ring = [...vertices]
          if (ring.length > 0 && (ring[0][0] !== ring[ring.length - 1][0] || ring[0][1] !== ring[ring.length - 1][1])) {
            ring.push(ring[0])
          }
          return [ring]
        }
        // Unsupported shapes are ignored
        return null
      })
      .filter(Boolean)
  }, [shapes, effectiveSamplingDepth, pixelsPerUnit])

  // Compute boolean result
  const resultMultiPolygon = useMemo(() => {
    if (!inputPolygons || inputPolygons.length < 2) return []
    try {
      let result
      if (operation === 'intersection') {
        result = polygonClipping.intersection(...inputPolygons)
      } else {
        result = polygonClipping.union(...inputPolygons)
      }
      if (invert) {
        const bigBox = [[
          [-100000, -100000],
          [100000, -100000],
          [100000, 100000],
          [-100000, 100000],
          [-100000, -100000]
        ]]
        result = polygonClipping.difference([bigBox], ...inputPolygons)
      }
      return result
    } catch (e) {
      // In case of robust-geom failures, return empty
      return []
    }
  }, [inputPolygons, operation])

  // Filter out invalid polygons (empty or malformed) - do this in useMemo to avoid early returns
  const validPolygons = useMemo(() => {
    if (!resultMultiPolygon || resultMultiPolygon.length === 0) {
      return []
    }
    
    return resultMultiPolygon.filter(polygon => 
      polygon && 
      polygon.length > 0 && 
      polygon[0] && 
      polygon[0].length > 0
    )
  }, [resultMultiPolygon])

  // Convert rings to an SVG path string. For fill, include holes (subpaths). For stroke, only outer rings.
  const polygonToFillPath = (polygon) => {
    // polygon: [outerRing, hole1, hole2, ...]
    let d = ''
    for (const ring of polygon) {
      if (!ring || ring.length === 0) continue
      d += `M ${ring[0][0]} ${ring[0][1]}`
      for (let i = 1; i < ring.length; i++) {
        d += ` L ${ring[i][0]} ${ring[i][1]}`
      }
      d += ' Z '
    }
    return d.trim()
  }

  const ringToPath = (ring) => {
    if (!ring || ring.length === 0) return ''
    let d = `M ${ring[0][0]} ${ring[0][1]}`
    for (let i = 1; i < ring.length; i++) {
      d += ` L ${ring[i][0]} ${ring[i][1]}`
    }
    d += ' Z'
    return d
  }

  const dashPattern = useMemo(() => {
    if (style !== 'dashed') return undefined
    const dashLength = weight * 2
    const gapLength = weight * 2
    return `${dashLength} ${gapLength}`
  }, [style, weight])

  const basePathStyle = {
    vectorEffect: 'non-scaling-stroke',
    transform: 'var(--mafs-view-transform)',
    stroke: 'none' // Explicitly ensure no stroke on fill paths
  }

  const strokePathStyle = {
    ...basePathStyle,
    strokeDasharray: dashPattern,
    stroke: color, // Explicitly override any inherited stroke color
    strokeWidth: weight
  }

  // Only render if we have valid polygons (this is the only early return, after all hooks)
  if (validPolygons.length === 0) {
    return null
  }

  return (
    <>
      {/* Fill paths with even-odd to account for holes */}
      {validPolygons.map((polygon, idx) => (
        <path
          key={`fill-${idx}`}
          d={polygonToFillPath(polygon)}
          fill={color}
          fillRule="evenodd"
          fillOpacity={fillOpacity * currentOpacity}
          stroke="none"
          style={basePathStyle}
        />
      ))}
      {/* Stroke all rings (outer boundary + holes) */}
      {validPolygons.map((polygon, polygonIdx) => 
        polygon.map((ring, ringIdx) => (
          <path
            key={`stroke-${polygonIdx}-${ringIdx}`}
            d={ringToPath(ring)}
            fill="none"
            strokeOpacity={strokeOpacity * currentOpacity}
            strokeLinecap="round"
            strokeLinejoin="round"
            style={strokePathStyle}
          />
        ))
      )}
    </>
  )
}

export default BooleanRegion

