import React, { useMemo } from 'react'
import Point from './Point'
import Label from '../canvas/Label'
import { useFrameBasedOpacity } from '../../hooks/useFrameBasedOpacity'
import { colors } from '../../config/colors'

/**
 * PointSequence component - displays a sequence of points along a parametric curve
 * with exponential density approaching a limit at t=0
 */
function PointSequence({
  curve,  // parametric function (t) => [x, y]
  cutoff = 100,  // maximum n for t = k^n
  k = 0.8,  // exponential parameter (0 < k < 1)
  pointColor = colors.blue,
  startFrame = null,
  endFrame = null,
  stepIndex = 0,
  // Label props for the n=1 point
  labelContext = null,      // Function: (coords, t, n) => string
  labelAttach = "ne",
  labelAttachDistance = 30,
  labelSize = 14,
  labelColor = null,
  labelPointIndex = 1,
  shift = 1
}) {
  // Generate sequence of t values: k^1, k^2, k^3, ... up to cutoff
  const sequenceData = useMemo(() => {
    const points = []
    
    for (let n = 1; n <= cutoff; n++) {
      const t = Math.pow(k, n)  // t = k^n
      const position = curve(Math.pow(k, n + shift))
      
      points.push({
        t,
        position,
        sequenceIndex: n
      })
    }
    
    return points
  }, [curve, cutoff, k])

  // Use frame-based opacity for the overall sequence animation
  const opacity = useFrameBasedOpacity(startFrame, endFrame, stepIndex)
  
  // Use point color for label if no specific label color is provided
  const finalLabelColor = labelColor || pointColor

  return (
    <g>
      {sequenceData.map((point, index) => {
        const t = point.t
        const pointOpacity = Math.max(0, Math.min((opacity + t - 1) / t, 1))
        const isLabelPoint = point.sequenceIndex === labelPointIndex
        
        return (
          <g key={index}>
            <Point
              center={point.position}
              color={pointColor}
              stepIndex={stepIndex}
              opacity={pointOpacity}
            />
            
            {/* Label only for the first point (n=1) */}
            {isLabelPoint && (
              <Label
                labelContext={labelContext}
                labelContextArgs={[point.position, point.t, point.sequenceIndex]}
                position={point.position}
                attach={labelAttach}
                attachDistance={labelAttachDistance}
                size={labelSize}
                color={finalLabelColor}
                opacity={pointOpacity}
              />
            )}
          </g>
        )
      })}
    </g>
  )
}

export default PointSequence 