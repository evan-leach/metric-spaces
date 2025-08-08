import { useEffect } from 'react'

export function useKeyboardNavigation(stepIndex, numSteps, onStepChange) {
  useEffect(() => {
    const handleKeyDown = (event) => {
      // Check if the user is typing in an input field
      if (event.target.tagName === 'INPUT' || event.target.tagName === 'TEXTAREA') {
        return
      }

      // Always prevent default behavior for arrow keys and spacebar to avoid camera movement
      if (event.key === 'ArrowLeft' || event.key === 'ArrowRight' ||
        event.key === 'ArrowUp' || event.key === 'ArrowDown' || event.key === ' ') {
        event.preventDefault()
        event.stopPropagation()
      }

      switch (event.key) {
        case 'ArrowLeft':
          if (stepIndex > 0) {
            onStepChange(stepIndex - 1)
          }
          break
        case 'ArrowRight':
        case ' ': // Space key
          if (stepIndex < numSteps - 1) {
            onStepChange(stepIndex + 1)
          }
          break
        default:
          break
      }
    }

    // Add keydown event listener to the document with capture phase to intercept early
    document.addEventListener('keydown', handleKeyDown, true)

    // Cleanup
    return () => {
      document.removeEventListener('keydown', handleKeyDown, true)
    }
  }, [stepIndex, numSteps, onStepChange])
} 