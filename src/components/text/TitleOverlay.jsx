import React, { useState, useEffect, useRef } from 'react'
import { useSidebarWidth } from '../../hooks/useSidebarWidth'
import { useWindowResize } from '../../hooks/useWindowResize'
import { OVERLAY_ANIMATION_DURATION } from '../../constants/animations'
import { useTextSizeMultiplier, useGoalSidebarWidth } from '../../constants/textSize'

// Debug toggle - set to false to hide debug panel
const DEBUG = false

function TitleOverlay({ 
  sectionTitle = "", 
  sceneTitle = "", 
  isVisible = false,
  isPanelOpen = false 
}) {
  const currentSidebarWidth = useSidebarWidth()
  const windowSize = useWindowResize()
  const textSizeMultiplier = useTextSizeMultiplier()
  const goalSidebarWidth = useGoalSidebarWidth()
  
  // Animation states
  const [shouldRender, setShouldRender] = useState(false)
  const [backgroundOpacity, setBackgroundOpacity] = useState(0)
  const [titleOpacity, setTitleOpacity] = useState(0)
  const [isFirstMount, setIsFirstMount] = useState(true)
  const timeoutRef = useRef(null)
  
  // Debug states for monitoring actual opacity
  const [actualBackgroundOpacity, setActualBackgroundOpacity] = useState(0)
  const [actualTitleOpacity, setActualTitleOpacity] = useState(0)
  const backgroundRef = useRef(null)
  const titleRef = useRef(null)

  // Clear timeout helper
  const clearCurrentTimeout = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
      timeoutRef.current = null
    }
  }

  // Monitor actual opacity for debugging
  useEffect(() => {
    let animationId
    
    const parseBackgroundOpacity = (element) => {
      if (!element) return 0
      const computedStyle = window.getComputedStyle(element)
      const backgroundColor = computedStyle.backgroundColor
      
      const rgbaMatch = backgroundColor.match(/rgba?\(([^)]+)\)/)
      if (rgbaMatch) {
        const values = rgbaMatch[1].split(',').map(v => v.trim())
        if (values.length >= 4) {
          return parseFloat(values[3])
        } else if (values.length === 3) {
          return 1
        }
      } else if (backgroundColor === 'transparent') {
        return 0
      }
      return 0
    }
    
    const parseTitleOpacity = (element) => {
      if (!element) return 0
      const computedStyle = window.getComputedStyle(element)
      return parseFloat(computedStyle.opacity)
    }
    
    const updateActualOpacities = () => {
      setActualBackgroundOpacity(parseBackgroundOpacity(backgroundRef.current))
      setActualTitleOpacity(parseTitleOpacity(titleRef.current))
      animationId = requestAnimationFrame(updateActualOpacities)
    }
    
    if (shouldRender) {
      updateActualOpacities()
    }
    
    return () => {
      if (animationId) {
        cancelAnimationFrame(animationId)
      }
    }
  }, [shouldRender])

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      clearCurrentTimeout()
    }
  }, [])

  // Animation logic - with instant appearance on first mount
  useEffect(() => {
    clearCurrentTimeout()

    if (!shouldRender && isVisible) {
      // Show: Different opacity handling for first mount vs returning
      setShouldRender(true)
      
      if (isFirstMount) {
        // First mount (scene change) - appear instantly with no opacity transition
        setBackgroundOpacity(1)
        setTitleOpacity(1)
        setIsFirstMount(false)
      } else {
        // Returning to step 0 - start at 0 and fade in
        setBackgroundOpacity(0)
        setTitleOpacity(0)
        
        timeoutRef.current = setTimeout(() => {
          setBackgroundOpacity(1)
          setTitleOpacity(1)
        }, 100)
      }
    }
    else if (shouldRender && !isVisible) {
      // Hide: Fade out, then stop rendering
      setBackgroundOpacity(0)
      setTitleOpacity(0)
      
      timeoutRef.current = setTimeout(() => {
        setShouldRender(false)
      }, OVERLAY_ANIMATION_DURATION)
    }
    else if (shouldRender && isVisible) {
      // Ensure visibility (handles interruptions)
      setBackgroundOpacity(1)
      setTitleOpacity(1)
    }

  }, [isVisible, shouldRender, isFirstMount])

  // Don't render if not visible
  if (!shouldRender) {
    return null
  }

     // Background style matching TextOverlay
   const backgroundStyle = {
     position: 'fixed',
     top: 0,
     left: `${currentSidebarWidth}px`,
     right: 0,
     bottom: 0,
     backgroundColor: `rgba(240, 240, 240, ${0.85 * backgroundOpacity})`,
     pointerEvents: 'auto',
     zIndex: 600,
     transition: `background-color ${OVERLAY_ANIMATION_DURATION}ms ease-in-out`
   }

   // Title container style
   const titleContainerStyle = {
     position: 'fixed',
     top: 0,
     left: `${currentSidebarWidth}px`,
     right: 0,
     bottom: 0,
     display: 'flex',
     flexDirection: 'column',
     justifyContent: 'center',
     alignItems: 'center',
     pointerEvents: 'none',
     zIndex: 601
   }

     // Calculate fixed textbox width (matches sidebar-open width regardless of sidebar state)
   const fixedTextboxWidth = Math.max(200, 0.8 * (windowSize.width - goalSidebarWidth))

     // Title content style
   const titleContentStyle = {
     textAlign: 'center',
     width: `${fixedTextboxWidth}px`,
     maxWidth: `${fixedTextboxWidth}px`,
     opacity: titleOpacity,
     transition: `opacity ${OVERLAY_ANIMATION_DURATION}ms ease-in-out`,
     pointerEvents: 'auto'
   }

   // Debug panel style
   const debugStyle = {
     position: 'absolute',
     top: '10px',
     right: '10px',
     background: 'rgba(0, 0, 0, 0.8)',
     color: 'white',
     padding: '8px 12px',
     fontSize: '12px',
     borderRadius: '4px',
     fontFamily: 'monospace',
     zIndex: 701,
     maxWidth: '300px',
     opacity: DEBUG ? 1 : 0,
     pointerEvents: DEBUG ? 'auto' : 'none',
     visibility: DEBUG ? 'visible' : 'hidden'
   }

  // Section title style (matching TextOverlay font)
  const sectionTitleStyle = {
    fontSize: `${1.5 * textSizeMultiplier}rem`,
    fontFamily: 'Open Sans, sans-serif',
    fontWeight: '300',
    color: '#000000',
    opacity: 0.7,
    marginBottom: '0.5rem',
    letterSpacing: '0.1em',
    textTransform: 'uppercase'
  }

  // Scene title style (matching TextOverlay font)
  const sceneTitleStyle = {
    fontSize: `${4 * textSizeMultiplier}rem`,
    fontFamily: 'Open Sans, sans-serif',
    fontWeight: '700',
    color: '#000000',
    lineHeight: '1.1',
    letterSpacing: '-0.02em'
  }

     return (
     <>
       {/* Background layer */}
       <div ref={backgroundRef} style={backgroundStyle} />
       
       {/* Title content layer */}
       <div style={titleContainerStyle}>
         <div ref={titleRef} style={titleContentStyle}>
           {/* Section title - small font above */}
           <div style={sectionTitleStyle}>
             {sectionTitle}
           </div>
           
           {/* Scene title - large font in the middle */}
           <div style={sceneTitleStyle}>
             {sceneTitle}
           </div>
         </div>
       </div>

       {/* Debug panel */}
       {shouldRender && (
         <div style={debugStyle}>
           <div>TitleOverlay Debug</div>
           <div>isVisible: {isVisible.toString()}</div>
           <div>shouldRender: {shouldRender.toString()}</div>
           <div>isFirstMount: {isFirstMount.toString()}</div>
           <div>--- BACKGROUND ---</div>
           <div>Goal: {backgroundOpacity.toFixed(3)}</div>
           <div>Actual: {actualBackgroundOpacity.toFixed(3)}</div>
           <div>--- TITLE ---</div>
           <div>Goal: {titleOpacity.toFixed(3)}</div>
           <div>Actual: {actualTitleOpacity.toFixed(3)}</div>
           <div>--- CONTENT ---</div>
           <div>Section: {sectionTitle}</div>
           <div>Scene: {sceneTitle}</div>
         </div>
       )}
     </>
   )
}

export default TitleOverlay 