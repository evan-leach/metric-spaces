import React, { useMemo } from 'react'
import { Circle as MafsCircle, Point as MafsPoint } from 'mafs'
import { useKeyframeAnimation } from '../../hooks/useKeyframeAnimation'
import { useFrameBasedOpacity } from '../../hooks/useFrameBasedOpacity'
import Label from '../canvas/Label'
import { colors } from '../../config/colors'
import { ANIMATION_THRESHOLD } from '../../constants/animations'

/**
 * Calculate the boundary point of a circle in a given direction
 * @param {Array} center - Circle center [x, y]
 * @param {number} radius - Circle radius
 * @param {string} attach - Direction: "n", "ne", "e", "se", "s", "sw", "w", "nw"
 * @returns {Array} Boundary point [x, y]
 */
function calculateCircleBoundaryPoint(center, radius, attach) {
  const angleMap = {
    'n': Math.PI / 2,
    'ne': Math.PI / 4,
    'e': 0,
    'se': -Math.PI / 4,
    's': -Math.PI / 2,
    'sw': -3 * Math.PI / 4,
    'w': Math.PI,
    'nw': 3 * Math.PI / 4
  }
  
  const angle = angleMap[attach] || 0
  const boundaryX = center[0] + radius * Math.cos(angle)
  const boundaryY = center[1] + radius * Math.sin(angle)
  
  return [boundaryX, boundaryY]
}

function Circle({ 
  center = [0, 0],
  keyframes = {},
  stepIndex = 0,
  startFrame = null,
  endFrame = null,
  color = colors.blue,
  fillOpacity = 0.1,
  strokeOpacity = 0.5,
  weight = 2,
  strokeStyle = "solid",
  showCenterPoint = true,
  centerPointColor = null,
  // Label props
  labelContext = null,      // Function: (center, radius) => string
  labelAttach = "ne",
  labelAttachDistance = 30,
  labelSize = 14,
  labelColor = null,
  labelOpacity = 1,
  labelAtCenter = false,    // When true, positions label at center point instead of circle boundary
  animationThresholdMultiplier = 1,
  radiusScale = 1
}) {
  // Use the same frame-based opacity logic as Point.jsx (on top of existing opacity handling)
  const currentOpacity = useFrameBasedOpacity(startFrame, endFrame, stepIndex)

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
  const animatedProps = useKeyframeAnimation(enhancedKeyframes, stepIndex,{ threshold: ANIMATION_THRESHOLD * animationThresholdMultiplier })
  
  // Extract animated properties with defaults
  const radius = (animatedProps.radius ?? 0) * radiusScale
  const opacity = (animatedProps.opacity ?? 1) * currentOpacity
  
  // Don't render if radius is 0 or negative
  if (radius <= 0) {
    return null
  }

  // Calculate label position if labelContext is provided
  let labelPosition = null
  if (labelContext && radius > 0) {
    if (labelAtCenter) {
      // Position label at the center point
      labelPosition = center
    } else {
      // Position label at the circle boundary (existing behavior)
      labelPosition = calculateCircleBoundaryPoint(center, radius, labelAttach)
    }
  }

  return (
    <>
      <MafsCircle
        center={center}
        radius={radius}
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
          opacity={opacity * labelOpacity}
        />
      )}
    </>
  )
}

export default Circle 