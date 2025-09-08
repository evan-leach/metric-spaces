import { useMemo } from 'react'
import BaseScene from '../../components/BaseScene'
import { colors } from '../../config/colors'
import Circle from '../../components/objects/Circle'
import Blob from '../../components/objects/Blob'
import InequalityPlot from '../../components/objects/InequalityPlot'
import Point from '../../components/objects/Point'

export const SceneConfig = {
  zoom: { min: 0.1, max: 10 },
  steps: [
    "TOP: We begin this lesson with a new definition of an intuitive concept. $$$$ This set $A$ is infinite, but we can\
    at least fit all of its points on the screen.",
    "TOP: This set $B$, on the other hand, extends out forever. No matter how much we zoom out, we can never see it all.",
    "TOP: Now zoom back in on $A$. We can capture the difference between these two sets by observing that $A$ can fit\
    within some neighborhood.",
    "TOP: The set $B$, on the other hand, is not a subset of _any_ neighborhood. Zoom out to see this! $$$$ (Note that\
    we don't allow the radius of a neighborhood to be infinite.)",
    "This observation leads us to the following definition: $$$$ A set $A$ is *bounded* if it is a subset of _some_\
    neighborhood.",
    "We are now ready to prove the claim in the title of this lesson: all compact sets are bounded.",
    "To prove anything about compact sets, the key is to construct the right open cover and take advantage of the finite\
    subcover that compactness guarantees. $$$$ In this case, we've actually seen the idea behind the proof already.",
    "TOP: Let's begin by considering an arbitrary compact set $K$.",
    "TOP: Here is our open cover. We choose an arbitrary point $x$ and consider the neighborhoods $N_1(x)$, $N_2(x)$, $N_3(x)$,\
    and so on.",
    "TOP: This is an open cover of our entire metric space, so it is certainly an open cover of $K$.",
    "TOP: Since $K$ is compact, there must be a finite subcover of this open cover.",
    "TOP: We now have a _finite_ collection of neighborhoods which cover $K$. Because this collection is finite, one of the\
    neighborhoods is _largest._",
    "TOP: This largest neighborhood contains $K$, so $K$ is bounded.",
    "This is one example of how compactness is kind of like being finite. Finite sets are always bounded, and compact sets\
    share this property. We'll see another such property in the next lesson."
  ]
}

function CompBounded({ windowSize, stepIndex, isPanelOpen, sceneKey }) {

  const firstKeyframes = useMemo(() => ({
    radius: {
      0: 0,
      3: 3,
      4: 15,
      5: 0
    }
  }), [])

  const removeKeyframes = useMemo(() => ({
    radius: {
      0: 0,
      9: 0.8,
      11: 0
    }
  }), [])

  const keepKeyframes = useMemo(() => ({
    radius: {
      0: 0,
      9: 0.8,
      13: 0
    }
  }), [])

  const finalKeyframes = useMemo(() => ({
    radius: {
      0: 0,
      9: 0.8,
      14: 0
    }
  }), [])

  const keepCircles = [1, 4, 5, 9]
  const finalCircle = 16

  return (
    <BaseScene
      config={SceneConfig}
      sceneKey={sceneKey}
      stepIndex={stepIndex}
      isPanelOpen={isPanelOpen}
      windowSize={windowSize}
    >
      <Blob
        center={[0,-1]}
        size={2}
        harmonicsConfig={{ scale: 0.2, seed: 450 }}
        color={colors.orange}
        startFrame={0}
        endFrame={4}
        stepIndex={stepIndex}
        labelAttach='s'
        labelContext={() => "$A$"}
      />
      
      <InequalityPlot
        yInequality={{ 
          ">=": (x) => -1.6,
          "<=": (x) => 0
        }}
        style="dashed"
        fillOpacity={0.15}
        strokeOpacity={0.6}
        color={colors.purple}
        startFrame={2}
        endFrame={4}
        stepIndex={stepIndex}
      />
      <Blob
        center={[5,-0.8]}
        size={0.8}
        harmonicsConfig={{ scale: 0, seed: 450 }}
        color={colors.purple}
        fillOpacity={0}
        strokeOpacity={0}
        startFrame={2}
        endFrame={4}
        stepIndex={stepIndex}
        labelAttach='s'
        labelContext={() => "$B$"}
      />

      <Blob
        center={[0,-0.5]}
        size={8}
        harmonicsConfig={{ scale: 0.3, seed: 454 }}
        color={colors.gray}
        startFrame={8}
        endFrame={13}
        stepIndex={stepIndex}
        labelAttach='sw'
        labelContext={() => "$K$"}
      />

      <Circle
        center={[0, -1]}
        keyframes={firstKeyframes}
        stepIndex={stepIndex}
        color={colors.blue}
        strokeStyle="dashed"
        fillOpacity={0.3}
        strokeOpacity={0.6}
        labelContext={() => "$N_r(y)$"}
        labelAttachDistance={40}
      />

      {Array.from({ length: 200 }, (_, i) => {
        const n = 200 - i; // Start from 20, go down to 1
        const fillOpacity = Math.pow(0.03, (n + 150) / 150);
        const strokeOpacity = (n < 50 ? 18 : 9) * fillOpacity;
        const keyframes = keepCircles.includes(n) ? keepKeyframes : removeKeyframes;
        
        return (
          <Circle
            key={n}
            center={[0, -1.5]}
            keyframes={keyframes}
            stepIndex={stepIndex}
            color={colors.blue}
            strokeStyle={n < 50 ? "dashed" : "solid"}
            fillOpacity={fillOpacity}
            strokeOpacity={strokeOpacity}
            radiusScale={n}
            showCenterPoint={false}
          />
        );
      })}

      {keepCircles.map((n, index) => (
        <Circle
          key={n}
          center={[0, -1.5]}
          keyframes={keepKeyframes}
          stepIndex={stepIndex}
          color={colors.blue}
          strokeStyle="dashed"
          fillOpacity={0.2}
          strokeOpacity={0.4}
          startFrame={11}
          radiusScale={n}
          showCenterPoint={false}
        />
      ))}

      <Circle
        key={finalCircle}
        center={[0, -1.5]}
        keyframes={finalKeyframes}
        stepIndex={stepIndex}
        color={colors.blue}
        strokeStyle="dashed"
        fillOpacity={0.3}
        strokeOpacity={0.6}
        startFrame={11}
        radiusScale={finalCircle}
        showCenterPoint={false}
      />

      <Point
        center={[0,-1.5]}
        color={colors.blue}
        startFrame={9}
        endFrame={13}
        stepIndex={stepIndex}
        labelContext={() => "$x$"}
        labelAttach="nw"
      />
    </BaseScene>
  )
}

export default CompBounded

