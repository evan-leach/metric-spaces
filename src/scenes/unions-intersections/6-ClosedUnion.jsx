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
  steps: [
    "When we previous showed that not all infinite intersections of open sets are open, we had to carefully construct\
    a collection of open sets and prove that the intersection was not open. $$$$ Now it's time for a far more\
    _dramatic_ approach.",
    "TOP: This set $S_x$ contains just a single point, which we'll call $x$. We call such a set a *singleton.*",
    "TOP: This set has at most one boundary point, which is $x$ itself. Since $S_x$ contains all of its boundary, it is a closed set.",
    "TOP: Here's the key observation: _every_ set can be written as a union of singletons. $$$$ In particular, any set $A$ is the\
    union of the singletons $S_x$ for each $x$ in $A$.",
    "TOP: We just saw that singletons are closed, so _every_ set $A$ is a union of closed sets.",
    "TOP: If unions of closed sets, infinite or not, were always closed, then _every_ set would be closed. $$$$ This is clearly\
    not true! Here's an example of a set which is not closed.",
    "TOP: We are forced to conclude that infinite unions of closed sets are not necessarily closed. In fact, _any_ set which is\
    not closed is an example of an infinite union of closed sets which is not itself closed.",
    "We therefore have not only the answers to all four of our original questions, but an understanding of why finiteness is\
    necessary for intersections of open sets to be open and unions of closed sets to be closed.",
    "There's another takeaway, though. This lesson showed us that most _interesting_ sets in metric spaces are infinite! $$$$\
    If we only ever worked with finite sets, every set would be closed, and there would be no such thing as a limit point. In short,\
    almost all of our previous work would be pointless, and metric spaces would be boring.",
    "This puts us in a tricky situation. On the one hand, infinity often breaks properties we expect to hold. On the other hand,\
    infinite sets are essential! $$$$ We want to be able to work with infinite sets, but letting infinity into the picture is\
    just asking for trouble.",
    "We somehow need to _harness the infinite._ We need to find a way to work with infinite sets while still maintaining some control.",
    "The key is to consider a new type of set which is \"sort of\" finite. We call these sets _compact._",
    "We will spend the rest of our time in this exploration grappling with the concept of compactness. It will be a little more challenging\
    than what we've done so far, but the shocking and beautiful results we discover will be worth it."
  ]
}

function ClosedUnion({ windowSize, stepIndex, isPanelOpen, sceneKey }) {

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
      6: 0.37,
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

export default ClosedUnion
