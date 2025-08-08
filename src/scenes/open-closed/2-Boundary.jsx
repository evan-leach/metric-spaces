import React, { useMemo } from 'react'
import BaseScene from '../../components/BaseScene'
import Blob from '../../components/objects/Blob'
import Point from '../../components/objects/Point'
import Circle from '../../components/objects/Circle'
import { colors } from '../../config/colors'

export const SceneConfig = {
  zoom: { min: 0.2, max: 5000 },
  steps: [
    "TOP: In the last lesson, we saw two things that can happen when you take a shrinking neighborhood $N_r(x)$ of a point $x$.\
    Depending on where $x$ is, the shrinking neighborhood $N_r(x)$ might end up being a subset of $A$, or of $A^c$.",
    "TOP: This isn't always what happens, though. For example, take a look at this point $x$.",
    "TOP: As we shrink the neighborhood further and further, be sure to zoom in and keep track of the action.",
    "TOP: Keep zooming in so that you can see the neighborhood clearly. If this point was shifted just _barely_ to the left, eventually\
    $N_r(x)$ would lie completely within $A$. But that's not happening here. No matter how much we shrink...",
    "TOP: ...the neighborhood _always_ contains both points in $A$ and points in $A^c$.",
    "This is what it means for a point to be \"touching\" both $A$ and $A^c$. We can use this insight to make the\
    following definition: $$$$ A point $x$ is a *boundary point* of $A$ if for _any_ choice of $r > 0$, the neighborhood\
    $N_r(x)$ contains both points in $A$ and in $A^c$. $$$$ The *boundary* of $A$ is the set of all boundary points of $A$.",
    "TOP: Now zoom back out, and we'll take a look at some more boundary points of $A$. $$$$ Make sure you can see the three points of\
    $A$ that lie to the left of the main blobs.",
    "TOP: This is a boundary point of $A$. Any neighborhood of $y$ will contain $y$ itself, and since $y$ is an element of $A$, this means\
    that $N_r(y)$ contains at least one point of $A$. It also always contains some points in $A^c$.",
    "TOP: This point $z$ is a boundary point of $A$, even though it is not an _element_ of $A$ (remember that dashed lines are not part\
    of the set they mark the boundary of).",
    "One important thing to note is that for any set $A$, _every_ point $x$ in our metric space is either an interior, exterior, or\
    boundary point of $A$. This is because, when you take a shrinking neighborhood $N_r(x)$ of $x$, exactly one of these three things will happen:\
    $$$$ 1. $N_r(x)$ will eventually only contain points in $A$. $$$$ 2. $N_r(x)$ will eventually only contain points in $A^c$. $$$$\
    3. $N_r(x)$ will always contain points both in $A$ and in $A^c$.",
    "These three cases correspond precisely to the definitions of interior, exterior, and boundary points! $$$$ This similarly means that\
    every subset $A$ of a metric space _partitions_ the space into three parts: the interior, exterior, and boundary of $A$.",
    "Remember that interior, exterior, and boundary points are defined in terms of neighborhoods, which are in turn defined using our metric.\
    Just as promised, _everything_ is built up using only distance. $$$$ If you want a challenge, try to figure out why the interior, exterior,\
    and boundary of our set $A$ don't change when using the taxicab metric. And why _do_ they change when we use the discrete metric?",
    "In the next two lessons, we will use these concepts to finally define the special kinds of sets this section is named after: _open_ sets\
    and _closed_ sets."
  ]
}

function Boundary({ 
  windowSize, 
  stepIndex, 
  isPanelOpen,
  sceneKey 
}) {
  // Define keyframes for circle neighborhood animation (interior point)
  const point1Keyframes = useMemo(() => ({
    radius: {
      1: 0,
      2: 2,
      3: 0.3,
      4: 0.08,
      5: 0.02,
      6: 0
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
      <Blob
        size={2.0}
        harmonicsConfig={{ scale: 0.2, seed: 5 }}
        color={colors.blue}
        style="solid"
        labelContext={() => "$A$"}
        labelAttach="s"
      />
      <Blob
        center={[-6.5, 2]}
        size={1.0}
        harmonicsConfig={{ scale: 0.1, seed: 1 }}
        color={colors.blue}
        style="solid"
      />
      <Blob
        center={[-4, 1]}
        size={0.5}
        harmonicsConfig={{ scale: 0.3, seed: 4 }}
        color={colors.blue}
        style="dashed"
      />
      <Blob
        center={[9, -9]}
        size={10.0}
        harmonicsConfig={{ scale: 0.5, seed: 6 }}
        color={colors.blue}
        style="solid"
      />
      <Blob
        center={[4, 1]}
        size={0.3}
        harmonicsConfig={{ scale: 0.1, seed: 1 }}
        color={colors.blue}
        style="dashed"
      />

      <Point
        center={[-5, -3]}
        color={colors.blue}
      />
      <Point
        center={[-5.2, -2]}
        color={colors.blue}
      />
      <Point
        center={[-5.1, -3.3]}
        color={colors.blue}
      />
      
      <Circle
        center={[1.98373415, 0.2]}
        keyframes={point1Keyframes}
        stepIndex={stepIndex}
        color={colors.orange}
        strokeStyle="dashed"
        labelContext={(center, radius) => `$N_{${(Math.max(radius / 0.8, 0.01)).toFixed(2)}}(x)$`}
        labelAttach="e"
        labelAttachDistance={55}
        animationThresholdMultiplier={0.1}
      />

      <Point
        center={[-5, -3]}
        color={colors.orange}
        startFrame={8}
        endFrame={8}
        labelContext={() => "$y$"}
        stepIndex={stepIndex}
        labelAttach='e'
      />

      <Point
        center={[-3.8, 0.599802]}
        color={colors.orange}
        startFrame={9}
        endFrame={9}
        labelContext={() => "$z$"}
        stepIndex={stepIndex}
        labelAttach='s'
      />
    </BaseScene>
  )
}

export default Boundary 