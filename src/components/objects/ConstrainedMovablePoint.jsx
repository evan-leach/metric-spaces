import React, { useMemo, forwardRef, useImperativeHandle, useEffect } from 'react'
import { useMovablePoint } from 'mafs'
import { useFrameBasedOpacity } from '../../hooks/useFrameBasedOpacity'
import { useZoomInfo } from '../../hooks/useZoomInfo'
import Label from '../canvas/Label'
import { colors } from '../../config/colors'

/**
 * ConstrainedMovablePoint - A draggable point with zoom-aware constraints
 * 
 * @param {Function} constraintFunction - Radial constraint function: (angle) => maxRadius
 * @param {Array} center - Center point for constraint [x, y]
 * @param {number} marginPixels - Margin in screen pixels (automatically zoom-scaled)
 * @param {Array} initialPosition - Starting position [x, y]
 * @param {string} color - Point color
 * @param {number|null} startFrame - Animation start frame
 * @param {number|null} endFrame - Animation end frame 
 * @param {number} stepIndex - Current step for animation
 * @param {Function|null} labelContext - Label text function
 * @param {string} labelAttach - Label attachment direction
 * @param {number} labelAttachDistance - Label distance in pixels
 * @param {number} labelSize - Label font size
 * @param {string|null} labelColor - Label color (defaults to point color)
 * @param {Function|null} onPointChange - Callback when point position changes: (point) => void
 */
const ConstrainedMovablePoint = forwardRef(function ConstrainedMovablePoint({
  constraintFunction,
  center = [0, 0],
  marginPixels = 0,
  initialPosition = [0, 0],
  color = colors.red,
  startFrame = null,
  endFrame = null,
  stepIndex = 0,
  labelContext = null,
  labelAttach = "ne",
  labelAttachDistance = 30,
  labelSize = 14,
  labelColor = null,
  onPointChange = null
}, ref) {
  const { zoomLevel } = useZoomInfo()
  const currentOpacity = useFrameBasedOpacity(startFrame, endFrame, stepIndex)
  const coordinateMargin = marginPixels / zoomLevel
  
  const constraint = useMemo(() => {
    if (!constraintFunction) {
      return (position) => position
    }
    
    return (attemptedPosition) => {
      const [x, y] = attemptedPosition
      
      const angle = Math.atan2(y - center[1], x - center[0])
      const boundaryRadius = constraintFunction(angle)
      const attemptedDistance = Math.sqrt((x - center[0]) * (x - center[0]) + (y - center[1]) * (y - center[1]))
      const constrainedRadius = Math.max(0, boundaryRadius - coordinateMargin)
      
      if (attemptedDistance <= constrainedRadius) {
        return attemptedPosition
      }
      
      const constrainedX = center[0] + constrainedRadius * Math.cos(angle)
      const constrainedY = center[1] + constrainedRadius * Math.sin(angle)
      
      if (process.env.NODE_ENV === 'development') {
        console.log(`🚫 Point constrained with zoom-scaled margin:`)
        console.log(`   Attempted: ${attemptedDistance.toFixed(3)}, Max allowed: ${constrainedRadius.toFixed(3)}`)
        console.log(`   Boundary: ${boundaryRadius.toFixed(3)}, Margin: ${coordinateMargin.toFixed(3)} (${marginPixels}px @ zoom ${zoomLevel.toFixed(2)})`)
      }
      
      return [constrainedX, constrainedY]
    }
  }, [constraintFunction, center, coordinateMargin, zoomLevel, marginPixels])

  const draggablePoint = useMovablePoint(initialPosition, {
    color: color,
    constrain: constraint
  })
  
  const finalLabelColor = labelColor || color

  // Expose point position via ref for components that need access
  useImperativeHandle(ref, () => ({
    point: draggablePoint.point
  }), [draggablePoint.point])

  // Call onPointChange callback when point changes
  useEffect(() => {
    if (onPointChange) {
      onPointChange(draggablePoint.point)
    }
  }, [draggablePoint.point, onPointChange])

  if (currentOpacity <= 0) {
    return null
  }

  return (
    <g style={{ opacity: currentOpacity }}>
      {draggablePoint.element}
      
      {labelContext && (
        <Label
          labelContext={labelContext}
          labelContextArgs={[draggablePoint.point]}
          position={draggablePoint.point}
          attach={labelAttach}
          attachDistance={labelAttachDistance}
          size={labelSize}
          color={finalLabelColor}
          opacity={currentOpacity}
        />
      )}
    </g>
  )
})

export default ConstrainedMovablePoint 