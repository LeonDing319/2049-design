'use client'

import { useState, useCallback } from 'react'
import { useAppState } from '@/hooks/useEffectParams'
import { ImageUploader } from '@/components/upload/ImageUploader'
import { Slider } from '@/components/controls/Slider'
import { Select } from '@/components/controls/Select'
import { Toggle } from '@/components/controls/Toggle'
import { ColorPicker } from '@/components/controls/ColorPicker'
import { PresetPicker } from '@/components/controls/PresetPicker'
import { GLITCH_PRESETS, DEFAULT_GLITCH_PARAMS } from '@/presets/glitch-presets'
import { ASCII_PRESETS, DEFAULT_ASCII_PARAMS } from '@/presets/ascii-presets'
import { GlitchParams, AsciiParams } from '@/types'
import { useTranslations } from 'next-intl'
import { exportPNG, exportJPEG, exportSVG, exportPDF } from '@/engines/exporter'
import { ChevronDown } from 'lucide-react'

type ExportFormat = 'PNG' | 'JPEG' | 'SVG' | 'PDF'
type ExportScale = '0.5x' | '1x' | '2x' | '3x' | '4x'

const SCALE_VALUES: Record<ExportScale, number> = {
  '0.5x': 0.5, '1x': 1, '2x': 2, '3x': 3, '4x': 4,
}

interface SidebarProps {
  canvasRef: React.RefObject<HTMLCanvasElement | null>
}

export function Sidebar({ canvasRef }: SidebarProps) {
  const { state, dispatch } = useAppState()
  const [activePresetId, setActivePresetId] = useState<string>(GLITCH_PRESETS[0].id)
  const [exportFormat, setExportFormat] = useState<ExportFormat>('PNG')
  const [exportScale, setExportScale] = useState<ExportScale>('1x')
  const [exporting, setExporting] = useState(false)
  const t = useTranslations('params')
  const tExport = useTranslations('export')
  const hasImage = !!state.image
  const disabled = !hasImage

  const handleExport = useCallback(async () => {
    if (!canvasRef.current || !hasImage) return
    setExporting(true)
    const scale = SCALE_VALUES[exportScale]
    const filename = '2049-design-export'
    const canvas = canvasRef.current
    switch (exportFormat) {
      case 'PNG': await exportPNG(canvas, filename, scale); break
      case 'JPEG': await exportJPEG(canvas, filename, scale); break
      case 'SVG': await exportSVG(canvas, filename, scale); break
      case 'PDF': await exportPDF(canvas, filename, scale); break
    }
    setExporting(false)
  }, [canvasRef, hasImage, exportFormat, exportScale])

  const setGlitch = (key: keyof GlitchParams, value: GlitchParams[keyof GlitchParams]) => {
    dispatch({ type: 'SET_GLITCH_PARAMS', payload: { [key]: value } })
    setActivePresetId('')
  }

  const setAscii = (key: keyof AsciiParams, value: AsciiParams[keyof AsciiParams]) => {
    dispatch({ type: 'SET_ASCII_PARAMS', payload: { [key]: value } })
    setActivePresetId('')
  }

  return (
    <aside className="w-80 h-full border-l border-neutral-800 flex flex-col" style={{ backgroundColor: '#2C2C2C' }}>
      <div className="flex-1 overflow-y-auto p-4 space-y-5">
        <ImageUploader hasImage={hasImage} />

        {state.activeEffect === 'glitch' ? (
          <>
            <PresetPicker
              label={t('presets')}
              presets={GLITCH_PRESETS}
              activePresetId={activePresetId}
              onSelect={(params, id) => {
                if (activePresetId === id) {
                  dispatch({ type: 'SET_GLITCH_PRESET', payload: DEFAULT_GLITCH_PARAMS })
                  setActivePresetId('')
                } else {
                  dispatch({ type: 'SET_GLITCH_PRESET', payload: params })
                  setActivePresetId(id)
                }
              }}
              locale={state.locale}
              disabled={disabled}
            />

            <div className="space-y-3">
              <Slider label={t('stripeDensity')} value={state.glitchParams.stripeDensity} min={1} max={100} onChange={(v) => setGlitch('stripeDensity', v)} disabled={disabled} />
              <Slider label={t('displacement')} value={state.glitchParams.displacement} min={0} max={100} onChange={(v) => setGlitch('displacement', v)} disabled={disabled} />
              <Slider label={t('rgbSplit')} value={state.glitchParams.rgbSplit} min={0} max={50} onChange={(v) => setGlitch('rgbSplit', v)} disabled={disabled} />

              <Slider
                label={t('randomSeed')}
                value={state.glitchParams.randomSeed}
                min={0}
                max={9999}
                onChange={(v) => setGlitch('randomSeed', v)}
                disabled={disabled}
                suffix={
                  <button
                    onClick={() => setGlitch('randomSeed', Math.floor(Math.random() * 10000))}
                    disabled={disabled}
                    className="px-2 py-0.5 text-xs text-neutral-300 bg-neutral-700 rounded hover:bg-neutral-600 disabled:opacity-40 disabled:cursor-not-allowed whitespace-nowrap"
                  >
                    {t('randomize')}
                  </button>
                }
              />

              <Toggle label={t('animation')} checked={state.glitchParams.animation} onChange={(v) => setGlitch('animation', v)} disabled={disabled} />
              {state.glitchParams.animation && (
                <Slider label={t('animationSpeed')} value={state.glitchParams.animationSpeed} min={1} max={10} onChange={(v) => setGlitch('animationSpeed', v)} disabled={disabled} />
              )}
            </div>
          </>
        ) : (
          <>
            <PresetPicker
              label={t('presets')}
              presets={ASCII_PRESETS}
              activePresetId={activePresetId}
              onSelect={(params, id) => {
                if (activePresetId === id) {
                  dispatch({ type: 'SET_ASCII_PRESET', payload: DEFAULT_ASCII_PARAMS })
                  setActivePresetId('')
                } else {
                  dispatch({ type: 'SET_ASCII_PRESET', payload: params })
                  setActivePresetId(id)
                }
              }}
              locale={state.locale}
              disabled={disabled}
            />

            <div className="space-y-3">
              <Slider label={t('charDensity')} value={state.asciiParams.charDensity} min={1} max={100} onChange={(v) => setAscii('charDensity', v)} disabled={disabled} />

              <Select
                label={t('charSet')}
                value={state.asciiParams.charSet}
                options={[
                  { value: 'standard', label: t('charSetOptions.standard') },
                  { value: 'minimal', label: t('charSetOptions.minimal') },
                  { value: 'blocks', label: t('charSetOptions.blocks') },
                  { value: 'custom', label: t('charSetOptions.custom') },
                ]}
                onChange={(v) => setAscii('charSet', v)}
                disabled={disabled}
              />

              <Slider label={t('fontSize')} value={state.asciiParams.fontSize} min={4} max={24} onChange={(v) => setAscii('fontSize', v)} disabled={disabled} />

              <Select
                label={t('colorMode')}
                value={state.asciiParams.colorMode}
                options={[
                  { value: 'bw', label: t('colorModeOptions.bw') },
                  { value: 'color', label: t('colorModeOptions.color') },
                  { value: 'mono', label: t('colorModeOptions.mono') },
                ]}
                onChange={(v) => setAscii('colorMode', v)}
                disabled={disabled}
              />

              {state.asciiParams.colorMode === 'mono' && (
                <ColorPicker label={t('colorMode')} value={state.asciiParams.monoColor || '#00FF00'} onChange={(v) => setAscii('monoColor', v)} disabled={disabled} />
              )}

              <ColorPicker label={t('bgColor')} value={state.asciiParams.bgColor} onChange={(v) => setAscii('bgColor', v)} disabled={disabled} />

              <Toggle label={t('invert')} checked={state.asciiParams.invert} onChange={(v) => setAscii('invert', v)} disabled={disabled} />
            </div>
          </>
        )}
      </div>

      <div className="p-4 border-t border-neutral-800 space-y-3">
        <h3 className="text-sm font-semibold text-neutral-100">{tExport('title')}</h3>

        <div className="flex items-center gap-2">
          {/* Scale selector */}
          <div className="relative">
            <select
              value={exportScale}
              onChange={(e) => setExportScale(e.target.value as ExportScale)}
              disabled={disabled}
              className="appearance-none bg-neutral-700 text-neutral-200 text-xs font-medium pl-3 pr-7 py-1.5 rounded-md border-none outline-none cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {Object.keys(SCALE_VALUES).map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
            <ChevronDown className="absolute right-1.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-neutral-400 pointer-events-none" />
          </div>

          {/* Format selector */}
          <div className="relative flex-1">
            <select
              value={exportFormat}
              onChange={(e) => setExportFormat(e.target.value as ExportFormat)}
              disabled={disabled}
              className="appearance-none w-full bg-neutral-700 text-neutral-200 text-xs font-medium pl-3 pr-7 py-1.5 rounded-md border-none outline-none cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <option value="PNG">PNG</option>
              <option value="JPEG">JPEG</option>
              <option value="SVG">SVG</option>
              <option value="PDF">PDF</option>
            </select>
            <ChevronDown className="absolute right-1.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-neutral-400 pointer-events-none" />
          </div>
        </div>

        <button
          onClick={handleExport}
          disabled={disabled || exporting}
          className="w-full py-2 text-sm font-medium text-neutral-200 bg-neutral-700 rounded-lg hover:bg-neutral-600 transition-colors disabled:opacity-40 disabled:cursor-not-allowed border border-neutral-600"
        >
          {exporting ? tExport('processing') : tExport('button')}
        </button>
      </div>
    </aside>
  )
}
