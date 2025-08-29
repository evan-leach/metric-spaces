import React, { useMemo, useState } from 'react'
import BaseScene from '../../components/BaseScene'
import Point from '../../components/objects/Point'
import Circle from '../../components/objects/Circle'
import Diamond from '../../components/intro/Diamond'
import InequalityPlot from '../../components/objects/InequalityPlot'
import TaxicabDistance from '../../components/intro/TaxicabDistance'
import DisplayOverlay from '../../components/text/DisplayOverlay'
import { useKeyframeAnimation } from '../../hooks/useKeyframeAnimation'
import { ANIMATION_SPEED } from '../../constants/animations'
import { colors } from '../../config/colors'

export const SceneConfig = {
  steps: [
    "TOP: Here's a shape you're probably familar with: a circular disk, centered at $x$ and with radius $3$.\
    You can recognize a disk when you see one, but can you actually _define_ what a disk is? Take a moment to try.",
    "TOP: Here's the answer:\
    $$$$ This is the set of all points in the coordinate plane within a distance of $3$ from $x$.",
    "Since this definition relies on nothing other than sets and distances, we can use this same definition in _any_\
    metric space. In our $3$-dimensional world, for example, it looks like a ball. In $1$ dimension, it's an _interval_\
    (i.e. a line segment).",
    "Mathematicians call this set a *ball,* and we use the notation $B_r(x)$ to denote the ball centered at $x$ with\
    radius $r$. $$$$ In other words, $B_r(x)$ is the _set_ of all points $y$ in our metric space such that $d(x,y) \\leq r$.",
    "TOP: This is what the ball $B_3(x)$ looks like when we use the _taxicab metric._ Take a look at the next slide\
    to see why.",
    "TOP: Pick any point in this set, and you will see that the distance between it and $x$ is at most $3$.\
    $$$$ You'll also see that any point _not_ in the set is at least a distance of $3$ away from $x$.",
    "As you can see, the shape of a ball depends on the metric. It may feel weird to call this a ball, but remember that\
    we are _defining_ a ball as the set of all points within a certain distance from the center. Nowhere in this definition\
    do we say that a ball must be \"round.\"",
    "TOP: This is what a ball of radius $3$ looks like when we use the _Chebyshev metric._ The next slide will again reveal\
    why.",
    "TOP: You should again verify that this set contains precisely the points within a distance of $3$ from $x$. $$$$\
    In other words, a point $y$ lies in this set if and only if $d(x,y) \\leq 3$.",
    "TOP: This is what a ball of radius $3$ looks like when we use the _discrete metric._ It contains _every_ point in the\
    plane. $$$$ Remember that in the discrete metric, the only possible distances are $0$ and $1$. This means that _every_\
    point in the coordinate plane is within a distance of $3$ from $x$.",
    "TOP: Finally, this is what a ball of radius $0$ looks like in _any_ metric space. It contains only the point $x$.\
    $$$$ This is a consequence of positive definiteness: the distance between $x$ and $y$ is $0$ _if and only if_ $x$ and $y$\
    are the same point.",
    "Now we'll define one last concept. If $x$ is a point in our metric space, we define the *neighborhood* of $x$ with radius $r$\
    to be the set of all points $y$ in our metric space such that $d(x,y)$ is _strictly less_ than $r$. We denote this set by $N_r(x)$.\
    $$$$ The neighborhood $N_r(x)$ is different from the ball $B_r(x)$ since the neighborhood doesn't include points that are a distance\
    of _exactly_ $r$ from $x$.",
    "The distinction between balls and neighborhoods isn't always important, but it's crucial for one number in particular: zero.\
    $$$$ If a ball centered at $x$ has radius $0$, then it includes only $x$. But since neighborhoods only include points whose distance\
    from the center is _less_ than the radius, a neighborhood of radius $0$ wouldn't contain any points! $$$$ For this reason,\
    we require for any neighborhood $N_r(x)$ that $r > 0$.",
    "Since every neighborhood has positive radius (note that positive means _strictly_ greater than $0$), this means that a neighborhood\
    $N_r(x)$ doesn't just tell us about $x$. It tells us about both $x$ _and_ the points that are _close_ to $x$.",
    "TOP: We will distinguish between balls and neighborhoods by using a solid line for the boundary of a ball and a dashed line for\
    the boundary of a neighborhood. The dashed line is _not_ a part of the set, since it marks the points whose distance from $x_2$\
    is _exactly_ $2$.",
    "This concludes our introduction! $$$$ In the next sections, we will stick to visualizing our metric spaces using the standard\
    Euclidean metric. Balls will be round, just like you're used to. However, you should keep in mind that all the concepts we will\
    develop work in _any_ metric space.",
    "In the next section, we will learn about open and closed sets. These are two special kinds of sets that form the foundation\
    for the study of metric spaces. We will learn about insides, outsides, and boundaries, and we will even take our first\
    serious look at infinity."
  ]
}

function Balls({ 
  windowSize, 
  stepIndex, 
  isPanelOpen,
  sceneKey 
}) {

  const [taxicabDistances, setTaxicabDistances] = useState({
    horizontal: 0,
    vertical: 0
  })

  const formatDistance = (distance) => (distance / 0.8).toFixed(2)
  
  // First get the rounded numbers
  const horizontalDistNum = parseFloat(formatDistance(taxicabDistances.horizontal))
  const verticalDistNum = parseFloat(formatDistance(taxicabDistances.vertical))
  
  // Then do math operations on the rounded numbers
  const horizontalDist = horizontalDistNum.toFixed(2)
  const verticalDist = verticalDistNum.toFixed(2)
  const totalDist = (horizontalDistNum + verticalDistNum).toFixed(2)
  const maxDist = Math.max(horizontalDistNum, verticalDistNum).toFixed(2)
  const taxicabFormula = `d(x,y) = ${horizontalDist} + ${verticalDist} = ${totalDist}`
  const chebyshevFormula = `d(x,y) = \\max(${horizontalDist}, ${verticalDist}) = ${maxDist}`

  const taxicabKeyframes = useMemo(() => ({
    opacity: {
      5: 0,
      6: 1,
      7: 0,
      9: 1,
      10: 0
    }
  }), [])
  
  const taxicabAnimatedValues = useKeyframeAnimation(taxicabKeyframes, stepIndex)
  const taxicabOpacity = taxicabAnimatedValues.opacity ?? 0

  // Create dynamic color keyframes based on which distance is longer and current step
  const colorKeyframes = useMemo(() => {
    const isHorizontalLonger = taxicabDistances.horizontal > taxicabDistances.vertical
    
    let horizontalColor = colors.gray
    let verticalColor = colors.gray
    
    if (stepIndex === 9) {
      horizontalColor = isHorizontalLonger ? colors.black : colors.gray
      verticalColor = isHorizontalLonger ? colors.gray : colors.black
    }
    
    return {
      horizontalLabelColor: { 0: horizontalColor },
      verticalLabelColor: { 0: verticalColor }
    }
  }, [taxicabDistances.horizontal, taxicabDistances.vertical, stepIndex])

  const colorAnimatedValues = useKeyframeAnimation(colorKeyframes, 0, { speed: ANIMATION_SPEED * 5 })
  const horizontalLabelColor = colorAnimatedValues.horizontalLabelColor || colors.gray
  const verticalLabelColor = colorAnimatedValues.verticalLabelColor || colors.gray

  const circleKeyframes = useMemo(() => ({
    radius: {
      0: 0,
      1: 2.4,
      3: 0
    }
  }), [])

  const circlesKeyframes = useMemo(() => ({
    radius: {
      14: 0,
      15: 1.6,
      16: 0
    }
  }), [])

  const diamondKeyframes = useMemo(() => ({
    radius: {
      4: 0,
      5: 2.4,
      7: 0
    }
  }), [])

  const squareKeyframes = useMemo(() => ({
    radius: {
      7: 0,
      8: 2.4,
      10: 0
    }
  }), [])

  return (
    <>
      <BaseScene
        config={SceneConfig}
        sceneKey={sceneKey}
        stepIndex={stepIndex}
        isPanelOpen={isPanelOpen}
        windowSize={windowSize}
      >
        <Circle
          center={[0,-0.8]}
          keyframes={circleKeyframes}
          stepIndex={stepIndex}
          labelContext={() => `$x$`}
          labelAttach="ne"
          labelAttachDistance={25}
          labelAtCenter={true}
        />

        <Diamond
          center={[0,-0.8]}
          keyframes={diamondKeyframes}
          stepIndex={stepIndex}
          labelContext={(center,radius) => `$B_3(x)$`}
          labelAttach="nw"
          labelAttachDistance={40}
          showCenterPoint={false}
        />
        <Diamond
          center={[0,-0.8]}
          keyframes={squareKeyframes}
          stepIndex={stepIndex}
          labelContext={(center,radius) => `$B_3(x)$`}
          labelAttach="nw"
          labelAttachDistance={40}
          showCenterPoint={false}
          isSquare={true}
        />

        <TaxicabDistance
          point1Center={[0, -0.8]}
          point2Center={[1.2, -0.4]}
          pointColor={colors.red}
          lineColor={colors.gray}
          showPointLabels={true}
          hidePoint1={true}
          point2Label="$y$"
          point2LabelAttach="nw"
          stepIndex={stepIndex}
          distanceScaleFactor={0.8}
          opacity={taxicabOpacity}
          distanceLabelAttachDistance ={-30}
          horizontalLabelColor={horizontalLabelColor}
          verticalLabelColor={verticalLabelColor}
          onDistancesChange={setTaxicabDistances}
        />

        <Point
          center={[0, -0.8]}
          color={colors.blue}
          startFrame={5}
          endFrame={6}
          stepIndex={stepIndex}
          labelContext={() => '$x$'}
          labelAttach="ne"
        />

        <InequalityPlot
          y={1000000}
          above={false}
          color={colors.blue}
          startFrame={10}
          endFrame={10}
          stepIndex={stepIndex}
        />

        <Point
          center={[0, -0.8]}
          color={colors.blue}
          startFrame={8}
          endFrame={11}
          stepIndex={stepIndex}
          labelContext={() => '$x$'}
          labelAttach="ne"
        />

        <Circle
          center={[-2.4,-0.8]}
          keyframes={circlesKeyframes}
          stepIndex={stepIndex}
          labelContext={() => `$B_2(x_1)$`}
          labelAttach="sw"
          labelAttachDistance={40}
        />
        <Circle
          center={[2.4,-0.8]}
          keyframes={circlesKeyframes}
          stepIndex={stepIndex}
          color={colors.purple}
          strokeStyle='dashed'
          labelContext={() => `$N_2(x_2)$`}
          labelAttach="se"
          labelAttachDistance={40}
        />
      </BaseScene>

      <DisplayOverlay
        line1={taxicabFormula}
        line2=""
        startFrame={6}
        endFrame={6}
        stepIndex={stepIndex}
        isPanelOpen={isPanelOpen}
      />

      <DisplayOverlay
        line1={chebyshevFormula}
        line2=""
        startFrame={9}
        endFrame={9}
        stepIndex={stepIndex}
        isPanelOpen={isPanelOpen}
      />
    </>
  )
}

export default Balls 