import { useState, useEffect, useRef, useMemo } from 'react'
import { ANIMATION_SPEED, ANIMATION_THRESHOLD, ANIMATION_INTERVAL } from '../constants/animations'

/**
 * Utility function to resolve the target value for a given step based on keyframes
 * Uses the convention: if no keyframe exists for the current step, use the most recent frame.
 * If no most recent frame exists, use the next frame.
 */
function resolveKeyframeValue(keyframes, currentStep) {
  const steps = Object.keys(keyframes).map(Number).sort((a, b) => a - b)
  
  // If no keyframes, return undefined
  if (steps.length === 0) return undefined
  
  // Find exact match
  if (keyframes[currentStep] !== undefined) {
    return keyframes[currentStep]
  }
  
  // Find most recent frame (step <= currentStep)
  const recentSteps = steps.filter(step => step <= currentStep)
  if (recentSteps.length > 0) {
    const mostRecentStep = Math.max(...recentSteps)
    return keyframes[mostRecentStep]
  }
  
  // If no recent frame, use next frame (step > currentStep)
  const futureSteps = steps.filter(step => step > currentStep)
  if (futureSteps.length > 0) {
    const nextStep = Math.min(...futureSteps)
    return keyframes[nextStep]
  }
  
  // Should never reach here if keyframes exist
  return undefined
}

/**
 * Utility function to interpolate RGB colors
 */
function interpolateColor(fromColor, toColor, progress) {
  // Convert hex to RGB
  const hexToRgb = (hex) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : null
  }
  
  // Convert RGB to hex
  const rgbToHex = (r, g, b) => {
    const toHex = (c) => {
      const hex = Math.round(c).toString(16)
      return hex.length === 1 ? "0" + hex : hex
    }
    return `#${toHex(r)}${toHex(g)}${toHex(b)}`
  }
  
  const fromRgb = hexToRgb(fromColor)
  const toRgb = hexToRgb(toColor)
  
  if (!fromRgb || !toRgb) return toColor // Fallback if color parsing fails
  
  const r = fromRgb.r + (toRgb.r - fromRgb.r) * progress
  const g = fromRgb.g + (toRgb.g - fromRgb.g) * progress
  const b = fromRgb.b + (toRgb.b - fromRgb.b) * progress
  
  return rgbToHex(r, g, b)
}

/**
 * Utility function to determine if a value is a color (hex format)
 */
function isColor(value) {
  return typeof value === 'string' && /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(value)
}

/**
 * Main keyframe animation hook
 * @param {Object} keyframeDefinitions - Object containing keyframe definitions for different parameters
 * @param {number} currentStep - Current step number
 * @param {Object} options - Animation options (speed, threshold, etc.)
 * @returns {Object} Object containing the current animated values for each parameter
 */
export function useKeyframeAnimation(keyframeDefinitions, currentStep, options = {}) {
  const {
    speed = ANIMATION_SPEED,
    threshold = ANIMATION_THRESHOLD,
    interval = ANIMATION_INTERVAL
  } = options
  
  // Resolve target values for current step
  const targetValues = useMemo(() => {
    const targets = {}
    
    Object.keys(keyframeDefinitions).forEach(paramName => {
      const keyframes = keyframeDefinitions[paramName]
      const targetValue = resolveKeyframeValue(keyframes, currentStep)
      if (targetValue !== undefined) {
        targets[paramName] = targetValue
      }
    })
    
    return targets
  }, [keyframeDefinitions, currentStep])
  
  // State for current animated values
  const [currentValues, setCurrentValues] = useState(() => {
    // Initialize with target values
    const initial = {}
    Object.keys(targetValues).forEach(paramName => {
      initial[paramName] = targetValues[paramName]
    })
    return initial
  })
  
  const intervalRef = useRef(null)
  
  useEffect(() => {
    // Clear any existing interval
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }
    
    const animate = () => {
      setCurrentValues(prevValues => {
        const newValues = { ...prevValues }
        let allReachedTarget = true
        
        Object.keys(targetValues).forEach(paramName => {
          const currentValue = prevValues[paramName]
          const targetValue = targetValues[paramName]
          
          // Skip if no current value or target value
          if (currentValue === undefined || targetValue === undefined) {
            newValues[paramName] = targetValue
            return
          }
          
          // Handle color interpolation
          if (isColor(currentValue) && isColor(targetValue)) {
            if (currentValue !== targetValue) {
              allReachedTarget = false
              // For colors, we need to interpolate more gradually
              // Use a smaller step to make color transitions smoother
              const colorSpeed = speed * 0.5
              newValues[paramName] = interpolateColor(currentValue, targetValue, colorSpeed)
            }
            return
          }
          
          // Handle numeric interpolation
          if (typeof currentValue === 'number' && typeof targetValue === 'number') {
            const difference = targetValue - currentValue
            
            if (Math.abs(difference) < threshold) {
              newValues[paramName] = targetValue
            } else {
              allReachedTarget = false
              newValues[paramName] = currentValue + difference * speed
            }
            return
          }
          
          // For other types, just set directly
          newValues[paramName] = targetValue
        })
        
        // Stop the animation when all values reach their targets
        if (allReachedTarget && intervalRef.current) {
          clearInterval(intervalRef.current)
          intervalRef.current = null
        }
        
        return newValues
      })
    }
    
    // Check if we need to start animation
    const needsAnimation = Object.keys(targetValues).some(paramName => {
      const currentValue = currentValues[paramName]
      const targetValue = targetValues[paramName]
      
      if (currentValue === undefined || targetValue === undefined) return false
      
      // For colors, check if they're different
      if (isColor(currentValue) && isColor(targetValue)) {
        return currentValue !== targetValue
      }
      
      // For numbers, check if difference is above threshold
      if (typeof currentValue === 'number' && typeof targetValue === 'number') {
        return Math.abs(targetValue - currentValue) >= threshold
      }
      
      // For other types, check if different
      return currentValue !== targetValue
    })
    
    if (needsAnimation) {
      intervalRef.current = setInterval(animate, interval)
    }
    
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
        intervalRef.current = null
      }
    }
  }, [targetValues, speed, threshold, interval])
  
  // Update current values when target values change and we're not animating
  useEffect(() => {
    if (!intervalRef.current) {
      setCurrentValues(prevValues => {
        const newValues = { ...prevValues }
        Object.keys(targetValues).forEach(paramName => {
          if (prevValues[paramName] === undefined) {
            newValues[paramName] = targetValues[paramName]
          }
        })
        return newValues
      })
    }
  }, [targetValues])
  
  return currentValues
}

 