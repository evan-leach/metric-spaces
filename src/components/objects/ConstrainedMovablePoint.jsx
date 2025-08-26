import React, { useMemo, forwardRef, useImperativeHandle, useEffect, useRef } from 'react'
import { useMovablePoint, Circle as MafsCircle } from 'mafs'
import { useFrameBasedOpacity } from '../../hooks/useFrameBasedOpacity'
import { useKeyframeAnimation } from '../../hooks/useKeyframeAnimation'
import { useZoomInfo } from '../../hooks/useZoomInfo'
import Label from '../canvas/Label'
import { colors } from '../../config/colors'

/**
 * ConstrainedMovablePoint - A draggable point with zoom-aware constraints and optional circle
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
 * 
 * Circle options (optional):
 * @param {boolean} showCircle - Whether to show a circle around the point
 * @param {number} circleRadius - Fixed radius for the circle (if not using keyframes)
 * @param {Object} circleKeyframes - Keyframe animations for circle (e.g., { radius: { 0: 0, 1: 1 } })
 * @param {number} circleFillOpacity - Circle fill opacity
 * @param {number} circleStrokeOpacity - Circle stroke opacity
 * @param {number} circleWeight - Circle stroke weight
 * @param {string} circleStrokeStyle - Circle stroke style ('solid' | 'dashed')
 * @param {Function|null} circleLabelContext - Circle label text function
 * @param {string} circleLabelAttach - Circle label attachment direction
 * @param {number} circleLabelAttachDistance - Circle label distance in pixels
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
  onPointChange = null,
  // Circle options
  showCircle = false,
  circleRadius = 1,
  circleKeyframes = {},
  circleFillOpacity = 0.1,
  circleStrokeOpacity = 0.6,
  circleWeight = 2,
  circleStrokeStyle = "solid",
  circleLabelContext = null,
  circleLabelAttach = "ne",
  circleLabelAttachDistance = 30
}, ref) {
  const { zoomLevel } = useZoomInfo()
  const currentOpacity = useFrameBasedOpacity(startFrame, endFrame, stepIndex)
  
  // Use ref for callback to avoid dependency issues
  const onPointChangeRef = useRef(onPointChange)
  onPointChangeRef.current = onPointChange
  
  // Circle animation logic (similar to InteriorPoint)
  const circleAnimationKeyframes = useMemo(() => {
    if (!showCircle || !circleKeyframes || Object.keys(circleKeyframes).length === 0) {
      return {}
    }
    
    // If keyframes are provided, use them directly
    return circleKeyframes
  }, [showCircle, circleKeyframes])
  
  // Use keyframe animation for circle properties
  const animatedCircleProps = useKeyframeAnimation(circleAnimationKeyframes, stepIndex)
  
  // Get current circle radius (from keyframes or fixed value)
  const currentCircleRadius = animatedCircleProps.radius ?? circleRadius
  
  // Use ref for constraint function to avoid recreation when function identity changes
  const constraintFunctionRef = useRef(constraintFunction)
  constraintFunctionRef.current = constraintFunction
  
  const constraint = useMemo(() => {
    if (!constraintFunctionRef.current) {
      return (position) => position
    }
    
    return (attemptedPosition) => {
      const [x, y] = attemptedPosition
      
      const angle = Math.atan2(y - center[1], x - center[0])
      const boundaryRadius = constraintFunctionRef.current(angle)
      const attemptedDistance = Math.sqrt((x - center[0]) * (x - center[0]) + (y - center[1]) * (y - center[1]))
      const coordinateMargin = marginPixels / zoomLevel // Calculate margin inside constraint function
      const constrainedRadius = Math.max(0, boundaryRadius - coordinateMargin)
      
      if (attemptedDistance <= constrainedRadius) {
        return attemptedPosition
      }
      
      const constrainedX = center[0] + constrainedRadius * Math.cos(angle)
      const constrainedY = center[1] + constrainedRadius * Math.sin(angle)
      
      return [constrainedX, constrainedY]
    }
  }, [center[0], center[1], marginPixels, zoomLevel])

  // Stabilize initialPosition to prevent recreation of useMovablePoint
  const stableInitialPosition = useMemo(() => initialPosition, [])
  
  const draggablePoint = useMovablePoint(stableInitialPosition, {
    color: color,
    constrain: constraint
  })
  
  const finalLabelColor = labelColor || color

  // Helper function to calculate circle boundary point for label positioning
  const calculateCircleBoundaryPoint = useMemo(() => {
    return (center, radius, attach) => {
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
  }, [])

  // Calculate circle label position if needed
  const circleLabelPosition = useMemo(() => {
    if (!showCircle || !circleLabelContext || currentCircleRadius <= 0) {
      return null
    }
    return calculateCircleBoundaryPoint(draggablePoint.point, currentCircleRadius, circleLabelAttach)
  }, [showCircle, circleLabelContext, currentCircleRadius, draggablePoint.point, circleLabelAttach, calculateCircleBoundaryPoint])

  // Expose point position via ref for components that need access
  useImperativeHandle(ref, () => ({
    point: draggablePoint.point
  }), [draggablePoint.point])

  // Call onPointChange callback when point changes (with stable dependency check)
  useEffect(() => {
    if (onPointChangeRef.current) {
      onPointChangeRef.current(draggablePoint.point)
    }
  }, [draggablePoint.point[0], draggablePoint.point[1]])

  if (currentOpacity <= 0) {
    return null
  }

  return (
    <g style={{ opacity: currentOpacity }}>
      {/* Render circle first (behind the point) */}
      {showCircle && currentCircleRadius > 0 && (
        <MafsCircle
          center={draggablePoint.point}
          radius={currentCircleRadius}
          color={color}
          fillOpacity={circleFillOpacity * currentOpacity}
          strokeOpacity={circleStrokeOpacity * currentOpacity}
          weight={circleWeight}
          strokeStyle={circleStrokeStyle}
        />
      )}
      
      {/* Render the draggable point */}
      {draggablePoint.element}
      
      {/* Point label */}
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
      
      {/* Circle label */}
      {circleLabelContext && circleLabelPosition && (
        <Label
          labelContext={circleLabelContext}
          labelContextArgs={[draggablePoint.point, currentCircleRadius]}
          position={circleLabelPosition}
          attach={circleLabelAttach}
          attachDistance={circleLabelAttachDistance}
          size={labelSize}
          color={color}
          opacity={currentOpacity}
        />
      )}
    </g>
  )
})

export default ConstrainedMovablePoint 