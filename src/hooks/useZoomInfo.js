import { useTransformContext, vec } from 'mafs'

/**
 * Hook that provides comprehensive zoom and transform information
 * @returns {Object} Zoom information object
 */
export function useZoomInfo() {
  const { viewTransform } = useTransformContext()
  
  // Calculate various zoom-related variables
  const pixelsPerSquare = -vec.det(viewTransform)
  const zoomLevel = Math.sqrt(Math.abs(pixelsPerSquare))
  const scaleX = Math.sqrt(viewTransform[0] * viewTransform[0] + viewTransform[1] * viewTransform[1])
  const scaleY = Math.sqrt(viewTransform[2] * viewTransform[2] + viewTransform[3] * viewTransform[3])
  
  return {
    viewTransform,
    pixelsPerSquare,
    zoomLevel,
    scaleX,
    scaleY
  }
} 