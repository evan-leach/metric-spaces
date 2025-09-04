export const sidebarConfig = [
  {
    title: 'What is a Metric Space?',
    folder: 'intro',
    buttons: [
      { text: 'Introduction', scene: '1-Intro' },
      { text: 'Sets', scene: '2-Sets' },
      { text: 'Metrics', scene: '3-Metrics' },
      { text: 'Examples of metric spaces', scene: '4-Examples' },
      { text: 'Neighborhoods', scene: '5-Balls' }
    ]
  },
  {
    title: 'Open and Closed Sets',
    folder: 'open-closed',
    buttons: [
      { text: 'Interior and exterior points', scene: '1-IntExt' },
      { text: 'Boundary points', scene: '2-Boundary' },
      { text: 'Open sets', scene: '3-Open' },
      { text: 'Closed sets', scene: '4-Closed' },
      { text: 'Limit points', scene: '5-LimitPts' },
      { text: 'Closed sets contain their limit points', scene: '6-Ending' }
    ]
  },
  {
    title: 'Unions and Intersections',
    folder: 'unions-intersections',
    buttons: [
      { text: 'Unions and intersections of sets', scene: '1-Defs' },
      { text: 'Unions of open sets are open', scene: '2-OpenUnion' },
      { text: 'Finite intersections of open sets are open', scene: '3-OpenIntersect' },
      { text: 'Infinite intersections of open sets', scene: '4-InfiniteIntersect' },
      { text: 'Unions and intersections of closed sets', scene: '5-DeMorgan' },
      { text: 'Infinite unions of closed sets', scene: '6-ClosedUnion' }
    ]
  },
  {
    title: 'Coming soon: Compactness',
    folder: 'none',
    buttons: []
  }
] 