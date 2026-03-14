'use client'

export function Header() {
  return (
    <header style={{
      display: 'flex',
      alignItems: 'center',
      height: 48,
      padding: '0 16px',
      borderBottom: '1px solid var(--color-border-faint)',
      backgroundColor: 'var(--color-bg-primary)',
    }} />
  )
}
