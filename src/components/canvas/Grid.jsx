import React from 'react'
import { Coordinates } from 'mafs'

function Grid({ 
  spacing = 0.8, 
  subdivisions = 10,
  ...props
}) {
  return (
    <g style={{ opacity: 0.15 }}>
      <Coordinates.Cartesian
        xAxis={{
          axis: false,
          lines: spacing,
          subdivisions: subdivisions,
          labels: () => "",
        }}
        yAxis={{
          axis: false,
          lines: spacing,
          subdivisions: subdivisions,
          labels: () => "",
        }}
        {...props} // Allow overriding any coordinate options
      />
    </g>
  )
}

export default Grid 