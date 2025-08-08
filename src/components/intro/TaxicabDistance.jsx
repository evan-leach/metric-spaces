import React, { useState, useEffect } from 'react'
import { Line, useMovablePoint } from 'mafs'
import Label from '../canvas/Label'
import { colors } from '../../config/colors'

function TaxicabDistance({ 
  point1Center = [-2, 1],
  point2Center = [2, -1],
  pointColor = colors.red,
  lineColor = colors.gray,
  weight = 2,
  // Point label props
  point1Label = null,
  point2Label = null,
  showPointLabels = true,
  pointLabelSize = 14,
  pointLabelColor = null,
  point1LabelAttach = "ne",
  point2LabelAttach = "nw", 
  pointLabelAttachDistance = 30,
  // Distance label props
  showDistanceLabels = true,
  distanceLabelSize = 14,
  distanceLabelColor = null,
  horizontalLabelColor = null,
  verticalLabelColor = null,
  distanceLabelAttachDistance = 30,
  verticalLabelAttachDistance = 40,
  distanceScaleFactor = 0.8,
  opacity = 1,
  // Distance callback
  onDistancesChange = null,
  // Hide x point
  hidePoint1 = false
}) {
  // Create movable points (these hooks must be called unconditionally)
  const movablePoint1 = useMovablePoint(point1Center, { color: pointColor })
  const movablePoint2 = useMovablePoint(point2Center, { color: pointColor })
  
  // Calculate actual distances
  const [distances, setDistances] = useState({
    horizontal: 0,
    vertical: 0
  })
  
  useEffect(() => {
    const point1 = movablePoint1.point
    const point2 = movablePoint2.point
    
    const horizontalDistance = Math.abs(point2[0] - point1[0])
    const verticalDistance = Math.abs(point2[1] - point1[1])
    
    const newDistances = {
      horizontal: horizontalDistance,
      vertical: verticalDistance
    }
    
    setDistances(newDistances)
    
    // Call callback if provided
    if (onDistancesChange) {
      onDistancesChange(newDistances)
    }
  }, [movablePoint1.point, movablePoint2.point, onDistancesChange])
  
  // Calculate corner point for L-shape (horizontal then vertical)
  const cornerPoint = [movablePoint2.point[0], movablePoint1.point[1]]
  
  // Calculate midpoints for label positioning
  const horizontalMidpoint = [
    (movablePoint1.point[0] + cornerPoint[0]) / 2,
    (movablePoint1.point[1] + cornerPoint[1]) / 2
  ]
  const verticalMidpoint = [
    (cornerPoint[0] + movablePoint2.point[0]) / 2,
    (cornerPoint[1] + movablePoint2.point[1]) / 2
  ]
  
  // Use point color for labels if no specific color is provided
  const finalPointLabelColor = pointLabelColor || pointColor
  const finalDistanceLabelColor = distanceLabelColor || lineColor
  const finalHorizontalLabelColor = horizontalLabelColor || finalDistanceLabelColor
  const finalVerticalLabelColor = verticalLabelColor || finalDistanceLabelColor

  // Point label context functions
  const point1LabelContext = point1Label ? () => point1Label : null
  const point2LabelContext = point2Label ? () => point2Label : null
  
  // Distance label context functions (LaTeX formatted)
  const horizontalLabelContext = showDistanceLabels ? () => `$${(distances.horizontal / distanceScaleFactor).toFixed(2)}$` : null
  const verticalLabelContext = showDistanceLabels ? () => `$${(distances.vertical / distanceScaleFactor).toFixed(2)}$` : null

  // Don't render if invisible
  if (opacity <= 0) {
    return null
  }

  return (
    <g>
      {/* Horizontal line segment */}
      <Line.Segment
        point1={movablePoint1.point}
        point2={cornerPoint}
        color={lineColor}
        weight={weight}
        opacity={opacity}
        style="dashed"
      />

      {/* Vertical line segment */}
      <Line.Segment
        point1={cornerPoint}
        point2={movablePoint2.point}
        color={lineColor}
        weight={weight}
        opacity={opacity}
        style="dashed"
      />

      {/* Movable points rendered on top */}
      <g style={{ opacity: opacity }}>
        {!hidePoint1 && movablePoint1.element}
        {movablePoint2.element}
      </g>
      
      {/* Point 1 label */}
      {showPointLabels && !hidePoint1 && (
        <Label
          labelContext={point1LabelContext}
          labelContextArgs={[]}
          position={movablePoint1.point}
          attach={point1LabelAttach}
          attachDistance={pointLabelAttachDistance}
          size={pointLabelSize}
          color={finalPointLabelColor}
          opacity={opacity}
        />
      )}
      
      {/* Point 2 label */}
      {showPointLabels && (
        <Label
          labelContext={point2LabelContext}
          labelContextArgs={[]}
          position={movablePoint2.point}
          attach={point2LabelAttach}
          attachDistance={pointLabelAttachDistance}
          size={pointLabelSize}
          color={finalPointLabelColor}
          opacity={opacity}
        />
      )}
      
      {/* Horizontal distance label (above) */}
      <Label
        labelContext={horizontalLabelContext}
        labelContextArgs={[]}
        position={horizontalMidpoint}
        attach="n"
        attachDistance={distanceLabelAttachDistance}
        size={distanceLabelSize}
        color={finalHorizontalLabelColor}
        opacity={opacity}
      />
      
      {/* Vertical distance label (to the right) */}
      <Label
        labelContext={verticalLabelContext}
        labelContextArgs={[]}
        position={verticalMidpoint}
        attach="e"
        attachDistance={verticalLabelAttachDistance}
        size={distanceLabelSize}
        color={finalVerticalLabelColor}
        opacity={opacity}
      />
    </g>
  )
}

export default TaxicabDistance 