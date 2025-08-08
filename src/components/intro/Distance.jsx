import React, { useState, useEffect } from 'react'
import { Line, useMovablePoint } from 'mafs'
import { useFrameBasedOpacity } from '../../hooks/useFrameBasedOpacity'
import Label from '../canvas/Label'
import { colors } from '../../config/colors'

function Distance({ 
  point1Center = [-2, 1],
  point2Center = [2, -1],
  pointColor = colors.red,
  lineColor = colors.gray,
  weight = 2,
  showLabel = false,
  labelAttach = "n",
  labelAttachDistance = 50,
  labelSize = 14,
  labelColor = null,
  // Point label props
  point1Label = null,
  point2Label = null,
  showPointLabels = true,
  pointLabelSize = 14,
  pointLabelColor = null,
  point1LabelAttach = "ne",
  point2LabelAttach = "nw", 
  pointLabelAttachDistance = 30,
  // Distance label formatting
  distanceLabelFormat = null, // Function to format distance label: (distance) => string
  startFrame = null,
  endFrame = null,
  stepIndex = 0,
  distanceScaleFactor = 0.8,
  noPoints = false
}) {
  // Use frame-based opacity for the entire distance object
  const currentOpacity = useFrameBasedOpacity(startFrame, endFrame, stepIndex)
  
  // Create movable points (these hooks must be called unconditionally)
  const movablePoint1 = useMovablePoint(point1Center, { color: pointColor })
  const movablePoint2 = useMovablePoint(point2Center, { color: pointColor })
  
  // Calculate actual distance between the two points
  const [actualDistance, setActualDistance] = useState(0)
  
  const point1Position = noPoints ? point1Center : movablePoint1.point
  const point2Position = noPoints ? point2Center : movablePoint2.point
  
  useEffect(() => {
    const distance = Math.sqrt(
      Math.pow(point2Position[0] - point1Position[0], 2) + Math.pow(point2Position[1] - point1Position[1], 2)
    )
    setActualDistance(distance)
  }, [point1Position, point2Position])
  
  // Calculate midpoint for label positioning
  const midpoint = [
    (point1Position[0] + point2Position[0]) / 2,
    (point1Position[1] + point2Position[1]) / 2
  ]
  
  // Use line color for label if no specific label color is provided
  const finalLabelColor = labelColor || lineColor
  const finalPointLabelColor = pointLabelColor || pointColor

  // Default distance label format function
  const defaultDistanceLabelFormat = (distance) => {
    return `Distance: ${distance.toFixed(2)}`
  }

  // Use custom format if provided, otherwise use default
  const finalDistanceLabelFormat = distanceLabelFormat || defaultDistanceLabelFormat

  // Point label context functions (simple wrappers for backward compatibility)
  const point1LabelContext = point1Label ? () => point1Label : null
  const point2LabelContext = point2Label ? () => point2Label : null
  
  // Distance label context function
  const distanceLabelContext = showLabel ? (distance) => finalDistanceLabelFormat(distance) : null

  // Don't render if invisible
  if (currentOpacity <= 0) {
    return null
  }

  return (
    <g>
      {/* Dashed line segment between the two points */}
      <Line.Segment
        point1={point1Position}
        point2={point2Position}
        color={lineColor}
        weight={weight}
        opacity={currentOpacity}
        style="dashed"
      />

      {!noPoints && (
        <g style={{ opacity: currentOpacity }}>
          {movablePoint1.element}
          {movablePoint2.element}
        </g>
      )}
      
      {!noPoints && showPointLabels && (
        <Label
          labelContext={point1LabelContext}
          labelContextArgs={[]}
          position={movablePoint1.point}
          attach={point1LabelAttach}
          attachDistance={pointLabelAttachDistance}
          size={pointLabelSize}
          color={finalPointLabelColor}
          opacity={currentOpacity}
        />
      )}
      
      {!noPoints && showPointLabels && (
        <Label
          labelContext={point2LabelContext}
          labelContextArgs={[]}
          position={movablePoint2.point}
          attach={point2LabelAttach}
          attachDistance={pointLabelAttachDistance}
          size={pointLabelSize}
          color={finalPointLabelColor}
          opacity={currentOpacity}
        />
      )}
      
      {/* Distance label at midpoint */}
      <Label
        labelContext={distanceLabelContext}
        labelContextArgs={[actualDistance / distanceScaleFactor]}
        position={midpoint}
        attach={labelAttach}
        attachDistance={labelAttachDistance}
        size={labelSize}
        color={finalLabelColor}
        opacity={currentOpacity}
      />
    </g>
  )
}

export default Distance 