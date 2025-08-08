import { useState, useEffect } from 'react'

export function useWindowResize() {
  const [windowSize, setWindowSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight
  })

  useEffect(() => {
    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight
      })
    }

    const handleFullscreenChange = () => {
      // Small delay to ensure DOM has updated after fullscreen change
      setTimeout(() => {
        setWindowSize({
          width: window.innerWidth,
          height: window.innerHeight
        })
      }, 100)
    }

    // Add event listeners
    window.addEventListener('resize', handleResize)
    document.addEventListener('fullscreenchange', handleFullscreenChange)
    document.addEventListener('webkitfullscreenchange', handleFullscreenChange)
    document.addEventListener('mozfullscreenchange', handleFullscreenChange)
    document.addEventListener('MSFullscreenChange', handleFullscreenChange)

    // Cleanup event listeners
    return () => {
      window.removeEventListener('resize', handleResize)
      document.removeEventListener('fullscreenchange', handleFullscreenChange)
      document.removeEventListener('webkitfullscreenchange', handleFullscreenChange)
      document.removeEventListener('mozfullscreenchange', handleFullscreenChange)
      document.removeEventListener('MSFullscreenChange', handleFullscreenChange)
    }
  }, [])

  return windowSize
} 