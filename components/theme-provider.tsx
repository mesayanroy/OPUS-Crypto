'use client'

import * as React from 'react'

type Props = {
  children: React.ReactNode
  // Accept any props to remain API-compatible with next-themes usage.
  [key: string]: unknown
}

// Lightweight pass-through to avoid dev vendor-chunk issues on Windows.
export function ThemeProvider({ children }: Props) {
  return <>{children}</>
}
