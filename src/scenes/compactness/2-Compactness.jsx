import { useMemo } from 'react'
import BaseScene from '../../components/BaseScene'
import { colors } from '../../config/colors'
import Circle from '../../components/objects/Circle'
import Blob from '../../components/objects/Blob'

export const SceneConfig = {
  zoom: { min: 0.2, max: 100 },
  steps: [
    "In order to define sets which are \"almost\" finite, we need to slightly broaden our equivalent definition of a\
    finite set: a set for which every cover has a finite subcover. $$$$ Right now, the only sets that fit this\
    definition are finite. Any other set has a cover consisting entirely of singletons which has no finite subcover.",
    "One way to prevent this singleton cover is to restrict the types of sets allowed in our covers. $$$$ Notice that\
    singletons are not _open_ sets, as the point $x$ is not an interior point of the singleton $S_x$ (unless we're\
    working in a really strange metric space, such as one with the discrete metric).",
    "A cover consisting entirely of open sets is called an *open cover.* $$$$ Even though the singleton cover of\
    an infinite set always gives us a cover with no finite subcover, it's not an _open_ cover.",
    "If we only require that every _open_ cover of a set has a finite subcover (rather than _all_ covers), then the\
    condition becomes a little bit broader. We can no longer simply rule out all infinite sets using the singleton\
    cover. $$$$ This is exactly the less restrictive definition we've been looking for!",
    "TOP: A set is called *compact* if every open cover of the set has a finite subcover. $$$$ We will denote\
    compact sets with the letter $K$.",
    "TOP: We now have two big questions to answer: $$$$ 1. What can we do with compact sets? $$$$ 2. What kinds of sets\
    are compact?",
    "TOP: The first answer is that we can do a whole lot with these sets. Even though open covers are a little bit\
    less flexible than arbitrary covers, there are still a huge variety of open covers to pick from. These can\
    range from simple...",
    "TOP: ...to complex...",
    "TOP: ...to bizzare. $$$$ If a set $K$ is compact, then _any_ of these open covers must have a finite\
    subcover. We'll see in the rest of this section that we can do a lot with these open covers.",
    "The second question asks which sets are compact. We know that finite sets are compact; every cover, open or\
    not, of finite set has a finite subcover. $$$$ Which infinite sets are compact, though?",
    "This is a hard question. The downside of having so many open covers to choose from\
    is that it's a tall order to prove that _every single one_ has a finite subcover. $$$$ We will answer this\
    question completely in the final section, and it will be a beautiful culmination of our exploration.",
    "For now, though, let's focus on the first question. You should temporarily take for granted that interesting\
    compact sets do exist, and we'll learn about all the ways we can use the property that every open cover has a\
    finite subcover."
  ]
}

function Compactness({ windowSize, stepIndex, isPanelOpen, sceneKey }) {

  const blobs = useMemo(() => [
    { center: [-2,0], size: 4, seed: 450, scale: 0.2 },
    { center: [2,-0.5], size: 4, seed: 451, scale: 0.25 }
  ], [])

  const circlesKeyframes = useMemo(() => ({
    radius: {
      7: 0,
      8: 1,
      10: 0
    }
  }), [])

  const chaoticCurve = (t) => {
    const sx = t * t / 1.03
    const sy = t * t / 1.077
    const x = 4 * Math.abs(sx - Math.floor(sx) - 0.5) - 1
    const y = 4 * Math.abs(sy - Math.floor(sy) - 0.5) - 1
    return [
      3 * x,
      3 * y - 0.5
    ]
  }

  const chaoticCurve2 = (t) => {
    const sx = t * t / 1.063
    const sy = t * t / 1.18
    const x = 4 * Math.abs(sx - Math.floor(sx) - 0.5) - 1
    const y = 4 * Math.abs(sy - Math.floor(sy) - 0.5) - 1
    return [
      3 * x * x * x,
      3 * y * y * y - 0.5
    ]
  }

  return (
    <BaseScene
      config={SceneConfig}
      sceneKey={sceneKey}
      stepIndex={stepIndex}
      isPanelOpen={isPanelOpen}
      windowSize={windowSize}
    >
      <Blob
        size={3}
        center={[0,0]}
        harmonicsConfig={{ scale: 0.2, seed: 450 }}
        color={colors.gray}
        style="solid"
        labelContext={() => "$K$"}
        labelAttach="s"
        startFrame={0}
        endFrame={9}
        stepIndex={stepIndex}
      />

      {blobs.map((blob, index) => (
        <Blob
          key={`blob1-${index}`}
          center={blob.center}
          size={blob.size}
          harmonicsConfig={{ scale: blob.scale, seed: blob.seed }}
          color={colors.blue}
          style="dashed"
          fillOpacity={0.2}
          strokeOpacity={0.4}
          startFrame={7}
          endFrame={7}
          stepIndex={stepIndex}
        />
      ))}
      {Array.from({ length: 64 }, (_, n) => {
        return (
          <Circle
            key={n}
            center={chaoticCurve(n)}
            keyframes={circlesKeyframes}
            stepIndex={stepIndex}
            color={colors.blue}
            strokeStyle='dashed'
            fillOpacity={0.2}
            strokeOpacity={0.4}
            radiusScale={20/(n+10) + 0.5}
            showCenterPoint={false}
          />
        );
      })}
      {Array.from({ length: 4 }, (_, n) => {
        return (
          <Blob
            key={`blob${n}`}
            center={chaoticCurve2(n + 14)}
            size={5/(n+2)+2}
            harmonicsConfig={{ scale: 0.5 - n/20, seed: 470 + n }}
            color={colors.blue}
            style="dashed"
            fillOpacity={0.2}
            strokeOpacity={0.4}
            startFrame={9}
            endFrame={9}
            stepIndex={stepIndex}
          />
        );
      })}
    </BaseScene>
  )
}

export default Compactness

