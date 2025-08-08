import React, { useMemo, useEffect } from 'react'
import { Circle } from 'mafs'
import BaseScene from '../../components/BaseScene'
import Blob, { createDistanceToBoundaryFunction, createInsideBlobFunction, generateHarmonics, createBlobRadiusFunction } from '../../components/objects/Blob'
import InteriorPoint from '../../components/objects/InteriorPoint'
import ZoomInvariantCircle from '../../components/objects/ZoomInvariantCircle'
import { useKeyframeAnimation } from '../../hooks/useKeyframeAnimation'
import { useZoomInfo } from '../../hooks/useZoomInfo'
import { colors } from '../../config/colors'

// Console Logger Component for Zoom Info
function ZoomLogger({ stepIndex, blobSize, interiorPoint }) {
  const zoomInfo = useZoomInfo()
  
  useEffect(() => {
    console.log('🔍 ===== ZOOM & TRANSFORM INFO =====')
    console.log('Zoom Level:', zoomInfo.zoomLevel.toFixed(3))
    console.log('Pixels Per Square:', zoomInfo.pixelsPerSquare.toFixed(3))
    console.log('Scale X:', zoomInfo.scaleX.toFixed(3))
    console.log('Scale Y:', zoomInfo.scaleY.toFixed(3))
    console.log('Transform Matrix:', zoomInfo.viewTransform.map(val => val.toFixed(3)))
    console.log('--- Scene Info ---')
    console.log('Step Index:', stepIndex)
    console.log('Blob Size:', blobSize.toFixed(3))
    if (interiorPoint && interiorPoint.point) {
      console.log('Point Position:', `[${interiorPoint.point[0].toFixed(2)}, ${interiorPoint.point[1].toFixed(2)}]`)
    }
    console.log('=====================================')
  }, [zoomInfo, stepIndex, blobSize, interiorPoint])
  
  return null // Don't render anything
}

// Scene configuration - exported for App.jsx to use
export const SceneConfig = {
  steps: [
    "TOP: This is a *top-only* text overlay! Notice how it only covers the top portion of the screen and fades to transparency.",
    "TOP: Now we have a much longer section, with the equations $$y \\in B_r(x) \\text{ for some } r > 0$$ and $$x = \\frac{-b \\pm \\sqrt{b^2 - 4ac}}{2a}\\text{.}$$",
    "A point $x$ is an *interior point* of set $S$ if there exists $\\epsilon > 0$ such that $$B_\\epsilon(x) \\subset S$$",
    "A point $x$ is an *exterior point* of set $S$ if there exists $\\epsilon > 0$ such that $$B_\\epsilon(x) \\subset S^c$$",
    "#",
    "#",
    "#",
    "#"
  ]
}

function Scene({ 
  windowSize, 
  stepIndex, 
  isPanelOpen,
  sceneKey 
}) {
  // Define keyframes for blob size animation
  const blobKeyframes = useMemo(() => ({
    size: {
      0: 0.8,
      1: 1.15,
      2: 1.5,
      3: 1.85,
      4: 2.2,
      5: 2.55,
      6: 2.9,
      7: 3.25,
      8: 3.6
    }
  }), [])

  // Use keyframe animation hook for blob size
  const animatedProps = useKeyframeAnimation(blobKeyframes, stepIndex)
  const blobSize = animatedProps.size ?? 0.8

  // Generate blob harmonics with a moderate scale and fixed seed for consistency
  const blobHarmonics = generateHarmonics(0.6, 123, blobSize)

  // Create blob utility functions
  const getBlobRadius = createBlobRadiusFunction(blobSize, blobHarmonics)

  return (
    <BaseScene
      config={SceneConfig}
      sceneKey={sceneKey}
      stepIndex={stepIndex}
      isPanelOpen={isPanelOpen}
      windowSize={windowSize}
    >
      {/* Custom filled parametric blob with dashed outline */}
      <Blob
        size={blobSize}
        harmonicsConfig={{ scale: 0.6, seed: 123 }}
        color={colors.blue}
        style="dashed"
        stepIndex={stepIndex}
      />
      
      {/* Interior Point with adaptive neighborhood circle */}
      <InteriorPoint
        constraintFunction={getBlobRadius}
        marginPixels={5}
        initialPosition={[0, 0]}
        pointColor={colors.pink}
        stepIndex={stepIndex}
        blobSize={blobSize}
        blobHarmonics={blobHarmonics}
      />
      
      {/* Zoom-Invariant Circle - maintains constant screen size */}
      <ZoomInvariantCircle 
        center={[4, 3]} 
        constantScreenRadius={30} 
        color={colors.orange} 
      />
      
      {/* Console Logger for Zoom Info */}
      <ZoomLogger 
        stepIndex={stepIndex}
        blobSize={blobSize}
        interiorPoint={null}
      />
    </BaseScene>
  )
}

export default Scene 