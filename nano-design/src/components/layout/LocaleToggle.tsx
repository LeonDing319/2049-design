'use client'

import { useAppState } from '@/hooks/useEffectParams'

export function LocaleToggle() {
  const { state, dispatch } = useAppState()

  const toggleLocale = () => {
    dispatch({ type: 'SET_LOCALE', payload: state.locale === 'en' ? 'zh' : 'en' })
  }

  return (
    <button
      onClick={toggleLocale}
      style={{
        width: 36,
        height: 36,
        borderRadius: '50%',
        flexShrink: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: 13,
        fontWeight: 500,
        color: 'var(--color-theme-toggle-icon)',
        backgroundColor: 'var(--color-theme-toggle-bg)',
        border: '1px solid var(--color-border-group)',
        cursor: 'pointer',
        transition: 'background-color 0.2s, transform 0.2s',
      }}
      onMouseEnter={e => {
        e.currentTarget.style.backgroundColor = 'var(--color-theme-toggle-hover)'
        e.currentTarget.style.transform = 'scale(1.08)'
      }}
      onMouseLeave={e => {
        e.currentTarget.style.backgroundColor = 'var(--color-theme-toggle-bg)'
        e.currentTarget.style.transform = 'scale(1)'
      }}
    >
      {state.locale === 'en' ? '中' : 'EN'}
    </button>
  )
}
