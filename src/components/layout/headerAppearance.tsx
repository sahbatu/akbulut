import { createContext, useContext } from 'react'

export const HeaderAppearanceContext = createContext({ dark: false })

export function useHeaderAppearance() {
  return useContext(HeaderAppearanceContext)
}
