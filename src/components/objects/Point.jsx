import React, { forwardRef, useImperativeHandle } from 'react'
import { Point as MafsPoint, useMovablePoint } from 'mafs'
import { useFrameBasedOpacity } from '../../hooks/useFrameBasedOpacity'
import Label from '../canvas/Label'
import { colors } from '../../config/colors'

const Point = forwardRef(function Point({ 
  center = [0, 0],
  color = colors.red,
  startFrame = null,
  endFrame = null,
  stepIndex = 0,
  movable = false,
  opacity = null,  // manual opacity override
  // Label props
  labelContext = null,      // Function: (coords) => string
  labelAttach = "ne",
  labelAttachDistance = null,  // Will be set based on movable prop
  labelSize = 14,
  labelColor = null
}, ref) {
  const frameBasedOpacity = useFrameBasedOpacity(startFrame, endFrame, stepIndex)
  
  const currentOpacity = opacity !== null ? opacity : frameBasedOpacity
  
  // Set default labelAttachDistance based on whether point is movable
  const finalLabelAttachDistance = labelAttachDistance !== null ? labelAttachDistance : (movable ? 30 : 25)
  
  const movablePoint = useMovablePoint(center, { color })
  
  const actualPosition = movable ? movablePoint.point : center
  
  // Use point color for label if no specific label color is provided
  const finalLabelColor = labelColor || color
  
  useImperativeHandle(ref, () => ({
    currentOpacity,
    point: actualPosition
  }), [currentOpacity, actualPosition])
  
  if (movable) {
    return (
      <g>
        <g style={{ opacity: currentOpacity }}>
          {movablePoint.element}
        </g>
        
        <Label
          labelContext={labelContext}
          labelContextArgs={[actualPosition]}
          position={actualPosition}
          attach={labelAttach}
          attachDistance={finalLabelAttachDistance}
          size={labelSize}
          color={finalLabelColor}
          opacity={currentOpacity}
        />
      </g>
    )
  }
  
  return (
    <g>
      <MafsPoint
        x={center[0]}
        y={center[1]}
        color={color}
        opacity={currentOpacity}
      />
      
      <Label
        labelContext={labelContext}
        labelContextArgs={[actualPosition]}
        position={actualPosition}
        attach={labelAttach}
        attachDistance={finalLabelAttachDistance}
        size={labelSize}
        color={finalLabelColor}
        opacity={currentOpacity}
      />
    </g>
  )
})

export default Point 