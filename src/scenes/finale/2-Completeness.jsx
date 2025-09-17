import { useMemo } from 'react'
import BaseScene from '../../components/BaseScene'
import { colors } from '../../config/colors'
import Union from '../../components/objects/Union'
import InequalityPlot from '../../components/objects/InequalityPlot'
import Point from '../../components/objects/Point'
import PointSequence from '../../components/objects/PointSequence'
import Blob from '../../components/objects/Blob'
import Circle from '../../components/objects/Circle'

export const SceneConfig = {
  zoom: { min: 0.2, max: 100 },
  steps: [
    "TOP: The reason compact sets must be closed is that, if there is a limit point $x$ of a set\
    which is not contained in the set...",
    "TOP: ...then we can construct this open cover without a finite subcover. $$$$ You should hopefully remember this\
    cover from when we proved that compact sets are closed.",
    "However, requiring that sets are closed isn't enough to avoid this problem. The \"missing limit point\" might\
    not be part of the metric space, as we'll see on the next slide.",
    "TOP: Consider the metric space consisting of all points whose $x$-coordinate is either less than $-1$ or greater\
    than $1$. We saw this metric space earlier when we first defined closed sets.",
    "TOP: The set $A$, consisting of all points with an $x$-coordinate greater than $1$, is closed in this metric space.",
    "TOP: However, it is not compact. This is an open cover of $A$ with no finite subcover. $$$$ This collection of sets\
    doesn't cover any points with an $x$-coordinate of $1$, but this isn't a problem since those points aren't part of our\
    metric space.",
    "We need to upgrade the property of being closed to account for these missing limit points. This requires us to\
    capture the notion of a set of points \"approaching\" somewhere without actually saying where.",
    "TOP: Take a look at this set of points. They are getting closer and closer to some point, but remember our goal is to\
    not reference any actual limit point. Instead, notice that the points are also getting closer and closer to _each other._",
    "TOP: More precisely, we can fit all but finitely many of these points inside of a neighborhood with a small radius.",
    "TOP: As the radius gets smaller, we miss more and more of the points. However, we can still fit the infnite cluster\
    inside the neighborhood, leaving only finitely many points behind. Zoom in to see this clearly!",
    "TOP: This is the observation we will use for our definition. $$$$ We call a set $A$ a *Cauchy set* if $A$ is infinite\
    and for every $r > 0$, there is a neighborhood of radius $r$ which contains all but finitely many points of $A$.",
    "Notice that our definition doesn't reference the actual limit point, so it doesn't matter whether or not the limit\
    point is part of our metric space. We have solved the problem of missing limit points!",
    "We can now define our upgraded property: $$$$ A set $A$ is *complete* if every Cauchy subset of $A$ has a limit point\
    in $A$.",
    "TOP: Every complete set must be closed. Indeed, if $x$ is a limit point of $A$, then...",
    "TOP: ...we can construct a Cauchy set with $x$ as a limit point by choosing points in $A$ closer and closer to $x$. If\
    $A$ is complete, then this limit point $x$ must be part of $A$. This means that $A$ is closed.",
    "However, completeness is a stronger property than being closed. Instead of _just_ requiring that the limit points of $A$\
    are elements of $A$, we also require that whenever there _should_ be a limit point, there actually is one.",
    "TOP: For example, the closed set $A$ from earlier is not complete. Even though it contains all of its limit points, this\
    Cauchy subset of $A$ does not have a limit point in $A$.",
    "TOP: The Cauchy subset can _detect_ when a limit point should be present, even if no actual missing limit point exists in the\
    metric space.",
    "TOP: The entire coordinate plane is complete; any Cauchy set in the coordinate plane has a limit point.",
    "TOP: This looks visually obvious, but is actually a deep and fundamental fact about the _real numbers_ (where we include both\
    rational and irrational numbers). $$$$ Diving into this rabbit hole would take take us into the field of real analysis,\
    which is the study of real numbers.",
    "We saw in the previous lesson that, in the coordinate plane, boundedness is equivalent to total boundedness. Similarly,\
    completeness is equivalent to being closed in the coordinate plane.",
    "TOP: Any Cauchy subset $C$ of a closed set $A$ has a limit point in the coordinate plane since the entire coordinate plane\
    is complete. Since $A$ is closed, this limit point is also an element of $A$. Therefore, $C$ has a limit point in $A$.",
    "TOP: This means that any closed set in the coordinate plane is complete, so the two properties are equivalent.",
    "In the coordinate plane, complete and totally bounded sets are _exactly the same_ as closed and bounded sets. $$$$ Our two\
    new properties are not all that different from the familiar ones, but they take into account the potential complications\
    that can arise in strange metric spaces. For this reason, they will be the key to proving when sets are compact.",
    "Before this, we need to show that completeness and total boundedness really are properties of compact sets. In other words,\
    need to prove that compact sets are complete and totally bounded."
  ]
}

function Completeness({ windowSize, stepIndex, isPanelOpen, sceneKey }) {

  const spiralCurve = (t) => {
    const angle = 3 * t + 3.5
    const radius = t * 8
    return [
      0.5 - radius * Math.cos(angle),
      radius * Math.sin(angle) - 1
    ]
  }

  const spiralCurve2 = (t) => {
    const angle = -3 * t + 3.8
    const radius = t * 3
    return [
      -1.3 - radius * Math.cos(angle),
      radius * Math.sin(angle) - 1.6653
    ]
  }

  const spiralCurve3 = (t) => {
    const angle = 10000 * t
    const radius = t * 5
    return [
      0 - radius * Math.cos(angle),
      radius * Math.sin(angle) - 1
    ]
  }

  const circleKeyFrames = useMemo(() => ({
    radius: {
      8: 0,
      9: 0.3,
      10: 0
    }
  }), [])

  const circle2KeyFrames = useMemo(() => ({
    radius: {
      9: 0,
      10: 0.13,
      12: 0
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
      <InequalityPlot
        y={1000000}
        above={false}
        color={colors.purple}
        style="solid"
        fillOpacity={0.25}
        startFrame={2}
        endFrame={2}
        stepIndex={stepIndex}
      />

      <Blob
        center={[0,-0.5]}
        size={2.3}
        harmonicsConfig={{ scale: 0.3, seed: 520 }}
        color={colors.blue}
        style='dashed'
        startFrame={0}
        endFrame={2}
        stepIndex={stepIndex}
      />

      {Array.from({ length: 150 }, (_, i) => {
        const n = 150 - i; // Start from 150, go down to 1
        const fillOpacity = Math.pow(0.3, (n + 5) / 5);
        const strokeOpacity = 4 * fillOpacity;
        
        return (
          <Union
            key={`A-${n}`}
            shapes={[
              { type: 'circle', center: [1,-2.0561], radius: 0.8 / n },
              { type: 'circle', center: [1,-2.0561], radius: 0.8 / n }
            ]}
            color={colors.purple}
            fillOpacity={fillOpacity}
            strokeOpacity={strokeOpacity}
            invert={true}
            style="dashed"
            startFrame={2}
            endFrame={2}
            stepIndex={stepIndex}
          />
        );
      })}

      <Point
        center={[1,-2.0561]}
        color={colors.red}
        labelContext={() => '$x$'}
        labelAttach='s'
        startFrame={0}
        endFrame={2}
        stepIndex={stepIndex}
      />

      <InequalityPlot
        xInequality={{ 
          ">=": (y) => -0.8,
          "<=": (y) => 0.8
        }}
        color={colors.black}
        fillOpacity={0.4}
        strokeOpacity={0.5}
        startFrame={4}
        endFrame={6}
        stepIndex={stepIndex}
      />
      <InequalityPlot
        xInequality={{ 
          ">": (y) => 0.8
        }}
        color={colors.blue}
        strokeOpacity={0}
        startFrame={5}
        endFrame={6}
        stepIndex={stepIndex}
      />

      {Array.from({ length: 30 }, (_, i) => {
        const n = 30 - i; // Start from 30, go down to 1
        const fillOpacity = Math.pow(0.3, (n + 5) / 5);
        const strokeOpacity = 4 * fillOpacity;
        
        return (
          <InequalityPlot
            xInequality={{ 
              ">": (y) => 0.8 + Math.pow(0.8, n)
            }}
            color={colors.purple}
            fillOpacity={fillOpacity}
            strokeOpacity={strokeOpacity}
            strokeStyle="dashed"
            startFrame={6}
            endFrame={6}
            stepIndex={stepIndex}
          />
        );
      })}

      <PointSequence
        curve={spiralCurve}
        cutoff={40}
        k={0.6}
        pointColor={colors.blue}
        startFrame={8}
        endFrame={11}
        stepIndex={stepIndex}
      />

      <Circle
        center={[0.67, -1.08]}
        keyframes={circleKeyFrames}
        color={colors.purple}
        strokeStyle="dashed"
        fillOpacity={0.2}
        strokeOpacity={0.4}
        stepIndex={stepIndex}
        showCenterPoint={false}
      />

      <Circle
        center={[0.57, -1.02]}
        keyframes={circle2KeyFrames}
        color={colors.purple}
        strokeStyle="dashed"
        fillOpacity={0.2}
        strokeOpacity={0.4}
        stepIndex={stepIndex}
        showCenterPoint={false}
      />

      <Blob
        center={[0,-0.5]}
        size={1.8}
        harmonicsConfig={{ scale: 0.3, seed: 529 }}
        color={colors.blue}
        style='solid'
        startFrame={14}
        endFrame={15}
        stepIndex={stepIndex}
        labelContext={() => `$A$`}
        labelAttach='e'
      />

      <PointSequence
        curve={(t) => [3 * t - 1.422, -1.5]}
        cutoff={40}
        k={0.6}
        pointColor={colors.orange}
        startFrame={15}
        endFrame={15}
        stepIndex={stepIndex}
      />
      <Point
        center={[-1.422,-1.5]}
        color={colors.red}
        startFrame={14}
        endFrame={15}
        stepIndex={stepIndex}
        labelContext={() => `$x$`}
        labelAttach='w'
      />

      <InequalityPlot
        xInequality={{ 
          ">=": (y) => -0.8,
          "<=": (y) => 0.8
        }}
        color={colors.black}
        fillOpacity={0.4}
        strokeOpacity={0.5}
        startFrame={17}
        endFrame={18}
        stepIndex={stepIndex}
      />
      <InequalityPlot
        xInequality={{ 
          ">": (y) => 0.8
        }}
        color={colors.blue}
        strokeOpacity={0}
        startFrame={17}
        endFrame={18}
        stepIndex={stepIndex}
      />

      <PointSequence
        curve={(t) => [3 * t + 0.8, -0.8]}
        cutoff={40}
        k={0.6}
        pointColor={colors.red}
        startFrame={17}
        endFrame={18}
        stepIndex={stepIndex}
      />

      <InequalityPlot
        y={1000000}
        above={false}
        color={colors.blue}
        startFrame={19}
        endFrame={20}
        stepIndex={stepIndex}
      />

      <PointSequence
        curve={spiralCurve3}
        cutoff={40}
        k={0.6}
        pointColor={colors.red}
        startFrame={19}
        endFrame={20}
        stepIndex={stepIndex}
      />

      <Blob
        center={[0,-0.5]}
        size={2.1}
        harmonicsConfig={{ scale: 0.1, seed: 521 }}
        color={colors.blue}
        style='solid'
        startFrame={22}
        endFrame={23}
        stepIndex={stepIndex}
        labelContext={() => `$A$`}
        labelAttach='e'
      />

      <PointSequence
        curve={spiralCurve2}
        cutoff={40}
        k={0.6}
        pointColor={colors.red}
        startFrame={22}
        endFrame={23}
        labelAttach='e'
        labelContext={() => '$C$'}
        labelPointIndex={2}
        stepIndex={stepIndex}
      />
    </BaseScene>
  )
}

export default Completeness

