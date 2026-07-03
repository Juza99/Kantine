import { useTranslation } from 'react-i18next'
import { Screen } from '../components/Screen'
import { Button } from '../components/Button'
import { useGameStore } from '../store/gameStore'

export function HomeScreen() {
  const { t } = useTranslation()
  const startCreateFlow = useGameStore((s) => s.startCreateFlow)
  const startJoinFlow = useGameStore((s) => s.startJoinFlow)

  return (
    <Screen>
      <div>
        <h1 className="font-display text-6xl text-kantine-gold [-webkit-text-stroke:2.5px_var(--color-kantine-ink)] [paint-order:stroke_fill]">
          {t('home.title')}
        </h1>
        <p className="mt-4 text-lg font-semibold text-kantine-cream/80">{t('home.subtitle')}</p>
      </div>
      <div className="flex w-full flex-col gap-4">
        <Button variant="primary" onClick={startCreateFlow}>
          {t('home.create')}
        </Button>
        <Button variant="secondary" onClick={startJoinFlow}>
          {t('home.join')}
        </Button>
      </div>
    </Screen>
  )
}
