import React, { useMemo } from 'react'
import { Plot } from 'mafs'
import FilledParametric from '../canvas/FilledParametric'
import Label from '../canvas/Label'
import { defaultHarmonics } from '../../utils/blobMath'
import { useFrameBasedOpacity } from '../../hooks/useFrameBasedOpacity'
import { colors } from '../../config/colors'

// Re-export utility functions for backward compatibility
export { 
  createBlobRadiusFunction, 
  createDistanceToBoundaryFunction, 
  createInsideBlobFunction 
} from '../../utils/blobMath'

/**
 * Simple seeded random number generator for consistent blob shapes
 * @param {number} seed - Random seed
 * @returns {Function} Function that returns random numbers between 0 and 1
 */
function createSeededRandom(seed) {
  let currentSeed = seed
  return function() {
    currentSeed = (currentSeed * 1103515245 + 12345) & 0x7fffffff
    return currentSeed / 0x7fffffff
  }
}

/**
 * Generate harmonics for blob shapes with size-aware roughness
 * @param {number} scale - How extreme the harmonics are (0 = circle, 1 = max oscillations)
 * @param {number} seed - Random seed for reproducible results
 * @param {number} size - The size/radius of the blob (for scaling harmonics appropriately)
 * @returns {Object} Harmonics object with 8 harmonics (first through eighth)
 */
export function generateHarmonics(scale = 0.5, seed = 42, size = 2.0) {
  const random = createSeededRandom(seed)
  
  // Maximum amplitude for large-scale shape variation
  const maxAmplitude = 0.6
  
  // 4 large scale frequencies (fixed for natural organic shapes)
  const largeScaleFreqs = [2, 3, 4, 5]
  
  // 4 small scale frequencies (proportional to blob size for consistent visual density)
  // Further reduced from [5,6,7,8] to [4,5,6,7] for even less roughness
  const smallScaleBaseFreqs = [4, 5, 6, 7]
  const smallScaleFreqs = smallScaleBaseFreqs.map(freq => Math.round(freq * size))
  
  // Combine all frequencies
  const frequencies = [...largeScaleFreqs, ...smallScaleFreqs]
  
  // Generate random phases for all harmonics
  const phases = Array.from({ length: 8 }, () => random() * 2 * Math.PI)
  
  // Large scale amplitudes: proportional to blob size (for shape variation)
  const largeScaleAmplitude = maxAmplitude * scale
  const largeScaleAmplitudes = [
    random() * largeScaleAmplitude * 1.4,  // Dominant shape (freq 2)
    random() * largeScaleAmplitude * 1.2,  // Major shape (freq 3)
    random() * largeScaleAmplitude * 1.1,  // Moderate shape (freq 4)
    random() * largeScaleAmplitude * 1.0   // Minor shape (freq 5)
  ]
  
  // Small scale amplitudes: absolute (inversely scaled for consistent roughness)
  // Reduced amplitude multiplier from 0.5 to 0.3 for less oscillation
  const smallScaleAmplitude = 0.12 / size
  const smallScaleAmplitudes = Array.from({ length: 4 }, () => random() * smallScaleAmplitude * 0.3)
  
  // Combine all amplitudes
  const amplitudes = [...largeScaleAmplitudes, ...smallScaleAmplitudes]
  
  // Create harmonics object using loops
  const harmonics = {}
  const harmonicNames = ['first', 'second', 'third', 'fourth', 'fifth', 'sixth', 'seventh', 'eighth']
  
  for (let i = 0; i < 8; i++) {
    harmonics[harmonicNames[i]] = {
      amplitude: amplitudes[i],
      frequency: frequencies[i],
      phase: phases[i]
    }
  }
  
  return harmonics
}

function Blob({ 
  size = 2.0,
  center = [0, 0],
  harmonics = null,
  harmonicsConfig = { scale: 0.5, seed: 42 },
  color = colors.blue,
  fillOpacity = 0.4,
  strokeOpacity = 0.8,
  weight = 2,
  style = "solid",
  minSamplingDepth = 12,
  maxSamplingDepth = 16,
  startFrame = null,
  endFrame = null,
  stepIndex = 0,
  // Label props
  labelContext = null,      // Function: (center, size) => string
  labelAttach = "ne",
  labelAttachDistance = 30,
  labelSize = 14,
  labelColor = null,
  boundaryOnly = false // New prop for boundary-only rendering
}) {
  // Use the same frame-based opacity logic as Point.jsx
  const currentOpacity = useFrameBasedOpacity(startFrame, endFrame, stepIndex)
  
  // Generate harmonics internally using size and config
  const actualHarmonics = useMemo(() => {
    // Use provided harmonics if available (for backward compatibility)
    if (harmonics) {
      return harmonics
    }
    
    // Otherwise generate harmonics using config and size
    return generateHarmonics(harmonicsConfig.scale, harmonicsConfig.seed, size)
  }, [harmonics, harmonicsConfig.scale, harmonicsConfig.seed, size])

  // Create parametric equation for smooth blob boundary - memoized to prevent shakiness
  const blobXY = useMemo(() => {
    return (t) => {
      // t goes from 0 to 2π for a complete revolution
      const angle = t
      
      // Create organic variations using all 8 harmonics
      const baseRadius = size
      const harmonicNames = ['first', 'second', 'third', 'fourth', 'fifth', 'sixth', 'seventh', 'eighth']
      
      let radiusVariation = 0
      for (const name of harmonicNames) {
        if (actualHarmonics[name]) {
          radiusVariation += actualHarmonics[name].amplitude * Math.sin(actualHarmonics[name].frequency * angle + actualHarmonics[name].phase)
        }
      }
      
      const radius = baseRadius * (1 + radiusVariation)
      
      // Apply center offset
      const x = radius * Math.cos(angle) + center[0]
      const y = radius * Math.sin(angle) + center[1]
      
      return [x, y]
    }
  }, [size, center, actualHarmonics])

  // Helper function to convert attach direction to angle
  const attachDirectionToAngle = (attachDir) => {
    switch (attachDir) {
      case 'e': return 0
      case 'ne': return Math.PI / 4
      case 'n': return Math.PI / 2
      case 'nw': return 3 * Math.PI / 4
      case 'w': return Math.PI
      case 'sw': return 5 * Math.PI / 4
      case 's': return 3 * Math.PI / 2
      case 'se': return 7 * Math.PI / 4
      default: return Math.PI / 4  // Default to 'ne'
    }
  }

  // Calculate boundary position for label placement
  const boundaryPosition = useMemo(() => {
    if (!labelContext) {
      return center // No label, just return center
    }
    
    const angle = attachDirectionToAngle(labelAttach)
    return blobXY(angle)
  }, [labelContext, labelAttach, blobXY, center])
  
  // Use blob color for label if no specific label color is provided
  const finalLabelColor = labelColor || color

  return (
    <>
      {boundaryOnly ? (
        <Plot.Parametric
          domain={[0, 2 * Math.PI]}
          xy={blobXY}
          color={color}
          opacity={strokeOpacity * currentOpacity}
          weight={weight}
          style={style}
          minSamplingDepth={minSamplingDepth}
          maxSamplingDepth={maxSamplingDepth}
        />
      ) : (
        <FilledParametric
          domain={[0, 2 * Math.PI]}
          xy={blobXY}
          color={color}
          fillOpacity={fillOpacity * currentOpacity}
          strokeOpacity={strokeOpacity * currentOpacity}
          weight={weight}
          style={style}
          minSamplingDepth={minSamplingDepth}
          maxSamplingDepth={maxSamplingDepth}
        />
      )}
      
      {/* Label positioned outside the blob boundary */}
      <Label
        labelContext={labelContext}
        labelContextArgs={[center, size]}
        position={boundaryPosition}
        attach={labelAttach}
        attachDistance={labelAttachDistance}
        size={labelSize}
        color={finalLabelColor}
        opacity={currentOpacity}
      />
    </>
  )
}

export default Blob 