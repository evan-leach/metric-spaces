import React, { useState, useEffect } from 'react'
import { Line, useMovablePoint } from 'mafs'
import { useFrameBasedOpacity } from '../../hooks/useFrameBasedOpacity'
import Label from '../canvas/Label'
import { colors } from '../../config/colors'

function TriangleInequality({ 
  // Point positions
  pointX = [-2, 1],
  pointY = [1, 2],
  pointZ = [2, -1],
  
  // Point labels
  pointXLabel = "$x$",
  pointYLabel = "$y$",
  pointZLabel = "$z$",
  
  // Colors
  pointColor = colors.red,
  lineColor = colors.gray,
  highlightColor = colors.gray,
  weight = 2,
  
  // Distance labels
  showDistanceLabels = true,
  distanceLabelSize = 14,
  distanceLabelColor = null,
  distanceLabelAttachDistance = 75,
  
  // Point label configuration
  pointLabelSize = 14,
  pointLabelColor = null,
  pointLabelAttachDistance = 30,
  
  // Highlighting
  highlightSide = "xz", // Which side to highlight: "xy", "yz", or "xz"
  
  // Animation
  startFrame = null,
  endFrame = null,
  stepIndex = 0,
  
  // Distance scaling
  distanceScaleFactor = 0.8,
  
  // Distance callback
  onDistancesChange = null
}) {
  // Use frame-based opacity for the entire component
  const currentOpacity = useFrameBasedOpacity(startFrame, endFrame, stepIndex)
  
  // Create movable points (these hooks must be called unconditionally)
  const movablePointX = useMovablePoint(pointX, { color: pointColor })
  const movablePointY = useMovablePoint(pointY, { color: pointColor })
  const movablePointZ = useMovablePoint(pointZ, { color: pointColor })
  
  // Calculate actual distances between the three points
  const [distances, setDistances] = useState({
    xy: 0,
    yz: 0,
    xz: 0
  })
  
  // Calculate midpoints for label positioning
  const [midpoints, setMidpoints] = useState({
    xy: [0, 0],
    yz: [0, 0],
    xz: [0, 0]
  })
  
  useEffect(() => {
    const pointXCoord = movablePointX.point
    const pointYCoord = movablePointY.point
    const pointZCoord = movablePointZ.point
    
    // Calculate distances
    const distanceXY = Math.sqrt(
      Math.pow(pointYCoord[0] - pointXCoord[0], 2) + Math.pow(pointYCoord[1] - pointXCoord[1], 2)
    )
    const distanceYZ = Math.sqrt(
      Math.pow(pointZCoord[0] - pointYCoord[0], 2) + Math.pow(pointZCoord[1] - pointYCoord[1], 2)
    )
    const distanceXZ = Math.sqrt(
      Math.pow(pointZCoord[0] - pointXCoord[0], 2) + Math.pow(pointZCoord[1] - pointXCoord[1], 2)
    )
    
    const newDistances = {
      xy: distanceXY,
      yz: distanceYZ,
      xz: distanceXZ
    }
    
    setDistances(newDistances)
    
    // Call callback if provided
    if (onDistancesChange) {
      onDistancesChange(newDistances)
    }
    
    // Calculate midpoints
    setMidpoints({
      xy: [(pointXCoord[0] + pointYCoord[0]) / 2, (pointXCoord[1] + pointYCoord[1]) / 2],
      yz: [(pointYCoord[0] + pointZCoord[0]) / 2, (pointYCoord[1] + pointZCoord[1]) / 2],
      xz: [(pointXCoord[0] + pointZCoord[0]) / 2, (pointXCoord[1] + pointZCoord[1]) / 2]
    })
  }, [movablePointX.point, movablePointY.point, movablePointZ.point, onDistancesChange])
  
  // Color configuration for each side
  const getSideColor = (side) => {
    return side === highlightSide ? highlightColor : lineColor
  }
  
  // Distance label formatters
  const xyLabelFormat = (distance) => `$d(x,y) = ${distance.toFixed(2)}$`
  const yzLabelFormat = (distance) => `$d(y,z) = ${distance.toFixed(2)}$`
  const xzLabelFormat = (distance) => `$d(x,z) = ${distance.toFixed(2)}$`
  
  // Final colors
  const finalPointLabelColor = pointLabelColor || pointColor
  const finalDistanceLabelColor = distanceLabelColor || lineColor
  
  // Don't render if invisible
  if (currentOpacity <= 0) {
    return null
  }

  return (
    <g style={{ opacity: currentOpacity }}>
      {/* Line XY */}
      <Line.Segment
        point1={movablePointX.point}
        point2={movablePointY.point}
        color={getSideColor("xy")}
        weight={weight}
        style="dashed"
      />
      
      {/* Line YZ */}
      <Line.Segment
        point1={movablePointY.point}
        point2={movablePointZ.point}
        color={getSideColor("yz")}
        weight={weight}
        style="dashed"
      />
      
      {/* Line XZ */}
      <Line.Segment
        point1={movablePointX.point}
        point2={movablePointZ.point}
        color={getSideColor("xz")}
        weight={weight}
        style="dashed"
      />
      
      {/* Movable points */}
      {movablePointX.element}
      {movablePointY.element}
      {movablePointZ.element}
      
      {/* Point X label */}
      <Label
        labelContext={() => pointXLabel}
        labelContextArgs={[]}
        position={movablePointX.point}
        attach="sw"
        attachDistance={pointLabelAttachDistance}
        size={pointLabelSize}
        color={finalPointLabelColor}
        opacity={currentOpacity}
      />
      
      {/* Point Y label */}
      <Label
        labelContext={() => pointYLabel}
        labelContextArgs={[]}
        position={movablePointY.point}
        attach="n"
        attachDistance={pointLabelAttachDistance}
        size={pointLabelSize}
        color={finalPointLabelColor}
        opacity={currentOpacity}
      />
      
      {/* Point Z label */}
      <Label
        labelContext={() => pointZLabel}
        labelContextArgs={[]}
        position={movablePointZ.point}
        attach="se"
        attachDistance={pointLabelAttachDistance}
        size={pointLabelSize}
        color={finalPointLabelColor}
        opacity={currentOpacity}
      />
      
      {/* Distance labels */}
      {showDistanceLabels && (
        <>
          {/* XY distance label */}
          <Label
            labelContext={() => xyLabelFormat(distances.xy / distanceScaleFactor)}
            labelContextArgs={[]}
            position={midpoints.xy}
            attach="nw"
            attachDistance={distanceLabelAttachDistance}
            size={distanceLabelSize}
            color={finalDistanceLabelColor}
            opacity={currentOpacity}
          />
          
          {/* YZ distance label */}
          <Label
            labelContext={() => yzLabelFormat(distances.yz / distanceScaleFactor)}
            labelContextArgs={[]}
            position={midpoints.yz}
            attach="ne"
            attachDistance={distanceLabelAttachDistance}
            size={distanceLabelSize}
            color={finalDistanceLabelColor}
            opacity={currentOpacity}
          />
          
          {/* XZ distance label */}
          <Label
            labelContext={() => xzLabelFormat(distances.xz / distanceScaleFactor)}
            labelContextArgs={[]}
            position={midpoints.xz}
            attach="s"
            attachDistance={distanceLabelAttachDistance}
            size={distanceLabelSize}
            color={finalDistanceLabelColor}
            opacity={currentOpacity}
          />
        </>
      )}
    </g>
  )
}

export default TriangleInequality 