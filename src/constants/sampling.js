// Adaptive sampling constants

// Maximum allowed screen-space deviation per segment (higher = fewer points)
export const ADAPTIVE_TOLERANCE_PX = 0.1

// Enforced minimum subdivision depth (ensures baseline detail even if curve is flat)
export const ADAPTIVE_MIN_DEPTH = 3

// Cap on subdivision depth (prevents runaway refinement at high zoom/curvature)
export const ADAPTIVE_MAX_DEPTH = 13
