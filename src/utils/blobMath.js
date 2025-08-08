/**
 * Utility functions for blob mathematical calculations
 */

/**
 * Creates a function that calculates the radius of a blob at any given angle
 * @param {number} size - Base size of the blob
 * @param {Object} harmonics - Harmonic parameters for shape variation
 * @returns {Function} Function that takes an angle and returns radius
 */
export const createBlobRadiusFunction = (size, harmonics) => {
  return (angle) => {
    const baseRadius = size
    const harmonicNames = ['first', 'second', 'third', 'fourth', 'fifth', 'sixth', 'seventh', 'eighth']
    
    let radiusVariation = 0
    for (const name of harmonicNames) {
      if (harmonics[name]) {
        radiusVariation += harmonics[name].amplitude * Math.sin(harmonics[name].frequency * angle + harmonics[name].phase)
      }
    }
    
    return baseRadius * (1 + radiusVariation)
  }
}

/**
 * Creates a function that calculates the minimum distance from a point to blob boundary
 * @param {number} size - Base size of the blob
 * @param {Object} harmonics - Harmonic parameters for shape variation
 * @returns {Function} Function that takes (x, y) coordinates and returns minimum distance
 */
export const createDistanceToBoundaryFunction = (size, harmonics) => {
  const getBlobRadiusAtAngle = createBlobRadiusFunction(size, harmonics)
  
  return (px, py) => {
    let minDistanceToBoundary = Infinity
    
    // Always include the boundary point that is collinear with blob center and point
    const pointAngle = Math.atan2(py, px)
    const collinearBlobRadius = getBlobRadiusAtAngle(pointAngle)
    const collinearBlobX = collinearBlobRadius * Math.cos(pointAngle)
    const collinearBlobY = collinearBlobRadius * Math.sin(pointAngle)
    const collinearDistance = Math.sqrt(
      (px - collinearBlobX) ** 2 + (py - collinearBlobY) ** 2
    )
    minDistanceToBoundary = Math.min(minDistanceToBoundary, collinearDistance)
    
    // Sample the blob boundary at many angles for additional accuracy
    const angleStep = 0.05 // Fine sampling for accuracy
    for (let angle = 0; angle < 2 * Math.PI; angle += angleStep) {
      const blobRadius = getBlobRadiusAtAngle(angle)
      const blobX = blobRadius * Math.cos(angle)
      const blobY = blobRadius * Math.sin(angle)
      
      const distanceToThisBoundaryPoint = Math.sqrt(
        (px - blobX) ** 2 + (py - blobY) ** 2
      )
      
      minDistanceToBoundary = Math.min(minDistanceToBoundary, distanceToThisBoundaryPoint)
    }
    
    return minDistanceToBoundary
  }
}

/**
 * Creates a function that determines if a point is inside the blob
 * @param {number} size - Base size of the blob
 * @param {Object} harmonics - Harmonic parameters for shape variation
 * @returns {Function} Function that takes (x, y) coordinates and returns boolean
 */
export const createInsideBlobFunction = (size, harmonics) => {
  const getBlobRadiusAtAngle = createBlobRadiusFunction(size, harmonics)
  
  return (px, py) => {
    // Check if point is inside the blob by sampling multiple radial checks
    let insideCount = 0
    let totalChecks = 0
    
    for (let angle = 0; angle < 2 * Math.PI; angle += 0.2) {
      const blobRadiusAtAngle = getBlobRadiusAtAngle(angle)
      const pointDistanceAtThisAngle = Math.sqrt(px * px + py * py)
      const pointAngle = Math.atan2(py, px)
      
      // Check if point angle is close to this test angle
      const angleDiff = Math.abs(angle - pointAngle)
      const angleDiffNormalized = Math.min(angleDiff, 2 * Math.PI - angleDiff)
      
      if (angleDiffNormalized < 0.1) { // Point is roughly in this direction
        totalChecks++
        if (pointDistanceAtThisAngle < blobRadiusAtAngle) {
          insideCount++
        }
      }
    }
    
    // More robust inside/outside determination
    if (totalChecks > 0) {
      return insideCount > totalChecks / 2
    } else {
      // Fallback: use centroid-based check
      const pointDistanceFromOrigin = Math.sqrt(px * px + py * py)
      const pointAngle = Math.atan2(py, px)
      const blobRadiusAtPointAngle = getBlobRadiusAtAngle(pointAngle)
      return pointDistanceFromOrigin < blobRadiusAtPointAngle
    }
  }
}

/**
 * Default harmonic parameters for blob shapes
 * Note: These are sized for a blob of size ~2.0 with the new 8-harmonic system
 * First 4 harmonics (2,3,4,5) are large-scale shape features
 * Last 4 harmonics (4*size, 5*size, 6*size, 7*size) are small-scale surface details
 */
export const defaultHarmonics = {
  // Large scale harmonics (frequencies 2,3,4,5) - shape variation
  first: { amplitude: 0.35, frequency: 2, phase: 0 },           // Dominant shape (freq 2)
  second: { amplitude: 0.25, frequency: 3, phase: Math.PI / 3 }, // Major shape (freq 3)
  third: { amplitude: 0.15, frequency: 4, phase: Math.PI / 4 },  // Moderate shape (freq 4)
  fourth: { amplitude: 0.1, frequency: 5, phase: Math.PI / 2 },  // Minor shape (freq 5)
  
  // Small scale harmonics (size-scaled frequencies) - very subtle surface detail
  fifth: { amplitude: 0.018, frequency: 8, phase: Math.PI / 6 },  // 4 * size 2.0 - subtle surface detail
  sixth: { amplitude: 0.015, frequency: 10, phase: Math.PI / 5 }, // 5 * size 2.0 - subtle surface detail
  seventh: { amplitude: 0.012, frequency: 12, phase: Math.PI / 7 }, // 6 * size 2.0 - subtle surface detail
  eighth: { amplitude: 0.009, frequency: 14, phase: Math.PI / 8 }  // 7 * size 2.0 - subtle surface detail
} 