import React, { useState, useEffect } from 'react'
import 'mafs/core.css'

import Sidebar from './components/navigation/Sidebar'
import StepControls from './components/navigation/StepControls'
import StepIndicator from './components/navigation/StepIndicator'
import NextLessonButton from './components/navigation/NextLessonButton'
import { useKeyboardNavigation } from './hooks/useKeyboardNavigation'
import { useWindowResize } from './hooks/useWindowResize'
import { sidebarConfig } from './config/sidebarConfig'
import { getNextScene } from './utils/sceneNavigation'

function App() {
  // State for active scene
  const [activeScene, setActiveScene] = useState('1-Intro')
  const [SceneComponent, setSceneComponent] = useState(null)
  const [currentConfig, setCurrentConfig] = useState(null)
  
  // Calculate numSteps from steps array
  const numSteps = currentConfig?.steps ? currentConfig.steps.length + 1 : 1

  // State for collapsible panel
  const [isPanelOpen, setIsPanelOpen] = useState(false)
  
  // State for current step index (demos handle their own step-to-value mapping)
  const [stepIndex, setStepIndex] = useState(0)
  
  // Custom hooks for complex logic
  const windowSize = useWindowResize()
  
  // Use keyboard navigation hook
  useKeyboardNavigation(stepIndex, numSteps, setStepIndex)

  // Function to find the folder for a given scene
  const findSceneFolder = (sceneName) => {
    for (const section of sidebarConfig) {
      for (const button of section.buttons) {
        if (button.scene === sceneName) {
          return section.folder
        }
      }
    }
    return null
  }

  // Function to dynamically load scene
  const loadScene = async (sceneName) => {
    if (!sceneName) {
      console.error('Scene name is null or undefined')
      return
    }

    const folder = findSceneFolder(sceneName)
    if (!folder) {
      console.error(`Could not find folder for scene: ${sceneName}`)
      return
    }

    try {
      const module = await import(`./scenes/${folder}/${sceneName}.jsx`)
      setSceneComponent(() => module.default)
      setCurrentConfig(module.SceneConfig)
    } catch (error) {
      console.error(`Failed to load scene: ${sceneName}`, error)
      setSceneComponent(null)
      setCurrentConfig(null)
    }
  }

  // Load initial scene
  useEffect(() => {
    loadScene(activeScene)
  }, [activeScene])

  // Prevent page scrolling from wheel events globally, except in sidebar
  useEffect(() => {
    const preventPageScroll = (event) => {
      // Check if the event target is within the sidebar
      const sidebarElement = event.target.closest('[data-sidebar]')
      
      // If not in sidebar, prevent default scroll behavior
      if (!sidebarElement) {
        event.preventDefault()
      }
    }

    // Add wheel listener to document to prevent page scrolling except in sidebar
    document.addEventListener('wheel', preventPageScroll, { passive: false })

    return () => {
      document.removeEventListener('wheel', preventPageScroll, { passive: false })
    }
  }, [])

  // Arrow click handlers for discrete steps
  const decreaseStep = () => {
    if (stepIndex > 0) {
      setStepIndex(stepIndex - 1)
    }
  }
  
  const increaseStep = () => {
    if (stepIndex < numSteps - 1) {
      setStepIndex(stepIndex + 1)
    }
  }

  // Step change handler for indicator
  const handleStepChange = (index) => {
    setStepIndex(index)
  }

  // Scene change handler
  const handleSceneChange = (sceneName) => {
    if (!sceneName) {
      console.error('Cannot change to scene: scene name is null')
      return
    }
    
    setActiveScene(sceneName)
    // Always reset to first step when switching scenes
    setStepIndex(0)
  }

  // Get next scene info for the button
  const nextSceneInfo = getNextScene(activeScene)
  
  // Determine if next lesson button should be visible (only on last step)
  const isLastStep = stepIndex === numSteps - 1
  const shouldShowNextButton = isLastStep && nextSceneInfo !== null

  // Handler for next lesson button
  const handleNextLesson = () => {
    if (nextSceneInfo) {
      handleSceneChange(nextSceneInfo.scene) // Instant scene change
    }
  }

  return (
    <div style={{ 
      height: '100dvh', 
      boxSizing: 'border-box',
      position: 'relative',
      overflow: 'hidden'
    }}>
      <Sidebar 
        isOpen={isPanelOpen} 
        onToggle={() => setIsPanelOpen(!isPanelOpen)}
        onSceneChange={handleSceneChange}
        activeScene={activeScene}
      />
      
      <StepControls
        stepIndex={stepIndex}
        numSteps={numSteps}
        onDecrease={decreaseStep}
        onIncrease={increaseStep}
        isPanelOpen={isPanelOpen}
      />

      {/* Dynamically render the active scene */}
      {SceneComponent && (
        <SceneComponent
          windowSize={windowSize}
          stepIndex={stepIndex}
          isPanelOpen={isPanelOpen}
          sceneKey={activeScene}
        />
      )}

      <StepIndicator
        currentStep={stepIndex}
        numSteps={numSteps}
        onStepChange={handleStepChange}
        isPanelOpen={isPanelOpen}
      />

      <NextLessonButton
        nextSceneText={nextSceneInfo?.text}
        onNext={handleNextLesson}
        isVisible={shouldShowNextButton}
        isPanelOpen={isPanelOpen}
        currentConfig={currentConfig}
        stepIndex={stepIndex}
      />
    </div>
  )
}

export default App 