import React, { useMemo, useState } from 'react'
import { Circle } from 'mafs'
import ConstrainedMovablePoint from './ConstrainedMovablePoint'
import { createDistanceToBoundaryFunction, createInsideBlobFunction, generateHarmonics } from './Blob'
import { useFrameBasedOpacity } from '../../hooks/useFrameBasedOpacity'
import { useKeyframeAnimation } from '../../hooks/useKeyframeAnimation'
import { colors } from '../../config/colors'

/**
 * AvoidantPoint - A constrained draggable point with adaptive neighborhood circle
 */
function AvoidantPoint({
  constraintFunction,
  marginPixels = 0,
  initialPosition = [0, 0],
  
  pointColor = colors.red,
  
  startFrame = null,
  endFrame = null,
  stepIndex = 0,
  
  labelContext = null,
  labelAttach = "ne",
  labelAttachDistance = 30,
  labelSize = 14,
  labelColor = null,
  
  circleOpacity = 1,
  circleFillOpacity = 0.1,
  circleStrokeOpacity = 0.7,
  circleWeight = 2,
  circleStrokeStyle = "dashed",
  showCircle = true,
  enableSizeAnimation = true,
  
  distanceToBoundary = null,

  k = null,
  pointNumber = null,
  pointFunction = null,
  safetyFactor = 0.8,
  
  blobSize = null,
  blobHarmonics = null
}) {
  const [pointPosition, setPointPosition] = useState(initialPosition)
  const currentOpacity = useFrameBasedOpacity(startFrame, endFrame, stepIndex)
  
  const otherPoints = useMemo(() => {
    if (!pointFunction || !k || !pointNumber) return []
    return Array.from({ length: pointNumber }, (_, n) => pointFunction(Math.pow(k, n + 1)))
  }, [pointFunction, k, pointNumber])

  const sizeKeyframes = useMemo(() => {
    if (!enableSizeAnimation || startFrame === null) return {}
    
    const keyframes = { multiplier: {} }
    
    if (startFrame !== null) {
      keyframes.multiplier[startFrame - 1] = 0
      keyframes.multiplier[startFrame] = 1
    }
    
    if (endFrame !== null) {
      keyframes.multiplier[endFrame] = 1
      keyframes.multiplier[endFrame + 1] = 0
    }
    
    return keyframes
  }, [enableSizeAnimation, startFrame, endFrame])
  
  const animatedProps = useKeyframeAnimation(sizeKeyframes, stepIndex)
  const sizeMultiplier = animatedProps.multiplier ?? 1
  
  const minDistanceToPoints = useMemo(() => {
  if (otherPoints.length < 2) return Infinity
  const [px, py] = pointPosition

  let min1 = Infinity
  let min2 = Infinity

  for (const [qx, qy] of otherPoints) {
    const dx = px - qx
    const dy = py - qy
    const dist = dx * dx + dy * dy

    if (dist < min1) {
      min2 = min1
      min1 = dist
    } else if (dist < min2) {
      min2 = dist
    }
  }

  return Math.sqrt(min2)
}, [pointPosition, otherPoints])
  
  const circleRadius = useMemo(() => {
    if (!showCircle) return 0
    
    const safeRadius = minDistanceToPoints * safetyFactor
    
    return Math.max(0, safeRadius * sizeMultiplier)
  }, [minDistanceToPoints, safetyFactor, showCircle, sizeMultiplier])

  return (
    <>
      {showCircle && circleRadius > 0 && (
        <Circle
          center={pointPosition}
          radius={circleRadius}
          color={pointColor}
          fillOpacity={circleFillOpacity * circleOpacity * currentOpacity}
          strokeOpacity={circleStrokeOpacity * circleOpacity * currentOpacity}
          weight={circleWeight}
          strokeStyle={circleStrokeStyle}
        />
      )}
      
      <ConstrainedMovablePoint
        constraintFunction={constraintFunction}
        marginPixels={marginPixels}
        initialPosition={initialPosition}
        color={pointColor}
        startFrame={startFrame}
        endFrame={endFrame}
        stepIndex={stepIndex}
        labelContext={labelContext}
        labelAttach={labelAttach}
        labelAttachDistance={labelAttachDistance}
        labelSize={labelSize}
        labelColor={labelColor}
        onPointChange={setPointPosition}
      />
    </>
  )
}

export default AvoidantPoint 