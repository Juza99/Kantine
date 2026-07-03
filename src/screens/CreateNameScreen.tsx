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
        <h1 className="text-3xl font-black text-white">{t('home.create')}</h1>
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
        {error && <p className="text-sm font-semibold text-red-400">{error}</p>}
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
