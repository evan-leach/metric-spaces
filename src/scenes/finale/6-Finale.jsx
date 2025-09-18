import { useMemo } from 'react'
import BaseScene from '../../components/BaseScene'
import { colors } from '../../config/colors'
import Intersection from '../../components/objects/Intersection'
import Point from '../../components/objects/Point'
import Blob, { generateHarmonics, createBlobRadiusFunction } from '../../components/objects/Blob'
import Circle from '../../components/objects/Circle'
import ConstrainedMovablePoint from '../../components/objects/ConstrainedMovablePoint'
import { useKeyframeAnimation } from '../../hooks/useKeyframeAnimation'

export const SceneConfig = {
  zoom: { min: 0.6, max: 100 },
  steps: [
    "TOP: When a set $A$ is finite, we already have a simple strategy to extract a finite subcover from any cover of $A$. Because each\
    point in $A$ is contained in some open set in the cover...",
    "TOP: ...we can just choose one open set from our collection to cover each point. Since the number of sets in the subcover is\
    no more than the number of points in $A$, this gives us a finite subcover whenever $A$ is finite.",
    "The Lebesgue number lemma gives us a technique to apply this same argument to infinite sets. Instead of points, though,\
    we need to use small neighborhoods.",
    "TOP: We'll begin with an arbitrary open cover of a sequentially compact set $A$.",
    "TOP: The Lebesgue number lemma gives us a Lebesgue number $r > 0$ such that every neighborhood of radius $r$ around a point in\
    $A$ is fully contained in some open set in the cover.",
    "TOP: Now we'll use the fact that sequentially compact sets are totally bounded. $$$$ In other words, $A$ can be covered by\
    finitely many neighborhoods of any radius.",
    "TOP: Let's use the Lebesgue number that we obtained from the lemma and cover $A$ by finitely many neighborhoods of radius $r$.",
    "TOP: Even though the set $A$ could be infinite, we now have only _finitely many_ neighborhoods. Since $r$ is a Lebesgue number,\
    each of these neighborhoods is fully contained in some open set in the cover.",
    "TOP: We're now in exactly the same situation as when $A$ was finite! $$$$ We can choose one open set from the cover containing\
    each neighborhood. Because there are only finitely many neighborhoods, this gives us a finite subcollection of our open cover.",
    "TOP: Since this subcollection covers all the neighborhoods, which in turn cover $A$, the subcollection must also cover $A$. $$$$\
    We have found a finite subcover!",
    "TOP: This process of finding a finite subcover works for _any_ open cover of $A$, so $A$ is compact. $$$$ This completes the proof!",
    "This argument finally reveals why the definition of compactness uses _open_ covers instead of any other type of cover. If an open\
    set covers a point $x$, then it must also cover some neighborhood of $x$. This means that, instead of requiring compact sets to be\
    made up of finitely many points, we are requiring them to be made up of finitely many _neighborhoods._",
    "In other words, even if a compact set $A$ is not finite, it consists of finitely many \"small regions\", where these regions\
    are determined by the open cover we choose.",
    "Now that we've completed the last proof, we can see the whole chain of implications: $$\\text{Compact}$$ $$\\Updownarrow$$\
    $$\\text{Sequentially compact}$$ $$\\Updownarrow$$ $$\\text{Complete and totally bounded}$$",
    "The biggest takeaway we get from this completed chain is the _characterization_ of compact sets: a set is compact _if and only if_\
    it is complete and totally bounded.",
    "TOP: In other words, we have decomposed the property of compactness into two simple properties: completeness and total boundedness.\
    $$$$ We can visualize this decomposition with another Venn diagram.",
    "Unlike the rather unhelpful decomposition of finite sets we saw in the previous section, this decomposition is extremely useful\
    since it gives us a way to _prove_ that a given set is compact. Instead of wrestling with open covers, we just need to check\
    for completeness and total boundedness.",
    "TOP: In particular, we finally have examples of infinite compact sets! We proved that, in the coordinate plane, the complete and\
    totally bounded sets are precisely the closed and bounded sets. This means that all of these closed and bounded sets are compact.",
    "With that, we have reached the end of our exploration. $$$$ We began with just two simple ingredients: sets and distance functions.\
    Our first constructions were balls and neighborhoods, and used these to define interiors, exteriors, and boundaries. With these\
    concepts, we developed open and closed sets, as well as limit points.",
    "We discovered how these sets behaved under unions and intersections, and we saw our intuition fall apart in the infinite setting.\
    $$$$ We then tackled infinite sets directly by defining compactness. We saw what we can do with this property, and we proved exactly\
    _which_ sets are compact. $$$$ So much can be developed from nothing more than a set and a metric!",
    "Thank you for taking this journey through metric spaces with me. $$$$ I really hope you enjoyed it."
  ]
}

function Finale({ windowSize, stepIndex, isPanelOpen, sceneKey }) {

  const blobSize = 3

  const blobHarmonics = generateHarmonics(0.2, 560, blobSize)

  const getBlobRadius = createBlobRadiusFunction(blobSize, blobHarmonics)

  const zKeyframes = useMemo(() => ({
    radius: {
      0: 0,
      5: 0.42,
      6: 0
    }
  }), [])

  const pointLocations = [
    [-1.9,-0.5],
    [2.5,-1],
    [0.5,-2],
    [-0.4,0],
    [-3,-1.5]
  ]

  const blobs = useMemo(() => [
    { center: [-1,-0.5], size: 3, seed: 410, scale: 0.2 },
    { center: [2,-1], size: 1, seed: 411, scale: 0.1 },
    { center: [-1,0], size: 1.5, seed: 412, scale: 0.2 },
    { center: [-3,-1.5], size: 0.9, seed: 413, scale: 0.1 }
  ], [])

  const extraBlobs = useMemo(() => [
    { center: [2,-3], size: 1, seed: 415, scale: 0.1 },
    { center: [-3,1.5], size: 1.5, seed: 416, scale: 0.15 },
    { center: [0,0], size: 0.2, seed: 419, scale: 0.1 },
    { center: [0,0], size: 0.05, seed: 422, scale: 0.1 },
    { center: [-2,-1], size: 2, seed: 423, scale: 0.1 },
    { center: [0,-2], size: 0.22, seed: 426, scale: 0.1 }
  ], [])

  const circlesKeyframes = useMemo(() => ({
    radius: {
      3: 0,
      4: 1,
      9: 0
    }
  }), [])

  const purpleKeyframes = useMemo(() => ({
    radius: {
      6: 0,
      7: 0.42,
      11: 0
    }
  }), [])

  const chaoticCurve = (t) => {
    const sx = t * t / 1.063
    const sy = t * t / 1.18
    const x = 4 * Math.abs(sx - Math.floor(sx) - 0.5) - 1
    const y = 4 * Math.abs(sy - Math.floor(sy) - 0.5) - 1
    return [
      3 * x * x * x,
      3 * y * y * y - 0.5
    ]
  }

  const chaoticCurve2 = (t) => {
    const px = (t * 0.1) % 1 - 0.5
    const py = t * 0.01 - 0.5
    const x = 6 * px + 0.5
    const y = 6 * py - 0.25

    const angle = Math.atan2(y,x)
    const boundaryRadius = getBlobRadius(angle)
    const attemptedDistance = Math.sqrt(x * x + y * y)

    if (attemptedDistance > boundaryRadius) {
      return [
        boundaryRadius * x / attemptedDistance,
        boundaryRadius * y / attemptedDistance - 1
      ]
    }
    return [
      x,
      y - 1
    ]
  }

  const vennKeyframes = useMemo(() => ({
    radius: {
      0: 2
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

      {pointLocations.map((loc, index) => (
        <Point
          key={`point-${index}`}
          center={loc}
          color={colors.red}
          startFrame={0}
          endFrame={2}
          stepIndex={stepIndex}
          labelContext={index == 1 ? () => "$A$" : null}
        />
      ))}

      {extraBlobs.map((blob, index) => (
        <Blob
          key={`blob-${index}`}
          center={blob.center}
          size={blob.size}
          harmonicsConfig={{ scale: blob.scale, seed: blob.seed }}
          color={colors.blue}
          style="dashed"
          fillOpacity={0.2}
          strokeOpacity={0.4}
          startFrame={0}
          endFrame={1}
          stepIndex={stepIndex}
        />
      ))}

      {blobs.map((blob, index) => (
        <Blob
          key={`blob-${index}`}
          center={blob.center}
          size={blob.size}
          harmonicsConfig={{ scale: blob.scale, seed: blob.seed }}
          color={colors.blue}
          style="dashed"
          fillOpacity={0.2}
          strokeOpacity={0.4}
          startFrame={0}
          endFrame={2}
          stepIndex={stepIndex}
        />
      ))}

      <Blob
        center={[0,-1]}
        size={3}
        harmonicsConfig={{ scale: 0.2, seed: 560 }}
        color={colors.gray}
        style='solid'
        startFrame={4}
        endFrame={11}
        stepIndex={stepIndex}
        labelContext={() => `$A$`}
        labelAttach='se'
      />

      {Array.from({ length: 110 }, (_, n) => (
        <Circle
          key={n}
          center={chaoticCurve2(n)}
          keyframes={purpleKeyframes}
          stepIndex={stepIndex}
          color={colors.purple}
          strokeStyle="dashed"
          fillOpacity={0.2}
          strokeOpacity={0.4}
          showCenterPoint={false}
        />
      ))}

      <Blob
        center={[0,-1]}
        size={2.5}
        harmonicsConfig={{ scale: 0.4, seed: 561 }}
        color={colors.blue}
        fillOpacity={0.2}
        strokeOpacity={0.4}
        style='dashed'
        startFrame={4}
        endFrame={11}
        stepIndex={stepIndex}
      />
      <Blob
        center={[-1.5,-1.5]}
        size={2.5}
        harmonicsConfig={{ scale: 0.4, seed: 562 }}
        color={colors.blue}
        fillOpacity={0.2}
        strokeOpacity={0.4}
        style='dashed'
        startFrame={4}
        endFrame={11}
        stepIndex={stepIndex}
      />
      <Blob
        center={[1.5,-0.5]}
        size={2.5}
        harmonicsConfig={{ scale: 0.4, seed: 563 }}
        color={colors.blue}
        fillOpacity={0.2}
        strokeOpacity={0.4}
        style='dashed'
        startFrame={4}
        endFrame={11}
        stepIndex={stepIndex}
      />
      <Blob
        center={[0.5,1.5]}
        size={2.5}
        harmonicsConfig={{ scale: 0.4, seed: 565 }}
        color={colors.blue}
        fillOpacity={0.2}
        strokeOpacity={0.4}
        style='dashed'
        startFrame={4}
        endFrame={11}
        stepIndex={stepIndex}
      />
      <Blob
        center={[-1.7,1]}
        size={1.8}
        harmonicsConfig={{ scale: 0.2, seed: 566 }}
        color={colors.blue}
        fillOpacity={0.2}
        strokeOpacity={0.4}
        style='dashed'
        startFrame={4}
        endFrame={11}
        stepIndex={stepIndex}
      />
      <Blob
        center={[1.5,-2.5]}
        size={1.8}
        harmonicsConfig={{ scale: 0.2, seed: 567 }}
        color={colors.blue}
        fillOpacity={0.2}
        strokeOpacity={0.4}
        style='dashed'
        startFrame={4}
        endFrame={11}
        stepIndex={stepIndex}
      />
      <Blob
        center={[-0.3,-3.7]}
        size={2.2}
        harmonicsConfig={{ scale: 0.2, seed: 569 }}
        color={colors.blue}
        fillOpacity={0.2}
        strokeOpacity={0.4}
        style='dashed'
        startFrame={4}
        endFrame={11}
        stepIndex={stepIndex}
      />

      {Array.from({ length: 40 }, (_, n) => {
        return (
          <Circle
            key={n}
            center={chaoticCurve(n)}
            keyframes={circlesKeyframes}
            stepIndex={stepIndex}
            color={colors.blue}
            strokeStyle='dashed'
            fillOpacity={0.2}
            strokeOpacity={0.4}
            radiusScale={10/(n+10) + 0.5}
            showCenterPoint={false}
          />
        );
      })}

      <Circle
        center={[-1.4,-0.8]}
        keyframes={vennKeyframes}
        stepIndex={stepIndex}
        labelContext={() => `$\\text{Complete sets}$`}
        startFrame={16}
        endFrame={16}
        labelAttach="sw"
        labelAttachDistance={80}
        showCenterPoint={false}
      />
      
      <Circle
        center={[1.4,-0.8]}
        keyframes={vennKeyframes}
        stepIndex={stepIndex}
        labelContext={() => `$\\text{Totally bounded sets}$`}
        startFrame={16}
        endFrame={16}
        labelAttach="se"
        labelAttachDistance={100}
        showCenterPoint={false}
      />

      <Intersection
        shapes={[
          { type: 'circle', center: [-1.4, -0.8], radius: 2 },
          { type: 'circle', center: [1.4, -0.8], radius: 2 }
        ]}
        color={colors.red}
        startFrame={16}
        endFrame={16}
        stepIndex={stepIndex}
      />

      <Circle
        center={[0,-0.8]}
        keyframes={vennKeyframes}
        stepIndex={stepIndex}
        color={colors.red}
        fillOpacity={0}
        strokeOpacity={0}
        startFrame={16}
        endFrame={16}
        labelContext={() => `$\\text{Compact sets}$`}
        labelAttach="s"
        radiusScale={0.7142}
        showCenterPoint={false}
      />

      <ConstrainedMovablePoint
        center={[0,-1]}
        startFrame={5}
        endFrame={5}
        stepIndex={stepIndex}
        constraintFunction={getBlobRadius}
        marginPixels={0}
        initialPosition={[1,-2.5]}
        color={colors.orange}
        showCircle={true}
        circleKeyframes={zKeyframes}
        circleFillOpacity={0.2}
        circleStrokeOpacity={0.4}
        circleWeight={2}
        circleStrokeStyle="dashed"
      />

      <Blob
        size={1.5}
        center={[2.5, -1]}
        color={colors.blue}
        harmonicsConfig={{ scale: 0.2, seed: 470 }}
        startFrame={18}
        endFrame={18}
        stepIndex={stepIndex}
      />

      <Blob
        size={1.5}
        center={[-2.5, 0]}
        color={colors.green}
        harmonicsConfig={{ scale: 0.2, seed: 12 }}
        startFrame={18}
        endFrame={18}
        stepIndex={stepIndex}
      />

      <Circle
        center={[-0.3, -2]}
        keyframes={vennKeyframes}
        stepIndex={stepIndex}
        color={colors.red}
        fillOpacity={0.4}
        strokeOpacity={0.8}
        startFrame={18}
        endFrame={18}
        radiusScale={0.4}
        showCenterPoint={false}
      />


    </BaseScene>
  )
}

export default Finale

