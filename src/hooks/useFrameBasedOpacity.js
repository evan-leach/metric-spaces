import { useMemo } from 'react'
import { useKeyframeAnimation } from './useKeyframeAnimation'
import { ANIMATION_SPEED, ANIMATION_INTERVAL } from '../constants/animations'

/**
 * Custom hook for frame-based opacity animations
 * Handles the same logic as Point.jsx for startFrame/endFrame visibility
 * @param {number|null} startFrame - Frame where element becomes visible
 * @param {number|null} endFrame - Frame where element becomes invisible
 * @param {number} stepIndex - Current step index
 * @param {Object} animationOptions - Options for useKeyframeAnimation
 * @returns {number} Current opacity value (0-1)
 */
export function useFrameBasedOpacity(startFrame, endFrame, stepIndex, animationOptions = {}) {
  // Build keyframe definitions based on start/end frame logic
  const keyframeDefinitions = useMemo(() => {
    const opacityKeyframes = {}
    
    if (startFrame === null) {
      // No start frame: always visible
      opacityKeyframes[0] = 1
    } else if (endFrame === null) {
      // No end frame: visible from start frame onwards (never fades out)
      if (startFrame > 0) {
        opacityKeyframes[startFrame - 1] = 0
      }
      opacityKeyframes[startFrame] = 1
    } else {
      // Both start and end: visible for closed interval [startFrame, endFrame]
      if (startFrame > 0) {
        opacityKeyframes[startFrame - 1] = 0
      }
      opacityKeyframes[startFrame] = 1
      opacityKeyframes[endFrame] = 1
      opacityKeyframes[endFrame + 1] = 0
    }
    
    return {
      opacity: opacityKeyframes
    }
  }, [startFrame, endFrame])
  
  // Default animation options optimized for opacity transitions
  const defaultOptions = {
    speed: ANIMATION_SPEED, // Smooth but not too slow
    threshold: 0.01, // Fine threshold for opacity
    interval: ANIMATION_INTERVAL // 60fps
  }
  
  // Use keyframe animation for smooth opacity transitions
  const animatedValues = useKeyframeAnimation(keyframeDefinitions, stepIndex, {
    ...defaultOptions,
    ...animationOptions
  })
  
  // Get current opacity, defaulting to 1 if no animation is active
  return animatedValues.opacity !== undefined ? animatedValues.opacity : 1
} 