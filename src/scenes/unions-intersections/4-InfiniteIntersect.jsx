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
    "TOP: In the last proof, we chose an arbitrary point $x$ in our intersection and constructed a collection of\
    neighborhoods around it.",
    "TOP: There's nothing stopping us from doing this for a intersection of infinitely many open sets. We end up with an\
    infinite collection of neighborhoods of $x$, each contained in one of the open sets.",
    "TOP: Last time, our final step was to chose the smallest neighborhood in the collection.\ In particular, we chose the\
    neighborhood with the smallest radius and saw that it was a subset of the intersection.",
    "TOP: We could find the smallest neighborhood because there were only finitely many of these neighborhoods, so there\
    were finitely many radii. In finite sets of numbers such as this, there is _always_ a minimum.",
    "However, it's not always the case that an _infinite_ set of numbers has a minimum. For example, consider the infinite\
    collection $$1, \\frac{1}{2}, \\frac{1}{3}, \\frac{1}{4}, \\frac{1}{5}, \\frac{1}{6}, \\dots \\text{.}$$\
    These numbers get closer and closer to $0$, but they never reach it. No one number in this collection is smallest!",
    "We can use this idea to come up with an example of an infinite intersection of open sets not being open.",
    "TOP: We'll use an infinite collection of neighborhoods of a point $x$ with radii $1$, $\\frac{1}{2}$,\
    $\\frac{1}{3}$, and so on.",
    "TOP: Since these sets are neighborhoods, they are open. $$$$ Also, the point $x$ itself lies in all of these sets, so it\
    is an element of the intersection.",
    "TOP: For _any_ neighborhood $N_r(x)$ of $x$, though, no matter how small, its radius will be larger than one of the\
    open sets $N_{1/k}(x)$ in our collection. $$$$ Since the radii of these neighborhoods get closer and closer to $0$, we\
    just need to look at a radius which is even closer to $0$ than $r$.",
    "TOP: The neighborhood $N_r(x)$ is not a subset of $N_{1/k}(x)$, so it is not a subset of the intersection. ",
    "TOP: We can't resolve this by just picking a smaller neighborhood, either. If we shrink the neighborhood $N_r(x)$,\
    we can fit it inside of this _particular_ $N_{1/k}(x)$. However, there will always be some _other_ neighborhood in our\
    collection which is even smaller than $N_r(x)$.",
    "TOP: Since no neighborhood of $x$ is a subset of the intersection, this means that $x$ is not an interior point. For this\
    reason, the intersection is not open!",
    "We've seen yet again an example of where infinity breaks the rules we would expect. We are used to thinking that every\
    set of numbers has a minimum, but infinity defies our intuition. $$$$ When our argument relied on this assumption, infinity\
    broke it.",
    "We have now answered two of our four questions. Unions of open sets are open, and _finite_ intersections of open sets\
    are open. $$$$ We'll answer the analogous questions for closed sets in the next lesson.",
    "In fact, we've actually done most of the work already! All it will take is a clever shift of perspective to utilize our\
    existing knowledge about open sets."
  ]
}

function InfiniteIntersect({ windowSize, stepIndex, isPanelOpen, sceneKey }) {

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

export default InfiniteIntersect
