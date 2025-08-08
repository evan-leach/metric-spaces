import React from 'react'
import { Plot } from 'mafs'
import { useFrameBasedOpacity } from '../../hooks/useFrameBasedOpacity'
import { colors } from '../../config/colors'

/**
 * InequalityPlot component - creates shaded regions above or below a curve
 * Uses Mafs Plot.Inequality with frame-based opacity animation
 */
function InequalityPlot({
  // Function definition (simple mode - backwards compatible)
  y = null,  // function of x: (x) => y
  x = null,  // function of y: (y) => x
  
  // Advanced mode - for complex inequalities with multiple bounds
  // Use this for regions between lines, etc.
  yInequality = null,  // object like { ">=": fn1, "<=": fn2 }
  xInequality = null,  // object like { ">": fn1, "<": fn2 }
  
  // Shading direction - determines which side of the curve to shade (simple mode only)
  above = true,  // if true, shade above the curve; if false, shade below
  
  // Styling
  color = colors.blue,
  fillOpacity = 0.4,
  strokeOpacity = 0.8,
  strokeColor = null,  // defaults to color if not specified
  weight = 2,
  style = "solid",  // "solid" or "dashed"
  
  // Frame-based visibility
  startFrame = null,
  endFrame = null,
  stepIndex = 0,
  
  // Advanced Mafs options
  minSamplingDepth = 10,
  maxSamplingDepth = 14
}) {
  // Use frame-based opacity for visibility control (with slower animation)
  const currentOpacity = useFrameBasedOpacity(startFrame, endFrame, stepIndex, {
    speed: 0.05  // Slower animation (default is 0.1)
  })
  
  // Don't render if invisible
  if (currentOpacity <= 0) {
    return null
  }
  
  // Validate props
  const hasSimpleProps = x || y
  const hasAdvancedProps = xInequality || yInequality
  
  if (hasSimpleProps && hasAdvancedProps) {
    throw new Error('InequalityPlot cannot mix simple props (x/y) with advanced props (xInequality/yInequality). Use one approach or the other.')
  }
  
  if (x && y) {
    throw new Error('InequalityPlot cannot have both x and y props. Use one or the other.')
  }
  
  if (xInequality && yInequality) {
    throw new Error('InequalityPlot cannot have both xInequality and yInequality props. Use one or the other.')
  }
  
  if (!hasSimpleProps && !hasAdvancedProps) {
    throw new Error('InequalityPlot must have either simple props (x/y) or advanced props (xInequality/yInequality).')
  }
  
  // Set up inequality object based on mode
  let inequalityProps = {}
  
  if (hasAdvancedProps) {
    // Advanced mode: use the inequality objects directly
    if (xInequality) {
      inequalityProps.x = xInequality
    } else {
      inequalityProps.y = yInequality
    }
  } else {
    // Simple mode: backwards compatible behavior
    if (y) {
      // Function of x: y = f(x)
      if (above) {
        inequalityProps.y = { ">=": y }
      } else {
        inequalityProps.y = { "<=": y }
      }
    } else {
      // Function of y: x = f(y)  
      if (above) {
        inequalityProps.x = { ">=": x }
      } else {
        inequalityProps.x = { "<=": x }
      }
    }
  }
  
  // Calculate final colors and opacities
  const finalStrokeColor = strokeColor || color
  const finalFillOpacity = fillOpacity * currentOpacity
  const finalStrokeOpacity = strokeOpacity * currentOpacity
  
  // Calculate dash pattern for dashed lines
  const dashArray = style === "dashed" ? `${weight * 2} ${weight * 2}` : undefined
  
  // SVG props for styling the paths
  const svgPathProps = dashArray ? { strokeDasharray: dashArray } : {}
  
  return (
    <Plot.Inequality
      {...inequalityProps}
      color={color}
      fillOpacity={finalFillOpacity}
      strokeOpacity={finalStrokeOpacity}
      strokeColor={finalStrokeColor}
      weight={weight}
      minSamplingDepth={minSamplingDepth}
      maxSamplingDepth={maxSamplingDepth}
      svgUpperPathProps={svgPathProps}
      svgLowerPathProps={svgPathProps}
    />
  )
}

export default InequalityPlot 