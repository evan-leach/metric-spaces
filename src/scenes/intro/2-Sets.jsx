import BaseScene from '../../components/BaseScene'
import Blob from '../../components/objects/Blob'
import Point from '../../components/objects/Point'
import PointSequence from '../../components/objects/PointSequence'
import InequalityPlot from '../../components/objects/InequalityPlot'
import { useKeyframeAnimation } from '../../hooks/useKeyframeAnimation'
import { colors } from '../../config/colors'

export const SceneConfig = {
  zoom: { min: 0.2, max: 50000 },
  steps: [
    "TOP: Here we have a collection of points. We can look at each point individually, but we can\
    also refer to the entire collection at once.",
    "TOP: We call this collection a *set.* Sets are often denoted with capital letters, so we will call\
    this set of five points $R$. Whenever we write this letter, we are referring to the entire\
    collection of points. We call each of the points an *element* of $R$.",
    "TOP: A set can contain any number of points. For example, the set $G$ contains _infinitely many_ points!\
    $$$$ (Many of its points are overlapping, so be sure to zoom in and see more of them.)",
    "TOP: You might also notice that one of these points is an element of both $R$ and $G$. This is allowed;\
    a single point can be in multiple sets.",
    "TOP: This blue set $B$ contains _every_ element of $G$. When this is the case, we call $G$ a *subset* of $B$.\
    $$$$ Since $R$ contains some points that are not elements of $B$, this means that $R$ is _not_ a subset of $B$.",
    "TOP: Since $G$ is an infinite subset of $B$, this means that $B$ also contains infinitely many points.",
    "TOP: This is also a set. It doesn't contain any points, so we call it the *empty set.* $$$$ Remember that in order\
    to check whether a set $A$ is a subset of $B$, we need to make sure that every point in $A$ is also in $B$.\
    If $A$ is the empty set, then there aren't any points to check! This means that the empty set is a\
    subset of _every_ set.",
    "TOP: The _whole coordinate plane_ is a set. Every set we've looked at so far is a subset of the coordinate\
    plane.",
    "We can be a lot more creative with our sets. We can consider the set of all English words, where each\
    word is a point. $$$$ As another example, we can consider the set of all living humans.",
    "A set is the first half of the definition of a metric space. Choosing a set is how we say what the points in our\
    metric space are. For example, choosing the coordinate plane as a set tells us that our metric space consists of\
    2D points. $$$$ Whenever we consider sets in our metric space, we are really just talking about _subsets_ of\
    the metric space.",
    "TOP: So the coordinate plane that you're looking at is not just an empty space; it's the set of all 2D points.\
    When we were highlighting sets earlier, we were really talking about _subsets_ of this plane.",
    "TOP: You also shouldn't think of this draggable \"point\" as an actual point, since points don't move around.\
    Rather, think of it as a marker for which point you're looking at. As you drag it around, you're simply changing\
    which point is selected.",
    "Finally, we'll introduce one more concept: If $A$ is a subset of a metric space, then\
    the *complement* of $A$ is the set of all points in the metric space that are _not_ in $A$.",
    "TOP: For example, the complement of this set...",
    "TOP: ...is this one. $$$$ We will use the notation $A^c$ to denote the complement of $A$.",
    "Now we understand the first half of the definition of a metric space. The second half is the _metric,_ which we\
    will cover in the next section."
  ]
}

function Sets({ 
  windowSize, 
  stepIndex, 
  isPanelOpen,
  sceneKey 
}) {
  // Define spiral curve function - starts at origin (t=0) and spirals outward
  const spiralCurve = (t) => {
    const angle = t
    const radius = t * 2.5
    return [
      2 - radius * Math.cos(angle),
      radius * Math.sin(angle) - 1
    ]
  }

  const inequalityFunction = (x) => {
    return x * x * (-1) + 2
  }

  const colorKeyframes = {
    color: {
      2: colors.red,
      3: colors.redeen
    }
  }

  const animatedProps = useKeyframeAnimation(colorKeyframes, stepIndex)
  const specialPointColor = animatedProps.color || colors.red

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
        startFrame={8}
        endFrame={8}
        stepIndex={stepIndex}
      />

      <Blob
        size={2.5}
        center={[2, 0]}
        color={colors.blue}
        harmonicsConfig={{ scale: 0.2, seed: 12 }}
        startFrame={5}
        endFrame={6}
        stepIndex={stepIndex}
        labelContext={() => "$B$"}
        labelAttach="se"
      />
      
      <Point
        center={[2, 1]}
        color={colors.red}
        startFrame={1}
        endFrame={6}
        stepIndex={stepIndex}
      />
      <PointSequence
        curve={spiralCurve}
        cutoff={80}
        k={0.8}
        pointColor={colors.green}
        startFrame={3}
        endFrame={6}
        stepIndex={stepIndex}
        labelContext={() => "$G$"}
        labelAttach="ne"
        labelPointIndex={5}
      />
      
      <Point
        center={[-2, 0.7]}
        color={colors.red}
        startFrame={2}
        endFrame={6}
        stepIndex={stepIndex}
        labelContext={() => "$R$"}
        labelAttach="nw"
      />
      <Point
        center={[-2, 0.7]}
        color={colors.red}
        startFrame={1}
        endFrame={6}
        stepIndex={stepIndex}
      />
      <Point
        center={[0.6066, 0.4347]}
        color={specialPointColor}
        startFrame={1}
        endFrame={6}
        stepIndex={stepIndex}
      />
      <Point
        center={[-1, -1]}
        color={colors.red}
        startFrame={1}
        endFrame={6}
        stepIndex={stepIndex}
      />
      <Point
        center={[-1.5, -0.5]}
        color={colors.red}
        startFrame={1}
        endFrame={6}
        stepIndex={stepIndex}
      />
      
      <Point
        center={[0, 0]}
        color={colors.purple}
        startFrame={12}
        endFrame={12}
        stepIndex={stepIndex}
        movable={true}
      />
      
      <InequalityPlot
        y={inequalityFunction}
        above={false}
        color={colors.blue}
        style="solid"
        startFrame={14}
        endFrame={14}
        stepIndex={stepIndex}
      />
      
      <InequalityPlot
        y={inequalityFunction}
        above={true}
        color={colors.blue}
        style="dashed"
        startFrame={15}
        endFrame={15}
        stepIndex={stepIndex}
      />
    </BaseScene>
  )
}

export default Sets 