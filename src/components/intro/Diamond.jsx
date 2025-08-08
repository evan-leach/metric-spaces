import React, { useMemo } from 'react'
import { Polygon, Point as MafsPoint } from 'mafs'
import { useKeyframeAnimation } from '../../hooks/useKeyframeAnimation'
import Label from '../canvas/Label'
import { colors } from '../../config/colors'

/**
 * Calculate the boundary point of a diamond or square in a given direction
 * @param {Array} center - Shape center [x, y]
 * @param {number} radius - Shape radius (distance from center to vertex/edge)
 * @param {string} attach - Direction: "n", "ne", "e", "se", "s", "sw", "w", "nw"
 * @param {boolean} isSquare - Whether the shape is a square or diamond
 * @returns {Array} Boundary point [x, y]
 */
function calculateDiamondBoundaryPoint(center, radius, attach, isSquare = false) {
  const [cx, cy] = center
  
  if (isSquare) {
    // Square vertices and edge points
    const vertices = {
      'n': [cx, cy + radius],
      'e': [cx + radius, cy],
      's': [cx, cy - radius],
      'w': [cx - radius, cy]
    }
    
    const edgePoints = {
      'ne': [cx + radius, cy + radius],
      'se': [cx + radius, cy - radius],
      'sw': [cx - radius, cy - radius],
      'nw': [cx - radius, cy + radius]
    }
    
    return vertices[attach] || edgePoints[attach] || vertices.n
  } else {
    // Diamond vertices
    const vertices = {
      'n': [cx, cy + radius],
      'e': [cx + radius, cy],
      's': [cx, cy - radius],
      'w': [cx - radius, cy]
    }
    
    // For corner directions, calculate point on diamond edge
    const edgePoints = {
      'ne': [cx + radius/2, cy + radius/2],
      'se': [cx + radius/2, cy - radius/2],
      'sw': [cx - radius/2, cy - radius/2],
      'nw': [cx - radius/2, cy + radius/2]
    }
    
    return vertices[attach] || edgePoints[attach] || vertices.n
  }
}

function Diamond({ 
  center = [0, 0],
  keyframes = {},
  stepIndex = 0,
  color = colors.blue,
  fillOpacity = 0.1,
  strokeOpacity = 0.5,
  weight = 2,
  strokeStyle = "solid",
  showCenterPoint = true,
  centerPointColor = null,
  // Shape props
  isSquare = false,         // When true, renders a square instead of diamond
  // Label props
  labelContext = null,      // Function: (center, radius) => string
  labelAttach = "ne",
  labelAttachDistance = 30,
  labelSize = 14,
  labelColor = null,
  labelAtCenter = false     // When true, positions label at center point instead of shape boundary
}) {
  // Generate opacity keyframes based on radius keyframes
  const enhancedKeyframes = useMemo(() => {
    const result = { ...keyframes }
    
    // If radius keyframes exist and no opacity keyframes are provided, generate them
    if (keyframes.radius && !keyframes.opacity) {
      const opacityKeyframes = {}
      
      // Map each radius value: 0 -> 0, >0 -> 1
      Object.entries(keyframes.radius).forEach(([step, radiusValue]) => {
        opacityKeyframes[step] = radiusValue > 0 ? 1 : 0
      })
      
      result.opacity = opacityKeyframes
    }
    
    return result
  }, [keyframes])
  
  // Use keyframe animation hook for size and opacity
  const animatedProps = useKeyframeAnimation(enhancedKeyframes, stepIndex)
  
  // Extract animated properties with defaults
  const radius = animatedProps.radius ?? 0
  const opacity = animatedProps.opacity ?? 1
  
  // Don't render if radius is 0 or negative
  if (radius <= 0) {
    return null
  }

  // Calculate shape points
  const [cx, cy] = center
  let shapePoints
  
  if (isSquare) {
    // Square points (axis-aligned)
    shapePoints = [
      [cx - radius, cy + radius],  // Top-left
      [cx + radius, cy + radius],  // Top-right
      [cx + radius, cy - radius],  // Bottom-right
      [cx - radius, cy - radius]   // Bottom-left
    ]
  } else {
    // Diamond points (rotated 45 degrees)
    shapePoints = [
      [cx, cy + radius],      // Top
      [cx + radius, cy],      // Right
      [cx, cy - radius],      // Bottom
      [cx - radius, cy]       // Left
    ]
  }

  // Calculate label position if labelContext is provided
  let labelPosition = null
  if (labelContext && radius > 0) {
    if (labelAtCenter) {
      // Position label at the center point
      labelPosition = center
    } else {
      // Position label at the shape boundary
      labelPosition = calculateDiamondBoundaryPoint(center, radius, labelAttach, isSquare)
    }
  }

  return (
    <>
      <Polygon
        points={shapePoints}
        color={color}
        fillOpacity={fillOpacity * opacity}
        strokeOpacity={strokeOpacity * opacity}
        weight={weight}
        strokeStyle={strokeStyle}
      />
      {showCenterPoint && (
        <MafsPoint
          x={center[0]}
          y={center[1]}
          color={centerPointColor || color}
          opacity={opacity}
        />
      )}
      {labelContext && labelPosition && (
        <Label
          labelContext={labelContext}
          labelContextArgs={[center, radius]}
          position={labelPosition}
          attach={labelAttach}
          attachDistance={labelAttachDistance}
          size={labelSize}
          color={labelColor || color}
          opacity={opacity}
        />
      )}
    </>
  )
}

export default Diamond 