import { useTranslation } from 'react-i18next'
import { Screen } from '../components/Screen'
import { Button } from '../components/Button'
import { useGameStore } from '../store/gameStore'
import { sendNextRound } from '../hooks/useRoomConnection'
import type { LocalizedText } from '../types/room'

function useLocalizedText() {
  const { i18n } = useTranslation()
  const lang = i18n.resolvedLanguage === 'en' ? 'en' : 'nl'
  return (text: LocalizedText) => text[lang]
}

export function RevealScreen() {
  const { t } = useTranslation()
  const localize = useLocalizedText()

  const result = useGameStore((s) => s.roundResult)
  const scores = useGameStore((s) => s.scores)
  const roundIndex = useGameStore((s) => s.roundIndex)
  const totalRounds = useGameStore((s) => s.totalRounds)
  const playerId = useGameStore((s) => s.playerId)
  const hostId = useGameStore((s) => s.hostId)

  if (!result) return null

  const isHost = Boolean(playerId) && playerId === hostId
  const isLastRound = roundIndex >= totalRounds

  return (
    <Screen>
      <p className="text-sm font-bold tracking-wide text-kantine-cream/60 uppercase">
        {t('answering.roundLabel', { current: roundIndex, total: totalRounds })}
      </p>
      <h1 className="font-display text-2xl text-kantine-cream">{localize(result.prompt)}</h1>

      {result.type === 'vote' && (
        <div className="flex w-full flex-col gap-2">
          {[...result.tally]
            .sort((a, b) => b.votes - a.votes)
            .map(({ player, votes }) => (
              <div
                key={player.id}
                className={`flex items-center justify-between rounded-2xl border-[3px] border-kantine-ink px-5 py-3 text-lg font-bold shadow-[3px_3px_0_0_var(--color-kantine-ink)] ${
                  result.winnerIds.includes(player.id)
                    ? 'bg-kantine-gold text-kantine-ink'
                    : 'bg-kantine-cream text-kantine-ink'
                }`}
              >
                <span>
                  {result.winnerIds.includes(player.id) && '👑 '}
                  {player.name}
                </span>
                <span>{t('reveal.votes', { count: votes })}</span>
              </div>
            ))}
        </div>
      )}

      {result.type === 'guess' && (
        <div className="flex w-full flex-col gap-3">
          <div className="rounded-2xl border-[3px] border-kantine-ink bg-kantine-gold px-5 py-3 text-center text-lg font-bold text-kantine-ink shadow-[3px_3px_0_0_var(--color-kantine-ink)]">
            {result.subject.name}: {localize(result.options[result.correctIndex])}
          </div>
          <div className="flex flex-col gap-2">
            {result.guesses.map(({ player, correct }) => (
              <div
                key={player.id}
                className="flex items-center justify-between rounded-2xl border-[3px] border-kantine-ink bg-kantine-cream px-5 py-3 text-lg font-bold text-kantine-ink shadow-[3px_3px_0_0_var(--color-kantine-ink)]"
              >
                <span>{player.name}</span>
                <span>{correct ? '✅' : '❌'}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {result.type === 'photo' && (
        <div className="grid w-full grid-cols-2 gap-3">
          {result.photos.map(({ player, photoDataUrl }) => (
            <div key={player.id} className="flex flex-col items-center gap-1">
              <img
                src={photoDataUrl}
                alt={player.name}
                className="aspect-square w-full rounded-2xl border-[3px] border-kantine-ink object-cover shadow-[3px_3px_0_0_var(--color-kantine-ink)]"
              />
              <span className="text-sm font-bold text-kantine-cream">{player.name}</span>
            </div>
          ))}
        </div>
      )}

      {scores && (
        <div className="flex w-full flex-col gap-1.5 text-sm">
          {scores.map((entry, index) => (
            <div key={entry.playerId} className="flex justify-between text-kantine-cream/70">
              <span>
                {index + 1}. {entry.name}
              </span>
              <span className="font-bold">{entry.score}</span>
            </div>
          ))}
        </div>
      )}

      {isHost ? (
        <Button onClick={sendNextRound}>
          {isLastRound ? t('reveal.viewFinalScore') : t('reveal.nextRound')}
        </Button>
      ) : (
        <p className="text-sm font-semibold text-kantine-cream/70">{t('reveal.waitingForHost')}</p>
      )}
    </Screen>
  )
}
