import { useTranslation } from 'react-i18next'
import { Screen } from '../components/Screen'

export function StartingScreen() {
  const { t } = useTranslation()

  return (
    <Screen>
      <div className="flex flex-col items-center gap-5">
        <div className="h-16 w-16 animate-spin rounded-full border-4 border-kantine-cream/25 border-t-kantine-gold" />
        <h1 className="font-display text-4xl text-kantine-gold [-webkit-text-stroke:1.5px_var(--color-kantine-ink)] [paint-order:stroke_fill]">
          {t('starting.title')}
        </h1>
        <p className="font-semibold text-kantine-cream/70">{t('starting.subtitle')}</p>
      </div>
    </Screen>
  )
}
