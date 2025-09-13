import { useMemo } from 'react'
import BaseScene from '../../components/BaseScene'
import Blob from '../../components/objects/Blob'
import Point from '../../components/objects/Point'
import { useKeyframeAnimation } from '../../hooks/useKeyframeAnimation'
import { colors } from '../../config/colors'
import InequalityPlot from '../../components/objects/InequalityPlot'
import Union from '../../components/objects/Union'

export const SceneConfig = {
  steps: [
    "TOP: We learned in the last lesson that an open set doesn't contain any of its boundary, and the definition of closed\
    sets looks quite similar: $$$$ A set is *closed* if it contains its _entire_ boundary.",
    "TOP: For example, this set $A$ contains all of its boundary points, and this means that $A$ is a closed set.",
    "Not only do the definitions of open and closed sets sound similar, but it turns out there's a very specific connection\
    these types of sets. $$$$ To figure out what it is, there are two facts we need to discuss first.",
    "Fact #1: $$$$ The complement of the complement of a set $A$ is equal to $A$ itself. In other words, $(A^c)^c = A$. $$$$\
    The complement of $A$ is the set of all points which are not in $A$, so the complement of the complement is the set of all\
    points which are _not_ not in $A$. In other words, the complement of $A^c$ is the set of all points which _are_ in $A$.",
    "Fact #2: $$$$ The boundaries of a set and its complement are the same. $$$$ Remember that for $x$ to be a\
    boundary point of $A$, every neighborhood of $x$ must contain points both in $A$ and in $A^c$. For $x$ to be\
    a boundary point of $A^c$, every neighborhood of $x$ must contain points in both $A^c$ and $(A^c)^c$. Fact #1\
    tells us that $(A^c)^c = A$, so these conditions are identical!",
    "TOP: You can see fact #2 illustrated visually here. The boundary, highlighted in red, is the same for both $A$ and $A^c$.",
    "TOP: Here, the set $A$ contains the shared boundary in its entirety, which means that $A^c$ contains _none_ of the boundary.\
    This means that $A^c$ is open!",
    "In general, a set is closed _if and only if_ its complement is open. This is because the whole boundary is part of $A$ if and only\
    if none of the boundary is part of $A^c$. $$$$ Similarly, a set is open if and only if its complement is closed. This is because\
    none of the boundary lies in $A$ if and only if all of the boundary lies in $A^c$.",
    "In other words, open and closed sets come in pairs. Whenever you have an open or closed set, you can find the other type of set\
    by examining the complement.",
    "TOP: One consequence of this duality is that for any point $x$ and $r > 0$, the set of all points $y$ such that $d(x,y) \\geq r$\
    is closed. This is because this set is the complement of $N_r(x)$, which we proved to be open in the last lesson.",
    "If you're looking for a challenge, try to prove that the set of all points $y$ such that $d(x,y) > r$ is open. The argument\
    is very similar to what we did in the last lesson, and you'll realize that the triangle inequality again plays a key role.\
    It's best to work this out by drawing a picture. $$$$ This set is the _complement_ of $B_r(x)$, so if you can prove that\
    it's open, you will have also proven that $B_r(x)$ is closed!",
    "These facts lead many to an incorrect conclusion: that every set is either open or closed. $$$$\
    Remember that a set is open if it doesn't contain any of its boundary and closed if it contains all of its boundary. What\
    if a set contains only some of its boundary, though?",
    "TOP: This set $B$, for example, is neither open nor closed. It contains some of its boundary, but not all of it.",
    "There are even sets which are _both_ open and closed! This seems impossible at first; how can a set contain its entire\
    boundary while also not containing any of its boundary?",
    "The _only_ way this is possible is for the set to _have no boundary._ $$$$ In the coordinate plane, there are exactly two such\
    examples: the empty set and the entire plane.",
    "TOP: We can find more sets which are both open and closed by changing our metric space, though. In this example, we use the\
    same metric as usual but change up the set. Instead of the whole coordinate plane, we will use the set of all 2D points\
    whose $x$-coordinate is less than $-1$ or greater than $1$.",
    "TOP: This set $C$, consisting of all points with $x$-coordinate greater than $1$, is both closed and open. The line $x = 1$\
    would be the boundary of this set _if_ our metric space was the whole coordinate plane. But these points aren't even part of\
    this metric space! This means that $C$ has no boundary, so it is both open and closed.",
    "We can also find sets that are both open and closed by changing the metric. If we use the discrete metric, for example,\
    _every set_ is both open and closed. $$$$ Explaining why this is the case is another good challenge.",
    "We have now throughly explored the concepts of open and closed sets. We even have two equivalent definitions of a closed\
    set: a set containing its entire boundary, and a set whose complement is open. $$$$ It turns out that there's a _third_\
    equivalent definition of a closed set, and this third definition will mark the conclusion of this section.",
    "There's just one more concept we need to introduce first, and we might run into _infinity_ along the way."
  ]
}

function Closed({ 
  windowSize, 
  stepIndex, 
  isPanelOpen,
  sceneKey 
}) {

  const blobs = useMemo(() => [
    { center: [-10, 5], size: 8, seed: 18, scale: 0.2 },
    { center: [11, -5], size: 8, seed: 478, scale: 0.3 },
    { center: [2.5, 0.8], size: 2, seed: 456, scale: 0.25 },
    { center: [-1.5, 0], size: 0.3, seed: 105, scale: 0.1 }
  ], [])

  const points = useMemo(() => [
    [-3, -3],
    [-3.2, -3.1],
    [-2.9, -2.5]
  ], [])

  const colorKeyframes = useMemo(() => ({
    color: {
      5: colors.blue,
      6: colors.red,
      7: colors.blue
    }
  }), [])

  // Use keyframe animation for color
  const animatedProps = useKeyframeAnimation(colorKeyframes, stepIndex)
  const pointsColor = animatedProps.color || colors.blue

  return (

    <BaseScene
      config={SceneConfig}
      sceneKey={sceneKey}
      stepIndex={stepIndex}
      isPanelOpen={isPanelOpen}
      windowSize={windowSize}
    >
      {blobs.map((blob, index) => (
        <>
          <Blob
            key={`blob-${index}`}
            center={blob.center}
            size={blob.size}
            harmonicsConfig={{ scale: blob.scale, seed: blob.seed }}
            color={colors.blue}
            style="solid"
            startFrame={0}
            endFrame={7}
            stepIndex={stepIndex}
          />
          <Blob
            key={`boundary-${index}`}
            center={blob.center}
            size={blob.size}
            harmonicsConfig={{ scale: blob.scale, seed: blob.seed }}
            color={colors.red}
            style="solid"
            startFrame={6}
            endFrame={6}
            stepIndex={stepIndex}
            boundaryOnly={true}
            weight={3}
          />
        </>
      ))}
      <Blob
        center={[0,-3]}
        size={1}
        harmonicsConfig={{ scale: 0.2, seed: 321 }}
        color={colors.blue}
        style="solid"
        startFrame={0}
        endFrame={7}
        stepIndex={stepIndex}
        labelContext={() => `$A$`}
        labelAttach="n"
      />
      <Blob
        center={[0,-3]}
        size={1}
        harmonicsConfig={{ scale: 0.2, seed: 321 }}
        color={colors.red}
        style="solid"
        startFrame={6}
        endFrame={6}
        stepIndex={stepIndex}
        boundaryOnly={true}
        weight={3}
      />

      {points.map((point, index) => (
        <Point
          key={`point-${index}`}
          center={point}
          size={0.5}
          stepIndex={stepIndex}
          color={pointsColor}
          startFrame={0}
          endFrame={7}
        />
      ))}

      <Union
        shapes={[
          { type: 'circle', center: [0,-0.8], radius: 2.4 },
          { type: 'circle', center: [0,-0.8], radius: 2.4 }
        ]}
        color={colors.blue}
        invert={true}
        startFrame={10}
        endFrame={10}
        stepIndex={stepIndex}
      />

      <Blob
        center={[-2.2,1]}
        size={2}
        harmonicsConfig={{ scale: 0.3, seed: 500 }}
        color={colors.blue}
        style="dashed"
        startFrame={13}
        endFrame={13}
        stepIndex={stepIndex}
      />
      <Blob
        center={[1.5,1.5]}
        size={0.5}
        harmonicsConfig={{ scale: 0.3, seed: 509 }}
        color={colors.blue}
        style="solid"
        startFrame={13}
        endFrame={13}
        stepIndex={stepIndex}
      />
      <Blob
        center={[2,-2]}
        size={2}
        harmonicsConfig={{ scale: 0.3, seed: 502 }}
        color={colors.blue}
        style="solid"
        startFrame={13}
        endFrame={13}
        stepIndex={stepIndex}
        labelContext={() => `$B$`}
        labelAttach="nw"
        labelAttachDistance={50}
      />

      <InequalityPlot
        xInequality={{ 
          ">=": (y) => -0.8,
          "<=": (y) => 0.8
        }}
        color={colors.black}
        fillOpacity={0.4}
        strokeOpacity={0.5}
        startFrame={16}
        endFrame={17}
        stepIndex={stepIndex}
      />
      <InequalityPlot
        xInequality={{ 
          ">": (y) => 0.8
        }}
        color={colors.blue}
        strokeOpacity={0}
        startFrame={17}
        endFrame={17}
        stepIndex={stepIndex}
      />
    </BaseScene>
  )
}

export default Closed 