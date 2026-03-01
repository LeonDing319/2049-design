'use client'

import { useCallback, useRef, useState } from 'react'
import { Upload } from 'lucide-react'
import { useImageUpload } from '@/hooks/useImageUpload'
import { useTranslations } from 'next-intl'

interface ImageUploaderProps {
  hasImage: boolean
}

export function ImageUploader({ hasImage }: ImageUploaderProps) {
  const { handleUpload } = useImageUpload()
  const [isDragging, setIsDragging] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const t = useTranslations('upload')

  const onFile = useCallback(async (file: File) => {
    setError(null)
    try {
      await handleUpload(file)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Upload failed')
    }
  }, [handleUpload])

  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    const file = e.dataTransfer.files[0]
    if (file) onFile(file)
  }, [onFile])

  const onDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }, [])

  const onDragLeave = useCallback(() => setIsDragging(false), [])

  const onClick = useCallback(() => fileInputRef.current?.click(), [])

  const onFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) onFile(file)
  }, [onFile])

  if (hasImage) {
    return (
      <button
        onClick={onClick}
        className="w-full px-3 py-2 text-sm text-neutral-400 bg-neutral-800 border border-neutral-700 rounded-lg hover:bg-neutral-700 transition-colors"
      >
        {t('title')}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          onChange={onFileChange}
          className="hidden"
        />
      </button>
    )
  }

  return (
    <div
      onDrop={onDrop}
      onDragOver={onDragOver}
      onDragLeave={onDragLeave}
      onClick={onClick}
      className={`flex flex-col items-center justify-center gap-3 p-8 border-2 border-dashed rounded-xl cursor-pointer transition-colors ${
        isDragging
          ? 'border-blue-500 bg-blue-500/5'
          : 'border-neutral-700 hover:border-neutral-500'
      }`}
    >
      <Upload className="w-8 h-8 text-neutral-500" />
      <p className="text-sm text-neutral-400 text-center">{t('dragHint')}</p>
      <p className="text-xs text-neutral-500">{t('formats')}</p>
      {error && <p className="text-xs text-red-400">{error}</p>}
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
