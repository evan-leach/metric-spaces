import { sidebarConfig } from '../config/sidebarConfig.js'

/**
 * Finds the section and scene title for a given scene key from the sidebar configuration
 * @param {string} sceneKey - The scene identifier (e.g., 'scene1', 'scene2')
 * @returns {Object} Object containing sectionTitle and sceneTitle, or null if not found
 */
export function getSceneTitleInfo(sceneKey) {
  for (const section of sidebarConfig) {
    for (const button of section.buttons) {
      if (button.scene === sceneKey) {
        return {
          sectionTitle: section.title,
          sceneTitle: button.text
        }
      }
    }
  }
  
  // Return null if scene not found in config
  return null
} 