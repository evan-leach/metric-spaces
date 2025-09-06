import { useMemo } from 'react'
import BaseScene from '../../components/BaseScene'
import Blob from '../../components/objects/Blob'
import Point from '../../components/objects/Point'
import Circle from '../../components/objects/Circle'
import { useKeyframeAnimation } from '../../hooks/useKeyframeAnimation'
import { colors } from '../../config/colors'

export const SceneConfig = {
  steps: [
    "We now have three different ways to classify a point $x$ in a metric space based on how it relates to a set $A$: $$$$ Is $x$ an\
    element of $A$, or is it in $A^c$? $$$$ Is $x$ an interior, exterior, or boundary point of $A$? $$$$ Is $x$ a limit point of $A$,\
    or is it not?",
    "TOP: In this lesson, we will explore which combinations of answers to these questions are possible. $$$$ Sometimes, there are\
    multiple possiblities, like how a boundary point of a set might or might not be an _element_ of that set.",
    "TOP: There are also times when one answer to a question reveals what the answer to another question must be. For example, we saw\
    previously that if $x$ is an interior point of $A$, then $x$ _must_ be an element of $A$.",
    "TOP: Sometimes, it's not obvious whether one fact implies another. For example, if $x$ is an interior point of $A$, must\
    $x$ be a limit point of $A$? $$$$ This is a tricky question, and the answer is on the next slide. Since we won't need to use\
    this fact any time in the future, feel free to skip it.",
    "Suprisingly, we can find a counterexample! Some interior points are not limit points, but we need to use a different\
    metric space in order for this to be possible. If you're looking for a challenge, here are two questions: $$$$ 1. Can you find such\
    a counterexample using the discrete metric? $$$$ 2. When using the coordinate plane and Euclidean metric, every\
    neighborhood has multiple points. How does this explain why we can't find a counterexample with our usual metric space?",
    "TOP: Let's see what happens if $x$ is an exterior point of $A$. Here, we see that $x$ lies in $A^c$ and is _not_ a limit point of\
    $A$. $$$$ Is this always the case, though? Could $x$ possibly be an element of $A$? Could it be a limit point of $A$?",
    "TOP: The answer to both of these questions is no. Since $x$ is an exterior point, some neighborhood of $x$ lies entirely within\
    $A^c$. This neighborhood includes $x$, so $x$ must be an element of $A^c$. $$$$ For $x$ to be a limit point of $A$, every neighborhood\
    of $x$ would have to contain at least one point of $A$. Since this neighborhood does not, $x$ is not a limit point.",
    "TOP: Finally, we'll see what happens for boundary points. This is the scenario where there are the most possibilities: a boundary\
    point could be both an element and limit point, just an element, or just a limit point, as these three examples show.",
    "TOP: We _can_ make one conclusion, however. If $x$ is a boundary point of $A$, one half of the definition is that every\
    neighborhood of $x$ must contain an element of $A$.",
    "TOP: If $x$ is an element of $A$, then this always the case, since every neighborhood of $x$ contains $x$ itself.",
    "TOP: If $x$ is not an element of $A$, though, then the element of $A$ must be some point _other_ than $x$. Since every\
    neighborhood of $x$ must contain an element of $A$ other than $x$, this means that $x$ is a limit point of\
    $A$! $$$$ In other words, every boundary point is _either_ an element or a limit point of $A$ (or both).",
    "Here is a summary of what we saw: $$$$ Every interior point is an element of the set. $$$$ Every exterior point is _neither_\
    an element _nor_ a limit point of the set. $$$$ Every boundary point is _either_ an element _or_ a limit point (or both) of the set.",
    "Now we can prove the fact in the title of this lesson: that closed sets contain their limit points. $$$$ Since exterior points\
    cannot be limit points, this means that every limit point is either an interior point or a boundary point. Interior points are\
    always elements of the set, and since closed sets contain their boundaries, boundary points are also elements of the set.\
    $$$$ This means that every limit point of a closed set is also an _element_ of the set.",
    "TOP: It turns out that the reverse is also true: if a set contains its limit points, then it must be closed. In other words, any\
    set containing its limit points also contains all of its boundary points.",
    "TOP: We previously showed that every boundary point $x$ of a set $A$ must be either an element or a limit point of $A$. If every\
    limit point of $A$ is also an element of $A$, then this means that $x$ is an element of $A$ in either case.",
    "TOP: This means that a set contains its limit points _if and only if_ it is closed. $$$$ Because these conditions are equivalent,\
    we have a new definition for closed sets: sets that contain all of their limit points.",
    "In this section, we've developed a new way to think about shapes using nothing more than a distance function. $$$$ We've\
    classified elements of our metric space as interior, exterior, and boundary points, and we've seen how they relate to limit\
    points. We also used this classification to develop the concepts of open and closed sets.",
    "We've seen two equivalent definitions for open sets: sets that don't contain any of their boundary points, and sets consisting\
    only of interior points. $$$$ We have also proven the equivalence of _three_ definitions for closed sets: sets containing their\
    boundaries, sets whose complements are open, and sets containing all of their limit points.",
    "With the end of this section, we have finished covering the fundamentals of metric spaces. You should make\
    sure you have a solid grasp of these ideas, as we are about to push them to their limits.",
    "The next section takes us deeper into the world of infinity. You'll be suprised by how completely intuitive facts _break_ in\
    the infinite setting."
  ]
}

function Ending({ 
  windowSize, 
  stepIndex, 
  isPanelOpen,
  sceneKey 
}) {

  const solidBlobs = useMemo(() => [
    { center: [-3, -1], size: 0.3, seed: 211, scale: 0.2 },
    { center: [-3, -12.5], size: 10, seed: 214, scale: 0.3 },
    { center: [4.5, -1.5], size: 0.5, seed: 216, scale: 0.2 },
    
    { center: [3.5, 0], size: 0.6, seed: 215, scale: 0.25 }
  ], [])

  const dashedBlobs = useMemo(() => [
    
    { center: [5, 6], size: 4, seed: 221, scale: 0.3 },
    { center: [-5, 1], size: 2, seed: 218, scale: 0.15 },
    { center: [3, -2], size: 0.5, seed: 213, scale: 0.15 }
    
  ], [])

  const points = useMemo(() => [
    [0, 0.4],
    [0.1, -0.3],
    [1, -0.2],
    [0.5, 0.5],
    [0.6, 0],

    [-1.3, 2],
    [4.2, -2.8],
    
    [-4.2, -1.3],
    [-3.7, -0.8],
    [-4.5, -1.6],
    [-4.1, -0.9],
    [-3.6, -1.4],
    [-4.3, -1.0],
    
    [2.1, 1.2],
    [1.8, 1.5],
    [2.4, 0.6],
    [2.2, 0.9]
  ], [])

  const solidBlobs2 = useMemo(() => [
    { center: [2, -4], size: 0.3, seed: 311, scale: 0.2 },
    { center: [-3, 9], size: 10, seed: 314, scale: 0.3 },
    { center: [4.5, -2.5], size: 0.5, seed: 316, scale: 0.2 },
    { center: [6, -1], size: 0.3, seed: 317, scale: 0.1 },
    { center: [3, -1], size: 0.6, seed: 315, scale: 0.25 }
  ], [])

  const circle1Keyframes = useMemo(() => ({
    radius: {
      6: 0,
      7: 0.4,
      8: 0
    }
  }), [])

  const circle2Keyframes = useMemo(() => ({
    radius: {
      9: 0,
      10: 0.3,
      11: 0
    }
  }), [])

  const circle3Keyframes = useMemo(() => ({
    radius: {
      10: 0,
      11: 0.3,
      12: 0
    }
  }), [])

  const point1Keyframes = useMemo(() => ({
    color: {
      7: colors.blue,
      8: colors.orange,
      9: colors.blue
    }
  }), [])

  const point2Keyframes = useMemo(() => ({
    color: {
      14: colors.blue,
      15: colors.orange,
      16: colors.blue
    }
  }), [])

  const animatedProps1 = useKeyframeAnimation(point1Keyframes, stepIndex)
  const point1Color = animatedProps1.color || colors.blue
  const animatedProps2 = useKeyframeAnimation(point2Keyframes, stepIndex)
  const point2Color = animatedProps2.color || colors.blue

  return (
    <BaseScene
      config={SceneConfig}
      sceneKey={sceneKey}
      stepIndex={stepIndex}
      isPanelOpen={isPanelOpen}
      windowSize={windowSize}
    >
      {solidBlobs.map((blob, index) => (
        <Blob
          key={`solid-blob-${index}`}
          center={blob.center}
          size={blob.size}
          harmonicsConfig={{ scale: blob.scale, seed: blob.seed }}
          color={colors.blue}
          style="solid"
          startFrame={0}
          endFrame={11}
          stepIndex={stepIndex}
        />
      ))}

      {solidBlobs2.map((blob, index) => (
        <Blob
          key={`solid-blob-2-${index}`}
          center={blob.center}
          size={blob.size}
          harmonicsConfig={{ scale: blob.scale, seed: blob.seed }}
          color={colors.blue}
          style="solid"
          startFrame={14}
          endFrame={16}
          stepIndex={stepIndex}
        />
      ))}

      {dashedBlobs.map((blob, index) => (
        <Blob
          key={`dashed-blob-${index}`}
          center={blob.center}
          size={blob.size}
          harmonicsConfig={{ scale: blob.scale, seed: blob.seed }}
          color={colors.blue}
          style="dashed"
          startFrame={0}
          endFrame={11}
          stepIndex={stepIndex}
        />
      ))}

      {points.map((point, index) => (
        <Point
          key={`point-${index}`}
          center={point}
          stepIndex={stepIndex}
          color={colors.blue}
          startFrame={0}
          endFrame={11}
        />
      ))}

      <Point
        center={[-3.5, 0.14649]}
        stepIndex={stepIndex}
        color={colors.orange}
        startFrame={2}
        endFrame={2}
      />
      <Point
        center={[3, 0.21701]}
        stepIndex={stepIndex}
        color={colors.orange}
        startFrame={2}
        endFrame={2}
      />
      <Point
        center={[-4, 0.5]}
        stepIndex={stepIndex}
        color={colors.red}
        startFrame={3}
        endFrame={4}
      />
      <Point
        center={[0, -3]}
        stepIndex={stepIndex}
        color={colors.purple}
        startFrame={6}
        endFrame={7}
      />
      <Circle
        center={[0, -3]}
        stepIndex={stepIndex}
        color={colors.purple}
        keyframes={circle1Keyframes}
        strokeStyle='dashed'
      />

      <Point
        center={[-1, -3.7]}
        stepIndex={stepIndex}
        color={colors.orange}
        startFrame={8}
        endFrame={8}
      />
      <Point
        center={[1.7, 1]}
        stepIndex={stepIndex}
        color={point1Color}
        startFrame={0}
        endFrame={11}
      />
      <Point
        center={[2.47721, -2]}
        stepIndex={stepIndex}
        color={colors.orange}
        startFrame={8}
        endFrame={8}
      />
      <Circle
        center={[0.6, 0]}
        stepIndex={stepIndex}
        color={colors.orange}
        keyframes={circle2Keyframes}
        strokeStyle='dashed'
      />
      <Circle
        center={[-4, -0.12419]}
        stepIndex={stepIndex}
        color={colors.orange}
        keyframes={circle3Keyframes}
        strokeStyle='dashed'
      />

      <Point
        center={[-2, -3]}
        stepIndex={stepIndex}
        color={point2Color}
        startFrame={14}
        endFrame={16}
      />
      <Point
        center={[-2.4, -3.1]}
        stepIndex={stepIndex}
        color={colors.blue}
        startFrame={14}
        endFrame={16}
      />
      <Point
        center={[2.6, -0.65931]}
        stepIndex={stepIndex}
        color={colors.orange}
        startFrame={15}
        endFrame={15}
      />
    </BaseScene>
  )
}

export default Ending