import React, { useMemo, forwardRef, useImperativeHandle, useEffect, useRef } from 'react'
import { useMovablePoint, Circle as MafsCircle } from 'mafs'
import { useFrameBasedOpacity } from '../../hooks/useFrameBasedOpacity'
import { useKeyframeAnimation } from '../../hooks/useKeyframeAnimation'
import { useZoomInfo } from '../../hooks/useZoomInfo'
import Label from '../canvas/Label'
import { colors } from '../../config/colors'

const LNLPoint = forwardRef(function LNLPoint({
  yMax,
  yMin,
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
  transitionFrame = 0,
  points = [],
  pointRadii = 2,
  finalSize = 1,
  safetyFactor = 0.8,
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
  const transitionKeyframes = useMemo(() => { 
    return {
      t: {
        [transitionFrame - 1]: 0,
        [transitionFrame]: 1
      }
    }
  }, [transitionFrame])

  const animatedCircleProps = useKeyframeAnimation(circleAnimationKeyframes, stepIndex)
  const interpolationProps = useKeyframeAnimation(transitionKeyframes, stepIndex)
  
  const constraint = useMemo(() => {
    
    return (attemptedPosition) => {
      const [x, y] = attemptedPosition

      const coordinateMargin = marginPixels / zoomLevel // Calculate margin inside constraint function
      const constrainedY = Math.min(Math.max(Math.min(y, yMax - coordinateMargin), yMin + coordinateMargin), yMax)
      
      return [x, constrainedY]
    }
  }, [marginPixels, zoomLevel, yMin, yMax])

  // Stabilize initialPosition to prevent recreation of useMovablePoint
  const stableInitialPosition = useMemo(() => initialPosition, [])
  
  const draggablePoint = useMovablePoint(stableInitialPosition, {
    color: color,
    constrain: constraint
  })

  const distanceToClosestPoint = useMemo(() => {
    if (!points || points.length === 0) return 1
    const [px, py] = draggablePoint.point
    let minDist = Infinity
    for (const [qx, qy] of points) {
      const dx = px - qx
      const dy = py - qy
      const d = dx * dx + dy * dy
      if (d < minDist) minDist = d
    }
    return Math.sqrt(minDist)
  }, [draggablePoint.point, points])

  const interp = interpolationProps.t ?? 1
  const factor = (1 - interp) * (pointRadii - distanceToClosestPoint) * safetyFactor + interp * finalSize
  const currentCircleRadius = (animatedCircleProps.radius ?? circleRadius) * factor
  
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

export default LNLPoint 