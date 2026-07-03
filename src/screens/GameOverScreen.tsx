import { useTranslation } from 'react-i18next'
import { Screen } from '../components/Screen'
import { Button } from '../components/Button'
import { useGameStore } from '../store/gameStore'

export function GameOverScreen() {
  const { t } = useTranslation()
  const scores = useGameStore((s) => s.scores)
  const goHome = useGameStore((s) => s.goHome)

  const topScore = scores?.[0]?.score ?? 0

  return (
    <Screen>
      <h1 className="font-display text-4xl text-kantine-gold [-webkit-text-stroke:1.5px_var(--color-kantine-ink)] [paint-order:stroke_fill]">
        {t('gameover.title')}
      </h1>

      <div className="flex w-full flex-col gap-2.5">
        {scores?.map((entry, index) => (
          <div
            key={entry.playerId}
            className={`flex items-center justify-between rounded-2xl border-[3px] border-kantine-ink px-5 py-4 text-lg font-bold shadow-[3px_3px_0_0_var(--color-kantine-ink)] ${
              entry.score === topScore
                ? 'bg-kantine-gold text-kantine-ink'
                : 'bg-kantine-cream text-kantine-ink'
            }`}
          >
            <span>
              {entry.score === topScore && '🏆 '}
              {index + 1}. {entry.name}
            </span>
            <span>{entry.score}</span>
          </div>
        ))}
      </div>

      <Button onClick={goHome}>{t('gameover.backToHome')}</Button>
    </Screen>
  )
}
