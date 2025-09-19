import React from 'react'
import { Text, LaTeX, useTransformContext, vec } from 'mafs'
import { colors } from '../../config/colors'
import { useTextSizeMultiplier } from '../../constants/textSize'

/**
 * Reusable Label component for Points, Blobs, and other objects
 * Supports both regular text and LaTeX with proper screen-space positioning
 */
function Label({
  labelContext = null,           // Function that generates label content: (...args) => string
  labelContextArgs = [],         // Arguments to pass to labelContext function
  position = [0, 0],             // [x, y] position to place the label
  attach = "ne",                 // Direction to attach label relative to position
  attachDistance = 12,           // Distance in screen pixels from position
  size = 14,                     // Font size for regular text
  color = colors.gray,           // Label color
  opacity = 1                    // Opacity (0-1)
}) {
  // Get current transform context for screen-space calculations
  const { viewTransform } = useTransformContext()
  const pixelsPerSquare = -vec.det(viewTransform)
  const textSizeMultiplier = useTextSizeMultiplier()
  
  // Don't render if no label context provided
  if (!labelContext) {
    return null
  }
  
  // Don't render if invisible
  if (opacity <= 0) {
    return null
  }
  
  // Generate label content using the context function
  const labelContent = labelContext(...labelContextArgs)
  
  // Don't render if no content
  if (!labelContent) {
    return null
  }
  
  // Helper function to check if content contains LaTeX
  const isLaTeX = (str) => {
    return str && (str.includes('$') || str.includes('\\'))
  }
  
  // Helper function to calculate screen-space offset position
  const calculateLabelPosition = (basePosition, attachDir, screenPixelDistance) => {
    // Convert screen pixels to coordinate space
    const coordinateOffset = screenPixelDistance / Math.sqrt(pixelsPerSquare)
    const [x, y] = basePosition
    
    switch (attachDir) {
      case 'n': return [x, y + coordinateOffset]
      case 'ne': return [x + coordinateOffset * 0.707, y + coordinateOffset * 0.707]
      case 'e': return [x + coordinateOffset, y]
      case 'se': return [x + coordinateOffset * 0.707, y - coordinateOffset * 0.707]
      case 's': return [x, y - coordinateOffset]
      case 'sw': return [x - coordinateOffset * 0.707, y - coordinateOffset * 0.707]
      case 'w': return [x - coordinateOffset, y]
      case 'nw': return [x - coordinateOffset * 0.707, y + coordinateOffset * 0.707]
      default: return [x, y + coordinateOffset]
    }
  }
  
  const finalPosition = calculateLabelPosition(position, attach, attachDistance)
  
  // Render LaTeX or regular text
  if (isLaTeX(labelContent)) {
    return (
      <g style={{ opacity }}>
        <LaTeX
          tex={String.raw`${labelContent.replace(/\$/g, '')}`}
          at={finalPosition}
          color={color}
        />
      </g>
    )
  } else {
    return (
      <Text
        x={finalPosition[0]}
        y={finalPosition[1]}
        size={size * textSizeMultiplier}
        color={color}
        svgTextProps={{ opacity }}
      >
        {labelContent}
      </Text>
    )
  }
}

export default Label 