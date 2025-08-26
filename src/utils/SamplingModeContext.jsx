import React from 'react'

export const SamplingModeContext = React.createContext('old') // 'old' | 'new'

export function SamplingModeProvider({ mode = 'old', children }) {
  return (
    <SamplingModeContext.Provider value={mode}>
      {children}
    </SamplingModeContext.Provider>
  )
}

export function useSamplingMode() {
  return React.useContext(SamplingModeContext)
}

