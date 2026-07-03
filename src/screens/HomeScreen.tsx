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
        <h1 className="text-5xl font-black text-white">{t('home.title')}</h1>
        <p className="mt-3 text-lg text-white/60">{t('home.subtitle')}</p>
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
