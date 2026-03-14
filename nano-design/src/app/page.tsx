'use client'

import { useRef } from 'react'
import { Sidebar } from '@/components/layout/Sidebar'
import { InfiniteCanvas } from '@/components/canvas/InfiniteCanvas'
import { LocaleToggle } from '@/components/layout/LocaleToggle'
import { ThemeToggle } from '@/components/layout/ThemeToggle'

export default function Home() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  return (
    <div className="flex h-screen bg-neutral-950">
      <div className="flex flex-1 overflow-hidden relative">
        <main className="flex-1 overflow-hidden">
          <InfiniteCanvas canvasRef={canvasRef} />
        </main>
        <Sidebar canvasRef={canvasRef} />
        <div style={{ position: 'absolute', bottom: 16, right: 16, zIndex: 50, display: 'flex', alignItems: 'center', gap: 8 }}>
          <ThemeToggle />
          <LocaleToggle />
        </div>
      </div>
    </div>
  )
}
