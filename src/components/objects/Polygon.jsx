import React from 'react'
import { Polygon as MafsPolygon } from 'mafs'
import { useFrameBasedOpacity } from '../../hooks/useFrameBasedOpacity'
import { colors } from '../../config/colors'

/**
 * Polygon component - creates closed shapes from an array of points
 * Uses Mafs Polygon with frame-based opacity animation
 */
function Polygon({
  // Points definition
  points = [], // array of [x, y] coordinates: [[0,0], [1,0], [1,1], [0,1]]
  
  // Styling
  color = colors.blue,
  fillOpacity = 0.4,
  strokeOpacity = 0.8,
  weight = 2,
  strokeStyle = "solid", // "solid" or "dashed"
  
  // Frame-based visibility
  startFrame = null,
  endFrame = null,
  stepIndex = 0
}) {
  // Use frame-based opacity for visibility control (with slower animation like InequalityPlot)
  const currentOpacity = useFrameBasedOpacity(startFrame, endFrame, stepIndex, {
    speed: 0.05  // Slower animation (same as InequalityPlot)
  })
  
  // Don't render if invisible or no points
  if (currentOpacity <= 0 || !points || points.length < 3) {
    return null
  }
  
  // Calculate final opacities
  const finalFillOpacity = fillOpacity * currentOpacity
  const finalStrokeOpacity = strokeOpacity * currentOpacity
  
  return (
    <MafsPolygon
      points={points}
      color={color}
      fillOpacity={finalFillOpacity}
      strokeOpacity={finalStrokeOpacity}
      weight={weight}
      strokeStyle={strokeStyle}
    />
  )
}

export default Polygon
