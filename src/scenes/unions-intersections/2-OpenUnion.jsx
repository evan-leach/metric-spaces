import { useMemo } from 'react'
import BaseScene from '../../components/BaseScene'
import { colors } from '../../config/colors'
import Union from '../../components/objects/Union'
import Circle from '../../components/objects/Circle'
import Point from '../../components/objects/Point'
import ConstrainedMovablePoint from '../../components/objects/ConstrainedMovablePoint'
import Blob from '../../components/objects/Blob'
import InequalityPlot from '../../components/objects/InequalityPlot'
import Polygon from '../../components/objects/Polygon'

export const SceneConfig = {
  steps: [
    "In this lesson, we will prove the first of our four claims: that the union of any collection of open sets is open.",
    "Remember that one of the equivalent definitions of an open set is that it is a set consisting of only interior points.\
    $$$$ This definition will guide the strategy for our proof; we will show that any point in a union of open sets\
    is an interior point of the union.",
    "TOP: To begin, let's consider a collection of open sets, which we won't give names to since there might be infinitely many\
    of them. All we know is that each set is open.",
    "TOP: We'll denote the union of these sets as $U$ and pick an arbitrary point $x$ in this union.",
    "TOP: Since $x$ lies in the union of all these open sets, we know that $x$\
    must be an element of at least one set in this collection. Let's call this set $A$.",
    "TOP: Since $A$ is open, this means that $x$ is an interior point of $A$. In other words, there is a neighborhood $N_r(x)$\
    of $x$ that is entirely contained in $A$.",
    "TOP: Since every point in this neighborhood is an element of $A$, each point in this neighborhood\
    is contained in _at least one_ of the open sets (namely $A$) in our collection. $$$$ This means that each point in\
    $N_r(x)$ is an element of $U$, and so $N_r(x)$ is a subset of $U$.",
    "TOP: We've shown that every point $x$ in $U$ has a neighborhood which is a subset of $U$, so every element of $U$ is an\
    interior point. $$$$ By definition, this means that $U$ is open!",
    "Nowhere in this proof did we assume that there are only finitely many open sets in our collection. $$$$ This means that\
    the union of any collection of open sets, infinite or not, is open.",
    "This gives us a new way to prove that a set is open. Instead of showing that every point in the set is an interior point,\
    we can show that the set is a union of open sets. $$$$ This method is often much easier.",
    "TOP: Here's an example. This set $T$ is just a triangle, and the set $U$ is the set of all points whose distance from the\
    triangle is less than $1$.",
    "TOP: It would be difficult to prove directly that every point of $U$ is an interior point, but there's a simpler argument: $$$$\
    For each point $x$ in $U$, we can consider the neighborhood $N_1(x)$. Try dragging $x$ around to see how this neighborhood\
    relates to $U$.",
    "TOP: Hopefully, you've realized that $U$ is the _union_ of all the neighborhoods $N_1(x)$ for each $x$ in $U$. $$$$ This means\
    that $U$ is open, since it is a union of open sets.",
    "Notice also that this same argument works no matter what $T$ is. The corresponding set $U$ will always be open, as long as\
    its still defined as the set of all points whose distance from $T$ is less than $1$.",
    "TOP: For example, if we define $T$ to be the $x$-axis, then $U$ is the set of all points whose $y$-coordinate is less strictly\
    between $-1$ and $1$. $$$$ With hardly any work, we've proven that this set is open.",
    "Infnity hasn't been an issue for us so far, but it's about to start causing problems. $$$$ Our next question is whether an\
    intersection of open sets is open, and answering it will be a little more complicated. In fact, our proof will only work\
    for a _finite_ number of open sets.",
    "We'll see how this argument works, as well as how infinity overwhelms it, in the next lesson."
  ]
}

function OpenUnion({ windowSize, stepIndex, isPanelOpen, sceneKey }) {
  // Polygon formula: r = cos(pi/n)/cos(theta - 2pi/n * floor((n * theta + pi)/(2pi)))
  // For n=3 (triangle), this becomes: r = cos(pi/3)/cos(theta - 2pi/3 * floor((3 * theta + pi)/(2pi)))
  const triangleRadiusFunction = useMemo(() => {
    return (theta) => {
      const n = 3 // triangle
      const numerator = Math.cos(Math.PI / n)
      const floorTerm = Math.floor((n * (theta + Math.PI / 2) + Math.PI) / (2 * Math.PI))
      const denominator = Math.cos(theta + Math.PI / 2 - (2 * Math.PI / n) * floorTerm)
      return Math.abs(numerator / denominator) * 2
    }
  }, [])

  const neighborhoodKeyframes = useMemo(() => ({
    radius: {
      5: 0,
      6: 0.17,
      8: 0
    }
  }), [])

  const constrainedCircleKeyframes = useMemo(() => ({
    radius: {
      11: 0,
      12: 0.8,
      14: 0
    }
  }), [])

  const dashedBlobs = useMemo(() => [
    
    { center: [-3, 2], size: 1.1, seed: 678, scale: 0.12 },
    { center: [-2, 4], size: 2.2, seed: 567, scale: 0.22 },
    { center: [4.5, -3], size: 2.3, seed: 123, scale: 0.16 },
    { center: [1.9, -0.2], size: 0.9, seed: 789, scale: 0.28 },
    { center: [1, -4], size: 2.7, seed: 901, scale: 0.19 },
    { center: [0.1, -0.8], size: 1.6, seed: 567, scale: 0.27 }
    
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
          endFrame={8}
          stepIndex={stepIndex}
        />
      ))}

      <Blob
        center={[1.9, -0.2]}
        size={0.9}
        harmonicsConfig={{ seed: 789, scale: 0.28 }}
        fillOpacity={0}
        strokeOpacity={0}
        color={colors.green}
        labelContext={() => "$U$"}
        labelAttach="e"
        startFrame={4}
        endFrame={4}
        stepIndex={stepIndex}
      />
      <Blob
        center={[1.9, -0.2]}
        size={0.9}
        harmonicsConfig={{ seed: 789, scale: 0.28 }}
        fillOpacity={0}
        strokeOpacity={0}
        color={colors.green}
        labelContext={() => "$U$"}
        labelAttach="e"
        startFrame={7}
        endFrame={8}
        stepIndex={stepIndex}
      />

      <Union
        shapes={dashedBlobs.map(blob => ({
          type: 'blob',
          center: blob.center,
          size: blob.size,
          harmonicsConfig: { scale: blob.scale, seed: blob.seed }
        }))}
        color={colors.green}
        fillOpacity={0.15}
        strokeOpacity={0.6}
        startFrame={4}
        endFrame={4}
        stepIndex={stepIndex}
        style="dashed"
      />

      <Union
        shapes={dashedBlobs.map(blob => ({
          type: 'blob',
          center: blob.center,
          size: blob.size,
          harmonicsConfig: { scale: blob.scale, seed: blob.seed }
        }))}
        color={colors.green}
        fillOpacity={0.15}
        strokeOpacity={0.6}
        startFrame={7}
        endFrame={8}
        stepIndex={stepIndex}
        style="dashed"
      />

      <Blob
        center={[0.1, -0.8]}
        size={1.6}
        harmonicsConfig={{ seed: 567, scale: 0.27 }}
        color={colors.purple}
        style="dashed"
        fillOpacity={0.3}
        strokeOpacity={0.6}
        startFrame={5}
        endFrame={6}
        stepIndex={stepIndex}
        labelContext={() => "$A$"}
        labelAttach="nw"
      />

      <Point
        center={[1.1, 0.15]}
        color={colors.red}
        startFrame={4}
        endFrame={8}
        stepIndex={stepIndex}
        labelContext={() => "$x$"}
        labelAttach="se"
      />

      <Circle
        center={[1.1, 0.15]}
        keyframes={neighborhoodKeyframes}
        color={colors.red}
        strokeStyle="dashed"
        stepIndex={stepIndex}
        labelContext={() => "$N_r(x)$"}
        labelAttach="w"
        labelAttachDistance={40}
      />

      <Union
        shapes={[
          {
            type: 'polygon',
            vertices: [
              [-0.4 * Math.sqrt(3), 1.4],
              [0.4 * Math.sqrt(3), 1.4],
              [1.4 * Math.sqrt(3), -1.6],
              [Math.sqrt(3), -2.8],
              [-Math.sqrt(3), -2.8],
              [-1.4 * Math.sqrt(3), -1.6]
            ]
          },
          { type: 'circle', center: [Math.sqrt(3), -2], radius: 0.8 },
          { type: 'circle', center: [-Math.sqrt(3), -2], radius: 0.8 },
          { type: 'circle', center: [0, 1], radius: 0.8 }
        ]}
        color={colors.green}
        fillOpacity={0.15}
        strokeOpacity={0.6}
        style="dashed"
        startFrame={11}
        endFrame={13}
        stepIndex={stepIndex}
      />

      {/* Jank label */}
      <Blob
        center={[0.3, 0]}
        fillOpacity={0}
        strokeOpacity={0}
        color={colors.green}
        labelContext={() => "$U$"}
        labelAttach="e"
        labelAttachDistance={30}
        startFrame={11}
        endFrame={13}
        stepIndex={stepIndex}
      />

      <Polygon
        points={[
          [0, 1],
          [-Math.sqrt(3), -2],
          [Math.sqrt(3), -2]
        ]}
        color={colors.blue}
        startFrame={11}
        endFrame={13}
        stepIndex={stepIndex}
      />

      {/* Jank label */}
      <Blob
        fillOpacity={0}
        strokeOpacity={0}
        color={colors.blue}
        labelContext={() => "$T$"}
        labelAttach="s"
        labelAttachDistance={30}
        startFrame={11}
        endFrame={13}
        stepIndex={stepIndex}
      />

      <InequalityPlot
        yInequality={{ 
          ">=": (x) => -1.6,
          "<=": (x) => 0
        }}
        style="dashed"
        fillOpacity={0.15}
        strokeOpacity={0.6}
        color={colors.green}
        startFrame={15}
        endFrame={15}
        stepIndex={stepIndex}
      />

      {/* Jank label */}
      <Blob
        center={[0, 0.3]}
        fillOpacity={0}
        strokeOpacity={0}
        color={colors.green}
        labelContext={() => "$U$"}
        labelAttach="s"
        labelAttachDistance={30}
        startFrame={15}
        endFrame={15}
        stepIndex={stepIndex}
      />

      <InequalityPlot
        yInequality={{ 
          ">=": (x) => -0.8,
          "<=": (x) => -0.8
        }}
        fillOpacity={0.1}
        strokeOpacity={0.6}
        color={colors.blue}
        startFrame={15}
        endFrame={15}
        stepIndex={stepIndex}
      />

      {/* Jank label */}
      <Blob
        center={[0, -2.7]}
        fillOpacity={0}
        strokeOpacity={0}
        color={colors.blue}
        labelContext={() => "$T$"}
        labelAttach="n"
        labelAttachDistance={30}
        startFrame={15}
        endFrame={15}
        stepIndex={stepIndex}
      />

      <ConstrainedMovablePoint
        constraintFunction={triangleRadiusFunction}
        marginPixels={0}
        initialPosition={[0, 1]}
        center={[0, -1]}
        color={colors.purple}
        startFrame={12}
        endFrame={13}
        stepIndex={stepIndex}
        labelContext={() => "$x$"}
        labelAttach="n"
        labelAttachDistance={20}
        // Circle options - integrated for performance
        showCircle={true}
        circleKeyframes={constrainedCircleKeyframes}
        circleFillOpacity={0.1}
        circleStrokeOpacity={0.6}
        circleWeight={2}
        circleStrokeStyle="dashed"
        circleLabelContext={() => "$N_1(x)$"}
        circleLabelAttach="ne"
        circleLabelAttachDistance={30}
      />
    </BaseScene>
  )
}

export default OpenUnion
