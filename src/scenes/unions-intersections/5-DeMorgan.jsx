import { useMemo } from 'react'
import BaseScene from '../../components/BaseScene'
import { colors } from '../../config/colors'
import Union from '../../components/objects/Union'
import Intersection from '../../components/objects/Intersection'
import Circle from '../../components/objects/Circle'
import Blob from '../../components/objects/Blob'
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
    "This same argument works for _any_ collection of sets, even if the collection is infinite. It just boils down to the fact\
    that a point $x$ is _not_ in the union if and only if it is in _all_ of the complements.",
    "TOP: Now let's see what happens for intersections. $$$$If a point $x$ does _not_ lie in $A \\cap B$, this means that it\
    is not an element of at least one of these sets.",
    "TOP: In other words, $x$ lies in either $A^c$ or $B^c$, so it is an element of $A^c \\cup B^c$. We can again write\
    this general fact using the equation $$(A \\cap B)^c = A^c \\cup B^c \\text{.}$$",
    "We can do the same exact thing for larger (even infinite) collections of sets. A point $x$ does not simultaneously\
    lie in all of the sets if and only if it lies in at least one of the complements.",
    "The equations $$\\left(A_1 \\cup A_2 \\cup A_3 \\cup \\cdots\\right)^c = A_1^c \\cap A_2^c \\cap A_3^c \\cap \\cdots$$ and\
    $$\\left(A_1 \\cap A_2 \\cap A_3 \\cap\\\cdots\\right)^c = A_1^c \\cup A_2^c \\cup A_3^c \\cup \\cdots$$ are called\
    *De Morgan's laws.* They summarize the observations we've just made about how complements interact with unions and intersections.",
    "TOP: Now we have what we need to answer our two questions about closed sets. To begin, we'll consider a _finite union_ of\
    closed sets $A_1 \\cup A_2 \\cup \\cdots \\cup A_n$.",
    "TOP: Instead of trying to figure out whether this union is closed, we'll look at its complement.",
    "TOP: By De Morgan's law, the complement of this union is equal to $$A_1^c \\cap A_2^c \\cap \\cdots \\cap A_n^c\
    \\text{.}$$",
    "TOP: Since the sets $A_1^c$, $A_2^c, \\dots, A_n^c$ are complements of closed sets, they are all open. $$$$ This means that\
    $A_1^c \\cap A_2^c \\cap \\cdots \\cap A_n^c$ is a finite intersection of open sets, which we proved is open!",
    "TOP: Since the complement of $A_1 \\cup A_2 \\cup \\cdots \\cup A_n$ is open, this means that $A_1 \\cup A_2 \\cup \
    \\cdots \\cup A_n$ is closed. $$$$ This proves the answer to our third question: _finite_ unions of closed sets are closed.",
    "TOP: Finally, let's consider a (possibly infinite) intersection $$A_1 \\cap A_2 \\cap A_3 \\cap \\cdots$$ of closed sets.",
    "TOP: By De Morgan's law, the complement of this intersection is equal to $$A_1^c \\cup A_2^c \\cup A_3^c \\cup \\cdots\
    \\text{,}$$ which is a union of open sets. That means that this set is open!",
    "TOP: Since the complement of $A_1 \\cap A_2 \\cap A_3 \\cap \\cdots$ is open, this set is closed. $$$$ This answers our\
    last question: intersections of closed sets are closed.",
    "To summarize, closed sets stay closed when we take finite unions and intersections, just how open sets stay open when\
    we take unions and finite intersections. $$$$ We have answered all four of our original questions!",
    "There's one last thing we haven't seen the analogue for yet: $$$$ We know that an infinite intersection of open sets\
    might not be open. Can we find a similar example for infinite unions of closed sets?",
    "We can actually do a whole lot better; examples of this phenomenon are _everywhere._ In fact, every single non-closed\
    set we've seen so far is an example! We'll find out why in the next lesson, which is the last in this section."
  ]
}

function DeMorgan({ windowSize, stepIndex, isPanelOpen, sceneKey }) {

  const circlesKeyframes = useMemo(() => ({
    radius: {
      0: 3,
      9: 0
    }
  }), [])

  const blobs = useMemo(() => [
    { center: [0, -2], size: 1.1, seed: 2201, scale: 0.12, },
    { center: [-0.4, -0.4], size: 1.2, seed: 2202, scale: 0.22 },
    { center: [0.8, -1], size: 1.3, seed: 2203, scale: 0.16 }
  ], [])

  const moreBlobs = useMemo(() => [
    { center: [-0.1, 0], size: 1, seed: 2204, scale: 0.32, },
    { center: [0, -0.7], size: 0.4, seed: 2205, scale: 0.2 },
    { center: [0.1, -0.8], size: 0.1, seed: 2206, scale: 0.2 },
    { center: [0.14, -0.9], size: 0.07, seed: 2207, scale: 0.1 },
  ], [])

  // Get the current animated radius value for the circles
  const animatedProps = useKeyframeAnimation(circlesKeyframes, stepIndex)
  const currentRadius = animatedProps.radius ?? 3

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
      
      <Union
        shapes={[
          { type: 'circle', center: [-2, -0.5], radius: currentRadius },
          { type: 'circle', center: [-2, -0.5], radius: currentRadius }
        ]}
        color={colors.purple}
        fillOpacity={0.2}
        invert={true}
        style="dashed"
        startFrame={4}
        endFrame={5}
        stepIndex={stepIndex}
      />
      <Union
        shapes={[
          { type: 'circle', center: [2, -0.5], radius: currentRadius },
          { type: 'circle', center: [2, -0.5], radius: currentRadius }
        ]}
        color={colors.purple}
        fillOpacity={0.2}
        invert={true}
        style="dashed"
        startFrame={4}
        endFrame={5}
        stepIndex={stepIndex}
      />
      <Circle
        center={[-2,-0.5]}
        keyframes={circlesKeyframes}
        stepIndex={stepIndex}
        color={colors.purple}
        fillOpacity={0}
        strokeOpacity={0}
        showCenterPoint={false}
        labelContext={() => `$A^c$`}
        labelAttach='n'
        labelAttachDistance={-30}
        startFrame={4}
        endFrame={5}
      />
      <Circle
        center={[2,-0.5]}
        keyframes={circlesKeyframes}
        stepIndex={stepIndex}
        color={colors.purple}
        fillOpacity={0}
        strokeOpacity={0}
        showCenterPoint={false}
        labelContext={() => `$B^c$`}
        labelAttach='n'
        labelAttachDistance={-30}
        startFrame={4}
        endFrame={5}
      />
      <Union
        shapes={[
          { type: 'circle', center: [-2, -0.5], radius: currentRadius },
          { type: 'circle', center: [2, -0.5], radius: currentRadius }
        ]}
        color={colors.red}
        invert={true}
        style="dashed"
        startFrame={5}
        endFrame={5}
        stepIndex={stepIndex}
      />
      <Circle
        center={[2,-0.5]}
        keyframes={circlesKeyframes}
        stepIndex={stepIndex}
        color={colors.red}
        fillOpacity={0}
        strokeOpacity={0}
        showCenterPoint={false}
        labelContext={() => `$A^c \\cap B^c$`}
        labelAttach='e'
        labelAttachDistance={-55}
        startFrame={5}
        endFrame={5}
      />

      <Intersection
        shapes={[
          { type: 'circle', center: [-2, -0.5], radius: currentRadius },
          { type: 'circle', center: [2, -0.5], radius: currentRadius }
        ]}
        color={colors.red}
        startFrame={7}
        endFrame={7}
        stepIndex={stepIndex}
      />

      <Union
        shapes={[
          { type: 'circle', center: [-2, -0.5], radius: currentRadius },
          { type: 'circle', center: [-2, -0.5], radius: currentRadius }
        ]}
        color={colors.purple}
        fillOpacity={0.2}
        invert={true}
        style="dashed"
        startFrame={8}
        endFrame={8}
        stepIndex={stepIndex}
      />
      <Union
        shapes={[
          { type: 'circle', center: [2, -0.5], radius: currentRadius },
          { type: 'circle', center: [2, -0.5], radius: currentRadius }
        ]}
        color={colors.purple}
        fillOpacity={0.2}
        invert={true}
        style="dashed"
        startFrame={8}
        endFrame={8}
        stepIndex={stepIndex}
      />
      <Circle
        center={[-2,-0.5]}
        keyframes={circlesKeyframes}
        stepIndex={stepIndex}
        color={colors.purple}
        fillOpacity={0}
        strokeOpacity={0}
        showCenterPoint={false}
        labelContext={() => `$A^c$`}
        labelAttach='n'
        labelAttachDistance={-30}
        startFrame={8}
        endFrame={8}
      />
      <Circle
        center={[2,-0.5]}
        keyframes={circlesKeyframes}
        stepIndex={stepIndex}
        color={colors.purple}
        fillOpacity={0}
        strokeOpacity={0}
        showCenterPoint={false}
        labelContext={() => `$B^c$`}
        labelAttach='n'
        labelAttachDistance={-30}
        startFrame={8}
        endFrame={8}
      />

      {blobs.map((blob, index) => (
        <><Blob
          key={`blob-${index}`}
          center={blob.center}
          size={blob.size}
          harmonicsConfig={{ scale: blob.scale, seed: blob.seed }}
          color={colors.blue}
          fillOpacity={0.2}
          strokeOpacity={0.3}
          startFrame={10}
          endFrame={18}
          stepIndex={stepIndex}
        />

        <Union
          key={`union-${index}`}
          shapes={[
            { type: 'blob', center: blob.center, size: blob.size, harmonicsConfig: { scale: blob.scale, seed: blob.seed } },
            { type: 'blob', center: blob.center, size: blob.size, harmonicsConfig: { scale: blob.scale, seed: blob.seed } }
          ]}
          color={colors.purple}
          fillOpacity={0.2}
          invert={true}
          style="dashed"
          startFrame={13}
          endFrame={14}
          stepIndex={stepIndex}
        />
        <Union
          key={`union-${index}`}
          shapes={[
            { type: 'blob', center: blob.center, size: blob.size, harmonicsConfig: { scale: blob.scale, seed: blob.seed } },
            { type: 'blob', center: blob.center, size: blob.size, harmonicsConfig: { scale: blob.scale, seed: blob.seed } }
          ]}
          color={colors.purple}
          fillOpacity={0.2}
          invert={true}
          style="dashed"
          startFrame={17}
          endFrame={17}
          stepIndex={stepIndex}
        />
        </>
      ))}

      <Intersection
        shapes={blobs.map(blob => ({
          type: 'blob',
          center: blob.center,
          size: blob.size,
          harmonicsConfig: { scale: blob.scale, seed: blob.seed }
        }))}
        color={colors.red}
        invert={true}
        style='dashed'
        startFrame={14}
        endFrame={14}
        stepIndex={stepIndex}
      />

      <Blob
        center={[0, -2]}
        size={1.1}
        harmonicsConfig={{ seed: 2201, scale: 0.12 }}
        color={colors.red}
        fillOpacity={0}
        strokeOpacity={0}
        startFrame={14}
        endFrame={14}
        stepIndex={stepIndex}
        labelContext={() => "$A_1^c \\cap A_2^c \\cap \\cdots \\cap A_n^c$"}
        labelAttach="s"
      />

      <Union
        shapes={blobs.map(blob => ({
          type: 'blob',
          center: blob.center,
          size: blob.size,
          harmonicsConfig: { scale: blob.scale, seed: blob.seed }
        }))}
        color={colors.green}
        startFrame={15}
        endFrame={15}
        stepIndex={stepIndex}
      />

      <Blob
        center={[-0.4, -0.4]}
        size={1.2}
        harmonicsConfig={{ seed: 2202, scale: 0.22 }}
        color={colors.green}
        fillOpacity={0}
        strokeOpacity={0}
        startFrame={15}
        endFrame={15}
        stepIndex={stepIndex}
        labelContext={() => "$A_1 \\cup A_2 \\cup \\cdots \\cup A_n$"}
        labelAttach="n"
      />

      {moreBlobs.map((blob, index) => (
        <><Blob
          key={`blob-${index}`}
          center={blob.center}
          size={blob.size}
          harmonicsConfig={{ scale: blob.scale, seed: blob.seed }}
          color={colors.blue}
          fillOpacity={0.2}
          strokeOpacity={0.3}
          startFrame={16}
          endFrame={18}
          stepIndex={stepIndex}
        />

        <Union
          key={`union-${index}`}
          shapes={[
            { type: 'blob', center: blob.center, size: blob.size, harmonicsConfig: { scale: blob.scale, seed: blob.seed } },
            { type: 'blob', center: blob.center, size: blob.size, harmonicsConfig: { scale: blob.scale, seed: blob.seed } }
          ]}
          color={colors.purple}
          fillOpacity={0.2}
          invert={true}
          style="dashed"
          startFrame={17}
          endFrame={17}
          stepIndex={stepIndex}
        /></>
      ))}

      <Intersection
        shapes={moreBlobs.map(blob => ({
          type: 'blob',
          center: blob.center,
          size: blob.size,
          harmonicsConfig: { scale: blob.scale, seed: blob.seed }
        }))}
        color={colors.red}
        startFrame={18}
        endFrame={18}
        stepIndex={stepIndex}
      />

    </BaseScene>
  )
}

export default DeMorgan
