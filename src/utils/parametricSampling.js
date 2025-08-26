/**
 * Adaptive parametric sampler for closed curves.
 * Subdivides segments until screen-space deviation is below a tolerance
 * or max depth is reached. Also enforces a minimum subdivision depth.
 *
 * Returns a closed ring (first point repeated at end) and the corresponding t samples.
 */

function distance(a, b) {
  const dx = a[0] - b[0]
  const dy = a[1] - b[1]
  return Math.hypot(dx, dy)
}

function midpoint(a, b) {
  return [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2]
}

function pointOnSegment(a, b, t01) {
  return [a[0] + (b[0] - a[0]) * t01, a[1] + (b[1] - a[1]) * t01]
}

/**
 * Recursively sample a segment [ta, tb].
 * Ensures at least minDepth uniform splits.
 */
function sampleSegment(xy, ta, tb, pa, pb, depth, minDepth, maxDepth, pixelsPerUnit, tolerancePx, outPoints, outTs) {
  if (depth < minDepth) {
    // force subdivision to reach minimum depth
    const tm = (ta + tb) / 2
    const pm = xy(tm)
    sampleSegment(xy, ta, tm, pa, pm, depth + 1, minDepth, maxDepth, pixelsPerUnit, tolerancePx, outPoints, outTs)
    sampleSegment(xy, tm, tb, pm, pb, depth + 1, minDepth, maxDepth, pixelsPerUnit, tolerancePx, outPoints, outTs)
    return
  }

  // Evaluate deviation at midpoint against straight line
  const tm = (ta + tb) / 2
  const pm = xy(tm)
  const projectedMid = pointOnSegment(pa, pb, 0.5)
  const worldDeviation = distance(pm, projectedMid)
  const screenDeviation = worldDeviation * pixelsPerUnit

  if (screenDeviation > tolerancePx && depth < maxDepth) {
    // Subdivide further
    sampleSegment(xy, ta, tm, pa, pm, depth + 1, minDepth, maxDepth, pixelsPerUnit, tolerancePx, outPoints, outTs)
    sampleSegment(xy, tm, tb, pm, pb, depth + 1, minDepth, maxDepth, pixelsPerUnit, tolerancePx, outPoints, outTs)
  } else {
    // Accept endpoint pb (pa already added by the caller)
    outPoints.push(pb)
    outTs.push(tb)
  }
}

/**
 * Samples a closed parametric curve xy(t) on [tMin, tMax].
 * @param {Function} xy - function of t -> [x, y]
 * @param {number} tMin
 * @param {number} tMax
 * @param {Object} options
 * @param {number} options.pixelsPerUnit - scale factor from world units to pixels
 * @param {number} options.tolerancePx - max allowed screen-space deviation for a segment
 * @param {number} options.minDepth - minimum recursion depth (uniform splits)
 * @param {number} options.maxDepth - maximum recursion depth
 * @returns {{ points: number[][], ts: number[] }}
 */
export function sampleParametricAdaptive(xy, tMin, tMax, {
  pixelsPerUnit,
  tolerancePx = 0.75,
  minDepth = 8,
  maxDepth = 14
}) {
  // Start with one segment per quarter-turn at minDepth 0 baseline
  const t0 = tMin
  const t1 = tMax
  const p0 = xy(t0)
  const p1 = xy(t1)

  const points = [p0]
  const ts = [t0]

  sampleSegment(
    xy,
    t0,
    t1,
    p0,
    p1,
    0,
    minDepth,
    maxDepth,
    pixelsPerUnit,
    tolerancePx,
    points,
    ts
  )

  // Close the ring if not already
  const first = points[0]
  const last = points[points.length - 1]
  if (first[0] !== last[0] || first[1] !== last[1]) {
    points.push([first[0], first[1]])
    ts.push(ts[0])
  }

  return { points, ts }
}

