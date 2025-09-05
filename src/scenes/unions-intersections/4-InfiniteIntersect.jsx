import { useMemo } from 'react'
import BaseScene from '../../components/BaseScene'
import { colors } from '../../config/colors'
import Circle from '../../components/objects/Circle'
import Point from '../../components/objects/Point'
import Blob from '../../components/objects/Blob'

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
    "TOP: Now let's consider an arbitrary neighborhood $N_r(x)$ of $x$.",
    "TOP: No matter how small $N_r(x)$ is, its radius will be larger than one of the open sets $N_{1/k}(x)$ in our collection.\
    $$$$ Since the radii of these neighborhoods get closer and closer to $0$, we just need to look at a radius which is even\
    closer to $0$ than $r$.",
    "TOP: The neighborhood $N_r(x)$ is not a subset of $N_{1/k}(x)$, so it is not a subset of the intersection. ",
    "TOP: If we shrink the neighborhood $N_r(x)$, we can fit it inside of this _particular_ $N_{1/k}(x)$. However, there will\
    always be some _other_ neighborhood in our collection which is even smaller than $N_r(x)$.",
    "TOP: Since no neighborhood of $x$ is a subset of the intersection, this means that $x$ is not an interior point. The\
    intersection is therefore not open!",
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

  const neighborhoodsKeyframes = useMemo(() => ({
    radius: {
      1: 0.33,
      5: 0
    }
  }), [])

  const neighborhoods2Keyframes = useMemo(() => ({
    radius: {
      1: 0,
      2: 0.33,
      5: 0
    }
  }), [])

  const neighborhoods3Keyframes = useMemo(() => ({
    radius: {
      6: 0,
      7: 0.8,
      14: 0
    }
  }), [])

  const xNeighborhoodKeyframes = useMemo(() => ({
    radius: {
      8: 0,
      9: 0.23,
      12: 0.03,
      14: 0
    }
  }), [])

  const neighborhoods = useMemo(() => ([
    { radiusScale: 1.35 },
    { radiusScale: 1.1143 },
    { radiusScale: 1 },
    { radiusScale: 0.55 }
  ]), [])

  const neighborhoods2 = useMemo(() => ([
    { radiusScale: 0.45 },
    { radiusScale: 0.2 },
    { radiusScale: 0.1 },
    { radiusScale: 0.03 },
    { radiusScale: 0.01 },
    { radiusScale: 0.002 }
  ]), [])

  const dashedBlobs = useMemo(() => [
    { center: [-1, -0.1], size: 1.1, seed: 2001, scale: 0.12, },
    { center: [-0.4, 0.4], size: 1.2, seed: 2002, scale: 0.22 },
    { center: [0.2, -1.5], size: 1.3, seed: 2003, scale: 0.16 },
    { center: [1, -0.5], size: 1.9, seed: 2004, scale: 0.28 }
  ], [])

  const dashedBlobs2 = useMemo(() => [
    { center: [-0.44, -0.45], size: 0.3, seed: 2101, scale: 0.12, },
    { center: [-0.28, -0.41], size: 0.1, seed: 2102, scale: 0.07 },
    { center: [-0.3, -0.45], size: 0.007, seed: 2103, scale: 0.03 },
    { center: [-0.3, -0.45], size: 0.002, seed: 2104, scale: 0.02 }
  ], [])

  const skip1 = 4
  const skip2 = 32

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
          endFrame={4}
          stepIndex={stepIndex}
        />
      ))}

      {dashedBlobs2.map((blob, index) => (
        <Blob
          key={`dashed-blob-${index}`}
          center={blob.center}
          size={blob.size}
          harmonicsConfig={{ scale: blob.scale, seed: blob.seed }}
          color={colors.blue}
          style="dashed"
          fillOpacity={0.3}
          strokeOpacity={0.45}
          startFrame={2}
          endFrame={4}
          stepIndex={stepIndex}
        />
      ))}

      {neighborhoods.map((neighborhood, index) => (
        <Circle
          key={`neighborhood-${index}`}
          center={[-0.3, -0.45]}
          keyframes={neighborhoodsKeyframes}
          radiusScale={neighborhood.radiusScale}
          color={colors.red}
          strokeStyle="dashed"
          stepIndex={stepIndex}
          showCenterPoint={index === 0 ? true : false}
        />
      ))}

      {neighborhoods2.map((neighborhood, index) => (
        <Circle
          key={`neighborhood-${index}`}
          center={[-0.3, -0.45]}
          keyframes={neighborhoods2Keyframes}
          radiusScale={neighborhood.radiusScale}
          color={colors.red}
          strokeStyle="dashed"
          stepIndex={stepIndex}
          showCenterPoint={false}
        />
      ))}
      
      {Array.from({ length: 100 }, (_, n) => {
        
        const fillOpacity = 0.2;
        const strokeOpacity = 0.4;
        
        return (
          <Circle
            key={n}
            center={[0, -0.8]}
            keyframes={neighborhoods3Keyframes}
            stepIndex={stepIndex}
            color={colors.blue}
            fillOpacity={fillOpacity}
            strokeOpacity={strokeOpacity}
            strokeStyle='dashed'
            radiusScale={1/n}
            showCenterPoint={false}
          />
        );
      })}

      <Circle
        center={[0, -0.8]}
        keyframes={neighborhoods3Keyframes}
        stepIndex={stepIndex}
        startFrame={10}
        endFrame={11}
        color={colors.purple}
        fillOpacity={0.3}
        strokeOpacity={0.6}
        strokeStyle='dashed'
        radiusScale={1/skip1}
        showCenterPoint={false}
        labelContext={() => `$N_{1/${skip1}}(x)$`}
        labelAttach='n'
      />

      <Circle
        center={[0, -0.8]}
        keyframes={neighborhoods3Keyframes}
        stepIndex={stepIndex}
        startFrame={12}
        endFrame={12}
        color={colors.purple}
        fillOpacity={0.3}
        strokeOpacity={0.6}
        strokeStyle='dashed'
        radiusScale={1/skip2}
        showCenterPoint={false}
        labelContext={() => `$N_{1/${skip2}}(x)$`}
        labelAttach='n'
      />

      <Point
        center={[0, -0.8]}
        color={colors.red}
        startFrame={8}
        endFrame={13}
        stepIndex={stepIndex}
        labelContext={() => "$x$"}
        labelAttach="sw"
      />

      <Circle
        center={[0, -0.8]}
        keyframes={xNeighborhoodKeyframes}
        color={colors.red}
        strokeStyle="dashed"
        stepIndex={stepIndex}
        labelContext={() => `$N_r(x)$`}
        labelAttach="e"
        showCenterPoint={false}
        labelAttachDistance={45}
      />
    </BaseScene>
  )
}

export default InfiniteIntersect
