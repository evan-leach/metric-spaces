import React from 'react'
import ZoomController from './canvas/ZoomController'
import Grid from './canvas/Grid'
import TextOverlay from './text/TextOverlay'
import TitleOverlay from './text/TitleOverlay'
import { getSceneTitleInfo } from '../utils/sceneConfig'

// Default configuration values
const DEFAULT_CONFIG = {
  viewBox: { x: [-6, 6], y: [-5, 5] },
  zoom: { min: 0.2, max: 1000 }
}

function BaseScene({
  config,
  sceneKey,
  stepIndex,
  isPanelOpen,
  windowSize,
  titleContent = null,
  children
}) {
  // Merge config with defaults and calculate numSteps
  const finalConfig = {
    ...DEFAULT_CONFIG,
    ...config,
    numSteps: config.steps ? config.steps.length + 1 : 1 // +1 for step 0 title
  }

  // Get text content from steps array
  const parsedTextContent = React.useMemo(() => {
    // Step 0 is always title, no text content
    if (stepIndex === 0) return null
    
    // Get text from steps array (stepIndex 1 = steps[0])
    const steps = config.steps || []
    const stepText = steps[stepIndex - 1]
    
    if (!stepText) return null
    
    // Check for comment (starts with #)
    if (stepText.startsWith('#')) return null
    
    // Check for empty string
    if (stepText.trim() === '') return null
    
    // Parse for TOP: control sequence
    if (stepText.startsWith('TOP:')) {
      return {
        text: stepText.slice(4).trim(), // Remove "TOP:" and trim whitespace
        topOnly: true
      }
    } else {
      return {
        text: stepText,
        topOnly: false
      }
    }
  }, [stepIndex, config.steps])

  // Get title information if not provided
  const defaultTitleInfo = getSceneTitleInfo(sceneKey)
  const finalTitleContent = titleContent || defaultTitleInfo

  // Determine overlay visibility
  const shouldShowText = parsedTextContent !== null
  const shouldShowTitle = stepIndex === 0 && finalTitleContent !== null

  return (
    <div style={{
      marginLeft: isPanelOpen ? '300px' : '0',
      transition: 'margin-left 0.3s ease-in-out',
      height: '100vh'
    }}>
      <ZoomController
        width="auto"
        height={windowSize.height}
        viewBox={finalConfig.viewBox}
        zoom={finalConfig.zoom}
        pan={true}
        zoomSensitivity={0.2}
      >
        {/* Light background grid */}
        <Grid 
          windowSize={windowSize}
          isPanelOpen={isPanelOpen}
          viewBox={finalConfig.viewBox}
          zoomLimits={finalConfig.zoom}
        />
        
        {/* Scene-specific content */}
        {children}
      </ZoomController>

      {/* Text overlay */}
      <TextOverlay 
        text={parsedTextContent?.text}
        isVisible={shouldShowText}
        enableLaTeX={true}
        topOnly={parsedTextContent?.topOnly || false}
      />

      {/* Title overlay */}
      <TitleOverlay
        sectionTitle={finalTitleContent?.sectionTitle}
        sceneTitle={finalTitleContent?.sceneTitle}
        isVisible={shouldShowTitle}
        isPanelOpen={isPanelOpen}
      />
    </div>
  )
}

export default BaseScene 