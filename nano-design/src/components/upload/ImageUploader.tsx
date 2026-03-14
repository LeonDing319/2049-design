'use client'

import { useCallback, useRef, useState, useEffect } from 'react'
import { ImageIcon, Download } from 'lucide-react'
import { useImageUpload } from '@/hooks/useImageUpload'
import { useTranslations } from 'next-intl'
import { exportPNG, exportJPEG, exportSVG, exportPDF } from '@/engines/exporter'
import { useAppState } from '@/hooks/useEffectParams'
import { EffectType } from '@/types'

type ExportFormat = 'PNG' | 'JPEG' | 'SVG' | 'PDF'

interface ImageUploaderProps {
  hasImage: boolean
  canvasRef?: React.RefObject<HTMLCanvasElement | null>
}

export function ImageUploader({ hasImage, canvasRef }: ImageUploaderProps) {
  const { handleUpload } = useImageUpload()
  const { state, dispatch } = useAppState()
  const t2 = useTranslations('effects')
  const [error, setError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const t = useTranslations('upload')
  const tExport = useTranslations('export')

  const [exportFormat, setExportFormat] = useState<ExportFormat>('PNG')
  const [exporting, setExporting] = useState(false)
  const [showExportMenu, setShowExportMenu] = useState(false)

  const tabs: { id: EffectType; label: string }[] = [
    { id: 'glitch', label: t2('glitch') },
    { id: 'ascii', label: t2('ascii') },
    { id: 'other', label: t2('other') },
  ]
  const tabBtnRefs = useRef<(HTMLButtonElement | null)[]>([])
  const [tabIndicator, setTabIndicator] = useState({ left: 2, width: 0 })

  useEffect(() => {
    const idx = tabs.findIndex(tab => tab.id === state.activeEffect)
    const btn = tabBtnRefs.current[idx]
    if (btn) {
      setTabIndicator({ left: btn.offsetLeft, width: btn.offsetWidth })
    }
  }, [state.activeEffect, state.locale])

  const onFile = useCallback(async (file: File) => {
    setError(null)
    try {
      await handleUpload(file)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Upload failed')
    }
  }, [handleUpload])

  const onClickUpload = useCallback(() => fileInputRef.current?.click(), [])

  const onFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) onFile(file)
    e.target.value = ''
  }, [onFile])

  const doExport = useCallback(async (fmt: ExportFormat) => {
    if (!canvasRef?.current || !hasImage) return
    setExporting(true)
    setShowExportMenu(false)
    const filename = 'nano-design-export'
    const canvas = canvasRef.current
    switch (fmt) {
      case 'PNG': await exportPNG(canvas, filename); break
      case 'JPEG': await exportJPEG(canvas, filename); break
      case 'SVG': await exportSVG(canvas, filename); break
      case 'PDF': await exportPDF(canvas, filename); break
    }
    setExporting(false)
  }, [canvasRef, hasImage])

  return (
    <div className="space-y-2">
      {/* Preview banner */}
      <img
        src={state.activeEffect === 'ascii' ? '/preview-banner-ascii.png' : '/preview-banner.png'}
        alt="Preview"
        style={{
          width: '100%',
          display: 'block',
          borderRadius: '8px',
          objectFit: 'cover',
          border: '1px solid var(--color-border-group)',
          transition: 'opacity 0.3s ease',
        }}
      />

      {/* Effect tabs */}
      <nav style={{
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        gap: 2,
        backgroundColor: 'var(--color-bg-elevated)',
        borderRadius: 8,
        padding: 2,
        border: '1px solid var(--color-border-group)',
      }}>
        <div style={{
          position: 'absolute',
          top: 2,
          left: tabIndicator.left,
          width: tabIndicator.width,
          height: 'calc(100% - 4px)',
          borderRadius: 6,
          backgroundColor: 'var(--color-tab-indicator)',
          boxShadow: 'var(--color-tab-indicator-shadow)',
          transition: 'left 0.2s cubic-bezier(0.4, 0, 0.2, 1), width 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
          pointerEvents: 'none',
        }} />
        {tabs.map((tab, i) => (
          <button
            key={tab.id}
            ref={el => { tabBtnRefs.current[i] = el }}
            onClick={() => dispatch({ type: 'SET_EFFECT', payload: tab.id })}
            style={{
              flex: 1,
              position: 'relative',
              zIndex: 1,
              padding: '6px 0',
              fontSize: 13,
              borderRadius: 6,
              border: 'none',
              cursor: 'pointer',
              whiteSpace: 'nowrap',
              backgroundColor: 'transparent',
              color: state.activeEffect === tab.id ? 'var(--color-text-primary)' : 'var(--color-text-muted)',
              transition: 'color 0.2s',
            }}
          >
            {tab.label}
          </button>
        ))}
      </nav>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
        {/* Upload button */}
        <button
          onClick={onClickUpload}
          style={{
            height: 36,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '6px',
            padding: '0 12px',
            fontSize: '14px',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            color: 'var(--color-text-secondary)',
            backgroundColor: 'var(--color-bg-elevated)',
            border: '1px solid var(--color-border-group)',
            borderRadius: '8px',
            cursor: 'pointer',
            transition: 'background-color 0.15s, border-color 0.15s',
          }}
          onMouseEnter={e => (e.currentTarget.style.backgroundColor = 'var(--color-bg-hover)')}
          onMouseLeave={e => (e.currentTarget.style.backgroundColor = 'var(--color-bg-elevated)')}
        >
          <ImageIcon style={{ width: 16, height: 16, flexShrink: 0 }} />
          <span>{t('title')}</span>
        </button>

        {/* Export button */}
        <div style={{ position: 'relative' }}>
          <button
            onClick={() => { if (hasImage && !exporting) setShowExportMenu(v => !v) }}
            disabled={!hasImage || exporting}
            style={{
              width: '100%',
              height: 36,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
              padding: '0 12px',
              fontSize: '14px',
              color: 'var(--color-text-secondary)',
              backgroundColor: 'var(--color-bg-elevated)',
              border: '1px solid var(--color-border-group)',
              borderRadius: '8px',
              cursor: !hasImage || exporting ? 'not-allowed' : 'pointer',
              opacity: !hasImage || exporting ? 0.4 : 1,
              transition: 'background-color 0.15s, border-color 0.15s',
            }}
            onMouseEnter={e => { if (hasImage) e.currentTarget.style.backgroundColor = 'var(--color-bg-hover)' }}
            onMouseLeave={e => (e.currentTarget.style.backgroundColor = 'var(--color-bg-elevated)')}
          >
            <Download style={{ width: 16, height: 16, flexShrink: 0 }} />
            <span>{exporting ? tExport('processing') : tExport('button')}</span>
          </button>

          {showExportMenu && (
            <>
              <div style={{ position: 'fixed', inset: 0, zIndex: 10 }} onClick={() => setShowExportMenu(false)} />
              <div style={{
                position: 'absolute',
                top: 'calc(100% + 6px)',
                left: 0,
                right: 0,
                zIndex: 20,
                backgroundColor: 'var(--color-bg-secondary)',
                border: '1px solid var(--color-border-group)',
                borderRadius: '12px',
                boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
                overflow: 'hidden',
              }}>
                {/* Format list */}
                <div style={{ padding: '8px' }}>
                  {(['PNG', 'JPEG', 'SVG', 'PDF'] as ExportFormat[]).map(fmt => (
                    <button
                      key={fmt}
                      onClick={() => { setExportFormat(fmt); doExport(fmt) }}
                      style={{
                        width: '100%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '8px 12px',
                        fontSize: '14px',
                        color: 'var(--color-text-secondary)',
                        borderRadius: '8px',
                        border: 'none',
                        cursor: 'pointer',
                        backgroundColor: 'transparent',
                        transition: 'background-color 0.15s',
                      }}
                      onMouseEnter={e => (e.currentTarget.style.backgroundColor = 'var(--color-bg-elevated)')}
                      onMouseLeave={e => (e.currentTarget.style.backgroundColor = 'transparent')}
                    >
                      <span>{fmt}</span>
                      {exportFormat === fmt && (
                        <span style={{ width: 6, height: 6, borderRadius: '50%', backgroundColor: '#60a5fa', flexShrink: 0 }} />
                      )}
                    </button>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      {error && <p style={{ fontSize: 12, color: '#f87171', paddingLeft: 4 }}>{error}</p>}

      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        onChange={onFileChange}
        className="hidden"
      />
    </div>
  )
}
