import { useState, type FormEvent } from 'react'
import { useTranslation } from 'react-i18next'
import { Screen } from '../components/Screen'
import { Button } from '../components/Button'
import { TextField } from '../components/TextField'
import { useGameStore } from '../store/gameStore'

export function CreateNameScreen() {
  const { t } = useTranslation()
  const [name, setName] = useState('')
  const [error, setError] = useState<string | null>(null)
  const createGame = useGameStore((s) => s.createGame)
  const goHome = useGameStore((s) => s.goHome)

  function handleSubmit(event: FormEvent) {
    event.preventDefault()
    const trimmed = name.trim()
    if (!trimmed) {
      setError(t('errors.nameRequired'))
      return
    }
    createGame(trimmed)
  }

  return (
    <Screen>
      <form onSubmit={handleSubmit} className="flex w-full flex-col gap-6">
        <h1 className="font-display text-4xl text-kantine-gold [-webkit-text-stroke:1.5px_var(--color-kantine-ink)] [paint-order:stroke_fill]">
          {t('home.create')}
        </h1>
        <TextField
          id="create-name"
          label={t('create.nameLabel')}
          placeholder={t('create.namePlaceholder')}
          value={name}
          onChange={(e) => {
            setName(e.target.value)
            setError(null)
          }}
          maxLength={24}
          autoFocus
        />
        {error && (
          <p className="rounded-xl border-2 border-kantine-ink bg-kantine-coral px-4 py-2 text-sm font-bold text-kantine-cream">
            {error}
          </p>
        )}
        <div className="flex flex-col gap-3">
          <Button type="submit">{t('create.submit')}</Button>
          <Button variant="ghost" type="button" onClick={goHome}>
            {t('create.back')}
          </Button>
        </div>
      </form>
    </Screen>
  )
}
