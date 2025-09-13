import { useMemo } from 'react'
import BaseScene from '../../components/BaseScene'
import { colors } from '../../config/colors'
import InequalityPlot from '../../components/objects/InequalityPlot'
import Point from '../../components/objects/Point'
import Circle from '../../components/objects/Circle'
import Blob from '../../components/objects/Blob'

export const SceneConfig = {
  steps: [
    "We've proven many properties of compact sets by now, and we're getting to know sequentially compact sets too. $$$$ However,\
    we still haven't been able to give a single concrete example of an infinite compact or sequentially compact set!",
    "Our goal for this section is to find some simple properties of compact sets which are enough to go in the other\
    direction and prove that a set is compact.",
    "For example, we know that compact sets are closed and bounded. If a set is both closed and bounded, does this mean\
    it's compact?",
    "Unfortunately, the answer is no. However, we can make two small upgrades to these properties in order to make them\
    strong enough to prove that a set _is_ compact.",
    "We will begin by upgrading the property of _boundedness._ $$$$ Right now, the problem is that it doesn't take some\
    strange metric spaces into account.",
    "TOP: For example, this set looks unbounded, but it is actually bounded if we use the discrete metric. $$$$ Every\
    point in this set is a distance of at most $1$ away from any point $x$.",
    "TOP: Since this is a subset of the neighborhood $N_2(x)$, the entire coordinate plane is bounded in the discrete metric!",
    "TOP: To fix this problem, we will define a new property: $$$$ A set $A$ is *totally bounded* if for every $r > 0$, the set\
    can be covered by finitely many neighborhoods of radius $r$.",
    "TOP: In other words, instead of covering a set by one big neighborhood...",
    "TOP: ...we cover it by lots of little neighborhoods.",
    "TOP:  Notice that the entire coordinate plane is not _totally_ bounded in the discrete metric, since it cannot be covered\
    by finitely many neighborhoods of radius $1$ (these neighborhoods are just singletons).",
    "Total boundedness is _stronger_ property than boundedness. In other words, every totally bounded set is bounded. If you're\
    looking for a challenge, try to prove this! $$$$ The strategy is to take a finite collection of neighborhoods with radius $r$\
    covering the set and then use the fact that their center points form a finite set.",
    "In the coordinate plane (and in any \"normal\" metric space, like the number line or 3D space), the property of total\
    boundedness is _equivalent_ to boundedness. In other words, any bounded set is also totally bounded. Let's see why!",
    "TOP: If a set $A$ is bounded, then it is a subset of some neighborhood $N_R(x)$. If we can cover this neighborhood with\
    finitely many balls of radius $r$ for any $r > 0$, then we can also cover $A$ with these same balls.",
    "TOP: We can make this cover by arranging the center points of our neighborhoods in a grid like this...",
    "TOP: ...and this same strategy works for any $r > 0$, no matter how small. $$$$ We can therefore cover $A$ by finitely many\
    neighborhoods of radius $r$ for any $r > 0$, so $A$ is totally bounded.",
    "We now have our first upgrade. For the rest of this section, we'll consider totally bounded sets instead of just bounded sets.\
    $$$$ In the next section, we'll upgrade the property of being closed.",
  ]
}

function TotalBoundedness({ windowSize, stepIndex, isPanelOpen, sceneKey }) {

  const spiralCurve = (t) => {
    const x = Math.sin(t) * Math.sqrt(t) * 0.2
    const y = Math.cos(t) * Math.sqrt(t) * 0.2 - 0.5
    return [
      x,
      y
    ]
  }

  const spiralCurve2 = (t) => {
    const px = (t * 0.2) % 1 - 0.4
    const py = t * 0.02 - 0.5
    const x = 7 * px
    const y = Math.floor(10 * py + 0.001) * 1.5 + 4
    return [
      x,
      y
    ]
  }

  const spiralCurve3 = (t) => {
    const px = (t * 0.1) % 1 - 0.45
    const py = t * 0.01 - 0.5
    const x = 6 * px
    const y = Math.floor(10 * py + 0.001) / 1.5 - 0.1
    return [
      x,
      y
    ]
  }

  const circleKeyframes = useMemo(() => ({
    radius: {
      8: 0,
      9: 2.5,
      10: 0
    }
  }), [])

  const spiralKeyframes = useMemo(() => ({
    radius: {
      9: 0,
      10: 0.3,
      11: 0
    }
  }), [])

  const circle2Keyframes = useMemo(() => ({
    radius: {
      13: 0,
      14: 3,
      16: 0
    }
  }), [])

  const spiral2Keyframes = useMemo(() => ({
    radius: {
      14: 0,
      15: 1.1,
      16: 0
    }
  }), [])

  const spiral3Keyframes = useMemo(() => ({
    radius: {
      15: 0,
      16: 0.5,
      17: 0
    }
  }), [])

  return (
    <BaseScene
      config={SceneConfig}
      sceneKey={sceneKey}
      stepIndex={stepIndex}
      isPanelOpen={isPanelOpen}
      windowSize={windowSize}
    >
      <InequalityPlot
        y={1000000}
        above={false}
        color={colors.blue}
        startFrame={0}
        endFrame={8}
        stepIndex={stepIndex}
      />

      <InequalityPlot
        y={1000000}
        above={false}
        color={colors.blue}
        startFrame={11}
        endFrame={11}
        stepIndex={stepIndex}
      />

      <Point
        color={colors.blue}
        startFrame={0}
        endFrame={8}
        stepIndex={stepIndex}
        labelContext={() => `$x$`}
        labelAttach="ne"
      />

      <Blob
        center={[0,-0.5]}
        size={1.75}
        harmonicsConfig={{ scale: 0.1, seed: 500 }}
        color={colors.blue}
        startFrame={9}
        endFrame={10}
        stepIndex={stepIndex}
      />

      <Circle
        center={[0,-0.5]}
        keyframes={circleKeyframes}
        stepIndex={stepIndex}
        color={colors.purple}
        strokeStyle="dashed"
        fillOpacity={0.2}
        strokeOpacity={0.4}
      />

      {Array.from({ length: 100 }, (_, n) => (
        <Circle
          key={n}
          center={spiralCurve(n)}
          keyframes={spiralKeyframes}
          stepIndex={stepIndex}
          color={colors.purple}
          strokeStyle="dashed"
          fillOpacity={0.2}
          strokeOpacity={0.4}
          showCenterPoint={false}
        />
      ))}

      <Blob
        center={[0,-0.5]}
        size={2}
        harmonicsConfig={{ scale: 0.15, seed: 502 }}
        color={colors.blue}
        startFrame={14}
        endFrame={16}
        stepIndex={stepIndex}
        labelContext={() => `$A$`}
        labelAttach="e"
      />

      <Circle
        center={[0,-0.5]}
        keyframes={circle2Keyframes}
        stepIndex={stepIndex}
        color={colors.red}
        strokeStyle="dashed"
        fillOpacity={0.1}
        strokeOpacity={0.3}
        labelContext={() => `$N_R(x)$`}
        labelAttach="nw"
        labelAttachDistance={40}
      />

      {Array.from({ length: 25 }, (_, n) => (
        <Circle
          key={n}
          center={spiralCurve2(n)}
          keyframes={spiral2Keyframes}
          stepIndex={stepIndex}
          color={colors.purple}
          strokeStyle="dashed"
          fillOpacity={0.2}
          strokeOpacity={0.4}
          showCenterPoint={false}
        />
      ))}

      {Array.from({ length: 100 }, (_, n) => (
        <Circle
          key={n}
          center={spiralCurve3(n)}
          keyframes={spiral3Keyframes}
          stepIndex={stepIndex}
          color={colors.purple}
          strokeStyle="dashed"
          fillOpacity={0.2}
          strokeOpacity={0.4}
          showCenterPoint={false}
        />
      ))}
      
      <Point
        color={colors.red}
        startFrame={11}
        endFrame={11}
        stepIndex={stepIndex}
        labelContext={() => `$N_1(z)$`}
        labelAttach="s"
        labelAttachDistance={35}
        movable={true}
      />

    </BaseScene>
  )
}

export default TotalBoundedness

