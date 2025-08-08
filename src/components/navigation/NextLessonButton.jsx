import React, { useState, useEffect } from 'react'
import { colors } from '../../config/colors'
import { useFrameBasedOpacity } from '../../hooks/useFrameBasedOpacity'

function NextLessonButton({ 
  nextSceneText,
  onNext,
  isVisible = false,
  isPanelOpen = false,
  currentConfig = null,
  stepIndex = 0
}) {
  const [displayText, setDisplayText] = useState('')
  
  // Calculate the last step index for frame-based opacity
  const numSteps = currentConfig?.steps ? currentConfig.steps.length + 1 : 1
  const lastStepIndex = numSteps - 1
  
  // Use frame-based opacity for smooth fading - visible only on last step
  const frameOpacity = useFrameBasedOpacity(
    lastStepIndex, // startFrame - visible from last step
    null,          // endFrame - stays visible (no fade out to later steps)
    stepIndex      // current step
  )
  
  // Update display text with delay when nextSceneText changes
  useEffect(() => {
    if (nextSceneText) {
      const timer = setTimeout(() => {
        setDisplayText(nextSceneText)
      }, 500) // Delay text change by 500ms
      
      return () => clearTimeout(timer)
    } else {
      setDisplayText('')
    }
  }, [nextSceneText])
  
  // Calculate final opacity - trust frame-based animation, only check for nextSceneText
  const finalOpacity = nextSceneText ? frameOpacity * 0.8 : 0
  const showButton = finalOpacity > 0 && displayText
  
  // Always render the container, control visibility with opacity and pointer events
  return (
    <div style={{
      position: 'fixed',
      bottom: '120px',
      left: isPanelOpen ? 'calc(50% + 150px)' : '50%',
      transform: 'translateX(-50%)',
      transition: 'left 0.3s ease-in-out',
      opacity: finalOpacity,
      zIndex: 502, // Above TextOverlay (500-501)
      pointerEvents: showButton ? 'auto' : 'none'
    }}>
      {showButton && (
        <button
          onClick={onNext}
          style={{
            backgroundColor: colors.blue,
            color: 'white',
            border: 'none',
            padding: '20px 40px',
            borderRadius: '12px',
            fontSize: '20px',
            fontWeight: '600',
            cursor: 'pointer',
            boxShadow: `0 6px 20px rgba(0, 0, 0, 0.15)`,
            transition: 'all 0.2s ease',
            outline: 'none',
            minWidth: '240px'
          }}
          onMouseEnter={(e) => {
            e.target.style.backgroundColor = '#3a8fa3' // Darker version of colors.blue
            e.target.style.transform = 'translateY(-2px)'
            e.target.style.boxShadow = '0 8px 25px rgba(0, 0, 0, 0.2)'
          }}
          onMouseLeave={(e) => {
            e.target.style.backgroundColor = colors.blue
            e.target.style.transform = 'translateY(0px)'
            e.target.style.boxShadow = '0 6px 20px rgba(0, 0, 0, 0.15)'
          }}
        >
          Next: {displayText}
        </button>
      )}
    </div>
  )
}

export default NextLessonButton