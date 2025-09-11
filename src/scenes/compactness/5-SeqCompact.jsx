import { useMemo } from 'react'
import BaseScene from '../../components/BaseScene'
import { colors } from '../../config/colors'
import Circle from '../../components/objects/Circle'
import Blob, { generateHarmonics, createBlobRadiusFunction } from '../../components/objects/Blob'
import PointSequence from '../../components/objects/PointSequence'
import AvoidantPoint from '../../components/objects/AvoidantPoint'
import InequalityPlot from '../../components/objects/InequalityPlot'

export const SceneConfig = {
  steps: [
    "If a point $x$ is a limit point of a set $A$, then every neighborhood of $x$ must contain infinitely many points of $A$.\
    $$$$ We proved this fact when we first explored limit points. One consequence is that any set with a limit point _must_\
    be infinite.",
    "One natural question is whether the reverse is true: must every infinite set have a limit point?",
    "TOP: The answer is no, as this example shows.",
    "TOP: We can try to make this property hold by restricting the types of infinite sets we allow.\
    One way to do this is by choosing a set $A$ and considering only infinite _subsets_ of $A$.",
    "TOP: This idea motivates the following definition: $$$$ We call a set $A$ *sequentially compact* if every infinite subset of\
    $A$ has a limit point in $A$.",
    "TOP: This set $A$, for example, is not sequentially compact. It has an infinite subset with no limit point.",
    "TOP: The set $N_1(x)$ is also not sequentially compact. This infinite subset of $N_1(x)$ has a limit point, but it's not\
    an element of $N_1(x)$. Sequential compactness requires that the limit point is also an _element_ of the set.",
    "In this lesson, we will prove that compactness _implies_ sequential compactness. $$$$ In other words, all compact sets\
    are sequentially compact.",
    "The open cover we construct in this proof will be much more complex than the previous ones. $$$$ We are taking full\
    advantage of the fact that for a compact set, _every_ open cover, no matter how complicated, has a finite subcover.",
    "TOP: We'll start with an arbitrary compact set $K$. Instead of showing that every infinite subset of $K$ has a limit point\
    in $K$, we'll prove that every subset of $K$ _without_ a limit point in $K$ must be finite. $$$$ Take a moment to verify that\
    this is an equivalent claim.",
    "TOP: Here is such a set $A$. Each point $y$ in $K$ is not a limit point of $A$, so there is some neighborhood of $y$ which\
    contains no points of $A$ other than potentially $y$ itself.",
    "TOP: This means that we can find a neighborhood of $y$ containing _at most_ one point of $A$. Try dragging the point $y$\
    around to see this!",
    "TOP: Now we'll construct an open cover with a truly enormous amount of sets. We will use the collection of _all_ these\
    neighborhoods, for every single point $y$ in $K$.",
    "TOP: This collection indeed covers $K$, since each point of $K$ is contained in its own neighborhood.",
    "TOP: We can't possibly visualize this entire cover at once, but compactness guarantees that it has a finite subcover.\
    $$$$ Here is what one such finite subcover looks like.",
    "TOP: Since $A$ is a subset of $K$, it is also covered by these neighborhoods. Each neighborhood contains at _most_\
    one point of $A$, so the number of points in $A$ is at most the number of neighborhoods in the subcover.",
    "TOP: This means that $A$ is finite, which is exactly what we wanted to show!",
    "This property of compact sets is quite powerful, and it will serve as a useful tool throughout the rest of this exploration.",
    "Sequential compactness is also just what we need to pinpoint the precise difference between compact and finite sets. $$$$\
    We'll take a look at this connection in the conclusion of this section."
  ]
}

function SeqCompact({ windowSize, stepIndex, isPanelOpen, sceneKey }) {

  const blobSize = 3
  
  const blobHarmonics = generateHarmonics(0.2, 1458, blobSize)
  
  const getBlobRadius = createBlobRadiusFunction(blobSize, blobHarmonics)
  
  const chaoticCurve = (t) => {
    const sx = 106.8 * t
    const sy = 100.5 * t
    const px = 4 * Math.abs(sx - Math.floor(sx) - 0.5) - 1
    const py = 4 * Math.abs(sy - Math.floor(sy) - 0.5) - 1
    const x = 3 * px
    const y = 2.5 * py * Math.max(1,0.9 * (px+0.5))

    const angle = Math.atan2(y,x)
    const boundaryRadius = getBlobRadius(angle)
    const attemptedDistance = Math.sqrt(x * x + y * y)

    if (attemptedDistance > boundaryRadius) {
      return [
        boundaryRadius * x / attemptedDistance,
        boundaryRadius * y / attemptedDistance
      ]
    }
    return [
      x,
      y
    ]
  }

  const chaoticCurve2 = (t) => {
    if (t == 110) return [1.5,-2.5]
    if (t == 111) return [-0.5,-2.1]
    if (t == 112) return [-1,-2.3]
    if (t == 113) return [-1.58,-2]
    if (t == 114) return [-1.58,-2.3]
    if (t == 115) return [-2.2,-0.3]
    if (t == 116) return [-2.1,0.2]
    if (t == 117) return [1.5,-1.7]
    if (t == 118) return [-2.2,-1.1]
    if (t == 119) return [-1.4,2.3]
    const px = (t * 0.1) % 1 - 0.5
    const py = t * 0.01 - 0.5
    const x = 6 * px
    const y = 5 * py

    const angle = Math.atan2(y,x)
    const boundaryRadius = getBlobRadius(angle)
    const attemptedDistance = Math.sqrt(x * x + y * y)

    if (attemptedDistance > boundaryRadius) {
      return [
        boundaryRadius * x / attemptedDistance,
        boundaryRadius * y / attemptedDistance
      ]
    }
    return [
      x,
      y
    ]
  }

  const otherPoints = useMemo(() => {
    return Array.from({ length: 50 }, (_, n) =>
      chaoticCurve(Math.pow(0.99, n + 1))
    )
  }, [])

  const radii = useMemo(() => {
    return Array.from({ length: 120 }, (_, n) => {
      const [px, py] = chaoticCurve2(n)

      let min1 = Infinity
      let min2 = Infinity
      for (const [qx, qy] of otherPoints) {
        const dx = px - qx
        const dy = py - qy
        const dist = dx * dx + dy * dy
        if (dist < min1) {
          min2 = min1
          min1 = dist
        } else if (dist < min2) {
          min2 = dist
        }
      }

      return Math.sqrt(min2) * 0.9 // safetyFactor
    })
  }, [otherPoints])

  const circleKeyframes = useMemo(() => ({
    radius: {
      6: 0,
      7: 0.8,
      8: 0
    }
  }), [])

  const circlesKeyframes = useMemo(() => ({
    radius: {
      14: 0,
      15: 1,
      17: 0
    }
  }), [])

  const setAKeyframes = useMemo(() => ({
    radius: {
      3: 0,
      4: 1.6,
      6: 0
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

      <Circle
        center={[0,-0.5]}
        keyframes={setAKeyframes}
        stepIndex={stepIndex}
        color={colors.blue}
        fillOpacity={0.2}
        strokeOpacity={0.4}
        labelContext={() => "$A$"}
        labelAttachDistance={30}
        labelAttach='ne'
        showCenterPoint={false}
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
        startFrame={6}
        endFrame={6}
        stepIndex={stepIndex}
      />
      {/* Jank label */}
      <Blob
        center={[0,0]}
        harmonicsConfig={{ seed: 450, scale: 0 }}
        size={0.7762}
        fillOpacity={0}
        strokeOpacity={0}
        color={colors.blue}
        labelContext={() => "$A$"}
        labelAttach="s"
        labelAttachDistance={30}
        startFrame={6}
        endFrame={6}
        stepIndex={stepIndex}
      />

      <PointSequence
        curve={(t) => [1/t - 1.08,0]}
        cutoff={100}
        k={0.85}
        pointColor={colors.red}
        startFrame={0}
        endFrame={3}
        stepIndex={stepIndex}
      />
      <PointSequence
        curve={(t) => [1.08 - 1/t,0]}
        cutoff={100}
        k={0.85}
        pointColor={colors.red}
        startFrame={0}
        endFrame={3}
        stepIndex={stepIndex}
      />
      <PointSequence
        curve={(t) => [1/t - 1.08,0]}
        cutoff={100}
        k={0.85}
        pointColor={colors.red}
        startFrame={6}
        endFrame={6}
        stepIndex={stepIndex}
      />
      <PointSequence
        curve={(t) => [1.08 - 1/t,0]}
        cutoff={100}
        k={0.85}
        pointColor={colors.red}
        startFrame={6}
        endFrame={6}
        stepIndex={stepIndex}
      />

      <Circle
        center={[0,0]}
        keyframes={circleKeyframes}
        stepIndex={stepIndex}
        color={colors.blue}
        strokeStyle="dashed"
        fillOpacity={0.2}
        strokeOpacity={0.4}
        labelContext={() => "$N_{1}(x)$"}
        labelAttachDistance={40}
        labelAttach='ne'
      />

      <PointSequence
        curve={(t) => [0,-0.8 + t/2]}
        cutoff={100}
        k={0.7}
        pointColor={colors.red}
        startFrame={7}
        endFrame={7}
        stepIndex={stepIndex}
      />

      <Blob
        size={blobSize}
        harmonics={blobHarmonics}
        color={colors.gray}
        startFrame={10}
        endFrame={17}
        stepIndex={stepIndex}
        labelAttach='w'
        labelContext={() => "$K$"}
      />

      <PointSequence
        curve={chaoticCurve}
        cutoff={50}
        k={0.99}
        pointColor={colors.red}
        startFrame={11}
        endFrame={17}
        stepIndex={stepIndex}
        labelAttach="s"
        labelPointIndex={2}
        labelContext={() => '$A$'}
      />

      {Array.from({ length: 120 }, (_, n) => (
        <Circle
          key={n}
          center={chaoticCurve2(n)}
          keyframes={circlesKeyframes}
          stepIndex={stepIndex}
          color={colors.blue}
          strokeStyle="dashed"
          fillOpacity={0.2}
          strokeOpacity={0.4}
          radiusScale={radii[n]}
          showCenterPoint={false}
        />
      ))}

      <AvoidantPoint
        constraintFunction={getBlobRadius}
        marginPixels={0}
        initialPosition={[0, 0]}
        startFrame={12}
        endFrame={14}
        pointColor={colors.purple}
        labelColor={colors.purple}
        stepIndex={stepIndex}
        blobSize={blobSize}
        blobHarmonics={blobHarmonics}
        labelContext={() => "$y$"}
        pointNumber={50}
        k={0.99}
        safetyFactor={0.9}
        pointFunction={chaoticCurve}
      />
    </BaseScene>
  )
}

export default SeqCompact

