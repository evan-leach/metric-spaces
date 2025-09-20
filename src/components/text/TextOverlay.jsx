import React, { useState, useEffect, useRef } from 'react'
import { TextOverlayLaTeX } from '../canvas/LaTeXRenderer'
import { useWindowResize } from '../../hooks/useWindowResize'
import { useSidebarWidth } from '../../hooks/useSidebarWidth'
import { OVERLAY_ANIMATION_DURATION } from '../../constants/animations'
import { useGoalSidebarWidth, useTextSizeMultiplier, useVerticalMultiplier } from '../../constants/textSize'

// Debug toggle - set to false to hide debug panel
const DEBUG = false

function TextOverlay({ 
  text, 
  isVisible = false, 
  enableLaTeX = false,
  topOnly = false 
}) {
  // Get real-time window size and sidebar width
  const windowSize = useWindowResize()
  const currentSidebarWidth = useSidebarWidth()
  const textSizeMultiplier = useTextSizeMultiplier() * useVerticalMultiplier()
  const goalSidebarWidth = useGoalSidebarWidth()
  
  // Animation state for text only (unchanged behavior)
  const [currentText, setCurrentText] = useState(text)
  const [textTopOnly, setTextTopOnly] = useState(topOnly)
  const [textOpacity, setTextOpacity] = useState(0)
  const [shouldRender, setShouldRender] = useState(false)
  
  // Independent background states
  const [fullscreenBgOpacity, setFullscreenBgOpacity] = useState(0)
  const [topOnlyBgOpacity, setTopOnlyBgOpacity] = useState(0)
  
  const timeoutRef = useRef(null)
  const textRef = useRef(null)
  const fullscreenBgRef = useRef(null)
  const topOnlyBgRef = useRef(null)
  const measuringTextRef = useRef(null)
  const [actualOpacity, setActualOpacity] = useState(0)
  const [actualFullscreenBgOpacity, setActualFullscreenBgOpacity] = useState(0)
  const [actualTopOnlyBgOpacity, setActualTopOnlyBgOpacity] = useState(0)
  const [actualTopOnlyHeight, setActualTopOnlyHeight] = useState(0)
  const [topOnlyComputedHeight, setTopOnlyComputedHeight] = useState('auto')
  const [currentTextHeight, setCurrentTextHeight] = useState(0)
  const [targetGradientHeight, setTargetGradientHeight] = useState(0)
  const [measuringText, setMeasuringText] = useState(text)
  const [measuringTextHeight, setMeasuringTextHeight] = useState(0)

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
    
    const parseFullscreenOpacity = (element) => {
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
    
    const parseTopOnlyOpacity = (element) => {
      if (!element) return 0
      const computedStyle = window.getComputedStyle(element)
      return parseFloat(computedStyle.opacity)
    }
    
    const updateActualOpacities = () => {
      // Monitor text opacity and height
      if (textRef.current) {
        const computedStyle = window.getComputedStyle(textRef.current)
        const opacity = parseFloat(computedStyle.opacity)
        setActualOpacity(opacity)
        
        // Measure visible text height for debugging
        const textHeight = textRef.current.offsetHeight
        setCurrentTextHeight(textHeight)
      }
      
      // Measure target gradient height from measuring div (for early animation)
      if (measuringTextRef.current && measuringText) {
        const measuringHeight = measuringTextRef.current.offsetHeight
        setMeasuringTextHeight(measuringHeight)
        // Calculate optimal gradient height (measuring text height + 100px)
        const optimalGradientHeight = measuringHeight
        setTargetGradientHeight(optimalGradientHeight)
      } else if (!measuringText) {
        // Reset heights when no text
        setMeasuringTextHeight(0)
        setTargetGradientHeight(0)
      }
      
      // Monitor fullscreen background opacity
      setActualFullscreenBgOpacity(parseFullscreenOpacity(fullscreenBgRef.current))
      
      // Monitor topOnly background opacity and height
      setActualTopOnlyBgOpacity(parseTopOnlyOpacity(topOnlyBgRef.current))
      
      // Monitor topOnly background height
      if (topOnlyBgRef.current) {
        const height = topOnlyBgRef.current.offsetHeight
        setActualTopOnlyHeight(height)
        
        // Also monitor computed height style
        const computedStyle = window.getComputedStyle(topOnlyBgRef.current)
        setTopOnlyComputedHeight(computedStyle.height)
      }
      
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

  // Update measuring text immediately when prop changes (for early gradient animation)
  useEffect(() => {
    setMeasuringText(text || '')
  }, [text])

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      clearCurrentTimeout()
    }
  }, [])

  // Text animation logic (unchanged from original)
  useEffect(() => {
    clearCurrentTimeout()

    const targetVisible = isVisible && text
    const targetText = text || ''
    const targetTopOnly = topOnly

    if (!shouldRender && targetVisible) {
      // Show: Start rendering with opacity 0, then fade in text and backgrounds

      setShouldRender(true)
      setCurrentText(targetText)
      setTextTopOnly(targetTopOnly)
      setTextOpacity(0)
      
      // Reset background opacities to 0 when starting to render
      setFullscreenBgOpacity(0)
      setTopOnlyBgOpacity(0)
      
      // Use setTimeout to ensure elements are rendered with opacity 0 before fade in
      timeoutRef.current = setTimeout(() => {

        setTextOpacity(1)
        
        // Set background opacities to their goals (same timing as text)
        const fullscreenGoal = (targetTopOnly === false) ? 1 : 0
        const topOnlyGoal = (targetTopOnly === true) ? 1 : 0
        setFullscreenBgOpacity(fullscreenGoal)
        setTopOnlyBgOpacity(topOnlyGoal)
      }, 100)
    }
    else if (shouldRender && !targetVisible) {
      // Hide: Fade out text and backgrounds, then stop rendering

      setTextOpacity(0)
      setFullscreenBgOpacity(0)
      setTopOnlyBgOpacity(0)
      
      timeoutRef.current = setTimeout(() => {

        setShouldRender(false)
      }, OVERLAY_ANIMATION_DURATION)
    }
    else if (shouldRender && targetVisible && (currentText !== targetText || textTopOnly !== targetTopOnly)) {
      // Change text or position: Fade out text and old backgrounds, update, fade in new

      setTextOpacity(0)
      
      // If position is changing, fade out backgrounds immediately
      if (textTopOnly !== targetTopOnly) {

        setFullscreenBgOpacity(0)
        setTopOnlyBgOpacity(0)
      }
      
      timeoutRef.current = setTimeout(() => {

        setCurrentText(targetText)
        setTextTopOnly(targetTopOnly)
        
        // Update background opacities based on new position
        const fullscreenGoal = (targetTopOnly === false) ? 1 : 0
        const topOnlyGoal = (targetTopOnly === true) ? 1 : 0
        setFullscreenBgOpacity(fullscreenGoal)
        setTopOnlyBgOpacity(topOnlyGoal)
        
        requestAnimationFrame(() => {
          setTextOpacity(1)
        })
      }, OVERLAY_ANIMATION_DURATION)
    }
    else if (shouldRender && targetVisible && currentText === targetText && textTopOnly === targetTopOnly) {
      // Ensure visibility (handles interruptions)

      setTextOpacity(1)
      
      // Ensure background opacities match current state
      const fullscreenGoal = (textTopOnly === false) ? 1 : 0
      const topOnlyGoal = (textTopOnly === true) ? 1 : 0
      setFullscreenBgOpacity(fullscreenGoal)
      setTopOnlyBgOpacity(topOnlyGoal)
    }

  }, [text, isVisible, topOnly, currentText, textTopOnly, shouldRender])

  // Don't render if not visible or no text
  if (!shouldRender) {
    return null
  }

  // Background goals and visibility
  const fullscreenGoal = (textTopOnly === false && text && isVisible) ? 1 : 0
  const topOnlyGoal = (textTopOnly === true && text && isVisible) ? 1 : 0
  const fullscreenVisible = fullscreenGoal === 1
  const topOnlyVisible = topOnlyGoal === 1
  
  // Check if gradient height is animating
  const isGradientAnimating = Math.abs(actualTopOnlyHeight - targetGradientHeight) > 1

  // Fullscreen background style
  const fullscreenBgStyle = {
    position: 'fixed',
    top: 0,
    left: `${currentSidebarWidth}px`,
    right: 0,
    bottom: 0,
    height: '100vh',
    backgroundColor: `rgba(240, 240, 240, ${0.85 * fullscreenBgOpacity})`,
    pointerEvents: fullscreenVisible ? 'auto' : 'none', // Block clicks only when visible (fullscreen mode)
    zIndex: 500,
    transition: `background-color ${OVERLAY_ANIMATION_DURATION}ms ease-in-out`,
    // Prevent text selection on background container
    userSelect: 'none'
  }

  // TopOnly background style
  const topOnlyBgStyle = {
    position: 'fixed',
    top: 0,
    left: `${currentSidebarWidth}px`,
    right: 0,
    height: `${targetGradientHeight}px`,
    backgroundImage: `linear-gradient(to bottom, rgba(240, 240, 240, 0.85) 0%, rgba(240, 240, 240, 0.85) 50%, rgba(240, 240, 240, 0.75) 65%, rgba(240, 240, 240, 0.5) 80%, rgba(240, 240, 240, 0.2) 92%, rgba(240, 240, 240, 0) 100%)`,
    pointerEvents: 'none',
    paddingTop: '40px',
    paddingBottom: '60px',
    paddingLeft: '20px',
    paddingRight: '20px',
    opacity: topOnlyBgOpacity,
    zIndex: 500,
    transition: `opacity ${OVERLAY_ANIMATION_DURATION}ms ease-in-out, height ${OVERLAY_ANIMATION_DURATION * 2}ms ease-in-out`,
    // Prevent text selection on background container with all vendor prefixes
    userSelect: 'none',
    WebkitUserSelect: 'none',
    MozUserSelect: 'none',
    msUserSelect: 'none',
    WebkitTouchCallout: 'none',
    WebkitTapHighlightColor: 'transparent'
  }

  // Text container style (completely independent positioning)
  const textContainerStyle = {
    position: 'fixed',
    top: 0,
    left: `${currentSidebarWidth}px`,
    right: 0,
    bottom: textTopOnly ? 'auto' : 0,
    height: textTopOnly ? 'auto' : '100vh',
    display: 'flex',
    alignItems: textTopOnly ? 'flex-start' : 'center',
    justifyContent: 'center',
    paddingTop: textTopOnly ? `${40 * textSizeMultiplier * textSizeMultiplier}px` : '0',
    paddingLeft: '20px',
    paddingRight: '20px',
    pointerEvents: 'none',
    zIndex: 501,
    // Prevent text selection on container
    userSelect: 'none'
  }

  // Calculate fixed textbox width (matches sidebar-open width regardless of sidebar state)
  const fixedTextboxWidth = Math.max(200, 0.8 * (windowSize.width - goalSidebarWidth))

  const textStyle = {
    fontSize: `${24 * textSizeMultiplier}px`,
    fontFamily: 'Open Sans, sans-serif',
    fontWeight: '600',
    color: '#000000',
    textAlign: 'center',
    width: `${fixedTextboxWidth}px`,
    maxWidth: `${fixedTextboxWidth}px`,
    lineHeight: '1.4',
    padding: '20px',
    paddingBottom: textTopOnly ? '60px' : '20px',
    pointerEvents: 'auto', // Always allow text to block clicks
    opacity: textOpacity,
    transition: `opacity ${OVERLAY_ANIMATION_DURATION}ms ease-in-out`
  }

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
    zIndex: 501,
    maxWidth: '300px',
    // Prevent text selection on debug info
    userSelect: 'none'
  }

  return (
    <>
      {/* Fullscreen Background Layer */}
      {shouldRender && (
        <div ref={fullscreenBgRef} style={fullscreenBgStyle} />
      )}
      
      {/* TopOnly Background Layer */}
      {shouldRender && (
        <div ref={topOnlyBgRef} style={topOnlyBgStyle}>
          {/* Invisible content for proper height calculation */}
          <div style={{...textStyle, opacity: 0, pointerEvents: 'none', userSelect: 'none'}}>
            {enableLaTeX ? (
              <TextOverlayLaTeX content={currentText} />
            ) : (
              currentText
            )}
          </div>
        </div>
      )}
      
      {/* Invisible measuring div for early gradient animation */}
      {shouldRender && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: `${currentSidebarWidth}px`,
          right: 0,
          opacity: 0,
          pointerEvents: 'none',
          visibility: 'hidden',
          zIndex: -1,
          userSelect: 'none'
        }}>
          <div 
            ref={measuringTextRef} 
            style={{
              ...textStyle,
              opacity: 1, // Override opacity for measuring
              visibility: 'visible', // Override visibility for measuring
              userSelect: 'none' // Prevent selection on measuring text
            }}
          >
            {enableLaTeX ? (
              <TextOverlayLaTeX content={measuringText || ''} />
            ) : (
              measuringText || ''
            )}
          </div>
        </div>
      )}

      {/* Text Layer (visible text, unchanged behavior) */}
      {shouldRender && (
        <div style={textContainerStyle}>
          <div ref={textRef} style={{
            ...textStyle,
            pointerEvents: 'auto', // Override container's pointerEvents
            userSelect: 'text'
          }}>
            {enableLaTeX ? (
              <TextOverlayLaTeX content={currentText} />
            ) : (
              currentText
            )}
          </div>
        </div>
      )}
      
      {/* Debug info - always rendered but invisible when DEBUG=false */}
      {shouldRender && (
        <div style={{
          ...debugStyle,
          opacity: DEBUG ? 1 : 0,
          pointerEvents: DEBUG ? 'auto' : 'none',
          visibility: DEBUG ? 'visible' : 'hidden'
        }}>
          <div>isVisible: {isVisible.toString()}</div>
          <div>shouldRender: {shouldRender.toString()}</div>
          <div>textOpacity: {textOpacity}</div>
          <div>actualOpacity: {actualOpacity.toFixed(3)}</div>
          <div>--- FULLSCREEN BG ---</div>
          <div>Goal: {fullscreenGoal} (visible: {fullscreenVisible.toString()})</div>
          <div>Opacity: {fullscreenBgOpacity.toFixed(3)}</div>
          <div>Actual: {actualFullscreenBgOpacity.toFixed(3)}</div>
          <div>--- TOPONLY BG ---</div>
          <div>Goal: {topOnlyGoal} (visible: {topOnlyVisible.toString()})</div>
          <div>Opacity: {topOnlyBgOpacity.toFixed(3)}</div>
          <div>Actual: {actualTopOnlyBgOpacity.toFixed(3)}</div>
          <div>Height (current): {actualTopOnlyHeight}px</div>
          <div>Height (target): {targetGradientHeight}px</div>
          <div>Height (computed): {topOnlyComputedHeight}</div>
          <div>Height animating: {isGradientAnimating ? 'YES' : 'NO'}</div>
          <div>CSS height style: {topOnlyComputedHeight === 'auto' ? 'AUTO' : 'PIXELS'}</div>
          <div>--- TEXT ---</div>
          <div>text: {text ? `"${text.substring(0, 20)}..."` : 'null'}</div>
          <div>currentText: {currentText ? `"${currentText.substring(0, 20)}..."` : 'null'}</div>
          <div>topOnly: {topOnly.toString()}</div>
          <div>textTopOnly: {textTopOnly.toString()}</div>
          <div>--- HEIGHT CALC ---</div>
          <div>currentTextHeight: {currentTextHeight}px (visible)</div>
          <div>measuringTextHeight: {measuringTextHeight}px (measuring)</div>
          <div>+ 100px buffer = {targetGradientHeight}px</div>
          <div>--- MEASURING ---</div>
          <div>measuringText: {measuringText ? `"${measuringText.substring(0, 20)}..."` : 'null'}</div>
        </div>
      )}
    </>
  )
}

export default TextOverlay 