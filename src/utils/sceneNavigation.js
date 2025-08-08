import { sidebarConfig } from '../config/sidebarConfig'

/**
 * Finds the next scene in the sequence based on sidebarConfig
 * @param {string} currentScene - The current scene identifier
 * @returns {Object|null} - Object with {scene: string, text: string} or null if no next scene
 */
export function getNextScene(currentScene) {
  // Flatten all buttons with their section context
  const allButtons = []
  
  for (const section of sidebarConfig) {
    for (const button of section.buttons) {
      if (button.scene) { // Only include buttons with actual scenes
        allButtons.push({
          scene: button.scene,
          text: button.text,
          sectionTitle: section.title
        })
      }
    }
  }
  
  // Find current scene index
  const currentIndex = allButtons.findIndex(button => button.scene === currentScene)
  
  // Return null if current scene not found or if it's the last scene
  if (currentIndex === -1 || currentIndex === allButtons.length - 1) {
    return null
  }
  
  // Return next scene info
  const nextButton = allButtons[currentIndex + 1]
  return {
    scene: nextButton.scene,
    text: nextButton.text
  }
}