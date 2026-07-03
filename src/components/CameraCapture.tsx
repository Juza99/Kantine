import { useRef, useState, type ChangeEvent } from 'react'
import { useTranslation } from 'react-i18next'
import { Button } from './Button'

const MAX_WIDTH = 480

async function compressImage(file: File): Promise<string> {
  const bitmap = await createImageBitmap(file)
  const scale = Math.min(1, MAX_WIDTH / bitmap.width)
  const width = Math.max(1, Math.round(bitmap.width * scale))
  const height = Math.max(1, Math.round(bitmap.height * scale))

  const canvas = document.createElement('canvas')
  canvas.width = width
  canvas.height = height
  const ctx = canvas.getContext('2d')
  if (!ctx) throw new Error('Canvas 2D context unavailable')
  ctx.drawImage(bitmap, 0, 0, width, height)
  return canvas.toDataURL('image/jpeg', 0.7)
}

export function CameraCapture({ onCapture }: { onCapture: (dataUrl: string) => void }) {
  const { t } = useTranslation()
  const inputRef = useRef<HTMLInputElement>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const [busy, setBusy] = useState(false)

  async function handleFileChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0]
    if (!file) return
    setBusy(true)
    try {
      setPreview(await compressImage(file))
    } finally {
      setBusy(false)
    }
  }

  function retake() {
    setPreview(null)
    if (inputRef.current) inputRef.current.value = ''
    inputRef.current?.click()
  }

  return (
    <div className="flex w-full flex-col items-center gap-4">
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        capture="user"
        className="hidden"
        onChange={handleFileChange}
      />
      {preview ? (
        <>
          <img
            src={preview}
            alt=""
            className="w-full max-w-[240px] rounded-2xl border-[3px] border-kantine-ink shadow-[4px_4px_0_0_var(--color-kantine-ink)]"
          />
          <div className="flex w-full gap-3">
            <Button variant="secondary" onClick={retake}>
              {t('answering.retake')}
            </Button>
            <Button variant="primary" onClick={() => onCapture(preview)}>
              {t('answering.usePhoto')}
            </Button>
          </div>
        </>
      ) : (
        <Button onClick={() => inputRef.current?.click()} disabled={busy}>
          {busy ? t('answering.processing') : t('answering.takePhoto')}
        </Button>
      )}
    </div>
  )
}
