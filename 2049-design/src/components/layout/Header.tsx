'use client'

import { useAppState } from '@/hooks/useEffectParams'
import { EffectType } from '@/types'
import { Globe } from 'lucide-react'
import { useTranslations } from 'next-intl'

export function Header() {
  const { state, dispatch } = useAppState()
  const t = useTranslations()

  const tabs: { id: EffectType; label: string }[] = [
    { id: 'glitch', label: t('effects.glitch') },
    { id: 'ascii', label: t('effects.ascii') },
  ]

  const toggleLocale = () => {
    dispatch({ type: 'SET_LOCALE', payload: state.locale === 'en' ? 'zh' : 'en' })
  }

  return (
    <header className="flex items-center justify-between h-12 px-4 border-b border-neutral-800 bg-neutral-900 text-[#393A3D]">
      <nav className="flex items-center gap-0.5 bg-neutral-800 rounded-md p-0.5">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => dispatch({ type: 'SET_EFFECT', payload: tab.id })}
            className={`px-3.5 py-1 text-sm rounded transition-colors ${
              state.activeEffect === tab.id
                ? 'bg-neutral-700 text-neutral-100 shadow-sm'
                : 'text-neutral-400 hover:text-neutral-200'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </nav>

      <button
        onClick={toggleLocale}
        className="flex items-center gap-1.5 px-2 py-1 text-sm text-neutral-400 hover:text-neutral-200 rounded-md hover:bg-neutral-800 transition-colors"
      >
        <Globe className="w-4 h-4" />
        <span>{state.locale === 'en' ? 'EN' : '中'}</span>
      </button>
    </header>
  )
}
