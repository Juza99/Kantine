import { useTranslation } from 'react-i18next'
import { Screen } from '../components/Screen'

export function StartingScreen() {
  const { t } = useTranslation()

  return (
    <Screen>
      <div className="flex flex-col items-center gap-4">
        <div className="h-16 w-16 animate-spin rounded-full border-4 border-white/20 border-t-party-400" />
        <h1 className="text-3xl font-black text-white">{t('starting.title')}</h1>
        <p className="text-white/60">{t('starting.subtitle')}</p>
      </div>
    </Screen>
  )
}
