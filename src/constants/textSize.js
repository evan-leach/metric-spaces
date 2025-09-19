import { useState, useEffect } from 'react'

function getTextSizeMultiplier(width) {
  if (width >= 880) return 1
  if (width >= 660) return 0.8
  if (width >= 440) return 0.6
  return 0.4
}

function getSidebarWidth(width) {
  if (width >= 880) return 300
  if (width >= 660) return 250
  if (width >= 440) return 200
  return 150
}

export function useTextSizeMultiplier() {
  const [multiplier, setMultiplier] = useState(() =>
    typeof window !== 'undefined' ? getTextSizeMultiplier(window.innerWidth) : 1
  )

  useEffect(() => {
    function handleResize() {
      setMultiplier(getTextSizeMultiplier(window.innerWidth))
    }
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  return multiplier
}

export function useGoalSidebarWidth() {
  const [width, setWidth] = useState(() =>
    typeof window !== 'undefined' ? getSidebarWidth(window.innerWidth) : 300
  )

  useEffect(() => {
    function handleResize() {
      setWidth(getSidebarWidth(window.innerWidth))
    }
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  return width
}
