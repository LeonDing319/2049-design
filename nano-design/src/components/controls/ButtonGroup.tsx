'use client'

import { ReactNode } from 'react'

interface ButtonGroupOption {
  value: string
  label: string
}

interface ButtonGroupProps {
  label?: ReactNode
  value: string
  options: ButtonGroupOption[]
  onChange: (value: string) => void
  disabled?: boolean
  footer?: ReactNode
  columns?: number
}

export function ButtonGroup({ label, value, options, onChange, disabled, footer, columns = 3 }: ButtonGroupProps) {
  return (
    <div className="flex flex-col gap-1.5">
      {label && <span className="text-sm text-neutral-300">{label}</span>}
      <div style={{ display: 'grid', gridTemplateColumns: `repeat(${columns}, 1fr)`, gap: 6 }}>
        {options.map((opt) => (
          <button
            key={opt.value}
            type="button"
            onClick={() => onChange(opt.value)}
            disabled={disabled}
            className={`border cursor-pointer flex items-center justify-center disabled:opacity-40 disabled:cursor-not-allowed ${
              opt.value === value
                ? 'text-blue-500 border-blue-500 bg-blue-500/15'
                : 'text-neutral-400 border-neutral-700 bg-transparent hover:border-neutral-500'
            }`}
            style={{ height: 28, borderRadius: 6, fontSize: 11, padding: '0 8px' }}
          >
            {opt.label}
          </button>
        ))}
        {footer && <div style={{ gridColumn: '1 / -1' }}>{footer}</div>}
      </div>
    </div>
  )
}
