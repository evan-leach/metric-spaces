import React, { useState, useMemo } from 'react'
import BaseScene from '../../components/BaseScene'
import TaxicabDistance from '../../components/intro/TaxicabDistance'
import DisplayOverlay from '../../components/text/DisplayOverlay'
import { useKeyframeAnimation } from '../../hooks/useKeyframeAnimation'
import { colors } from '../../config/colors'
import { ANIMATION_SPEED } from '../../constants/animations'

export const SceneConfig = {
  steps: [
    "So far, we know about three metric spaces: the number line, the coordinate plane, and the $3$-dimensional world\
    we live in. These three spaces all use the same measure of distance: the length of a straight line between two points.\
    $$$$ This is called the *Euclidean metric.*",
    "For our first few examples of more exotic metric spaces, we will still use the coordinate plane. We'll switch\
    things up by trying out some different metrics. $$$$\
    Our first example is the *taxicab metric,* which measures the distance between two points by the sum of their\
    horizontal and vertical distances.",
    "TOP: You can think of this metric as distance measured by a taxicab that can only drive along the roads of a city grid.",
    "TOP: Try to convince yourself that each of the three metric space axioms are satisfied. The distance between a point\
    and itself must be zero, the distance between two distinct points must be greater than zero, distance must be\
    symmetric, and the triangle inequality must hold.",
    "Suppose you were standing at an intersection in a city, and someone claimed that another location $2$ blocks east\
    and $2$ blocks north was $4$ blocks away. $$$$ If you were a bird, you might object since\
    you could travel to the other location in less than $4$ blocks by flying in a straight line.\
    $$$$ To a taxicab driver who can't just drive through buildings, though, a distance of $4$ blocks really is more relevant.",
    "In other words, even if the taxicab metric isn't the notion of distance we're used to, it's still _a_ notion of\
    distance. The coordinate plane equipped with the taxicab metric is our first new metric space!\
    $$$$ What if we tried something other than adding the horizontal and vertical distances? We could, perhaps, take the _minimum_\
    of these two values.",
    "TOP: This function is _not_ a reasonable notion of distance. Take a moment to try and figure out\
    what's wrong with it. Which of the metric space axioms does it fail to satisfy?",
    "TOP: Positive definiteness is not satisfied because the distance between two distinct points can be zero. This can happen,\
    for instance, when two points lie on the same horizontal line.",
    "It turns out that the triangle inequality is also not satisfied, but this doesn't matter for the purposes of determining\
    whether this function is a metric. $$$$ A metric must satisfy _all_ of the axioms, so as soon as we realize that a function\
    doesn't satisfy _one_ of them, we can dismiss it as an \"unreasonable\" notion of distance.",
    "TOP: If we take the _maximum_ of the horizontal and vertical distances, we _do_ get a metric. This is called the\
    *Chebyshev metric.* $$$$ Just as the taxicab metric is appropriate for a taxi driver, this metric is appropriate for the\
    king in chess, since it can move vertically and horizontally at the same time.",
    "Here is one more example of a metric on the coordinate plane: the *discrete metric.* $$$$ This metric\
    assigns the distance $0$ between any point and itself, and it assigns the distance $1$ between any two distinct\
    points. You can think of this as a \"yes or no\" distance that just tells you _whether or not_ you need to travel\
    to get from one point to another. $$$$ The discrete metric satisfies the metric space axioms, and you should take a moment to\
    convince yourself of this.",
    "We can also define metrics on sets that don't involve any numbers at all. Earlier, we gave two examples of such sets:\
    the set of all English words, and the set of all living humans. $$$$ Can you think of any ways to define the distance\
    between two words? Between two humans?",
    "Here is one approach for English words: we can define the distance between two words to be the number of places where\
    the two words have different letters (we also consider blank spaces at the end of the shorter word to count as\
    letters). Here are a few examples: $$d(\\text{bit}, \\text{cat}) = 2$$ $$d(\\text{cart}, \\text{car}) = 1$$\
    $$d(\\text{a}, \\text{metric}) = 6$$\
    This function satisfies the metric space axioms, so it turns the set of all English words into a metric space!",
    "We can turn the set of all living humans into a metric space by defining the distance between a person and their\
    friend to be $1$, the distance between a person and a friend of their friend to be $2$, and so on. $$$$ This goes\
    to show that metrics can represent more than just physical distance; they can represent abstract notions of\
    distance too.",
    "As you can see, a lot of problems can be analyzed using metric spaces. This is a big reason why they are so useful to\
    mathematicians: whenever you prove a fact about metric spaces, you can apply your result in a huge variety of contexts.\
    $$$$ Mathematicians use the term _\"general\"_ to describe definitions that apply broadly. The generality of metric spaces means that whenever\
    we can prove a fact using distances, we only need to do so once for an arbitrary metric space. Then whenever we come\
    across a new metric space, we can just apply this general fact.",
    "Generality comes at a cost, though. Since our arguments need to work in any metric space, this means we can't use\
    most concepts from geometry like straight lines and angles. Everything we do will rely only on our distance function.\
    $$$$ Though this restriction may seem daunting at first, we can actually go quite far using nothing but distances.\
    We will define some familar ideas using metrics and discover entirely new concepts as well.",
    "The next lesson will contain our first such example."
  ]
}

function Examples({ 
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
  const minDist = Math.min(horizontalDistNum, verticalDistNum).toFixed(2)
  const maxDist = Math.max(horizontalDistNum, verticalDistNum).toFixed(2)
  const taxicabFormula = `d(x,y) = ${horizontalDist} + ${verticalDist} = ${totalDist}`
  const minFormula = `d(x,y) = \\min(${horizontalDist}, ${verticalDist}) = ${minDist}`
  const chebyshevFormula = `d(x,y) = \\max(${horizontalDist}, ${verticalDist}) = ${maxDist}`

  const taxicabKeyframes = useMemo(() => ({
    opacity: {
      2: 0,
      3: 1,
      5: 0,
      7: 1,
      9: 0,
      10: 1,
      11: 0
    }
  }), [])
  
  const taxicabAnimatedValues = useKeyframeAnimation(taxicabKeyframes, stepIndex)
  const taxicabOpacity = taxicabAnimatedValues.opacity ?? 0

  // Create dynamic color keyframes based on which distance is longer and current step
  const colorKeyframes = useMemo(() => {
    const isHorizontalLonger = taxicabDistances.horizontal > taxicabDistances.vertical
    
    let horizontalColor = colors.gray
    let verticalColor = colors.gray
    
    if (stepIndex === 7 || stepIndex === 8) {
      horizontalColor = isHorizontalLonger ? colors.gray : colors.black
      verticalColor = isHorizontalLonger ? colors.black : colors.gray
    } else if (stepIndex === 10) {
      horizontalColor = isHorizontalLonger ? colors.black : colors.gray
      verticalColor = isHorizontalLonger ? colors.gray : colors.black
    }
    // All other steps: both gray (default values already set)
    
    return {
      horizontalLabelColor: { 0: horizontalColor },
      verticalLabelColor: { 0: verticalColor }
    }
  }, [taxicabDistances.horizontal, taxicabDistances.vertical, stepIndex])

  const colorAnimatedValues = useKeyframeAnimation(colorKeyframes, 0, { speed: ANIMATION_SPEED * 5 })
  const horizontalLabelColor = colorAnimatedValues.horizontalLabelColor || colors.gray
  const verticalLabelColor = colorAnimatedValues.verticalLabelColor || colors.gray

  return (
    <>
      <BaseScene
        config={SceneConfig}
        sceneKey={sceneKey}
        stepIndex={stepIndex}
        isPanelOpen={isPanelOpen}
        windowSize={windowSize}
      >
        <TaxicabDistance
          point1Center={[-2, 0]}
          point2Center={[2, -1]}
          pointColor={colors.red}
          lineColor={colors.gray}
          showPointLabels={true}
          point1Label="$x$"
          point2Label="$y$"
          point1LabelAttach="sw"
          point2LabelAttach="se"
          stepIndex={stepIndex}
          distanceScaleFactor={0.8}
          opacity={taxicabOpacity}
          horizontalLabelColor={horizontalLabelColor}
          verticalLabelColor={verticalLabelColor}
          onDistancesChange={setTaxicabDistances}
        />
      </BaseScene>
      
      <DisplayOverlay
        line1={taxicabFormula}
        line2=""
        startFrame={3}
        endFrame={4}
        stepIndex={stepIndex}
        isPanelOpen={isPanelOpen}
      />

      <DisplayOverlay
        line1={minFormula}
        line2=""
        startFrame={7}
        endFrame={8}
        stepIndex={stepIndex}
        isPanelOpen={isPanelOpen}
      />

      <DisplayOverlay
        line1={chebyshevFormula}
        line2=""
        startFrame={10}
        endFrame={10}
        stepIndex={stepIndex}
        isPanelOpen={isPanelOpen}
      />
    </>
  )
}

export default Examples 