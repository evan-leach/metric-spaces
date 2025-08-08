import React, { useEffect } from 'react'
import { Circle } from 'mafs'
import { useZoomInfo } from '../../hooks/useZoomInfo'
import { colors } from '../../config/colors'

/**
 * ZoomInvariantCircle - A circle that maintains constant screen size regardless of zoom level
 * 
 * @param {Array} center - Circle center position [x, y]
 * @param {number} constantScreenRadius - Target radius in screen pixels
 * @param {string} color - Circle color
 * @param {number} fillOpacity - Fill opacity (0-1)
 * @param {number} strokeOpacity - Stroke opacity (0-1)
 * @param {number} weight - Stroke width
 * @param {string} strokeStyle - Stroke style ("solid" or "dashed")
 * @param {boolean} showDebugInfo - Whether to log debug information
 */
function ZoomInvariantCircle({ 
  center = [4, 3], 
  constantScreenRadius = 30, 
  color = colors.orange,
  fillOpacity = 0.3,
  strokeOpacity = 0.8,
  weight = 2,
  strokeStyle = "solid",
  showDebugInfo = false
}) {
  const { zoomLevel } = useZoomInfo()
  
  // Calculate radius inversely proportional to zoom level
  // Higher zoom = smaller coordinate radius = same screen size
  const coordinateRadius = constantScreenRadius / zoomLevel
  
  useEffect(() => {
    if (showDebugInfo && process.env.NODE_ENV === 'development') {
      console.log('🎯 Zoom-Invariant Circle Info:')
      console.log('  Zoom Level:', zoomLevel.toFixed(3))
      console.log('  Target Screen Radius (px):', constantScreenRadius)
      console.log('  Coordinate Radius:', coordinateRadius.toFixed(3))
      console.log('  Screen Size Check:', (coordinateRadius * zoomLevel).toFixed(1), 'px')
    }
  }, [zoomLevel, constantScreenRadius, coordinateRadius, showDebugInfo])
  
  return (
    <Circle
      center={center}
      radius={coordinateRadius}
      color={color}
      fillOpacity={fillOpacity}
      strokeOpacity={strokeOpacity}
      weight={weight}
      strokeStyle={strokeStyle}
    />
  )
}

export default ZoomInvariantCircle 