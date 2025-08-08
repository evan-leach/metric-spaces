import React, { useMemo } from 'react'
import { useMovablePoint, Circle } from 'mafs'
import BaseScene from '../../components/BaseScene'
import Blob from '../../components/objects/Blob'
import { useKeyframeAnimation } from '../../hooks/useKeyframeAnimation'
import { colors } from '../../config/colors'

// Scene configuration - exported for App.jsx to use
export const SceneConfig = {
  steps: [
    "#",
    "#",
    "Here is some *example text.*",
    "Here is a Latex example! We can include equations like $a^2 + b^2 = c^2$ inline, or equations like $$\\int_a^b f'(x)\\, dx = f(b) - f(a)$$ in a block."
  ]
}

function Scene2({ 
  windowSize, 
  stepIndex,
  isPanelOpen,
  sceneKey 
}) {
  // Define different blob configurations with varying shapes using harmonicsConfig
  const blobConfigs = [
    {
      id: 'blob1',
      size: 1.5,
      harmonicsConfig: { scale: 0.7, seed: 100 },
      color: colors.red
    },
    {
      id: 'blob2',
      size: 1.8,
      harmonicsConfig: { scale: 0.5, seed: 200 },
      color: colors.blue
    },
    {
      id: 'blob3',
      size: 1.3,
      harmonicsConfig: { scale: 0.8, seed: 300 },
      color: colors.green
    },
    {
      id: 'blob4',
      size: 1.6,
      harmonicsConfig: { scale: 0.6, seed: 400 },
      color: colors.orange
    }
  ]

  // Define keyframes for blob position animations
  const positionKeyframes = useMemo(() => ({
    // Blob 1 keyframes
    blob1X: {
      0: -2.5,   // Square: top-left
      1: 0,      // Diamond: top
      2: -4.5,   // Line: far left
      3: 0       // Circular: top
    },
    blob1Y: {
      0: 2.5,    // Square: top-left
      1: 3.5,    // Diamond: top
      2: 0,      // Line: far left
      3: 3.0     // Circular: top
    },
    
    // Blob 2 keyframes
    blob2X: {
      0: 2.5,    // Square: top-right
      1: 3.5,    // Diamond: right
      2: -1.5,   // Line: left
      3: 3.0 * Math.cos(-Math.PI/6)  // Circular: bottom-right
    },
    blob2Y: {
      0: 2.5,    // Square: top-right
      1: 0,      // Diamond: right
      2: 0,      // Line: left
      3: 3.0 * Math.sin(-Math.PI/6)  // Circular: bottom-right
    },
    
    // Blob 3 keyframes
    blob3X: {
      0: -2.5,   // Square: bottom-left
      1: 0,      // Diamond: bottom
      2: 1.5,    // Line: right
      3: 3.0 * Math.cos(-5*Math.PI/6)  // Circular: bottom-left
    },
    blob3Y: {
      0: -2.5,   // Square: bottom-left
      1: -3.5,   // Diamond: bottom
      2: 0,      // Line: right
      3: 3.0 * Math.sin(-5*Math.PI/6)  // Circular: bottom-left
    },
    
    // Blob 4 keyframes
    blob4X: {
      0: 2.5,    // Square: bottom-right
      1: -3.5,   // Diamond: left
      2: 4.5,    // Line: far right
      3: 0       // Circular: bottom
    },
    blob4Y: {
      0: -2.5,   // Square: bottom-right
      1: 0,      // Diamond: left
      2: 0,      // Line: far right
      3: -3.0    // Circular: bottom
    }
  }), [])

  // Use keyframe animation hook for positions
  const animatedProps = useKeyframeAnimation(positionKeyframes, stepIndex)
  
  // Extract current positions for each blob
  const currentPositions = [
    { x: animatedProps.blob1X ?? -2.5, y: animatedProps.blob1Y ?? 2.5 },
    { x: animatedProps.blob2X ?? 2.5, y: animatedProps.blob2Y ?? 2.5 },
    { x: animatedProps.blob3X ?? -2.5, y: animatedProps.blob3Y ?? -2.5 },
    { x: animatedProps.blob4X ?? 2.5, y: animatedProps.blob4Y ?? -2.5 }
  ]

  // Define keyframes for movable point size and opacity animation
  const pointKeyframes = useMemo(() => ({
    pointSize: {
      1: 0,      // Invisible
      2: 0.5,    // Appears
      3: 1.0,    // Grows
      4: 1.5     // Continues growing
    },
    pointOpacity: {
      1: 0,      // Transparent
      2: 1,      // Fully opaque
    }
  }), [])

  // Use keyframe animation hook for point size and opacity
  const pointAnimatedProps = useKeyframeAnimation(pointKeyframes, stepIndex)
  const pointSize = pointAnimatedProps.pointSize ?? 0
  const pointOpacity = pointAnimatedProps.pointOpacity ?? 0

  // Create movable point
  const movablePoint = useMovablePoint([0, 0], {
    color: colors.pink
  })

  return (
    <BaseScene
      config={SceneConfig}
      sceneKey={sceneKey}
      stepIndex={stepIndex}
      isPanelOpen={isPanelOpen}
      windowSize={windowSize}
    >
      {/* Render all blobs with their current positions using the center parameter */}
      {blobConfigs.map((config, index) => {
        const position = currentPositions[index]
        
        return (
          <Blob
            key={config.id}
            size={config.size}
            center={[position.x, position.y]}
            harmonicsConfig={config.harmonicsConfig}
            color={config.color}
            fillOpacity={0.3}
            strokeOpacity={0.6}
            style="solid"
            stepIndex={stepIndex}
          />
        )
      })}

      {/* Animated movable point with size and opacity keyframes */}
      {(pointSize > 0 || pointOpacity > 0) && (
        <Circle
          center={movablePoint.point}
          radius={Math.max(pointSize, 0.1)} // Minimum size for visibility during fade
          color={colors.pink}
          fillOpacity={0.2 * pointOpacity}
          strokeOpacity={0.8 * pointOpacity}
          strokeStyle="solid"
        />
      )}
      
      {/* Render movable point element only when visible */}
      {(pointSize > 0 || pointOpacity > 0) && (
        <g style={{ opacity: pointOpacity }}>
          {movablePoint.element}
        </g>
      )}
    </BaseScene>
  )
}

export default Scene2 