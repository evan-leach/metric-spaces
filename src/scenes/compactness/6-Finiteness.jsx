import { useMemo } from 'react'
import BaseScene from '../../components/BaseScene'
import { colors } from '../../config/colors'
import Circle from '../../components/objects/Circle'
import Blob, { generateHarmonics, createBlobRadiusFunction } from '../../components/objects/Blob'
import PointSequence from '../../components/objects/PointSequence'
import Intersection from '../../components/objects/Intersection'
import { useKeyframeAnimation } from '../../hooks/useKeyframeAnimation'

export const SceneConfig = {
  steps: [
    "If a set is finite, then there are quite a few conclusions we can immediately make. For example, we know\
    right away that the set is compact, which also means that it is closed, bounded, and sequentially compact.",
    "What if we want to go in the other direction? In other words, can we use certain properties of a set to prove that\
    it is finite?",
    "With the current definitions we've seen so far, the answer is no. Any infinite compact set gives us a counterexample.\
    $$$$ However, we can introduce a new property of finite sets that _will_ allow us to do this.",
    "TOP: Throughout this exploration, our sets have largely looked like one of two things: blobs or scattered\
    collections of points.",
    "TOP: We can distinguish these two sets by using limit points. Notice that the set $B$ is composed entirely of\
    limit points, while the set $A$ doesn't contain any of its limit points (it has a limit point, but this limit point is\
    not an _element_ of $A$).",
    "TOP: The following definition makes this observation precise: $$$$ A set $A$ is *discrete* if it doesn't\
    contain any of its limit points.",
    "TOP: In other words, if $A$ is discrete, then every point $x$ in $A$ has some neighborhood $N_r(x)$ which contains no\
    other points of $A$.",
    "Because finite sets have no limit points, they are always discrete. $$$$ This means that we have found a new property\
    of finite sets. Finite sets are not only compact, but also discrete.",
    "These two properties together _are_ enough to go in the other direction and prove that a set is finite. In other words,\
    any set which is both compact and discrete _must_ be finite. $$$$ As we'll see, sequential compactness is the key to proving\
    this.",
    "TOP: If a set $A$ is compact, then it is sequentialy compact. This means that every infinite subset of $A$, including $A$\
    itself has a limit point in $A$. If $A$ is infinite, then this means that $A$ contains one of its limit points.",
    "TOP: Since a discrete set does not contain any of its limit points, this means that any infinite compact set is not discrete.\
    $$$$ In other words, the _only_ way a set can be both compact and discrete is if it is finite.",
    "We have proven that a set $A$ is finite _if and only if_ it is both compact and discrete. $$$$ We call this a\
    *characterization* of finiteness. We have broken up the property of being finite into two _weaker_ properties.",
    "TOP: We can visualize this decomposition using a Venn diagram of sets. Each point in this diagram represents a set, and the\
    circles are _collections_ of sets. Here, we see the collections of compact sets and discrete sets.",
    "TOP: Our result tells us that the intersection of the compact sets with the discrete sets is the collection of finite sets.\
    $$$$ In other words, the sets which are both compact and discrete are _precisely_ the finite sets.",
    "This is an interesting result, and it is often a useful way to prove that a set is finite. Unfortunately, though, it\
    doesn't give us much insight into finite sets. $$$$ Finiteness is already a straightforward property, and it does us no good\
    to break a simple concept into two more complicated parts!",
    "However, this characterization of finiteness is just a taste of what is to come. In the next section, we will give a\
    characterization of _compactness._",
    "This characterization will be incredibly useful, since it will enable us to understand the elusive property of compactness\
    in terms of two simpler concepts. $$$$ This will give us a powerful tool for understanding what compactness is and\
    which sets are compact.",
    "We will also finally see why _open_ sets are so crucial to the definition of compactness, and we will tie\
    everything together with the two most beautiful proofs of this exploration."
  ]
}

function Finiteness({ windowSize, stepIndex, isPanelOpen, sceneKey }) {

  const circlesKeyframes = useMemo(() => ({
    radius: {
      6: 0,
      7: 1,
      8: 0
    }
  }), [])

  const vennKeyframes = useMemo(() => ({
    radius: {
      12: 0,
      13: 2,
      15: 0
    }
  }), [])
  
  const chaoticCurve = (t) => {
    const sx = 89.4 * t
    const sy = 74.7 * t
    const px = 4 * Math.abs(sx - Math.floor(sx) - 0.5) - 1
    const py = 4 * Math.abs(sy - Math.floor(sy) - 0.5) - 1
    const x = 6 * px * px * px
    const y = 5 * py * py * py

    return [
      x,
      y
    ]
  }

  // Get the current animated radius value for the circles
  const animatedProps = useKeyframeAnimation(vennKeyframes, stepIndex)
  const currentRadius = animatedProps.radius ?? 3

  return (
    <BaseScene
      config={SceneConfig}
      sceneKey={sceneKey}
      stepIndex={stepIndex}
      isPanelOpen={isPanelOpen}
      windowSize={windowSize}
    >
      {Array.from({ length: 50 }).map((_, n) => (
        <Circle
          key={n}
          center={[-3.5, 3 * Math.pow(0.75, n+1) - 2]}
          keyframes={circlesKeyframes}
          stepIndex={stepIndex}
          color={colors.blue}
          strokeStyle="dashed"
          fillOpacity={0.2}
          strokeOpacity={0.4}
          radiusScale={0.4 * Math.pow(0.75, n)}
          showCenterPoint={false}
        />
      ))}

      <PointSequence
        curve={(t) => [-3.5, 3 * t - 2]}
        cutoff={50}
        k={0.75}
        pointColor={colors.red}
        startFrame={0}
        endFrame={7}
        stepIndex={stepIndex}
        labelContext={() => "$A$"}
        labelAttach='nw'
      />
      
      <Blob
        center={[3, -0.5]}
        size={2.5}
        harmonics={generateHarmonics(0.2, 1458, 3)}
        color={colors.orange}
        startFrame={0}
        endFrame={7}
        stepIndex={stepIndex}
        labelAttach='sw'
        labelContext={() => "$B$"}
      />

      <PointSequence
        curve={chaoticCurve}
        cutoff={150}
        k={0.999}
        pointColor={colors.red}
        startFrame={10}
        endFrame={11}
        stepIndex={stepIndex}
        labelAttach="sw"
        labelPointIndex={56}
        labelContext={() => '$A$'}
      />

      <Circle
        center={[-1.4,-0.5]}
        keyframes={vennKeyframes}
        stepIndex={stepIndex}
        labelContext={() => `$\\text{Compact sets}$`}
        labelAttach="sw"
        labelAttachDistance={70}
        showCenterPoint={false}
      />
      
      <Circle
        center={[1.4,-0.5]}
        keyframes={vennKeyframes}
        stepIndex={stepIndex}
        labelContext={() => `$\\text{Discrete sets}$`}
        labelAttach="se"
        labelAttachDistance={70}
        showCenterPoint={false}
      />

      <Intersection
        shapes={[
          { type: 'circle', center: [-1.4, -0.5], radius: currentRadius },
          { type: 'circle', center: [1.4, -0.5], radius: currentRadius }
        ]}
        color={colors.red}
        startFrame={14}
        stepIndex={stepIndex}
      />

      <Circle
        center={[0,-0.5]}
        keyframes={vennKeyframes}
        stepIndex={stepIndex}
        color={colors.red}
        fillOpacity={0}
        strokeOpacity={0}
        startFrame={14}
        labelContext={() => `$\\text{Finite sets}$`}
        labelAttach="s"
        radiusScale={0.7142}
        showCenterPoint={false}
      />
        
    </BaseScene>
  )
}

export default Finiteness

