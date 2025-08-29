import React, { useState } from 'react'
import BaseScene from '../../components/BaseScene'
import Distance from '../../components/intro/Distance'
import TriangleInequality from '../../components/intro/TriangleInequality'
import DisplayOverlay from '../../components/text/DisplayOverlay'
import { colors } from '../../config/colors'

export const SceneConfig = {
  steps: [
    "Now that we've defined the \"space\" part of a metric space, we need to define the notion of \"distance.\"\
    In other words, we need a way to determine the distance between any two points in our space.",
    "The way we do this is with a _function._ This function needs to take two points as input and output a\
    real number. This number will be the distance between the two points, and we will use the notation $d(x,y)$\
    to represent the distance between the points $x$ and $y$, as computed by our function.",
    "We can't just use any function here, since it needs to be a _reasonable_ notion of distance. But what does\
    \"reasonable\" mean? $$$$ To answer this precisely, we need to list some conditions that this function must satisfy.\
    We don't want to be overly restrictive, so every condition must be absolutely necessary for any\
    reasonable distance function. But we also need to have enough conditions to exclude any unreasonable functions.\
    $$$$ Striking this balance is difficult and subjective, but we will do our best.",
    "The first condition is called *positive definiteness:* $$$$ The distance between any point and itself must be $0$,\
    and the distance between any two distinct points must be strictly positive (i.e. larger than $0$).",
    "TOP: In other words, we require for any points $x$ and $y$ in our space that $d(x,y) \\geq 0$. We also require that\
    $d(x,y) = 0$ _if and only if_ $x = y$. $$$$ You can experiment with this condition by dragging the two points around.",
    "The second condition is called *symmetry:* $$$$ The distance between $x$ and $y$ must be the same as the distance\
    between $y$ and $x$. $$$$ In other words, $d(x,y) = d(y,x)$ for any points $x$ and $y$ in our space.",
    "The first two conditions both seem like obvious requirements, but this third one doesn't feel quite so\
    necessary at first. It's called the *triangle inequality:* $$$$ For any points $x$, $y$, and $z$ in our space,\
    the inequality $$d(x,z) \\leq d(x,y) + d(y,z)$$ must be satisfied. $$$$ We will explain this more on the next slide.",
    "Here is an example to understand what's going on: Suppose you walk $1$ mile from your house to the library and then\
    walk $1$ mile from the library to the park. How far can your house be from the park?\
    $$$$ We don't have enough information to give a precise answer, but we know that it can't be any more than\
    $2$ miles. After all, you just got from your house to the park by walking $2$ miles!",
    "There isn't anything stopping the park from being _closer_ than $2$ miles, though. You could live right\
    next to the park, with the library a mile away from both your house and the park. This is why we need\
    an _inequality._ $$$$ Simply put, the triangle inequality says that \"the distance from $x$ to $z$ is no more\
    than the distance from $x$ to $y$ to $z$.\"",
    "TOP: You can visualize the triangle inequality by dragging these three points around. Imagine that $x$ is your\
    house, $y$ is the library, and $z$ is the park.",
    "TOP: You should also try and figure out when $d(x,z)$ is exactly equal to $d(x,y) + d(y,z)$.",
    "These three conditions are it! When we say that a function gives us a \"reasonable notion of distance,\" what we really\
    mean is that the function is positive definite, is symmetric, and satisfies the triangle inequality. $$$$ We call these three\
    properties the *axioms* of a metric space, and we call any function satisfying all three axioms a *metric.*",
    "We now have the complete definition of a metric space: a set equipped with a metric. $$$$ The set tells us what the points\
    in our space are, and the metric tells us how to measure the distance between any two points.",
    "In the next section, we will explore some examples of metric spaces. Just how far can we go while still obeying the axioms?"
  ]
}

function Metrics({ 
  windowSize, 
  stepIndex, 
  isPanelOpen,
  sceneKey 
}) {
  // State to track triangle inequality distances
  const [triangleDistances, setTriangleDistances] = useState({
    xy: 0,
    yz: 0,
    xz: 0
  })

  // Format distances for display
  const formatDistance = (distance) => (distance / 0.8).toFixed(2)
  
  // Create the inequality formula lines
  const inequalityFormula = `d(x,z) \\leq d(x,y) + d(y,z)`
  const inequalityWithValues = `${formatDistance(triangleDistances.xz)} \\leq ${formatDistance(triangleDistances.xy)} + ${formatDistance(triangleDistances.yz)}`
  return (
    <>
      <BaseScene
        config={SceneConfig}
        sceneKey={sceneKey}
        stepIndex={stepIndex}
        isPanelOpen={isPanelOpen}
        windowSize={windowSize}
      >
        <Distance
          point1Center={[-2, 0]}
          point2Center={[2, -1]}
          pointColor={colors.red}
          lineColor={colors.gray}
          showLabel={true}
          labelAttach="n"
          startFrame={5}
          endFrame={5}
          stepIndex={stepIndex}
          distanceScaleFactor={0.8}
          point1Label="$x$"
          point2Label="$y$"
          showPointLabels={true}
          point1LabelAttach="sw"
          point2LabelAttach="se"
          distanceLabelFormat={(distance) => `$d(x,y) = ${distance.toFixed(2)}$`}
        />
        
        <TriangleInequality
          pointX={[-3, -1]}
          pointY={[-0.5, 1.5]}
          pointZ={[2, -1.5]}
          showDistanceLabels={true}
          showInequality={true}
          inequalityPosition={[0, -3]}
          highlightSide="xz"
          startFrame={10}
          endFrame={11}
          stepIndex={stepIndex}
          distanceScaleFactor={0.8}
          onDistancesChange={setTriangleDistances}
        />
      </BaseScene>
      
      <DisplayOverlay
        line1={inequalityFormula}
        line2={inequalityWithValues}
        startFrame={10}
        endFrame={11}
        stepIndex={stepIndex}
        isPanelOpen={isPanelOpen}
      />
    </>
  )
}

export default Metrics 