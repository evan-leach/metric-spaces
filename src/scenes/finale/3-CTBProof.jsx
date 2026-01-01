import { useMemo, Fragment } from 'react'
import BaseScene from '../../components/BaseScene'
import { colors } from '../../config/colors'
import InequalityPlot from '../../components/objects/InequalityPlot'
import Point from '../../components/objects/Point'
import PointSequence from '../../components/objects/PointSequence'
import Blob from '../../components/objects/Blob'
import Circle from '../../components/objects/Circle'

export const SceneConfig = {
  steps: [
    "Our goal for this section is to prove that any compact set is complete and totally bounded. Our approach will be\
    to show this for _sequentially_ compact sets, rather than compact sets. $$$$ We will still achieve our goal by proving\
    this, since every compact set is sequentially compact.",
    "One claim is easy to see: any sequentially compact set is complete. $$$$ If $A$ is sequentially compact, then any infinite\
    subset of $A$ has a limit point in $A$. Since Cauchy sets are infinite, this means that every Cauchy subset of $A$ has a limit\
    point in $A$, which is exactly what it means for $A$ to be complete.",
    "The harder claim is that every sequentially compact set is totally bounded. $$$$ We will prove this in a slightly indirect\
    manner. We will show that if a set is _not_ totally bounded, then it _cannot_ be sequentially compact. If we can prove this,\
    then it will tell us that any set which _is_ sequentially compact must be totally bounded.",
    "TOP: Let's begin by considering a set $A$ which is not totally bounded. This means that for _some_ $r > 0$, the set $A$\
    cannot be covered by finitely many neighborhoods of radius $r$.",
    "TOP: This means that no matter how many neighborhoods of radius $r$ we use, there will always be some point in $A$\
    which is not covered by any of these neighborhoods.",
    "TOP: Remember our goal is to show that $A$ is not sequentially compact. $$$$ To do this, we need to find an infinite\
    subset of $A$ which does not have any limit points in $A$.",
    "TOP: We'll start constructing this subset point by point. First, we'll pick $x_1$ to be any point in $A$. This will be the\
    first element of our subset.",
    "TOP: Since $A$ cannot be covered by finitely many neighborhoods of radius $r$, this means that it cannot by covered by the\
    set $N_r(x_1)$. In other words, there are points of $A$ which do not lie in this neighborhood.",
    "TOP: We'll pick $x_2$ to be one of these points. Again, since $A$ cannot be covered by finitely many neighborhoods of radius\
    $r$, it is not covered by the two neighborhoods $N_r(x_1)$ and $N_r(x_2)$.",
    "TOP: This means that we can pick the point $x_3$ to be some point our $A$ which does not lie in $N_r(x_1)$ or $N_r(x_2)$.",
    "TOP: We can repeat this process indefinitely. We will never run out of points to pick, since $A$ cannot be covered by finitely\
    many neighborhoods of radius $r$.",
    "TOP: Now let's consider the set $X$ consisting of all points $x_n$ which are eventually chosen in this process.",
    "TOP: For any two points in this set, the point added later in the process is not contained in the neighborhood of radius $r$\
    around the point added earlier. In other words, any two points in $X$ are at least a distance of $r$ away from each other.",
    "TOP: This means that $X$ cannot have any limit points! Since $A$ has an infinite subset with no limit points, the set\
    $A$ is not sequentially compact.",
    "This proves our original claim that any sequentially compact set must be totally bounded. $$$$ Completeness\
    and total boundedness are indeed properties of compact sets, as we hoped.",
    "We can summarize what we currently know in this chain of implications: $$\\text{Compact}$$ $$\\Downarrow$$\
    $$\\text{Sequentially compact}$$ $$\\Downarrow$$ $$\\text{Complete and totally bounded}$$",
    "We've only been going in the easy direction so far. As we go down the chain, the properties get simpler, so all we're doing\
    is describing relatively straightforward consequences of more complex definitions.",
    "The amazing fact is that both of these implications are actually true in reverse! Not only can we traverse down the chain,\
    but we can go back up. $$$$ This means that compact sets are _precisely the same_ as the complete and totally bounded sets.\
    $$$$ It's remarkable that the reverse implications are even true, since we get such complex properties from nothing\
    more than completeness and total boundedness.",
    "We need to prove two things in order to show that traversing back up the chain is possible. $$$$ 1. Complete and totally bounded sets\
    are sequentially compact. $$$$ 2. Sequentially compact sets are compact.",
    "These two beautiful proofs will mark the conclusion of our exploration. We'll begin with the first one in the next lesson."
  ]
}

function CTBProof({ windowSize, stepIndex, isPanelOpen, sceneKey }) {

  const curve = (t) => {
    return [
      t * 0.3, (t * t * 0.006 + 1) * Math.sin(t)
    ]
  }

  const points = (t) => {
    return [
      ((t % 2) * 2 - 1) * (2.5 + t * 0.3), (t * t * 0.006 + 1) * Math.sin(t * 4.18)
    ]
  }

  const circlesKeyframes = useMemo(() => ({
    radius: {
      4: 0,
      5: 0.8,
      6: 0
    }
  }), [])

  const keyframes1 = useMemo(() => ({
    radius: {
      7: 0,
      8: 0.8,
      12: 0
    }
  }), [])

  const keyframes2 = useMemo(() => ({
    radius: {
      8: 0,
      9: 0.8,
      12: 0
    }
  }), [])

  const keyframes3 = useMemo(() => ({
    radius: {
      9: 0,
      10: 0.8,
      12: 0
    }
  }), [])

  const pointsKeyframes = useMemo(() => ({
    radius: {
      10: 0,
      11: 0.8,
      12: 0
    }
  }), [])

  const purpleKeyframes = useMemo(() => ({
    radius: {
      12: 0,
      13: 0.8,
      14: 0
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

      {/* Jank label */}
      <Blob
        center={[0, 0.007]}
        size={1}
        harmonicsConfig={{ scale: 0, seed: 1 }}
        fillOpacity={0}
        strokeOpacity={0}
        color={colors.blue}
        labelContext={() => "$A$"}
        labelAttach="s"
        labelAttachDistance={30}
        startFrame={0}
        endFrame={14}
        stepIndex={stepIndex}
      />

      <InequalityPlot
        yInequality={{ 
          "<=": (x) => x * x / 10 + 1,
          ">=": (x) => x * x / -10 - 1
        }}
        style="solid"
        fillOpacity={0.15}
        strokeOpacity={0.6}
        color={colors.blue}
        startFrame={0}
        endFrame={14}
        stepIndex={stepIndex}
      />

      {Array.from({ length: 101 }, (_, n) => (
        <Circle
          key={`circle-${n}`}
          center={curve(n - 50)}
          keyframes={circlesKeyframes}
          stepIndex={stepIndex}
          color={colors.purple}
          strokeStyle="dashed"
          fillOpacity={0.2}
          strokeOpacity={0.4}
          showCenterPoint={false}
        />
      ))}

      <Circle
        keyframes={keyframes1}
        stepIndex={stepIndex}
        color={colors.red}
        strokeStyle="dashed"
        fillOpacity={0.15}
        strokeOpacity={0.3}
        showCenterPoint={false}
      />

      <Point
        color={colors.red}
        startFrame={11}
        endFrame={14}
        stepIndex={stepIndex}
      />
      <Point
        color={colors.red}
        startFrame={7}
        endFrame={11}
        stepIndex={stepIndex}
        labelContext={() => '$x_1$'}
        labelAttach="ne"
      />

      <Circle
        center={[-1, -0.3]}
        color={colors.red}
        keyframes={keyframes2}
        fillOpacity={0.15}
        strokeOpacity={0.3}
        strokeStyle='dashed'
        stepIndex={stepIndex}
        labelContext={() => '$x_2$'}
        labelAttach="nw"
        labelAtCenter={true}
      />
      <Point
        center={[-1, -0.3]}
        color={colors.red}
        startFrame={11}
        endFrame={14}
        stepIndex={stepIndex}
      />

      <Circle
        center={[0.8, -0.7]}
        color={colors.red}
        keyframes={keyframes3}
        fillOpacity={0.15}
        strokeOpacity={0.3}
        strokeStyle='dashed'
        stepIndex={stepIndex}
        labelContext={() => '$x_3$'}
        labelAttach="se"
        labelAtCenter={true}
      />
      <Point
        center={[0.8, -0.7]}
        color={colors.red}
        startFrame={11}
        endFrame={14}
        stepIndex={stepIndex}
      />

      {Array.from({ length: 13 }, (_, n) => (
        <Fragment key={`pair-${n}`}><Circle
          key={`red-circle-${n}`}
          center={points(n)}
          keyframes={pointsKeyframes}
          stepIndex={stepIndex}
          color={colors.red}
          strokeStyle="dashed"
          fillOpacity={0.15}
          strokeOpacity={0.3}
          labelContext={() => `$x_{${n + 4}}$`}
          labelAttach={points(n)[1] > 0 ? "n" : "s"}
          labelAtCenter={true}
        />
        <Point
          key={`visible-${n}`}
          center={points(n)}
          color={colors.red}
          startFrame={11}
          endFrame={14}
          stepIndex={stepIndex}
        /></Fragment>
      ))}

      <PointSequence
        curve={(t) => [7/t - 0.5,-3/t * Math.sin(85/t)]}
        cutoff={80}
        k={0.9}
        pointColor={colors.red}
        startFrame={12}
        endFrame={14}
        stepIndex={stepIndex}
      />
      <PointSequence
        curve={(t) => [-7/t + 0.5,3/t * Math.sin(85/t)]}
        cutoff={80}
        k={0.9}
        pointColor={colors.red}
        startFrame={12}
        endFrame={14}
        stepIndex={stepIndex}
      />

      <Point
        center={points(2)}
        color={colors.red}
        startFrame={12}
        endFrame={14}
        stepIndex={stepIndex}
        labelContext={() => '$X$'}
        labelAttach="n"
      />

      <Circle
        center={points(7)}
        color={colors.purple}
        keyframes={purpleKeyframes}
        strokeStyle='dashed'
        stepIndex={stepIndex}
        labelContext={() => '$x_{11}$'}
        labelAttach="sw"
        labelAtCenter={true}
        labelAttachDistance={25}
      />
      <Point
        center={points(9)}
        color={colors.orange}
        startFrame={13}
        endFrame={13}
        stepIndex={stepIndex}
        labelContext={() => '$x_{13}$'}
        labelAttach="ne"
        labelAttachDistance={30}
      />

    </BaseScene>
  )
}

export default CTBProof

