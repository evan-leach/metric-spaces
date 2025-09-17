import { useMemo } from 'react'
import BaseScene from '../../components/BaseScene'
import { colors } from '../../config/colors'
import Intersection from '../../components/objects/Intersection'
import Point from '../../components/objects/Point'
import PointSequence from '../../components/objects/PointSequence'
import Blob from '../../components/objects/Blob'
import Circle from '../../components/objects/Circle'

export const SceneConfig = {
  steps: [
    ""
  ]
}

function Finale({ windowSize, stepIndex, isPanelOpen, sceneKey }) {


  return (
    <BaseScene
      config={SceneConfig}
      sceneKey={sceneKey}
      stepIndex={stepIndex}
      isPanelOpen={isPanelOpen}
      windowSize={windowSize}
    >


    </BaseScene>
  )
}

export default Finale

