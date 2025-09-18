import { useMemo } from 'react'
import BaseScene from '../../components/BaseScene'
import { colors } from '../../config/colors'
import Circle from '../../components/objects/Circle'
import Blob from '../../components/objects/Blob'
import Point from '../../components/objects/Point'

export const SceneConfig = {
  zoom: { min: 0.6, max: 1000 },
  steps: [
    "How do we define a set which is \"sort of\" finite? We can't just do this based on the number of elements, because\
    there's no such thing as a number which is infinite but \"almost finite\". $$$$ Instead, we need to take a roundabout\
    approach using the concept of a _cover._",
    "Our plan is to find an equivalent definition of finiteness using these covers, and then we'll be able to _slightly\
    modify_ it in order to get the definition of compactness. $$$$ Let's begin by defining what a cover is.",
    "TOP: This set $X$ is _not_ a subset of any of the sets $A_1$, $A_2$, or $A_3$. However, it _is_ a subset of the\
    _union_ of these sets.",
    "TOP: When this is the case, we call the collection of sets $A_1$, $A_2$, and $A_3$ a *cover* of $X$. $$$$ In other\
    words, a collection of sets covers $X$ if every point in $X$ lies in at least one of the sets in the collection.",
    "TOP: Here's another cover of $X$. You'll notice that some of the sets in the cover aren't necessary. For example, we\
    could get rid of $A_1$ since the points in $X$ it contains are also in $A_4$.",
    "TOP: We can also ditch the sets $A_5$ and $A_6$, since they don't even contain any points in $X$.",
    "TOP: This motivates another definition: $$$$ Given a cover of a set $X$, a _subcollection_ of sets in the cover which\
    _still covers_ $X$ is called a *subcover.*",
    "So far, we've only been looking at finite covers. However, covers can also contain infinitely many sets.",
    "TOP: For example, this collection of the sets $B_1(x), B_2(x), B_3(x), \\dots$ is an infinite cover of the entire\
    coordinate plane.",
    "TOP: There are lots of subcovers of this cover. For example, we could remove the sets $B_1(x)$, $B_2(x)$, and $B_3(x)$,\
    and the remaining sets would still cover the entire coordinate plane.",
    "TOP: However, there is no _finite_ subcover of this cover. $$$$ If we only keep finitely many of these sets, then there\
    must be a _largest_ one. Any point outside of this largest ball is not contained in any of the remaining sets,\
    so the finite subcollection is not a cover.",
    "TOP: Now let's look at another example. This set $F$ is finite, and it contains exactly five points.",
    "TOP: It turns out that _every_ cover of this set has a finite subcover. We'll see why on the next slide.",
    "TOP: We know that each point in $F$ lies in at least one of the sets in the cover. For each point, we can pick _exactly_\
    one of these sets in the cover containing it. $$$$ The collection of these sets is a finite subcover of $F$!",
    "TOP: We can do this for any finite set. Any cover of a set with $n$ elements has a finite subcover with at most $n$ sets.\
    $$$$ This means that for finite sets, every cover has a finite subcover.",
    "Finite sets are actually the _only_ sets for which every cover has a finite subcover. $$$$ In other words, if a set is\
    infinite, then there is an infinite cover of the set with no finite subcover. We can find this cover using a tool\
    from the previous section: _singletons._",
    "TOP: Given infinite set $X$, we can consider the cover consisting of the singletons $S_z$ for each $z$ in $X$. This is an\
    infinite cover of $X$, since $X$ contains infinitely many points.",
    "TOP: If we remove _any_ set $S_z$ from this collection, then the point $z$ won't be covered anymore. This means that our cover\
    has no finite subcover; every single set in the cover is _necessary._",
    "We've just discovered a new equivalent definition for finite sets: a set $A$ is finite if and only if every\
    cover of $A$ has a finite subcover. $$$$ This seems like an overly complicated definition, and it absolutely is! It doesn't\
    help us work with finite sets, but it reframes finiteness in a way that we can modify to get compactness.",
    "Notice that we haven't yet taken advantage of the fact that we're working in a _metric space._ We've used sets, unions, and\
    subsets, but nothing related to our distance function! There are no open sets, neighborhoods, or limit points to be seen.",
    "We can add a _single word_ to this definition to take advantage of all these tools and give the definition of compactness.\
    $$$$ We'll see what this change is in the next lesson."
  ]
}

function Covers({ windowSize, stepIndex, isPanelOpen, sceneKey }) {

  const circlesKeyframes = useMemo(() => ({
    radius: {
      0: 0,
      9: 0.8,
      11: 0
    }
  }), [])

  const removeKeyframes = useMemo(() => ({
    radius: {
      0: 0,
      9: 0.8,
      10: 0
    }
  }), [])

  const keepKeyframes = useMemo(() => ({
    radius: {
      0: 0,
      9: 0.8,
      12: 0
    }
  }), [])

  const removeCircles = [1,2,3]
  const keepCircles = [4,6,9]

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

  return (
    <BaseScene
      config={SceneConfig}
      sceneKey={sceneKey}
      stepIndex={stepIndex}
      isPanelOpen={isPanelOpen}
      windowSize={windowSize}
    >
      <Blob
        size={3}
        center={[0,-1]}
        harmonicsConfig={{ scale: 0.2, seed: 400 }}
        color={colors.gray}
        style="solid"
        labelContext={() => "$X$"}
        labelAttach="sw"
        startFrame={0}
        endFrame={7}
        stepIndex={stepIndex}
      />
      <Blob
        size={2.5}
        center={[-1.9,1]}
        harmonicsConfig={{ scale: 0.2, seed: 401 }}
        color={colors.blue}
        labelContext={() => "$A_1$"}
        labelAttach="nw"
        startFrame={0}
        endFrame={5}
        stepIndex={stepIndex}
      />
      <Blob
        size={2.5}
        center={[1,0]}
        harmonicsConfig={{ scale: 0.2, seed: 402 }}
        color={colors.blue}
        labelContext={() => "$A_2$"}
        labelAttach="ne"
        startFrame={0}
        endFrame={7}
        stepIndex={stepIndex}
      />
      <Blob
        size={3}
        center={[0.5,-2]}
        harmonicsConfig={{ scale: 0.1, seed: 411 }}
        color={colors.blue}
        labelContext={() => "$A_3$"}
        labelAttach="se"
        startFrame={0}
        endFrame={7}
        stepIndex={stepIndex}
      />
      <Blob
        size={2.8}
        center={[-1.5,0.5]}
        harmonicsConfig={{ scale: 0.1, seed: 404 }}
        color={colors.blue}
        labelContext={() => "$A_4$"}
        labelAttach="w"
        startFrame={5}
        endFrame={7}
        stepIndex={stepIndex}
      />
      <Blob
        size={1}
        center={[-4,-1.5]}
        harmonicsConfig={{ scale: 0.3, seed: 404 }}
        color={colors.blue}
        labelContext={() => "$A_5$"}
        labelAttach="sw"
        startFrame={5}
        endFrame={6}
        stepIndex={stepIndex}
      />
      <Blob
        size={1.5}
        center={[5,-0.5]}
        harmonicsConfig={{ scale: 0.2, seed: 410 }}
        color={colors.blue}
        labelContext={() => "$A_6$"}
        labelAttach="s"
        startFrame={5}
        endFrame={6}
        stepIndex={stepIndex}
      />

      {Array.from({ length: 200 }, (_, i) => {
        const n = 200 - i; // Start from 200, go down to 1
        const fillOpacity = Math.pow(0.03, (n + 150) / 150);
        const strokeOpacity = 20 * fillOpacity;
        const keyframes = keepCircles.includes(n) ? keepKeyframes : (removeCircles.includes(n) ? removeKeyframes : circlesKeyframes);
        
        return (
          <Circle
            key={n}
            center={[0, -1.5]}
            keyframes={keyframes}
            stepIndex={stepIndex}
            color={colors.blue}
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
          fillOpacity={0.2}
          strokeOpacity={0.4}
          startFrame={11}
          radiusScale={n}
          showCenterPoint={false}
        />
      ))}

      {pointLocations.map((loc, index) => (
        <Point
          key={`point-${index}`}
          center={loc}
          color={colors.red}
          startFrame={12}
          endFrame={15}
          stepIndex={stepIndex}
        />
      ))}

      {extraBlobs.map((blob, index) => (
        <Blob
          key={`blob-${index}`}
          center={blob.center}
          size={blob.size}
          harmonicsConfig={{ scale: blob.scale, seed: blob.seed }}
          color={colors.blue}
          style="solid"
          fillOpacity={0.2}
          strokeOpacity={0.4}
          startFrame={13}
          endFrame={13}
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
          style="solid"
          fillOpacity={0.2}
          strokeOpacity={0.4}
          startFrame={13}
          endFrame={15}
          stepIndex={stepIndex}
        />
      ))}

      <Blob
        size={3}
        center={[0,-1]}
        harmonicsConfig={{ scale: 0.2, seed: 430 }}
        color={colors.blue}
        style="solid"
        labelContext={() => "$X$"}
        labelAttach="sw"
        startFrame={17}
        endFrame={18}
        stepIndex={stepIndex}
      />
      <Point
        center={[0.9,-1]}
        color={colors.orange}
        startFrame={18}
        endFrame={18}
        stepIndex={stepIndex}
        labelContext={() => "$S_z$"}
        labelAttach="se"
      />
    </BaseScene>
  )
}

export default Covers

