import React from 'react'
import { LaTeXMath } from '../canvas/LaTeXRenderer'
import { useFrameBasedOpacity } from '../../hooks/useFrameBasedOpacity'
import { useTextSizeMultiplier } from '../../constants/textSize'

function DisplayOverlay({ 
  line1 = "",
  line2 = "",
  startFrame = null,
  endFrame = null,
  stepIndex = 0,
  isPanelOpen = false
}) {
  // Use frame-based opacity for fading animation
  const currentOpacity = useFrameBasedOpacity(startFrame, endFrame, stepIndex)
  const textSizeMultiplier = useTextSizeMultiplier()

  // Don't render if not visible
  if (currentOpacity <= 0) {
    return null
  }
  
  return (
    <div style={{ opacity: currentOpacity }}>
      <div style={{
        position: 'fixed',
        bottom: '90px', // Position above StepIndicator (which is at 20px)
        left: isPanelOpen ? 'calc(50% + 150px)' : '50%',
        transform: 'translateX(-50%)',
        transition: 'left 0.3s ease-in-out',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '8px',
        backgroundColor: 'rgba(245, 245, 245, 0.8)',
        padding: '16px 24px',
        borderRadius: '12px',
        boxShadow: '0 4px 15px rgba(0, 0, 0, 0.1)',
        zIndex: 400, // Below text overlay (500-501) but above canvas content
        backdropFilter: 'blur(10px)',
        fontSize: `${16 * textSizeMultiplier}px`,
        fontFamily: 'inherit'
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '12px'
        }}>
          <LaTeXMath math={line1} />
        </div>
        {line2 && (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            fontSize: `${14 * textSizeMultiplier}px`,
            color: '#666'
          }}>
            <LaTeXMath math={line2} />
          </div>
        )}
      </div>
    </div>
  )
}

export default DisplayOverlay 