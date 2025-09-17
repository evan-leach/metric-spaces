import { useMemo } from 'react'
import BaseScene from '../../components/BaseScene'
import { colors } from '../../config/colors'
import Intersection from '../../components/objects/Intersection'
import Point from '../../components/objects/Point'
import PointSequence from '../../components/objects/PointSequence'
import Blob from '../../components/objects/Blob'
import Circle from '../../components/objects/Circle'
import { useKeyframeAnimation } from '../../hooks/useKeyframeAnimation'

export const SceneConfig = {
  steps: [
    "TOP: Our goal for this lesson is to prove that complete and totally bounded sets are sequentially compact, so let's begin with\
    such a set $A$. We know that $A$ is complete and totally bounded, and we need to show that any infinite subset $S$\
    of $A$ has a limit point in $A$.",
    "TOP: Our strategy is to show that some subset of $S$ is a _Cauchy set._ If we can do this, then the completeness of $A$ will\
    guarantee that this Cauchy set has a limit point in $A$. This will be our desired limit point of $S$.",
    "TOP: To find this Cauchy set, we'll take advantage of the total boundedness of $A$. Remember that this allows us to cover $A$ with\
    finitely many neighborhoods of _any_ radius, no matter how small. $$$$ Let's begin by covering $A$ with finitely many neighborhoods\
    of radius $1$.",
    "TOP: At least one of these sets must contain infinitely many points of $S$. Otherwise, we could split $S$ up into finitely\
    many pieces, each with only finitely many points. This would make $S$ finite, contradicting our assumption that $S$ is infinite.",
    "TOP: Let's call this new set $A_1$, and we'll pick some point $x_1$ of $S$ which lies in $A_1$. $$$$ We now have our first\
    point in our new set, and there are infinitely many remaining points of $S$ in $A_1$.",
    "TOP: Now we'll repeat the process. Since $A_1$ is totally bounded (it is a subset of the totally bounded set $A$), we can cover\
    it with finitely many neighborhoods of radius $\\frac{1}{2}$.",
    "TOP: We'll take the intersection of each neighborhood with $A_1$ to get a new cover of $A_1$. Since $A_1$ contains infinitely many\
    points of $S$, at least one of these sets must contain infinitely many points of $S$.",
    "TOP: Let's call this new set $A_2$ and pick some new point $x_2$ out of the remaining points in $S$ which lie in $A_2$.\
    $$$$ We now have the second point in our new set, and we still have infinitely many points of $S$ remaining in $A_2$.",
    "TOP: We can repeat this process indefinitely. At each step, we shrink the neighborhood size to $\\frac{1}{n}$, pick a new set $A_n$ which is\
    the intersection of one of these neighborhoods with $A_{n-1}$, and then choose one point of $A_n$ which we haven't yet picked to be\
    part of our new set.",
    "TOP: The reason we can keep doing this is because we can _always_ ensure that there are infinitely many more points of $S$ to choose from.\
    This is because at each stage, one of the neighborhoods must contain infinitely many points of $S$ in $A_n$.",
    "TOP: Now let's consider the set $X$ consisting of all points $x_n$ which are eventually chosen in this process. Since each step\
    involves choosing a new point in $S$ which hasn't yet been picked, $X$ is an infinite subset of $S$.",
    "TOP: Also, each point $x_n$ lies in the set $A_n$, and since the sets $A_n$ are nested within each other, any point chosen _after_\
    $x_n$ also lies in $A_n$.",
    "TOP: We formed the set $A_n$ by taking the intersection of $A_{n-1}$ with a neighborhood of radius $\\frac{1}{n}$, so $A_n$ is a\
    subset of this neighborhood. This means that $x_n$ and all the points coming after it lie in a single fixed neighborhood with radius\
    $\\frac{1}{n}$.",
    "TOP: In other words, we can cover _all but finitely many_ points of $X$ by a neighborhood of radius $\\frac{1}{n}$, no matter how\
    small the radius $\\frac{1}{n}$ gets. Specifically, we can cover every point in $X$ except for potentially the first $n-1$ points\
    chosen.",
    "TOP: This is exactly the definition of a Cauchy set! We have proven that some subset of $S$ is a Cauchy set, and the completeness\
    of $A$ guarantees that this Cauchy set has a limit point in $A$.",
    "TOP: Since $X$ is a subset of $S$, any limit point of $X$ is also a limit point of $S$. We have therefore proven that any infinite\
    subset $S$ of $A$ has a limit point in $A$, so $A$ is sequentially compact.",
    "With this proof, we can now fill in another arrow in our chain of implications: $$\\text{Compact}$$ $$\\Downarrow$$\
    $$\\text{Sequentially compact}$$ $$\\Updownarrow$$ $$\\text{Complete and totally bounded}$$",
    "After this challenging proof, we have just one step remaining. We need to prove that every sequentially compact set is compact\
    in order to fill in that last arrow.",
    "Though this final is also challenging, it will enable us to pin down the elusive compact sets and definitively\
    say what they _actually are:_ sets which are complete and totally bounded. We'll begin in the next lesson."
  ]
}

function SeqProof({ windowSize, stepIndex, isPanelOpen, sceneKey }) {

  const level0keyframes = useMemo(() => ({
    radius: {
      0: 0,
      3: 0.8,
      11: 0
    }
  }), [])

  const level1keyframes = useMemo(() => ({
    radius: {
      0: 0,
      6: 0.4,
      11: 0
    }
  }), [])

  const level2keyframes = useMemo(() => ({
    radius: {
      0: 0,
      9: 0.8/3,
      11: 0
    }
  }), [])

  const level3keyframes = useMemo(() => ({
    radius: {
      0: 0,
      10: 0.2,
      11: 0
    }
  }), [])

  const levelNkeyframes = useMemo(() => ({
    radius: {
      0: 0,
      12: 0.8/25,
      15: 0
    }
  }), [])

  const spiralCurve = (t) => {
    const angle = 100/t
    const radius = t * 1
    return [
      0.8 - radius * Math.cos(angle),
      radius * Math.sin(angle) - 0.4
    ]
  }

  const chaoticCurve = (t) => {
    const sx = 100 * t
    const sy = 94 * t
    const x = 4 * Math.abs(sx - Math.floor(sx) - 0.5) - 1
    const y = 4 * Math.abs(sy - Math.floor(sy) - 0.5) - 1
    return [
      1.7 * x * x * x,
      1.7 * y * y * y - 1 - x * 0.3
    ]
  }

  const animatedProps0 = useKeyframeAnimation(level0keyframes, stepIndex)
  const radius0 = animatedProps0.radius ?? 3
  const animatedProps1 = useKeyframeAnimation(level1keyframes, stepIndex)
  const radius1 = animatedProps1.radius ?? 3
  const animatedProps2 = useKeyframeAnimation(level2keyframes, stepIndex)
  const radius2 = animatedProps2.radius ?? 3
  const animatedProps3 = useKeyframeAnimation(level3keyframes, stepIndex)
  const radius3 = animatedProps3.radius ?? 3
  const animatedPropsN = useKeyframeAnimation(levelNkeyframes, stepIndex)
  const radiusN = animatedPropsN.radius ?? 3

  return (
    <BaseScene
      config={SceneConfig}
      sceneKey={sceneKey}
      stepIndex={stepIndex}
      isPanelOpen={isPanelOpen}
      windowSize={windowSize}
    >
      <Blob
        center={[0,-1]}
        size={2}
        harmonicsConfig={{ scale: 0.2, seed: 538 }}
        color={colors.blue}
        style='solid'
        startFrame={0}
        endFrame={16}
        stepIndex={stepIndex}
        labelContext={() => `$A$`}
        labelAttach='e'
      />

      <PointSequence
        curve={spiralCurve}
        cutoff={40}
        k={0.8}
        pointColor={colors.redeen}
        startFrame={2}
        endFrame={16}
        stepIndex={stepIndex}
      />
      <PointSequence
        curve={chaoticCurve}
        cutoff={100}
        k={0.99}
        pointColor={colors.redeen}
        startFrame={2}
        endFrame={16}
        stepIndex={stepIndex}
        labelAttach="se"
        labelPointIndex={5}
        labelContext={() => '$S$'}
      />
      <Point
        center={chaoticCurve(Math.pow(0.99, 8))}
        pointColor={colors.red}
        startFrame={5}
        endFrame={10}
        stepIndex={stepIndex}
        labelAttach="sw"
        labelContext={() => '$x_1$'}
      />

      {Array.from({ length: 16 }).map((_, i) => (
        <Circle
          key={`level-0-circle-${i}`}
          center={[-1.5 + i % 4, -2.5 + Math.floor(i / 4)]}
          keyframes={level0keyframes}
          stepIndex={stepIndex}
          color={colors.purple}
          strokeStyle="dashed"
          fillOpacity={0.1}
          strokeOpacity={0.2}
          startFrame={0}
          endFrame={4}
          showCenterPoint={false}
        />
      ))}

      <Circle
        center={[0.5, -0.5]}
        keyframes={level0keyframes}
        stepIndex={stepIndex}
        color={colors.green}
        strokeStyle="dashed"
        fillOpacity={0.3}
        strokeOpacity={0.6}
        startFrame={5}
        endFrame={15}
        showCenterPoint={false}
        labelContext={() => `$A_1$`}
        labelAttach='nw'
      />

      <Point
        center={chaoticCurve(Math.pow(0.99, 65))}
        pointColor={colors.red}
        startFrame={8}
        endFrame={10}
        stepIndex={stepIndex}
        labelAttach="se"
        labelContext={() => '$x_2$'}
      />

      {Array.from({ length: 9 }).map((_, i) => (
        <><Circle
          key={`level-1-circle-${i}`}
          center={[0 + i % 3 * 0.5, -1 + Math.floor(i / 3) * 0.5]}
          keyframes={level1keyframes}
          stepIndex={stepIndex}
          color={colors.purple}
          strokeStyle="dashed"
          fillOpacity={0.1}
          strokeOpacity={0.2}
          startFrame={0}
          endFrame={6}
          showCenterPoint={false}
        /><Intersection
          key={`level-1-intersection-${i}`}
          shapes={[
            { type: 'circle', center: [0 + i % 3 * 0.5, -1 + Math.floor(i / 3) * 0.5], radius: radius1 },
            { type: 'circle', center: [0.5, -0.5], radius: radius0 }
          ]}
          style='dashed'
          color={colors.purple}
          fillOpacity={0.1}
          strokeOpacity={0.2}
          startFrame={7}
          endFrame={7}
          stepIndex={stepIndex}
        /></>
      ))}

      <Intersection
        shapes={[
          { type: 'circle', center: [1, -0.5], radius: radius1 },
          { type: 'circle', center: [0.5, -0.5], radius: radius0 }
        ]}
        style='dashed'
        color={colors.green}
        fillOpacity={0.3}
        strokeOpacity={0.6}
        startFrame={8}
        endFrame={15}
        stepIndex={stepIndex}
      />
      <Circle
        center={[0.966, -0.5]}
        keyframes={level1keyframes}
        stepIndex={stepIndex}
        color={colors.green}
        strokeStyle="solid"
        fillOpacity={0}
        strokeOpacity={0}
        startFrame={8}
        endFrame={15}
        showCenterPoint={false}
        labelContext={() => `$A_2$`}
        labelAttach='ne'
      />

      <Point
        center={spiralCurve(Math.pow(0.8, 8))}
        pointColor={colors.red}
        startFrame={9}
        endFrame={10}
        stepIndex={stepIndex}
        labelAttach="w"
        labelContext={() => '$x_3$'}
      />

      <Intersection
        shapes={[
          { type: 'circle', center: [1, -0.5], radius: radius1 },
          { type: 'circle', center: [0.75, -0.35], radius: radius2 }
        ]}
        style='dashed'
        color={colors.green}
        fillOpacity={0.4}
        strokeOpacity={0.8}
        startFrame={9}
        stepIndex={stepIndex}
      />
      <Circle
        center={[0.88, -0.385]}
        keyframes={level2keyframes}
        stepIndex={stepIndex}
        color={colors.green}
        strokeStyle="solid"
        fillOpacity={0}
        strokeOpacity={0}
        startFrame={9}
        showCenterPoint={false}
        labelContext={() => `$A_3$`}
        labelAttach='n'
      />

      <Point
        center={spiralCurve(Math.pow(0.8, 10))}
        pointColor={colors.red}
        startFrame={10}
        endFrame={10}
        stepIndex={stepIndex}
        labelAttach="nw"
        labelContext={() => '$x_4$'}
      />
      <Intersection
        shapes={[
          { type: 'circle', center: [0.9, -0.4], radius: radius3 },
          { type: 'circle', center: [0.75, -0.35], radius: radius2 }
        ]}
        style='dashed'
        color={colors.green}
        fillOpacity={0.5}
        strokeOpacity={0.8}
        startFrame={9}
        stepIndex={stepIndex}
      />
      <Circle
        center={[0.8145, -0.385]}
        keyframes={level3keyframes}
        stepIndex={stepIndex}
        color={colors.green}
        strokeStyle="solid"
        fillOpacity={0}
        strokeOpacity={0}
        startFrame={10}
        showCenterPoint={false}
        labelContext={() => `$A_4$`}
        labelAttach='e'
      />

      <Point
        center={chaoticCurve(Math.pow(0.99, 8))}
        pointColor={colors.red}
        startFrame={11}
        endFrame={16}
        stepIndex={stepIndex}
      />
      <Point
        center={chaoticCurve(Math.pow(0.99, 65))}
        pointColor={colors.red}
        startFrame={11}
        endFrame={16}
        stepIndex={stepIndex}
      />
      <Point
        center={spiralCurve(Math.pow(0.8, 8))}
        pointColor={colors.red}
        startFrame={11}
        endFrame={16}
        stepIndex={stepIndex}
      />
      <Point
        center={spiralCurve(Math.pow(0.8, 10))}
        pointColor={colors.red}
        startFrame={11}
        endFrame={16}
        stepIndex={stepIndex}
      />
      <Point
        center={spiralCurve(Math.pow(0.8, 19))}
        pointColor={colors.red}
        startFrame={12}
        endFrame={12}
        stepIndex={stepIndex}
        labelAttach="n"
        labelContext={() => '$x_n$'}
      />
      <PointSequence
        curve={spiralCurve}
        shift={13}
        cutoff={40}
        k={0.8}
        pointColor={colors.red}
        startFrame={11}
        endFrame={16}
        labelContext={() => '$X$'}
        labelAttach='w'
        stepIndex={stepIndex}
      />

      <Intersection
        shapes={[
          { type: 'circle', center: [0.815, -0.408], radius: radiusN * 25/26 },
          { type: 'circle', center: [0.8, -0.38], radius: radiusN }
        ]}
        style='dashed'
        color={colors.green}
        fillOpacity={0.5}
        strokeOpacity={0.8}
        startFrame={0}
        endFrame={13}
        stepIndex={stepIndex}
      />
      <Circle
        center={[0.8, -0.38]}
        keyframes={levelNkeyframes}
        stepIndex={stepIndex}
        color={colors.purple}
        strokeStyle="dashed"
        fillOpacity={0.1}
        strokeOpacity={0.2}
        startFrame={13}
        showCenterPoint={false}
        labelContext={() => `$N_{1/n}(y)$`}
        labelAttach='n'
      />
      <Circle
        center={[0.8, -0.38]}
        keyframes={levelNkeyframes}
        stepIndex={stepIndex}
        color={colors.green}
        strokeStyle="solid"
        fillOpacity={0}
        strokeOpacity={0}
        showCenterPoint={false}
        labelContext={() => `$A_n$`}
        labelAttach='se'
      />
    </BaseScene>
  )
}

export default SeqProof

