import React from 'react'
import BooleanRegion from './BooleanRegion'
import { colors } from '../../config/colors'

function Intersection({
  shapes = [],
  color = colors.blue,
  fillOpacity = 0.3,
  strokeOpacity = 0.8,
  weight = 2,
  style = 'solid',
  minSamplingDepth = 12,
  maxSamplingDepth = 16,
  startFrame = null,
  endFrame = null,
  stepIndex = 0
}) {
  if (!shapes || shapes.length < 2) return null
  return (
    <BooleanRegion
      operation="intersection"
      shapes={shapes}
      color={color}
      fillOpacity={fillOpacity}
      strokeOpacity={strokeOpacity}
      weight={weight}
      style={style}
      minSamplingDepth={minSamplingDepth}
      maxSamplingDepth={maxSamplingDepth}
      startFrame={startFrame}
      endFrame={endFrame}
      stepIndex={stepIndex}
    />
  )
}

export default Intersection

