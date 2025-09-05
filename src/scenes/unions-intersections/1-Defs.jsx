import { useMemo, useState, useRef, useEffect } from 'react'
import BaseScene from '../../components/BaseScene'
import { colors } from '../../config/colors'
import Union from '../../components/objects/Union'
import Intersection from '../../components/objects/Intersection'
import Circle from '../../components/objects/Circle'
import Blob from '../../components/objects/Blob'
import Point from '../../components/objects/Point'
import { useKeyframeAnimation } from '../../hooks/useKeyframeAnimation'

export const SceneConfig = {
  zoom: { min: 0.6, max: 1000 },
  steps: [
    "In the last section, we thoroughly explored properties of a single set in a metric space. In this section, we'll increase\
    the complexity by adding more sets and seeing how they interact with each other.",
    "TOP: Take a look at these sets $A$ and $B$: how they _combine_ and how they _overlap._ We will begin by introducing two new\
    definitions that capture these ideas.",
    "TOP: The *union* of two sets $A$ and $B$ is the set of all points that are elements of either $A$ _or_ $B$ (or both). $$$$\
    We denote the union as $A \\cup B$ (think of this symbol as a \"U\" for \"union\").",
    "TOP: The *intersection* of two sets $A$ and $B$ is the set of all points that are elements of _both_ $A$ and $B$. $$$$\
    We denote the intersection as $A \\cap B$.",
    "Unions and intersections are relatively straightforward when we only consider two sets, but we can go much further. $$$$\
    If we want to consider more than two sets, it gets difficult to use a unique letter for each one. For this reason, we often\
    number our sets like $A_1$, $A_2$, $A_3$, and so on.",
    "TOP: Here is an example. Try dragging around these sets $A_1$, $A_2$, and $A_3$.",
    "TOP: We denote the union of these sets as $A_1 \\cup A_2 \\cup A_3$. It is the set of all points that lie in _any_ of these\
    three sets.",
    "TOP: The intersection $A_1 \\cap A_2 \\cap A_3$ is the set of all points that lie in all three sets _simultaneously._\
    $$$$ Try dragging around these sets to get an empty intersection, and then try to get a non-empty intersection.",
    "We can even consider the union or intersection of infinitely many sets! We will\
    use the notation $$A_1 \\cup A_2 \\cup A_3 \\cup A_4 \\cup \\cdots$$ and $$A_1 \\cap A_2 \\cap A_3 \\cap A_4 \\cap \\cdots$$\
    to represent these infinite unions and intersections.",
    "TOP: Here is an infinite collection of sets, consisting of the balls $B_1(x)$, $B_2(x)$, $B_3(x)$, and so on.\
    The union $$B_1(x) \\cup B_2(x) \\cup B_3(x) \\cup \\cdots$$ is equal to the entire plane, since every point in the plane\
    lies in at least one of these sets.",
    "TOP: The intersection $$B_1(x) \\cap B_2(x) \\cap B_3(x) \\cap \\cdots$$ is equal to $B_1(x)$, since a point lies in _all_\
    of these sets if and only if it lies in $B_1(x)$.",
    "For the rest of this section, we will figure out how unions and intersections relate to open and closed sets. Specifically,\
    we will answer four questions: $$$$ Is a union of open sets also open? $$$$ Is an intersection of open sets also open? $$$$ \
    $$$$ Is a union of closed sets also closed? $$$$ Is an intersection of closed sets also closed?",
    "For two of the questions, the answer is yes. For the other two questions, though, the answer depends on whether the union or\
    intersection is _finite_ or _infinite._ $$$$ How does infinity change the answer to two of these questions? And why does it\
    only matter for these two questions in particular?"
  ]
}

function Scene({ windowSize, stepIndex, isPanelOpen, sceneKey }) {
  // Refs for movable points
  const blob1PointRef = useRef()
  const blob2PointRef = useRef()
  const blob3PointRef = useRef()

  // State for blob positions
  const [blob1Position, setBlob1Position] = useState([-1.5, 0.5])
  const [blob2Position, setBlob2Position] = useState([1.5, 0.5])
  const [blob3Position, setBlob3Position] = useState([-0.5, -2.5])

  // Update blob positions from point refs
  useEffect(() => {
    const updatePositions = () => {
      if (blob1PointRef.current) {
        setBlob1Position(blob1PointRef.current.point)
      }
      if (blob2PointRef.current) {
        setBlob2Position(blob2PointRef.current.point)
      }
      if (blob3PointRef.current) {
        setBlob3Position(blob3PointRef.current.point)
      }
    }

    // Update on animation frame for smooth movement
    const intervalId = setInterval(updatePositions, 16) // ~60fps
    return () => clearInterval(intervalId)
  }, [])

  const circlesKeyframes = useMemo(() => ({
    radius: {
      0: 3,
      5: 0
    }
  }), [])

  const colorKeyframes = useMemo(() => ({
    color: {
      10: colors.blue,
      11: colors.red
    },
    fillOpacity: {
      10: 0.1,
      11: 0.25
    }
  }), [])

  const redCircleKeyframes = useMemo(() => ({
    radius: {
      0: 0,
      10: 0.8,
      12: 0
    }
  }), [])

  // Get the current animated radius value for the circles
  const animatedProps = useKeyframeAnimation(circlesKeyframes, stepIndex)
  const currentRadius = animatedProps.radius ?? 3

  const colorProps = useKeyframeAnimation(colorKeyframes, stepIndex)
  const currentColor = colorProps.color ?? colors.blue
  const currentFillOpacity = colorProps.fillOpacity ?? 0.2

  return (
    <BaseScene
      config={SceneConfig}
      sceneKey={sceneKey}
      stepIndex={stepIndex}
      isPanelOpen={isPanelOpen}
      windowSize={windowSize}
    >
      <Circle
        center={[-2,-0.5]}
        keyframes={circlesKeyframes}
        stepIndex={stepIndex}
        labelContext={() => `$A$`}
        labelAttach="sw"
        labelAttachDistance={40}
        showCenterPoint={false}
      />
      
      <Circle
        center={[2,-0.5]}
        keyframes={circlesKeyframes}
        stepIndex={stepIndex}
        labelContext={() => `$B$`}
        labelAttach="se"
        labelAttachDistance={40}
        showCenterPoint={false}
      />
      
      <Union
        shapes={[
          { type: 'circle', center: [-2, -0.5], radius: currentRadius },
          { type: 'circle', center: [2, -0.5], radius: currentRadius }
        ]}
        color={colors.green}
        startFrame={3}
        endFrame={3}
        stepIndex={stepIndex}
      />
      
      <Intersection
        shapes={[
          { type: 'circle', center: [-2, -0.5], radius: currentRadius },
          { type: 'circle', center: [2, -0.5], radius: currentRadius }
        ]}
        color={colors.red}
        startFrame={4}
        endFrame={4}
        stepIndex={stepIndex}
      />

      <Blob
        size={2.0}
        center={blob1Position}
        harmonicsConfig={{ scale: 0.2, seed: 59 }}
        color={colors.blue}
        style="solid"
        labelContext={() => "$A_1$"}
        labelAttach="w"
        startFrame={6}
        endFrame={8}
        stepIndex={stepIndex}
        fillOpacity={0.2}
        strokeOpacity={0.3}
      />
      <Blob
        size={2.0}
        center={blob2Position}
        harmonicsConfig={{ scale: 0.2, seed: 58 }}
        color={colors.blue}
        style="solid"
        labelContext={() => "$A_2$"}
        labelAttach="e"
        startFrame={6}
        endFrame={8}
        stepIndex={stepIndex}
        fillOpacity={0.2}
        strokeOpacity={0.3}
      />
      <Blob
        size={2.0}
        center={blob3Position}
        harmonicsConfig={{ scale: 0.2, seed: 55 }}
        color={colors.blue}
        style="solid"
        labelContext={() => "$A_3$"}
        labelAttach="s"
        startFrame={6}
        endFrame={8}
        stepIndex={stepIndex}
        fillOpacity={0.2}
        strokeOpacity={0.3}
      />

      <Union
        shapes={[
          { type: 'blob', center: blob1Position, size: 2.0, harmonicsConfig: { scale: 0.2, seed: 59 } },
          { type: 'blob', center: blob2Position, size: 2.0, harmonicsConfig: { scale: 0.2, seed: 58 } },
          { type: 'blob', center: blob3Position, size: 2.0, harmonicsConfig: { scale: 0.2, seed: 55 } }
        ]}
        color={colors.green}
        fillOpacity={0.4}
        strokeOpacity={0.8}
        startFrame={7}
        endFrame={7}
        stepIndex={stepIndex}
      />

      <Intersection
        shapes={[
          { type: 'blob', center: blob1Position, size: 2.0, harmonicsConfig: { scale: 0.2, seed: 59 } },
          { type: 'blob', center: blob2Position, size: 2.0, harmonicsConfig: { scale: 0.2, seed: 58 } },
          { type: 'blob', center: blob3Position, size: 2.0, harmonicsConfig: { scale: 0.2, seed: 55 } }
        ]}
        color={colors.red}
        fillOpacity={0.4}
        strokeOpacity={0.8}
        startFrame={8}
        endFrame={8}
        stepIndex={stepIndex}
      />

      {/* Movable points to control blob positions */}
      <Point
        ref={blob1PointRef}
        center={[-1.5, 0.5]}
        movable={true}
        color={colors.blue}
        startFrame={6}
        endFrame={8}
        stepIndex={stepIndex}
      />
      <Point
        ref={blob2PointRef}
        center={[1.5, 0.5]}
        movable={true}
        color={colors.blue}
        startFrame={6}
        endFrame={8}
        stepIndex={stepIndex}
      />
      <Point
        ref={blob3PointRef}
        center={[-0.5, -2.5]}
        movable={true}
        color={colors.blue}
        startFrame={6}
        endFrame={8}
        stepIndex={stepIndex}
      />

      {/* Render circles 2-200 in reverse order (300 in back, 2 in front) */}
      {Array.from({ length: 199 }, (_, i) => {
        const n = 200 - i; // Start from 200, go down to 2
        const fillOpacity = Math.pow(0.03, (n + 150) / 150);
        const strokeOpacity = 20 * fillOpacity;
        
        return (
          <Circle
            key={n}
            center={[0, -1.5]}
            keyframes={redCircleKeyframes}
            stepIndex={stepIndex}
            color={colors.blue}
            fillOpacity={fillOpacity}
            strokeOpacity={strokeOpacity}
            radiusScale={n}
            showCenterPoint={false}
          />
        );
      })}

      <Circle
        center={[0, -1.5]}
        keyframes={redCircleKeyframes}
        stepIndex={stepIndex}
        color={currentColor}
        fillOpacity={currentFillOpacity}
        strokeOpacity={0.5 + 2 * currentFillOpacity}
        labelContext={() => "$x"}
        labelAtCenter={true}
        labelAttachDistance={20}
        labelAttach="s"
      />
    </BaseScene>
  )
}

export default Scene

