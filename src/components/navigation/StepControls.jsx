import React from 'react'
import { useGoalSidebarWidth, useTextSizeMultiplier } from '../../constants/textSize'

function StepControls({ 
  stepIndex, 
  numSteps, 
  onDecrease, 
  onIncrease, 
  isPanelOpen 
}) {

  const goalSidebarWidth = useGoalSidebarWidth()
  const leftMargin = isPanelOpen ? goalSidebarWidth  - 5 : -5
  const textSizeMultiplier = useTextSizeMultiplier()

  return (
    <>
      {/* Left Arrow - Decrease Step */}
      <img
        src="/metric-spaces/arrow-left.svg"
        onClick={stepIndex > 0 ? onDecrease : undefined}
        style={{
          position: 'fixed',
          left: `${leftMargin}px`,
          top: '50%',
          transform: 'translateY(-50%)',
          cursor: stepIndex <= 0 ? 'default' : 'pointer',
          // Ensure sidebar (zIndex: 1000) sits above arrows
          zIndex: 998,
          transition: 'left 0.3s ease-in-out, transform 0.1s ease, opacity 0.2s ease',
          opacity: stepIndex <= 0 ? 0.4 : 0.9,
          filter: stepIndex <= 0 ? 'drop-shadow(0 10px 30px rgba(0,0,0,0.6))' : 'drop-shadow(0 20px 60px rgba(0,0,0,0.8))',
          width: `${90 * textSizeMultiplier}px`,
          height: '160px'
        }}
        onMouseEnter={(e) => {
          if (stepIndex > 0) {
            e.target.style.opacity = '1'
            e.target.style.transform = 'translateY(-50%) scale(1.05)'
          }
        }}
        onMouseLeave={(e) => {
          e.target.style.opacity = stepIndex <= 0 ? '0.4' : '0.9'
          e.target.style.transform = 'translateY(-50%) scale(1)'
        }}
        aria-hidden="true"
      />

      {/* Right Arrow - Increase Step */}
      <img
        src="/metric-spaces/arrow-right.svg"
        onClick={stepIndex < numSteps - 1 ? onIncrease : undefined}
        style={{
          position: 'fixed',
          right: '-5px',
          top: '50%',
          transform: 'translateY(-50%)',
          cursor: stepIndex >= numSteps - 1 ? 'default' : 'pointer',
          // Keep below sidebar stacking context just for consistency
          zIndex: 998,
          transition: 'transform 0.1s ease, opacity 0.2s ease',
          opacity: stepIndex >= numSteps - 1 ? 0.4 : 0.9,
          filter: stepIndex >= numSteps - 1 ? 'drop-shadow(0 10px 30px rgba(0,0,0,0.6))' : 'drop-shadow(0 20px 60px rgba(0,0,0,0.8))',
          width: `${90 * textSizeMultiplier}px`,
          height: '160px'
        }}
        onMouseEnter={(e) => {
          if (stepIndex < numSteps - 1) {
            e.target.style.opacity = '1'
            e.target.style.transform = 'translateY(-50%) scale(1.05)'
          }
        }}
        onMouseLeave={(e) => {
          e.target.style.opacity = stepIndex >= numSteps - 1 ? '0.4' : '0.9'
          e.target.style.transform = 'translateY(-50%) scale(1)'
        }}
        aria-hidden="true"
      />
    </>
  )
}

export default StepControls 