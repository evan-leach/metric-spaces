import { useMemo } from 'react'
import BaseScene from '../../components/BaseScene'
import { colors } from '../../config/colors'
import Intersection from '../../components/objects/Intersection'
import Circle from '../../components/objects/Circle'
import Point from '../../components/objects/Point'
import Blob from '../../components/objects/Blob'
import InequalityPlot from '../../components/objects/InequalityPlot'
import Polygon from '../../components/objects/Polygon'
import { useKeyframeAnimation } from '../../hooks/useKeyframeAnimation'

export const SceneConfig = {
  zoom: { min: 0.2, max: 100 },
  steps: [
    "Our strategy for this proof is similar to the last one. We will consider an arbitrary finite collection of open\
    sets, take an arbitrary point in the intersection, and try to find a neighborhood of that point that lies entirely\
    in the intersection. $$$$ As we go, you should try to figure out where the argument falls apart for infinitely many\
    sets.",
    "TOP: Because there are only finitely many sets this time, we'll give them labels: $A_1$, $A_2$, $A_3$, and so on.",
    "TOP: If the intersection of all these sets is empty, then we don't have a problem since the empty set is open.\
    Otherwise, though, let's consider an arbitrary point $x$ in the intersection.",
    "TOP: Since $x$ lies in $A_1$, which we know is an open set, we can find a neighborhood $N_{r_1}(x)$ of $x$ which\
    lies entirely in $A_1$.",
    "TOP: In the last proof, this neighborhood was all we needed, but it no longer works this time! Even though it lies\
    in the _union_ of our open sets, it might not lie in the _intersection_ (which is the case here).",
    "TOP: We can still make the proof work with a little more effort, though. Notice that since $x$ lies in $A_2$, which\
    is an open set, we can find a neighborhood $N_{r_2}(x)$ which lies in $A_2$.",
    "TOP: We can repeat this process for every open set in our collection, and we end up with a collection $$N_{r_1}(x),\
    N_{r_2}(x), \\dots, N_{r_n}(x)$$ of neighborhoods, each of which lie in their respective open sets.",
    "TOP: In order to prove that $x$ is an interior point, though, we need to find a _single_ neighborhood which is a\
    subset of _all_ these open sets. $$$$ We've already seen that picking a random neighborhood from this collection\
    might not work, so what do we do?",
    "TOP: The trick is to consider the _smallest_ one. This neighborhood lies in all of the other neighborhoods,\
    so it is a subset of all of our open sets. In other words, it lies entirely in the intersection!",
    "Since we've shown that every point $x$ in the intersection of our open sets is an interior point, this proves\
    that the intersection is open.",
    "TOP: Here's an example of how we can use this fact. This square, consisting of all points whose $x$ and $y$\
    coordinates are both strictly between $-1$ and $1$, is open...",
    "TOP: ...because it's the intersection of these two strips (which we proved in the last lesson were open).",
    "At the start of this lesson, we mentioned that this proof only works for a finite number of open sets. Why? $$$$\
    We'll see in the next lesson exactly where things can go wrong if infinitely many open sets are involved."
  ]
}

function OpenIntersect({ windowSize, stepIndex, isPanelOpen, sceneKey }) {

  const neighborhoodKeyframes = useMemo(() => ({
    radius: {
      3: 0,
      4: 0.33,
      6: 0
    }
  }), [])

  const neighborhood2Keyframes = useMemo(() => ({
    radius: {
      5: 0,
      6: 0.39,
      9: 0
    }
  }), [])

  const neighborhoodsKeyframes = useMemo(() => ({
    radius: {
      6: 0,
      7: 0.33,
      9: 0
    }
  }), [])

  const smallKeyframes = useMemo(() => ({
    radius: {
      6: 0,
      7: 0.33,
      10: 0
    }
  }), [])

  const labelKeyframes = useMemo(() => ({
    fillOpacity: {
      6: 1,
      7: 0
    }
  }), [])

  const intersectionKeyframes = useMemo(() => ({
    fillOpacity: {
      2: 0,
      3: 1,
      4: 0,
      5: 1,
      6: 0,
      9: 1,
      10: 0
    }
  }), [])

  const intersectionProps = useKeyframeAnimation(intersectionKeyframes, stepIndex)
  const intersectionOpacity = intersectionProps.fillOpacity ?? 0.2
  const labelProps = useKeyframeAnimation(labelKeyframes, stepIndex)
  const labelOpacity = labelProps.fillOpacity ?? 0.2

  const dashedBlobs = useMemo(() => [
    
    { center: [-1, -0.1], size: 1.1, seed: 2001, scale: 0.12, attach: 'w' },
    { center: [-0.4, 0.4], size: 1.2, seed: 2002, scale: 0.22, attach: 'n' },
    { center: [0.2, -1.5], size: 1.3, seed: 2003, scale: 0.16, attach: 'sw' },
    { center: [1, -0.5], size: 1.9, seed: 2004, scale: 0.28, attach: 'se' }
    
  ], [])

  return (
    <BaseScene
      config={SceneConfig}
      sceneKey={sceneKey}
      stepIndex={stepIndex}
      isPanelOpen={isPanelOpen}
      windowSize={windowSize}
    >
      {dashedBlobs.map((blob, index) => (
        <Blob
          key={`dashed-blob-${index}`}
          center={blob.center}
          size={blob.size}
          harmonicsConfig={{ scale: blob.scale, seed: blob.seed }}
          color={colors.blue}
          style="dashed"
          fillOpacity={0.2}
          strokeOpacity={0.3}
          startFrame={0}
          endFrame={9}
          stepIndex={stepIndex}
          labelContext={() => `$A_${index + 1}$`}
          labelAttach={blob.attach}
        />
      ))}

      <Intersection
        shapes={dashedBlobs.map(blob => ({
          type: 'blob',
          center: blob.center,
          size: blob.size,
          harmonicsConfig: { scale: blob.scale, seed: blob.seed }
        }))}
        color={colors.orange}
        fillOpacity={0.15 * intersectionOpacity}
        strokeOpacity={0.6 * intersectionOpacity}
        stepIndex={stepIndex}
        style="dashed"
      />

      <Blob
        center={[-1, -0.1]}
        size={1.1}
        harmonicsConfig={{ seed: 2001, scale: 0.12 }}
        color={colors.purple}
        style="dashed"
        fillOpacity={0.3}
        strokeOpacity={0.6}
        startFrame={4}
        endFrame={4}
        stepIndex={stepIndex}
        labelContext={() => "$A_1$"}
        labelAttach="w"
      />

      <Blob
        center={[-0.4, 0.4]}
        size={1.2}
        harmonicsConfig={{ seed: 2002, scale: 0.22 }}
        color={colors.purple}
        style="dashed"
        fillOpacity={0.3}
        strokeOpacity={0.6}
        startFrame={6}
        endFrame={6}
        stepIndex={stepIndex}
        labelContext={() => "$A_2$"}
        labelAttach="w"
      />

      <Point
        center={[-0.3, -0.45]}
        color={colors.red}
        startFrame={3}
        endFrame={9}
        stepIndex={stepIndex}
        labelContext={() => "$x$"}
        labelAttach="sw"
      />

      <Circle
        center={[-0.3, -0.45]}
        keyframes={neighborhoodKeyframes}
        color={colors.red}
        strokeStyle="dashed"
        stepIndex={stepIndex}
        labelContext={() => `$N_{r_1}(x)$`}
        labelAttach="e"
        labelAttachDistance={45}
        labelOpacity={labelOpacity}
      />

      <Circle
        center={[-0.3, -0.45]}
        keyframes={neighborhood2Keyframes}
        color={colors.red}
        strokeStyle="dashed"
        stepIndex={stepIndex}
        labelContext={() => `$N_{r_2}(x)$`}
        labelAttach="n"
        labelAttachDistance={30}
        labelOpacity={labelOpacity}
      />

      <Circle
        center={[-0.3, -0.45]}
        keyframes={neighborhoodsKeyframes}
        color={colors.red}
        strokeStyle="dashed"
        stepIndex={stepIndex}
      />
      <Circle
        center={[-0.3, -0.45]}
        keyframes={smallKeyframes}
        radiusScale={0.55}
        color={colors.red}
        strokeStyle="dashed"
        stepIndex={stepIndex}
      />
      <Circle
        center={[-0.3, -0.45]}
        keyframes={neighborhoodsKeyframes}
        radiusScale={1.35}
        color={colors.red}
        strokeStyle="dashed"
        stepIndex={stepIndex}
      />

      <InequalityPlot
        yInequality={{ 
          ">=": (x) => -0.8,
          "<=": (x) => 0.8
        }}
        style="dashed"
        fillOpacity={0.15}
        strokeOpacity={0.6}
        color={colors.blue}
        startFrame={12}
        endFrame={12}
        stepIndex={stepIndex}
      />
      <InequalityPlot
        xInequality={{ 
          ">=": (y) => -0.8,
          "<=": (y) => 0.8
        }}
        style="dashed"
        fillOpacity={0.15}
        strokeOpacity={0.6}
        color={colors.blue}
        startFrame={12}
        endFrame={12}
        stepIndex={stepIndex}
      />

      <Polygon
        points={[
          [-0.8,-0.8],
          [0.8,-0.8],
          [0.8,0.8],
          [-0.8,0.8]
        ]}
        strokeStyle='dashed'
        color={colors.orange}
        startFrame={11}
        endFrame={12}
        stepIndex={stepIndex}
      />
    </BaseScene>
  )
}

export default OpenIntersect
