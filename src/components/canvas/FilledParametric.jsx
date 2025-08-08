import React, { useMemo } from 'react'
import { useTransformContext, vec } from 'mafs'
import { colors } from '../../config/colors'

// Custom filled parametric component based on Mafs internals
function FilledParametric({ 
  xy, 
  domain, 
  color = colors.blue, 
  fillOpacity = 0.3, 
  strokeOpacity = 0.8,
  weight = 3,
  style = "solid",
  minSamplingDepth = 8
}) {
  const { viewTransform } = useTransformContext()
  const pixelsPerSquare = -vec.det(viewTransform)
  const [tMin, tMax] = domain
  const errorThreshold = 0.1 / pixelsPerSquare

  // This is adapted from Mafs' internal sampleParametric function
  const svgPath = useMemo(() => {
    const points = []
    const numSamples = Math.pow(2, minSamplingDepth)
    const step = (tMax - tMin) / numSamples
    
    // Sample points along the parametric curve
    for (let i = 0; i <= numSamples; i++) {
      const t = tMin + i * step
      const [x, y] = xy(t)
      points.push([x, y])
    }
    
    // Create SVG path string
    if (points.length === 0) return ""
    
    let pathString = `M ${points[0][0]} ${points[0][1]}`
    for (let i = 1; i < points.length; i++) {
      pathString += ` L ${points[i][0]} ${points[i][1]}`
    }
    // Close the path to make it fillable
    pathString += " Z"
    
    return pathString
  }, [xy, tMin, tMax, minSamplingDepth])

  // Calculate custom dash pattern based on stroke width for proper visual ratio
  const dashPattern = useMemo(() => {
    if (style !== "dashed") return undefined
    
    // Create 1/2 filled, 1/2 blank ratio (equal dash and gap lengths)
    // Scale with stroke width to maintain consistent appearance
    const dashLength = weight * 2    // 1/2 portion - dash length
    const gapLength = weight * 2     // 1/2 portion - gap length (equal to dash)
    
    return `${dashLength} ${gapLength}`
  }, [style, weight])

  return (
    <path
      d={svgPath}
      strokeWidth={weight}
      fill={color}
      fillOpacity={fillOpacity}
      stroke={color}
      strokeOpacity={strokeOpacity}
      strokeLinecap="round"
      strokeLinejoin="round"
      style={{
        vectorEffect: "non-scaling-stroke",
        transform: "var(--mafs-view-transform)",
        strokeDasharray: dashPattern,
        stroke: color, // Explicitly override any inherited stroke color
        strokeWidth: weight
      }}
    />
  )
}

export default FilledParametric 