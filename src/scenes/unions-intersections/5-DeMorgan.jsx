import { useMemo } from 'react'
import BaseScene from '../../components/BaseScene'
import { colors } from '../../config/colors'
import Intersection from '../../components/objects/Intersection'
import Circle from '../../components/objects/Circle'
import Point from '../../components/objects/Point'
import Blob from '../../components/objects/Blob'
import InequalityPlot from '../../components/objects/InequalityPlot'
import Polygon from '../../components/objects/Polygon'
import { useKeyframeAnimation } from '../../hooks/useKeyframeAnimation'

export const SceneConfig = {
  steps: [
    "When we first explored the concept of closed sets, we proved the following two facts: $$$$\
    1. A set is open if and only if its complement is closed. $$$$ 2. A set is closed if and only if its complement is open.",
    "We can use this fact to answer our next two questions about unions and intersections of closed sets. Instead of\
    examining the closed sets directly, we'll look at their _complements._ $$$$ To do this, we'll need to see how\
    unions and intersections interact with complements.",
    "TOP: Suppose we have two sets $A$ and $B$. If a point $x$ lies in $A \\cup B$, this means that it lies in at least\
    one of these sets.",
    "TOP: What if a point does _not_ lie in $A \\cup B$? This means that it is not an element of _either_ set, so it is\
    an element of both $A^c$ and $B^c$.",
    "TOP: In other words, a point is _not_ in $A \\cup B$ _if and only if_ it is in $A^c \\cap B^c$. We can write this\
    general fact using the equation $$(A \\cup B)^c = A^c \\cap B^c \\text{.}$$",
    "TOP: This same argument works for _any_ collection of sets, even if the collection is infinite. Take a look at this\
    example and convince yourself that a point $x$ is _not_ in the union if and only if it is in _all_ of the complements.",
    "Now we've seen what happens for a union of sets. What about intersections?",
    "TOP: If a point $x$ does _not_ lie in $A \\cap B$, this means that it is not an element of at least one of these sets.",
    "TOP: In other words, $x$ lies in either $A^c$ or $B^c$, so it is an element of $A^c \\cup B^c$. We can again write\
    this general fact using the equation $$(A \\cap B)^c = A^c \\cup B^c \\text{.}$$",
    "TOP: We can do the same exact this for infinite collections. A point $x$ does not simultaneously lie in all of the sets\
    if and only if it lies in at least one of the complements.",
    "The equations $$\\left(A_1 \\cup A_2 \\cup A_3 \\cup \\cdots\\right)^c = A_1^c \\cap A_2^c \\cap A_3^c \\cap \\cdots$$ and\
    $$\\left(A_1 \\cap A_2 \\cap A_3 \\cap\\\cdots\\right)^c = A_1^c \\cup A_2^c \\cup A_3^c \\cup \\cdots$$ are called\
    *De Morgan's laws.*",
    "Now we have what we need to answer our two questions about closed sets. To begin, we'll consider a _finite union_ of\
    closed sets $A_1 \\cup A_2 \\cup \\cdots \\cup A_n$. Instead of trying to figure out whether this union is closed,\
    we'll look at its complement.",
    "TOP: By De Morgan's law, the complement of this union is equal to $$A_1^c \\cap A_2^c \\cap \\cdots \\cap A_n^c\
    \\text{.}$$",
    "TOP: Since the sets $A_1^c$, $A_2^c, \\dots, A_n^c$ are complements of closed sets, they are all open. $$$$ This means that\
    $A_1^c \\cap A_2^c \\cap \\cdots \\cap A_n^c$ is a finite intersection of open sets, which we proved is open!",
    "TOP: Since the complement of $A_1 \\cup A_2 \\cup \\cdots \\cup A_n$ is open, we know that $A_1 \\cup A_2 \\cup \
    \\cdots \\cup A_n$ is closed. $$$$ This proves the answer to our third question: _finite_ unions of closed sets are closed.",
    "TOP: Finally, let's consider a (possibly infinite) intersection $$A_1 \\cap A_2 \\cap A_3 \\cap \\dots$$ of closed sets.",
    "TOP: By De Morgan's law, the complement of this intersection is equal to $$A_1^c \\cup A_2^c \\cup A_3^c \\cup \\cdots\
    \\text{,}$$ which is a union of open sets. Because of our previous result about unions of open sets, we know that this set\
    is open!",
    "TOP: Since the complement of $A_1 \\cap A_2 \\cap A_3 \\cap \\cdots$ is open, this set is closed. $$$$ This answers our\
    fourth and final question: intersections of closed sets are closed.",
    "To summarize, closed sets stay closed when we take finite unions and intersections, just how open sets stay open when\
    we take unions and finite intersections.",
    "There's one last thing we haven't seen the analogue for yet: $$$$ We know that an infinite intersection of open sets\
    might not be open. Can we find a similar example for infinite unions of closed sets?",
    "We can actually do a whole lot better; examples of this phenomenon are _everywhere._ In fact, every single non-closed\
    set we've seen so far is an example! We'll find out why in the next lesson, which is the last in this section."
  ]
}

function DeMorgan({ windowSize, stepIndex, isPanelOpen, sceneKey }) {

  const neighborhoodKeyframes = useMemo(() => ({
    radius: {
      3: 0,
      4: 0.33,
      6: 0
    }
  }), [])

  const neighborhood2Keyframes = useMemo(() => ({
    radius: {
      5: 0,
      6: 0.37,
      9: 0
    }
  }), [])

  const neighborhoodsKeyframes = useMemo(() => ({
    radius: {
      6: 0,
      7: 0.33,
      9: 0
    }
  }), [])

  const smallKeyframes = useMemo(() => ({
    radius: {
      6: 0,
      7: 0.33,
      10: 0
    }
  }), [])

  const labelKeyframes = useMemo(() => ({
    fillOpacity: {
      6: 1,
      7: 0
    }
  }), [])

  const intersectionKeyframes = useMemo(() => ({
    fillOpacity: {
      2: 0,
      3: 1,
      4: 0,
      5: 1,
      6: 0,
      9: 1,
      10: 0
    }
  }), [])

  const intersectionProps = useKeyframeAnimation(intersectionKeyframes, stepIndex)
  const intersectionOpacity = intersectionProps.fillOpacity ?? 0.2
  const labelProps = useKeyframeAnimation(labelKeyframes, stepIndex)
  const labelOpacity = labelProps.fillOpacity ?? 0.2

  const dashedBlobs = useMemo(() => [
    
    { center: [-1, -0.1], size: 1.1, seed: 2001, scale: 0.12, attach: 'w' },
    { center: [-0.4, 0.4], size: 1.2, seed: 2002, scale: 0.22, attach: 'n' },
    { center: [0.2, -1.5], size: 1.3, seed: 2003, scale: 0.16, attach: 'sw' },
    { center: [1, -0.5], size: 1.9, seed: 2004, scale: 0.28, attach: 'se' }
    
  ], [])

  return (
    <BaseScene
      config={SceneConfig}
      sceneKey={sceneKey}
      stepIndex={stepIndex}
      isPanelOpen={isPanelOpen}
      windowSize={windowSize}
    >
      {dashedBlobs.map((blob, index) => (
        <Blob
          key={`dashed-blob-${index}`}
          center={blob.center}
          size={blob.size}
          harmonicsConfig={{ scale: blob.scale, seed: blob.seed }}
          color={colors.blue}
          style="dashed"
          fillOpacity={0.2}
          strokeOpacity={0.3}
          startFrame={0}
          endFrame={9}
          stepIndex={stepIndex}
          labelContext={() => `$A_${index + 1}$`}
          labelAttach={blob.attach}
        />
      ))}

      <Intersection
        shapes={dashedBlobs.map(blob => ({
          type: 'blob',
          center: blob.center,
          size: blob.size,
          harmonicsConfig: { scale: blob.scale, seed: blob.seed }
        }))}
        color={colors.orange}
        fillOpacity={0.15 * intersectionOpacity}
        strokeOpacity={0.6 * intersectionOpacity}
        stepIndex={stepIndex}
        style="dashed"
      />

      <Blob
        center={[-1, -0.1]}
        size={1.1}
        harmonicsConfig={{ seed: 2001, scale: 0.12 }}
        color={colors.purple}
        style="dashed"
        fillOpacity={0.3}
        strokeOpacity={0.6}
        startFrame={4}
        endFrame={4}
        stepIndex={stepIndex}
        labelContext={() => "$A_1$"}
        labelAttach="w"
      />

      <Blob
        center={[-0.4, 0.4]}
        size={1.2}
        harmonicsConfig={{ seed: 2002, scale: 0.22 }}
        color={colors.purple}
        style="dashed"
        fillOpacity={0.3}
        strokeOpacity={0.6}
        startFrame={6}
        endFrame={6}
        stepIndex={stepIndex}
        labelContext={() => "$A_2$"}
        labelAttach="w"
      />

      <Point
        center={[-0.3, -0.45]}
        color={colors.red}
        startFrame={3}
        endFrame={9}
        stepIndex={stepIndex}
        labelContext={() => "$x$"}
        labelAttach="sw"
      />

      <Circle
        center={[-0.3, -0.45]}
        keyframes={neighborhoodKeyframes}
        color={colors.red}
        strokeStyle="dashed"
        stepIndex={stepIndex}
        labelContext={() => `$N_{r_1}(x)$`}
        labelAttach="e"
        labelAttachDistance={45}
        labelOpacity={labelOpacity}
      />

      <Circle
        center={[-0.3, -0.45]}
        keyframes={neighborhood2Keyframes}
        color={colors.red}
        strokeStyle="dashed"
        stepIndex={stepIndex}
        labelContext={() => `$N_{r_2}(x)$`}
        labelAttach="n"
        labelAttachDistance={30}
        labelOpacity={labelOpacity}
      />

      <Circle
        center={[-0.3, -0.45]}
        keyframes={neighborhoodsKeyframes}
        color={colors.red}
        strokeStyle="dashed"
        stepIndex={stepIndex}
      />
      <Circle
        center={[-0.3, -0.45]}
        keyframes={smallKeyframes}
        radiusScale={0.55}
        color={colors.red}
        strokeStyle="dashed"
        stepIndex={stepIndex}
      />
      <Circle
        center={[-0.3, -0.45]}
        keyframes={neighborhoodsKeyframes}
        radiusScale={1.35}
        color={colors.red}
        strokeStyle="dashed"
        stepIndex={stepIndex}
      />

      <InequalityPlot
        yInequality={{ 
          ">=": (x) => -0.8,
          "<=": (x) => 0.8
        }}
        style="dashed"
        fillOpacity={0.15}
        strokeOpacity={0.6}
        color={colors.blue}
        startFrame={12}
        endFrame={12}
        stepIndex={stepIndex}
      />
      <InequalityPlot
        xInequality={{ 
          ">=": (y) => -0.8,
          "<=": (y) => 0.8
        }}
        style="dashed"
        fillOpacity={0.15}
        strokeOpacity={0.6}
        color={colors.blue}
        startFrame={12}
        endFrame={12}
        stepIndex={stepIndex}
      />

      <Polygon
        points={[
          [-0.8,-0.8],
          [0.8,-0.8],
          [0.8,0.8],
          [-0.8,0.8]
        ]}
        strokeStyle='dashed'
        color={colors.orange}
        startFrame={11}
        endFrame={12}
        stepIndex={stepIndex}
      />
    </BaseScene>
  )
}

export default DeMorgan
