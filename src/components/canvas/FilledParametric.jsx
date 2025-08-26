import React, { useMemo } from 'react'
import { colors } from '../../config/colors'

// Custom filled parametric component based on Mafs internals
function FilledParametric({ 
  xy, 
  domain, 
  color = colors.blue, 
  fillOpacity = 0.3, 
  strokeOpacity = 0.8,
  weight = 2,
  style = "solid",
  minSamplingDepth = 8,
  forceKeyframes = []
}) {
  const [tMin, tMax] = domain

  // This is adapted from Mafs' internal sampleParametric function
  const svgPath = useMemo(() => {
    const points = []
    const numSamples = Math.pow(2, minSamplingDepth)
    const step = (tMax - tMin) / numSamples
    
    // Create a set of all t values to sample, including forced keyframes
    const tValues = new Set()
    
    // Add regular sampling points
    for (let i = 0; i <= numSamples; i++) {
      const t = tMin + i * step
      tValues.add(t)
    }
    
    // Add forced keyframes (only those within the domain)
    forceKeyframes.forEach(t => {
      if (t >= tMin && t <= tMax) {
        tValues.add(t)
      }
    })
    
    // Convert to sorted array and sample points
    const sortedTValues = Array.from(tValues).sort((a, b) => a - b)
    
    for (const t of sortedTValues) {
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
  }, [xy, tMin, tMax, minSamplingDepth, forceKeyframes])

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