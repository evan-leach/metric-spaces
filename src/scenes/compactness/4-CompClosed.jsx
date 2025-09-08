import { useMemo } from 'react'
import BaseScene from '../../components/BaseScene'
import { colors } from '../../config/colors'
import Circle from '../../components/objects/Circle'
import Blob from '../../components/objects/Blob'
import Union from '../../components/objects/Union'
import Point from '../../components/objects/Point'
import Distance from '../../components/intro/Distance'
import InequalityPlot from '../../components/objects/InequalityPlot'

export const SceneConfig = {
  zoom: { min: 0.2, max: 100 },
  steps: [
    "TOP: Our aim in this lesson is to prove that all compact sets are closed. Let's begin by considering an arbitrary\
    compact set $K$.",
    "TOP: Remember that a set is closed if it contains all of its boundary points. $$$$ To show that $K$ is closed, we\
    will prove that any point _not_ in $K$ cannot be a boundary point. Take a moment to think about why this is\
    equivalent to proving that $K$ is closed.",
    "TOP: Let's consider an arbitrary point $x$ which does not lie in $K$. We'll take the same approach as before:\
    choosing an open cover, finding a finite subcover, and finally using some property of finite sets.",
    "TOP: Here is the first set $A_1$ in our open cover: the set of all points that are further than a distance of $1$\
    away from $x$. We proved in a previous section that this set is open.",
    "TOP: The second set $A_2$ in our cover is the set of all points further than a distance of $\\frac{1}{2}$ away from\
    $x$.",
    "TOP: Repeating this process indefinitely, we get our infinite open cover.",
    "TOP: Which points are contained in this cover? Let's consider any point $y$ that is distinct from $x$. $$$$ The\
    distance between $x$ and $y$ is equal to some positive number $r$.",
    "TOP: Since the numbers $$1, \\frac{1}{2}, \\frac{1}{3}, \\frac{1}{4}, \\frac{1}{5}, \\frac{1}{6}, \\dots$$ get\
    arbitrarily close to $0$, they eventually get smaller than $r$. Let's choose one such number $\\frac{1}{k}$.",
    "TOP: The point $y$ is further than a distance of $\\frac{1}{k}$ from $x$, so it lies in the set $A_k$. This means\
    that $y$ lies in our open cover.",
    "TOP: Since $y$ was an arbitrary point distinct from $x$, our open cover contains _every_ point except for $x$. As\
    $K$ doesn't contain $x$ either, this means that the collection $A_1, A_2, A_3, \\dots$ is an open cover of $K$.",
    "TOP: Now we can take advantage of the fact that $K$ is compact to get a finite subcover from this open cover.",
    "TOP: Since this subcover is finite, we can choose the set with the _largest_ index $m$. This set $A_m$ contains all\
    the other sets in the subcover, so it also contains $K$.",
    "TOP: Unpacking the definition of $A_m$ tells us that every point of $K$ is further than a distance of $\\frac{1}{m}$\
    from $x$.",
    "TOP: In order for $x$ to be a boundary point of $K$, every neighborhood of $x$ would need to contain a point of $K$.\
    Since the neighborhood $N_{1/m}(x)$ does not, this means that $x$ is not a boundary point.",
    "TOP: This is just what we wanted to show! There are no boundary points in $K^c$, so every boundary point of $K$\
    must be an element of $K$. In other words, $K$ is closed.",
    "We now have another example of how compact sets are similar to finite sets. Finite sets are closed (singletons are\
    closed, so finite sets are finite unions of closed sets), and compact sets share this property.",
    "So far the properties we've proven about compact sets have all been simple and familiar. In the next lesson, we'll\
    prove a far more interesting and suprising property about compact sets."
  ]
}

function CompClosed({ windowSize, stepIndex, isPanelOpen, sceneKey }) {

  const circleKeyframes = useMemo(() => ({
    radius: {
      0: 0,
      14: 0.1,
      15: 0
    }
  }), [])
  
  const keepCircles = [4, 5, 7]

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
        color={colors.blue}
        style="solid"
        fillOpacity={0.25}
        startFrame={6}
        endFrame={10}
        stepIndex={stepIndex}
      />

      <Blob
        center={[0,-0.5]}
        size={2.3}
        harmonicsConfig={{ scale: 0.3, seed: 480 }}
        color={colors.gray}
        startFrame={0}
        endFrame={15}
        stepIndex={stepIndex}
        labelAttach='w'
        labelContext={() => "$K$"}
      />

      {Array.from({ length: 148 }, (_, i) => {
        const n = 150 - i; // Start from 150, go down to 3
        const fillOpacity = Math.pow(0.3, (n + 5) / 5);
        const strokeOpacity = 4 * fillOpacity;
        
        return (
          <Union
            key={`A-${n}`}
            shapes={[
              { type: 'circle', center: [2, -0.5], radius: 0.8 / n },
              { type: 'circle', center: [2, -0.5], radius: 0.8 / n }
            ]}
            color={colors.blue}
            fillOpacity={fillOpacity}
            strokeOpacity={strokeOpacity}
            invert={true}
            style="dashed"
            startFrame={6}
            endFrame={10}
            stepIndex={stepIndex}
          />
        );
      })}

      <Union
        key={`A-8`}
        shapes={[
          { type: 'circle', center: [2, -0.5], radius: 0.1 },
          { type: 'circle', center: [2, -0.5], radius: 0.1 }
        ]}
        color={colors.blue}
        fillOpacity={0.3}
        strokeOpacity={0.5}
        invert={true}
        style="dashed"
        startFrame={11}
        endFrame={13}
        stepIndex={stepIndex}
      />
      <Blob
        center={[2,-0.4]}
        size={0.01}
        harmonicsConfig={{ scale: 0.3, seed: 480 }}
        color={colors.blue}
        fillOpacity={0}
        strokeOpacity={0}
        startFrame={12}
        endFrame={13}
        stepIndex={stepIndex}
        labelAttach='n'
        labelContext={() => "$A_m$"}
        labelAttachDistance={20}
      />

      {keepCircles.map((n) => (
        <Union
          key={`A-${n}`}
          shapes={[
            { type: 'circle', center: [2, -0.5], radius: 0.8 / n },
            { type: 'circle', center: [2, -0.5], radius: 0.8 / n }
          ]}
          color={colors.blue}
          fillOpacity={0.2}
          strokeOpacity={0.4}
          invert={true}
          style="dashed"
          startFrame={11}
          endFrame={11}
          stepIndex={stepIndex}
        />
      ))}

      <Union
        key={`A-2`}
        shapes={[
          { type: 'circle', center: [2, -0.5], radius: 0.4 },
          { type: 'circle', center: [2, -0.5], radius: 0.4 }
        ]}
        color={colors.blue}
        fillOpacity={Math.pow(0.3, 7 / 5)}
        strokeOpacity={3 * Math.pow(0.3, 7 / 5)}
        invert={true}
        style="dashed"
        startFrame={5}
        endFrame={11}
        stepIndex={stepIndex}
      />
      <Union
        key={`A-1`}
        shapes={[
          { type: 'circle', center: [2, -0.5], radius: 0.8 },
          { type: 'circle', center: [2, -0.5], radius: 0.8 }
        ]}
        color={colors.blue}
        fillOpacity={Math.pow(0.3, 6 / 5)}
        strokeOpacity={3 * Math.pow(0.3, 6 / 5)}
        invert={true}
        style="dashed"
        startFrame={4}
        endFrame={10}
        stepIndex={stepIndex}
      />

      <Union
        key={`A-3`}
        shapes={[
          { type: 'circle', center: [2, -0.5], radius: 0.8/3 },
          { type: 'circle', center: [2, -0.5], radius: 0.8/3 }
        ]}
        color={colors.purple}
        fillOpacity={0.3}
        strokeOpacity={0.6}
        invert={true}
        style="dashed"
        startFrame={9}
        endFrame={9}
        stepIndex={stepIndex}
      />
      <Blob
        center={[2,-0.23]}
        size={0.01}
        harmonicsConfig={{ scale: 0.3, seed: 480 }}
        color={colors.purple}
        fillOpacity={0}
        strokeOpacity={0}
        startFrame={9}
        endFrame={9}
        stepIndex={stepIndex}
        labelAttach='n'
        labelContext={() => "$A_k$"}
        labelAttachDistance={20}
      />

      <Distance
        point1Center={[2,-0.5]}
        point2Center={[2.3, -0.3]}
        noPoints={true}
        lineColor={colors.gray}
        showLabel={true}
        labelAttach="e"
        labelAttachDistance={80}
        startFrame={7}
        endFrame={9}
        stepIndex={stepIndex}
        distanceScaleFactor={0.8}
        distanceLabelFormat={(distance) => `$d(x,y)=r$`}
      />

      <Circle
        center={[2,-0.5]}
        keyframes={circleKeyframes}
        stepIndex={stepIndex}
        color={colors.red}
        strokeStyle="dashed"
        fillOpacity={0.2}
        strokeOpacity={0.6}
        labelContext={() => "$N_{1/m}(x)$"}
        labelAttachDistance={40}
      />

      <Point
        center={[2,-0.5]}
        color={colors.red}
        startFrame={3}
        endFrame={14}
        stepIndex={stepIndex}
        labelContext={() => "$x$"}
        labelAttach="se"
      />
      <Point
        center={[2.3,-0.3]}
        color={colors.orange}
        startFrame={7}
        endFrame={9}
        stepIndex={stepIndex}
        labelContext={() => "$y$"}
        labelAttach="ne"
      />
    </BaseScene>
  )
}

export default CompClosed

