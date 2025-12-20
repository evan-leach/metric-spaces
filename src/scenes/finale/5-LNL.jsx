import { useMemo } from 'react'
import BaseScene from '../../components/BaseScene'
import { colors } from '../../config/colors'
import Intersection from '../../components/objects/Intersection'
import Point from '../../components/objects/Point'
import PointSequence from '../../components/objects/PointSequence'
import Blob from '../../components/objects/Blob'
import Circle from '../../components/objects/Circle'
import InequalityPlot from '../../components/objects/InequalityPlot'
import LNLPoint from '../../components/objects/LNLPoint'
import ConstrainedMovablePoint from '../../components/objects/ConstrainedMovablePoint'

export const SceneConfig = {
  zoom: { min: 0.6, max: 1000 },
  steps: [
    "Proving that _every_ open cover of a set $A$ has a finite subcover is a difficult task. As we saw when we first defined compactness,\
    there is a huge variety of covers to choose from. It seems impossible to prove anything about all these infinitely many possible\
    covers.",
    "However, there was one special case where the proof was easy. When the set $A$ was _finite,_ we could just choose one set from our\
    collection to cover each point in $A$.",
    "This exact technique doesn't work when $A$ is infinite, but it at least gives us some sort of direction. In this lesson, we will\
    prove an auxillary result which will enable us to use this idea for infinite sets. $$$$ We call such an auxillary result\
    a *lemma:* a subclaim which we tackle first as part of a larger proof.",
    "TOP: Let's see what the lemma states. If we have an open cover of a set $A$, then every point $x$ in $A$ is contained in\
    some open set $U$ in the cover.",
    "TOP: Since $U$ is open, there exists $r > 0$ such that $N_r(x)$ is entirely contained in $U$. However, as the point $x$ changes, the\
    necessary radius to stay entirely within a single open set in the cover might also change.",
    "TOP: For a cover like this, the radius $r$ might need to get arbitrarily small. Try moving the point $x$ far away to the left or right\
    to see this! $$$$ For any $r > 0$, there is some point $x$ in $A$ such that $N_r(x)$ is not contained in any single open set in the cover.",
    "TOP: For a cover like this, the situation is different. There exists a fixed radius $r > 0$ such that for _every_ point\
    $x$ in $A$, the neighborhood $N_r(x)$ is fully contained in some open set in the cover.",
    "TOP: If such an $r$ exists, we call it a *Lebesgue number* of the cover. The past two examples have shown us that some covers have\
    Lebesgue numbers, while some do not.",
    "The lemma we will prove is called the *Lebesgue number lemma.* $$$$ It states that every open cover of a sequentially compact set has a\
    Lebesgue number. $$$$ In other words, there exists some fixed $r > 0$ such that every neighborhood of radius $r$ around a point $x$ in $A$\
    lies entirely within some open set in the cover.",
    "Though this property seems a bit arbitrary right now, we'll see in the next lesson how it's the key tool for finding a finite subcover.\
    In fact, this lemma is where almost all of the work happens. Once we're done, the rest of the proof will fall right into place. $$$$\
    Let's get started with proving the lemma!",
    "TOP: We'll begin with a sequentially compact set $A$ and some open cover of $A$. $$$$ As we saw in the previous examples, not all covers\
    have a Lebesgue number. We need to take advantage of our assumption that $A$ is sequentially compact, which means using the fact that\
    every infinite subset of $A$ has a limit point in $A$.",
    "TOP: Lebesgue numbers have seemingly nothing to do with sequential compactness, so we'll need to do some work. $$$$ Our strategy will be\
    to _encode_ the existence of a Lebesgue number into a set of points, and then apply sequential compactness to\
    this set. Just like we did in the previous proofs, we'll construct this set point by point.",
    "TOP: If $1$ is _not_ a Lebesgue number of this cover, this means that for some point $x_1$ in $A$, the neighborhood $N_1(x_1)$ is not\
    contained in any single open set in the cover. $$$$ This will be the first point in our set.",
    "TOP: If $\\frac{1}{2}$ is not a Lebesgue number of this cover, then there exists a point $x_2$ in $A$ such that $N_{1/2}(x_2)$ is not\
    contained in any single open set in the cover. $$$$ Now our set has a second point.",
    "TOP: How long can we repeat this process? $$$$ If $\\frac{1}{n}$ ever becomes small enough that we can no longer a neighborhood\
    $N_{1/n}(x_n)$ which is not contained in any single open set in the cover, this would mean that _every_ such neighborhood\
    is fully contained in some open set in the cover. In other words, $\\frac{1}{n}$ would be a Lebesgue number of the cover.",
    "TOP: If, on the other hand, we can continue indefinitely, this would mean that $A$ has no Lebesgue number. Our goal will be to show\
    that this cannot happen. If the process must terminate, then it means this covering has a Lebesgue number.",
    "TOP: Let's repeat the process as long as possible, and consider the set $X$ consisting of all points which are eventually chosen. $$$$\
    We know that if the process terminates, then $X$ will be finite.",
    "TOP: What if the process _does_ go on indefinitely? Then the only way $X$ can be finite in this case is if some point gets repeated\
    infinitely many times. This is impossible, though, since for any fixed point $x$ in $A$, any sufficiently small neighborhood of $x$\
    is fully contained in some open set in the cover.",
    "TOP: In other words, the only way that the process can go on forever is if $X$ is infinite. $$$$ We have _encoded_ the existence of a\
    Lebesgue number into the set $X$. The set $A$ has a Lebesgue number _if and only if _ $X$ is finite.",
    "TOP: Now we can use sequential compactness! Since every infinite subset of $A$ has a limit point in $A$, we can prove that $X$ is finite\
    by showing that it has no limit points in $A$.",
    "TOP: Let's consider any point $y$ in $A$. We will show that $y$ is not a limit point of $X$. $$$$ First notice that since $y$ lies\
    in some open set $U$ in the cover, there exists a neighborhood $N_s(y)$ which is fully contained in $U$. Zoom in to see this clearly!",
    "TOP: If a neighborhood centered at some point $z$ in $N_{s/2}(y)$ had a radius smaller than $\\frac{s}{2}$, this neighborhood\
    would be fully contained in $N_s(y)$ and therefore fully contained in $U$ as well. This is because of the triangle inequality,\
    and the argument is similar to the proof from earlier that neighborhoods are open.",
    "TOP: This means that, although the neighborhood $N_{s/2}(y)$ might contain some points of $X$, it cannot contain infinitely many.\
    Once $\\frac{1}{n}$ becomes smaller than $\\frac{s}{2}$, no point $x_n$ can lie in $N_{s/2}(y)$ (as $N_{1/n}(x_n)$ would then be entirely\
    contained in $U$, violating the method we chose the points $x_n$ with).",
    "TOP: For $y$ to be a limit point of $X$, every neighborhood of $y$ would have to contain _infinitely many_ points of $X$. Since the\
    neighborhood $N_{s/2}(y)$ does not, $y$ cannot be a limit point of $X$.",
    "TOP: This is just what we needed to show! We have proven that $X$ has no limit points in $A$, so it must be finite by sequential compactness.\
    This means the process of choosing points $x_n$ cannot continue indefinitely, so once $\\frac{1}{n}$ gets small enough, _every_ neighborhood\
    of radius $\\frac{1}{n}$ around a point $x$ in $A$ must be fully contained in some open set in the cover.",
    "In other words, $\\frac{1}{n}$ is a Lebesgue number of the cover. This is exactly what we wanted to prove! $$$$ Now let's finally see how\
    the lemma shows that sequentially compact sets are compact."
  ]
}

function LNL({ windowSize, stepIndex, isPanelOpen, sceneKey }) {

  const noNumberKeyframes = useMemo(() => ({
    radius: {
      0: 2,
      1: 2,
      7: 0
    }
  }), [])

  const numberKeyframes = useMemo(() => ({
    radius: {
      0: 0,
      7: 2,
      9: 0
    }
  }), [])

  const radiusKeyframes = useMemo(() => ({
    radius: {
      0: 0,
      5: 1,
      9: 0
    }
  }), [])

  const keyframes1 = useMemo(() => ({
    radius: {
      0: 0,
      13: 0.8,
      17: 0
    }
  }), [])

  const keyframes2 = useMemo(() => ({
    radius: {
      0: 0,
      14: 0.4,
      17: 0
    }
  }), [])

  const keyframes3 = useMemo(() => ({
    radius: {
      0: 0,
      15: 1,
      17: 0
    }
  }), [])

  const fixedKeyframes = useMemo(() => ({
    radius: {
      0: 0,
      18: 0.12,
      19: 0
    }
  }), [])

  const bigKeyframes = useMemo(() => ({
    radius: {
      0: 0,
      21: 0.12,
      24: 0
    }
  }), [])

  const smallKeyframes = useMemo(() => ({
    radius: {
      0: 0,
      22: 0.06,
      25: 0
    }
  }), [])

  const zKeyframes = useMemo(() => ({
    radius: {
      0: 0,
      22: 0.06,
      23: 0
    }
  }), [])

  const centers = [
    [-1,0.1],
    [1,-0.2],
    [-1,-1.8],
    [1.2,-1.5],
    [-2.63,-2.73],
    [1.35,-0.7],
    [-1.05,-2],
    [-1.03,-1.9],
    [1.25,-1.55],
    [1.4,-0.7],
    [1.38,-0.64],
    [1.38,-0.665]
  ]

  const points = Array.from({ length: 151 }, (_, i) => {
    const x = (i - 75) * (3.6661 - 2 / (Math.abs(i - 75) + 1))
    const y = -0.8
    return [x, y]
  })

  return (
    <BaseScene
      config={SceneConfig}
      sceneKey={sceneKey}
      stepIndex={stepIndex}
      isPanelOpen={isPanelOpen}
      windowSize={windowSize}
    >
      <InequalityPlot
        yInequality={{ 
          ">=": (x) => -1.6,
          "<=": (x) => 0
        }}
        style="dashed"
        fillOpacity={0.4}
        strokeOpacity={0.8}
        color={colors.gray}
        startFrame={0}
        endFrame={8}
        stepIndex={stepIndex}
      />

      {/* Jank label */}
      <Blob
        center={[0, 0.3]}
        fillOpacity={0}
        strokeOpacity={0}
        color={colors.gray}
        labelContext={() => "$A$"}
        labelAttach="s"
        labelAttachDistance={30}
        startFrame={0}
        endFrame={8}
        stepIndex={stepIndex}
      />

      {Array.from({ length: 151 }).map((_, i) => (
        <Circle
          key={`circle-${i}`}
          center={[(i - 75) * (3.6661 - 2/(Math.abs(i - 75) + 1)),-0.8]}
          keyframes={noNumberKeyframes}
          stepIndex={stepIndex}
          color={colors.blue}
          strokeStyle="dashed"
          fillOpacity={0.2}
          strokeOpacity={0.4}
          showCenterPoint={false}
        />
      ))}

      {Array.from({ length: 151 }).map((_, i) => (
        <Circle
          key={`circle-${i}`}
          center={[(i - 75) * 3,-0.8]}
          keyframes={numberKeyframes}
          stepIndex={stepIndex}
          color={colors.blue}
          strokeStyle="dashed"
          fillOpacity={0.2}
          strokeOpacity={0.4}
          showCenterPoint={false}
        />
      ))}

      <Blob
        center={[0,-1]}
        size={3}
        harmonicsConfig={{ scale: 0.2, seed: 555 }}
        color={colors.gray}
        style='solid'
        startFrame={11}
        endFrame={25}
        stepIndex={stepIndex}
        labelContext={() => `$A$`}
        labelAttach='w'
      />
      <Blob
        center={[-2,0]}
        size={1.5}
        harmonicsConfig={{ scale: 0.2, seed: 555 }}
        color={colors.blue}
        style='dashed'
        fillOpacity={0.2}
        strokeOpacity={0.4}
        startFrame={11}
        endFrame={25}
        stepIndex={stepIndex}
      />
      <Blob
        center={[2.5,-1.8]}
        size={1.5}
        harmonicsConfig={{ scale: 0.2, seed: 556 }}
        color={colors.blue}
        style='dashed'
        fillOpacity={0.2}
        strokeOpacity={0.4}
        startFrame={11}
        endFrame={25}
        stepIndex={stepIndex}
      />
      <Blob
        center={[0,-1]}
        size={1.5}
        harmonicsConfig={{ scale: 0.2, seed: 557 }}
        color={colors.blue}
        style='dashed'
        fillOpacity={0.2}
        strokeOpacity={0.4}
        startFrame={11}
        endFrame={25}
        stepIndex={stepIndex}
      />
      <Blob
        center={[0,-3]}
        size={2}
        harmonicsConfig={{ scale: 0.3, seed: 559 }}
        color={colors.blue}
        style='dashed'
        fillOpacity={0.2}
        strokeOpacity={0.4}
        startFrame={11}
        endFrame={25}
        stepIndex={stepIndex}
      />
      <Blob
        center={[-2.25,-1.6]}
        size={1.5}
        harmonicsConfig={{ scale: 0.3, seed: 567 }}
        color={colors.blue}
        style='dashed'
        fillOpacity={0.2}
        strokeOpacity={0.4}
        startFrame={11}
        endFrame={25}
        stepIndex={stepIndex}
      />
      <Blob
        center={[2,0.5]}
        size={1.5}
        harmonicsConfig={{ scale: 0.2, seed: 567 }}
        color={colors.blue}
        style='dashed'
        fillOpacity={0.2}
        strokeOpacity={0.4}
        startFrame={11}
        endFrame={25}
        stepIndex={stepIndex}
      />
      <Blob
        center={[0,1]}
        size={1.5}
        harmonicsConfig={{ scale: 0.2, seed: 569 }}
        color={colors.blue}
        style='dashed'
        fillOpacity={0.2}
        strokeOpacity={0.4}
        startFrame={11}
        endFrame={25}
        stepIndex={stepIndex}
      />
      <Blob
        center={[2.5,-1.8]}
        size={1.5}
        harmonicsConfig={{ scale: 0.2, seed: 556 }}
        color={colors.green}
        style='dashed'
        fillOpacity={0.2}
        strokeOpacity={0.4}
        startFrame={18}
        endFrame={18}
        stepIndex={stepIndex}
      />
      <Blob
        center={[2,0.5]}
        size={1.5}
        harmonicsConfig={{ scale: 0.2, seed: 567 }}
        color={colors.green}
        style='dashed'
        fillOpacity={0.2}
        strokeOpacity={0.4}
        startFrame={21}
        endFrame={24}
        stepIndex={stepIndex}
        labelContext={() => `$U$`}
        labelAttach='e'
      />

      <Circle
        center={[-1,0.1]}
        stepIndex={stepIndex}
        color={colors.red}
        keyframes={keyframes1}
        strokeStyle='dashed'
        labelContext={() => '$N_1(x_1)$'}
        labelAttach="ne"
        labelAttachDistance={35}
      />

      <Circle
        center={[1,-0.2]}
        stepIndex={stepIndex}
        color={colors.red}
        keyframes={keyframes2}
        strokeStyle='dashed'
        labelContext={() => '$N_{1/2}(x_2)$'}
        labelAttach="e"
        labelAttachDistance={55}
      />

      <Circle
        center={[-1,-1.8]}
        stepIndex={stepIndex}
        color={colors.red}
        keyframes={keyframes3}
        strokeStyle='dashed'
        labelContext={() => '$N_{1/3}(x_3)$'}
        labelAttach="s"
        radiusScale={1/3}
        labelAttachDistance={25}
      />

      <Circle
        center={[1.2,-1.5]}
        stepIndex={stepIndex}
        color={colors.red}
        keyframes={keyframes3}
        strokeStyle='dashed'
        labelContext={() => '$N_{1/4}(x_4)$'}
        labelAttach="s"
        radiusScale={1/4}
        labelAttachDistance={25}
      />

      <Circle
        center={[-2.63,-2.73]}
        stepIndex={stepIndex}
        color={colors.red}
        keyframes={keyframes3}
        strokeStyle='dashed'
        labelContext={() => '$N_{1/5}(x_5)$'}
        labelAttach="nw"
        radiusScale={1/5}
        labelAttachDistance={35}
      />

      <Circle
        center={[1.35,-0.7]}
        stepIndex={stepIndex}
        color={colors.red}
        keyframes={keyframes3}
        strokeStyle='dashed'
        labelContext={() => '$N_{1/6}(x_6)$'}
        labelAttach="se"
        radiusScale={1/6}
        labelAttachDistance={35}
      />

      {centers.map((center, index) => (
        <Point
          key={`point-${index}`}
          center={center}
          color={colors.red}
          startFrame={17}
          endFrame={25}
          stepIndex={stepIndex}
          labelContext={index == 1 ? () => `$X$` : null}
          labelAttach="n"
        />
      ))}

      <Circle
        center={[1.3,-1.5]}
        stepIndex={stepIndex}
        color={colors.purple}
        keyframes={fixedKeyframes}
        strokeStyle='dashed'
        labelContext={() => '$x$'}
        labelAtCenter={true}
        labelAttach="se"
      />

      <Circle
        center={[1.4,-0.62]}
        stepIndex={stepIndex}
        color={colors.purple}
        keyframes={bigKeyframes}
        strokeStyle='dashed'
        labelContext={() => '$N_s(y)$'}
        labelAttach="ne"
        labelAttachDistance={40}
      />

      <Circle
        center={[1.4,-0.62]}
        stepIndex={stepIndex}
        color={colors.purple}
        keyframes={smallKeyframes}
        strokeStyle='dashed'
        labelContext={() => '$N_{s/2}(y)$'}
        labelAttach="nw"
        labelAttachDistance={45}
      />

      <ConstrainedMovablePoint
        center={[1.4,-0.62]}
        startFrame={22}
        endFrame={22}
        stepIndex={stepIndex}
        labelContext={() => "$z$"}
        labelAttach="s"
        labelAttachDistance={25}
        constraintFunction={() => 0.06}
        marginPixels={5}
        initialPosition={[1.43,-0.6]}
        color={colors.orange}
        showCircle={true}
        circleKeyframes={zKeyframes}
        circleFillOpacity={0.2}
        circleStrokeOpacity={0.4}
        circleWeight={2}
        circleStrokeStyle="dashed"
      />

      <LNLPoint
        yMax={0}
        yMin={-1.6}
        marginPixels={3}
        initialPosition={[0, -0.8]}
        color={colors.red}
        radius={0.12}
        fillOpacity={0.2}
        strokeOpacity={0.8}
        startFrame={4}
        endFrame={8}
        points={points}
        labelContext={() => "$x$"}
        pointRadii={2}
        finalSize={0.28}
        transitionFrame={7}
        stepIndex={stepIndex}
        strokeStyle="solid"
        showCircle={true}
        circleKeyframes={radiusKeyframes}
        circleFillOpacity={0.2}
        circleStrokeOpacity={0.4}
        circleWeight={2}
        circleStrokeStyle="dashed"
      />

    </BaseScene>
  )
}

export default LNL

