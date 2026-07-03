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
    <ul className="flex w-full flex-col gap-2">
      {players.map((player) => (
        <li
          key={player.id}
          className="flex items-center justify-between rounded-2xl bg-white/5 px-5 py-4 text-lg"
        >
          <span className="font-semibold text-white">
            {player.name}
            {player.id === currentPlayerId && (
              <span className="ml-2 font-normal text-white/50">{t('lobby.you')}</span>
            )}
          </span>
          {player.id === hostId && (
            <span className="rounded-full bg-party-500/20 px-3 py-1 text-xs font-bold tracking-wide text-party-300 uppercase">
              {t('lobby.host')}
            </span>
          )}
        </li>
      ))}
    </ul>
  )
}
