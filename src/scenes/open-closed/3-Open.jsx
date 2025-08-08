import React, { useMemo, useRef, useState } from 'react'
import BaseScene from '../../components/BaseScene'
import Blob, { generateHarmonics, createBlobRadiusFunction } from '../../components/objects/Blob'
import InteriorPoint from '../../components/objects/InteriorPoint'
import Circle from '../../components/objects/Circle'
import Point from '../../components/objects/Point'
import Distance from '../../components/intro/Distance'
import ConstrainedMovablePoint from '../../components/objects/ConstrainedMovablePoint'
import { useKeyframeAnimation } from '../../hooks/useKeyframeAnimation'
import { colors } from '../../config/colors'

export const SceneConfig = {
  steps: [
    "We saw in the last lesson that boundary points are different from interior and exterior points. $$$$ An interior point\
    of a set $A$ _must_ be an element of $A$, and an exterior point _cannot_ be an element of $A$. However, a boundary point could be\
    _either_ in $A$ or in $A^c$.",
    "Although a set always contains its interior, we have no such guarantee about its boundary.\
    $$$$ A set might contain its _entire_ boundary or _none_ of its boundary. A set might contain _some but not all_ of its boundary,\
    as we saw in the previous lesson.",
    "This idea leads us to the following definition: $$$$ An *open set* is a set that doesn't\
    contain _any_ of its boundary. $$$$ In other words, an open set consists _only_ of interior points.",
    "TOP: Visually, this looks like a set with an entirely dashed boundary, indicating that none of the set's boundary points are\n\
    actually _elements_ of the set.",
    "TOP: Open sets have a remarkable property. Since any point $x$ in an open set is an interior point, this means that we can always\
    find a neighborhood of $x$ that is entirely contained in the set. Try moving around the point and zooming in to see this idea in action!",
    "TOP: Objects in the real world contain their boundaries, so this is a counterintuitive idea. By bringing $x$ closer and closer\
    to the boundary, we can force the neighborhood to get smaller and smaller. But we can't choose $x$ to actually _be_ a boundary\
    point, since then $x$ would not be an element of the set!",
    "Even if open sets don't exist in the real world, they are plentiful in mathematics. In fact, we have already discovered a\
    large class of open sets: neighborhoods.",
    "It turns out that _every_ neighborhood is open. $$$$ Since we've used dashed lines to represent both neighborhoods and open sets,\
    we've already hinted at this fact. It's not quite clear _why_ though. All we know about a neighborhood $N_r(x)$ is that it's the set\
    of all points $y$ such that $d(x,y) < r$. Why would this guarantee that every point in $N_r(x)$ is an interior point?",
    "TOP: Let's consider the neighborhood $N_3(x)$ for some point $x$ in the coordinate plane. We will _prove_ that this set is open,\
    and although there are of course neighborhoods with radii other than $3$, the argument is the same for any radius.",
    "TOP: In order for $N_3(x)$ to be open, every point $y$ in $N_3(x)$ must be an interior point. Let's consider such a point $y$,\
    and we'll use the variable $s$ to denote the distance between $x$ and $y$.",
    "TOP: Since $y$ lies in $N_3(x)$, we know that $s$ is strictly less than $3$. We'll use the variable $t$ to denote the quantity\
    $3-s$, and since we obtain $t$ by subtracting a smaller number from a bigger number, we know that $t > 0$. You should also\
    check that $s + t = 3$, as this will be a crucial fact later.",
    "TOP: To see that $y$ is an interior point, we need to find some neighborhood of $y$ that is a _subset_ of $N_3(x)$.\
    It turns out that $N_t(y)$ is exactly the neighborhood we need. This is indeed a valid neighborhood since $t > 0$.\
    $$$$ Be sure to zoom in so that you can see everything clearly.",
    "TOP: You can see in the picture that $N_t(y)$ is a subset of $N_3(x)$, but _why_ is it true? To check,\
    we need to show that _every_ point $z$ in $N_t(y)$ is also an element of $N_3(x)$. $$$$ In other words, we need to show that\
    if $d(y,z) < t$, then $d(x,z) < 3$.",
    "TOP: The triangle inequality is what we need here. As a reminder, it says that $$d(x,z) \\leq d(x,y) + d(y,z) \\text{.}$$\
    We already know that $d(x,y) = s$. This means that if $d(y,z) < t$, then $$d(x,y) + d(y,z) < s + t = 3 \\text{.}$$",
    "TOP: We can put these two inequalities together to get $$d(x,z) \\leq d(x,y) + d(y,z) < 3\\text{.}$$ This means that\
    $d(x,z) < 3$ whenever $d(y,z) < t$, which is exactly what we wanted to prove! It shows that _every_ point $z$ in $N_t(y)$\
    must also lie in $N_3(x)$. Thus $N_t(y)$ is a subset of $N_3(x)$, so $y$ is an interior point.",
    "TOP: You can see that this argument works for any point $y$ in $N_3(x)$, which means that $N_3(x)$ contains only interior points.\
    This is exactly what it means for $N_3(x)$ to be open.",
    "TOP: As we move $y$ closer to the boundary, the quantity $3 - s$ gets smaller and so the neighborhood $N_t(y)$ shrinks,\
    just as we would expect.",
    "That argument got rather complicated, and the reason is because we needed to unravel several definitions. $$$$ Open sets are defined\
    in terms of interior points, which are defined in terms of neighborhoods. Neighborhoods are defined in terms of distances, and\
    only after breaking everything down to this level could we use the triangle inequality to finish the proof.",
    "We won't ever need to go into so much detail in the future, but this proof shows that you can get quite far just by breaking\
    down definitions. It's a natural first step when encountering any new problem. $$$$ If you go back and make sure you understand\
    everything, then you'll solidify your understanding of all the concepts we've seen so far, from open sets, to interior points,\
    to neighborhoods. In the next lesson, we'll take a break from the more involved calculations and learn about _closed sets._"
  ]
}

function Open({ 
  windowSize, 
  stepIndex, 
  isPanelOpen,
  sceneKey 
}) {
  const blobSize = 4

  const blobHarmonics = generateHarmonics(0.2, 456, blobSize)

  const getBlobRadius = createBlobRadiusFunction(blobSize, blobHarmonics)

  const circleKeyframes = useMemo(() => ({
    radius: {
      8: 0,
      9: 2.4,
      18: 0
    }
  }), [])

  const neighborhoodKeyframes = useMemo(() => ({
    radius: {
      11: 0,
      12: 2.4 - Math.sqrt(4 + 0.6 * 0.6),
      16: 2.4 - Math.sqrt(2.1 * 2.1 + 0.7 * 0.7),
      17: 2.4 - Math.sqrt(2.2 * 2.2 + 0.8 * 0.8),
      18: 0
    }
  }), [])

  const pointYKeyframes = useMemo(() => ({
    x: {
      15: 2.0,
      16: 2.1,
      17: 2.2
    },
    y: {
      15: 0.6,
      16: 0.7,
      17: 0.8
    }
  }), [])

  const animatedYProps = useKeyframeAnimation(pointYKeyframes, stepIndex)
  const pointYPosition = [animatedYProps.x ?? 1.5, animatedYProps.y ?? 1.0]

  const neighborhoodAnimatedProps = useKeyframeAnimation(neighborhoodKeyframes, stepIndex)
  const currentNeighborhoodRadius = neighborhoodAnimatedProps.radius ?? 0

  const [pointZPosition, setPointZPosition] = useState([pointYPosition[0] + 0.1, pointYPosition[1] + 0.1])

  return (
    <BaseScene
      config={SceneConfig}
      sceneKey={sceneKey}
      stepIndex={stepIndex}
      isPanelOpen={isPanelOpen}
      windowSize={windowSize}
    >
      <Blob
        size={blobSize}
        harmonics={blobHarmonics}
        color={colors.blue}
        style="dashed"
        startFrame={0}
        endFrame={6}
        stepIndex={stepIndex}
      />

      <Circle
        keyframes={circleKeyframes}
        stepIndex={stepIndex}
        strokeStyle='dashed'
        labelContext={() => `$N_3(x)$`}
        labelAttach="se"
        labelAttachDistance={40}
      />

      <Circle
        center={pointYPosition}
        keyframes={neighborhoodKeyframes}
        color={colors.purple}
        stepIndex={stepIndex}
        strokeStyle='dashed'
        labelContext={() => `$N_t(y)$`}
        labelAttach="e"
        labelAttachDistance={40}
      />

      <Distance
        point1Center={[0, 0]}
        point2Center={pointYPosition}
        lineColor={colors.gray}
        weight={2}
        showLabel={true}
        noPoints={true}
        startFrame={10}
        endFrame={17}
        stepIndex={stepIndex}
        distanceLabelFormat={() => `$d(x,y) = s$`}
        labelAttach="s"
      />

      <Distance
        point1Center={pointYPosition}
        point2Center={pointZPosition}
        lineColor={colors.gray}
        weight={2}
        showLabel={true}
        noPoints={true}
        startFrame={14}
        endFrame={15}
        stepIndex={stepIndex}
        distanceLabelFormat={() => `$d(y,z) < t$`}
        labelAttach="e"
        labelAttachDistance={75}
      />

      <Distance
        point1Center={[0,0]}
        point2Center={pointZPosition}
        lineColor={colors.gray}
        weight={2}
        showLabel={true}
        noPoints={true}
        startFrame={14}
        endFrame={15}
        stepIndex={stepIndex}
        distanceLabelFormat={() => `$d(x,z) < s + t$`}
        labelAttach="nw"
        labelAttachDistance={55}
      />

      <Point
        color={colors.blue}
        startFrame={10}
        endFrame={17}
        stepIndex={stepIndex}
        labelContext={() => "$x$"}
        labelAttach="sw"
      />

      <Point
        center={pointYPosition}
        color={colors.purple}
        startFrame={10}
        endFrame={17}
        stepIndex={stepIndex}
        labelContext={() => "$y$"}
        labelAttach="se"
      />

      <ConstrainedMovablePoint
        center={pointYPosition}
        startFrame={13}
        endFrame={15}
        stepIndex={stepIndex}
        labelContext={() => "$z$"}
        labelAttach="n"
        labelAttachDistance={25}
        constraintFunction={() => currentNeighborhoodRadius}
        marginPixels={5}
        initialPosition={[pointYPosition[0] + 0.2, pointYPosition[1] + 0.2]}
        color={colors.red}
        onPointChange={setPointZPosition}
      />

      <InteriorPoint
        constraintFunction={getBlobRadius}
        marginPixels={5}
        initialPosition={[0, 0]}
        startFrame={5}
        endFrame={6}
        stepIndex={stepIndex}
        blobSize={blobSize}
        blobHarmonics={blobHarmonics}
        labelContext={() => "$x$"}
      />
    </BaseScene>
  )
}

export default Open