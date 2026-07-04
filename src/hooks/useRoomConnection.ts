import { useEffect } from 'react'
import PartySocket from 'partysocket'
import { useGameStore } from '../store/gameStore'
import { PARTYKIT_HOST } from '../lib/party-config'
import type { ClientMessage, ErrorCode, ServerMessage } from '../types/room'

export function useRoomConnection() {
  const roomCode = useGameStore((s) => s.roomCode)
  const playerName = useGameStore((s) => s.playerName)

  useEffect(() => {
    if (!roomCode || !playerName) return

    console.log('Connecting to PartyKit host:', PARTYKIT_HOST)
    const socket = new PartySocket({
      host: PARTYKIT_HOST,
      room: roomCode.toLowerCase(),
    })
    useGameStore.getState().setSocket(socket)

    socket.addEventListener('open', () => {
      useGameStore.getState().setConnectionStatus('connected')
      useGameStore.getState().setPlayerId(socket.id)
      const join: ClientMessage = { type: 'join', name: playerName }
      socket.send(JSON.stringify(join))
    })

    socket.addEventListener('message', (event: MessageEvent) => {
      let message: ServerMessage
      try {
        message = JSON.parse(event.data)
      } catch {
        return
      }

      if (message.type === 'state') {
        useGameStore.getState().applyServerState(message.players, message.hostId, message.phase)
      } else if (message.type === 'error') {
        useGameStore.getState().setError(errorCodeToKey(message.code))
      }
    })

    socket.addEventListener('close', () => {
      useGameStore.getState().setConnectionStatus('idle')
    })

    socket.addEventListener('error', () => {
      useGameStore.getState().setConnectionStatus('error')
      useGameStore.getState().setError('connectionLost')
    })

    return () => {
      socket.close()
      useGameStore.getState().setSocket(null)
    }
  }, [roomCode, playerName])
}

function errorCodeToKey(code: ErrorCode) {
  switch (code) {
    case 'ROOM_FULL':
      return 'roomFull'
    case 'NAME_TAKEN':
      return 'nameTaken'
    case 'INVALID_NAME':
      return 'nameRequired'
    default:
      return 'generic'
  }
}
