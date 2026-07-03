import { useTranslation } from 'react-i18next'
import { Screen } from '../components/Screen'
import { Button } from '../components/Button'
import { RoomCodeDisplay } from '../components/RoomCodeDisplay'
import { PlayerList } from '../components/PlayerList'
import { useGameStore } from '../store/gameStore'
import { useRoomConnection } from '../hooks/useRoomConnection'
import { MIN_PLAYERS_TO_START } from '../types/room'

export function LobbyScreen() {
  const { t } = useTranslation()
  const { sendStart } = useRoomConnection()

  const roomCode = useGameStore((s) => s.roomCode)
  const players = useGameStore((s) => s.players)
  const hostId = useGameStore((s) => s.hostId)
  const playerId = useGameStore((s) => s.playerId)
  const errorKey = useGameStore((s) => s.errorKey)
  const goHome = useGameStore((s) => s.goHome)

  const isHost = Boolean(playerId) && playerId === hostId
  const canStart = players.length >= MIN_PLAYERS_TO_START

  if (errorKey) {
    return (
      <Screen>
        <p className="text-lg font-semibold text-red-400">{t(`errors.${errorKey}`)}</p>
        <Button onClick={goHome}>{t('join.back')}</Button>
      </Screen>
    )
  }

  return (
    <Screen>
      {roomCode && (
        <div className="flex flex-col items-center gap-2">
          <RoomCodeDisplay code={roomCode} />
          <p className="text-sm text-white/50">{t('lobby.roomCodeHint')}</p>
        </div>
      )}

      <div className="flex w-full flex-col gap-3">
        <h2 className="text-left text-sm font-bold tracking-wide text-white/50 uppercase">
          {t('lobby.playersTitle')} · {t('lobby.playersCount', { count: players.length })}
        </h2>
        <PlayerList players={players} hostId={hostId} currentPlayerId={playerId} />
      </div>

      <div className="flex w-full flex-col gap-3">
        {isHost ? (
          <>
            <Button onClick={sendStart} disabled={!canStart}>
              {t('lobby.start')}
            </Button>
            {!canStart && <p className="text-sm text-white/50">{t('lobby.minPlayersHint')}</p>}
          </>
        ) : (
          <p className="text-sm text-white/50">{t('lobby.waitingForHost')}</p>
        )}
      </div>
    </Screen>
  )
}
