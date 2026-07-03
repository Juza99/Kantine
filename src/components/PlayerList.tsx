import { useTranslation } from 'react-i18next'
import type { Player } from '../types/room'

type PlayerListProps = {
  players: Player[]
  hostId: string | null
  currentPlayerId: string | null
}

export function PlayerList({ players, hostId, currentPlayerId }: PlayerListProps) {
  const { t } = useTranslation()

  return (
    <ul className="flex w-full flex-col gap-2.5">
      {players.map((player) => (
        <li
          key={player.id}
          className="flex items-center justify-between rounded-2xl border-[3px] border-kantine-ink bg-kantine-cream px-5 py-4 text-lg shadow-[3px_3px_0_0_var(--color-kantine-ink)]"
        >
          <span className="font-bold text-kantine-ink">
            {player.name}
            {player.id === currentPlayerId && (
              <span className="ml-2 font-medium text-kantine-ink/50">{t('lobby.you')}</span>
            )}
          </span>
          {player.id === hostId && (
            <span className="rounded-full border-2 border-kantine-ink bg-kantine-coral px-3 py-1 text-xs font-bold tracking-wide text-kantine-cream uppercase">
              {t('lobby.host')}
            </span>
          )}
        </li>
      ))}
    </ul>
  )
}
