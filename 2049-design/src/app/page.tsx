'use client'

import { useState, useRef } from 'react'
import { Header } from '@/components/layout/Header'
import { Sidebar } from '@/components/layout/Sidebar'
import { InfiniteCanvas } from '@/components/canvas/InfiniteCanvas'
import { useTranslations } from 'next-intl'

export default function Home() {
  const t = useTranslations('upload')
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [isDraggingOver, setIsDraggingOver] = useState(false)

  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDraggingOver(true)
  }
  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    if (e.currentTarget === e.target) setIsDraggingOver(false)
  }
  const handleDragOver = (e: React.DragEvent) => e.preventDefault()
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDraggingOver(false)
  }

  return (
    <div
      className="flex flex-col h-screen bg-neutral-950"
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
    >
      <Header />
      <div className="flex flex-1 overflow-hidden">
        <main className="flex-1 overflow-hidden">
          <InfiniteCanvas canvasRef={canvasRef} />
        </main>
        <Sidebar canvasRef={canvasRef} />
      </div>
      {isDraggingOver && (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-white/5 border-4 border-dashed border-neutral-500 pointer-events-none">
          <p className="text-lg text-neutral-300 font-medium">{t('dropOverlay')}</p>
        </div>
      )}
    </div>
  )
}
