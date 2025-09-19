import React, { useState } from 'react'
import { useGoalSidebarWidth, useTextSizeMultiplier } from '../../constants/textSize'

function StepIndicator({ 
  currentStep, 
  numSteps, 
  onStepChange, 
  isPanelOpen 
}) {
  const [hoveredIndex, setHoveredIndex] = useState(null)
  const goalSidebarWidth = useGoalSidebarWidth()
  const textSizeMultiplier = useTextSizeMultiplier()

  return (
    <div style={{
      position: 'fixed',
      bottom: '20px',
      left: isPanelOpen ? `calc(50% + ${goalSidebarWidth / 2}px)` : '50%',
      transform: 'translateX(-50%)',
      transition: 'left 0.3s ease-in-out',
      display: 'flex',
      gap: `${8 * textSizeMultiplier}px`,
      alignItems: 'center',
      backgroundColor: 'rgba(255, 255, 255, 0.3)',
      padding: `${12 * textSizeMultiplier}px ${20 * textSizeMultiplier}px`,
      borderRadius: '25px',
      boxShadow: '0 4px 15px rgba(0, 0, 0, 0.1)',
      zIndex: 1000,
      backdropFilter: 'blur(10px)'
    }}>
      {Array.from({ length: numSteps }, (_, index) => {
        const isActive = currentStep === index
        const isHovered = hoveredIndex === index
        
        return (
          <div
            key={index}
            style={{
              width: isActive ? `${12 * textSizeMultiplier}px` : `${10 * textSizeMultiplier}px`,
              height: isActive ? `${12 * textSizeMultiplier}px` : `${10 * textSizeMultiplier}px`,
              borderRadius: '50%',
              backgroundColor: isActive ? '#999999' : isHovered ? '#999999' : '#cccccc',
              transition: 'all 0.3s ease',
              cursor: 'pointer',
              transform: isHovered && !isActive ? 'scale(1.2)' : 'scale(1)'
            }}
            onClick={() => onStepChange(index)}
            onMouseEnter={() => setHoveredIndex(index)}
            onMouseLeave={() => setHoveredIndex(null)}
          />
        )
      })}
    </div>
  )
}

export default StepIndicator 