import { useState, useEffect } from 'react'

export function useSidebarWidth() {
  const [sidebarWidth, setSidebarWidth] = useState(0)

  useEffect(() => {
    const updateSidebarWidth = () => {
      const sidebar = document.querySelector('[data-sidebar]')
      if (sidebar) {
        const rect = sidebar.getBoundingClientRect()
        // Calculate visible width - sidebar slides in from left
        const visibleWidth = Math.max(0, rect.right)
        setSidebarWidth(visibleWidth)
      }
    }

    // Update immediately
    updateSidebarWidth()

    // Use requestAnimationFrame for smooth updates during animation
    let animationId
    const animate = () => {
      updateSidebarWidth()
      animationId = requestAnimationFrame(animate)
    }
    animationId = requestAnimationFrame(animate)

    // Also listen for resize events
    window.addEventListener('resize', updateSidebarWidth)

    return () => {
      if (animationId) {
        cancelAnimationFrame(animationId)
      }
      window.removeEventListener('resize', updateSidebarWidth)
    }
  }, [])

  return sidebarWidth
} 