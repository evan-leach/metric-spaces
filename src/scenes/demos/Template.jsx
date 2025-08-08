import React from 'react'
import BaseScene from '../../components/BaseScene'
// import Point from '../../components/objects/Point'
// import Circle from '../../components/objects/Circle'
// import Blob from '../../components/objects/Blob'
// import PointSequence from '../../components/objects/PointSequence'
import { colors } from '../../config/colors'

export const SceneConfig = {
  steps: [
    "Steps"
  ]
}

function TemplateName({ 
  windowSize, 
  stepIndex, 
  isPanelOpen,
  sceneKey 
}) {
  return (
    <BaseScene
      config={SceneConfig}
      sceneKey={sceneKey}
      stepIndex={stepIndex}
      isPanelOpen={isPanelOpen}
      windowSize={windowSize}
    >
      {/* Objects go here */}
    </BaseScene>
  )
}

export default TemplateName 