import { createContext, createElement, useContext, useMemo } from '@lynx-js/react'
import type { ReactNode } from '@lynx-js/react'

import { defaultTheme } from './defaultTheme.js'
import type { Theme } from './types.js'

/**
 * Theme context — mirrors MUI's `ThemeProvider`/`useTheme`. The default value is
 * `defaultTheme`, so components work without a provider (1:1 with MUI, where
 * `useTheme()` falls back to the default theme outside any `ThemeProvider`).
 */
export const ThemeContext = createContext<Theme>(defaultTheme)

/** Read the active theme. Mirrors `@mui/material`'s `useTheme()`. */
export function useTheme(): Theme {
  return useContext(ThemeContext)
}

export interface ThemeProviderProps {
  /** A theme object, or a function `(outerTheme) => theme` for nested merging. */
  theme: Theme | ((outerTheme: Theme) => Theme)
  children?: ReactNode
}

/**
 * Provides a theme to descendants. As in MUI, passing an object replaces the
 * outer theme; passing a function receives the outer theme for merging.
 */
export function ThemeProvider(props: ThemeProviderProps) {
  const outerTheme = useContext(ThemeContext)
  const theme = useMemo(
    () => (typeof props.theme === 'function' ? props.theme(outerTheme) : props.theme),
    [outerTheme, props.theme],
  )
  return createElement(ThemeContext.Provider, { value: theme }, props.children)
}
