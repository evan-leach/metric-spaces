import React from 'react'
import BaseScene from '../../components/BaseScene'
import Distance from '../../components/intro/Distance'
import { colors } from '../../config/colors'

export const SceneConfig = {
  steps: [
    "Welcome to this interactive exploration of metric spaces! $$$$ This website was made by Evan Leach, and it is\
    a submission to the 4th Summer of Math Exposition contest. $$$$ To navigate through these lessons, you can click\
    the buttons on the edges of the screen or press the left and right arrow keys.\
    You can also click on a specific step on the bottom of the screen to jump to it.",
    "You are about to learn about a topic which is usually reserved for undergraduate mathematics majors\
    near the end of their degree. Though often presented as challenging and abstract, I hope to convince you that\
    metric spaces are visually intuitive and beautiful.\
    $$$$ These lessons are intended for everyone, even if you only barely remember your high school math classes. The only\
    prerequisite is a willingness to deeply and carefully think through logical arguments. We will start simple and build\
    as we go.",
    "Let's begin with the obvious question: $$$$ _What is a metric space?_ $$$$ We will give a concrete answer\
    very soon, but for now, consider it a space where a notion of _distance_ exists. $$$$ You have already encountered\
    many examples of these spaces; for starters, we live in a metric space! After all, given any two locations in the\
    universe, we can consider the distance between them.",
    "You have also likely encountered metric spaces in school. You already know how to calculate the distance between two\
    numbers (for example, the distance between the numbers $2$ and $5$ is $3$). This means that the number line is a\
    metric space. $$$$ You might also remember a formula for computing the distance between two points on the coordinate\
    plane, and this formula lets us view the coordinate plane as a metric space.",
    "TOP: We will be using the coordinate plane to visualize metric spaces, since it fits rather nicely on a screen.\
    $$$$ Try dragging these points around to see how the distance between them changes.",
    "TOP: You can also drag the screen around and scroll to zoom in or out.",
    "Now that you've gotten to think about some examples, we can begin to explore the precise definition of a metric space.\
    $$$$ A metric space has two parts: a _set,_ and a _metric._ In order to truly understand metric spaces, we will take\
    a look at each of these two parts.",
    "In the next lesson, we'll begin by looking at _sets._ To proceed, open the menu in the upper-left corner of the screen."
  ]
}

function Intro({ 
  windowSize, 
  stepIndex, 
  isPanelOpen,
  sceneKey 
}) {
  return (
    <BaseScene
      config={SceneConfig}
      sceneKey={sceneKey}
      stepIndex={stepIndex}
      isPanelOpen={isPanelOpen}
      windowSize={windowSize}
    >
      <Distance
        point1Center={[-2, -1]}
        point2Center={[2, -1]}
        pointColor={colors.red}
        lineColor={colors.gray}
        showLabel={true}
        labelAttach="n"
        labelAttachDistance={50}
        startFrame={5}
        endFrame={6}
        stepIndex={stepIndex}
        distanceScaleFactor={0.8}
        distanceLabelFormat={(distance) => `$\\text{Distance: } $${distance.toFixed(2)}$`}
      />
    </BaseScene>
  )
}

export default Intro 