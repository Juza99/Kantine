import { useState, type FormEvent } from 'react'
import { useTranslation } from 'react-i18next'
import { Screen } from '../components/Screen'
import { Button } from '../components/Button'
import { TextField } from '../components/TextField'
import { useGameStore } from '../store/gameStore'
import { isValidRoomCode, normalizeRoomCode } from '../lib/room-code'

export function JoinScreen() {
  const { t } = useTranslation()
  const [roomCode, setRoomCode] = useState('')
  const [name, setName] = useState('')
  const [error, setError] = useState<string | null>(null)
  const joinGame = useGameStore((s) => s.joinGame)
  const goHome = useGameStore((s) => s.goHome)

  function handleSubmit(event: FormEvent) {
    event.preventDefault()
    const trimmedName = name.trim()
    const normalizedCode = normalizeRoomCode(roomCode)

    if (!isValidRoomCode(normalizedCode)) {
      setError(t('errors.roomCodeRequired'))
      return
    }
    if (!trimmedName) {
      setError(t('errors.nameRequired'))
      return
    }
    joinGame(normalizedCode, trimmedName)
  }

  return (
    <Screen>
      <form onSubmit={handleSubmit} className="flex w-full flex-col gap-6">
        <h1 className="font-display text-4xl text-kantine-gold [-webkit-text-stroke:1.5px_var(--color-kantine-ink)] [paint-order:stroke_fill]">
          {t('join.title')}
        </h1>
        <TextField
          id="join-code"
          label={t('join.roomCodeLabel')}
          placeholder={t('join.roomCodePlaceholder')}
          value={roomCode}
          onChange={(e) => {
            setRoomCode(e.target.value.toUpperCase())
            setError(null)
          }}
          maxLength={4}
          autoCapitalize="characters"
          autoFocus
          className="text-center text-2xl font-black tracking-[0.3em] uppercase"
        />
        <TextField
          id="join-name"
          label={t('join.nameLabel')}
          placeholder={t('join.namePlaceholder')}
          value={name}
          onChange={(e) => {
            setName(e.target.value)
            setError(null)
          }}
          maxLength={24}
        />
        {error && (
          <p className="rounded-xl border-2 border-kantine-ink bg-kantine-coral px-4 py-2 text-sm font-bold text-kantine-cream">
            {error}
          </p>
        )}
        <div className="flex flex-col gap-3">
          <Button type="submit">{t('join.submit')}</Button>
          <Button variant="ghost" type="button" onClick={goHome}>
            {t('join.back')}
          </Button>
        </div>
      </form>
    </Screen>
  )
}
