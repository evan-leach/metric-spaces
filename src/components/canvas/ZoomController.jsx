import React, { useRef, useEffect } from 'react'
import { Mafs } from 'mafs'

// Zoom controller wrapper with adjustable zoom speed for Mafs
function ZoomController({ children, zoomSensitivity = 0.3, ...mafsProps }) {
  const containerRef = useRef(null)

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    // Custom wheel handler to reduce zoom sensitivity
    const handleWheel = (event) => {
      // Prevent default scroll behavior to avoid page scrolling when zoom limits are reached
      event.preventDefault()
      
      // Modify the deltaY property of the original event
      const originalDeltaY = event.deltaY
      const scaledDeltaY = originalDeltaY * zoomSensitivity
      
      // Override the deltaY property
      Object.defineProperty(event, 'deltaY', {
        value: scaledDeltaY,
        writable: false,
        configurable: true
      })
      
      // Also modify deltaX if it exists for horizontal scrolling
      if (event.deltaX !== 0) {
        const originalDeltaX = event.deltaX
        const scaledDeltaX = originalDeltaX * zoomSensitivity
        Object.defineProperty(event, 'deltaX', {
          value: scaledDeltaX,
          writable: false,
          configurable: true
        })
      }
    }

    // Block ALL keyboard events from reaching Mafs
    const blockKeyboardEvents = (event) => {
      // Stop the event from reaching Mafs canvas
      event.stopPropagation()
      event.preventDefault()
    }

    // Add our custom wheel listener with capture: true to modify event before it reaches Mafs
    container.addEventListener('wheel', handleWheel, { 
      capture: true,
      passive: false
    })

    // Block all keyboard events from reaching the Mafs canvas
    container.addEventListener('keydown', blockKeyboardEvents, { 
      capture: true,
      passive: false
    })
    container.addEventListener('keyup', blockKeyboardEvents, { 
      capture: true,
      passive: false
    })
    container.addEventListener('keypress', blockKeyboardEvents, { 
      capture: true,
      passive: false
    })

    return () => {
      container.removeEventListener('wheel', handleWheel, { 
        capture: true,
        passive: false
      })
      container.removeEventListener('keydown', blockKeyboardEvents, { 
        capture: true,
        passive: false
      })
      container.removeEventListener('keyup', blockKeyboardEvents, { 
        capture: true,
        passive: false
      })
      container.removeEventListener('keypress', blockKeyboardEvents, { 
        capture: true,
        passive: false
      })
    }
  }, [zoomSensitivity])

  return (
    <div ref={containerRef} style={{ width: '100%', height: '100%' }}>
      <Mafs {...mafsProps}>
        {children}
      </Mafs>
    </div>
  )
}

export default ZoomController 