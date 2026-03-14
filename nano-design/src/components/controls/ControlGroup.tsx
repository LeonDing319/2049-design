'use client'

import { ReactNode } from 'react'

interface ControlGroupProps {
  children: ReactNode
}

export function ControlGroup({ children }: ControlGroupProps) {
  return (
    <div
      style={{
        border: '1px solid var(--color-border-group)',
        borderRadius: 10,
        padding: '12px',
      }}
      className="space-y-3"
    >
      {children}
    </div>
  )
}
