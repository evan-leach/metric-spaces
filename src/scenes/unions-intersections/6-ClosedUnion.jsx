import BaseScene from '../../components/BaseScene'
import { colors } from '../../config/colors'
import Blob, { generateHarmonics, createBlobRadiusFunction } from '../../components/objects/Blob'
import ConstrainedMovablePoint from '../../components/objects/ConstrainedMovablePoint'
import Point from '../../components/objects/Point'

export const SceneConfig = {
  steps: [
    "When we previous showed that not all infinite intersections of open sets are open, we had to carefully construct\
    a collection of open sets and prove that the intersection was not open. $$$$ Now it's time for a far more\
    _dramatic_ approach.",
    "TOP: This set $S_x$ contains just a single point $x$. We call such a set a *singleton.* $$$$ Take a moment to\
    convince yourself that this singleton contains all of its boundary points and is therefore _closed._",
    "TOP: Here's the key observation: _every_ set can be written as a union of singletons. $$$$ In particular, any set $A$ is the\
    union of the singletons $S_z$ for each $z$ in $A$. This is just a precise way of saying that a set is made up of its points.",
    "TOP: We just saw that singletons are closed, so _every_ set $A$ is a union of closed sets.",
    "TOP: If unions of closed sets, infinite or not, were always closed, then _every_ set would be closed. $$$$ This is clearly\
    not true! Here's an example of a set which is not closed.",
    "TOP: We are forced to conclude that infinite unions of closed sets are not necessarily closed. In fact, _any_ set which is\
    not closed is an example of an infinite union of closed sets which is not itself closed.",
    "If you're looking for a challenge, try to prove that every set can be written as an intersection of open sets. It's a little\
    more difficult, but it's great practice seeing how complements interact with unions and intersections. $$$$ This gives us\
    another way to see that not all infinite intersections of open sets are open.",
    "We now have not only the answers to all four of our original questions, but an understanding of why finiteness is\
    necessary for intersections of open sets to be open and unions of closed sets to be closed.",
    "There's another takeaway, though: most _interesting_ sets in metric spaces are infinite! $$$$\
    If we only ever worked with finite sets, every set would just be a scattered bunch of points. In short,\
    almost all of our previous work would be pointless, and metric spaces would be boring.",
    "This puts us in a tricky situation. On the one hand, infinity often breaks properties we expect to hold. On the other hand,\
    infinite sets are essential! $$$$ We want to be able to work with infinite sets, but letting infinity into the picture is\
    just asking for trouble.",
    "The only solution is to _harness the infinite._ We need to find a way to work with infinite sets while still maintaining some control.",
    "The key is to consider a new type of set which can be infinite, but is \"sort of\" finite. We call these sets _compact._",
    "We will spend the rest of our time in this exploration grappling with the concept of compactness. It will take a while to uncover\
    the complete picture, but the shocking and beautiful results we discover will be worth it."
  ]
}

function ClosedUnion({ windowSize, stepIndex, isPanelOpen, sceneKey }) {

  const blobSize = 4

  const blobHarmonics = generateHarmonics(0.2, 999, blobSize)

  const getBlobRadius = createBlobRadiusFunction(blobSize, blobHarmonics)

  return (
    <BaseScene
      config={SceneConfig}
      sceneKey={sceneKey}
      stepIndex={stepIndex}
      isPanelOpen={isPanelOpen}
      windowSize={windowSize}
    >
      <Point
        center={[0,-1]}
        color={colors.orange}
        stepIndex={stepIndex}
        startFrame={0}
        endFrame={2}
        labelContext={() => "$S_x$"}
        labelAttach="sw"
        labelAttachDistance={30}
      />

      <Blob
        size={blobSize}
        harmonics={blobHarmonics}
        color={colors.blue}
        startFrame={3}
        endFrame={4}
        stepIndex={stepIndex}
      />

      <Blob
        size={1.7}
        harmonicsConfig={{ scale: 0.3, seed: 314 }}
        color={colors.blue}
        style='dashed'
        startFrame={5}
        endFrame={6}
        stepIndex={stepIndex}
      />

      <ConstrainedMovablePoint
        center={[0,0]}
        initialPosition={[0, -0.2]}
        startFrame={3}
        endFrame={4}
        stepIndex={stepIndex}
        labelContext={() => "$S_z$"}
        labelAttach="ne"
        labelAttachDistance={30}
        constraintFunction={getBlobRadius}
        marginPixels={0}
        color={colors.orange}
      />
    </BaseScene>
  )
}

export default ClosedUnion
